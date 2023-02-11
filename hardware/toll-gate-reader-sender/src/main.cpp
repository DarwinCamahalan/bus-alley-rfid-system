#include <Arduino.h>
#include <WiFiManager.h>

#include <SPI.h>
#include <MFRC522.h>

#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#include <ArduinoJson.h>

MFRC522 mfrc522(5, 22);

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;
String jsonData;

void setup()
{

  Serial.begin(115200);

  WiFiManager wm;
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
  if (Firebase.ready() && signupOK)
  {
    if (Firebase.RTDB.getJSON(&firebaseData, "/addedCards"))
    {
      jsonData = firebaseData.jsonString();
    }
  }

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

  DynamicJsonDocument doc(4096);
  deserializeJson(doc, jsonData);

  if (doc.containsKey(uidString))
  {
    FirebaseJson json;
    const char *cardID = doc[uidString]["cardID"];
    const char *busCompany = doc[uidString]["busCompany"];
    const char *plateNumber = doc[uidString]["plateNumber"];

    json.add("cardID", cardID);
    json.add("busCompany", busCompany);
    json.add("plateNumber", plateNumber);

    if (Firebase.RTDB.pushJSON(&firebaseData, "departed", &json))
    {
      Serial.println("SENT TO FIREBASE");
      delay(3000);
    }
  }
  else
  {
    Serial.println("AUTHENTICATION FAILED");
  }
}