'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ChevronDown, 
  LogOut, 
  Users, 
  Check, 
  Sparkles,
  Heart
} from 'lucide-react';
import { useAuth } from '../../lib/mobileAuthContext';

export const MobileHeader: React.FC = () => {
  const { currentPatient, allPatients, loginWithPatientId, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!currentPatient) return null;

  const firstName = currentPatient.fullName.split(' ')[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Patient Profile Clickable */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
        >
          <div className="relative">
            <img
              src={currentPatient.avatarUrl}
              alt={currentPatient.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800 text-sm">
                ¡Hola, {firstName}!
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>Plan</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md text-[10px]">
                {currentPatient.plan}
              </span>
            </p>
          </div>
        </button>

        {/* Streak Flame & Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{currentPatient.streakDays} días</span>
          </div>

          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Switcher Dropdown Modal */}
      {showMenu && (
        <div className="absolute top-16 left-3 right-3 bg-white border border-slate-200 rounded-3xl shadow-soft-lg p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              Cambiar Paciente de Prueba (10)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Demo</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {allPatients.map((p) => {
              const isSelected = p.id === currentPatient.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    loginWithPatientId(p.id);
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.avatarUrl}
                      alt={p.fullName}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold truncate text-xs text-slate-800">{p.fullName}</p>
                      <p className="text-[10px] text-slate-500">{p.locality.split(',')[0]} • {p.plan} (${p.planPriceArs})</p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/login"
              onClick={() => setShowMenu(false)}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Ir a pantalla de Login
            </Link>
            <button
              onClick={logout}
              className="text-red-600 font-semibold hover:underline cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
