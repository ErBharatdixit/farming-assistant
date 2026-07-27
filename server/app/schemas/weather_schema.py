from pydantic import BaseModel
from typing import List, Optional

class WeatherCurrent(BaseModel):
    temp: float
    feels_like: float
    humidity: int
    wind_speed: float
    description: str
    icon: str
    city: str

class WeatherInterval(BaseModel):
    time: str
    temp: float
    description: str
    icon: str

class ForecastDay(BaseModel):
    date: str
    temp_min: float
    temp_max: float
    humidity: int
    description: str
    icon: str

class WeatherForecast(BaseModel):
    city: str
    forecast: List[ForecastDay]
    intervals: Optional[List[WeatherInterval]] = []
