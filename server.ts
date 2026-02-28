import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dummy data fallback for AQI
  const generateDummyAQI = (lat: number, lon: number) => {
    const baseAQI = 50 + Math.random() * 100;
    return {
      aqi: Math.round(baseAQI),
      pm25: (baseAQI * 0.4).toFixed(1),
      pm10: (baseAQI * 0.6).toFixed(1),
      no2: (baseAQI * 0.2).toFixed(1),
      so2: (baseAQI * 0.1).toFixed(1),
      co: (baseAQI * 0.05).toFixed(1),
      o3: (baseAQI * 0.3).toFixed(1),
      temp: (20 + Math.random() * 15).toFixed(1),
      humidity: Math.round(40 + Math.random() * 40),
      wind: (5 + Math.random() * 15).toFixed(1),
    };
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/aqi/current", (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat/lon" });
    }
    
    // In a real app, this would call an external API like OpenWeatherMap or WAQI
    // We use dummy data for the prototype
    const currentData = generateDummyAQI(Number(lat), Number(lon));
    res.json(currentData);
  });

  app.get("/api/aqi/forecast", (req, res) => {
    const { lat, lon, days = 7 } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat/lon" });
    }

    const forecast = [];
    let currentAQI = 50 + Math.random() * 100;
    
    for (let i = 0; i < Number(days); i++) {
      // Simulate some trend
      currentAQI += (Math.random() - 0.4) * 20;
      currentAQI = Math.max(10, Math.min(500, currentAQI));
      
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        aqi: Math.round(currentAQI),
        confidence: Math.round(95 - (i * 5) + Math.random() * 5) // Confidence drops over time
      });
    }

    res.json(forecast);
  });

  app.get("/api/aqi/report24h", (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat/lon" });
    }

    const historical = [];
    const forecast = [];
    let currentAQI = 50 + Math.random() * 100;

    // Past 24 hours
    for (let i = 24; i > 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      
      // Add some random fluctuation
      const aqi = Math.max(10, Math.min(500, currentAQI + (Math.random() - 0.5) * 40));
      
      historical.push({
        time: date.toISOString(),
        aqi: Math.round(aqi),
        type: 'Historical'
      });
    }

    // Future 24 hours
    for (let i = 0; i <= 24; i++) {
      const date = new Date();
      date.setHours(date.getHours() + i);
      
      // Add some random fluctuation
      const aqi = Math.max(10, Math.min(500, currentAQI + (Math.random() - 0.5) * 40));
      
      forecast.push({
        time: date.toISOString(),
        aqi: Math.round(aqi),
        type: 'Forecast'
      });
    }

    res.json({ historical, forecast });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
