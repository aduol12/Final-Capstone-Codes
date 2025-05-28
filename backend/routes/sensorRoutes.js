const express = require("express")
const router = express.Router()
const { getSensorData, getLatestSensorData, getSensorDataByTimeRange } = require("../controllers/sensorController")

// Route to fetch all sensor data (with optional limit)
router.get("/sensor-data", getSensorData)

// Route to fetch the latest sensor reading
router.get("/latest", getLatestSensorData)

// Route to fetch sensor data for a specific time range
router.get("/time-range", getSensorDataByTimeRange)

module.exports = router

