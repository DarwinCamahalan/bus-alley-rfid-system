# Automated Bus Alley Management System using RFID
---

## Login Page
![245134821-a490823a-cf3f-4d8c-8ea3-0d39c0fa0640](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/c40a6d06-c589-4334-a0dc-95ac997a211f)


## Authenticated RFID Cards Page
![245135104-8c21512e-8e29-4fd1-9b68-9ce0f577e9b9](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/b4089c5c-63c1-49aa-b015-656cbbf6b84b)
![245135149-524467f1-0c86-4d02-9feb-12352ffc54ce](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/4bb39db0-26a6-48b9-be52-26371261f757)


## Data Analytics Page
![245135276-22043c63-461f-4b0f-8c02-1bc4167c8522](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/7de4b380-050c-4e79-83d1-ad2a00500bd4)


## Bus Departed Records Page
![245135380-505fcab7-7309-453d-8376-e00d31a160c3](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/a01f9e93-825e-407f-802a-594225ff6314)


## Compute Revenue Page
![245135586-c4f8c218-2197-46a0-9754-95ab89ef5873](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/b6dfc9ff-f43a-4847-941f-3211ff42b5f6)
![245135484-0e5d2454-c5c3-49f2-bbe5-b5acf704d4c1](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/4657545b-f3ac-4bc2-96b0-7c2c23019133)


## Saved Billing Statements Files Page
![245135691-0f99ac2e-aacb-401d-ab7d-e65f4b5cca92](https://github.com/DarwinCamahalan/bus-alley-rfid-system/assets/120079195/46874ba2-9a76-4715-83f8-79f03618b8b1)

---

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
| 19 (220k R)  | MISO (BROWN) |

> SERVO MOTOR PINS TO ESP32 | MAGNETIC CONTACTOR

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND (BROWN) |
| 5V           | VIN (RED)   |
| 25           | GPIO 25 (ORANGE)|

> RELAY PINS TO ESP32 | MAGNETIC CONTACTOR

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND (BROWN) |
| 5V           | VIN (RED)   |
| 13           | GPIO 13 (ORANGE)|

> ULTRASONIC SENSOR PINS TO ESP32

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND         |
| 5V           | VIN         |
| 26           | TRIGGER (BLUE)  |
| 27           | ECHO (VIOLET)|

> I2C 20X4 LCD SCREEN PINS TO ESP32

| PIN NO.      | LABEL       |
| -----------  | ----------- |
| GND          | GND         |
| 5V           | VIN         |
| 21           | SDA (BLUE)  |
| 22           | SCL (VIOLET)|





	

		
		
		
		
 		
		
		  
