# Stroke Risk Prediction

AI-powered stroke risk prediction using machine learning and explainable AI.

A reproducible, leakage-safe pipeline for the imbalanced `stroke_prediction.csv` dataset. This project is intended for hackathon prototyping, not clinical diagnosis or treatment decisions.

## Approach

- Drop `id` from model features while retaining it as `patient_id` in handoff predictions.
- Parse literal `N/A` values as missing and median-impute numeric fields inside the training pipeline.
- Use stratified train/validation/test splits.
- Compare class-balanced logistic regression with class-weighted XGBoost.
- Select operating thresholds using validation data, then report ROC-AUC, average precision, recall, precision, and coverage.
- Calibrate probabilities separately and produce SHAP explanations.

## Layout

- `src/`: reusable preprocessing, training, calibration, abstention, and explanation code.
- `notebooks/`: ordered exploratory and modeling notebooks.
- `outputs/`: generated handoff artifacts.
- `demo/`: Streamlit prediction demo.

## Run

```powershell
pip install -r requirements.txt
Copy-Item .\stroke_prediction.csv .\data\stroke_prediction.csv
python -m src.train_model
python -m src.calibrate
python -m src.abstention
python -m src.explain
streamlit run demo/app.py
```

The positive class is rare, so accuracy is not the primary success criterion. Review average precision, recall, calibration, and the number of cases sent for manual review together.
