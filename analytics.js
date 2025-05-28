// import Chart from "chart.js/auto";
// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const timeRange = document.getElementById("time-range")
const customDateRange = document.getElementById("custom-date-range")
const dateFrom = document.getElementById("date-from")
const dateTo = document.getElementById("date-to")
const applyDateRange = document.getElementById("apply-date-range")
const dataResolution = document.getElementById("data-resolution")
const exportData = document.getElementById("export-data")

const prevPage = document.getElementById("prev-page")
const nextPage = document.getElementById("next-page")
const currentPage = document.getElementById("current-page")
const totalPages = document.getElementById("total-pages")

// Chart elements
const temperatureCtx = document.getElementById("temperature-chart")?.getContext("2d")
const humidityCtx = document.getElementById("humidity-chart")?.getContext("2d")
const gasCtx = document.getElementById("gas-chart")?.getContext("2d")
const activityCtx = document.getElementById("activity-chart")?.getContext("2d")

// Charts
let temperatureChart
let humidityChart
let gasChart
let activityChart

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme")
  localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark")
  updateChartsTheme()
})

// Check for saved theme preference
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme")
}

// Initialize the application
function initApp() {
  // Set up event listeners
  timeRange.addEventListener("change", handleTimeRangeChange)
  applyDateRange.addEventListener("click", applyCustomDateRange)
  dataResolution.addEventListener("change", updateCharts)
  exportData.addEventListener("click", exportDataHandler)

  prevPage.addEventListener("click", goToPrevPage)
  nextPage.addEventListener("click", goToNextPage)

  // Initialize date pickers with default values
  const today = new Date()
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  dateFrom.valueAsDate = lastWeek
  dateTo.valueAsDate = today

  // Initialize charts
  setTimeout(() => {
    initCharts()
    // Load initial data
    updateCharts()
  }, 100)
}

// Handle time range change
function handleTimeRangeChange() {
  if (timeRange.value === "custom") {
    customDateRange.style.display = "flex"
  } else {
    customDateRange.style.display = "none"
    updateCharts()
  }
}

// Apply custom date range
function applyCustomDateRange() {
  updateCharts()
}

// Initialize charts
function initCharts() {
  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: getComputedStyle(document.body).getPropertyValue("--text-primary"),
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: getComputedStyle(document.body).getPropertyValue("--border-color"),
        },
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue("--text-secondary"),
        },
      },
      y: {
        grid: {
          color: getComputedStyle(document.body).getPropertyValue("--border-color"),
        },
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue("--text-secondary"),
        },
      },
    },
  }

  try {
    // Temperature Chart
    temperatureChart = new Chart(temperatureCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: commonOptions,
    })

    // Humidity Chart
    humidityChart = new Chart(humidityCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Humidity (%)",
            data: [],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: commonOptions,
    })

    // Gas Chart
    gasChart = new Chart(gasCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Gas Level (ppm)",
            data: [],
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: commonOptions,
    })

    // Activity Chart
    activityChart = new Chart(activityCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Fan Activity",
            data: [],
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderWidth: 0,
          },
          {
            label: "Cooler Activity",
            data: [],
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderWidth: 0,
          },
          {
            label: "Pump Activity",
            data: [],
            backgroundColor: "rgba(245, 158, 11, 0.7)",
            borderWidth: 0,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            stacked: false,
            title: {
              display: true,
              text: "Minutes Active",
              color: getComputedStyle(document.body).getPropertyValue("--text-secondary"),
            },
          },
        },
      },
    })

    console.log("Analytics charts initialized successfully")
  } catch (error) {
    console.error("Error initializing charts:", error)
  }
}

// Update charts theme
function updateChartsTheme() {
  const textColor = getComputedStyle(document.body).getPropertyValue("--text-primary")
  const gridColor = getComputedStyle(document.body).getPropertyValue("--border-color")

  const charts = [temperatureChart, humidityChart, gasChart, activityChart]

  charts.forEach((chart) => {
    if (!chart) return

    chart.options.plugins.legend.labels.color = textColor
    chart.options.scales.x.grid.color = gridColor
    chart.options.scales.y.grid.color = gridColor
    chart.options.scales.x.ticks.color = textColor
    chart.options.scales.y.ticks.color = textColor

    if (chart === activityChart) {
      chart.options.scales.y.title.color = textColor
    }

    chart.update()
  })
}

// Update charts with data
function updateCharts() {
  // Generate data based on selected time range and resolution
  const data = generateChartData()

  // Update temperature chart
  if (temperatureChart) {
    temperatureChart.data.labels = data.labels
    temperatureChart.data.datasets[0].data = data.temperatures
    temperatureChart.update()
  }

  // Update humidity chart
  if (humidityChart) {
    humidityChart.data.labels = data.labels
    humidityChart.data.datasets[0].data = data.humidities
    humidityChart.update()
  }

  // Update gas chart
  if (gasChart) {
    gasChart.data.labels = data.labels
    gasChart.data.datasets[0].data = data.gasLevels
    gasChart.update()
  }

  // Update activity chart
  if (activityChart) {
    activityChart.data.labels = data.labels
    activityChart.data.datasets[0].data = data.fanActivity
    activityChart.data.datasets[1].data = data.coolerActivity
    activityChart.data.datasets[2].data = data.pumpActivity
    activityChart.update()
  }

  // Update statistics
  updateStatistics(data)
}

// Generate chart data based on selected time range and resolution
function generateChartData() {
  let startDate, endDate
  const now = new Date()

  // Determine date range based on selected time range
  switch (timeRange.value) {
    case "24h":
      startDate = new Date(now)
      startDate.setHours(now.getHours() - 24)
      endDate = now
      break
    case "7d":
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      endDate = now
      break
    case "30d":
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 30)
      endDate = now
      break
    case "custom":
      startDate = new Date(dateFrom.value)
      endDate = new Date(dateTo.value)
      endDate.setHours(23, 59, 59)
      break
    default:
      startDate = new Date(now)
      startDate.setHours(now.getHours() - 24)
      endDate = now
  }

  // Determine data points based on selected resolution
  const dataPoints = []
  let interval

  switch (dataResolution.value) {
    case "minute":
      interval = 60 * 1000 // 1 minute in milliseconds
      break
    case "hour":
      interval = 60 * 60 * 1000 // 1 hour in milliseconds
      break
    case "day":
      interval = 24 * 60 * 60 * 1000 // 1 day in milliseconds
      break
    default:
      interval = 60 * 60 * 1000 // Default to hourly
  }

  // Generate data points
  for (let date = new Date(startDate); date <= endDate; date = new Date(date.getTime() + interval)) {
    dataPoints.push(date)
  }

  // Generate labels based on resolution
  const labels = dataPoints.map((date) => {
    if (dataResolution.value === "day") {
      return date.toLocaleDateString()
    } else if (dataResolution.value === "hour") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    }
  })

  // Generate random data for demonstration
  const baseTemp = 25
  const baseHumidity = 60
  const baseGas = 500

  const temperatures = dataPoints.map((date, index) => {
    // Create a sine wave pattern with some randomness
    const hour = date.getHours()
    const dayProgress = (hour / 24) * Math.PI * 2
    const variation = Math.sin(dayProgress) * 3 // +/- 3 degrees variation throughout the day
    return baseTemp + variation + (Math.random() * 2 - 1)
  })

  const humidities = dataPoints.map((date, index) => {
    // Create a pattern with some randomness
    const hour = date.getHours()
    const dayProgress = (hour / 24) * Math.PI * 2
    const variation = Math.cos(dayProgress) * 10 // +/- 10% variation throughout the day
    return baseHumidity + variation + (Math.random() * 5 - 2.5)
  })

  const gasLevels = dataPoints.map((date, index) => {
    // Create a pattern with some randomness
    const hour = date.getHours()
    const dayProgress = (hour / 24) * Math.PI * 2
    const variation = Math.sin(dayProgress + Math.PI / 4) * 100 // +/- 100 ppm variation
    return baseGas + variation + (Math.random() * 50 - 25)
  })

  // Generate activity data (minutes active per interval)
  const fanActivity = dataPoints.map((date, index) => {
    // Fan is more active when temperature is high
    const temp = temperatures[index]
    const threshold = 26
    if (temp > threshold) {
      // Calculate minutes active based on how much the temperature exceeds the threshold
      const minutesActive = Math.min(60, Math.round((temp - threshold) * 20))
      return minutesActive
    }
    return 0
  })

  const coolerActivity = dataPoints.map((date, index) => {
    // Cooler is more active when temperature is very high
    const temp = temperatures[index]
    const threshold = 28
    if (temp > threshold) {
      // Calculate minutes active based on how much the temperature exceeds the threshold
      const minutesActive = Math.min(60, Math.round((temp - threshold) * 30))
      return minutesActive
    }
    return 0
  })

  const pumpActivity = dataPoints.map((date, index) => {
    // Pump activates occasionally when temperature is very high
    const temp = temperatures[index]
    const threshold = 30
    if (temp > threshold) {
      // Calculate minutes active based on how much the temperature exceeds the threshold
      const minutesActive = Math.min(15, Math.round((temp - threshold) * 5))
      return minutesActive
    }
    return 0
  })

  return {
    labels,
    temperatures,
    humidities,
    gasLevels,
    fanActivity,
    coolerActivity,
    pumpActivity,
  }
}

// Update statistics
function updateStatistics(data) {
  // Temperature statistics
  const tempAvg = document.getElementById("temp-avg")
  const tempMin = document.getElementById("temp-min")
  const tempMax = document.getElementById("temp-max")

  if (tempAvg && tempMin && tempMax && data.temperatures.length > 0) {
    const avgTemp = data.temperatures.reduce((sum, temp) => sum + temp, 0) / data.temperatures.length
    const minTemp = Math.min(...data.temperatures)
    const maxTemp = Math.max(...data.temperatures)

    tempAvg.textContent = `${avgTemp.toFixed(1)}°C`
    tempMin.textContent = `${minTemp.toFixed(1)}°C`
    tempMax.textContent = `${maxTemp.toFixed(1)}°C`
  }

  // Humidity statistics
  const humidityAvg = document.getElementById("humidity-avg")
  const humidityMin = document.getElementById("humidity-min")
  const humidityMax = document.getElementById("humidity-max")

  if (humidityAvg && humidityMin && humidityMax && data.humidities.length > 0) {
    const avgHumidity = data.humidities.reduce((sum, humidity) => sum + humidity, 0) / data.humidities.length
    const minHumidity = Math.min(...data.humidities)
    const maxHumidity = Math.max(...data.humidities)

    humidityAvg.textContent = `${avgHumidity.toFixed(1)}%`
    humidityMin.textContent = `${minHumidity.toFixed(1)}%`
    humidityMax.textContent = `${maxHumidity.toFixed(1)}%`
  }

  // Gas statistics
  const gasAvg = document.getElementById("gas-avg")
  const gasMin = document.getElementById("gas-min")
  const gasMax = document.getElementById("gas-max")

  if (gasAvg && gasMin && gasMax && data.gasLevels.length > 0) {
    const avgGas = data.gasLevels.reduce((sum, gas) => sum + gas, 0) / data.gasLevels.length
    const minGas = Math.min(...data.gasLevels)
    const maxGas = Math.max(...data.gasLevels)

    gasAvg.textContent = `${Math.round(avgGas)} ppm`
    gasMin.textContent = `${Math.round(minGas)} ppm`
    gasMax.textContent = `${Math.round(maxGas)} ppm`
  }

  // Activity statistics
  const fanOnTime = document.getElementById("fan-on-time")
  const coolerOnTime = document.getElementById("cooler-on-time")
  const pumpActivations = document.getElementById("pump-activations")

  if (fanOnTime && coolerOnTime && pumpActivations) {
    const totalFanMinutes = data.fanActivity.reduce((sum, minutes) => sum + minutes, 0)
    const totalCoolerMinutes = data.coolerActivity.reduce((sum, minutes) => sum + minutes, 0)
    const pumpActivationCount = data.pumpActivity.filter((minutes) => minutes > 0).length

    const fanHours = (totalFanMinutes / 60).toFixed(1)
    const coolerHours = (totalCoolerMinutes / 60).toFixed(1)

    fanOnTime.textContent = `${fanHours} hours`
    coolerOnTime.textContent = `${coolerHours} hours`
    pumpActivations.textContent = `${pumpActivationCount} times`
  }
}

// Export data handler
function exportDataHandler() {
  alert("Data export functionality would be implemented here.")
}

// Pagination handlers
function goToPrevPage() {
  const currentPageNum = Number.parseInt(currentPage.textContent)
  if (currentPageNum > 1) {
    currentPage.textContent = currentPageNum - 1
    updatePaginationButtons()
    // In a real application, this would fetch the previous page of data
  }
}

function goToNextPage() {
  const currentPageNum = Number.parseInt(currentPage.textContent)
  const totalPagesNum = Number.parseInt(totalPages.textContent)
  if (currentPageNum < totalPagesNum) {
    currentPage.textContent = currentPageNum + 1
    updatePaginationButtons()
    // In a real application, this would fetch the next page of data
  }
}

function updatePaginationButtons() {
  const currentPageNum = Number.parseInt(currentPage.textContent)
  const totalPagesNum = Number.parseInt(totalPages.textContent)

  prevPage.disabled = currentPageNum === 1
  nextPage.disabled = currentPageNum === totalPagesNum
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)

