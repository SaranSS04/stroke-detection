import React from 'react';
import { Activity, ShieldAlert, Sparkles, FileText, Info } from 'lucide-react';

interface NavbarProps {
  onOpenFastModal: () => void;
  onOpenReportModal: () => void;
  onOpenModelInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFastModal,
  onOpenReportModal,
  onOpenModelInfo,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-200">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Stroke Risk AI
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                XAI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Explainable Clinical Risk Engine &amp; Counterfactual Simulation
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="btn-fast-protocol"
            onClick={onOpenFastModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            title="Emergency Stroke Warning Signs Protocol"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="font-semibold">B.E. F.A.S.T.</span>
          </button>

          <button
            id="btn-model-architecture"
            onClick={onOpenModelInfo}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Model Stats (AUC 0.84)</span>
          </button>

          <button
            id="btn-clinical-report"
            onClick={onOpenReportModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-200" />
            <span>Clinical Summary</span>
          </button>
        </div>
      </div>
    </header>
  );
};
