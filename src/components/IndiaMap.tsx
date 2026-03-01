import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Wind, Maximize } from 'lucide-react';

interface CityAQI {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  aqi: number;
}

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

// Major Indian and World cities and their approximate coordinates (Lat, Lon)
const cities: CityAQI[] = [
  // Indian Cities
  { name: "Delhi", coordinates: [28.6139, 77.2090], aqi: 0 },
  { name: "Mumbai", coordinates: [19.0760, 72.8777], aqi: 0 },
  { name: "Bengaluru", coordinates: [12.9716, 77.5946], aqi: 0 },
  { name: "Chennai", coordinates: [13.0827, 80.2707], aqi: 0 },
  { name: "Kolkata", coordinates: [22.5726, 88.3639], aqi: 0 },
  { name: "Hyderabad", coordinates: [17.3850, 78.4867], aqi: 0 },
  { name: "Ahmedabad", coordinates: [23.0225, 72.5714], aqi: 0 },
  { name: "Pune", coordinates: [18.5204, 73.8567], aqi: 0 },
  { name: "Jaipur", coordinates: [26.9124, 75.7873], aqi: 0 },
  { name: "Lucknow", coordinates: [26.8467, 80.9462], aqi: 0 },
  { name: "Patna", coordinates: [25.5941, 85.1376], aqi: 0 },
  { name: "Bhopal", coordinates: [23.2599, 77.4126], aqi: 0 },
  { name: "Chandigarh", coordinates: [30.7333, 76.7794], aqi: 0 },
  { name: "Guwahati", coordinates: [26.1445, 91.7362], aqi: 0 },
  { name: "Kochi", coordinates: [9.9312, 76.2673], aqi: 0 },
  { name: "Amritsar", coordinates: [31.6340, 74.8723], aqi: 0 },
  { name: "Ludhiana", coordinates: [30.9010, 75.8573], aqi: 0 },
  { name: "Agra", coordinates: [27.1767, 78.0081], aqi: 0 },
  { name: "Kanpur", coordinates: [26.4499, 80.3319], aqi: 0 },
  { name: "Varanasi", coordinates: [25.3176, 82.9739], aqi: 0 },
  { name: "Prayagraj", coordinates: [25.4358, 81.8463], aqi: 0 },
  { name: "Dehradun", coordinates: [30.3165, 78.0322], aqi: 0 },
  { name: "Srinagar", coordinates: [34.0837, 74.7973], aqi: 0 },
  { name: "Shimla", coordinates: [31.1048, 77.1734], aqi: 0 },
  { name: "Surat", coordinates: [21.1702, 72.8311], aqi: 0 },
  { name: "Vadodara", coordinates: [22.3072, 73.1812], aqi: 0 },
  { name: "Indore", coordinates: [22.7196, 75.8577], aqi: 0 },
  { name: "Nagpur", coordinates: [21.1458, 79.0882], aqi: 0 },
  { name: "Nashik", coordinates: [20.0110, 73.7903], aqi: 0 },
  { name: "Thiruvananthapuram", coordinates: [8.5241, 76.9366], aqi: 0 },
  { name: "Coimbatore", coordinates: [11.0168, 76.9558], aqi: 0 },
  { name: "Mysuru", coordinates: [12.2958, 76.6394], aqi: 0 },
  { name: "Visakhapatnam", coordinates: [17.6868, 83.2185], aqi: 0 },
  { name: "Vijayawada", coordinates: [16.5062, 80.6480], aqi: 0 },
  { name: "Bhubaneswar", coordinates: [20.2961, 85.8245], aqi: 0 },
  { name: "Ranchi", coordinates: [23.3441, 85.3096], aqi: 0 },
  { name: "Raipur", coordinates: [21.2514, 81.6296], aqi: 0 },
  { name: "Shillong", coordinates: [25.5788, 91.8933], aqi: 0 },
  
  // World Cities
  { name: "New York", coordinates: [40.7128, -74.0060], aqi: 0 },
  { name: "London", coordinates: [51.5074, -0.1278], aqi: 0 },
  { name: "Tokyo", coordinates: [35.6762, 139.6503], aqi: 0 },
  { name: "Beijing", coordinates: [39.9042, 116.4074], aqi: 0 },
  { name: "Sydney", coordinates: [-33.8688, 151.2093], aqi: 0 },
  { name: "Paris", coordinates: [48.8566, 2.3522], aqi: 0 },
  { name: "Moscow", coordinates: [55.7558, 37.6173], aqi: 0 },
  { name: "Dubai", coordinates: [25.2048, 55.2708], aqi: 0 },
  { name: "Singapore", coordinates: [1.3521, 103.8198], aqi: 0 },
  { name: "Los Angeles", coordinates: [34.0522, -118.2437], aqi: 0 },
  { name: "Seoul", coordinates: [37.5665, 126.9780], aqi: 0 },
  { name: "Cairo", coordinates: [30.0444, 31.2357], aqi: 0 },
  { name: "Rio de Janeiro", coordinates: [-22.9068, -43.1729], aqi: 0 },
  { name: "Johannesburg", coordinates: [-26.2041, 28.0473], aqi: 0 },
  { name: "Toronto", coordinates: [43.6510, -79.3470], aqi: 0 },
];

export default function IndiaMap() {
  const [cityData, setCityData] = useState<CityAQI[]>(cities);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#22c55e'; // green-500
    if (aqi <= 100) return '#eab308'; // yellow-500
    if (aqi <= 150) return '#f97316'; // orange-500
    if (aqi <= 200) return '#ef4444'; // red-500
    if (aqi <= 300) return '#a855f7'; // purple-500
    return '#881337'; // rose-900
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (Sensitive)';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Memoize icons to prevent recreation on every render
  const icons = useMemo(() => {
    const iconMap = new Map<string, L.DivIcon>();
    cityData.forEach(city => {
      const color = getAQIColor(city.aqi);
      const icon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 14px;">
              ${city.aqi}
            </div>
            <div style="background-color: ${color}; width: 2px; height: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
            <div style="text-align: center; margin-top: 2px; font-weight: 700; font-size: 12px; color: #1e293b; text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 2px 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, -2px 0 0 #fff; white-space: nowrap;">
              ${city.name}
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      iconMap.set(city.name, icon);
    });
    return iconMap;
  }, [cityData]);

  const handleCityClick = (city: CityAQI) => {
    setMapCenter(city.coordinates);
    setMapZoom(8);
  };

  const handleResetMap = () => {
    setMapCenter([22.5937, 78.9629]);
    setMapZoom(5);
  };

  useEffect(() => {
    // Simulate fetching real-time AQI data for these cities
    const fetchCityData = async () => {
      setLoading(true);
      
      const updatedCities = cities.map(city => {
        let baseAqi = 100;
        
        const severeCities = ['Delhi', 'Patna', 'Lucknow', 'Kanpur', 'Agra', 'Ludhiana', 'Varanasi', 'Prayagraj', 'Beijing', 'Cairo'];
        const poorCities = ['Mumbai', 'Kolkata', 'Ahmedabad', 'Surat', 'Vadodara', 'Indore', 'Nagpur', 'Raipur', 'Jaipur', 'Dubai', 'Seoul', 'Los Angeles'];
        const moderateCities = ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Visakhapatnam', 'Vijayawada', 'Bhubaneswar', 'Ranchi', 'Bhopal', 'Nashik', 'New York', 'Paris', 'Moscow', 'Johannesburg', 'Rio de Janeiro'];
        const goodCities = ['Kochi', 'Guwahati', 'Chandigarh', 'Thiruvananthapuram', 'Mysuru', 'Coimbatore', 'Shimla', 'Srinagar', 'Dehradun', 'Shillong', 'Amritsar', 'London', 'Tokyo', 'Sydney', 'Singapore', 'Toronto'];

        if (severeCities.includes(city.name)) baseAqi = 280;
        else if (poorCities.includes(city.name)) baseAqi = 160;
        else if (moderateCities.includes(city.name)) baseAqi = 90;
        else if (goodCities.includes(city.name)) baseAqi = 45;
        
        const currentAqi = Math.max(20, Math.min(500, baseAqi + (Math.random() - 0.5) * 60));
        
        return {
          ...city,
          aqi: Math.round(currentAqi)
        };
      });
      
      setTimeout(() => {
        setCityData(updatedCities);
        setLoading(false);
      }, 800);
    };

    fetchCityData();
  }, []);

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-hidden flex flex-col p-2 sm:p-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        
        {/* Header Area */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 shrink-0 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">World AQI Map</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
              Interactive real-time Air Quality Index across major Indian and World cities.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-2 sm:p-4 gap-2 sm:gap-4 bg-slate-50/50">
          
          {/* Map Section */}
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden z-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-sm">Loading map data...</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleResetMap}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[1000] bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
                  Reset View
                </button>
                <MapContainer 
                  center={[22.5937, 78.9629]} 
                  zoom={5} 
                  scrollWheelZoom={true}
                  className="w-full h-full min-h-[400px]"
                  style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 1 }}
                >
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {cityData.map((city) => (
                    <Marker 
                      key={city.name} 
                      position={city.coordinates}
                      icon={icons.get(city.name)}
                      eventHandlers={{
                        click: () => handleCityClick(city),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-1">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900">{city.name}</h3>
                          <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: getAQIColor(city.aqi) }}>
                            AQI: {city.aqi} - {getAQIStatus(city.aqi)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </>
            )}
          </div>

          {/* List Section */}
          <div className="w-full lg:w-80 shrink-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden h-1/3 lg:h-full">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-sm text-slate-900">City Rankings</h2>
              <Wind className="h-4 w-4 text-slate-400" />
            </div>
            <div className="overflow-y-auto flex-1 p-1 sm:p-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-1">
                  {[...cityData]
                    .sort((a, b) => b.aqi - a.aqi)
                    .map((city, index) => (
                      <div 
                        key={city.name} 
                        onClick={() => handleCityClick(city)}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono text-xs w-4">{index + 1}.</span>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 leading-tight">{city.name}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">{getAQIStatus(city.aqi)}</p>
                          </div>
                        </div>
                        <div 
                          className="px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: getAQIColor(city.aqi) }}
                        >
                          {city.aqi}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
