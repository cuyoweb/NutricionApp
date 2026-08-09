import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { MobileShell } from '../../components/mobile/MobileShell';

export const metadata: Metadata = {
  title: 'Mi Nutrición • Salud & Bienestar',
  description: 'App de nutrición saludable',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f8fafc',
};

export default function MobileRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#f1f5f9] text-slate-800 min-h-screen antialiased flex justify-center selection:bg-emerald-200 selection:text-emerald-900">
        <MobileShell>
          {children}
        </MobileShell>
      </body>
    </html>
  );
}
