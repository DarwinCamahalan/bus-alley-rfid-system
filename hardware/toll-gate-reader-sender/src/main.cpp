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

const char *ntpServer = "asia.pool.ntp.org";
const long gmtOffset_sec = 28800;
const int daylightOffset_sec = 0;
bool connected;
bool signupOK = false;
bool authenticated = false;
bool online = true;
String jsonData;

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
DynamicJsonDocument doc(4096);
File file;

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

void setup()
{
  Serial.begin(115200);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  lcd.init();
  lcd.backlight();

  lcd.clear();
  lcd.setCursor(3, 1);
  lcd.print("PLEASE WAIT...");

  bool res;
  res = wm.autoConnect("TOLL GATE - ESP32");

  if (!res)
  {
    Serial.println("NETWORK FAILED");
    lcd.clear();
    lcd.setCursor(4, 1);
    lcd.print("OFFLINE MODE");
    online = false;
  }
  else
  {
    Serial.println("CONNECTED TO NETWORK");
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

  SPI.begin();
  mfrc522.PCD_Init();

  SD.begin(5);

  lcd.clear();
  lcd.setCursor(2, 1);
  lcd.print("PLACE RFID CARD");
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

        deserializeJson(doc, jsonData);

        JsonObject root = doc.as<JsonObject>();
        for (JsonPair pair : root)
        {
          String cardID = pair.key().c_str();
          file.println(cardID);
        }
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

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
    {
      return;
    }

    char time[15];
    strftime(time, 15, "%I:%M:%S %p", &timeinfo);

    char date[15];
    strftime(date, 15, "%m/%d/%Y", &timeinfo);

    const char *cardID = doc[uidString]["cardID"];
    const char *busCompany = doc[uidString]["busCompany"];
    const char *plateNumber = doc[uidString]["plateNumber"];

    File csvFile = SD.open("/departed_bus_record.csv", FILE_APPEND);
    if (!csvFile)
    {
      Serial.println("FAILED TO WRITE DATA TO CSV");
      return;
    }

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
      printer.println("East and West Bound Terminals");
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