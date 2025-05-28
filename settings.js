// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const settingsNavItems = document.querySelectorAll(".settings-nav li")
const settingsSections = document.querySelectorAll(".settings-section")
const themeSelect = document.getElementById("theme-select")
const saveSettings = document.getElementById("save-settings")
const cancelSettings = document.getElementById("cancel-settings")

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme")
  localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark")
  updateThemeSelect()
})

// Check for saved theme preference
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme")
}

// Initialize the application
function initApp() {
  // Set up event listeners for settings navigation
  settingsNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetSection = item.getAttribute("data-target")
      showSettingsSection(targetSection)
    })
  })

  // Set up theme select
  updateThemeSelect()
  themeSelect.addEventListener("change", handleThemeChange)

  // Set up buttons
  saveSettings.addEventListener("click", saveSettingsHandler)
  cancelSettings.addEventListener("click", cancelSettingsHandler)

  // Set up other interactive elements
  setupInteractiveElements()
}

// Show the selected settings section
function showSettingsSection(sectionId) {
  // Update navigation
  settingsNavItems.forEach((item) => {
    if (item.getAttribute("data-target") === sectionId) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

  // Update sections
  settingsSections.forEach((section) => {
    if (section.id === sectionId) {
      section.classList.add("active")
    } else {
      section.classList.remove("active")
    }
  })
}

// Update theme select based on current theme
function updateThemeSelect() {
  if (document.body.classList.contains("light-theme")) {
    themeSelect.value = "light"
  } else {
    themeSelect.value = "dark"
  }
}

// Handle theme change from select
function handleThemeChange() {
  if (themeSelect.value === "light") {
    document.body.classList.add("light-theme")
    localStorage.setItem("theme", "light")
  } else if (themeSelect.value === "dark") {
    document.body.classList.remove("light-theme")
    localStorage.setItem("theme", "dark")
  } else {
    // System default - would check system preference in a real app
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (prefersDark) {
      document.body.classList.remove("light-theme")
    } else {
      document.body.classList.add("light-theme")
    }
    localStorage.removeItem("theme")
  }
}

// Set up other interactive elements
function setupInteractiveElements() {
  // System settings buttons
  document.getElementById("check-updates").addEventListener("click", () => {
    alert("Checking for updates...")
  })

  document.getElementById("backup-system").addEventListener("click", () => {
    alert("System configuration backup created.")
  })

  document.getElementById("restore-system").addEventListener("click", () => {
    alert("Please select a backup file to restore from.")
  })

  document.getElementById("factory-reset").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all settings to factory defaults? This action cannot be undone.")) {
      alert("System has been reset to factory defaults.")
    }
  })

  document.getElementById("export-all-data").addEventListener("click", () => {
    alert("Exporting all data...")
  })

  document.getElementById("clear-all-data").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all collected data? This action cannot be undone.")) {
      alert("All data has been cleared.")
    }
  })

  // Sensor calibration
  document.getElementById("calibrate-sensors").addEventListener("click", () => {
    alert("Sensor calibration started. This may take a few minutes.")
  })

  // Network settings
  document.getElementById("test-mqtt").addEventListener("click", () => {
    alert("MQTT connection test successful!")
  })

  document.getElementById("test-api").addEventListener("click", () => {
    alert("API connection test successful!")
  })

  document.getElementById("generate-api-key").addEventListener("click", () => {
    document.getElementById("api-key").value = "api_" + Math.random().toString(36).substring(2, 15)
    alert("New API key generated. Be sure to save your changes.")
  })

  // Account settings
  document.getElementById("update-profile").addEventListener("click", () => {
    alert("Profile updated successfully!")
  })

  document.getElementById("logout-all-devices").addEventListener("click", () => {
    if (confirm("Are you sure you want to log out from all devices?")) {
      alert("You have been logged out from all devices.")
    }
  })
}

// Save settings handler
function saveSettingsHandler() {
  alert("Settings saved successfully!")
}

// Cancel settings handler
function cancelSettingsHandler() {
  if (confirm("Are you sure you want to discard your changes?")) {
    // In a real application, this would reset all form fields to their original values
    alert("Changes discarded.")
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)

