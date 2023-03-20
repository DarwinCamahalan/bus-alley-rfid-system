# Automated Bus Alley Management System using RFID


> COMPONENTS:
  * ESP32 WROOM 32 (NODE MCU)
  * MFRC522 RFID READER
  * MIFARE 1KB CLASSIC RFID CARD
  * SERVO MOTOR
  * I2C 16X2 LCD SCREEN
  * THERMAL PRINTER

---

## HARDWARE CONFIGURATION:

> MFRC522 PINS TO ESP32 (ADMIN RFID READER)

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND  (GRAY) |
| 3V3          | VIN  (RED)  |
| 22           | RST  (YELLOW)|
| 19           | MISO (ORANGE)|
| 23           | MOSI (BROWN) |
| 18           | SCK  (BLUE)|
| 5            | SDA  (VIOLET)|


> MFRC522 PINS TO ESP32 (TOLL GATE RFID READER)

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND (19~21)  | GND  (BLACK)|
| 3V3 (ALWAYS) | VIN  (WHITE)|
| 17           | RST  (YELLOW)|
| 19           | MISO (BROWN)|
| 23           | MOSI (RED)  |
| 18           | SCK  (ORANGE)|
| 16            | SDA  (GREEN)|


> SD CARD MODULE PINS TO ESP32

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND  (BLACK)|
| 5V           | VIN  (WHITE)|
| 5            | CS   (GREEN)|
| 23           | MOSI (RED)  |
| 18           | SCK  (ORANGE)|
| 19           | MISO (BROWN) |

> SERVO MOTOR PINS TO ESP32 | MAGNETIC CONTACTOR

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND (BROWN) |
| 5V           | VIN (RED)   |
| 15           | GPIO 13 (ORANGE)|



> I2C 20X4 LCD SCREEN PINS TO ESP32

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND         |
| 5V           | VIN         |
| 21           | SDA (BLUE)  |
| 22           | SCL (VIOLET)|





	

		
		
		
		
 		
		
		  
