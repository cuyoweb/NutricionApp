'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  Sparkles, 
  Calendar, 
  Clock, 
  Apple,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../../lib/mobileAuthContext';

export default function MiDietaSemanalPage() {
  const { currentPatient, activePlan, loading } = useAuth();
  const [selectedDay, setSelectedDay] = useState('Lunes');

  if (loading || !currentPatient) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 min-h-[60vh] flex items-center justify-center">
        Cargando tu plan semanal...
      </div>
    );
  }

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const currentDayPlan = activePlan?.days.find(d => d.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()) || activePlan?.days[0];

  const mealIcons: Record<string, { icon: string; bg: string }> = {
    DESAYUNO: { icon: '🍳', bg: 'bg-amber-50' },
    MEDIA_MANANA: { icon: '🍎', bg: 'bg-red-50' },
    ALMUERZO: { icon: '🥗', bg: 'bg-emerald-50' },
    MERIENDA: { icon: '🥑', bg: 'bg-lime-50' },
    CENA: { icon: '🍲', bg: 'bg-teal-50' },
    COLACION: { icon: '🍓', bg: 'bg-rose-50' }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Plan Prescrito
          </span>
          <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            {activePlan?.caloriesTarget || 1950} kcal / día
          </span>
        </div>

        <h2 className="text-base font-bold text-slate-800">
          {activePlan?.title || 'Plan Nutricional Saludable'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {activePlan?.notes || 'Plan adaptado a tus gustos y necesidades nutricionales.'}
        </p>

        {/* Macro Targets Pill Bar */}
        <div className="grid grid-cols-3 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-100 text-center">
          <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-100">
            <span className="text-[11px] text-amber-800 block font-bold">🌾 Carbos</span>
            <span className="text-xs font-bold text-slate-800">{activePlan?.carbsGrams || 190}g</span>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
            <span className="text-[11px] text-emerald-800 block font-bold">🥩 Proteína</span>
            <span className="text-xs font-bold text-slate-800">{activePlan?.proteinGrams || 135}g</span>
          </div>
          <div className="bg-lime-50/70 p-2.5 rounded-2xl border border-lime-100">
            <span className="text-[11px] text-lime-800 block font-bold">🥑 Grasas</span>
            <span className="text-xs font-bold text-slate-800">{activePlan?.fatsGrams || 55}g</span>
          </div>
        </div>
      </div>

      {/* Day Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-green-glow'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Meals for Selected Day */}
      <div className="space-y-3">
        {currentDayPlan?.meals.map((meal) => {
          const mealKcal = meal.items.reduce((acc, it) => acc + it.calories, 0);
          const meta = mealIcons[meal.type] || { icon: '🍽️', bg: 'bg-slate-50' };

          return (
            <div
              key={meal.id}
              className="bg-white rounded-3xl p-4.5 shadow-soft border border-slate-100 space-y-3"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-2xl ${meta.bg} flex items-center justify-center text-lg border border-slate-100`}>
                    {meta.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {meal.type} • {meal.timeHint}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">
                      {meal.title}
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                  {mealKcal} kcal
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {meal.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="font-bold text-slate-800 block truncate">{it.foodName}</span>
                      <span className="text-[11px] text-slate-500">
                        {it.quantityGrams}{it.unit} • {it.calories} kcal
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
