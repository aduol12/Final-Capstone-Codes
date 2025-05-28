const mqtt = require("mqtt")
const supabase = require("./supabaseService")

const client = mqtt.connect(process.env.MQTT_BROKER, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
})

let sensorData = { temperature: null, humidity: null, gas_level: null }

client.on("connect", () => {
  console.log("✅ MQTT Connected")
  client.subscribe("sensor/temperature")
  client.subscribe("sensor/humidity")
  client.subscribe("sensor/gas")
})

client.on("message", async (topic, message) => {
  const value = Number.parseFloat(message.toString())
  console.log(`Received message on topic ${topic}: ${value}`)

  if (topic === "sensor/temperature") sensorData.temperature = value
  if (topic === "sensor/humidity") sensorData.humidity = value
  if (topic === "sensor/gas") sensorData.gas_level = value

  if (sensorData.temperature !== null && sensorData.humidity !== null && sensorData.gas_level !== null) {
    try {
      const timestamp = new Date().toISOString()
      const dataToInsert = {
        ...sensorData,
        timestamp,
      }

      console.log("Inserting data into Supabase:", dataToInsert)

      const { data, error } = await supabase.from("sensor_data").insert([dataToInsert])

      if (error) {
        console.error("Error inserting data into Supabase:", error)
      } else {
        console.log("Data successfully inserted into Supabase")
      }

      // Reset sensor data after successful insertion
      sensorData = { temperature: null, humidity: null, gas_level: null }
    } catch (err) {
      console.error("Error processing sensor data:", err)
    }
  }
})

// Function to publish control commands
const publishControl = (device, status) => {
  const topic = `control/${device}`
  const message = status ? "1" : "0"

  client.publish(topic, message, { qos: 1 }, (err) => {
    if (err) {
      console.error(`Error publishing to ${topic}:`, err)
    } else {
      console.log(`Published to ${topic}: ${message}`)
    }
  })
}

module.exports = {
  client,
  publishControl,
}

