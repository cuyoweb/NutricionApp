'use client';

import React from 'react';
import { AuthProvider } from '../lib/authContext';
import { Sidebar } from './Sidebar';

export const FrontShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
};
