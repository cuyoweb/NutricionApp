'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Utensils, 
  Sparkles, 
  ShoppingCart, 
  TrendingUp 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide on login screen
  if (pathname === '/login') return null;

  const navItems = [
    {
      label: 'Diario',
      href: '/',
      icon: BookOpen
    },
    {
      label: 'Mi Dieta',
      href: '/dieta',
      icon: Utensils
    },
    {
      label: 'IA Swap',
      href: '/reemplazos',
      icon: Sparkles,
      isCenter: true
    },
    {
      label: 'Compras',
      href: '/lista-compras',
      icon: ShoppingCart
    },
    {
      label: 'Progreso',
      href: '/mi-progreso',
      icon: TrendingUp
    }
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-50 flex justify-center pointer-events-none px-3">
      <div className="w-full max-w-[410px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-3 py-1.5 flex items-center justify-between pointer-events-auto shadow-nav-floating">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-bold shadow-green-glow group-hover:scale-105 group-active:scale-95 transition-transform border-2 border-white">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 mt-0.5">
                  IA Swap
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
