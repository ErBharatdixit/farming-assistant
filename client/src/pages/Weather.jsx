import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
      Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets,
      ArrowLeft, Search, Navigation, Calendar, Loader2, Info
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { useAuth } from "../context/AuthProvider";
import { useLanguage } from "../context/LanguageProvider";


// Utility functions
function cn(...classes) {
      return classes.filter(Boolean).join(" ");
}

// UI Components
const Card = ({ className, children }) => (
      <div className={cn("glass-card rounded-2xl p-6", className)}>
            {children}
      </div>
);

const CardHeader = ({ className, children }) => (
      <div className={cn("flex flex-col space-y-1.5 mb-6", className)}>
            {children}
      </div>
);

const CardTitle = ({ className, children }) => (
      <h3 className={cn("text-2xl font-bold leading-none tracking-tight text-gray-800", className)}>
            {children}
      </h3>
);

const CardContent = ({ className, children }) => (
      <div className={cn("", className)}>{children}</div>
);

// Weather icon helper
const WeatherIcon = ({ iconCode, className }) => {
      // Map OpenWeather codes to Lucide icons
      if (iconCode?.startsWith("01")) return <Sun className={cn("text-yellow-500", className)} />;
      if (iconCode?.startsWith("02") || iconCode?.startsWith("03") || iconCode?.startsWith("04"))
            return <Cloud className={cn("text-gray-400", className)} />;
      if (iconCode?.startsWith("09") || iconCode?.startsWith("10"))
            return <CloudRain className={cn("text-blue-400", className)} />;
      if (iconCode?.startsWith("11"))
            return <CloudLightning className={cn("text-purple-400", className)} />;
      return <Sun className={cn("text-yellow-500", className)} />;
};

const Weather = () => {
      const { t } = useLanguage();
      const [city, setCity] = useState("Delhi");
      const [currentWeather, setCurrentWeather] = useState(null);
      const [forecast, setForecast] = useState(null);
      const [loading, setLoading] = useState(true);
      const [searchCity, setSearchCity] = useState("");
      const [showDetailedLog, setShowDetailedLog] = useState(false);

      const fetchWeather = async (targetCity, lat, lon) => {
            setLoading(true);
            try {
                  let currentUrl = "/api/weather/current";
                  let forecastUrl = "/api/weather/forecast";

                  if (lat !== undefined && lon !== undefined) {
                        currentUrl += `?lat=${lat}&lon=${lon}`;
                        forecastUrl += `?lat=${lat}&lon=${lon}`;
                  } else {
                        currentUrl += `?city=${targetCity}`;
                        forecastUrl += `?city=${targetCity}`;
                  }

                  const [currentRes, forecastRes] = await Promise.all([
                        axiosInstance.get(currentUrl),
                        axiosInstance.get(forecastUrl)
                  ]);
                  setCurrentWeather(currentRes.data);
                  setForecast(forecastRes.data);
                  if (currentRes.data.city) {
                        setCity(currentRes.data.city);
                  }
            } catch (error) {
                  console.error("Weather error:", error);
                  toast.error("City not found or API error");
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                        (position) => {
                              const { latitude, longitude } = position.coords;
                              fetchWeather(null, latitude, longitude);
                        },
                        (error) => {
                              console.warn("Geolocation denied or failed:", error);
                              fetchWeather(city);
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                  );
            } else {
                  fetchWeather(city);
            }
      }, []);

      const handleSearch = (e) => {
            e.preventDefault();
            if (searchCity.trim()) {
                  setCity(searchCity);
                  fetchWeather(searchCity);
            }
      };

      return (
            <div className="min-h-screen flex flex-col bg-[url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2065&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-blue-900/20 to-slate-900/60 backdrop-blur-[2px] z-0"></div>

                  <div className="relative z-10 flex flex-col min-h-screen">
                        {/* Simple inline header for now to avoid dependency issues */}
                        <header className="fixed top-0 left-0 w-full glass z-50">
                              <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                                          <h1 className="text-xl font-bold tracking-tight text-gray-800">{t('appName')}</h1>
                                    </div>
                                    <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                                          {t('dashboard')}
                                    </Link>
                              </div>
                        </header>

                        <main className="flex-1 pt-28 pb-12">
                              <div className="container mx-auto px-6 max-w-6xl">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                          <Link to="/dashboard" className="inline-flex items-center text-gray-700 font-semibold hover:text-blue-700 transition-colors drop-shadow-sm">
                                                <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToDashboard')}
                                          </Link>

                                          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                                                <input
                                                      type="text"
                                                      placeholder={t('searchCityPlaceholder')}
                                                      value={searchCity}
                                                      onChange={(e) => setSearchCity(e.target.value)}
                                                      className="w-full p-3 pl-12 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all group-hover:bg-white"
                                                />
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                                                      {t('search')}
                                                </button>
                                          </form>
                                    </div>

                                    {loading ? (
                                          <div className="flex flex-col items-center justify-center min-h-[400px]">
                                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                                <p className="text-gray-500 font-medium">{t('fetchingWeather')}</p>
                                          </div>
                                    ) : currentWeather && (
                                          <div className="space-y-8 animate-fade-in">
                                                {/* Current Weather Card */}
                                                <div className="grid lg:grid-cols-3 gap-8">
                                                      <Card className="lg:col-span-2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white border-none shadow-2xl relative overflow-hidden group/main">
                                                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
                                                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                                                            <CardContent className="relative z-10 p-4">
                                                                  <div className="flex justify-between items-start mb-8">
                                                                        <div>
                                                                              <div className="flex items-center gap-2 mb-2">
                                                                                    <Navigation className="w-4 h-4 opacity-70" />
                                                                                    <h2 className="text-2xl font-bold tracking-tight">{currentWeather.city}</h2>
                                                                              </div>
                                                                              <p className="text-blue-100 opacity-90">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                                        </div>
                                                                        <WeatherIcon iconCode={currentWeather.icon} className="w-20 h-20" />
                                                                  </div>

                                                                  <div className="flex items-end gap-6 mb-12">
                                                                        <span className="text-8xl font-black leading-none">{Math.round(currentWeather.temp)}°</span>
                                                                        <div className="mb-2">
                                                                              <p className="text-2xl font-bold capitalize mb-1">{currentWeather.description}</p>
                                                                              <p className="text-blue-100 opacity-80">Feels like {Math.round(currentWeather.feels_like)}°</p>
                                                                        </div>
                                                                  </div>

                                                                  <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
                                                                        <div className="flex items-center gap-3">
                                                                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                                                    <Droplets className="w-5 h-5" />
                                                                              </div>
                                                                              <div>
                                                                                    <p className="text-xs opacity-70 uppercase tracking-widest font-bold">{t('humidity')}</p>
                                                                                    <p className="text-xl font-bold">{currentWeather.humidity}%</p>
                                                                              </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                                                    <Wind className="w-5 h-5" />
                                                                              </div>
                                                                              <div>
                                                                                    <p className="text-xs opacity-70 uppercase tracking-widest font-bold">{t('windSpeed')}</p>
                                                                                    <p className="text-xl font-bold">{currentWeather.wind_speed} km/h</p>
                                                                              </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                                                    <Calendar className="w-5 h-5" />
                                                                              </div>
                                                                              <div>
                                                                                    <p className="text-xs opacity-70 uppercase tracking-widest font-bold">{t('visibility')}</p>
                                                                                    <p className="text-xl font-bold">Clear Sky</p>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </CardContent>
                                                      </Card>

                                                      {/* Highlights/Advice Card */}
                                                      <Card className="bg-white/95 backdrop-blur-xl border border-white shadow-xl">
                                                            <CardHeader>
                                                                  <CardTitle className="text-lg flex items-center gap-2">
                                                                        <Info className="w-5 h-5 text-blue-600" />
                                                                        {t('farmingAdvice')}
                                                                  </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                  {currentWeather.humidity > 80 ? (
                                                                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                                              <p className="text-sm text-blue-800 font-medium">{t('highHumidityAdvice')}</p>
                                                                        </div>
                                                                  ) : (
                                                                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                                                              <p className="text-sm text-green-800 font-medium">{t('optimalConditionsAdvice')}</p>
                                                                        </div>
                                                                  )}
                                                                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                                                        <p className="text-sm text-orange-800 font-medium">
                                                                              {t('tempAdvice').replace('{temp}', Math.round(currentWeather.temp))}
                                                                        </p>
                                                                  </div>
                                                                  <button
                                                                        onClick={() => setShowDetailedLog(true)}
                                                                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors"
                                                                  >
                                                                        {t('viewDetailedLog')}
                                                                  </button>
                                                            </CardContent>
                                                      </Card>
                                                </div>

                                                {/* Forecast Section */}
                                                <div>
                                                      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                                            <Calendar className="w-6 h-6 text-blue-600" />
                                                            {t('sevenDayForecast')}
                                                      </h3>
                                                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                            {forecast?.forecast.map((day, index) => (
                                                                  <Card key={index} className="flex flex-col items-center text-center hover:scale-105 transition-all cursor-pointer bg-white/90 hover:bg-white border-white shadow-sm hover:shadow-lg">
                                                                        <p className="text-sm font-bold text-gray-500 mb-3">
                                                                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                                        </p>
                                                                        <WeatherIcon iconCode={day.icon} className="w-10 h-10 mb-3" />
                                                                        <div className="flex gap-2 mb-2">
                                                                              <span className="font-bold text-gray-800">{Math.round(day.temp_max)}°</span>
                                                                              <span className="text-gray-400">{Math.round(day.temp_min)}°</span>
                                                                        </div>
                                                                        <p className="text-[10px] uppercase tracking-tighter font-black text-gray-400 capitalize">{day.description}</p>
                                                                  </Card>
                                                            ))}
                                                      </div>
                                                </div>
                                          </div>
                                    )}
                              </div>
                        </main>
                  </div>

                  {/* Detailed Log Modal */}
                  {showDetailedLog && forecast && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                              <div
                                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                    onClick={() => setShowDetailedLog(false)}
                              ></div>
                              <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                              >
                                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                          <div>
                                                <h3 className="text-xl font-bold text-gray-800">{t('viewDetailedLog')}</h3>
                                                <p className="text-sm text-gray-500">{forecast.city} — Next 24 Hours</p>
                                          </div>
                                          <button
                                                onClick={() => setShowDetailedLog(false)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                          >
                                                <ArrowLeft className="w-6 h-6 text-gray-500 rotate-90 sm:rotate-0" />
                                          </button>
                                    </div>
                                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                                          <div className="space-y-4">
                                                {forecast.intervals.map((interval, index) => (
                                                      <div
                                                            key={index}
                                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group"
                                                      >
                                                            <div className="flex items-center gap-4">
                                                                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                        <WeatherIcon iconCode={interval.icon} className="w-6 h-6" />
                                                                  </div>
                                                                  <div>
                                                                        <p className="font-bold text-gray-800">{interval.time}</p>
                                                                        <p className="text-sm text-gray-500 capitalize">{interval.description}</p>
                                                                  </div>
                                                            </div>
                                                            <div className="text-right">
                                                                  <p className="text-2xl font-black text-blue-600">{Math.round(interval.temp)}°</p>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                                          <button
                                                onClick={() => setShowDetailedLog(false)}
                                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                          >
                                                Close
                                          </button>
                                    </div>
                              </motion.div>
                        </div>
                  )}
            </div>
      );
};

export default Weather;
