from datetime import datetime, timedelta
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class RiskRequest(BaseModel):
    drugName: str
    dosage: str
    species: str
    duration: int

class RiskResponse(BaseModel):
    risk: str
    confidence: int
    withdrawalDays: int
    safeSaleDate: str

@app.post('/predict-risk', response_model=RiskResponse)
def predict_risk(payload: RiskRequest):
    base_risk = 20
    if payload.drugName.lower() in ['oxytetracycline', 'ciprofloxacin', 'amoxicillin']:
        base_risk += 30
    if payload.species.lower() in ['poultry', 'buffalo']:
        base_risk += 10
    if payload.duration > 7:
        base_risk += 15

    confidence = min(99, base_risk + 20)
    withdrawal_days = 14 if payload.drugName.lower() in ['oxytetracycline'] else 10
    safe_sale_date = (datetime.utcnow() + timedelta(days=withdrawal_days)).strftime('%Y-%m-%d')

    level = 'Low'
    if base_risk > 50:
        level = 'High'
    elif base_risk > 30:
        level = 'Medium'

    return {
        'risk': level,
        'confidence': confidence,
        'withdrawalDays': withdrawal_days,
        'safeSaleDate': safe_sale_date,
    }
