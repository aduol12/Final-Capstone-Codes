const mqtt = require("mqtt");

// MQTT broker details
const mqttBroker = process.env.MQTT_BROKER;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

// MQTT topics
const tempTopic = "sensor/temperature";
const humTopic = "sensor/humidity";
const gasTopic = "sensor/gas";
const healthTopic = "esp32/health";
const fanControlTopic = "device/fan/control";

// Connect to MQTT broker
const client = mqtt.connect(mqttBroker, {
  username: mqttUsername,
  password: mqttPassword,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe([tempTopic, humTopic, gasTopic, healthTopic], (err) => {
    if (err) {
      console.error("Failed to subscribe to topics:", err);
    } else {
      console.log("Subscribed to topics");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);

  // Process sensor data
  if (topic === tempTopic) {
    console.log(`Temperature: ${message.toString()}`);
  } else if (topic === humTopic) {
    console.log(`Humidity: ${message.toString()}`);
  } else if (topic === gasTopic) {
    console.log(`Gas: ${message.toString()}`);
  } else if (topic === healthTopic) {
    console.log(`ESP32 Health: ${message.toString()}`);
  }
});

// Function to send fan control commands
function controlFan(status) {
  const message = status ? "ON" : "OFF";
  client.publish(fanControlTopic, message, (err) => {
    if (err) {
      console.error("Failed to publish fan control message:", err);
    } else {
      console.log(`Fan control message sent: ${message}`);
    }
  });
}

module.exports = { controlFan };