'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Utensils, 
  Droplet, 
  Calendar, 
  Flame, 
  Plus, 
  ChevronRight,
  Sun
} from 'lucide-react';
import { useAuth } from '../../../lib/mobileAuthContext';
import { CalorieMacroHero } from '../../../components/mobile/CalorieMacroHero';
import { MealDiaryCard } from '../../../components/mobile/MealDiaryCard';
import { WaterTracker } from '../../../components/mobile/WaterTracker';

export default function MobileDiarioPage() {
  const { currentPatient, activePlan, todayLog, toggleMealCompletion, loading } = useAuth();

  if (loading || !currentPatient) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span>Cargando tu diario saludable...</span>
      </div>
    );
  }

  const todayStr = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const completedMealIds = todayLog?.completedMealIds || [];
  const meals = activePlan?.days[0]?.meals || [];

  return (
    <div className="p-4 space-y-4">
      {/* Date Header Pill */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold capitalize">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Hoy, {todayStr}</span>
        </div>
        <Link
          href="/dieta"
          className="text-xs text-emerald-700 font-bold flex items-center gap-0.5 hover:underline"
        >
          <span>Ver Plan Semanal</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Calorie & Macro Tracker */}
      <CalorieMacroHero plan={activePlan} todayLog={todayLog} />

      {/* Water Tracker Tile */}
      <WaterTracker />

      {/* Meals Segmented List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Comidas del Día ({completedMealIds.length}/{meals.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            {activePlan?.title?.split('-')[0] || 'Plan Activo'}
          </span>
        </div>

        {meals.map((meal) => (
          <MealDiaryCard
            key={meal.id}
            meal={meal}
            isCompleted={completedMealIds.includes(meal.id)}
            onToggleComplete={() => toggleMealCompletion(meal.id)}
          />
        ))}
      </div>

      {/* AI Assistant Quick Banner */}
      <Link
        href="/reemplazos"
        className="block bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 rounded-3xl border border-emerald-200/80 shadow-soft hover:shadow-soft-lg transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform text-lg">
              ✨
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                Sustituir Alimentos con IA
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                  Nuevo
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ¿No tenés un ingrediente? Calculá el cambio exacto
              </p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
