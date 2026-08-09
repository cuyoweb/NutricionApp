'use client';

import React from 'react';
import { Droplet, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../lib/mobileAuthContext';

export const WaterTracker: React.FC = () => {
  const { todayLog, updateWater } = useAuth();

  const glasses = todayLog?.waterGlasses || 0;
  const targetGlasses = todayLog?.waterTargetGlasses || 8;
  const mlCurrent = glasses * 250;
  const mlTarget = targetGlasses * 250;
  const percentage = Math.min(100, Math.round((glasses / targetGlasses) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 text-lg">
            💧
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              Agua & Hidratación
              {percentage >= 100 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> ¡Meta lograda!
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {mlCurrent} ml de {mlTarget} ml recomendados
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="text-right bg-sky-50 px-3 py-1.5 rounded-2xl border border-sky-100">
          <span className="text-sm font-black text-sky-700 font-mono">
            {glasses} / {targetGlasses}
          </span>
          <span className="text-[10px] text-sky-600 block font-medium">vasos (250ml)</span>
        </div>
      </div>

      {/* Visual Glass Dots */}
      <div className="grid grid-cols-8 gap-1.5 my-3.5">
        {Array.from({ length: targetGlasses }).map((_, index) => {
          const isFilled = index < glasses;
          return (
            <div
              key={index}
              className={`h-7 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isFilled
                  ? 'bg-sky-500 text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-400 border border-slate-200/60'
              }`}
            >
              <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-white' : 'stroke-slate-400'}`} />
            </div>
          );
        })}
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
        <div className="flex-1">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">
            {percentage}% de tu hidratación diaria
          </span>
        </div>

        {/* +/- Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => updateWater(-1)}
            disabled={glasses <= 0}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Quitar un vaso"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => updateWater(1)}
            className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer font-bold"
            title="Sumar un vaso (+250ml)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
