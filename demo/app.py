"""Small Streamlit demonstration for the trained stroke-risk model."""

from pathlib import Path
import sys

import joblib
import pandas as pd
import streamlit as st

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

st.set_page_config(page_title="Stroke Risk Prototype", page_icon="+", layout="centered")
st.title("Stroke Risk Prediction")
st.caption("Six-factor research prototype. This is not a clinical diagnosis.")

model_path = PROJECT_ROOT / "outputs" / "model.pkl"
if not model_path.exists():
    st.error("Train the model first with: python -m src.train_model")
    st.stop()
model = joblib.load(model_path)

with st.form("risk_form"):
    age = st.number_input("Age", min_value=0.0, max_value=120.0, value=55.0)
    hypertension = st.checkbox("Hypertension")
    heart_disease = st.checkbox("Heart disease")
    glucose = st.number_input("Average glucose level", min_value=0.0, value=100.0)
    bmi = st.number_input("BMI", min_value=0.0, value=27.0)
    smoking_status = st.selectbox("Smoking status", ["formerly smoked", "never smoked", "smokes", "Unknown"])
    submitted = st.form_submit_button("Estimate risk")

if submitted:
    row = pd.DataFrame([{
        "gender": "Female",
        "age": age,
        "hypertension": int(hypertension),
        "heart_disease": int(heart_disease),
        "ever_married": "Yes",
        "work_type": "Private",
        "Residence_type": "Urban",
        "avg_glucose_level": glucose,
        "bmi": bmi,
        "smoking_status": smoking_status,
    }])
    probability = float(model.predict_proba(row)[0, 1])
    st.metric("Estimated probability", f"{probability:.1%}")
    st.warning("Use this estimate only for demonstration and human review.")
