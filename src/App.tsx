import React, { useState, useMemo } from 'react';
import { PatientData, ClinicalPreset } from './types';
import { CLINICAL_PRESETS, DEFAULT_PATIENT, predictStrokeProbability } from './ml/model';
import { RiskEstimatorView } from './components/RiskEstimatorView';
import { ModelBenchmarksView } from './components/ModelBenchmarksView';
import { Activity, BarChart2, Shield } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'estimator' | 'benchmarks'>('estimator');
  const [patient, setPatient] = useState<PatientData>(DEFAULT_PATIENT);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('demo-default');
  const [calculationFeedback, setCalculationFeedback] = useState<string | null>(null);

  // Reactive machine learning inference
  const prediction = useMemo(() => {
    return predictStrokeProbability(patient);
  }, [patient]);

  const handlePatientChange = (updated: PatientData) => {
    setPatient(updated);
    setSelectedPresetId(''); // Custom input
  };

  const handleSelectPreset = (preset: ClinicalPreset) => {
    setPatient({ ...preset.data });
    setSelectedPresetId(preset.id);
  };

  const handleReset = () => {
    const demo = CLINICAL_PRESETS[0];
    setPatient({ ...demo.data });
    setSelectedPresetId(demo.id);
  };

  const handleEstimateClick = () => {
    setCalculationFeedback('Model inference refreshed with current parameters.');
    setTimeout(() => setCalculationFeedback(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Feedback */}
      {calculationFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Activity className="w-4 h-4 text-rose-400 stroke-[2.5]" />
          <span>{calculationFeedback}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* App Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs shrink-0">
              {/* Heart with pulse stroke icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                Stroke Risk Prediction
              </h1>
              <p className="text-xs text-slate-500">
                Six-factor research prototype • Machine learning risk stratification
              </p>
            </div>
          </div>

          {/* Right Tab Switcher */}
          <nav aria-label="Application tabs" className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80 self-start sm:self-auto">
            <button
              id="tab-risk-estimator-btn"
              type="button"
              onClick={() => setActiveTab('estimator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'estimator'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
              <span>Risk Estimator</span>
            </button>

            <button
              id="tab-model-benchmarks-btn"
              type="button"
              onClick={() => setActiveTab('benchmarks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Model Benchmarks</span>
            </button>
          </nav>
        </header>

        {/* Quick Clinical Presets Bar */}
        <section aria-labelledby="presets-heading" className="bg-white rounded-xl border border-slate-200 px-5 py-3 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500 shrink-0">
            <Shield className="w-4 h-4 text-slate-400" />
            <span id="presets-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              QUICK CLINICAL PRESETS:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CLINICAL_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-slate-400 bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                      : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 font-medium'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Content: Risk Estimator vs Model Benchmarks */}
        {activeTab === 'estimator' ? (
          <RiskEstimatorView
            patient={patient}
            prediction={prediction}
            onChange={handlePatientChange}
            onReset={handleReset}
            onSelectPreset={handleSelectPreset}
            onEstimateClick={handleEstimateClick}
          />
        ) : (
          <ModelBenchmarksView />
        )}
      </div>
    </div>
  );
}

export default App;
