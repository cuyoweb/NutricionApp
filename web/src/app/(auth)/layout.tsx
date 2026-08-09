import React from 'react';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Acceso - NutriEcosistema',
  description: 'Portal de Acceso',
};

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
