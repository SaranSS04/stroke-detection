import React from 'react';
import { CounterfactualOption, PatientData } from '../types';
import { Lightbulb, ArrowDownRight, Sparkles, Check, Play } from 'lucide-react';

interface CounterfactualSimulatorProps {
  counterfactuals: CounterfactualOption[];
  currentRisk: number;
  onApplyCounterfactual: (modifiedData: Partial<PatientData>) => void;
}

export const CounterfactualSimulator: React.FC<CounterfactualSimulatorProps> = ({
  counterfactuals,
  currentRisk,
  onApplyCounterfactual,
}) => {
  if (!counterfactuals || counterfactuals.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
        Patient risk profile is already near baseline optimal levels. No high-impact counterfactuals identified.
      </div>
    );
  }

  return (
    <div id="section-counterfactual-simulator" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Counterfactual "What-If" Interventions
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Actionable Pathways
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescriptive modifications showing exact clinical levers to lower stroke risk
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
        {counterfactuals.map((cf) => {
          const reduction = Math.abs(cf.riskDifference);
          return (
            <div
              key={cf.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                    {cf.lifestyleCategory}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Feasibility: <strong className="text-slate-700">{cf.feasibility}</strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 mb-1">
                  {cf.label}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cf.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Projected Risk</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-base font-extrabold text-emerald-600">
                      {cf.projectedRisk}%
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded inline-flex items-center">
                      <ArrowDownRight className="w-3 h-3" />
                      -{reduction}%
                    </span>
                  </div>
                </div>

                <button
                  id={`btn-apply-cf-${cf.id}`}
                  type="button"
                  onClick={() => onApplyCounterfactual(cf.modifiedData)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Simulate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
