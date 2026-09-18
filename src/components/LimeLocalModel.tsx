import React from 'react';
import { LimeRule } from '../types';
import { Cpu, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';

interface LimeLocalModelProps {
  rules: LimeRule[];
  r2Score: number;
}

export const LimeLocalModel: React.FC<LimeLocalModelProps> = ({ rules, r2Score }) => {
  return (
    <div id="section-lime-surrogate" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              LIME Local Surrogate Model
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
              Local Fidelity
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Local Interpretable Model-agnostic Explanations fitted to patient neighborhood
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500">Local Fit (R²): </span>
            <strong className="font-mono text-indigo-700">{r2Score}</strong>
          </div>
        </div>
      </div>

      {/* Concept description */}
      <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
        LIME perturbs the input space around this specific patient's clinical vector and fits a sparse linear surrogate model to reveal the immediate local decision boundaries that separate this patient from a normal baseline.
      </div>

      {/* Rule list */}
      <div className="space-y-2.5">
        {rules.map((rule, idx) => {
          const isIncrease = rule.direction === 'increase';
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/60 transition-colors text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-mono text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <code className="font-mono text-slate-800 font-semibold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                  {rule.rule}
                </code>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-mono font-bold text-xs ${
                    isIncrease ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {isIncrease ? `+${(rule.weight * 100).toFixed(1)}%` : `${(rule.weight * 100).toFixed(1)}%`}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isIncrease
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isIncrease ? 'Increases Risk' : 'Decreases Risk'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
