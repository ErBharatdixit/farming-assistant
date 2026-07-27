from fastapi import APIRouter, HTTPException
from app.schemas.crop_schema import CropInput, CropOutput
import random

router = APIRouter()

import joblib
import numpy as np
import os

# Initialize predictor
MODEL_PATH = "crop_recommendation_model.pkl"
model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    print(f"Warning: Model file not found at {MODEL_PATH}")

@router.post("/predict", response_model=CropOutput)
async def predict_crop(data: CropInput):
    if not model:
        raise HTTPException(status_code=500, detail="Recommendation system unavailable")

    try:
        # Process input data
        input_data = np.array([[
            data.N, 
            data.P, 
            data.K, 
            data.temperature, 
            data.humidity, 
            data.ph, 
            data.rainfall
        ]])
        
        # Predict
        prediction = model.predict(input_data)
        recommended_crop = prediction[0]
        
        return CropOutput(recommended_crop=recommended_crop)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
