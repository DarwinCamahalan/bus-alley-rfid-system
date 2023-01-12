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


// Initialize Firebase data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;


// --------------------------------------------------------------------
void setup(){

  Serial.begin(115200);
  
    WiFiManager wm;
    bool res;

    res = wm.autoConnect("AutoConnectAP"); // anonymous ap

    if(!res) {
        Serial.println("FAILED TO CONNECT");

    } 
    else {  
        Serial.println("CONNECTED");
    }


  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // SIGN UP
  if(Firebase.signUp(&config, &auth, "", "")){
      Serial.println("Successfully Signed Up");
      signupOK = true;
  }else{
      Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // RFID READER INITIALIZE
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  Serial.println("Place Card");
  Serial.println();
}



// --------------------------------------------------------------------
void loop(){

  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }

   // Print UID
  Serial.print("UID: ");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();

  // Send UID to Firebase
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  

 if (Firebase.ready() && signupOK){
    Firebase.RTDB.setString(&fbdo, "card/id", uidString);
  }

}
