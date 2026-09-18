import React from 'react';
import { X, ShieldAlert, PhoneCall, AlertTriangle } from 'lucide-react';

interface FastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FastModal: React.FC<FastModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const protocol = [
    {
      letter: 'B',
      word: 'Balance',
      detail: 'Sudden loss of balance, stumbling, dizziness, or lack of coordination.',
    },
    {
      letter: 'E',
      word: 'Eyes',
      detail: 'Sudden loss of vision, dimness, or double vision in one or both eyes.',
    },
    {
      letter: 'F',
      word: 'Face Drooping',
      detail: 'One side of the face droops or is numb. Smile appears visibly uneven or asymmetric.',
    },
    {
      letter: 'A',
      word: 'Arm Weakness',
      detail: 'One arm feels weak or numb. When raising both arms, one drifts downward.',
    },
    {
      letter: 'S',
      word: 'Speech Difficulty',
      detail: 'Slurred speech, difficulty articulating simple words, or confusion understanding language.',
    },
    {
      letter: 'T',
      word: 'Time to Call 911',
      detail: 'Stroke is a medical emergency. Call 911 immediately and note the time symptoms first appeared.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">B.E. F.A.S.T. Stroke Protocol</h2>
              <p className="text-xs text-slate-500">American Stroke Association Emergency Signs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {protocol.map((item) => (
            <div key={item.letter} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-7 h-7 shrink-0 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                {item.letter}
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{item.word}</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>If symptoms are present, call emergency services immediately.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
