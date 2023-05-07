// IMPORTING LIBRARIES USING PLATFORMIO EXTENSION IN VS CODE
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

// VARIABLES FOR ULTRASONIC SENSOR, PIN NUMBERS AND CONSTANT VALUE OF SPEED OF SOUND
const int trigPin = 26;
const int echoPin = 27;
#define SOUND_SPEED 0.034
long duration;
float distanceCm;

// VARIABLES FOR USING NTP TIME SERVER IF ESP32 HAS INTERNET CONNECTIVITY (PHILIPPINE STANDARD TIME +8 GMT)
const char *ntpServer = "asia.pool.ntp.org";
const long gmtOffset_sec = 28800;
const int daylightOffset_sec = 0;

// VARIABLES FOR BOOLEAN INDICATORS IF ONLINE OF OFFLINE
bool connected;
bool signupOK = false;
bool authenticated = false;
bool online = true;
String jsonData;

// VARIABLES FOR COUNTERS FOR RECONNECTING TO WIFI WHEN OFFLINE
const unsigned long interval = 1000;
const int numCounts = 20;

// INITIALIZING OBJECT FOR ESP32TIME LIBRARY AN OFFLINE TIME COUNTER
ESP32Time rtc;

// INITIALIZING WIFI MANAGER LIBRARY FOR WIFI ACCESS POINT
WiFiManager wm;

// PINS FOR MFRC522 RFID SCANNER SDA AND RST
MFRC522 mfrc522(16, 17);

// INITIALIZING OBJECT FOR I2C LCD SCREEN 20X4 SIZE
LiquidCrystal_I2C lcd(0x27, 20, 4);

// INITIALIZING OBJECT FOR SERVO MOTOR 9 GRAMS
Servo servo;

// INITIALIZING OBJECT FOR BLUETOOTH AND FOR BLUETOOTH PRINTER
BluetoothSerial SerialBT;
Adafruit_Thermal printer(&SerialBT);
// MAC ADDRESS OF THE BLUETOOTH THERMAL PRINTER AND ITS BLUETOOTH NAME AND DEFAULT PASSWORD
uint8_t address[6] = {0x86, 0x67, 0x7A, 0x76, 0x6D, 0xAA};
String name = "MTP-II_6DAA";
const char *pin = "0000";

// INITIALIZING FIREBASE OBJECTS FOR AUTHENTICATION, JSON, ETC...
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseJson json;
FirebaseConfig config;

// INITIALIZING OBJECT FOR CRUD OPERATION FOR SD CARD MODULE FILES (.TXT/.CSV) FILES
File file;
File csvFile;

// REALTIME OPERATING SYSTEM (RTOS) OBJECT FOR COUNTER TO RECONNECT TO WIFI WHEN OFFLINE
TaskHandle_t countTaskHandle;

// FUNCTION FOR SYNCRONOUS OPENING TOLL GATE AND ROTATING SERVO MOTOR 0 TO 90 DEGREE
void openTollGate(void *pvParameters)
{
  // SUPPLYING VOLTAGE TO PIN 13 TO ACTIVATE RELAY AND TRIGGER THE THREE PHASE MAGNETIC CONTACTOR
  digitalWrite(13, HIGH);

  servo.attach(25);
  for (int i = 0; i <= 90; i++)
  {
    servo.write(i);
    // SERVO ROTATING DELAY OF 50 MILLISECONDS
    vTaskDelay(50 / portTICK_PERIOD_MS);

    if (i == 90)
    {
      // TURNING OFF RELAY AND TO TURN OFF MAGNETIC CONTACTOR ASWELL
      digitalWrite(13, LOW);
    }
  }
  // DELETING TASK IN THE BACKGROUND
  vTaskDelete(NULL);
}

// FUNCTION FOR CLOSING TOLL GATE, BLOCKING FUNCTION
void closeTollGate()
{
  int pos;

  // DISPLAYING TEXT TO 20X4 I2C LCD SCREEN
  lcd.clear();
  lcd.setCursor(3, 1);
  lcd.print("CLOSING GATE...");

  // TURNING ON RELAY IN PIN 13 AND TRIGGERING MAGNETIC CONTACTOR TO TURN ON
  digitalWrite(13, HIGH);

  for (pos = 90; pos >= 0; pos -= 1)
  {
    servo.write(pos);
    // ROTATING SERVO WITH DELAY OF 50 MILLISECONDS
    delay(50);
  }

  // TURNING OFF RELAY IN PIN 13 AND TRIGGERING MAGNETIC CONTACTOR TO TURN OFF
  digitalWrite(13, LOW);

  servo.detach();
  // delay(1000);
}

// FUNCTION FOR COUNTER FROM 20 TO 0 RECONNECTING TO WIFI, SYNCRONOUS FUNCTION
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

void closeGateCounter()
{
  int count = 30;
  int state = 0;
  while (state < 30)
  {
    lcd.clear();
    lcd.setCursor(2, 0);
    lcd.print("*** WARNING ***");
    lcd.setCursor(3, 2);
    lcd.print("CLOSING IN " + String(count));
    count--;
    state++;
    delay(1000);
  }
}

// FUNCTION FOR THE INDICATOR IF ESP32 INTERNET CONNECTION IS OFFLINE OR ONLINE
void writeConnectionStatus(String data)
{
  // WRITING "OFFLINE" OR "ONLINE" TO SD CARD MODULE
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

// FUNCTION FOR READING CONNECTION STATUS AND RETURNING OFFLINE OR ONLINE IN "DATA" VARIABLE
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
  // IDEAL BAUDRATE FOR MFRC522 RFID SCANNER AND OTHER COMPONENTS
  Serial.begin(115200);

  // SETTING PIN 13 AS OUTPUT VOLTAGE FOR RELAY MODULE
  pinMode(13, OUTPUT);

  // SETTING PINS AS OUTPUT VOLTAGE FOR ULTRASONIC SENSOR
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // TURNING OF LCD DISPLAY
  lcd.init();
  lcd.backlight();

  // INITIALIZING MFRC522 RFID SCANNER
  SPI.begin();
  mfrc522.PCD_Init();

  // INITIALIZING PIN 5 FOR SDA TO SD CARD MODULE
  SD.begin(5);

  // READING CONNECTION INDICATOR FROM SD CARD MODULE
  String connectionStatus = readConnectionStatus();
  connectionStatus.trim();

  if (connectionStatus == "offline")
  {
    // IF OFFLINE, LCD SCREEN WILL HAVE A RECONNECTION COUNTER 20 TO 0 TO CONNTECT TO WIIFI
    xTaskCreate(countTask, "countTask", 2048, NULL, 1, NULL);
  }
  else
  {
    lcd.clear();
    lcd.setCursor(3, 1);
    lcd.print("PLEASE WAIT...");
  }

  // RECONNECTION AND ACCESS TO ACCESS POINT OF ESP32 SET TO 20 SECONDS
  wm.setConfigPortalTimeout(20);
  wm.setConnectTimeout(20);

  if (!wm.autoConnect("TOLL GATE - RFID DEVICE"))
  {
    Serial.println("NETWORK FAILED");

    // // READING CSV FILE FOR THE LAST ROW OF THE DATA AND GETTING DATE AND TIME
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

    // GETTING DATE AND AND TIME IN THE LAST ROW OF DATA AND SETTING THE ESP32TIME THE CLOCK COUNTER
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

    // CONVERTING 12 HOURS TIME TO 24 HOURS TIME (MILITARY TIME)
    if (isPM && hour < 12)
    {
      hour += 12;
    }
    else if (!isPM && hour == 12)
    {
      hour = 0;
    }

    // SETTING THE DEFAULT TIME FOR THE OFFLINE TIMER USING ESP32TIME LIBRARY EXAMPLE: 15:30:24 01 JANUARY 2023
    rtc.setTime(second, minute, hour, day, month, year);

    // WRITING THE INDICATOR AS "OFFLINE" IF THIS HAPPENS
    writeConnectionStatus("offline");
    online = false;
  }
  else
  {
    // IF CONNECTED TO THE INTERNET, WIRING INIDICATOR AS "ONLINE"
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

    // SYNC TO DATABASE
    if (SD.exists("/departed_bus_record_to_sync_database.csv"))
    {
      csvFile = SD.open("/departed_bus_record_to_sync_database.csv", FILE_READ);

      // Skip header row
      csvFile.readStringUntil('\n');

      while (csvFile.available())
      {
        String line = csvFile.readStringUntil('\n');
        // Remove any extra whitespace characters
        line.trim();

        // Split the CSV line by comma delimiter
        int valuesIndex = 0;
        String values[6];
        int lastIndex = -1;
        for (int i = 0; i < line.length(); i++)
        {
          if (line.charAt(i) == ',')
          {
            values[valuesIndex++] = line.substring(lastIndex + 1, i);
            lastIndex = i;
          }
        }
        values[valuesIndex++] = line.substring(lastIndex + 1);

        // Create JSON object from the CSV values
        DynamicJsonDocument jsonDoc(4096);
        jsonDoc["cardID"] = values[4];
        jsonDoc["busCompany"] = values[2];
        jsonDoc["plateNumber"] = values[3];
        jsonDoc["fee"] = values[5].toInt();
        jsonDoc["date"] = values[0];
        jsonDoc["time"] = values[1];

        // Add JSON object to Firebase
        FirebaseJson json;
        json.add("cardID", values[4]);
        json.add("busCompany", values[2]);
        json.add("plateNumber", values[3]);
        json.add("fee", values[5].toInt());
        json.add("date", values[0]);
        json.add("time", values[1]);
        if (Firebase.RTDB.pushJSON(&firebaseData, "departed", &json))
        {
          Serial.println("Data sent to Firebase!");
          SD.remove("/departed_bus_record_to_sync_database.csv");
          csvFile.close();
        }
        else
        {
          Serial.println("Failed to send data to Firebase.");
          csvFile.close();
        }
      }
    }
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
      month = month + 1;
      int year = rtc.getYear();
      String period = rtc.getAmPm(false);

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

    if (online == false)
    {
      bool fileExists = SD.exists("/departed_bus_record_to_sync_database.csv");
      if (!fileExists)
      {
        csvFile = SD.open("/departed_bus_record_to_sync_database.csv", FILE_WRITE);
        if (csvFile)
        {
          csvFile.print("Date,Time,Bus Company,Plate Number,Card ID,Fee\n");
          csvFile.close();
        }
      }

      csvFile = SD.open("/departed_bus_record_to_sync_database.csv", FILE_APPEND);
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
    }

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
      printer.println("Farmers Market and");
      printer.println("Transportation Terminal");
      printer.println("");
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
      printer.println("DATE: " + String(date) + " ");

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

      printer.feed(4);
      printer.setDefault();
    }

    closeGateCounter();
    lcd.clear();
    while (1)
    {
      digitalWrite(trigPin, LOW);
      delayMicroseconds(2);

      digitalWrite(trigPin, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin, LOW);

      duration = pulseIn(echoPin, HIGH);
      distanceCm = duration * SOUND_SPEED / 2;

      Serial.println(distanceCm);

      if (distanceCm > 15.0)
      {
        closeTollGate();
        break;
      }
      else if (distanceCm < 15.0)
      {

        lcd.setCursor(4, 0);
        lcd.print("GATE BLOCKED");
        lcd.setCursor(1, 2);
        lcd.print("CLOSING GATE STOP");
      }
    }

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