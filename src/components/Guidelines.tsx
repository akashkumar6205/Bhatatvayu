import { Shield, BookOpen } from 'lucide-react';

export default function Guidelines() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Government AQI Guidelines</h1>
        </div>
        <p className="text-lg text-slate-600 mb-8">
          Standardized health guidelines and policies based on the National Air Quality Index (AQI) categories.
        </p>

        <div className="space-y-6">
          {/* Good */}
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
              <span className="bg-green-100 px-2 py-1 rounded text-sm">0 - 50</span> Good
            </h2>
            <p className="text-slate-600 mt-2">
              <strong>Health Impacts:</strong> Minimal impact. Air quality is considered satisfactory, and air pollution poses little or no risk.
            </p>
            <p className="text-slate-600 mt-1">
              <strong>Advisory:</strong> Ideal air quality for outdoor activities.
            </p>
          </div>

          {/* Satisfactory / Moderate */}
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h2 className="text-xl font-bold text-yellow-700 flex items-center gap-2">
              <span className="bg-yellow-100 px-2 py-1 rounded text-sm">51 - 100</span> Satisfactory / Moderate
            </h2>
            <p className="text-slate-600 mt-2">
              <strong>Health Impacts:</strong> May cause minor breathing discomfort to sensitive people.
            </p>
            <p className="text-slate-600 mt-1">
              <strong>Advisory:</strong> Unusually sensitive individuals should consider limiting prolonged outdoor exertion.
            </p>
          </div>

          {/* Moderately Polluted / Unhealthy for Sensitive Groups */}
          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <h2 className="text-xl font-bold text-orange-700 flex items-center gap-2">
              <span className="bg-orange-100 px-2 py-1 rounded text-sm">101 - 200</span> Moderately Polluted
            </h2>
            <p className="text-slate-600 mt-2">
              <strong>Health Impacts:</strong> May cause breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults.
            </p>
            <p className="text-slate-600 mt-1">
              <strong>Advisory:</strong> Sensitive groups should reduce prolonged or heavy outdoor exertion.
            </p>
          </div>

          {/* Poor / Unhealthy */}
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
              <span className="bg-red-100 px-2 py-1 rounded text-sm">201 - 300</span> Poor
            </h2>
            <p className="text-slate-600 mt-2">
              <strong>Health Impacts:</strong> May cause breathing discomfort to people on prolonged exposure, and discomfort to people with heart disease.
            </p>
            <p className="text-slate-600 mt-1">
              <strong>Advisory:</strong> Everyone should reduce prolonged or heavy outdoor exertion. Sensitive groups should avoid prolonged outdoor exertion.
            </p>
          </div>

          {/* Very Poor / Very Unhealthy */}
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h2 className="text-xl font-bold text-purple-700 flex items-center gap-2">
              <span className="bg-purple-100 px-2 py-1 rounded text-sm">301 - 400</span> Very Poor
            </h2>
            <p className="text-slate-600 mt-2">
              <strong>Health Impacts:</strong> May cause respiratory illness to the people on prolonged exposure. Effect may be more pronounced in people with lung and heart diseases.
            </p>
            <p className="text-slate-600 mt-1">
              <strong>Advisory:</strong> Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.
            </p>
          </div>

          {/* Severe / Hazardous */}
          <div className="border-l-4 border-rose-900 pl-4 py-2">
            <h2 className="text-xl font-bold text-rose-900 flex items-center gap-2">
              <span className="bg-rose-100 px-2 py-1 rounded text-sm">401 - 500+</span> Severe
            </h2>
            <p className="text-slate-600 mt-2">
              <strong>Health Impacts:</strong> May cause respiratory impact even on healthy people, and serious health impacts on people with lung/heart disease. The health impacts may be experienced even during light physical activity.
            </p>
            <p className="text-slate-600 mt-1">
              <strong>Advisory:</strong> Everyone should avoid all outdoor exertion.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Key Government Policies & Acts</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Air (Prevention and Control of Pollution) Act, 1981</h3>
            <p className="text-sm text-slate-600">
              An Act to provide for the prevention, control and abatement of air pollution, for the establishment of Boards with a view to carrying out the aforesaid purposes.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Environment (Protection) Act, 1986</h3>
            <p className="text-sm text-slate-600">
              Authorizes the central government to protect and improve environmental quality, control and reduce pollution from all sources, and prohibit or restrict the setting and /or operation of any industrial facility on environmental grounds.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">National Clean Air Programme (NCAP)</h3>
            <p className="text-sm text-slate-600">
              A long-term, time-bound, national level strategy to tackle the air pollution problem across the country in a comprehensive manner with targets to achieve 20% to 30% reduction in Particulate Matter concentrations by 2024.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Graded Response Action Plan (GRAP)</h3>
            <p className="text-sm text-slate-600">
              A set of emergency measures that kick in to prevent further deterioration of air quality once it reaches a certain threshold in the Delhi-NCR region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
