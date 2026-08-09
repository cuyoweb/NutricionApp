'use client';

import React from 'react';
import { AuthProvider } from '../../lib/mobileAuthContext';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="mobile-app-shell">
        <MobileHeader />
        <main className="flex-1 pb-24 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthProvider>
  );
};
