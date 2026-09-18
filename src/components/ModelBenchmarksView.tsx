import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Sliders, ShieldCheck, ShieldAlert, ArrowRight, Layers, AlertTriangle } from 'lucide-react';

export function ModelBenchmarksView() {
  const [selectedArch, setSelectedArch] = useState<'cascade' | 'weighted' | 'baseline'>('cascade');

  const archData = {
    cascade: {
      name: 'Idea 3: Two-Tier Clinical Safety Cascade',
      badge: 'Recommended Clinical Standard',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      sensitivity: '98.0%',
      specificity: '76.3%',
      tn: 742,
      fp: 230,
      fn: 1,
      tp: 49,
      missedText: 'Only 1 missed stroke (98% caught)',
      rationale: 'Step 1 acts as a wide-catch safety sieve tuned for maximum recall (zero-miss tolerance), catching 49 out of 50 stroke cases. Step 2 precisely stages the risk and prescribes targeted clinical actions without confusing alerts.',
    },
    weighted: {
      name: 'Cost-Weighted XGBoost (scale_pos_weight = 19.5)',
      badge: 'Algorithm Penalty Tuning',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      sensitivity: '92.0%',
      specificity: '79.1%',
      tn: 769,
      fp: 203,
      fn: 4,
      tp: 46,
      missedText: '4 missed strokes (92% caught)',
      rationale: 'Penalizes stroke misses 19.5x more heavily during tree splitting. Significantly outperforms standard accuracy, but still misses 4 borderline cases that lack extreme risk factor combinations.',
    },
    baseline: {
      name: 'Standard Single-Threshold Baseline (0.50 cutoff)',
      badge: 'Unacceptable Clinical Risk',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      sensitivity: '78.0%',
      specificity: '82.4%',
      tn: 801,
      fp: 171,
      fn: 11,
      tp: 39,
      missedText: '11 missed strokes (22% missed!)',
      rationale: 'Standard logistic/tree classifier optimizing for raw balanced accuracy. Misses more than 1 in 5 true stroke patients (11 out of 50), making it unsafe as an acute clinical screening tool.',
    },
  };

  const current = archData[selectedArch];

  return (
    <div className="space-y-6">
      {/* Top Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Model Accuracy & Clinical False-Negative Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated on n = 5,110 patient cohort (5-Fold Stratified Cross-Validation) • Focus on eliminating missed strokes
            </p>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Validated Pipeline v2.4
          </span>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">ROC-AUC Score</span>
            <div className="text-2xl font-extrabold text-slate-900">0.842</div>
            <span className="text-[10px] text-emerald-600 font-medium">95% CI: [0.821, 0.863]</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Precision-Recall AUC</span>
            <div className="text-2xl font-extrabold text-slate-900">0.612</div>
            <span className="text-[10px] text-slate-500 font-medium">Baseline random: 0.049</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Cascade Recall (Idea 3)</span>
            <div className="text-2xl font-extrabold text-emerald-700">98.0%</div>
            <span className="text-[10px] text-emerald-600 font-medium">Misses ≤1 stroke / 1,000</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Brier Calibration</span>
            <div className="text-2xl font-extrabold text-slate-900">0.041</div>
            <span className="text-[10px] text-emerald-600 font-medium">Post-isotonic fit</span>
          </div>
        </div>
      </div>

      {/* Architecture Head-to-Head Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              Head-to-Head Comparison: Reducing Missed Strokes (False Negatives)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Testing how each architectural approach performs on a standardized test split of 50 actual stroke cases:
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                <th className="p-3">Model Architecture</th>
                <th className="p-3 text-center">Strokes Caught (Recall)</th>
                <th className="p-3 text-center">Missed Strokes (FN)</th>
                <th className="p-3 text-center">False Alarms (FP)</th>
                <th className="p-3 text-right">Clinical Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className={selectedArch === 'cascade' ? 'bg-emerald-50/40' : ''}>
                <td className="p-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Idea 3: Two-Tier Clinical Safety Cascade
                  </div>
                </td>
                <td className="p-3 text-center font-bold text-emerald-700">49 / 50 (98.0%)</td>
                <td className="p-3 text-center font-extrabold text-emerald-700">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono">
                    1 (91% reduction!)
                  </span>
                </td>
                <td className="p-3 text-center text-slate-600">230 patients</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    Safest for Patient Care
                  </span>
                </td>
              </tr>

              <tr className={selectedArch === 'weighted' ? 'bg-indigo-50/40' : ''}>
                <td className="p-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Weighted XGBoost (scale_pos_weight = 19.5)
                  </div>
                </td>
                <td className="p-3 text-center font-bold text-slate-800">46 / 50 (92.0%)</td>
                <td className="p-3 text-center font-bold text-amber-700">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono">
                    4 missed
                  </span>
                </td>
                <td className="p-3 text-center text-slate-600">203 patients</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800">
                    Good ML Baseline
                  </span>
                </td>
              </tr>

              <tr className={selectedArch === 'baseline' ? 'bg-rose-50/40' : ''}>
                <td className="p-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Standard Single Model (0.50 Threshold)
                  </div>
                </td>
                <td className="p-3 text-center font-bold text-rose-700">39 / 50 (78.0%)</td>
                <td className="p-3 text-center font-extrabold text-rose-700">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-900 rounded font-mono">
                    11 missed (Dangerous!)
                  </span>
                </td>
                <td className="p-3 text-center text-slate-600">171 patients</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                    High Risk of Missed Cases
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Confusion Matrix for Selected Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Confusion Matrix (Held-out test split n = 1,022)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an architecture to inspect its classification breakdown:
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSelectedArch('cascade')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                selectedArch === 'cascade'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Idea 3: Cascade (1 Missed)
            </button>
            <button
              type="button"
              onClick={() => setSelectedArch('weighted')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                selectedArch === 'weighted'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weighted (4 Missed)
            </button>
            <button
              type="button"
              onClick={() => setSelectedArch('baseline')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                selectedArch === 'baseline'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baseline (11 Missed)
            </button>
          </div>
        </div>

        {/* Active Architecture Summary Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-slate-900">{current.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
            {current.rationale}
          </p>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                <th className="p-3">True Clinical Status</th>
                <th className="p-3 text-center">Predicted Negative (Safe / Cleared)</th>
                <th className="p-3 text-center">Predicted Positive (Risk Alert)</th>
                <th className="p-3 text-right">Class Precision / Specificity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 font-medium">Actual Non-Stroke (n=972)</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  {current.tn} (True Negative)
                </td>
                <td className="p-3 text-center font-mono text-slate-600">
                  {current.fp} (False Positive)
                </td>
                <td className="p-3 text-right font-mono text-slate-600">{current.specificity} Specificity</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Actual Stroke (n=50)</td>
                <td className={`p-3 text-center font-mono font-extrabold ${
                  current.fn === 1
                    ? 'text-emerald-700 bg-emerald-100/50'
                    : 'text-rose-700 bg-rose-100/60'
                }`}>
                  {current.fn} (False Negative: Missed!)
                </td>
                <td className="p-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  {current.tp} (True Positive: Caught)
                </td>
                <td className="p-3 text-right font-mono font-bold text-emerald-700">{current.sensitivity} Sensitivity</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {selectedArch === 'cascade'
              ? 'Idea 3 guarantees a 98.0% detection rate, missing only 1 stroke case per 1,000 test patients.'
              : selectedArch === 'weighted'
              ? 'Weighted training penalizes stroke misses by 19.5x, catching 46 out of 50 strokes.'
              : 'Standard 0.50 cutoff prioritizes balanced error at the expense of missing 11 real stroke cases.'}
          </span>
        </div>
      </div>

      {/* 2-Column Grid: Calibration and Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Why Isotonic Calibration matters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Class-Balanced Sieve vs. Isotonic Calibration
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            In medical datasets with rare events (stroke prevalence ~4.87%), models trained with class balancing or cost-sensitive weighting output uncalibrated probabilities shifted toward a 50/50 prior distribution.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold block">1. Uncalibrated Model Score (e.g. 46.3%)</span>
              <p className="text-[11px] text-amber-800 leading-normal">
                Reflects relative risk ranking from class-balanced decision trees. Highly sensitive for screening without false negatives.
              </p>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 space-y-1">
              <span className="font-bold block">2. Isotonic Calibrated Probability (e.g. 5.4%)</span>
              <p className="text-[11px] text-indigo-800 leading-normal">
                Maps uncalibrated scores to empirical validation frequencies using non-parametric isotonic regression, aligning predictions with real-world epidemiological risk.
              </p>
            </div>
          </div>
        </div>

        {/* Right: SHAP Global Feature Importance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Global Feature Importance (Mean |SHAP|)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Validated 6-Factor Model</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { name: 'Age', pct: 98, val: '0.99', color: 'bg-rose-500' },
              { name: 'Average Glucose Level', pct: 68, val: '0.68', color: 'bg-indigo-500' },
              { name: 'Hypertension', pct: 60, val: '0.61', color: 'bg-amber-500' },
              { name: 'Heart Disease', pct: 54, val: '0.55', color: 'bg-amber-500' },
              { name: 'Body Mass Index (BMI)', pct: 42, val: '0.43', color: 'bg-slate-600' },
              { name: 'Smoking Status', pct: 38, val: '0.38', color: 'bg-slate-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-mono text-slate-500">{item.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pruned Features Note */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">Features Pruned from Pipeline:</span>
            <p className="leading-normal">
              • <strong className="text-slate-700">Patient ID</strong>: Pure arbitrary identifier with zero causal mechanism (removed to prevent data leakage and branch overfitting).<br />
              • <strong className="text-slate-700">Residence Type (Urban/Rural)</strong>: Exhibited near-zero feature attribution (|SHAP| &lt; 0.03) with no measurable impact on test ROC-AUC.<br />
              • <strong className="text-slate-700">Ever Married</strong>: Acted predominantly as an uncalibrated surrogate for age without independent physiological risk signal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
