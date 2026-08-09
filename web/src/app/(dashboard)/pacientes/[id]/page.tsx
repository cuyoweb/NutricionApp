'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ArrowLeft, 
  Sparkles, 
  Activity, 
  Scale, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Droplet, 
  Utensils, 
  PlusCircle, 
  FileText,
  Flame
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { Header } from '../../../../components/Header';
import { PlanBadge } from '../../../../components/PlanBadge';
import { api } from '../../../../lib/api';
import { Patient, AnthropometricPoint } from '../../../../types';

export default function PacienteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'antropometria' | 'dieta' | 'seguimiento'>('antropometria');
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');

  // Form to add metric check-in
  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [newMuscle, setNewMuscle] = useState('');
  const [metricNotes, setMetricNotes] = useState('');
  const [savingMetric, setSavingMetric] = useState(false);

  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await api.getPatientById(patientId);
        setPatient(data);
      } catch (err) {
        console.error('Error loading patient detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [patientId]);

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !newWeight) return;
    setSavingMetric(true);

    try {
      const updated = await api.updatePatientMetrics(patient.id, {
        weightKg: Number(newWeight),
        bodyFatPercentage: newBodyFat ? Number(newBodyFat) : undefined,
        muscleMassPercentage: newMuscle ? Number(newMuscle) : undefined,
        notes: metricNotes || 'Control en consultorio presencial'
      });
      setPatient(updated);
      setNewWeight('');
      setNewBodyFat('');
      setNewMuscle('');
      setMetricNotes('');
    } catch (err) {
      console.error('Error adding metric:', err);
    } finally {
      setSavingMetric(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#090d16] text-slate-400 text-xs">
        Cargando ficha clínica del paciente en Mendoza...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex-1 p-8 text-center bg-[#090d16] min-h-screen">
        <p className="text-slate-300">Paciente no encontrado.</p>
        <Link href="/pacientes" className="mt-4 inline-block text-blue-400 underline text-xs">
          Volver a la lista
        </Link>
      </div>
    );
  }

  // Format chart data
  const chartData = patient.anthropometricHistory.map((item) => ({
    date: item.date,
    peso: item.weightKg,
    grasa: item.bodyFatPercentage,
    musculo: item.muscleMassPercentage,
    notes: item.notes
  }));

  const activePlan = patient.activeMealPlan;
  const currentDayPlan = activePlan?.days.find(d => d.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()) || activePlan?.days[0];

  return (
    <div className="flex-1 flex flex-col bg-[#090d16] min-h-screen">
      <Header 
        title={`Ficha Clínica • ${patient.fullName}`} 
        subtitle={`Historia clínica digital - ${patient.locality}`} 
      />

      <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Back Link & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/pacientes"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la lista de pacientes</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/crear-dieta?patientId=${patient.id}`}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-glow-blue transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Asignar / Modificar Dieta</span>
            </Link>
          </div>
        </div>

        {/* Patient Profile Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={patient.avatarUrl}
              alt={patient.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-slate-100">{patient.fullName}</h1>
                <PlanBadge plan={patient.plan} size="md" />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {patient.locality}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {patient.email}
                </span>
                <span className="text-slate-400 font-mono">
                  {patient.age} años • {patient.heightCm} cm
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics stats */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block">Peso Actual</span>
              <span className="text-base font-bold text-slate-100">{patient.currentWeightKg} kg</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block">Objetivo</span>
              <span className="text-base font-bold text-emerald-400">{patient.targetWeightKg} kg</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block">Adherencia</span>
              <span className="text-base font-bold text-blue-400">{patient.adherenceRate}%</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('antropometria')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'antropometria' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Métricas Antropométricas & Evolución
            {activeTab === 'antropometria' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('dieta')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'dieta' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Plan Nutricional Activo
            {activeTab === 'dieta' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('seguimiento')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'seguimiento' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Seguimiento Diario & Checklists
            {activeTab === 'seguimiento' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: Antropometría & Evolución */}
        {activeTab === 'antropometria' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Evolution Chart */}
              <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Curva de Peso & Bioimpedancia</h3>
                    <p className="text-[11px] text-slate-400">Evolución de mediciones clínicas registradas</p>
                  </div>
                  <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    Meta: {patient.targetWeightKg} kg
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      />
                      <ReferenceLine y={patient.targetWeightKg} stroke="#10b981" strokeDasharray="3 3" label="Meta" />
                      <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="grasa" name="Grasa (%)" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="musculo" name="Músculo (%)" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-3 h-0.5 bg-blue-500"></span> Peso Corporal (kg)
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <span className="w-3 h-0.5 bg-purple-500"></span> Grasa Corporal (%)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-3 h-0.5 bg-emerald-500"></span> Masa Muscular (%)
                  </span>
                </div>
              </div>

              {/* Add New Check-in Form */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 mb-1">Registrar Control Clínico</h3>
                <p className="text-[11px] text-slate-400 mb-4">Ingresar nueva medición en consultorio</p>

                <form onSubmit={handleAddMetric} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Peso Actual (kg)*</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder={`ej: ${patient.currentWeightKg}`}
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Grasa (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="22.5"
                        value={newBodyFat}
                        onChange={(e) => setNewBodyFat(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Músculo (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="34.0"
                        value={newMuscle}
                        onChange={(e) => setNewMuscle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Notas de la consulta</label>
                    <textarea
                      rows={2}
                      placeholder="Observaciones de bioimpedancia o cambios en rutina..."
                      value={metricNotes}
                      onChange={(e) => setMetricNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingMetric}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{savingMetric ? 'Guardando...' : 'Guardar Medición'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Anthropometric History Table */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-3">Historial de Consultas & Mediciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-2 pl-2">Fecha</th>
                      <th className="pb-2">Peso</th>
                      <th className="pb-2">Grasa %</th>
                      <th className="pb-2">Músculo %</th>
                      <th className="pb-2">Cintura</th>
                      <th className="pb-2">Cadera</th>
                      <th className="pb-2 pr-2">Observaciones Clínicas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {patient.anthropometricHistory.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2.5 pl-2 font-mono text-slate-300">{rec.date}</td>
                        <td className="py-2.5 font-bold text-blue-400">{rec.weightKg} kg</td>
                        <td className="py-2.5 text-purple-400">{rec.bodyFatPercentage ? `${rec.bodyFatPercentage}%` : '-'}</td>
                        <td className="py-2.5 text-emerald-400">{rec.muscleMassPercentage ? `${rec.muscleMassPercentage}%` : '-'}</td>
                        <td className="py-2.5 text-slate-300">{rec.waistCm ? `${rec.waistCm} cm` : '-'}</td>
                        <td className="py-2.5 text-slate-300">{rec.hipCm ? `${rec.hipCm} cm` : '-'}</td>
                        <td className="py-2.5 text-slate-400 pr-2">{rec.notes || 'Control habitual'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Plan Nutricional Activo */}
        {activeTab === 'dieta' && (
          <div className="space-y-6">
            {activePlan ? (
              <>
                {/* Plan Macros Overview */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{activePlan.title}</h3>
                      <p className="text-xs text-slate-400">{activePlan.notes}</p>
                    </div>
                    <span className="text-xs bg-blue-950/60 text-blue-400 border border-blue-800/60 px-3 py-1 rounded-full font-semibold">
                      Plan Vigente desde {activePlan.startDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Calorías Diarias</span>
                      <span className="text-lg font-bold text-amber-400">{activePlan.caloriesTarget} kcal</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Proteínas</span>
                      <span className="text-lg font-bold text-blue-400">{activePlan.proteinGrams} g</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Carbohidratos</span>
                      <span className="text-lg font-bold text-emerald-400">{activePlan.carbsGrams} g</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Grasas Saludables</span>
                      <span className="text-lg font-bold text-purple-400">{activePlan.fatsGrams} g</span>
                    </div>
                  </div>
                </div>

                {/* Day Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedDay === day
                          ? 'bg-blue-600 text-white shadow-glow-blue'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Meals List for Selected Day */}
                <div className="space-y-4">
                  {currentDayPlan?.meals.map((meal) => (
                    <div key={meal.id} className="glass-panel p-5 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                              {meal.type} • {meal.timeHint}
                            </span>
                            <h4 className="text-sm font-bold text-slate-200">{meal.title}</h4>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{meal.items.length} alimentos</span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 mb-3">{meal.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {meal.items.map((it) => (
                          <div key={it.id} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                            <div className="flex items-center justify-between font-semibold text-slate-200">
                              <span>{it.foodName}</span>
                              <span className="text-blue-400 font-mono">{it.quantityGrams}{it.unit}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <span>{it.category}</span>
                              <span>• {it.calories} kcal</span>
                              <span>• P: {it.proteinGrams}g</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
                <Utensils className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200">No hay plan activo prescrito</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Prescribe una dieta personalizada para este paciente utilizando el diseñador inteligente.
                </p>
                <Link
                  href={`/crear-dieta?patientId=${patient.id}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  <Sparkles className="w-4 h-4" /> Crear Plan Nutricional
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Seguimiento & Checklists */}
        {activeTab === 'seguimiento' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Adherence Card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <span className="text-xs font-medium text-slate-400">Adherencia Global</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400">{patient.adherenceRate}%</span>
                  <span className="text-xs text-slate-400">promedio mensual</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${patient.adherenceRate}%` }} />
                </div>
              </div>

              {/* Streak Card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <span className="text-xs font-medium text-slate-400">Racha de Check-in</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-amber-400">{patient.streakDays} días</span>
                  <span className="text-xs text-slate-400">consecutivos</span>
                </div>
                <p className="text-[11px] text-amber-400/90 mt-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Registros activos en la app móvil
                </p>
              </div>

              {/* Water Card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <span className="text-xs font-medium text-slate-400">Consumo Hídrico Hoy</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-400">
                    {patient.todayLog?.waterGlasses || 6} / 8 vasos
                  </span>
                  <span className="text-xs text-slate-400">
                    ({(patient.todayLog?.waterGlasses || 6) * 250} ml)
                  </span>
                </div>
                <p className="text-[11px] text-blue-400 mt-2 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5" /> Meta de 2000 ml al día
                </p>
              </div>
            </div>

            {/* Observations History */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-2">Notas Clínicas de la Nutricionista</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                {patient.clinicalNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
