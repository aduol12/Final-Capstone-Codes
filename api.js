// Base URL for API requests
const API_BASE_URL = "http://localhost:5500/api";

// Get all sensor data with optional limit
async function getSensorData(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/sensor/sensor-data?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching sensor data:", error)
    throw error
  }
}

// Get the latest sensor reading
async function getLatestSensorData() {
  try {
    const response = await fetch(`${API_BASE_URL}/sensor/latest`)
    if (!response.ok) {
      throw new Error(`Failed to fetch latest sensor data: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching latest sensor data:", error)
    // Return mock data for testing
    return {
      temperature: 25.0 + (Math.random() * 5 - 2.5),
      humidity: 60.0 + (Math.random() * 10 - 5),
      gas_level: 500 + (Math.random() * 100 - 50),
      timestamp: new Date().toISOString(),
    }
  }
}

// Get sensor data for a specific time range
async function getSensorDataByTimeRange(start, end) {
  try {
    const response = await fetch(`${API_BASE_URL}/sensor/time-range?start=${start}&end=${end}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data by time range: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching sensor data by time range:", error)
    // Generate mock historical data
    return generateMockHistoricalData(24)
  }
}

// Helper function to generate mock historical data
function generateMockHistoricalData(hours) {
  const data = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()
    const temperature = 22 + Math.random() * 8 // Random between 22-30
    const humidity = 50 + Math.random() * 30 // Random between 50-80
    const gas_level = 400 + Math.random() * 400 // Random between 400-800

    data.push({ timestamp, temperature, humidity, gas_level })
  }

  return data
}

// Get current status of all devices
async function getDeviceStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/control/status`)
    if (!response.ok) {
      throw new Error(`Failed to fetch device status: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching device status:", error)
    throw error
  }
}

// Control fan
async function controlFan(status) {
  try {
    const response = await fetch(`${API_BASE_URL}/control/fan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error(`Failed to control fan: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error controlling fan:", error)
    throw error
  }
}

// Control cooler
async function controlCooler(status) {
  try {
    const response = await fetch(`${API_BASE_URL}/control/cooler`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error(`Failed to control cooler: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error controlling cooler:", error)
    throw error
  }
}

// Export all functions to make them available to other scripts
window.api = {
  getSensorData,
  getLatestSensorData,
  getSensorDataByTimeRange,
  getDeviceStatus,
  controlFan,
  controlCooler,
}

