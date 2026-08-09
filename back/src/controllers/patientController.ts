import { Request, Response } from 'express';
import { MOCK_PATIENTS } from '../mocks/patientsData';
import { CreatePatientSchema, Patient } from '../types';

/**
 * Controller: Patient
 * Handles CRUD and retrieval of patients, clinical metrics, and anthropometric records.
 */

// GET /api/patients
export const getPatients = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * import { PrismaClient } from '@prisma/client';
   * const prisma = new PrismaClient();
   * 
   * try {
   *   const { search, plan, locality } = req.query;
   * 
   *   const whereClause: any = {};
   *   if (plan && plan !== 'TODOS') {
   *     whereClause.plan = plan;
   *   }
   *   if (locality) {
   *     whereClause.locality = { contains: String(locality), mode: 'insensitive' };
   *   }
   *   if (search) {
   *     whereClause.OR = [
   *       { user: { fullName: { contains: String(search), mode: 'insensitive' } } },
   *       { user: { email: { contains: String(search), mode: 'insensitive' } } },
   *       { user: { phone: { contains: String(search), mode: 'insensitive' } } }
   *     ];
   *   }
   * 
   *   const patients = await prisma.patientProfile.findMany({
   *     where: whereClause,
   *     include: {
   *       user: { select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true } },
   *       anthropometricHistory: { orderBy: { date: 'desc' }, take: 5 },
   *       mealPlans: { where: { isActive: true }, take: 1 },
   *       dailyLogs: { orderBy: { date: 'desc' }, take: 1 }
   *     },
   *     orderBy: { updatedAt: 'desc' }
   *   });
   * 
   *   return res.json(patients);
   * } catch (error) {
   *   console.error('Error fetching patients from Prisma:', error);
   *   return res.status(500).json({ error: 'Error al consultar pacientes' });
   * }
   * =========================================================================
   */

  // MVP DEMO CODE:
  try {
    const { search, plan } = req.query;
    let filtered = [...MOCK_PATIENTS];

    if (plan && plan !== 'TODOS') {
      filtered = filtered.filter(p => p.plan.toLowerCase() === String(plan).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q)
      );
    }

    return res.json(filtered);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al obtener pacientes', details: error.message });
  }
};

// GET /api/patients/:id
export const getPatientById = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { id } = req.params;
   * const patient = await prisma.patientProfile.findUnique({
   *   where: { id },
   *   include: {
   *     user: true,
   *     anthropometricHistory: { orderBy: { date: 'asc' } },
   *     mealPlans: {
   *       where: { isActive: true },
   *       include: {
   *         days: {
   *           include: {
   *             meals: {
   *               include: {
   *                 items: { include: { food: true } }
   *               }
   *             }
   *           }
   *         }
   *       }
   *     },
   *     dailyLogs: { orderBy: { date: 'desc' }, take: 14 }
   *   }
   * });
   * 
   * if (!patient) {
   *   return res.status(404).json({ error: 'Paciente no encontrado' });
   * }
   * return res.json(patient);
   * =========================================================================
   */

  // MVP DEMO CODE:
  const { id } = req.params;
  const patient = MOCK_PATIENTS.find(p => p.id === id || p.userId === id);

  if (!patient) {
    return res.status(404).json({ error: 'Paciente no encontrado en el sistema de Mendoza' });
  }

  return res.json(patient);
};

// POST /api/patients
export const createPatient = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const parsed = CreatePatientSchema.safeParse(req.body);
   * if (!parsed.success) {
   *   return res.status(400).json({ error: 'Datos de paciente inválidos', errors: parsed.error.format() });
   * }
   * 
   * const data = parsed.data;
   * 
   * // Transacción atómica para crear User + PatientProfile + Registro antropométrico inicial
   * const result = await prisma.$transaction(async (tx) => {
   *   const newUser = await tx.user.create({
   *     data: {
   *       email: data.email,
   *       fullName: data.fullName,
   *       phone: data.phone,
   *       passwordHash: await bcrypt.hash('mendoza2026', 10),
   *       role: 'PATIENT'
   *     }
   *   });
   * 
   *   const newProfile = await tx.patientProfile.create({
   *     data: {
   *       userId: newUser.id,
   *       locality: data.locality,
   *       plan: data.plan,
   *       gender: data.gender,
   *       heightCm: data.heightCm,
   *       initialWeightKg: data.initialWeightKg,
   *       currentWeightKg: data.currentWeightKg,
   *       targetWeightKg: data.targetWeightKg,
   *       bodyFatPercentage: data.bodyFatPercentage,
   *       muscleMassPercentage: data.muscleMassPercentage,
   *       clinicalNotes: data.clinicalNotes
   *     }
   *   });
   * 
   *   await tx.anthropometricRecord.create({
   *     data: {
   *       patientId: newProfile.id,
   *       weightKg: data.currentWeightKg,
   *       bodyFatPercentage: data.bodyFatPercentage,
   *       muscleMassPercentage: data.muscleMassPercentage,
   *       notes: 'Medición de alta inicial'
   *     }
   *   });
   * 
   *   return newProfile;
   * });
   * 
   * return res.status(201).json(result);
   * =========================================================================
   */

  // MVP DEMO CODE:
  try {
    const parsed = CreatePatientSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Campos requeridos faltantes', details: parsed.error.format() });
    }

    const data = parsed.data;
    const newId = `pat-${String(MOCK_PATIENTS.length + 1).padStart(3, '0')}`;
    const planPrices: Record<string, number> = {
      FREE: 0,
      INICIAL: 6000,
      PRO: 10000,
      PREMIUM: 12000
    };

    const newPatient: Patient = {
      id: newId,
      userId: `usr-${newId}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      locality: data.locality,
      plan: data.plan,
      planPriceArs: planPrices[data.plan] || 0,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      gender: data.gender,
      age: data.age,
      heightCm: data.heightCm,
      initialWeightKg: data.initialWeightKg,
      currentWeightKg: data.currentWeightKg,
      targetWeightKg: data.targetWeightKg,
      bodyFatPercentage: data.bodyFatPercentage || 24.0,
      muscleMassPercentage: data.muscleMassPercentage || 32.0,
      bmi: Number((data.currentWeightKg / Math.pow(data.heightCm / 100, 2)).toFixed(1)),
      streakDays: 1,
      adherenceRate: 100,
      clinicalNotes: data.clinicalNotes || 'Nuevo paciente registrado en Mendoza.',
      createdAt: new Date().toISOString(),
      lastConsultationDate: new Date().toISOString().split('T')[0],
      anthropometricHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          weightKg: data.currentWeightKg,
          bodyFatPercentage: data.bodyFatPercentage,
          muscleMassPercentage: data.muscleMassPercentage,
          notes: 'Consulta inicial de admisión'
        }
      ]
    };

    MOCK_PATIENTS.unshift(newPatient);
    return res.status(201).json(newPatient);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al registrar paciente', details: error.message });
  }
};

// PUT /api/patients/:id/metrics
export const updatePatientMetrics = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { id } = req.params;
   * const { weightKg, bodyFatPercentage, muscleMassPercentage, waistCm, notes } = req.body;
   * 
   * const updated = await prisma.$transaction(async (tx) => {
   *   await tx.anthropometricRecord.create({
   *     data: {
   *       patientId: id,
   *       weightKg,
   *       bodyFatPercentage,
   *       muscleMassPercentage,
   *       waistCm,
   *       notes
   *     }
   *   });
   * 
   *   return tx.patientProfile.update({
   *     where: { id },
   *     data: {
   *       currentWeightKg: weightKg,
   *       bodyFatPercentage,
   *       muscleMassPercentage
   *     }
   *   });
   * });
   * 
   * return res.json(updated);
   * =========================================================================
   */

  // MVP DEMO CODE:
  const { id } = req.params;
  const patient = MOCK_PATIENTS.find(p => p.id === id);

  if (!patient) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const { weightKg, bodyFatPercentage, muscleMassPercentage, notes } = req.body;
  if (weightKg) patient.currentWeightKg = Number(weightKg);
  if (bodyFatPercentage) patient.bodyFatPercentage = Number(bodyFatPercentage);
  if (muscleMassPercentage) patient.muscleMassPercentage = Number(muscleMassPercentage);

  patient.anthropometricHistory.push({
    date: new Date().toISOString().split('T')[0],
    weightKg: patient.currentWeightKg,
    bodyFatPercentage: patient.bodyFatPercentage,
    muscleMassPercentage: patient.muscleMassPercentage,
    notes: notes || 'Medición de control presencial'
  });

  return res.json(patient);
};
