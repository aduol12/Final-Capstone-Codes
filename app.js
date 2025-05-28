// app.js

// DOM Elements
const temperatureValue = document.getElementById("temperature-value")
const humidityValue    = document.getElementById("humidity-value")
const fanValue         = document.getElementById("fan-value")
const gasValue         = document.getElementById("gas-value")
const gasStatus        = document.getElementById("gas-status")
const systemStatus     = document.getElementById("system-status")
const statusDetails    = document.getElementById("status-details")
const pumpBadge        = document.getElementById("pump-badge")
const pumpDetails      = document.getElementById("pump-details")

// Chart contexts
const temperatureCtx = document.getElementById("temperature-chart")?.getContext("2d")
const humidityCtx    = document.getElementById("humidity-chart")?.getContext("2d")

// Chart instances
let temperatureChart, humidityChart

// ─── APP INITIALIZATION ────────────────────────────────────────────────────────
function initApp() {
  // Initial fetches
  fetchSensorData()
  fetchDeviceStatus()

  // Initialize charts & load historical data once Chart.js is ready
  setTimeout(() => {
    if (temperatureCtx && humidityCtx) {
      initCharts()
      fetchHistoricalData()
    }
  }, 100)

  // Poll for updates every 10 seconds
  setInterval(fetchSensorData,   10000)
  setInterval(fetchDeviceStatus, 10000)
}

document.addEventListener("DOMContentLoaded", initApp)


// ─── CHART SETUP ───────────────────────────────────────────────────────────────
function initCharts() {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend:  { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid:{color:"rgba(255,255,255,0.1)"}, ticks:{color:"rgba(255,255,255,0.7)"} },
      y: { grid:{color:"rgba(255,255,255,0.1)"}, ticks:{color:"rgba(255,255,255,0.7)"} },
    },
  }

  temperatureChart = new Chart(temperatureCtx, {
    type: "line",
    data: { labels: [], datasets: [{
      label: "Temperature (°C)",
      data: [],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.1)",
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    }]},
    options: commonOptions,
  })

  humidityChart = new Chart(humidityCtx, {
    type: "line",
    data: { labels: [], datasets: [{
      label: "Humidity (%)",
      data: [],
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.1)",
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    }]},
    options: commonOptions,
  })
}


// ─── DATA FETCH & UPDATE ──────────────────────────────────────────────────────

// Fetch and display latest sensor reading
async function fetchSensorData() {
  try {
    const data = await window.api.getLatestSensorData()
    updateSensorValues(data)
    updateSystemStatus(data)
  } catch (err) {
    console.error(err)
    showErrorMessage("Failed to fetch sensor data.")
  }
}

// Fetch and display device status
async function fetchDeviceStatus() {
  try {
    const data = await window.api.getDeviceStatus()
    updateDeviceStatus(data)
  } catch (err) {
    console.error(err)
    showErrorMessage("Failed to fetch device status.")
  }
}

// // Fetch and plot historical data (last 24h)
// async function fetchHistoricalData() {
//   try {
//     const end   = new Date().toISOString()
//     const start = new Date(Date.now() - 24*60*60*1000).toISOString()
//     const data  = await window.api.getSensorDataByTimeRange(start, end)

//     if (Array.isArray(data) && data.length > 0) {
//       updateCharts(data)
//     } else {
//       console.warn("No historical data to plot.")
//     }
//   } catch (err) {
//     console.error(err)
//     showErrorMessage("Failed to fetch historical data.")
//   }
// }


// Fetch and plot the last 10 data points
async function fetchHistoricalData() {
  try {
    // ask for the 10 most recent records
    const data = await window.api.getSensorData(10)

    if (Array.isArray(data) && data.length > 0) {
      updateCharts(data)
    } else {
      console.warn("No historical data to plot.")
    }
  } catch (err) {
    console.error(err)
    showErrorMessage("Failed to fetch historical data.")
  }
}


// ─── UI UPDATE HELPERS ────────────────────────────────────────────────────────

function updateSensorValues(data) {
  if (!data) return

  // Temperature
  if (temperatureValue) {
    temperatureValue.textContent = `${data.temperature.toFixed(1)}°C`
    document.querySelector(".temperature-fill")
      ?.style.setProperty("width", `${Math.min(100,(data.temperature/40)*100)}%`)
  }

  // Humidity
  if (humidityValue) {
    humidityValue.textContent = `${data.humidity.toFixed(1)}%`
    document.querySelector(".humidity-fill")
      ?.style.setProperty("width", `${Math.min(100,data.humidity)}%`)
  }

  // Gas
  if (gasValue) {
    gasValue.textContent = Math.round(data.gas_level)
    document.querySelector(".gas-fill")
      ?.style.setProperty("width", `${Math.min(100,(data.gas_level/1000)*100)}%`)

    if (gasStatus) {
      if (data.gas_level < 500) {
        gasStatus.textContent = "Normal"
        gasStatus.className = "sensor-target"
      } else if (data.gas_level < 800) {
        gasStatus.textContent = "Elevated"
        gasStatus.className = "sensor-target warning"
      } else {
        gasStatus.textContent = "High"
        gasStatus.className = "sensor-target danger"
      }
    }
  }
}

function updateDeviceStatus(data) {
  // Fan
  if (fanValue) {
    fanValue.textContent = data.fan ? "On" : "Off"
    document.querySelector(".fan-fill")
      ?.style.setProperty("width", data.fan ? "100%" : "0%")
  }

  // Pump
  if (pumpBadge && data.hasOwnProperty("pump")) {
    pumpBadge.textContent = data.pump ? "Active" : "Inactive"
    pumpBadge.className = data.pump
      ? "pump-status-badge active"
      : "pump-status-badge"

    if (pumpDetails) {
      pumpDetails.textContent = data.pump
        ? "Pump is currently active and running"
        : "Pump is currently inactive"
    }
  }
}

function updateSystemStatus(data) {
  if (!systemStatus || !statusDetails) return

  let text    = "Optimal"
  let cls     = "status-banner"
  let details = "All systems are functioning within optimal parameters."

  if (data.temperature > 30 || data.humidity > 75 || data.gas_level > 800) {
    text    = "Critical"
    cls     = "status-banner danger"
    details = "Critical conditions detected. Automatic systems have been activated."
  } else if (data.temperature > 27 || data.humidity > 70 || data.gas_level > 600) {
    text    = "Warning"
    cls     = "status-banner warning"
    details = "Warning: Some parameters are outside optimal range."
  }

  systemStatus.textContent  = text
  statusDetails.textContent = details

  const banner = document.querySelector(".status-banner")
  if (banner) banner.className = cls
}


// ─── CHART UPDATE ─────────────────────────────────────────────────────────────

function updateCharts(data) {
  if (!temperatureChart || !humidityChart) return

  const labels = data.map(item =>
    new Date(item.timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })
  )
  const temps = data.map(item => item.temperature)
  const hums  = data.map(item => item.humidity)

  temperatureChart.data.labels           = labels
  temperatureChart.data.datasets[0].data = temps
  temperatureChart.update()

  humidityChart.data.labels              = labels
  humidityChart.data.datasets[0].data    = hums
  humidityChart.update()
}


// ─── ERROR HANDLING ──────────────────────────────────────────────────────────

function showErrorMessage(msg) {
  console.error(msg)
  // Optionally display a user-facing banner/toast here
}
