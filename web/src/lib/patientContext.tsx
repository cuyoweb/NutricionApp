'use client';

// Re-export everything from authContext to maintain 100% unified context and avoid duplicated Provider trees
export { 
  AuthProvider as PatientProvider, 
  useAuth as usePatient, 
  useAuth 
} from './mobileAuthContext';
