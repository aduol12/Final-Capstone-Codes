// MQTT Client for browser
// Configuration for HiveMQ Cloud
const MQTT_CONFIG = {
  host: "2aa64c3604cf4472808d4ecc5cf2da8c.s1.eu.hivemq.cloud",
  port: 8884,
  path: "/mqtt",
  username: "Adwol",
  password: "Castin@blue1",
  clientId: "webClient_" + Math.random().toString(16).substr(2, 8)
};

// MQTT topics - must match your ESP32 configuration
const MQTT_TOPICS = {
  fanControl: "device/fan/control",
  coolerControl: "device/cooler/control",
  pumpControl: "device/pump/control"
};

// MQTT client instance - declare but don't initialize yet
let mqttClient = null;
let isConnected = false;

// Initialize MQTT client
function initMQTT() {
  console.log("Initializing MQTT client...");
  
  try {
    // Initialize the client in the correct order
    mqttClient = new Paho.MQTT.Client(
      MQTT_CONFIG.host,
      MQTT_CONFIG.port,
      MQTT_CONFIG.path,
      MQTT_CONFIG.clientId
    );
    
    // Set callback handlers
    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;
    
    // Connect to the MQTT broker
    connect();
  } catch (error) {
    console.error("Error initializing MQTT client:", error);
  }
}

// Connect to MQTT broker
function connect() {
  console.log("Connecting to MQTT broker...");
  
  const options = {
    onSuccess: onConnect,
    onFailure: onConnectionFailed,
    userName: MQTT_CONFIG.username,
    password: MQTT_CONFIG.password,
    useSSL: true  // Using secure WebSockets for HiveMQ
  };
  
  try {
    mqttClient.connect(options);
  } catch (error) {
    console.error("Error connecting to MQTT broker:", error);
  }
}

// On successful connection
function onConnect() {
  console.log("Connected to MQTT broker");
  isConnected = true;
}

// On connection failure
function onConnectionFailed(responseObject) {
  console.error("Failed to connect to MQTT broker:", responseObject);
  isConnected = false;
  
  // Try to reconnect after delay
  setTimeout(connect, 5000);
}

// On connection lost
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.error("Connection to MQTT broker lost:", responseObject.errorMessage);
    isConnected = false;
    
    // Try to reconnect after delay
    setTimeout(connect, 5000);
  }
}

// Handle incoming messages
function onMessageArrived(message) {
  const topic = message.destinationName;
  const payload = message.payloadString;
  
  console.log("Message received:", topic, payload);
}

// Publish message to topic
function publishMessage(topic, message) {
  if (!isConnected) {
    console.error("Cannot publish message: Not connected to MQTT broker");
    return false;
  }
  
  try {
    const mqttMessage = new Paho.MQTT.Message(message);
    mqttMessage.destinationName = topic;
    mqttClient.send(mqttMessage);
    console.log("Published message:", topic, message);
    return true;
  } catch (error) {
    console.error("Failed to publish message:", error);
    return false;
  }
}

// Export MQTT client for other scripts to use
window.mqttClient = {
  init: initMQTT,
  isConnected: () => isConnected,
  publish: publishMessage,
  topics: MQTT_TOPICS
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initMQTT);