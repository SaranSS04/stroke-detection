import React, { useState } from 'react';
import { ShapValue } from '../types';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Layers, BarChart2 } from 'lucide-react';

interface ShapWaterfallChartProps {
  shapValues: ShapValue[];
  baseRisk: number;
  finalRisk: number;
}

export const ShapWaterfallChart: React.FC<ShapWaterfallChartProps> = ({
  shapValues,
  baseRisk,
  finalRisk,
}) => {
  const [viewMode, setViewMode] = useState<'waterfall' | 'table'>('waterfall');
  const [selectedFeature, setSelectedFeature] = useState<ShapValue | null>(null);

  const maxAbsValue = Math.max(...shapValues.map((s) => Math.abs(s.value)), 1.5);

  return (
    <div id="section-shap-explanation" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              SHAP Feature Attribution (Shapley Values)
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Additive Force
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Exact mathematical decomposition of risk relative to population baseline E[f(x)] = {baseRisk}%
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg self-start sm:self-center">
          <button
            id="btn-view-waterfall"
            onClick={() => setViewMode('waterfall')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              viewMode === 'waterfall'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Waterfall
          </button>
          <button
            id="btn-view-table"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Detail Table
          </button>
        </div>
      </div>

      {/* Population to Patient Delta Summary Banner */}
      <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Population Base E[f(x)]:</span>
          <strong className="text-slate-800 font-mono text-sm">{baseRisk}%</strong>
        </div>

        <div className="text-slate-400 font-bold hidden sm:block">+</div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Net SHAP Delta ∑φᵢ:</span>
          <strong
            className={`font-mono text-sm ${
              finalRisk >= baseRisk ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {finalRisk >= baseRisk ? `+${(finalRisk - baseRisk).toFixed(1)}%` : `${(finalRisk - baseRisk).toFixed(1)}%`}
          </strong>
        </div>

        <div className="text-slate-400 font-bold hidden sm:block">=</div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Patient Final Risk f(x):</span>
          <strong className="text-indigo-900 font-mono text-sm bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            {finalRisk}%
          </strong>
        </div>
      </div>

      {viewMode === 'waterfall' ? (
        <div className="space-y-3 pt-2">
          {shapValues.map((item) => {
            const isPositive = item.value > 0;
            const barWidthPercent = Math.min(100, (Math.abs(item.value) / maxAbsValue) * 100);

            return (
              <div
                key={item.featureKey}
                onClick={() => setSelectedFeature(item === selectedFeature ? null : item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedFeature?.featureKey === item.featureKey
                    ? 'border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-300'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-800">{item.featureName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">({item.displayValue})</span>
                  </div>

                  <span
                    className={`font-mono font-bold text-xs ${
                      isPositive ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {isPositive ? `+${item.value}%` : `${item.value}%`}
                  </span>
                </div>

                {/* Horizontal divergent bar */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden flex">
                  {isPositive ? (
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  ) : (
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  )}
                </div>

                {/* Feature interpretation note */}
                <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">
                  {item.clinicalNote}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Clinical Variable</th>
                <th className="py-2.5 px-3">Patient Value</th>
                <th className="py-2.5 px-3">SHAP Attribution (φᵢ)</th>
                <th className="py-2.5 px-3">Impact Direction</th>
                <th className="py-2.5 px-3">Pathophysiological Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shapValues.map((item) => (
                <tr key={item.featureKey} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.featureName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{item.displayValue}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">
                    <span className={item.value > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {item.value > 0 ? `+${item.value}%` : `${item.value}%`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.value > 0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.value > 0 ? 'Risk Pusher' : 'Protective Factor'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">{item.clinicalNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
