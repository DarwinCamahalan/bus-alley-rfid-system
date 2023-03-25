#include <Arduino.h>
#include <WiFiManager.h>
#include "time.h"
#include <Servo.h>
#include <Wire.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <SPI.h>
#include <MFRC522.h>
#include "FS.h"
#include "SD.h"
#include <LiquidCrystal_I2C.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "BluetoothSerial.h"
#include "Adafruit_Thermal.h"
#include <ArduinoJson.h>
#include <ESP32Time.h>

const char *ntpServer = "asia.pool.ntp.org";
const long gmtOffset_sec = 28800;
const int daylightOffset_sec = 0;
bool connected;
bool signupOK = false;
bool authenticated = false;
bool online = true;
String jsonData;

ESP32Time rtc(gmtOffset_sec);
WiFiManager wm;
MFRC522 mfrc522(16, 17);
LiquidCrystal_I2C lcd(0x27, 20, 4);
Servo servo;
BluetoothSerial SerialBT;
Adafruit_Thermal printer(&SerialBT);
uint8_t address[6] = {0x86, 0x67, 0x7A, 0x76, 0x6D, 0xAA};
String name = "MTP-II_6DAA";
const char *pin = "0000";
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseJson json;
FirebaseConfig config;
File file;
File csvFile;

TaskHandle_t countTaskHandle;

void openTollGate(void *pvParameters)
{
  servo.attach(15);

  for (int i = 0; i <= 90; i++)
  {
    servo.write(i);
    vTaskDelay(50 / portTICK_PERIOD_MS);
  }

  vTaskDelete(NULL);
}

void closeTollGate()
{
  int pos;
  int delayCounter = 150;
  lcd.clear();
  lcd.setCursor(3, 1);
  lcd.print("CLOSING GATE...");
  for (pos = 90; pos >= 0; pos -= 1)
  {
    if (pos == 35)
    {
      delayCounter = 50;
    }
    servo.write(pos);
    delay(delayCounter);
  }
  servo.detach();
}

const unsigned long interval = 1000;
const int numCounts = 20;

void countTask(void *pvParameters)
{
  int count = numCounts;
  int state = 0;

  while (state < numCounts)
  {
    lcd.clear();
    lcd.setCursor(6, 0);
    lcd.print("OFFLINE");
    lcd.setCursor(1, 2);
    lcd.print("RECONNECTING IN " + String(count));
    count--;
    state++;
    vTaskDelay(pdMS_TO_TICKS(interval));
  }
  vTaskDelete(NULL);
}

void writeConnectionStatus(String data)
{
  File file = SD.open("/online_offline_indicator.txt", FILE_WRITE);
  if (file)
  {
    file.println(data);
    file.close();
  }
  else
  {
    Serial.println("SD CARD FAILED");
  }
}

String readConnectionStatus()
{
  String data = "";
  File file = SD.open("/online_offline_indicator.txt", FILE_READ);
  if (file)
  {
    while (file.available())
    {
      data += (char)file.read();
    }
    file.close();
  }
  else
  {
    Serial.println("Error opening file.");
  }
  return data;
}

void setup()
{
  Serial.begin(115200);

  pinMode(13, OUTPUT);

  lcd.init();
  lcd.backlight();

  SPI.begin();
  mfrc522.PCD_Init();

  SD.begin(5);

  String connectionStatus = readConnectionStatus();
  connectionStatus.trim();

  if (connectionStatus == "offline")
  {
    xTaskCreate(countTask, "countTask", 2048, NULL, 1, NULL);
  }
  else
  {
    lcd.clear();
    lcd.setCursor(3, 1);
    lcd.print("PLEASE WAIT...");
  }

  wm.setConfigPortalTimeout(20);
  wm.setConnectTimeout(20);

  if (!wm.autoConnect("TOLL GATE - RFID DEVICE"))
  {
    Serial.println("NETWORK FAILED");

    csvFile = SD.open("/departed_bus_record.csv", FILE_READ);

    String lastRow = "";
    while (csvFile.available())
    {
      String row = csvFile.readStringUntil('\n');
      if (row != "")
      {
        lastRow = row;
      }
    }
    csvFile.close();

    int firstComma = lastRow.indexOf(',');
    String date = lastRow.substring(0, firstComma);
    String time = lastRow.substring(firstComma + 1, lastRow.indexOf(',', firstComma + 1));

    int year = date.substring(6).toInt();
    int month = date.substring(0, 2).toInt();
    int day = date.substring(3, 5).toInt();
    int hour = time.substring(0, 2).toInt();
    int minute = time.substring(3, 5).toInt();
    int second = time.substring(6, 8).toInt();
    bool isPM = (time.substring(9, 11) == "PM");

    if (isPM && hour < 12)
    {
      hour += 12;
    }
    else if (!isPM && hour == 12)
    {
      hour = 0;
    }

    rtc.setTime(hour, minute, second, day, month, year);

    writeConnectionStatus("offline");
    online = false;
  }
  else
  {
    Serial.println("CONNECTED TO NETWORK");
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    writeConnectionStatus("online");
    online = true;
  }

  Serial.println(online);

  if (online == true)
  {
    config.api_key = "AIzaSyAqRt-Q3UQTtvnhi6wvTznXSbHF36sNWGo";
    config.database_url = "https://rfid-database-abd32-default-rtdb.asia-southeast1.firebasedatabase.app/";
    if (Firebase.signUp(&config, &auth, "", ""))
    {
      Serial.println("CONNECTED TO FIREBASE");
      signupOK = true;
    }
    config.token_status_callback = tokenStatusCallback;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  }

  lcd.clear();
  if (online == true)
  {
    lcd.setCursor(2, 1);
    lcd.print("PLACE RFID CARD");
  }
  else
  {
    lcd.setCursor(4, 0);
    lcd.print("OFFLINE MODE");
    lcd.setCursor(2, 2);
    lcd.print("PLACE RFID CARD");
  }
}

// ---------------------------------------------------------------------------------------------------------------------
void loop()
{

  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }
  if (!mfrc522.PICC_ReadCardSerial())
  {
    return;
  }

  lcd.clear();
  lcd.setCursor(4, 1);
  lcd.print("CARD SCANNED");

  lcd.setCursor(1, 2);
  lcd.print("CARD ID: ");
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    lcd.print(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    lcd.print(mfrc522.uid.uidByte[i], HEX);

    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }

  if (online == true)
  {
    if (Firebase.ready() && signupOK)
    {
      if (Firebase.RTDB.getJSON(&firebaseData, "/addedCards"))
      {
        jsonData = firebaseData.jsonString();

        file = SD.open("/authenticated_cards.txt", FILE_WRITE);
        if (!file)
        {
          Serial.println("SD CARD FAILED");
          return;
        }

        DynamicJsonDocument cardID(4096);
        deserializeJson(cardID, jsonData);

        JsonObject root = cardID.as<JsonObject>();
        for (JsonPair pair : root)
        {
          String cardID = pair.key().c_str();
          file.println(cardID);
        }
        file.close();

        file = SD.open("/data.json", FILE_WRITE);
        file.println(jsonData);
        file.close();
      }
    }
  }

  file = SD.open("/authenticated_cards.txt");

  while (file.available())
  {
    String line = file.readStringUntil('\n');
    line.trim();

    if (uidString == line)
    {
      authenticated = true;
      file.close();
    }
    else
    {
      authenticated = false;
    }
  }
  file.close();

  if (authenticated == true)
  {
    lcd.clear();

    lcd.setCursor(1, 0);
    lcd.print("CARD AUTHENTICATED");

    lcd.setCursor(6, 2);
    lcd.print("SUCCESS!");

    char time[15];
    char date[15];
    if (online == true)
    {
      struct tm timeinfo;
      if (!getLocalTime(&timeinfo))
      {
        Serial.println("FAILED TO OBTAIN TIME/DATE ONLINE");
        return;
      }

      strftime(time, 15, "%I:%M:%S %p", &timeinfo);
      strftime(date, 15, "%m/%d/%Y", &timeinfo);
    }
    else
    {
      int hour = rtc.getHour();
      int minute = rtc.getMinute();
      int second = rtc.getSecond();
      int day = rtc.getDay();
      int month = rtc.getMonth();
      int year = rtc.getYear();
      String period = rtc.getAmPm(true);
      period.toUpperCase();

      sprintf(date, "%02d/%02d/%04d", month, day, year);
      sprintf(time, "%02d:%02d:%02d %s", hour, minute, second, period);
    }

    file = SD.open("/data.json");
    String data = "";
    while (file.available())
    {
      data += (char)file.read();
    }

    file.close();

    DynamicJsonDocument cardData(4096);
    deserializeJson(cardData, data);

    const char *cardID = cardData[uidString]["cardID"].as<const char *>();
    const char *busCompany = cardData[uidString]["busCompany"].as<const char *>();
    const char *plateNumber = cardData[uidString]["plateNumber"].as<const char *>();

    bool fileExists = SD.exists("/departed_bus_record.csv");
    if (!fileExists)
    {
      csvFile = SD.open("/departed_bus_record.csv", FILE_WRITE);
      if (csvFile)
      {
        csvFile.print("Date,Time,Bus Company,Plate Number,Card ID,Fee\n");
        csvFile.close();
      }
    }

    csvFile = SD.open("/departed_bus_record.csv", FILE_APPEND);
    csvFile.print(date);
    csvFile.print(",");
    csvFile.print(time);
    csvFile.print(",");
    csvFile.print(busCompany);
    csvFile.print(",");
    csvFile.print(plateNumber);
    csvFile.print(",");
    csvFile.print(cardID);
    csvFile.print(",");
    csvFile.println("50");
    csvFile.close();

    if (online == true)
    {
      json.add("cardID", cardID);
      json.add("busCompany", busCompany);
      json.add("plateNumber", plateNumber);
      json.add("fee", 50);
      json.add("date", date);
      json.add("time", time);
      Firebase.RTDB.pushJSON(&firebaseData, "departed", &json);
    }

    // OPEN TOLL GATE HERE
    xTaskCreate(openTollGate, "Open Toll Gate", 2048, NULL, 2, NULL);
    digitalWrite(13, HIGH);
    // PRINT RECEIPT
    SD.end();
    WiFi.disconnect(true);
    btStart();
    SerialBT.begin("ESP32test", true);

    SerialBT.setPin(pin);
    Serial.println("CONNECTING TO PRINTER");

    connected = SerialBT.connect(address);

    Serial.println(connected);
    if (connected)
    {
      Serial.println("CONNECTED TO PRINTER");
    }
    else
    {
      while (!SerialBT.connected(10000))
      {
        Serial.println("PRINTER FAILED");
      }
    }

    if (SerialBT.disconnect())
    {
      Serial.println("PRINTER DISCONNECTED");
    }

    SerialBT.connect();

    String ID = String(cardID);
    String BUS_COMPANY = String(busCompany);
    String PLATE_NUMBER = String(plateNumber);

    ID.toUpperCase();
    BUS_COMPANY.toUpperCase();
    PLATE_NUMBER.toUpperCase();

    if (connected)
    {
      lcd.clear();
      lcd.setCursor(1, 0);
      lcd.print("PRINTING TICKET...");

      lcd.setCursor(5, 1);
      lcd.print("THANK YOU!");

      lcd.setCursor(5, 3);
      lcd.print("FEE: 50.00");

      printer.begin();

      printer.inverseOn();
      printer.println(F(" "));
      printer.inverseOff();

      printer.setSize('S');
      printer.justify('C');
      printer.println("Farmers Market and Transportation Terminal");
      printer.boldOn();
      printer.println("Cagayan de Oro City");
      printer.boldOff();
      printer.println("");

      printer.setSize('S');
      printer.justify('C');
      printer.boldOn();
      printer.println(F("OFFICIAL RECEIPT"));
      printer.println(F(""));
      printer.boldOff();

      printer.setSize('S');
      printer.justify('R');
      printer.println("DATE: " + String(date));

      printer.justify('R');
      printer.println("TIME: " + String(time));

      printer.setSize('S');
      printer.println(F("--------------------------------"));

      printer.setLineHeight(50);
      printer.justify('L');
      printer.println("CARD ID: " + ID);

      printer.justify('L');
      printer.println("BUS COMPANY: " + BUS_COMPANY);

      printer.justify('L');
      printer.println("PLATE NUMBER: " + PLATE_NUMBER);

      printer.println(F("--------------------------------"));
      printer.setLineHeight();

      printer.justify('L');
      printer.println(F("PARKING FEE: P50.00"));
      printer.println(F(""));
      printer.println(F(""));

      printer.justify('C');
      printer.boldOn();
      printer.println(F("*** DRIVER'S COPY ***"));
      printer.boldOff();
      printer.printBarcode("      ", CODE39);

      printer.feed(1);
      printer.setDefault();
    }
    delay(2000);
    digitalWrite(13, LOW);
    closeTollGate();
    ESP.restart();
  }
  else
  {
    lcd.clear();
    lcd.setCursor(3, 1);
    lcd.print("ACCESS DENIED!");
    lcd.setCursor(2, 2);
    lcd.print("PLACE CARD AGAIN");
  }
}