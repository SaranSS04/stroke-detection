export type Gender = 'Female' | 'Male' | 'Other';
export type SmokingStatus = 'never smoked' | 'formerly smoked' | 'smokes' | 'Unknown';
export type WorkType = 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked';
export type ResidenceType = 'Urban' | 'Rural';

export interface PatientData {
  age: number;
  gender: Gender;
  hypertension: boolean;
  heart_disease: boolean;
  ever_married: 'Yes' | 'No';
  work_type: WorkType;
  residence_type: ResidenceType;
  avg_glucose_level: number; // mg/dL
  bmi: number; // kg/m²
  smoking_status: SmokingStatus;
}

export interface ContributingFactor {
  name: string;
  value: string;
  weight: number;
  formattedWeight: string;
  direction: 'elevating' | 'lowering';
}

export interface PredictionOutput {
  uncalibratedProbability: number; // e.g. 0.4630
  classBalancedScore: number; // e.g. 46.3%
  isotonicCalibratedScore: number; // e.g. 5.4%
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  riskCategoryColor: string;
  elevatingFactors: ContributingFactor[];
  loweringFactors: ContributingFactor[];
}

export interface ClinicalPreset {
  id: string;
  name: string;
  data: PatientData;
}
