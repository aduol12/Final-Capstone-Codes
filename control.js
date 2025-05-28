// Self-executing function to avoid global scope pollution
(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Only run initialization if elements exist
    if (!document.getElementById('theme-toggle')) {
      console.warn('Required DOM elements not found. Initialization aborted.');
      return;
    }
    
    // DOM Elements - use local variables to avoid redeclaration conflicts
    const themeToggle = document.getElementById("theme-toggle");
    const fanToggle = document.getElementById("fan-toggle");
    const fanStatus = document.getElementById("fan-status");
    const fanSpeed = document.getElementById("fan-speed");
    const fanSpeedValue = document.getElementById("fan-speed-value");
    
    const coolerToggle = document.getElementById("cooler-toggle");
    const coolerStatus = document.getElementById("cooler-status");
    const coolerPower = document.getElementById("cooler-power");
    const coolerPowerValue = document.getElementById("cooler-power-value");
    
    const pumpToggle = document.getElementById("pump-toggle");
    const pumpStatus = document.getElementById("pump-status");
    const pumpLastActive = document.getElementById("pump-last-active");
    
    const autoToggle = document.getElementById("auto-toggle");
    const autoStatus = document.getElementById("auto-status");
    
    const tempMin = document.getElementById("temp-min");
    const tempMax = document.getElementById("temp-max");
    const tempMinValue = document.getElementById("temp-min-value");
    const tempMaxValue = document.getElementById("temp-max-value");
    
    const humidityMin = document.getElementById("humidity-min");
    const humidityMax = document.getElementById("humidity-max");
    const humidityMinValue = document.getElementById("humidity-min-value");
    const humidityMaxValue = document.getElementById("humidity-max-value");
    
    const gasMin = document.getElementById("gas-min");
    const gasMax = document.getElementById("gas-max");
    const gasMinValue = document.getElementById("gas-min-value");
    const gasMaxValue = document.getElementById("gas-max-value");
    
    const saveFuzzySettings = document.getElementById("save-fuzzy-settings");
    const resetFuzzySettings = document.getElementById("reset-fuzzy-settings");
    
    // State - keep these local to this function
    let isFanOn = false;
    let isCoolerOn = false;
    let isPumpActive = false;
    let isAutoEnabled = true;
    
    // Theme toggle
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    });
    
    // Check for saved theme preference
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-theme");
    }
    
    // Toggle fan status with MQTT
    function toggleFan() {
      const newStatus = !isFanOn;
      const message = newStatus ? "ON" : "OFF";
      
      // Send MQTT message if client is available
      if (window.mqttClient && window.mqttClient.isConnected()) {
        console.log("Sending fan control via MQTT:", message);
        window.mqttClient.publish(window.mqttClient.topics.fanControl, message);
      } else {
        console.warn("MQTT client not connected, updating UI only");
      }
      
      // Update local state and UI
      isFanOn = newStatus;
      updateFanUI();
    }
    
    // Update fan UI based on current state
    function updateFanUI() {
      if (isFanOn) {
        fanToggle.textContent = "Turn Off";
        fanToggle.classList.add("active");
        fanStatus.textContent = "On";
        fanSpeed.disabled = false;
      } else {
        fanToggle.textContent = "Turn On";
        fanToggle.classList.remove("active");
        fanStatus.textContent = "Off";
        fanSpeed.disabled = true;
        fanSpeed.value = 0;
        fanSpeedValue.textContent = "0";
      }
    }
    
    // Update fan speed
    function updateFanSpeed() {
      fanSpeedValue.textContent = fanSpeed.value;
    }
    
    // Toggle cooler status with MQTT
    function toggleCooler() {
      const newStatus = !isCoolerOn;
      const message = newStatus ? "ON" : "OFF";
      
      // Send MQTT message if client is available
      if (window.mqttClient && window.mqttClient.isConnected()) {
        console.log("Sending cooler control via MQTT:", message);
        window.mqttClient.publish(window.mqttClient.topics.coolerControl, message);
      } else {
        console.warn("MQTT client not connected, updating UI only");
      }
      
      // Update local state and UI
      isCoolerOn = newStatus;
      updateCoolerUI();
    }
    
    // Update cooler UI based on current state
    function updateCoolerUI() {
      if (isCoolerOn) {
        coolerToggle.textContent = "Turn Off";
        coolerToggle.classList.add("active");
        coolerStatus.textContent = "On";
        coolerPower.disabled = false;
      } else {
        coolerToggle.textContent = "Turn On";
        coolerToggle.classList.remove("active");
        coolerStatus.textContent = "Off";
        coolerPower.disabled = true;
        coolerPower.value = 0;
        coolerPowerValue.textContent = "0";
      }
    }
    
    // Update cooler power
    function updateCoolerPower() {
      coolerPowerValue.textContent = coolerPower.value;
    }
    
    // Toggle pump status with MQTT
    function togglePump() {
      const newStatus = !isPumpActive;
      const message = newStatus ? "ON" : "OFF";
      
      // Send MQTT message if client is available
      if (window.mqttClient && window.mqttClient.isConnected()) {
        console.log("Sending pump control via MQTT:", message);
        window.mqttClient.publish(window.mqttClient.topics.pumpControl, message);
      } else {
        console.warn("MQTT client not connected, updating UI only");
      }
      
      // Update local state and UI
      isPumpActive = newStatus;
      updatePumpUI();
    }
    
    // Update pump UI based on current state
    function updatePumpUI() {
      if (isPumpActive) {
        pumpToggle.textContent = "Deactivate";
        pumpToggle.classList.add("active");
        pumpStatus.textContent = "Active";
    
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        pumpLastActive.textContent = formattedTime;
      } else {
        pumpToggle.textContent = "Activate";
        pumpToggle.classList.remove("active");
        pumpStatus.textContent = "Inactive";
      }
    }
    
    // Toggle auto mode
    function toggleAuto() {
      isAutoEnabled = !isAutoEnabled;
      updateAutoUI();
    }
    
    // Update auto mode UI based on current state
    function updateAutoUI() {
      if (isAutoEnabled) {
        autoToggle.textContent = "Disable";
        autoToggle.classList.add("active");
        autoStatus.textContent = "Enabled";
    
        // Disable manual controls when auto mode is enabled
        fanToggle.disabled = true;
        coolerToggle.disabled = true;
        pumpToggle.disabled = true;
      } else {
        autoToggle.textContent = "Enable";
        autoToggle.classList.remove("active");
        autoStatus.textContent = "Disabled";
    
        // Enable manual controls when auto mode is disabled
        fanToggle.disabled = false;
        coolerToggle.disabled = false;
        pumpToggle.disabled = false;
      }
    }
    
    // Update temperature range
    function updateTempRange() {
      // Ensure min doesn't exceed max
      if (Number.parseInt(tempMin.value) > Number.parseInt(tempMax.value)) {
        tempMin.value = tempMax.value;
      }
    
      tempMinValue.textContent = tempMin.value;
      tempMaxValue.textContent = tempMax.value;
    }
    
    // Update humidity range
    function updateHumidityRange() {
      // Ensure min doesn't exceed max
      if (Number.parseInt(humidityMin.value) > Number.parseInt(humidityMax.value)) {
        humidityMin.value = humidityMax.value;
      }
    
      humidityMinValue.textContent = humidityMin.value;
      humidityMaxValue.textContent = humidityMax.value;
    }
    
    // Update gas range
    function updateGasRange() {
      // Ensure min doesn't exceed max
      if (Number.parseInt(gasMin.value) > Number.parseInt(gasMax.value)) {
        gasMin.value = gasMax.value;
      }
    
      gasMinValue.textContent = gasMin.value;
      gasMaxValue.textContent = gasMax.value;
    }
    
    // Save fuzzy settings
    function saveFuzzySettingsHandler() {
      alert("Settings saved successfully!");
    }
    
    // Reset fuzzy settings to defaults
    function resetFuzzySettingsHandler() {
      // Reset temperature range
      tempMin.value = 18;
      tempMax.value = 30;
      tempMinValue.textContent = "18";
      tempMaxValue.textContent = "30";
    
      // Reset humidity range
      humidityMin.value = 40;
      humidityMax.value = 70;
      humidityMinValue.textContent = "40";
      humidityMaxValue.textContent = "70";
    
      // Reset gas range
      gasMin.value = 200;
      gasMax.value = 800;
      gasMinValue.textContent = "200";
      gasMaxValue.textContent = "800";
    }
    
    // Set up event listeners
    fanToggle.addEventListener("click", toggleFan);
    coolerToggle.addEventListener("click", toggleCooler);
    pumpToggle.addEventListener("click", togglePump);
    autoToggle.addEventListener("click", toggleAuto);
    
    fanSpeed.addEventListener("input", updateFanSpeed);
    coolerPower.addEventListener("input", updateCoolerPower);
    
    tempMin.addEventListener("input", updateTempRange);
    tempMax.addEventListener("input", updateTempRange);
    humidityMin.addEventListener("input", updateHumidityRange);
    humidityMax.addEventListener("input", updateHumidityRange);
    gasMin.addEventListener("input", updateGasRange);
    gasMax.addEventListener("input", updateGasRange);
    
    saveFuzzySettings.addEventListener("click", saveFuzzySettingsHandler);
    resetFuzzySettings.addEventListener("click", resetFuzzySettingsHandler);
    
    console.log("Control panel initialized with MQTT integration");
  });
})();