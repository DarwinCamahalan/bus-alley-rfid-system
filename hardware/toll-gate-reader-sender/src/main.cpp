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

#define SCK 16
#define MISO 14
#define MOSI 12
#define CS 15

SPIClass spi = SPIClass(VSPI);

#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 20, 4);

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

MFRC522 mfrc522(5, 17);

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

// ------------------

void listDir(fs::FS &fs, const char *dirname, uint8_t levels)
{
  Serial.printf("Listing directory: %s\n", dirname);

  File root = fs.open(dirname);
  if (!root)
  {
    Serial.println("Failed to open directory");
    return;
  }
  if (!root.isDirectory())
  {
    Serial.println("Not a directory");
    return;
  }

  File file = root.openNextFile();
  while (file)
  {
    if (file.isDirectory())
    {
      Serial.print("  DIR : ");
      Serial.println(file.name());
      if (levels)
      {
        listDir(fs, file.name(), levels - 1);
      }
    }
    else
    {
      Serial.print("  FILE: ");
      Serial.print(file.name());
      Serial.print("  SIZE: ");
      Serial.println(file.size());
    }
    file = root.openNextFile();
  }
}

void createDir(fs::FS &fs, const char *path)
{
  Serial.printf("Creating Dir: %s\n", path);
  if (fs.mkdir(path))
  {
    Serial.println("Dir created");
  }
  else
  {
    Serial.println("mkdir failed");
  }
}

void removeDir(fs::FS &fs, const char *path)
{
  Serial.printf("Removing Dir: %s\n", path);
  if (fs.rmdir(path))
  {
    Serial.println("Dir removed");
  }
  else
  {
    Serial.println("rmdir failed");
  }
}

void readFile(fs::FS &fs, const char *path)
{
  Serial.printf("Reading file: %s\n", path);

  File file = fs.open(path);
  if (!file)
  {
    Serial.println("Failed to open file for reading");
    return;
  }

  Serial.print("Read from file: ");
  while (file.available())
  {
    Serial.write(file.read());
  }
  file.close();
}

void writeFile(fs::FS &fs, const char *path, const char *message)
{
  Serial.printf("Writing file: %s\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file)
  {
    Serial.println("Failed to open file for writing");
    return;
  }
  if (file.print(message))
  {
    Serial.println("File written");
  }
  else
  {
    Serial.println("Write failed");
  }
  file.close();
}

void appendFile(fs::FS &fs, const char *path, const char *message)
{
  Serial.printf("Appending to file: %s\n", path);

  File file = fs.open(path, FILE_APPEND);
  if (!file)
  {
    Serial.println("Failed to open file for appending");
    return;
  }
  if (file.print(message))
  {
    Serial.println("Message appended");
  }
  else
  {
    Serial.println("Append failed");
  }
  file.close();
}

void renameFile(fs::FS &fs, const char *path1, const char *path2)
{
  Serial.printf("Renaming file %s to %s\n", path1, path2);
  if (fs.rename(path1, path2))
  {
    Serial.println("File renamed");
  }
  else
  {
    Serial.println("Rename failed");
  }
}

void deleteFile(fs::FS &fs, const char *path)
{
  Serial.printf("Deleting file: %s\n", path);
  if (fs.remove(path))
  {
    Serial.println("File deleted");
  }
  else
  {
    Serial.println("Delete failed");
  }
}

void testFileIO(fs::FS &fs, const char *path)
{
  File file = fs.open(path);
  static uint8_t buf[512];
  size_t len = 0;
  uint32_t start = millis();
  uint32_t end = start;
  if (file)
  {
    len = file.size();
    size_t flen = len;
    start = millis();
    while (len)
    {
      size_t toRead = len;
      if (toRead > 512)
      {
        toRead = 512;
      }
      file.read(buf, toRead);
      len -= toRead;
    }
    end = millis() - start;
    Serial.printf("%u bytes read for %u ms\n", flen, end);
    file.close();
  }
  else
  {
    Serial.println("Failed to open file for reading");
  }

  file = fs.open(path, FILE_WRITE);
  if (!file)
  {
    Serial.println("Failed to open file for writing");
    return;
  }

  size_t i;
  start = millis();
  for (i = 0; i < 2048; i++)
  {
    file.write(buf, 512);
  }
  end = millis() - start;
  Serial.printf("%u bytes written for %u ms\n", 2048 * 512, end);
  file.close();
}

// --------------------

void setup()
{
  Serial.begin(115200);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  lcd.init();
  lcd.backlight();

  lcd.clear();
  lcd.setCursor(3, 1);
  lcd.print("PLEASE WAIT...");

  // ----------------
  spi.begin(SCK, MISO, MOSI, CS);

  if (!SD.begin(CS, spi, 80000000))
  {
    Serial.println("Card Mount Failed");
    return;
  }
  uint8_t cardType = SD.cardType();

  if (cardType == CARD_NONE)
  {
    Serial.println("No SD card attached");
    return;
  }

  Serial.print("SD Card Type: ");
  if (cardType == CARD_MMC)
  {
    Serial.println("MMC");
  }
  else if (cardType == CARD_SD)
  {
    Serial.println("SDSC");
  }
  else if (cardType == CARD_SDHC)
  {
    Serial.println("SDHC");
  }
  else
  {
    Serial.println("UNKNOWN");
  }

  uint64_t cardSize = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD Card Size: %lluMB\n", cardSize);

  listDir(SD, "/", 0);
  createDir(SD, "/mydir");
  listDir(SD, "/", 0);
  removeDir(SD, "/mydir");
  listDir(SD, "/", 2);
  writeFile(SD, "/hello.txt", "Hello ");
  appendFile(SD, "/hello.txt", "World!\n");
  readFile(SD, "/hello.txt");
  deleteFile(SD, "/foo.txt");
  renameFile(SD, "/hello.txt", "/foo.txt");
  readFile(SD, "/foo.txt");
  testFileIO(SD, "/test.txt");
  Serial.printf("Total space: %lluMB\n", SD.totalBytes() / (1024 * 1024));
  Serial.printf("Used space: %lluMB\n", SD.usedBytes() / (1024 * 1024));

  // -----------------

  bool res;
  res = wm.autoConnect("TOLL GATE - ESP32");

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

  lcd.clear();
  lcd.setCursor(2, 1);
  lcd.print("PLACE RFID CARD");
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

  getData();

  DynamicJsonDocument doc(4096);
  deserializeJson(doc, jsonData);

  if (doc.containsKey(uidString))
  {
    lcd.clear();

    lcd.setCursor(0, 1);
    lcd.print("*CARD AUTHENTICATED*");

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