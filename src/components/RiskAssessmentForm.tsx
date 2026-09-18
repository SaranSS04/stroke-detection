import React, { useState } from 'react';
import {
  Heart,
  Activity,
  User,
  Cigarette,
  Scale,
  Briefcase,
  MapPin,
  RotateCcw,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PatientData, PatientPreset } from '../types';
import { PATIENT_PRESETS, DEFAULT_PATIENT } from '../ml/model';

interface RiskAssessmentFormProps {
  patient: PatientData;
  onChange: (updated: PatientData) => void;
  onReset: () => void;
}

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  patient,
  onChange,
  onReset,
}) => {
  const [showBmiCalc, setShowBmiCalc] = useState(false);
  const [calcHeightCm, setCalcHeightCm] = useState(170);
  const [calcWeightKg, setCalcWeightKg] = useState(75);

  const updateField = <K extends keyof PatientData>(field: K, value: PatientData[K]) => {
    const updated = { ...patient, [field]: value };

    // Auto-correlate systolic BP with hypertension flag if high
    if (field === 'systolic_bp' && typeof value === 'number') {
      if (value >= 140 && !patient.hypertension) {
        updated.hypertension = true;
      }
    }

    onChange(updated);
  };

  const applyPreset = (preset: PatientPreset) => {
    onChange({ ...preset.data });
  };

  const handleApplyBmi = () => {
    const heightM = calcHeightCm / 100;
    if (heightM > 0) {
      const calculatedBmi = Number((calcWeightKg / (heightM * heightM)).toFixed(1));
      updateField('bmi', calculatedBmi);
      setShowBmiCalc(false);
    }
  };

  return (
    <div id="section-patient-inputs" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Patient Clinical Profile
          </h2>
          <p className="text-xs text-slate-500">
            Kaggle Clinical Dataset feature parameters for risk calculation
          </p>
        </div>

        <button
          id="btn-reset-patient"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Preset Selector Chips */}
      <div className="py-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Clinical Archetype Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PATIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              id={`btn-preset-${preset.id}`}
              onClick={() => applyPreset(preset)}
              className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-xs group"
            >
              <span className="font-bold text-slate-800 group-hover:text-indigo-900 block truncate">
                {preset.name.split(' (')[0]}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {preset.tagline.split(',')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4 pt-2">
        {/* Row 1: Age and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="input-age" className="text-xs font-semibold text-slate-700">
                Age: <span className="text-indigo-600 font-bold">{patient.age} years</span>
              </label>
              <span className="text-[10px] text-slate-400">18 - 95</span>
            </div>
            <input
              id="input-age"
              type="range"
              min="18"
              max="95"
              step="1"
              value={patient.age}
              onChange={(e) => updateField('age', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Female', 'Male', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  id={`btn-gender-${g.toLowerCase()}`}
                  type="button"
                  onClick={() => updateField('gender', g)}
                  className={`py-1.5 text-xs rounded-lg font-medium border text-center transition-all ${
                    patient.gender === g
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Blood Pressure & Hypertension */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-slate-800">
                Blood Pressure &amp; Vascular State
              </span>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                id="checkbox-hypertension"
                type="checkbox"
                checked={patient.hypertension}
                onChange={(e) => updateField('hypertension', e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
              />
              <span className="text-xs text-slate-700 font-medium">Diagnosed Hypertension</span>
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="input-systolic" className="text-xs font-medium text-slate-600">
                Systolic Pressure:{' '}
                <strong className={`font-bold ${patient.systolic_bp >= 140 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {patient.systolic_bp} mmHg
                </strong>
              </label>
              <span className="text-[10px] text-slate-400">
                {patient.systolic_bp < 120
                  ? 'Normal (<120)'
                  : patient.systolic_bp < 130
                  ? 'Elevated (120-129)'
                  : patient.systolic_bp < 140
                  ? 'Stage 1 HTN (130-139)'
                  : 'Stage 2 HTN (≥140)'}
              </span>
            </div>
            <input
              id="input-systolic"
              type="range"
              min="95"
              max="200"
              step="1"
              value={patient.systolic_bp}
              onChange={(e) => updateField('systolic_bp', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>
        </div>

        {/* Row 3: Heart Disease Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Pre-existing Heart Disease
              </span>
              <span className="text-[10px] text-slate-500">
                Atrial fibrillation, CAD, prior myocardial infarction
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              id="btn-heart-disease-no"
              onClick={() => updateField('heart_disease', false)}
              className={`px-3 py-1 text-xs rounded-lg font-medium border transition-all ${
                !patient.heart_disease
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              No
            </button>
            <button
              type="button"
              id="btn-heart-disease-yes"
              onClick={() => updateField('heart_disease', true)}
              className={`px-3 py-1 text-xs rounded-lg font-medium border transition-all ${
                patient.heart_disease
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Yes
            </button>
          </div>
        </div>

        {/* Row 4: Average Blood Glucose */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="input-glucose" className="text-xs font-semibold text-slate-700">
              Average Blood Glucose:{' '}
              <strong className={`font-bold ${patient.avg_glucose_level >= 126 ? 'text-amber-700' : 'text-slate-800'}`}>
                {patient.avg_glucose_level} mg/dL
              </strong>
            </label>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                patient.avg_glucose_level < 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : patient.avg_glucose_level < 126
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {patient.avg_glucose_level < 100
                ? 'Normoglycemic (<100)'
                : patient.avg_glucose_level < 126
                ? 'Prediabetes (100-125)'
                : 'Diabetic Range (≥126)'}
            </span>
          </div>
          <input
            id="input-glucose"
            type="range"
            min="65"
            max="260"
            step="1"
            value={patient.avg_glucose_level}
            onChange={(e) => updateField('avg_glucose_level', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Row 5: BMI with helper tool */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-500" />
              <label htmlFor="input-bmi" className="text-xs font-semibold text-slate-700">
                Body Mass Index (BMI):{' '}
                <strong className="font-bold text-slate-800">{patient.bmi} kg/m²</strong>
              </label>
            </div>

            <button
              type="button"
              id="btn-toggle-bmi-calc"
              onClick={() => setShowBmiCalc(!showBmiCalc)}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <Calculator className="w-3 h-3" />
              {showBmiCalc ? 'Close Calculator' : 'Compute from Ht/Wt'}
            </button>
          </div>

          <input
            id="input-bmi"
            type="range"
            min="16"
            max="50"
            step="0.1"
            value={patient.bmi}
            onChange={(e) => updateField('bmi', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          {showBmiCalc && (
            <div className="p-3 bg-white rounded-lg border border-slate-200 mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block">Height (cm)</label>
                  <input
                    type="number"
                    value={calcHeightCm}
                    onChange={(e) => setCalcHeightCm(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Weight (kg)</label>
                  <input
                    type="number"
                    value={calcWeightKg}
                    onChange={(e) => setCalcWeightKg(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-xs"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyBmi}
                className="w-full py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
              >
                Apply Calculated BMI
              </button>
            </div>
          )}
        </div>

        {/* Row 6: Smoking Status */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Cigarette className="w-4 h-4 text-slate-500" />
            <label className="text-xs font-semibold text-slate-700">Smoking Status</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['never smoked', 'formerly smoked', 'smokes', 'Unknown'] as const).map((status) => (
              <button
                key={status}
                id={`btn-smoking-${status.replace(' ', '-')}`}
                type="button"
                onClick={() => updateField('smoking_status', status)}
                className={`py-2 px-2 text-xs rounded-lg font-medium border text-center transition-all truncate ${
                  patient.smoking_status === status
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Row 7: Work Type and Residence Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="select-work-type" className="text-xs font-semibold text-slate-700">
                Work Type
              </label>
            </div>
            <select
              id="select-work-type"
              value={patient.work_type}
              onChange={(e) => updateField('work_type', e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Private">Private Industry / Corporate</option>
              <option value="Self-employed">Self-Employed / Business</option>
              <option value="Govt_job">Government / Public Sector</option>
              <option value="children">Minor / Student</option>
              <option value="Never_worked">Never Worked</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="select-residence-type" className="text-xs font-semibold text-slate-700">
                Residence Type
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['Urban', 'Rural'] as const).map((r) => (
                <button
                  key={r}
                  id={`btn-residence-${r.toLowerCase()}`}
                  type="button"
                  onClick={() => updateField('residence_type', r)}
                  className={`py-2 text-xs rounded-lg font-medium border text-center transition-all ${
                    patient.residence_type === r
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
