const express = require("express")
const router = express.Router()
const {
  controlFan,
  controlCooler,
  getDeviceStatus,
} = require("../controllers/controlController")

// Route to control fan
router.post("/fan", controlFan)

// Route to control cooler
router.post("/cooler", controlCooler)

// Route to get device statuses
router.get("/status", getDeviceStatus)

module.exports = router
