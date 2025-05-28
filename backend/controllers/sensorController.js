const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// Function to get sensor data from Supabase
const getSensorData = async (req, res) => {
  try {
    const limit = req.query.limit ? Number.parseInt(req.query.limit) : 10

    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    res.json(data)
  } catch (err) {
    console.error("Error fetching sensor data:", err)
    res.status(500).json({ error: "Error fetching sensor data", details: err.message })
  }
}

// Function to get the latest sensor reading
const getLatestSensorData = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)

    if (error) {
      throw error
    }

    if (data && data.length > 0) {
      res.json(data[0])
    } else {
      res.status(404).json({ error: "No sensor data found" })
    }
  } catch (err) {
    console.error("Error fetching latest sensor data:", err)
    res.status(500).json({ error: "Error fetching latest sensor data", details: err.message })
  }
}

// Function to get sensor data for a specific time range
const getSensorDataByTimeRange = async (req, res) => {
  try {
    const { start, end } = req.query

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end dates are required" })
    }

    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .gte("timestamp", start)
      .lte("timestamp", end)
      .order("timestamp", { ascending: true })

    if (error) {
      throw error
    }

    res.json(data)
  } catch (err) {
    console.error("Error fetching sensor data by time range:", err)
    res.status(500).json({ error: "Error fetching sensor data by time range", details: err.message })
  }
}

module.exports = {
  getSensorData,
  getLatestSensorData,
  getSensorDataByTimeRange,
}

