import React from 'react';
import { X, Printer, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PatientData, PredictionResult } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData;
  prediction: PredictionResult;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  prediction,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const topRiskDrivers = prediction.shapValues.filter((s) => s.value > 0).slice(0, 3);
  const protectiveDrivers = prediction.shapValues.filter((s) => s.value < 0).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Clinical Stroke Risk Summary</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="py-4 space-y-5 text-xs text-slate-800 print:text-black">
          {/* Header */}
          <div className="border-b pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Patient Cerebrovascular Assessment Report</h1>
                <p className="text-slate-500 text-[11px]">
                  Generated via Explainable AI Stroke Risk Engine &bull; Kaggle Calibrated
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Date: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Demographic & Biomarkers Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Age &amp; Gender</span>
              <strong className="text-xs">{patient.age} yrs &bull; {patient.gender}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
              <strong className="text-xs">{patient.systolic_bp} mmHg {patient.hypertension ? '(HTN Dx)' : ''}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Avg Blood Glucose</span>
              <strong className="text-xs">{patient.avg_glucose_level} mg/dL</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">BMI &amp; Smoking</span>
              <strong className="text-xs">{patient.bmi} kg/m² &bull; {patient.smoking_status}</strong>
            </div>
          </div>

          {/* Core Risk Score Output */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Predicted 10-Year Stroke Probability
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {prediction.riskScore}%
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                95% CI: [{prediction.confidenceInterval[0]}% - {prediction.confidenceInterval[1]}%] &bull; Category: <strong>{prediction.riskCategory} Risk</strong>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Population Baseline</span>
              <span className="text-base font-bold text-slate-700">{prediction.baseValue}%</span>
              <span className="text-[10px] text-slate-500 block">{(prediction.riskScore / prediction.baseValue).toFixed(1)}x population mean</span>
            </div>
          </div>

          {/* Primary Risk Factors (SHAP) */}
          <div>
            <h3 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Primary Pathological Risk Pushers (SHAP Decomposition)
            </h3>
            <div className="space-y-1.5">
              {topRiskDrivers.map((driver) => (
                <div key={driver.featureKey} className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                  <span className="font-semibold text-slate-800">{driver.featureName} ({driver.displayValue})</span>
                  <span className="font-mono text-rose-700 font-bold">+{driver.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Protective Factors */}
          {protectiveDrivers.length > 0 && (
            <div>
              <h3 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Protective Clinical Characteristics
              </h3>
              <div className="space-y-1.5">
                {protectiveDrivers.map((driver) => (
                  <div key={driver.featureKey} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <span className="font-semibold text-slate-800">{driver.featureName} ({driver.displayValue})</span>
                    <span className="font-mono text-emerald-700 font-bold">{driver.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Counterfactual Goals */}
          <div>
            <h3 className="font-bold text-xs text-slate-900 mb-2">
              Actionable Target Interventions (Counterfactual Analysis)
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
              {prediction.counterfactuals.slice(0, 3).map((cf) => (
                <li key={cf.id}>
                  <strong>{cf.label}:</strong> {cf.description} (Estimated Risk Reduction: <span className="font-semibold text-emerald-700 font-mono">-{Math.abs(cf.riskDifference)}%</span>)
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
            Disclaimer: This application is a decision-support and educational tool utilizing machine learning models trained on benchmark clinical datasets. It does not replace comprehensive in-person medical evaluation by a licensed physician or neurologist.
          </div>
        </div>
      </div>
    </div>
  );
};
