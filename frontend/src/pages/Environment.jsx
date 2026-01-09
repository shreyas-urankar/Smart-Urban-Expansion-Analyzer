import React, { useState, useEffect } from "react";
import axios from "axios";

function Environment() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const token = localStorage.getItem("token");

  // Mock data for environment module
  const mockData = {
    aqi: 185,
    status: "Poor",
    pm25: 158,
    pm10: 285,
    greenCover: 23,
    co2: 2.8,
    waterQuality: "Poor",
    cities: [
      { 
        name: "Delhi", 
        aqi: 185, 
        status: "Poor", 
        color: "#ff0000",
        pm25: 158,
        pm10: 285,
        greenCover: 23,
        co2: 2.8,
        waterQuality: "Poor",
        lat: 28.7041,
        lon: 77.1025
      },
      { 
        name: "Mumbai", 
        aqi: 95, 
        status: "Moderate", 
        color: "#ff7e00",
        pm25: 95,
        pm10: 180,
        greenCover: 18,
        co2: 2.2,
        waterQuality: "Moderate",
        lat: 19.0760,
        lon: 72.8777
      },
      { 
        name: "Bangalore", 
        aqi: 65, 
        status: "Fair", 
        color: "#ffff00",
        pm25: 65,
        pm10: 120,
        greenCover: 35,
        co2: 1.9,
        waterQuality: "Moderate",
        lat: 12.9716,
        lon: 77.5946
      },
      { 
        name: "Pune", 
        aqi: 72, 
        status: "Fair", 
        color: "#ffff00",
        pm25: 72,
        pm10: 135,
        greenCover: 28,
        co2: 2.0,
        waterQuality: "Good",
        lat: 18.5204,
        lon: 73.8567
      },
    ],
    trendData: [
      { day: "Mon", aqi: 180 },
      { day: "Tue", aqi: 170 },
      { day: "Wed", aqi: 190 },
      { day: "Thu", aqi: 185 },
      { day: "Fri", aqi: 175 },
      { day: "Sat", aqi: 165 },
      { day: "Sun", aqi: 160 }
    ]
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 200) return "#ff7e00";
    if (aqi <= 300) return "#ff0000";
    return "#99004c";
  };

  const getAQIText = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Fair";
    if (aqi <= 200) return "Moderate";
    if (aqi <= 300) return "Poor";
    return "Very Poor";
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Environment Data...</p>
        </div>
      </div>
    );
  }

  const selectedCityData = data.cities.find(city => city.name === selectedCity) || data.cities[0];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌿 Environmental Analytics</h1>
        <p className="text-gray-600 mb-4">Real-time air quality, pollution levels, and environmental metrics</p>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="text-lg">🔄</span>
              <span>Refresh Data</span>
            </button>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {data.cities.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()} • Using demo data
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* AQI Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Air Quality Index</h3>
            <span className="text-2xl">🌫️</span>
          </div>
          <div className="text-center mb-4">
            <div 
              className="text-5xl font-bold mb-2"
              style={{ color: getAQIColor(selectedCityData.aqi) }}
            >
              {selectedCityData.aqi}
            </div>
            <div 
              className="text-lg font-medium px-3 py-1 rounded-full inline-block"
              style={{ 
                backgroundColor: getAQIColor(selectedCityData.aqi) + "20",
                color: getAQIColor(selectedCityData.aqi)
              }}
            >
              {getAQIText(selectedCityData.aqi)}
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>PM2.5</span>
              <span className="font-medium">{selectedCityData.pm25} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>PM10</span>
              <span className="font-medium">{selectedCityData.pm10} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Green Cover Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Green Cover</h3>
            <span className="text-2xl">🌳</span>
          </div>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {selectedCityData.greenCover}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${selectedCityData.greenCover}%` }}
              ></div>
            </div>
            <div className="text-sm">
              {selectedCityData.greenCover < 20 ? (
                <span className="text-yellow-600">⚠️ Below recommended</span>
              ) : (
                <span className="text-green-600">✓ Within healthy range</span>
              )}
            </div>
          </div>
        </div>

        {/* CO2 Emissions Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">CO₂ Emissions</h3>
            <span className="text-2xl">☁️</span>
          </div>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-gray-700 mb-2">
              {selectedCityData.co2}
            </div>
            <div className="text-gray-600">tons per capita/year</div>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Global avg:</span>
              <span>4.7 tons</span>
            </div>
            <div className="flex justify-between">
              <span>Target:</span>
              <span className="text-green-600 font-medium">2.0 tons</span>
            </div>
          </div>
        </div>

        {/* Water Quality Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Water Quality</h3>
            <span className="text-2xl">💧</span>
          </div>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {selectedCityData.waterQuality}
            </div>
            <div className="text-sm text-gray-600">Drinking water standard</div>
          </div>
          <div className="text-sm text-center">
            {selectedCityData.waterQuality === "Good" || selectedCityData.waterQuality === "Excellent" 
              ? <span className="text-green-600">✓ Safe for consumption</span>
              : <span className="text-yellow-600">⚠️ Needs treatment</span>
            }
          </div>
        </div>
      </div>

      {/* AQI Trend */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold mb-6">AQI Trend (Last Week)</h3>
        <div className="flex items-end h-48 space-x-2">
          {data.trendData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t-lg"
                style={{ 
                  height: `${day.aqi / 3}px`,
                  backgroundColor: getAQIColor(day.aqi),
                  minHeight: '20px'
                }}
              ></div>
              <div className="mt-2 text-sm text-gray-600">{day.day}</div>
              <div className="text-xs font-medium" style={{ color: getAQIColor(day.aqi) }}>
                {day.aqi}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cities Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-6">City-wise Environmental Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AQI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Green Cover</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.cities.map((city) => (
                <tr key={city.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{city.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span style={{ color: getAQIColor(city.aqi) }} className="font-bold">
                      {city.aqi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      city.aqi <= 50 ? "bg-green-100 text-green-800" :
                      city.aqi <= 100 ? "bg-yellow-100 text-yellow-800" :
                      city.aqi <= 200 ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {getAQIText(city.aqi)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{city.pm25} µg/m³</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span>{city.greenCover}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            city.greenCover >= 30 ? "bg-green-500" :
                            city.greenCover >= 20 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${city.greenCover}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{city.co2} tons</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ About This Module</h3>
        <p className="text-blue-700">
          This Environment module shows air quality, pollution levels, green cover percentage, 
          CO₂ emissions, and water quality metrics. The data is currently simulated for demonstration.
          To connect real-time data, add your OpenWeather API key to the backend.
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-blue-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Fair (51-100)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Moderate (101-200)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Poor (201-300)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Environment;