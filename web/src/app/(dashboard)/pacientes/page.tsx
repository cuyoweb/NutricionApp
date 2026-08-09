'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter, 
  PlusCircle, 
  MapPin, 
  TrendingDown, 
  ChevronRight, 
  Flame, 
  Sparkles,
  Phone,
  Mail,
  Check,
  X
} from 'lucide-react';
import { Header } from '../../../components/Header';
import { PlanBadge } from '../../../components/PlanBadge';
import { api } from '../../../lib/api';
import { Patient, PlanTier } from '../../../types';

function PacientesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedPlan, setSelectedPlan] = useState<string>('TODOS');
  const [showModal, setShowModal] = useState(false);

  // New patient form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    locality: 'Godoy Cruz, Mendoza',
    plan: 'PRO' as PlanTier,
    gender: 'FEMALE' as 'FEMALE' | 'MALE' | 'OTHER',
    age: 30,
    heightCm: 165,
    initialWeightKg: 75.0,
    currentWeightKg: 75.0,
    targetWeightKg: 65.0,
    bodyFatPercentage: 26.0,
    muscleMassPercentage: 32.0,
    clinicalNotes: ''
  });

  const loadPatients = async () => {
    try {
      const data = await api.getPatients(searchTerm, selectedPlan);
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [searchTerm, selectedPlan]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newP = await api.createPatient(formData);
      setPatients([newP, ...patients]);
      setShowModal(false);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        locality: 'Godoy Cruz, Mendoza',
        plan: 'PRO',
        gender: 'FEMALE',
        age: 30,
        heightCm: 165,
        initialWeightKg: 75.0,
        currentWeightKg: 75.0,
        targetWeightKg: 65.0,
        bodyFatPercentage: 26.0,
        muscleMassPercentage: 32.0,
        clinicalNotes: ''
      });
    } catch (err) {
      console.error('Error creating patient:', err);
    }
  };

  const planFilters = ['TODOS', 'FREE', 'INICIAL', 'PRO', 'PREMIUM'];

  return (
    <div className="flex-1 flex flex-col bg-[#090d16] min-h-screen">
      <Header 
        title="Gestión de Pacientes" 
        subtitle="Registro clínico, seguimiento antropométrico y asignación de planes" 
      />

      <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Controls Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Plan Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {planFilters.map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPlan === plan
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {plan === 'TODOS' ? 'Todos (10)' : plan}
              </button>
            ))}
          </div>

          {/* Search & Add button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o zona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nuevo Paciente</span>
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                Lista de Pacientes ({patients.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Sede Central Mendoza • Colegio Nutricionistas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold">
                  <th className="py-3.5 pl-4">Paciente & Contacto</th>
                  <th className="py-3.5">Localidad (Mendoza)</th>
                  <th className="py-3.5">Plan Contratado</th>
                  <th className="py-3.5">Evolución Peso</th>
                  <th className="py-3.5">Composición Corporal</th>
                  <th className="py-3.5">Adherencia Diaria</th>
                  <th className="py-3.5 text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {patients.map((p) => {
                  const weightDiff = Number((p.currentWeightKg - p.initialWeightKg).toFixed(1));
                  const isWeightLoss = weightDiff < 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatarUrl}
                            alt={p.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/pacientes/${p.id}`}
                              className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors text-sm"
                            >
                              {p.fullName}
                            </Link>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" /> {p.phone}
                              </span>
                              <span className="font-mono text-slate-400">• {p.age} años</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{p.locality}</span>
                        </div>
                      </td>

                      <td className="py-4">
                        <PlanBadge plan={p.plan} />
                      </td>

                      <td className="py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-100 text-sm">{p.currentWeightKg} kg</span>
                            <span className={`text-[10px] font-semibold px-1 rounded ${
                              isWeightLoss ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                            }`}>
                              {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Meta: <span className="text-slate-300 font-medium">{p.targetWeightKg} kg</span>
                          </p>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="text-[11px] space-y-0.5">
                          <p className="text-slate-300">
                            Grasa: <span className="font-semibold text-purple-400">{p.bodyFatPercentage}%</span>
                          </p>
                          <p className="text-slate-400">
                            Masa Muscular: <span className="font-semibold text-blue-400">{p.muscleMassPercentage}%</span>
                          </p>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  p.adherenceRate >= 85 ? 'bg-emerald-400' : p.adherenceRate >= 70 ? 'bg-blue-400' : 'bg-amber-400'
                                }`}
                                style={{ width: `${p.adherenceRate}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-200 text-xs">{p.adherenceRate}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-amber-400">
                            <Flame className="w-3 h-3" />
                            <span>Racha de {p.streakDays} días</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/pacientes/${p.id}`}
                            className="bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/crear-dieta?patientId=${p.id}`}
                            title="Prescribir Dieta"
                            className="p-1.5 bg-slate-800/80 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: New Patient */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-slate-100">Registrar Nuevo Paciente</h3>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Lucas Martín Vega"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="lucas.vega@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      required
                      placeholder="+54 9 261 555-1234"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Localidad (Mendoza)</label>
                    <input
                      type="text"
                      required
                      placeholder="Godoy Cruz, Mendoza"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Plan</label>
                    <select
                      value={formData.plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value as PlanTier })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="FREE">FREE ($0)</option>
                      <option value="INICIAL">INICIAL ($6.000)</option>
                      <option value="PRO">PRO ($10.000)</option>
                      <option value="PREMIUM">PREMIUM ($12.000)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Edad</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={formData.heightCm}
                      onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Peso Actual (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.currentWeightKg}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        currentWeightKg: Number(e.target.value),
                        initialWeightKg: Number(e.target.value)
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Peso Objetivo (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.targetWeightKg}
                      onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Grasa Corporal (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.bodyFatPercentage}
                      onChange={(e) => setFormData({ ...formData, bodyFatPercentage: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Observaciones Clínicas Iniciales</label>
                  <textarea
                    rows={2}
                    placeholder="Antecedentes médicos, hábitos de entrenamiento..."
                    value={formData.clinicalNotes}
                    onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-colors"
                  >
                    Guardar y Registrar Paciente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PacientesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-400 text-xs">Cargando pacientes...</div>}>
      <PacientesContent />
    </Suspense>
  );
}
