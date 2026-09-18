import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Info } from 'lucide-react';
import { PredictionResult } from '../types';

interface RiskScoreCardProps {
  prediction: PredictionResult;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ prediction }) => {
  const { riskScore, riskCategory, confidenceInterval, baseValue } = prediction;

  const getCategoryTheme = () => {
    switch (riskCategory) {
      case 'Low':
        return {
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          barColor: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          icon: ShieldCheck,
          summary: 'Low 10-Year Probability of Cerebrovascular Incident',
          advice: 'Maintain current healthy lifestyle parameters, periodic primary care checkups, and balanced nutrition.',
        };
      case 'Moderate':
        return {
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          barColor: 'bg-amber-500',
          textColor: 'text-amber-700',
          icon: AlertTriangle,
          summary: 'Moderate Cerebrovascular Risk Profile',
          advice: 'Early preventive intervention recommended: optimize blood pressure, monitor fasting glucose, and consider lifestyle adjustments.',
        };
      case 'High':
        return {
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
          barColor: 'bg-orange-500',
          textColor: 'text-orange-700',
          icon: AlertTriangle,
          summary: 'High Clinical Stroke Probability',
          advice: 'Active clinical management recommended: structured antihypertensive therapy, strict glycemic regulation, and smoking cessation support.',
        };
      case 'Critical':
        return {
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          barColor: 'bg-rose-600',
          textColor: 'text-rose-700',
          icon: AlertOctagon,
          summary: 'Critical Urgent Risk Tier',
          advice: 'Immediate comprehensive cardiovascular workup advised: carotid artery duplex ultrasound, ECG monitoring for atrial fibrillation, and strict pharmacological therapy.',
        };
    }
  };

  const theme = getCategoryTheme();
  const IconComponent = theme.icon;
  const ratioToBase = (riskScore / baseValue).toFixed(1);

  return (
    <div id="card-stroke-risk-score" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Predictive AI Assessment
          </span>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Stroke Risk Probability
          </h2>
        </div>

        <span
          id="badge-risk-category"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badgeBg}`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          {riskCategory.toUpperCase()} RISK
        </span>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Big percentage & dial */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div className="relative flex items-center justify-center mb-2">
            <span id="label-risk-percentage" className={`text-5xl sm:text-6xl font-extrabold tracking-tight ${theme.textColor}`}>
              {riskScore}%
            </span>
          </div>

          <div className="w-full mt-2">
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${theme.barColor} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, riskScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
              <span>0%</span>
              <span>15% (Mod)</span>
              <span>25% (High)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              95% Confidence Interval: <strong className="text-slate-700">[{confidenceInterval[0]}% – {confidenceInterval[1]}%]</strong>
            </p>
          </div>
        </div>

        {/* Clinical Interpretation & Metrics */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {theme.summary}
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              {theme.advice}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Baseline Cohort</span>
              <span className="text-base font-bold text-slate-800">{baseValue}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">General adult population</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Relative Multiplier</span>
              <span className={`text-base font-bold flex items-center gap-1 ${riskScore >= baseValue ? 'text-rose-600' : 'text-emerald-600'}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                {ratioToBase}x
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">vs. baseline population</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
