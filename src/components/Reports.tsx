import { useState, useEffect } from 'react';
import { FileText, AlertCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ReportData {
  time: string;
  aqi: number;
  type: 'Historical' | 'Forecast';
  formattedTime?: string;
}

export default function Reports({ location }: { location: string }) {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;
    
    const fetchReport = async () => {
      setLoading(true);
      try {
        // Using random lat/lon for the prototype
        const lat = 34.0522 + Math.random();
        const lon = -118.2437 + Math.random();
        
        const res = await fetch(`/api/aqi/report24h?lat=${lat}&lon=${lon}`);
        const json = await res.json();
        
        const combined = [...json.historical, ...json.forecast].map((d: any) => ({
          ...d,
          formattedTime: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setData(combined);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [location]);

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good', color: 'text-green-600', bg: 'bg-green-100' };
    if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (aqi <= 150) return { text: 'Unhealthy (Sensitive)', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (aqi <= 200) return { text: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-100' };
    if (aqi <= 300) return { text: 'Very Unhealthy', color: 'text-purple-600', bg: 'bg-purple-100' };
    return { text: 'Hazardous', color: 'text-rose-900', bg: 'bg-rose-200' };
  };

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
          <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Location Selected</h2>
          <p className="text-slate-600">
            Please go to the Home tab and search for a city to view its detailed 48-hour AQI report.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Find the "now" point to draw a reference line
  const nowIndex = data.findIndex(d => d.type === 'Forecast');
  const nowTime = nowIndex !== -1 ? data[nowIndex].formattedTime : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AQI Report</h1>
        </div>
        <p className="text-lg text-slate-600 mb-8 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          48-Hour Analysis (Past 24h & Future 24h) for <strong className="text-slate-900">{location}</strong>
        </p>

        {/* Chart Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">AQI Timeline</h2>
          <div className="h-80 w-full bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAqiReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="formattedTime" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                {nowTime && (
                  <ReferenceLine x={nowTime} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'NOW', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} />
                )}
                <Area type="monotone" dataKey="aqi" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAqiReport)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-200"></div>
              <span>Historical Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span>AI Forecast</span>
            </div>
          </div>
        </div>

        {/* Detailed Table Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Hourly Breakdown</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">AQI Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, index) => {
                  const status = getAQIStatus(row.aqi);
                  const prevAqi = index > 0 ? data[index - 1].aqi : row.aqi;
                  const isUp = row.aqi > prevAqi;
                  const isDown = row.aqi < prevAqi;
                  
                  return (
                    <tr key={index} className={`hover:bg-slate-50 transition-colors ${row.type === 'Forecast' && index === nowIndex ? 'bg-indigo-50/50' : ''}`}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {new Date(row.time).toLocaleDateString([], { month: 'short', day: 'numeric' })} {row.formattedTime}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.type === 'Historical' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-700'}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">
                        {row.aqi}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isUp ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : isDown ? (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
