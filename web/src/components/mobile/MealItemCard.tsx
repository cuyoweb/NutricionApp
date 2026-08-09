'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  Utensils,
  Flame
} from 'lucide-react';
import { MealSlotDetail } from '../../types';

interface MealItemCardProps {
  meal: MealSlotDetail;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const MealItemCard: React.FC<MealItemCardProps> = ({
  meal,
  isCompleted,
  onToggleComplete
}) => {
  const [expanded, setExpanded] = useState(false);

  const totalCalories = meal.items.reduce((acc, it) => acc + it.calories, 0);
  const totalProtein = meal.items.reduce((acc, it) => acc + it.proteinGrams, 0);

  return (
    <div
      className={`bg-surface-card border rounded-2xl p-4 transition-all duration-300 ${
        isCompleted
          ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 to-surface-card'
          : 'border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Completion Checkbox */}
          <button
            onClick={onToggleComplete}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500 text-black shadow-glow-emerald scale-105'
                : 'bg-slate-800 border border-slate-700 text-transparent hover:border-emerald-500/50'
            }`}
            title={isCompleted ? 'Marcar como pendiente' : 'Marcar comida como realizada'}
          >
            <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-black' : 'opacity-0'}`} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                {meal.type}
              </span>
              {meal.timeHint && (
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                  <Clock className="w-2.5 h-2.5" /> {meal.timeHint}
                </span>
              )}
            </div>

            <h4 className={`text-xs font-bold mt-0.5 transition-colors ${
              isCompleted ? 'text-emerald-300 line-through opacity-80' : 'text-slate-100'
            }`}>
              {meal.title}
            </h4>

            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
              {meal.description}
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-slate-400 hover:text-slate-200 rounded-lg transition-colors shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Summary Pill Row */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> ~{totalCalories} kcal
          </span>
          <span className="text-blue-400 font-semibold">
            P: {totalProtein}g
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-emerald-400 font-medium transition-colors"
        >
          {expanded ? 'Ocultar ingredientes' : `Ver ${meal.items.length} alimentos`}
        </button>
      </div>

      {/* Expandable Food Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in slide-in-from-top-1">
          <div className="space-y-1.5">
            {meal.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <span className="font-semibold text-slate-200 block truncate">{it.foodName}</span>
                  <span className="text-[9px] text-slate-400">
                    {it.category} • {it.calories} kcal • P: {it.proteinGrams}g
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded">
                    {it.quantityGrams}{it.unit}
                  </span>

                  <Link
                    href={`/reemplazos?food=${encodeURIComponent(it.foodName)}&grams=${it.quantityGrams}`}
                    title="Consultar reemplazo por IA"
                    className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-800/30 text-[10px] text-blue-300 flex items-center justify-between">
            <span>¿No tenés algún ingrediente en casa?</span>
            <Link
              href="/reemplazos"
              className="text-blue-400 font-bold underline flex items-center gap-1"
            >
              Pedir reemplazo IA <Sparkles className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
