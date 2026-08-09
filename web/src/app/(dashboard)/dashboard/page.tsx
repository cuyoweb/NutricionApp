'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  UtensilsCrossed, 
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { Header } from '../../../components/Header';
import { PlanBadge } from '../../../components/PlanBadge';
import { api } from '../../../lib/api';
import { Patient } from '../../../types';

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getPatients();
        setPatients(data);
      } catch (err) {
        console.error('Error fetching patients for dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const totalPatients = patients.length || 10;
  const totalMrr = patients.reduce((acc, p) => acc + (p.planPriceArs || 0), 0);
  const avgAdherence = patients.length 
    ? Math.round(patients.reduce((acc, p) => acc + (p.adherenceRate || 0), 0) / patients.length)
    : 86;

  // Plan distribution data for charts
  const planCounts = {
    FREE: patients.filter(p => p.plan === 'FREE').length,
    INICIAL: patients.filter(p => p.plan === 'INICIAL').length,
    PRO: patients.filter(p => p.plan === 'PRO').length,
    PREMIUM: patients.filter(p => p.plan === 'PREMIUM').length,
  };

  const planChartData = [
    { name: 'FREE ($0)', count: planCounts.FREE || 2, color: '#94a3b8' }, // slate-400
    { name: 'INICIAL ($6k)', count: planCounts.INICIAL || 2, color: '#60a5fa' }, // blue-400
    { name: 'PRO ($10k)', count: planCounts.PRO || 3, color: '#34d399' }, // emerald-400
    { name: 'PREMIUM ($12k)', count: planCounts.PREMIUM || 3, color: '#a855f7' } // purple-500
  ];

  // Revenue & Adherence Timeline Mock
  const timelineData = [
    { month: 'Marzo', ingresos: 42000, adherencia: 78 },
    { month: 'Abril', ingresos: 54000, adherencia: 81 },
    { month: 'Mayo', ingresos: 62000, adherencia: 83 },
    { month: 'Junio', ingresos: 70000, adherencia: 85 },
    { month: 'Julio', ingresos: 82000, adherencia: 88 },
    { month: 'Agosto (Act.)', ingresos: totalMrr || 74000, adherencia: avgAdherence }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] min-h-screen">
      <Header 
        title="Panel General" 
        subtitle="Métricas de pacientes, ingresos recurrentes y adherencia nutricional" 
      />

      <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Patients */}
          <div className="glass-card p-5 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Pacientes</span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{totalPatients}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2 mes
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">100% activos en Mendoza</p>
          </div>

          {/* Card 2: MRR Revenue */}
          <div className="glass-card p-5 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Ingresos (MRR)</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-800 tracking-tight">
                ${totalMrr.toLocaleString('es-AR')}
              </span>
              <span className="text-xs text-slate-500 font-bold">ARS</span>
            </div>
            <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              8 suscripciones activas
            </p>
          </div>

          {/* Card 3: Adherence Rate */}
          <div className="glass-card p-5 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Adherencia</span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{avgAdherence}%</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">Medición diaria de checklist</p>
          </div>

          {/* Card 4: Plans Balance */}
          <div className="glass-card p-5 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Plan Más Elegido</span>
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-black text-purple-700 tracking-tight">PREMIUM & PRO</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">60% del total de pacientes</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Plan Distribution */}
          <div className="glass-panel p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-800">Distribución de Planes</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Categorías activas</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl">
                10 Total
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#1e293b', fontWeight: 800 }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={40}>
                    {planChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {planChartData.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-xs font-bold text-slate-600">{p.name.split(' ')[0]}</span>
                  </div>
                  <span className="font-black text-slate-800 text-xs">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Revenue & Adherence Evolution */}
          <div className="lg:col-span-2 glass-panel p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-800">Evolución de Ingresos y Adherencia</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Comportamiento semestral</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Ingresos
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Adherencia
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#1e293b', fontWeight: 800 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line yAxisId="right" type="monotone" dataKey="adherencia" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs font-medium text-emerald-800">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Sede Mendoza Centro</span>
              <span className="font-bold bg-white px-3 py-1 rounded-xl shadow-sm text-emerald-700 border border-emerald-100">Tasa de retención clínica: 94%</span>
            </div>
          </div>
        </div>

        {/* Patients Summary Table Preview */}
        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">Pacientes Recientes</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Últimos registros de peso y adherencia</p>
            </div>
            <Link
              href="/pacientes"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Paciente</th>
                  <th className="pb-3">Ubicación</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Peso (Act/Meta)</th>
                  <th className="pb-3">Adherencia</th>
                  <th className="pb-3">Racha</th>
                  <th className="pb-3 text-right pr-2">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl}
                          alt={p.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                            {p.fullName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">{p.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.locality.split(',')[0]}
                      </span>
                    </td>
                    <td className="py-3">
                      <PlanBadge plan={p.plan} size="sm" />
                    </td>
                    <td className="py-3">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-slate-800 text-sm">{p.currentWeightKg}</span>
                        <span className="text-slate-400 text-xs font-medium">/ {p.targetWeightKg} kg</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${p.adherenceRate}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{p.adherenceRate}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-xl inline-flex items-center gap-1 shadow-sm">
                        🔥 {p.streakDays}d
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <Link
                        href={`/pacientes/${p.id}`}
                        className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        Ver Ficha
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
