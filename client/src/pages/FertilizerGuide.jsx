import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Droplets, ArrowLeft, Loader2, Beaker, LogOut, Info } from "lucide-react";
import toast from "react-hot-toast";
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
      <div className={cn("flex flex-col space-y-1.5 mb-6", className)}>
            {children}
      </div>
);

const CardTitle = ({ className, children }) => (
      <h3
            className={cn(
                  "text-2xl font-bold leading-none tracking-tight text-gray-800",
                  className
            )}
      >
            {children}
      </h3>
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
                              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
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

const InputField = ({ label, name, value, onChange, placeholder, icon: Icon, step = "1" }) => (
      <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-blue-600" />}
                  {label}
            </label>
            <div className="relative group">
                  <input
                        type="number"
                        name={name}
                        value={value}
                        onChange={onChange}
                        required
                        step={step}
                        className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all group-hover:bg-white"
                        placeholder={placeholder}
                  />
            </div>
      </div>
);

const FertilizerGuide = () => {
      const { t } = useLanguage();
      const [formData, setFormData] = useState({
            temperature: "",
            humidity: "",
            moisture: "",
            soilType: "",
            cropType: "",
            N: "",
            K: "",
            P: "",
      });
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState(null);

      const soilTypes = ["Sandy", "Loamy", "Black", "Red", "Clayey"];
      const crops = [
            "Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy",
            "Barley", "Wheat", "Millets", "Oil seeds", "Pulses", "Ground Nuts"
      ];

      const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!formData.cropType || !formData.soilType) {
                  toast.error("Please select both Soil Type and Crop Type");
                  return;
            }
            setLoading(true);
            setResult(null);

            try {
                  const response = await axiosInstance.post("/api/fertilizer/predict", formData);
                  setResult(response.data);
                  toast.success("Analysis complete!");
            } catch (error) {
                  toast.error("Failed to get fertilizer prediction.");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex flex-col bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
                  <div className="absolute inset-0 bg-blue-50/90 backdrop-blur-[2px] z-0"></div>

                  <div className="relative z-10 flex flex-col min-h-screen">
                        <Header />

                        <main className="flex-1 pt-28 pb-12">
                              <div className="container mx-auto px-6 max-w-5xl">
                                    <Link
                                          to="/dashboard"
                                          className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
                                    >
                                          <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToDashboard')}
                                    </Link>

                                    <div className="grid md:grid-cols-3 gap-8 items-start">
                                          {/* Form Section */}
                                          <div className="md:col-span-2 animate-fade-in">
                                                <Card>
                                                      <CardHeader>
                                                            <CardTitle className="flex items-center gap-3">
                                                                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                                                        <Droplets className="w-6 h-6 text-blue-600" />
                                                                  </div>
                                                                  {t('fertilizerTitle')}
                                                            </CardTitle>
                                                            <p className="text-gray-500 text-sm">
                                                                  Providing Precise Soil and Crop Recommendations
                                                            </p>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <form onSubmit={handleSubmit} className="gap-6 grid grid-cols-1 md:grid-cols-2">
                                                                  <div className="space-y-4">
                                                                        <h4 className="font-semibold text-gray-800 border-b pb-1">Soil Nutrients</h4>
                                                                        <InputField label={t('nitrogen')} name="N" value={formData.N} onChange={handleChange} placeholder="e.g. 80" icon={Beaker} />
                                                                        <InputField label={t('phosphorus')} name="P" value={formData.P} onChange={handleChange} placeholder="e.g. 40" icon={Beaker} />
                                                                        <InputField label={t('potassium')} name="K" value={formData.K} onChange={handleChange} placeholder="e.g. 40" icon={Beaker} />
                                                                  </div>

                                                                  <div className="space-y-4">
                                                                        <h4 className="font-semibold text-gray-800 border-b pb-1">Environment & Soil</h4>
                                                                        <InputField label="Temperature (°C)" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g. 26" icon={Info} />
                                                                        <InputField label="Humidity (%)" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g. 52" icon={Info} />
                                                                        <InputField label="Soil Moisture" name="moisture" value={formData.moisture} onChange={handleChange} placeholder="e.g. 38" icon={Info} />
                                                                  </div>

                                                                  <div className="space-y-4">
                                                                        <h4 className="font-semibold text-gray-800 border-b pb-1">Classifications</h4>
                                                                        <div className="space-y-2">
                                                                              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                                    Soil Type
                                                                              </label>
                                                                              <select
                                                                                    name="soilType"
                                                                                    value={formData.soilType}
                                                                                    onChange={handleChange}
                                                                                    className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all hover:bg-white text-sm"
                                                                                    required
                                                                              >
                                                                                    <option value="">-- Select Soil --</option>
                                                                                    {soilTypes.map((s) => (
                                                                                          <option key={s} value={s}>{s}</option>
                                                                                    ))}
                                                                              </select>
                                                                        </div>
                                                                  </div>

                                                                  <div className="space-y-4">
                                                                        <h4 className="font-semibold text-gray-800 border-b pb-1 md:invisible">Classifications Cont.</h4>
                                                                        <div className="space-y-2">
                                                                              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                                    Crop Type
                                                                              </label>
                                                                              <select
                                                                                    name="cropType"
                                                                                    value={formData.cropType}
                                                                                    onChange={handleChange}
                                                                                    className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all hover:bg-white text-sm"
                                                                                    required
                                                                              >
                                                                                    <option value="">-- Select Crop --</option>
                                                                                    {crops.map((c) => (
                                                                                          <option key={c} value={c}>{c}</option>
                                                                                    ))}
                                                                              </select>
                                                                        </div>
                                                                  </div>

                                                                  <div className="md:col-span-2">
                                                                        <button
                                                                              type="submit"
                                                                              disabled={loading}
                                                                              className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 font-semibold text-lg"
                                                                        >
                                                                              {loading ? (
                                                                                    <>
                                                                                          <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                                                                                    </>
                                                                              ) : (
                                                                                    "Predict Best Fertilizer"
                                                                              )}
                                                                        </button>
                                                                  </div>
                                                            </form>
                                                      </CardContent>
                                                </Card>
                                          </div>

                                          {/* Result Section */}
                                          <div className="animate-fade-in delay-200">
                                                <Card className="h-full bg-gradient-to-b from-blue-50/80 to-white border-blue-100 sticky top-28">
                                                      <CardHeader>
                                                            <CardTitle className="text-blue-800 text-center">{t('recommendationResult')}</CardTitle>
                                                      </CardHeader>
                                                      <CardContent className="flex flex-col items-center justify-center text-center min-h-[300px]">
                                                            {result ? (
                                                                  <div className="animate-in fade-in zoom-in duration-500 w-full">
                                                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                                                              <Droplets className="w-8 h-8 text-blue-600" />
                                                                        </div>

                                                                        <div className="mb-6">
                                                                              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2 font-bold">
                                                                                    {t('recommendedFertilizer')}
                                                                              </h3>
                                                                              <p className="text-3xl font-bold text-blue-700 mb-2">
                                                                                    {result.recommendation}
                                                                              </p>
                                                                        </div>

                                                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-left">
                                                                              <h4 className="flex items-center gap-2 text-blue-900 font-bold mb-2">
                                                                                    <Info className="w-4 h-4" />
                                                                                    About this Fertilizer
                                                                              </h4>
                                                                              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                                                                                    {result.description}
                                                                              </p>
                                                                              <p className="text-[10px] text-blue-400 font-medium italic border-t pt-2">
                                                                                    This recommendation is based on historical soil and environmental data analysis.
                                                                              </p>
                                                                        </div>
                                                                  </div>
                                                            ) : (
                                                                  <div className="text-gray-400 flex flex-col items-center">
                                                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                                              <Droplets className="w-10 h-10 opacity-20" />
                                                                        </div>
                                                                        <p className="font-medium">{t('readyToAnalyze')}</p>
                                                                        <p className="text-sm mt-2 max-w-[200px]">
                                                                              Enter your data to get a precise recommendation.
                                                                        </p>
                                                                  </div>
                                                            )}
                                                      </CardContent>
                                                </Card>
                                          </div>
                                    </div>
                              </div>
                        </main>
                  </div>
            </div>
      );
};

export default FertilizerGuide;
