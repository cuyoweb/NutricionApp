'use client';

import React from 'react';
import { 
  TrendingDown, 
  Award, 
  Calendar, 
  ShieldCheck,
  Sparkles,
  Heart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { useAuth } from '../../../lib/mobileAuthContext';

export default function MiProgresoPage() {
  const { currentPatient, loading } = useAuth();

  if (loading || !currentPatient) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 min-h-[60vh] flex items-center justify-center">
        Cargando tu progreso...
      </div>
    );
  }

  const weightDelta = Number((currentPatient.currentWeightKg - currentPatient.initialWeightKg).toFixed(1));
  const remainingDelta = Number((currentPatient.currentWeightKg - currentPatient.targetWeightKg).toFixed(1));

  const chartData = currentPatient.anthropometricHistory.map(item => ({
    date: item.date.split('-').slice(1).join('/'),
    peso: item.weightKg,
    grasa: item.bodyFatPercentage,
    musculo: item.muscleMassPercentage
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" /> Mi Evolución
            </span>
            <h2 className="text-base font-bold text-slate-800 mt-0.5">Progreso Corporal</h2>
          </div>

          <div className="text-center bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-100 shrink-0">
            <span className="text-[10px] text-emerald-700 font-medium block">Diferencia</span>
            <span className={`text-base font-black ${
              weightDelta <= 0 ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {weightDelta > 0 ? `+${weightDelta}` : weightDelta} kg
            </span>
          </div>
        </div>
      </div>

      {/* Evolution Chart */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">Evolución de Peso (kg)</h3>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
            Meta: {currentPatient.targetWeightKg} kg
          </span>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <ReferenceLine y={currentPatient.targetWeightKg} stroke="#16a34a" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="peso" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
          <span>Inicio: <strong className="text-slate-800">{currentPatient.initialWeightKg} kg</strong></span>
          <span>Actual: <strong className="text-emerald-700 font-bold">{currentPatient.currentWeightKg} kg</strong></span>
          <span>Faltan: <strong className="text-blue-700 font-bold">{Math.abs(remainingDelta)} kg</strong></span>
        </div>
      </div>

      {/* Composition 3-Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-purple-50/70 border border-purple-100 p-3 rounded-2xl text-center">
          <span className="text-[11px] font-bold text-purple-800 block">Grasa</span>
          <span className="text-base font-black text-purple-900 mt-0.5 block">
            {currentPatient.bodyFatPercentage}%
          </span>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-2xl text-center">
          <span className="text-[11px] font-bold text-blue-800 block">Músculo</span>
          <span className="text-base font-black text-blue-900 mt-0.5 block">
            {currentPatient.muscleMassPercentage}%
          </span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl text-center">
          <span className="text-[11px] font-bold text-emerald-800 block">IMC</span>
          <span className="text-base font-black text-emerald-900 mt-0.5 block">
            {currentPatient.bmi}
          </span>
        </div>
      </div>

      {/* Nutritionist Consultation Note */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden ring-2 ring-emerald-500/20 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80"
              alt="Lic. Valentina Rossi"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Lic. Valentina Rossi</span>
            <span className="text-[10px] text-emerald-700 font-medium">M.P. 1842 - Mendoza</span>
          </div>
        </div>

        <p className="text-xs text-slate-700 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 leading-relaxed font-medium">
          "{currentPatient.clinicalNotes}"
        </p>
      </div>
    </div>
  );
}
