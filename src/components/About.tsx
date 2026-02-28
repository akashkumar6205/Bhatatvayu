import { Wind, Activity, Brain, Shield, MapPin, BarChart3, CloudRain } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-4">
          <Wind className="h-12 w-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          About Bharatvayu
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Bharatvayu is an advanced Air Quality Index (AQI) prediction and monitoring platform designed to help you breathe safer. We combine real-time environmental data with artificial intelligence to provide actionable health insights.
        </p>
      </div>

      {/* How it Works Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform uses a multi-layered approach to gather, analyze, and predict air quality data, ensuring you always have the most accurate information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Activity className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. Data Collection</h3>
            <p className="text-slate-600">
              We aggregate real-time data from multiple environmental sensors, including PM2.5, PM10, NO2, SO2, Ozone, temperature, and humidity levels across various geographical locations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">2. AI Prediction (LSTM)</h3>
            <p className="text-slate-600">
              Using Long Short-Term Memory (LSTM) neural networks, we analyze historical trends and current meteorological data to forecast air quality up to 7 days in advance with high accuracy.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. Health Advisories</h3>
            <p className="text-slate-600">
              Our system integrates with Google's Gemini AI to generate context-aware, personalized health advisories based on the current AQI, protecting vulnerable groups like children and asthma patients.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 items-start">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive India Map</h3>
            <p className="text-slate-600">
              Explore real-time air quality across 38 major Indian cities through our interactive, color-coded geographic map.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 items-start">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Detailed Reports</h3>
            <p className="text-slate-600">
              Generate comprehensive PDF reports detailing pollutant breakdowns, historical trends, and environmental factors for any searched location.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 items-start">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl shrink-0">
            <CloudRain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Meteorological Context</h3>
            <p className="text-slate-600">
              Air quality doesn't exist in a vacuum. We track wind speed, temperature, and humidity to understand how weather patterns affect local pollution levels.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 items-start">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">WHO Guidelines</h3>
            <p className="text-slate-600">
              Compare local pollutant levels directly against the latest World Health Organization (WHO) safety thresholds to understand true health risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
