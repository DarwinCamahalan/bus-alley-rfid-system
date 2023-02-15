#include <Arduino.h>
#include <WiFiManager.h>

#include <SPI.h>
#include <MFRC522.h>

#include <Firebase_ESP_Client.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define DATABASE_URL "https://rfid-database-abd32-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define API_KEY "AIzaSyAqRt-Q3UQTtvnhi6wvTznXSbHF36sNWGo"

#define SS_PIN 5
#define RST_PIN 22
MFRC522 mfrc522(SS_PIN, RST_PIN);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;

void setup()
{

  Serial.begin(115200);

  WiFiManager wm;
  bool res;

  res = wm.autoConnect("AutoConnectAP");

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

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

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

  if (Firebase.ready() && signupOK)
  {
    Firebase.RTDB.setString(&fbdo, "card/id", uidString);
  }
}