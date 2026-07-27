import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Droplets,
  CloudRain,
  ArrowRight,
  TrendingUp,
  Sun,
  Wind,
  Cloud,
  LogOut,
} from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";
import { useAuth } from "../context/AuthProvider";
import { useLanguage } from "../context/LanguageProvider";
import LanguageSelector from "../components/LanguageSelector";

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
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-gray-800",
      className
    )}
  >
    {children}
  </h3>
);

const CardDescription = ({ className, children }) => (
  <p className={cn("text-sm text-gray-500", className)}>{children}</p>
);

const CardContent = ({ className, children }) => (
  <div className={cn("", className)}>{children}</div>
);

// Header component
const Header = () => {
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 w-full glass z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">{t('appName')}</h1>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/dashboard" className="text-sm font-medium text-green-600">
            {t('dashboard')}
          </Link>
          <Link
            to="/crop-recommendation"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            {t('crops')}
          </Link>
          <Link to="/weather" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
            {t('weather')}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer" alt="User" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.fullName || t('farmer')}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

// Footer component
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 py-8 text-center text-sm text-gray-400 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <p>© {new Date().getFullYear()} {t('appName')}. {t('footerTagline')}</p>
    </footer>
  );
};

// Main Dashboard
const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = React.useState(null);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await axiosInstance.get(`/api/weather/current?lat=${latitude}&lon=${longitude}`);
              setWeatherData(response.data);
            },
            async (error) => {
              console.warn("Geolocation error:", error);
              // Fallback to Delhi
              const response = await axiosInstance.get("/api/weather/current?city=Delhi");
              setWeatherData(response.data);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          // Fallback to Delhi if geolocation not supported
          const response = await axiosInstance.get("/api/weather/current?city=Delhi");
          setWeatherData(response.data);
        }
      } catch (error) {
        console.error("Dashboard weather error:", error);
      }
    };
    fetchWeather();
  }, []);

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    if (hour < 21) return t('goodEvening');
    return t('goodNight');
  };

  // Get first name from full name
  const getFirstName = () => {
    if (!user?.fullName) return t('farmer');
    return user.fullName.split(" ")[0];
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-green-50/90 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 pt-28 pb-12">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <div className="mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {getGreeting()}, <span className="text-green-600">{getFirstName()}!</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                {t('dashboardWelcome')}
              </p>
            </div>

            {/* Weather Overview - Premium Glass Card */}
            <div className="mb-12 animate-fade-in delay-100">
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-100/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    {t('currentWeather')}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200/50">
                    <div className="p-2">
                      <p className="text-4xl font-bold text-gray-800 mb-1">{weatherData ? `${Math.round(weatherData.temp)}°` : "28°"}</p>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{t('temperature')}</p>
                    </div>

                    <div className="p-2">
                      <div className="flex justify-center mb-2">
                        <Droplets className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{weatherData ? `${weatherData.humidity}%` : "65%"}</p>
                      <p className="text-gray-500 text-sm">{t('humidity')}</p>
                    </div>

                    <div className="p-2">
                      <div className="flex justify-center mb-2">
                        <Wind className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{weatherData ? `${weatherData.wind_speed} km/h` : "12 km/h"}</p>
                      <p className="text-gray-500 text-sm">{t('windSpeed')}</p>
                    </div>

                    <div className="p-2">
                      <div className="flex justify-center mb-2">
                        <Cloud className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800 capitalize text-sm">{weatherData ? weatherData.description : "15%"}</p>
                      <p className="text-gray-500 text-sm">{weatherData ? "Condition" : t('rainChance')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Tools Grid */}
            <h3 className="text-2xl font-bold text-gray-800 mb-6 animate-fade-in delay-200">{t('smartFarmingTools')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-200">
              {/* Crop Recommendation */}
              <Link to="/crop-recommendation" className="group">
                <Card className="h-full hover:border-green-400/50 hover:bg-white/90 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sprout className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('cropRecommendation')}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t('cropRecommendationDesc')}
                  </p>
                </Card>
              </Link>

              {/* Fertilizer */}
              <Link to="/fertilizer" className="group">
                <Card className="h-full hover:border-blue-400/50 hover:bg-white/90 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Droplets className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('fertilizerGuide')}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t('fertilizerGuideDesc')}
                  </p>
                </Card>
              </Link>



              {/* Weather */}
              <Link to="/weather" className="group">
                <Card className="h-full hover:border-purple-400/50 hover:bg-white/90 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CloudRain className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('weatherForecast')}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t('weatherForecastDesc')}
                  </p>
                </Card>
              </Link>


            </div>

            {/* Recent Activity */}
            <div className="mt-12 animate-fade-in delay-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    {t('recentActivity')}
                  </CardTitle>
                  <CardDescription>{t('recentActivityDesc')}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Crop Recommendation Completed</p>
                      <p className="text-sm text-gray-500">
                        Wheat is best for your soil based on recent analysis.
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">2h ago</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <CloudRain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Weather Alert</p>
                      <p className="text-sm text-gray-500">
                        Heavy rain expected in 3 days. Prepare drainage.
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">1d ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
