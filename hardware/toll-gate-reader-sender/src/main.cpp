#include <Arduino.h>
#include <WiFiManager.h>

#include "time.h"

#include <Servo.h>
#include <Wire.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include <SPI.h>
#include <MFRC522.h>

#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#include "BluetoothSerial.h"
#include "Adafruit_Thermal.h"

#include <ArduinoJson.h>

WiFiManager wm;

const char *ntpServer = "asia.pool.ntp.org";
const long gmtOffset_sec = 28800;
const int daylightOffset_sec = 0;

MFRC522 mfrc522(5, 22);

Servo servo;

BluetoothSerial SerialBT;
Adafruit_Thermal printer(&SerialBT);
uint8_t address[6] = {0x86, 0x67, 0x7A, 0x76, 0x6D, 0xAA};
String name = "MTP-II_6DAA";
const char *pin = "0000";
bool connected;

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;
String jsonData;

void openTollGate(void *pvParameters)
{
  servo.attach(13);

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

void getData()
{
  if (Firebase.ready() && signupOK)
  {
    if (Firebase.RTDB.getJSON(&firebaseData, "/addedCards"))
    {
      jsonData = firebaseData.jsonString();
    }
  }
}

void setup()
{
  Serial.begin(115200);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  bool res;
  res = wm.autoConnect("AutoConnectAP");

  if (!res)
  {
    Serial.println("NETWORK FAILED");
  }
  else
  {
    Serial.println("CONNECTED TO NETWORK");
  }

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

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("PLACE CARD");
}

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
  String uidString = "";

  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }

  getData();

  DynamicJsonDocument doc(4096);
  deserializeJson(doc, jsonData);

  if (doc.containsKey(uidString))
  {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
    {
      return;
    }

    char time[15];
    strftime(time, 15, "%I:%M:%S %p", &timeinfo);

    char date[15];
    strftime(date, 15, "%m/%d/%Y", &timeinfo);

    FirebaseJson json;
    const char *cardID = doc[uidString]["cardID"];
    const char *busCompany = doc[uidString]["busCompany"];
    const char *plateNumber = doc[uidString]["plateNumber"];

    json.add("cardID", cardID);
    json.add("busCompany", busCompany);
    json.add("plateNumber", plateNumber);
    json.add("fee", 50);
    json.add("date", date);
    json.add("time", time);

    if (Firebase.RTDB.pushJSON(&firebaseData, "departed", &json))
    {
      Serial.println("DATA SENT TO DATABASE");
      // OPEN TOLL GATE HERE
      xTaskCreate(openTollGate, "Open Toll Gate", 2048, NULL, 2, NULL);

      // PRINT RECEIPT
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
        Serial.println("PRINTING...");
        printer.begin();

        Serial.println("Test inverse on & off");
        printer.inverseOn();
        printer.println(F("Inverse ON"));
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
  }
  else
  {
    Serial.println("ACCESS DENIED");
  }
}