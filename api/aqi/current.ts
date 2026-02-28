import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }
  
  const currentData = generateDummyAQI(Number(lat), Number(lon));
  res.status(200).json(currentData);
}
