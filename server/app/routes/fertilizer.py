from fastapi import APIRouter, HTTPException
from app.schemas.fertilizer_schema import FertilizerInput, FertilizerOutput, FERTILIZER_DESCRIPTIONS
import joblib
import numpy as np
import os

router = APIRouter()

MODEL_PATH = "fertilizer_model.pkl"
ENCODERS_PATH = "fertilizer_encoders.pkl"

model = None
encoders = None

if os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH):
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
else:
    print(f"Warning: ML model files not found at {MODEL_PATH}")

@router.post("/predict", response_model=FertilizerOutput)
async def suggest_fertilizer(data: FertilizerInput):
    if not model or not encoders:
        raise HTTPException(status_code=500, detail="Recommendation engine not initialized")
    
    try:
        # Encode categorical features
        # we need to handle values that might not be in the encoder
        def safe_encode(encoder, value):
            try:
                # check if label exists
                if value not in encoder.classes_:
                    # maybe fallback to most common or similar? 
                    # for now, let's just use the first class if not found
                    return 0
                return encoder.transform([value])[0]
            except:
                return 0

        soil_encoded = safe_encode(encoders['Soil Type'], data.soilType)
        crop_encoded = safe_encode(encoders['Crop Type'], data.cropType)

        # Process input data
        input_data = np.array([[
            data.temperature,
            data.humidity,
            data.moisture,
            soil_encoded,
            crop_encoded,
            data.N,
            data.K,
            data.P
        ]])
        
        # Predict
        prediction_encoded = model.predict(input_data)
        recommendation = encoders['target'].inverse_transform(prediction_encoded)[0]
        
        description = FERTILIZER_DESCRIPTIONS.get(recommendation, "A specialized fertilizer mix for your soil conditions.")
        
        return FertilizerOutput(recommendation=recommendation, description=description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
