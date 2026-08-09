'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, MapPin, Users, HeartPulse } from 'lucide-react';
import { api } from '../../../lib/api';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'NUTRITIONIST' | 'PATIENT'>('NUTRITIONIST');
  
  // Nutricionista state
  const [email, setEmail] = useState('lic.rossi@nutrimendoza.com');
  const [password, setPassword] = useState('mendoza2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNutritionistLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.login({ email, password, role: 'NUTRITIONIST' });
      router.push('/dashboard');
    } catch (err: any) {
      console.warn('API error, using demo fallback:', err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientLogin = async (patientId: string) => {
    setLoading(true);
    try {
      await api.login({ email: `pat_${patientId}@demo.com`, password: 'demo', role: 'PATIENT' });
      router.push('/diario');
    } catch (err) {
      console.warn('API error, using patient demo fallback:', err);
      router.push('/diario');
    } finally {
      setLoading(false);
    }
  };

  // Pacientes de demostración rápida
  const demoPatients = [
    { id: 'pat-001', name: 'Sofía Morales', plan: 'PREMIUM', weight: '64.5', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    { id: 'pat-002', name: 'Gonzalo Vignolo', plan: 'PRO', weight: '81.2', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    { id: 'pat-003', name: 'Camila Cornejo', plan: 'INICIAL', weight: '58.9', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 border border-slate-200/80 rounded-3xl shadow-soft-lg p-8 backdrop-blur-xl relative z-10">
        
        {/* Header / Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-glow-emerald mb-4">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">NutriEcosistema</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Plataforma Clínica Mendoza</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => setRole('NUTRITIONIST')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              role === 'NUTRITIONIST' 
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Nutricionista
          </button>
          <button
            onClick={() => setRole('PATIENT')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              role === 'PATIENT' 
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Paciente
          </button>
        </div>

        {role === 'NUTRITIONIST' ? (
          /* Nutricionista View */
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden ring-2 ring-emerald-400/40 shrink-0">
                  <img src="https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80" alt="Lic." className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">Lic. Valentina Rossi</p>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Mat. 1842 - Mendoza
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleNutritionistLogin()}
                disabled={loading}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-soft transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ingreso Rápido al Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">o usar credenciales</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <form onSubmit={handleNutritionistLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs mt-2">
                Iniciar Sesión
              </button>
            </form>
          </div>
        ) : (
          /* Paciente View */
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-sm font-black text-slate-800 mb-1">Selecciona un Paciente</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Ingresa rápido a la app móvil de prueba</p>
            
            <div className="space-y-3">
              {demoPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePatientLogin(p.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Plan {p.plan} • {p.weight} kg</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-[10px] text-slate-400 font-medium">
          M.P. 1842 • Colegio de Nutricionistas de Mendoza
        </div>
      </div>
    </div>
  );
}
