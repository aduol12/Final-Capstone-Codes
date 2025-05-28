# Code Citations

## License: unknown
https://github.com/mgolcu00/Ledder/tree/2951b32bd1959c514e6d2b0b7153e893215cf10a/lib/connection/connection.cpp

```
Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("
```


## License: unknown
https://github.com/kdi6033/i2r-01/tree/6d305da9587511dcd134ffa2ce40c3a625dd318c/1%20%20wifi%20mqtt%20initial%20setup/i2r-01.ino

```
setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".
```


## License: unknown
https://github.com/dwiajicahyono/mosquitto_nodejs_mongo_esp/tree/afaa21767250483630ab605f10a18be80d51296e/hardware/esp8266tomqtt.cpp

```
to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
```


## License: unknown
https://github.com/Risko287/BP_Smarthome/tree/38f86dc6e8e8183003cc1d3e06dfe2b1c6a3e703/ESP32/src/main2.cpp

```
;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message received on topic ");
  Serial.print(topic);
  Serial.print(": "
```


## License: unknown
https://github.com/plazmer/lc_iot/tree/a10d758339a34592092d4f3b3d7c1f02c7f01843/03_digital_light/03_digital_light.ino

```
(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client
```

