'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  Activity, 
  Sparkles, 
  LogOut,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../lib/authContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Don't show sidebar on login page
  if (pathname === '/login') return null;

  const navItems = [
    {
      name: 'Panel General',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      name: 'Gestión Pacientes',
      href: '/pacientes',
      icon: Users,
      badge: '10'
    },
    {
      name: 'Creador de Dietas',
      href: '/crear-dieta',
      icon: UtensilsCrossed,
      badge: 'IA'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-glow-emerald">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              NutriEcosistema
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-lg font-bold">
                MZA
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Consultorio Clínico</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="mt-6 space-y-1.5">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Módulos Principales
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg border ${
                      isActive
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mendoza Locality Widget */}
        <div className="mt-8 mx-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-xs">Sede Mendoza Centro</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Av. San Martín 1240, 4to Piso. 10 pacientes en seguimiento nutricional.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Adherencia:</span>
            <span className="text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-100 shadow-sm">86.4%</span>
          </div>
        </div>
      </div>

      {/* Nutritionist Profile Footer */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-2 ring-emerald-100">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80'}
                alt={user?.fullName || 'Lic. Valentina Rossi'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{user?.fullName || 'Lic. Valentina Rossi'}</p>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user?.licenseNumber || 'M.P. 1842 - Mza'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
