'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Patient, MealPlanDetail, DailyLogState } from '../types';
import { mobileApi } from './api';

interface AuthContextType {
  currentPatient: Patient | null;
  allPatients: Patient[];
  token: string | null;
  loading: boolean;
  activePlan: MealPlanDetail | null;
  todayLog: DailyLogState | null;
  loginWithPatientId: (patientId: string) => Promise<void>;
  loginWithCredentials: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  toggleMealCompletion: (mealId: string) => Promise<void>;
  updateWater: (delta: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<MealPlanDetail | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLogState | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      try {
        const patients = await mobileApi.getPatients();
        setAllPatients(patients);

        const savedToken = typeof window !== 'undefined' ? localStorage.getItem('nutri_patient_token') : null;
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('nutri_patient_id') : null;

        const target = patients.find(p => p.id === savedId) || patients[0];

        if (target) {
          setCurrentPatient(target);
          const currentToken = savedToken || `jwt-patient-token-${target.id}`;
          setToken(currentToken);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nutri_patient_token', currentToken);
            localStorage.setItem('nutri_patient_id', target.id);
          }

          const [plan, log] = await Promise.all([
            mobileApi.getActiveMealPlan(target.id).catch(() => null),
            mobileApi.getTodayLog(target.id).catch(() => null)
          ]);
          setActivePlan(plan || target.activeMealPlan || null);
          setTodayLog(log || target.todayLog || null);
        }
      } catch (err) {
        console.error('Error initializing mobile auth:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const loginWithPatientId = async (patientId: string) => {
    setLoading(true);
    try {
      const patient = allPatients.find(p => p.id === patientId) || await mobileApi.getPatientById(patientId);
      const userToken = `jwt-patient-token-${patient.id}`;

      setCurrentPatient(patient);
      setToken(userToken);

      if (typeof window !== 'undefined') {
        localStorage.setItem('nutri_patient_token', userToken);
        localStorage.setItem('nutri_patient_id', patient.id);
      }

      const [plan, log] = await Promise.all([
        mobileApi.getActiveMealPlan(patient.id).catch(() => null),
        mobileApi.getTodayLog(patient.id).catch(() => null)
      ]);
      setActivePlan(plan || patient.activeMealPlan || null);
      setTodayLog(log || patient.todayLog || null);

      router.push('/');
    } catch (err) {
      console.error('Error during patient login:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password = 'password') => {
    setLoading(true);
    try {
      const res = await fetchFromApiAny('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'PATIENT' })
      });

      if (res?.user?.patientProfile) {
        await loginWithPatientId(res.user.patientProfile.id);
        return true;
      }
      // Fallback to first matching patient
      const match = allPatients.find(p => p.email.toLowerCase() === email.toLowerCase()) || allPatients[0];
      await loginWithPatientId(match.id);
      return true;
    } catch {
      const defaultP = allPatients[0];
      if (defaultP) await loginWithPatientId(defaultP.id);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentPatient(null);
    setToken(null);
    setActivePlan(null);
    setTodayLog(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nutri_patient_token');
      localStorage.removeItem('nutri_patient_id');
    }
    router.push('/login');
  };

  const toggleMealCompletion = async (mealId: string) => {
    if (!currentPatient || !todayLog) return;
    const currentCompleted = todayLog.completedMealIds || [];
    const isCompleted = currentCompleted.includes(mealId);
    const newCompleted = isCompleted
      ? currentCompleted.filter(id => id !== mealId)
      : [...currentCompleted, mealId];

    const adherence = Math.min(100, Math.round((newCompleted.length / 4) * 100));
    setTodayLog({
      ...todayLog,
      completedMealIds: newCompleted,
      adherencePercentage: adherence
    });

    try {
      const updated = await mobileApi.updateDailyLog(currentPatient.id, newCompleted);
      setTodayLog(updated);
    } catch (err) {
      console.error('Error toggling meal completion:', err);
    }
  };

  const updateWater = async (delta: number) => {
    if (!currentPatient || !todayLog) return;
    const newGlasses = Math.max(0, (todayLog.waterGlasses || 0) + delta);

    setTodayLog({
      ...todayLog,
      waterGlasses: newGlasses
    });

    try {
      const updated = await mobileApi.logWater(currentPatient.id, delta);
      setTodayLog(updated);
    } catch (err) {
      console.error('Error logging water:', err);
    }
  };

  const refreshData = async () => {
    if (currentPatient) {
      await loginWithPatientId(currentPatient.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentPatient,
        allPatients,
        token,
        loading,
        activePlan,
        todayLog,
        loginWithPatientId,
        loginWithCredentials,
        logout,
        toggleMealCompletion,
        updateWater,
        refreshData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Aliases for compatibility
export const usePatient = useAuth;
export const PatientProvider = AuthProvider;

async function fetchFromApiAny(url: string, opts?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const res = await fetch(`${base}${url}`, opts);
  return res.json();
}
