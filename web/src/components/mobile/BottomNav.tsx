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
      <div className="w-full max-w-[410px] bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 border border-emerald-500/60 rounded-full px-3 py-1.5 flex items-center justify-between pointer-events-auto shadow-xl shadow-emerald-950/20 backdrop-blur-md">
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
                <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold shadow-lg shadow-black/20 group-hover:scale-105 group-active:scale-95 transition-all border-2 border-white">
                  <Sparkles className="w-6 h-6 stroke-[2.5] text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow-sm">
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
                  ? 'text-white font-bold'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/30'
                    : 'bg-transparent text-emerald-100/90 group-hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-white' : 'font-medium text-emerald-100/90'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
