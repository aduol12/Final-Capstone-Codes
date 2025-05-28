require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const mqtt = require("mqtt")
const app = express()

// Initialize MQTT service
const mqttService = require("./services/mqttService")

// Import routes
const sensorRoutes = require("./routes/sensorRoutes")
const controlRoutes = require("./routes/controlRoutes")

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
})

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")))

// MQTT broker details
const mqttBroker = "mqtt://Your_MQTT_BROKER_IP";
const client = mqtt.connect(mqttBroker);

// MQTT topics
const fanControlTopic = "device/fan/control";
const coolerControlTopic = "device/cooler/control";
const pumpControlTopic = "device/pump/control";

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Use routes for sensor data and control routes
app.use("/api/sensor", sensorRoutes)
app.use("/api/control", controlRoutes)

// Mock data store
let sensorData = []
let deviceStatus = {
  fan: 'off',
  cooler: 'off',
  pump: 'inactive'
}

// Add some initial test data
for (let i = 0; i < 10; i++) {
  sensorData.push({
    temperature: 25.0 + (Math.random() * 5 - 2.5),
    humidity: 60.0 + (Math.random() * 10 - 5),
    gas_level: 500 + (Math.random() * 100 - 50),
    timestamp: new Date().toISOString()
  })
}

// Get latest sensor reading
app.get('/api/sensor/latest', (req, res) => {
  try {
    const latest = sensorData[sensorData.length - 1] || {
      temperature: 25.0,
      humidity: 60.0,
      gas_level: 500,
      timestamp: new Date().toISOString()
    }
    console.log('Sending latest data:', latest)
    res.json(latest)
  } catch (error) {
    console.error('Error in /api/sensor/latest:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get sensor data with limit
app.get('/api/sensor/sensor-data', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const data = sensorData.slice(-limit)
    console.log(`Sending ${data.length} data points`)
    res.json(data)
  } catch (error) {
    console.error('Error in /api/sensor/sensor-data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get device status
app.get('/api/control/status', (req, res) => {
  try {
    console.log('Sending device status:', deviceStatus)
    res.json(deviceStatus)
  } catch (error) {
    console.error('Error in /api/control/status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Control fan
app.post('/api/control/fan', (req, res) => {
  try {
    const { status } = req.body
    deviceStatus.fan = status
    client.publish(fanControlTopic, status)
    console.log('Updated fan status:', status)
    res.json({ message: `Fan turned ${status}` })
  } catch (error) {
    console.error('Error in /api/control/fan:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Control cooler
app.post('/api/control/cooler', (req, res) => {
  try {
    const { status } = req.body
    deviceStatus.cooler = status
    client.publish(coolerControlTopic, status)
    console.log('Updated cooler status:', status)
    res.json({ message: `Cooler turned ${status}` })
  } catch (error) {
    console.error('Error in /api/control/cooler:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Control pump
app.post('/api/control/pump', (req, res) => {
  try {
    const { status } = req.body
    deviceStatus.pump = status
    client.publish(pumpControlTopic, status)
    console.log('Updated pump status:', status)
    res.json({ message: `Pump turned ${status}` })
  } catch (error) {
    console.error('Error in /api/control/pump:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Serve the frontend for any other routes
app.get("*", (req, res) => {
  // Check if the request is for an HTML page
  if (req.accepts("html")) {
    // If it's a known route, serve the specific HTML file
    if (req.path === "/control") {
      return res.sendFile(path.join(__dirname, "../frontend/control.html"))
    } else if (req.path === "/analytics") {
      return res.sendFile(path.join(__dirname, "../frontend/analytics.html"))
    } else if (req.path === "/notifications") {
      return res.sendFile(path.join(__dirname, "../frontend/notifications.html"))
    } else if (req.path === "/settings") {
      return res.sendFile(path.join(__dirname, "../frontend/settings.html"))
    }

    // Default to index.html for the main route or unknown routes
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
  } else {
    // If it's not an HTML request, return 404
    res.status(404).json({
      error: "Not Found",
      message: `The requested resource at ${req.originalUrl} was not found`,
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5500
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Try accessing: http://localhost:${PORT}/api/sensor/latest`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
    process.exit(0)
  })
})

module.exports = app // For testing purposes

