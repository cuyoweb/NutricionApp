'use client';

import React from 'react';
import { Sparkles, Flame, Apple, Activity } from 'lucide-react';
import { MealPlanDetail, DailyLogState } from '../../types';

interface CalorieMacroHeroProps {
  plan: MealPlanDetail | null;
  todayLog: DailyLogState | null;
}

export const CalorieMacroHero: React.FC<CalorieMacroHeroProps> = ({ plan, todayLog }) => {
  // Goal targets
  const goalKcal = plan?.caloriesTarget || 1950;
  const goalProtein = plan?.proteinGrams || 135;
  const goalCarbs = plan?.carbsGrams || 190;
  const goalFats = plan?.fatsGrams || 55;

  // Consumed based on completed meals
  const completedMealIds = todayLog?.completedMealIds || [];
  const activeDayMeals = plan?.days[0]?.meals || [];

  let consumedKcal = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFats = 0;

  activeDayMeals.forEach((meal) => {
    if (completedMealIds.includes(meal.id)) {
      meal.items.forEach((it) => {
        consumedKcal += it.calories || 0;
        consumedProtein += it.proteinGrams || 0;
        consumedCarbs += it.carbsGrams || 0;
        consumedFats += it.fatsGrams || 0;
      });
    }
  });

  const remainingKcal = Math.max(0, goalKcal - consumedKcal);
  const remainingProtein = Math.max(0, goalProtein - consumedProtein);
  const remainingCarbs = Math.max(0, goalCarbs - consumedCarbs);
  const remainingFats = Math.max(0, goalFats - consumedFats);

  const kcalPercent = Math.min(100, Math.round((consumedKcal / goalKcal) * 100));
  const proteinPercent = Math.min(100, Math.round((consumedProtein / goalProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / goalCarbs) * 100));
  const fatsPercent = Math.min(100, Math.round((consumedFats / goalFats) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 relative overflow-hidden">
      {/* Friendly Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
            <Apple className="w-3.5 h-3.5 text-emerald-600" /> Mi Meta Calórica
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs text-slate-500 font-medium">
              <strong className="text-slate-700">{goalKcal.toLocaleString('es-AR')}</strong> Meta
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              <strong className="text-emerald-700">{consumedKcal.toLocaleString('es-AR')}</strong> Consumidas
            </span>
          </div>
        </div>

        {/* Big Remaining Calories Highlight */}
        <div className="text-right bg-emerald-50/80 px-3.5 py-2 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-end gap-1 text-emerald-800 font-black text-2xl tracking-tight">
            <span>{remainingKcal.toLocaleString('es-AR')}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
            kcal restantes
          </span>
        </div>
      </div>

      {/* Main Calorie Progress Bar */}
      <div className="my-4">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, kcalPercent)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
          <span>{kcalPercent}% completado</span>
          <span>{consumedKcal} / {goalKcal} kcal</span>
        </div>
      </div>

      {/* Friendly 3-Macro Cards */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {/* Carbs */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-2.5 text-center">
          <span className="text-[11px] font-bold text-amber-800 block mb-0.5">
            🌾 Carbos
          </span>
          <div className="text-xs font-bold text-slate-800">
            {consumedCarbs} <span className="text-[10px] text-slate-500 font-normal">/ {goalCarbs}g</span>
          </div>
          <div className="w-full bg-amber-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-amber-700 font-medium mt-1 block">
            {remainingCarbs}g rest.
          </span>
        </div>

        {/* Protein */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-2.5 text-center">
          <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
            🥩 Proteína
          </span>
          <div className="text-xs font-bold text-slate-800">
            {consumedProtein} <span className="text-[10px] text-slate-500 font-normal">/ {goalProtein}g</span>
          </div>
          <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            {remainingProtein}g rest.
          </span>
        </div>

        {/* Fats */}
        <div className="bg-lime-50/70 border border-lime-100 rounded-2xl p-2.5 text-center">
          <span className="text-[11px] font-bold text-lime-800 block mb-0.5">
            🥑 Grasas
          </span>
          <div className="text-xs font-bold text-slate-800">
            {consumedFats} <span className="text-[10px] text-slate-500 font-normal">/ {goalFats}g</span>
          </div>
          <div className="w-full bg-lime-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-lime-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${fatsPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-lime-700 font-medium mt-1 block">
            {remainingFats}g rest.
          </span>
        </div>
      </div>
    </div>
  );
};
