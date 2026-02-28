import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lon, days = 7 } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  const forecast = [];
  let currentAQI = 50 + Math.random() * 100;
  
  for (let i = 0; i < Number(days); i++) {
    currentAQI += (Math.random() - 0.4) * 20;
    currentAQI = Math.max(10, Math.min(500, currentAQI));
    
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      aqi: Math.round(currentAQI),
      confidence: Math.round(95 - (i * 5) + Math.random() * 5)
    });
  }

  res.status(200).json(forecast);
}
