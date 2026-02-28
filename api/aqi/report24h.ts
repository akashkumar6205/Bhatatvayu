import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  const historical = [];
  const forecast = [];
  let currentAQI = 50 + Math.random() * 100;

  for (let i = 24; i > 0; i--) {
    const date = new Date();
    date.setHours(date.getHours() - i);
    const aqi = Math.max(10, Math.min(500, currentAQI + (Math.random() - 0.5) * 40));
    historical.push({
      time: date.toISOString(),
      aqi: Math.round(aqi),
      type: 'Historical'
    });
  }

  for (let i = 0; i <= 24; i++) {
    const date = new Date();
    date.setHours(date.getHours() + i);
    const aqi = Math.max(10, Math.min(500, currentAQI + (Math.random() - 0.5) * 40));
    forecast.push({
      time: date.toISOString(),
      aqi: Math.round(aqi),
      type: 'Forecast'
    });
  }

  res.status(200).json({ historical, forecast });
}
