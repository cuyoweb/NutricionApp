'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, PlusCircle, Sparkles, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'Panel de Control', 
  subtitle = 'Gestión clínica y prescripción de dietas personalizadas' 
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/pacientes?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const todayStr = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
      {/* Title & Date */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            En línea
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 capitalize flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {todayStr} • {subtitle}
        </p>
      </div>

      {/* Actions, Search, Notifications */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar paciente en Mendoza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 md:w-64 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-inner"
          />
        </form>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm relative cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-soft-lg p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="font-black text-slate-800">Alertas Clínicas</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">3 nuevas</span>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <p className="font-bold text-slate-800">Sofía Morales <span className="font-medium text-slate-500">(Premium)</span></p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">✨ Completó racha de 14 días</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <p className="font-bold text-slate-800">Gonzalo Vignolo <span className="font-medium text-slate-500">(Chacras)</span></p>
                  <p className="text-[11px] text-blue-600 font-medium mt-0.5">Alcanzó su meta de 91.8 kg (-10.7 kg)</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <p className="font-bold text-slate-800">Nuevo registro</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Camila Cornejo subió su peso de control</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action: New Diet */}
        <Link
          href="/crear-dieta"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-soft transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prescribir</span> Dieta
        </Link>
      </div>
    </header>
  );
};
