# Stroke Detection & Explainable AI (XAI)

AI-powered stroke risk prediction using machine learning and explainable AI (SHAP, LIME, and Counterfactual simulations), calibrated on the Kaggle Clinical Stroke Prediction dataset.

## Features

- **Calibrated Ensemble Model**: Accurately estimates 10-year cerebrovascular incident probabilities based on 11 demographic and physiological features (Age, Blood Pressure, Heart Disease, Average Glucose, BMI, Smoking Status, and Lifestyle factors).
- **SHAP Feature Attribution (Shapley Values)**: Decomposes the exact contribution of each patient biomarker relative to the general population baseline ($E[f(x)] = 4.87\%$).
- **LIME Local Surrogates**: Fits local decision boundaries to map the specific neighborhood rules that govern the patient's risk profile ($R^2 \approx 0.94$).
- **Counterfactual "What-If" Interventions**: Actionable prescriptive simulation allowing clinicians and patients to simulate interventions (e.g. smoking cessation, blood pressure normalization, glycemic management) and view live risk delta reductions.
- **B.E. F.A.S.T. Emergency Protocol**: Comprehensive American Stroke Association signs and emergency triage protocol.
- **Clinical Summary Report**: Exportable and printable diagnostic summary for clinical consultation.

## Getting Started

```bash
npm install
npm run dev
```

The application runs on port `3000` (`http://0.0.0.0:3000`).

