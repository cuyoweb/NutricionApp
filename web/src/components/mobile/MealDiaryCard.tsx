'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles 
} from 'lucide-react';
import { MealSlotDetail } from '../../types';

interface MealDiaryCardProps {
  meal: MealSlotDetail;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const MealDiaryCard: React.FC<MealDiaryCardProps> = ({
  meal,
  isCompleted,
  onToggleComplete
}) => {
  const [expanded, setExpanded] = useState(false);

  const mealKcal = meal.items.reduce((acc, it) => acc + (it.calories || 0), 0);
  const mealProtein = meal.items.reduce((acc, it) => acc + (it.proteinGrams || 0), 0);
  const mealCarbs = meal.items.reduce((acc, it) => acc + (it.carbsGrams || 0), 0);
  const mealFats = meal.items.reduce((acc, it) => acc + (it.fatsGrams || 0), 0);

  const mealMeta: Record<string, { icon: string; bg: string; text: string }> = {
    DESAYUNO: { icon: '🍳', bg: 'bg-amber-50', text: 'text-amber-800' },
    MEDIA_MANANA: { icon: '🍎', bg: 'bg-red-50', text: 'text-red-800' },
    ALMUERZO: { icon: '🥗', bg: 'bg-emerald-50', text: 'text-emerald-800' },
    MERIENDA: { icon: '🥑', bg: 'bg-lime-50', text: 'text-lime-800' },
    CENA: { icon: '🍲', bg: 'bg-teal-50', text: 'text-teal-800' },
    COLACION: { icon: '🍓', bg: 'bg-rose-50', text: 'text-rose-800' }
  };

  const meta = mealMeta[meal.type] || { icon: '🍽️', bg: 'bg-slate-50', text: 'text-slate-800' };

  return (
    <div
      className={`bg-white rounded-3xl p-4.5 transition-all duration-200 shadow-soft border ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/30'
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl ${meta.bg} flex items-center justify-center text-xl shrink-0 border border-slate-100`}>
            {meta.icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-800 capitalize truncate">
                {meal.type.toLowerCase().replace('_', ' ')}
              </h4>
              {meal.timeHint && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {meal.timeHint}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate font-medium">
              {meal.title}
            </p>
          </div>
        </div>

        {/* Right action & Calories pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 block">
              {mealKcal} <span className="text-[10px] text-slate-400 font-normal">kcal</span>
            </span>
          </div>

          {/* 1-Tap Toggle Button */}
          <button
            onClick={onToggleComplete}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="text-[11px]">Listo</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[11px]">Registrar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Macro Split Bar & Expand toggle */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-amber-700 font-semibold">C: {mealCarbs}g</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">P: {mealProtein}g</span>
          <span>•</span>
          <span className="text-lime-700 font-semibold">G: {mealFats}g</span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <span>{expanded ? 'Ocultar' : `${meal.items.length} alimentos`}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Food Items */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-1">
          {meal.items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div className="min-w-0 flex-1 pr-2">
                <span className="font-bold text-slate-800 block truncate">{it.foodName}</span>
                <span className="text-[11px] text-slate-500">
                  {it.quantityGrams}{it.unit} • {it.calories} kcal • P: {it.proteinGrams}g
                </span>
              </div>

              <Link
                href={`/reemplazos?food=${encodeURIComponent(it.foodName)}&grams=${it.quantityGrams}`}
                className="flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-900 font-bold bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl shrink-0 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-emerald-700" />
                <span>Cambiar</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
