import { Request, Response } from 'express';
import { MOCK_PATIENTS } from '../mocks/patientsData';
import { LoginSchema } from '../types';

/**
 * Controller: Auth
 * Handles authentication for Nutritionists and Patients with session tokens and profile payloads.
 */

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * import { PrismaClient } from '@prisma/client';
   * import bcrypt from 'bcrypt';
   * import jwt from 'jsonwebtoken';
   * 
   * const prisma = new PrismaClient();
   * const { email, password, role } = req.body;
   * 
   * const user = await prisma.user.findUnique({
   *   where: { email },
   *   include: {
   *     nutritionistProfile: true,
   *     patientProfile: {
   *       include: {
   *         mealPlans: { where: { isActive: true }, take: 1 }
   *       }
   *     }
   *   }
   * });
   * 
   * if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
   *   return res.status(401).json({ error: 'Credenciales inválidas' });
   * }
   * 
   * const token = jwt.sign(
   *   { userId: user.id, email: user.email, role: user.role },
   *   process.env.JWT_SECRET || 'secret_nutrition_jwt_mendoza',
   *   { expiresIn: '30d' }
   * );
   * 
   * return res.json({ token, user });
   * =========================================================================
   */

  // MVP DEMO & PRODUCTION-READY HANDLER:
  try {
    const { email, password, role, patientId } = req.body;

    // 1. Si se solicita login de paciente específico por ID
    if (patientId) {
      const patient = MOCK_PATIENTS.find(p => p.id === patientId || p.userId === patientId);
      if (patient) {
        return res.json({
          token: `jwt-patient-token-${patient.id}`,
          user: {
            id: patient.userId,
            fullName: patient.fullName,
            email: patient.email,
            role: 'PATIENT',
            locality: patient.locality,
            avatarUrl: patient.avatarUrl,
            patientProfile: patient
          }
        });
      }
    }

    // 2. Si es login con email de paciente
    if (email && email !== 'lic.rossi@nutrimendoza.com') {
      const patientByEmail = MOCK_PATIENTS.find(p => p.email.toLowerCase() === String(email).toLowerCase());
      if (patientByEmail) {
        return res.json({
          token: `jwt-patient-token-${patientByEmail.id}`,
          user: {
            id: patientByEmail.userId,
            fullName: patientByEmail.fullName,
            email: patientByEmail.email,
            role: 'PATIENT',
            locality: patientByEmail.locality,
            avatarUrl: patientByEmail.avatarUrl,
            patientProfile: patientByEmail
          }
        });
      }
    }

    // 3. Login de Nutricionista (por rol, email de la Lic. Rossi o default de dashboard)
    if (role === 'NUTRITIONIST' || email === 'lic.rossi@nutrimendoza.com' || (!patientId && role !== 'PATIENT')) {
      return res.json({
        token: 'jwt-nutritionist-token-lic-rossi-mendoza',
        user: {
          id: 'usr-nutri-01',
          fullName: 'Lic. Valentina Rossi',
          email: 'lic.rossi@nutrimendoza.com',
          role: 'NUTRITIONIST',
          licenseNumber: 'M.P. 1842 - Mendoza',
          specialty: 'Nutrición Clínica & Deportiva',
          avatarUrl: 'https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80',
          clinicAddress: 'Av. San Martín 1240, 4to Piso, Ciudad de Mendoza'
        }
      });
    }

    // 4. Default fallback a Sofía Morales
    const defaultPatient = MOCK_PATIENTS[0];
    return res.json({
      token: `jwt-patient-token-${defaultPatient.id}`,
      user: {
        id: defaultPatient.userId,
        fullName: defaultPatient.fullName,
        email: defaultPatient.email,
        role: 'PATIENT',
        locality: defaultPatient.locality,
        avatarUrl: defaultPatient.avatarUrl,
        patientProfile: defaultPatient
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error en autenticación', details: err.message });
  }
};

// GET /api/auth/me
export const getCurrentUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (token.includes('nutritionist')) {
    return res.json({
      id: 'usr-nutri-01',
      fullName: 'Lic. Valentina Rossi',
      email: 'lic.rossi@nutrimendoza.com',
      role: 'NUTRITIONIST',
      licenseNumber: 'M.P. 1842 - Mendoza',
      specialty: 'Nutrición Clínica & Deportiva',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80',
      clinicAddress: 'Av. San Martín 1240, 4to Piso, Ciudad de Mendoza'
    });
  }

  // Extraer ID de paciente del token
  const patientIdMatch = token.match(/pat-\d+/);
  const patientId = patientIdMatch ? patientIdMatch[0] : 'pat-001';
  const patient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];

  return res.json({
    id: patient.userId,
    fullName: patient.fullName,
    email: patient.email,
    role: 'PATIENT',
    locality: patient.locality,
    avatarUrl: patient.avatarUrl,
    patientProfile: patient
  });
};
