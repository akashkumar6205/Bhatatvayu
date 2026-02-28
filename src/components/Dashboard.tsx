import { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Activity, AlertTriangle, Info, Menu, X, UserCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Guidelines from './Guidelines';
import Reports from './Reports';
import IndiaMap from './IndiaMap';
import About from './About';
import Chatbot from './Chatbot';
import Profile from './Profile';

interface AQIData {
  aqi: number;
  pm25: string;
  pm10: string;
  no2: string;
  so2: string;
  co: string;
  o3: string;
  temp: string;
  humidity: number;
  wind: string;
}

interface ForecastData {
  date: string;
  aqi: number;
  confidence: number;
}

interface AdvisoryData {
  level: string;
  general: string;
  vulnerable: string;
  patients: string;
}

export default function Dashboard() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [advisory, setAdvisory] = useState<AdvisoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'guidelines' | 'reports' | 'indiamap' | 'about' | 'profile'>('home');

  useEffect(() => {
    const saved = localStorage.getItem('bharatvayu_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.city) {
        setLocation(parsed.city);
        setSearchQuery(parsed.city);
        fetchData(34.0522 + Math.random(), -118.2437 + Math.random(), parsed.city);
      }
    }
  }, []);

  const handleHomeClick = () => {
    setCurrentView('home');
    setLocation('');
    setSearchQuery('');
    setAqiData(null);
    setForecast([]);
    setAdvisory(null);
    setIsMobileMenuOpen(false);
  };

  const fetchData = async (lat: number, lon: number, cityName?: string) => {
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`/api/aqi/current?lat=${lat}&lon=${lon}`),
        fetch(`/api/aqi/forecast?lat=${lat}&lon=${lon}&days=7`)
      ]);

      const current = await currentRes.json();
      const forecastData = await forecastRes.json();

      setAqiData(current);
      setForecast(forecastData);
      setLoading(false); // Stop loading immediately after fast API calls

      // Fetch advisory directly from Gemini in the background
      setAdvisory(null); // Clear previous advisory while loading
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Read profile for personalized health context
        const savedProfile = localStorage.getItem('bharatvayu_profile');
        let healthContext = '';
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.healthCondition && parsed.healthCondition !== 'none') {
            healthContext = `\nCRITICAL: The user has a specific health condition: ${parsed.healthCondition}. Tailor the 'patients' or 'vulnerable' advice specifically for this condition.`;
          }
        }

        const prompt = `
          The current Air Quality Index (AQI) in ${cityName || location || 'this area'} is ${current.aqi}.
          ${healthContext}
          Provide a short, structured health advisory based on this AQI level.
          Include specific advice for:
          1. General Public
          2. Children & Elderly
          3. Asthma / Heart Patients
          
          Keep it concise, actionable, and formatted as JSON with the following structure:
          {
            "level": "Good/Moderate/Unhealthy/Severe",
            "general": "advice",
            "vulnerable": "advice for children/elderly",
            "patients": "advice for patients"
          }
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const advisoryText = response.text;
        if (advisoryText) {
          setAdvisory(JSON.parse(advisoryText));
        }
      } catch (error) {
        console.error("Advisory error:", error);
        // Fallback advisory
        setAdvisory({
          level: current.aqi > 150 ? "Unhealthy" : "Moderate",
          general: "Limit prolonged outdoor exertion.",
          vulnerable: "Reduce prolonged or heavy outdoor exertion.",
          patients: "Avoid all outdoor physical activities."
        });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Ensure loading stops on error
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // In a real app, use a Geocoding API here
    // For prototype, we simulate a new location
    setLocation(searchQuery);
    fetchData(34.0522 + Math.random(), -118.2437 + Math.random(), searchQuery); // Randomize slightly
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-500 bg-green-50 border-green-200';
    if (aqi <= 100) return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    if (aqi <= 150) return 'text-orange-500 bg-orange-50 border-orange-200';
    if (aqi <= 200) return 'text-red-500 bg-red-50 border-red-200';
    if (aqi <= 300) return 'text-purple-500 bg-purple-50 border-purple-200';
    return 'text-rose-900 bg-rose-100 border-rose-300';
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight">Bharatvayu</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button 
              onClick={handleHomeClick} 
              className={`${currentView === 'home' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('indiamap')} 
              className={`${currentView === 'indiamap' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
            >
              India Map
            </button>
            <button 
              onClick={() => setCurrentView('guidelines')} 
              className={`${currentView === 'guidelines' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
            >
              Guidelines
            </button>
            <button 
              onClick={() => setCurrentView('reports')} 
              className={`${currentView === 'reports' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
            >
              Reports
            </button>
            <button 
              onClick={() => setCurrentView('about')} 
              className={`${currentView === 'about' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
            >
              About
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden lg:block w-64">
              <input
                type="text"
                placeholder="Search city or location..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </form>

            {/* Profile Button */}
            <button 
              onClick={() => setCurrentView('profile')}
              className={`p-2 rounded-full transition-colors ${currentView === 'profile' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Your Profile"
            >
              <UserCircle className="h-6 w-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg absolute w-full">
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              <button 
                onClick={handleHomeClick} 
                className={`text-left ${currentView === 'home' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
              >
                Home
              </button>
              <button 
                onClick={() => { setCurrentView('indiamap'); setIsMobileMenuOpen(false); }} 
                className={`text-left ${currentView === 'indiamap' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
              >
                India Map
              </button>
              <button 
                onClick={() => { setCurrentView('guidelines'); setIsMobileMenuOpen(false); }} 
                className={`text-left ${currentView === 'guidelines' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
              >
                Guidelines
              </button>
              <button 
                onClick={() => { setCurrentView('reports'); setIsMobileMenuOpen(false); }} 
                className={`text-left ${currentView === 'reports' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
              >
                Reports
              </button>
              <button 
                onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }} 
                className={`text-left ${currentView === 'about' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}`}
              >
                About
              </button>
            </nav>
          </div>
        )}
      </header>

      {currentView === 'guidelines' ? (
        <Guidelines />
      ) : currentView === 'reports' ? (
        <Reports location={location} />
      ) : currentView === 'indiamap' ? (
        <IndiaMap />
      ) : currentView === 'about' ? (
        <About />
      ) : currentView === 'profile' ? (
        <Profile onSave={() => setCurrentView('home')} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {!aqiData ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-2xl w-full">
              <Wind className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Check Air Quality Anywhere
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Enter a city or location to get real-time AQI data, AI-powered health advisories, and a 7-day forecast.
              </p>
              <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto mb-6">
                <input
                  type="text"
                  placeholder="Search for a city (e.g., Tokyo, London, Delhi)..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Search
                </button>
              </form>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-slate-500 mr-2">Suggested:</span>
                {['Delhi', 'Mumbai', 'Bangalore', 'London', 'New York', 'Tokyo'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSearchQuery(city);
                      setLocation(city);
                      fetchData(34.0522 + Math.random(), -118.2437 + Math.random(), city);
                    }}
                    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative w-full sm:hidden">
              <input
                type="text"
                placeholder="Search city..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            </form>

            {/* Top Section: Live AQI & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main AQI Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{location}</span>
              </div>
              
              <div className="flex items-end gap-4 mb-2">
                <span className="text-7xl font-bold tracking-tighter">
                  {aqiData?.aqi}
                </span>
                <span className="text-lg text-slate-500 mb-2 font-medium">AQI</span>
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getAQIColor(aqiData?.aqi || 0)}`}>
                {getAQIStatus(aqiData?.aqi || 0)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">PM2.5</span>
                <span className="font-mono font-medium">{aqiData?.pm25}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">PM10</span>
                <span className="font-mono font-medium">{aqiData?.pm10}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">O3</span>
                <span className="font-mono font-medium">{aqiData?.o3}</span>
              </div>
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-center items-center text-center">
              <Thermometer className="h-8 w-8 text-rose-500 mb-3" />
              <span className="text-2xl font-semibold">{aqiData?.temp}°C</span>
              <span className="text-sm text-slate-500 mt-1">Temperature</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-center items-center text-center">
              <Droplets className="h-8 w-8 text-blue-500 mb-3" />
              <span className="text-2xl font-semibold">{aqiData?.humidity}%</span>
              <span className="text-sm text-slate-500 mt-1">Humidity</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-center items-center text-center">
              <Wind className="h-8 w-8 text-teal-500 mb-3" />
              <span className="text-2xl font-semibold">{aqiData?.wind}</span>
              <span className="text-sm text-slate-500 mt-1">km/h Wind</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-center items-center text-center">
              <Activity className="h-8 w-8 text-indigo-500 mb-3" />
              <span className="text-2xl font-semibold">{aqiData?.no2}</span>
              <span className="text-sm text-slate-500 mt-1">NO2 Level</span>
            </div>
          </div>
        </div>

        {/* Middle Section: AI Prediction Chart & Health Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">7-Day AI Prediction</h2>
              <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100">LSTM Model</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Advisory */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold">AI Health Advisory</h2>
            </div>
            
            {advisory ? (
              <div className="space-y-4 flex-1">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">General Public</h3>
                  <p className="text-sm text-slate-600">{advisory.general}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Children & Elderly</h3>
                  <p className="text-sm text-slate-600">{advisory.vulnerable}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Asthma / Heart Patients</h3>
                  <p className="text-sm text-slate-600">{advisory.patients}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Generating advisory...
              </div>
            )}
          </div>

        </div>
        </>
        )}
      </main>
      )}
      
      {/* Global Chatbot */}
      <Chatbot location={location} aqi={aqiData?.aqi || null} />
    </div>
  );
}
