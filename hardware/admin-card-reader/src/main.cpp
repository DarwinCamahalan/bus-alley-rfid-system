// IMPORTING PACKAGES USING PLATFORMIO EXTENSION IN VS CODE
#include <Arduino.h>
#include <WiFiManager.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// DEFINING SECRET KEY AND URL TO THE REALTIME DATABASE OF FIREBASE
#define DATABASE_URL "https://rfid-database-abd32-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define API_KEY "AIzaSyAqRt-Q3UQTtvnhi6wvTznXSbHF36sNWGo"

// PINS FOR THE MFRC522 RFID SCANNER
#define SS_PIN 5
#define RST_PIN 22
MFRC522 mfrc522(SS_PIN, RST_PIN);

// DEFINING FIREBASE DATA OBJECT, AUTHENTICATION AND CONFIGURATION
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;

void setup()
{
  // IDEAL BAUDRATE FOR RFID COMMUNICATION
  Serial.begin(115200);

  // INITIALIZING ACCESS POINT USING WIFI MANAGE LIBRARY
  WiFiManager wm;
  bool res;

  // ACCESS POINT NAME OF ESP32 DEVICE
  res = wm.autoConnect("ADMIN CARD READER - RFID DEVICE");

  if (!res)
  {
    Serial.println("FAILED TO CONNECT");
  }
  else
  {
    Serial.println("CONNECTED TO NETWORK");
  }

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("CONNECTED TO FIREBASE");
    signupOK = true;
  }
  else
  {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;

  // IF OFFLINE, IT AUTOMATICALLY RECONNECT TO DATABASE WHEN INTERNET CONNECTION IS STABLE
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // SCANNING FOR AN RFID CARD (MIFARE CLASSIC 1KB)
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("PLACE CARD");
  Serial.println();
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

  // PRINTING UNIQUE ID OF THE RFID CARDS
  Serial.print("UID: ");
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();

  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }

  // SENDING UID TO THE FIREBASE REALTIME DATA BASE IN "CARD/ID" NODE
  if (Firebase.ready() && signupOK)
  {
    Firebase.RTDB.setString(&fbdo, "card/id", uidString);
  }
}