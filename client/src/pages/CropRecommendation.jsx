import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, ArrowLeft, Loader2, Leaf, Thermometer, Droplets, Wind, Beaker, LogOut } from "lucide-react";
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
                                    className="text-sm font-medium text-green-600"
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
                  {Icon && <Icon className="w-4 h-4 text-green-600" />}
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
                        className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all group-hover:bg-white"
                        placeholder={placeholder}
                  />
            </div>
      </div>
);

const CropRecommendation = () => {
      const { t } = useLanguage();
      const [formData, setFormData] = useState({
            N: "",
            P: "",
            K: "",
            temperature: "",
            humidity: "",
            ph: "",
            rainfall: "",
      });
      const [loading, setLoading] = useState(false);
      const [prediction, setPrediction] = useState(null);

      const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setPrediction(null);

            try {
                  const response = await axiosInstance.post("/api/crop/predict", formData);

                  setPrediction(response.data.recommended_crop);
                  toast.success("Prediction successful!");
            } catch (error) {
                  console.error("Error:", error);
                  toast.error("Failed to get recommendation. Please try again.");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex flex-col bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
                  <div className="absolute inset-0 bg-green-50/90 backdrop-blur-[2px] z-0"></div>

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
                                                                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                                                        <Sprout className="w-6 h-6 text-green-600" />
                                                                  </div>
                                                                  {t('cropRecommendationTitle')}
                                                            </CardTitle>
                                                            <p className="text-gray-500">
                                                                  {t('cropRecommendationSubtitle')}
                                                            </p>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div className="space-y-4">
                                                                              <h4 className="font-semibold text-gray-800 border-b pb-2">{t('soilNutrients')}</h4>
                                                                              <InputField label={t('nitrogen')} name="N" value={formData.N} onChange={handleChange} placeholder="e.g. 90" icon={Beaker} />
                                                                              <InputField label={t('phosphorus')} name="P" value={formData.P} onChange={handleChange} placeholder="e.g. 42" icon={Beaker} />
                                                                              <InputField label={t('potassium')} name="K" value={formData.K} onChange={handleChange} placeholder="e.g. 43" icon={Beaker} />
                                                                        </div>

                                                                        <div className="space-y-4">
                                                                              <h4 className="font-semibold text-gray-800 border-b pb-2">{t('environment')}</h4>
                                                                              <InputField label={t('temperature')} name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g. 20.8" icon={Thermometer} step="0.1" />
                                                                              <InputField label={t('humidity')} name="humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g. 82" icon={Droplets} step="0.1" />
                                                                              <InputField label={t('phLevel')} name="ph" value={formData.ph} onChange={handleChange} placeholder="e.g. 6.5" icon={Beaker} step="0.1" />
                                                                        </div>
                                                                  </div>

                                                                  <div className="pt-2">
                                                                        <InputField label={t('rainfall')} name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="e.g. 202.9" icon={Wind} step="0.1" />
                                                                  </div>

                                                                  <button
                                                                        type="submit"
                                                                        disabled={loading}
                                                                        className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 font-semibold text-lg mt-4"
                                                                  >
                                                                        {loading ? (
                                                                              <>
                                                                                    <Loader2 className="w-5 h-5 animate-spin" /> {t('analyzingSoilData')}
                                                                              </>
                                                                        ) : (
                                                                              t('getCropRecommendation')
                                                                        )}
                                                                  </button>
                                                            </form>
                                                      </CardContent>
                                                </Card>
                                          </div>

                                          {/* Result Section */}
                                          <div className="animate-fade-in delay-200">
                                                <Card className="h-full bg-gradient-to-b from-green-50/80 to-white border-green-100 sticky top-28">
                                                      <CardHeader>
                                                            <CardTitle className="text-green-800 text-center">{t('analysisResult')}</CardTitle>
                                                      </CardHeader>
                                                      <CardContent className="flex flex-col items-center justify-center text-center min-h-[300px]">
                                                            {prediction ? (
                                                                  <div className="animate-in fade-in zoom-in duration-500 w-full">
                                                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                                                              <Leaf className="w-12 h-12 text-green-600" />
                                                                        </div>
                                                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">
                                                                              {t('bestCropToPlant')}
                                                                        </h3>
                                                                        <p className="text-5xl font-bold text-green-700 capitalize mb-6 drop-shadow-sm">
                                                                              {t(`crop_${prediction.toLowerCase().replace(/\s+/g, '')}`) || prediction}
                                                                        </p>
                                                                        <div className="bg-green-100/50 rounded-lg p-4 text-sm text-green-800">
                                                                              <p>
                                                                                    {t('predictionMessage')} <strong>{t(`crop_${prediction.toLowerCase().replace(/\s+/g, '')}`) || prediction}</strong> {t('highestYield')}
                                                                              </p>
                                                                        </div>
                                                                  </div>
                                                            ) : (
                                                                  <div className="text-gray-400 flex flex-col items-center">
                                                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                                              <Sprout className="w-10 h-10 opacity-20" />
                                                                        </div>
                                                                        <p className="font-medium">{t('readyToAnalyze')}</p>
                                                                        <p className="text-sm mt-2 max-w-[200px]">
                                                                              {t('fillFormMessage')}
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

export default CropRecommendation;
