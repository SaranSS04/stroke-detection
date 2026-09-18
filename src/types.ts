export type Gender = 'Female' | 'Male' | 'Other';
export type SmokingStatus = 'never smoked' | 'formerly smoked' | 'smokes' | 'Unknown';
export type WorkType = 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked';

export interface PatientData {
  age: number;
  avg_glucose_level: number; // mg/dL
  bmi: number; // kg/m²
  smoking_status: SmokingStatus;
  hypertension: boolean;
  heart_disease: boolean;
  gender?: Gender;
  work_type?: WorkType;
}

export interface ContributingFactor {
  name: string;
  value: string;
  weight: number;
  formattedWeight: string;
  direction: 'elevating' | 'lowering';
}

export interface Tier1Result {
  status: 'CLEARED' | 'CAUGHT';
  detectionRate: string;
  ruleSummary: string;
  triggers: string[];
}

export interface Tier2Result {
  stage: 'Low Precaution' | 'Moderate Risk' | 'High Risk' | 'Acute Emergency';
  stageColor: string;
  clinicalAction: string;
  urgencyLevel: 'Routine' | 'Preventive' | 'High Priority' | 'Urgent Medical Workup';
}

export interface PredictionOutput {
  uncalibratedProbability: number; // e.g. 0.4630
  classBalancedScore: number; // e.g. 46.3%
  isotonicCalibratedScore: number; // e.g. 5.4%
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Acute Emergency';
  riskCategoryColor: string;
  elevatingFactors: ContributingFactor[];
  loweringFactors: ContributingFactor[];
  tier1: Tier1Result;
  tier2: Tier2Result;
}

export interface ClinicalPreset {
  id: string;
  name: string;
  data: PatientData;
}
