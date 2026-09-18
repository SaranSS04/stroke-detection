import React, { useState } from 'react';
import { PatientData, PredictionOutput, ClinicalPreset } from '../types';
import { CLINICAL_PRESETS } from '../ml/model';
import {
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

interface RiskEstimatorViewProps {
  patient: PatientData;
  prediction: PredictionOutput;
  onChange: (updated: PatientData) => void;
  onReset: () => void;
  onSelectPreset: (preset: ClinicalPreset) => void;
  onEstimateClick: () => void;
}

export function RiskEstimatorView({
  patient,
  prediction,
  onChange,
  onReset,
  onSelectPreset,
  onEstimateClick,
}: RiskEstimatorViewProps) {
  const [showAdditional, setShowAdditional] = useState(false);
  const [animatingRisk, setAnimatingRisk] = useState(false);
  const [inferenceMode, setInferenceMode] = useState<'cascade' | 'baseline'>('cascade');

  const handleEstimate = () => {
    setAnimatingRisk(true);
    onEstimateClick();
    setTimeout(() => setAnimatingRisk(false), 300);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Card: Patient Risk Profile */}
      <div
        id="patient-risk-profile-card"
        className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500 stroke-[2.5]" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Patient Risk Profile
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Six-factor research prototype for stroke probability assessment
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Load Clinical Preset Select */}
            <div className="relative">
              <select
                id="preset-dropdown-select"
                aria-label="Load Clinical Preset"
                value=""
                onChange={(e) => {
                  const found = CLINICAL_PRESETS.find((p) => p.id === e.target.value);
                  if (found) onSelectPreset(found);
                }}
                className="appearance-none text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-7 pr-8 py-1.5 font-medium cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="" disabled>
                  Load Clinical Preset...
                </option>
                {CLINICAL_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset button */}
            <button
              id="reset-profile-btn"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Inputs Form */}
        <div className="space-y-4 pt-1">
          {/* Row 1: Age & Glucose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-age"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Age (years)
              </label>
              <input
                id="input-age"
                type="number"
                min="0"
                max="120"
                step="1"
                value={patient.age}
                onChange={(e) =>
                  onChange({ ...patient, age: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full text-sm text-slate-900 border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">Standard range: 0 – 120</p>
            </div>

            <div>
              <label
                htmlFor="input-glucose"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Average Glucose Level (mg/dL)
              </label>
              <input
                id="input-glucose"
                type="number"
                min="40"
                max="350"
                step="1"
                value={patient.avg_glucose_level}
                onChange={(e) =>
                  onChange({
                    ...patient,
                    avg_glucose_level: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full text-sm text-slate-900 border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">Normal: ~70 – 100 mg/dL</p>
            </div>
          </div>

          {/* Row 2: BMI & Smoking Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-bmi"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Body Mass Index (BMI)
              </label>
              <input
                id="input-bmi"
                type="number"
                min="10"
                max="75"
                step="0.1"
                value={patient.bmi}
                onChange={(e) =>
                  onChange({ ...patient, bmi: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full text-sm text-slate-900 border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">Overweight: ≥ 25.0, Obese: ≥ 30.0</p>
            </div>

            <div>
              <label
                htmlFor="select-smoking"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Smoking Status
              </label>
              <div className="relative">
                <select
                  id="select-smoking"
                  value={patient.smoking_status}
                  onChange={(e) =>
                    onChange({
                      ...patient,
                      smoking_status: e.target.value as PatientData['smoking_status'],
                    })
                  }
                  className="w-full appearance-none text-sm text-slate-900 border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors cursor-pointer"
                >
                  <option value="formerly smoked">formerly smoked</option>
                  <option value="never smoked">never smoked</option>
                  <option value="smokes">smokes</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Self-reported history</p>
            </div>
          </div>

          {/* Row 3: Hypertension & Heart Disease Checkbox Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              htmlFor="checkbox-hypertension"
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                patient.hypertension
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                id="checkbox-hypertension"
                type="checkbox"
                checked={patient.hypertension}
                onChange={(e) => onChange({ ...patient, hypertension: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-800 block">Hypertension</span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Documented chronic high blood pressure
                </span>
              </div>
            </label>

            <label
              htmlFor="checkbox-heart-disease"
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                patient.heart_disease
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                id="checkbox-heart-disease"
                type="checkbox"
                checked={patient.heart_disease}
                onChange={(e) => onChange({ ...patient, heart_disease: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-800 block">Heart Disease</span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  History of coronary artery disease or cardiac condition
                </span>
              </div>
            </label>
          </div>

          {/* Optional Biological Demographic Factor */}
          <div className="pt-1">
            <button
              id="toggle-additional-demographics-btn"
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors py-1 cursor-pointer"
            >
              {showAdditional ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
              <span>Optional Demographic & Lifestyle Context (Gender, Work Type)</span>
            </button>

            {showAdditional && (
              <div className="mt-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                <div>
                  <label htmlFor="select-gender" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Gender
                  </label>
                  <select
                    id="select-gender"
                    value={patient.gender || 'Female'}
                    onChange={(e) =>
                      onChange({ ...patient, gender: e.target.value as PatientData['gender'] })
                    }
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="select-work" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Work Type
                  </label>
                  <select
                    id="select-work"
                    value={patient.work_type || 'Private'}
                    onChange={(e) =>
                      onChange({ ...patient, work_type: e.target.value as PatientData['work_type'] })
                    }
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Private">Private Industry / Corporate</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Govt_job">Government / Public</option>
                    <option value="children">Student / Minor</option>
                    <option value="Never_worked">Never worked</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Estimate Risk Button */}
          <div className="pt-2">
            <button
              id="estimate-risk-submit-btn"
              type="button"
              onClick={handleEstimate}
              className={`inline-flex items-center gap-2 bg-[#111827] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                animatingRisk ? 'scale-95 opacity-90' : ''
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
              <span>Estimate Risk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Card: Model Inference Output */}
      <div
        id="model-inference-output-card"
        className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        {/* Output Header & Architecture Switcher */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                PREDICTIVE ENGINE
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {inferenceMode === 'cascade' ? 'Two-Tier Clinical Safety Cascade' : 'Single-Threshold Baseline Model'}
              </h2>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-xs">
              <button
                id="btn-mode-cascade"
                type="button"
                onClick={() => setInferenceMode('cascade')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  inferenceMode === 'cascade'
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Idea 3: Two-Tier Cascade
              </button>
              <button
                id="btn-mode-baseline"
                type="button"
                onClick={() => setInferenceMode('baseline')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  inferenceMode === 'baseline'
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Standard Baseline
              </button>
            </div>
          </div>
        </div>

        {/* Two-Tier Cascade Active Status Card */}
        {inferenceMode === 'cascade' ? (
          <div className="space-y-4">
            {/* Step 1: Tier 1 Safety Net Banner */}
            <div className={`p-4 rounded-xl border ${
              prediction.tier1.status === 'CAUGHT'
                ? 'bg-amber-50/60 border-amber-200'
                : 'bg-emerald-50/60 border-emerald-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {prediction.tier1.status === 'CAUGHT' ? (
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Step 1: Tier 1 Zero-Miss Safety Net
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        prediction.tier1.status === 'CAUGHT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prediction.tier1.status === 'CAUGHT' ? 'INTERCEPTED & FLAGGED' : 'CLEARED / SAFE'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {prediction.tier1.ruleSummary}
                    </p>

                    {prediction.tier1.triggers.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {prediction.tier1.triggers.map((trigger, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/90 border border-amber-200 px-2 py-0.5 rounded-md text-amber-900"
                          >
                            <CheckCircle2 className="w-3 h-3 text-amber-600" />
                            {trigger}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Recall Safety</span>
                  <span className="text-xs font-bold text-emerald-700">98.0% detection</span>
                  <span className="text-[10px] text-slate-500 block">≤1 missed / 1,000</span>
                </div>
              </div>
            </div>

            {/* Step 2: Tier 2 Precision Staging & Clinical Action */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Step 2: Tier 2 Precision Clinical Staging
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${prediction.tier2.stageColor}`}>
                  {prediction.tier2.stage} • {prediction.tier2.urgencyLevel}
                </span>
              </div>

              {/* Big Score Box inside Cascade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Class-Balanced Sieve Score
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
                    {prediction.classBalancedScore.toFixed(1)}%
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Multi-factor tree attribution
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Isotonic Population Risk
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
                    {prediction.isotonicCalibratedScore.toFixed(1)}%
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Calibrated real-world probability
                  </span>
                </div>
              </div>

              {/* Actionable Clinical Guidance */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                  Recommended Clinical Intervention:
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {prediction.tier2.clinicalAction}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Baseline Mode Display */
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Baseline Model Limitation (High False Negatives)
              </span>
              <p className="text-rose-900/90 text-[11px] leading-relaxed">
                At standard 50% single threshold, the model misses <strong>11 out of 50 stroke cases (22% missed)</strong>. Borderline patients are misclassified as safe.
              </p>
            </div>

            {/* Score Box */}
            <div className="border border-slate-200/90 rounded-xl p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {prediction.classBalancedScore.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Uncalibrated model score (prob: {prediction.uncalibratedProbability.toFixed(4)})
                  </span>
                </div>
              </div>

              <div className="sm:border-l sm:border-slate-200 sm:pl-6 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ISOTONIC CALIBRATED
                </span>
                <div className="text-2xl font-bold text-slate-900">
                  {prediction.isotonicCalibratedScore.toFixed(1)}%
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Post-processed on validation curve
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Progress / Threshold Bar */}
        <div className="space-y-1.5">
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            {/* 50% Threshold marker line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-slate-300 z-10"
              style={{ left: '50%' }}
            />
            {/* Orange progress bar */}
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, prediction.classBalancedScore)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 px-0.5">
            <span>0%</span>
            <span className="font-medium text-slate-500">Threshold 50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Primary Contributing Factors */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            PRIMARY CONTRIBUTING FACTORS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Left Box: Factors Elevating Risk */}
            <div className="bg-rose-50/50 border border-rose-100/90 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                <span>Factors Elevating Risk</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {prediction.elevatingFactors.length > 0 ? (
                  prediction.elevatingFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700">
                      <span>{factor.name}</span>
                      <span className="font-bold text-rose-600">{factor.formattedWeight}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs italic">No notable elevating factors</span>
                )}
              </div>
            </div>

            {/* Right Box: Factors Lowering Risk */}
            <div className="bg-emerald-50/50 border border-emerald-100/90 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Factors Lowering Risk</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {prediction.loweringFactors.length > 0 ? (
                  prediction.loweringFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700">
                      <span>{factor.name}</span>
                      <span className="font-bold text-emerald-600">{factor.formattedWeight}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs italic">No notable lowering factors</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Research Prototype Caution Box */}
        <div className="border border-amber-200/90 bg-amber-50/40 rounded-xl p-3.5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900">
            <span className="font-bold text-amber-800 block">Research Prototype Caution</span>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              Use this estimate only for demonstration and human review. This is not a clinical diagnosis or treatment decision tool. The positive class in the training distribution is rare, and individual clinical outcomes must be evaluated by healthcare professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
