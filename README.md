# Final-Capstone-Codes
All project_code
Project Title: Development of an Intelligent Storage Device with Fuzzy Logic Decision-Making for Extended Shelf Life of Tomatoes

Team Members:
- Christine Adwol Emmanuel 
- Matilda Apegyine Abagna 

Supervisor:
Prof. Robert A. Sowah

University:
Ashesi University

Degree Program:
B.Sc. Computer Engineering & Electrical and Electronics Engineering

----------------------------------------------------------
GitHub Repository:

https://github.com/aduol12/Final-Capstone-Codes
----------------------------------------------------------
How to Compile / Install / Deploy the System
----------------------------------------------------------

REQUIREMENTS:
-------------
Hardware:
- ESP32 Microcontroller
- DHT22 Temperature & Humidity Sensor
- MQ-series Gas Sensor
- 12V Cooling Fan
- Submersible Water Pump
- Electrostatic Field Generator
- GSM Module (SIM800L)
- LCD Display
- Solar Panel (1000W)
- 12V/697.5Ah Lead Acid Battery
- Two-channel Relay Module
- Wood Wool Cooling Pad
- Custom-built storage chamber

Software:
- Arduino IDE
- Node.js (for Web Dashboard)
- Flutter SDK (for Mobile App)
- Firebase (or HTTP server) for cloud storage
- HiveMQ Cloud (MQTT Broker)

----------------------------------------------------------
HARDWARE SETUP:
-------------
1. Mount all sensors and actuators as per schematic in the report.
2. Connect solar panel to charge controller and battery for power.
3. Wire ESP32 to sensors and GSM module.
4. Use relay module to switch between solar, battery, and grid power if available.
5. Use electrostatic field generator for microbial control in the chamber.

----------------------------------------------------------
FIRMWARE (ESP32):
-------------
1. Open `codes/Esp32code/finalcapstone_101` in zip folder.
2. Install required libraries:
   - DHT.h
   - Adafruit_Sensor.h
   - PubSubClient.h (for MQTT)
   - SoftwareSerial.h
3. Select the appropriate ESP32 board.
4. Upload the firmware to the ESP32.

----------------------------------------------------------
WEB DASHBOARD:
-------------
1. Navigate to `/codes/web_app`
2. Run: `npm install`
3. Start server with: `npm start`
4. Open browser and visit: `http://localhost:3000`
5. The dashboard displays real-time sensor data and controls.

----------------------------------------------------------
MOBILE APPLICATION:
-------------
1. Navigate to `/codes/mobile_app`
2. Run: `flutter pub get`
3. To test: `flutter run`
4. To build release: `flutter build apk`
5. Connect the app to Firebase or local MQTT using credentials.

----------------------------------------------------------
DATA COMMUNICATION:
-------------
- MQTT is used for real-time messaging (via HiveMQ).
- GSM (SIM800L) is used as backup for sending SMS alerts.
- Offline buffering is implemented using circular buffer on ESP32.

----------------------------------------------------------
NOTES:
-------------
- The fuzzy logic control algorithm is implemented in the ESP32 firmware using fuzzy rules to regulate temperature and humidity.
- Evaporative cooling and electrostatic disinfection work in tandem to extend the shelf life of tomatoes.
- Refer to `report.pdf` in the documentation folder for wiring diagrams and troubleshooting steps.

----------------------------------------------------------
CONTACT:
-------------
For any questions or support, please contact:

Christine Adwol Emmanuel  
Email: christine.emmanuel@ashesi.edu.gh

Matilda Apegyine Abagna  
Email: matilda.abagna@ashesi.edu.gh


