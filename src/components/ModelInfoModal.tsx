import React from 'react';
import { X, Sparkles, Database, CheckCircle, BarChart3 } from 'lucide-react';
import { PredictionResult } from '../types';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: PredictionResult['modelMetrics'];
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({ isOpen, onClose, metrics }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Machine Learning &amp; XAI Architecture</h2>
              <p className="text-xs text-slate-500">Benchmark details &amp; explainability pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Dataset reference */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-xs">
              <Database className="w-4 h-4 text-indigo-600" />
              Kaggle Clinical Stroke Prediction Dataset
            </div>
            <p className="text-slate-600 leading-relaxed">
              Trained and calibrated on 5,110 patient observations containing 11 clinical and demographic attributes (age, hypertension, heart disease, average glucose level, BMI, smoking status, work type, residence).
            </p>
          </div>

          {/* Model Performance Grid */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Cross-Validated Performance Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
                <span className="text-[10px] text-slate-500 block">AUC-ROC</span>
                <span className="text-lg font-black text-indigo-700 font-mono">{metrics.aucRoc}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                <span className="text-[10px] text-slate-500 block">Sensitivity (Recall)</span>
                <span className="text-lg font-black text-emerald-700 font-mono">{metrics.recall}%</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 text-center">
                <span className="text-[10px] text-slate-500 block">Overall Accuracy</span>
                <span className="text-lg font-black text-sky-700 font-mono">{metrics.accuracy}%</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
                <span className="text-[10px] text-slate-500 block">F1-Score</span>
                <span className="text-lg font-black text-amber-700 font-mono">{metrics.f1Score}</span>
              </div>
            </div>
          </div>

          {/* Explainable AI Engines */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Dual Explainability Engines (SHAP + LIME)
            </span>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <strong className="text-slate-900 block font-semibold mb-0.5">
                1. Shapley Additive Explanations (SHAP)
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Uses cooperative game theory to distribute the difference between the expected baseline model outcome and the individual patient prediction among each clinical feature (satisfying local accuracy, missingness, and consistency).
              </p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <strong className="text-slate-900 block font-semibold mb-0.5">
                2. Local Interpretable Model-agnostic Explanations (LIME)
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Constructs local linear surrogates by perturbing patient attributes to map decision boundaries and extract human-readable conditional clinical rules.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
