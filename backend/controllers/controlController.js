const { publishControl } = require("../services/mqttService")

let fanStatus = false
let coolerStatus = false

// Control the fan
const controlFan = (req, res) => {
  try {
    fanStatus = req.body.status
    publishControl("fan", fanStatus)
    console.log(`Fan status set to: ${fanStatus}`)
    res.status(200).json({ status: fanStatus })
  } catch (error) {
    console.error("Error controlling fan:", error)
    res.status(500).json({ error: "Failed to control fan", details: error.message })
  }
}

// Control the cooler
const controlCooler = (req, res) => {
  try {
    coolerStatus = req.body.status
    publishControl("cooler", coolerStatus)
    console.log(`Cooler status set to: ${coolerStatus}`)
    res.status(200).json({ status: coolerStatus })
  } catch (error) {
    console.error("Error controlling cooler:", error)
    res.status(500).json({ error: "Failed to control cooler", details: error.message })
  }
}

// Get the status of devices
const getDeviceStatus = (req, res) => {
  res.status(200).json({
    fan: fanStatus,
    cooler: coolerStatus,
  })
}

module.exports = {
  controlFan,
  controlCooler,
  getDeviceStatus,
}
