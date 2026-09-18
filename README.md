# Stroke Detection & Clinical Risk Prediction

Machine learning stroke risk prediction and clinical risk stratification calibrated on the 5,110 patient Kaggle Clinical Stroke Prediction dataset.

## Core Features & Feature Engineering

- **Optimized 6-Factor Predictive Pipeline**: Built strictly around high-impact physiological biomarkers with validated clinical etiology:
  - **Age** (dominant non-linear risk predictor)
  - **Average Blood Glucose Level** (glycemic & metabolic damage)
  - **Hypertension** (chronic vascular endothelial strain)
  - **Heart Disease** (atrial fibrillation & cardioembolic etiology)
  - **Body Mass Index (BMI)** (obesity-mediated vascular risk)
  - **Smoking Status** (direct cerebrovascular atherogenesis)
- **Pruned Irrelevant Features**:
  - `id`: Dropped arbitrary patient ID to prevent leakage and tree split overfitting.
  - `Residence_type` (Urban/Rural): Dropped due to near-zero predictive attribution (|SHAP| < 0.03).
  - `ever_married`: Dropped as a redundant confounding proxy for age.
- **Isotonic Calibration**: Calibrates class-balanced model probabilities down to true population prevalence (~4.87%).
- **Interactive Clinical Archetypes**: Fast presets for pediatric, middle-aged moderate, senior with comorbidities, and high-risk cases.

## Getting Started

```bash
npm install
npm run dev
```

The application runs on port `3000` (`http://0.0.0.0:3000`).

