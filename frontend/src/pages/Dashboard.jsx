import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const username = localStorage.getItem("user") || "User";
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [insights, setInsights] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchData = useCallback(async () => {
    // Sample data as fallback
    const sampleMetrics = [
      { icon: "🏙️", title: "Urban Areas", value: "247", change: "+12%", trend: "up" },
      { icon: "📈", title: "Growth Rate", value: "12.5%", change: "+2.3%", trend: "up" },
      { icon: "👥", title: "Population", value: "2.3M", change: "+5.7%", trend: "up" },
      { icon: "🌿", title: "Green Space", value: "38%", change: "-1.2%", trend: "down" }
    ];

    const sampleGrowthData = [65, 78, 90, 81, 56, 55, 40, 72, 85, 92, 88, 95];

    const sampleInsights = [
      { icon: "🚀", text: "Downtown area showing 25% growth", type: "positive" },
      { icon: "⚠️", text: "Traffic congestion increased by 18%", type: "warning" },
      { icon: "✅", text: "New green zones established", type: "positive" },
      { icon: "📊", text: "Population density optimal in 78% zones", type: "neutral" }
    ];

    try {
      const response = await axios.get("http://localhost:5000/api/data");
      const data = response.data;
      
      if (Array.isArray(data) && data.length > 0) {
        setApiData(data);
        // Transform API data for dashboard display
        const transformedMetrics = [
          { icon: "🏙️", title: "Cities Monitored", value: data.length.toString(), change: "+5%", trend: "up" },
          { icon: "👥", title: "Avg Population", value: Math.round(data.reduce((acc, city) => acc + parseInt(city.population || 0), 0) / data.length).toLocaleString(), change: "+3.2%", trend: "up" },
          { icon: "📈", title: "Data Points", value: (data.length * 1000).toLocaleString(), change: "+8%", trend: "up" },
          { icon: "🌿", title: "Low Pollution", value: `${Math.round((data.filter(city => city.pollutionLevel === 'Low').length / data.length) * 100)}%`, change: "+2.1%", trend: "up" }
        ];
        
        setMetrics(transformedMetrics);
      } else {
        // Use sample data if API returns empty array
        setMetrics(sampleMetrics);
      }
      
      setGrowthData(sampleGrowthData);
      setInsights(sampleInsights);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      // Use sample data if API fails
      setMetrics(sampleMetrics);
      setGrowthData(sampleGrowthData);
      setInsights(sampleInsights);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Urban Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Urban Growth Analytics</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <span className="text-blue-600 font-semibold">{username}</span> • Last updated: Today, 2:30 PM
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <span>📅</span>
                <span>This Month</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <span>📥</span>
                <span>Export Report</span>
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {["overview", "population", "infrastructure", "environment", "reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* API Data Section */}
        {apiData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Real Urban Data from API</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{item.city || `City ${index + 1}`}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.pollutionLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      item.pollutionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.pollutionLevel || 'Unknown'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>👥 Population: {item.population || 'N/A'}</p>
                    <p>🏠 Density: {item.density || 'N/A'}</p>
                    <p>📈 Growth: {item.growth || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-2xl">{metric.icon}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-4">{metric.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{metric.title}</p>
              <div className="flex items-center mt-3">
                <div className={`w-16 h-1 rounded-full ${
                  metric.trend === "up" ? "bg-green-500" : "bg-red-500"
                }`}></div>
                <span className={`text-xs ml-2 ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.trend === "up" ? "Growing" : "Declining"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Urban Growth Trend</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white">
                <option>Last 12 Months</option>
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {growthData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-blue-500 cursor-pointer group-hover:scale-105"
                    style={{ height: `${value}%` }}
                    title={`${value}% growth`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                  insight.type === 'positive' ? 'bg-green-50 border border-green-200' :
                  insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`text-lg ${
                    insight.type === 'positive' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {insight.icon}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Population Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Population Distribution</h3>
            <div className="space-y-4">
              {[
                { label: "Downtown Core", value: 35, color: "bg-blue-500" },
                { label: "Suburban Areas", value: 45, color: "bg-green-500" },
                { label: "Industrial Zones", value: 12, color: "bg-yellow-500" },
                { label: "Rural Outskirts", value: 8, color: "bg-purple-500" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500 group-hover:scale-105`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Infrastructure Status</h3>
            <div className="space-y-4">
              {[
                { category: "Road Networks", status: "Optimal", progress: 85, color: "bg-green-500" },
                { category: "Public Transport", status: "Good", progress: 72, color: "bg-blue-500" },
                { category: "Utilities", status: "Needs Attention", progress: 45, color: "bg-yellow-500" },
                { category: "Digital Infrastructure", status: "Excellent", progress: 92, color: "bg-green-500" }
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full transition-all ${
                      item.status === "Optimal" || item.status === "Excellent" 
                        ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                        : item.status === "Good"
                        ? "bg-blue-100 text-blue-800 group-hover:bg-blue-200"
                        : "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streamlit Dashboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Live Urban Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">Real-time data visualization and predictive analytics</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
          <iframe
            src="http://localhost:8501"
            width="100%"
            height="800px"
            className="border-0"
            title="Streamlit Dashboard"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;