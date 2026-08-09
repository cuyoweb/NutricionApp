import React from 'react';
import type { Metadata } from 'next';
import '../globals.css';
import { FrontShell } from '../../components/FrontShell';

export const metadata: Metadata = {
  title: 'NutriEcosistema Mendoza - Dashboard Clínico',
  description: 'Panel Administrativo de Nutrición',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased flex flex-col sm:flex-row">
        <FrontShell>
          {children}
        </FrontShell>
      </body>
    </html>
  );
}
