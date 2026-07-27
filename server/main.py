from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.crop import router as crop_router
from app.routes.fertilizer import router as fertilizer_router
from app.routes.weather import router as weather_router
from app.database import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    await init_db()

app.include_router(auth_router)
app.include_router(crop_router, prefix="/api/crop", tags=["Crop Recommendation"])
app.include_router(fertilizer_router, prefix="/api/fertilizer", tags=["Fertilizer Guide"])
app.include_router(weather_router, prefix="/api/weather", tags=["Weather Forecast"])
