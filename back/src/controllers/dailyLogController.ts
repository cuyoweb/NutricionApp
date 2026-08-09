import { Request, Response } from 'express';
import { MOCK_PATIENTS } from '../mocks/patientsData';
import { UpdateDailyLogSchema, DailyLogState } from '../types';

/**
 * Controller: DailyLog
 * Manages daily meal checklist completion, water tracking (+1 / -1 glass) and adherence scoring.
 */

// GET /api/daily-logs/today/:patientId
export const getTodayLog = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { patientId } = req.params;
   * const today = new Date();
   * today.setHours(0, 0, 0, 0);
   * 
   * const log = await prisma.dailyLog.findFirst({
   *   where: {
   *     patientId,
   *     date: { gte: today }
   *   }
   * });
   * 
   * if (!log) {
   *   // Crear registro vacío inicial para el día
   *   const newLog = await prisma.dailyLog.create({
   *     data: {
   *       patientId,
   *       date: today,
   *       waterGlasses: 0,
   *       waterTargetGlasses: 8,
   *       completedMeals: [],
   *       adherenceScore: 0
   *     }
   *   });
   *   return res.json(newLog);
   * }
   * 
   * return res.json(log);
   * =========================================================================
   */

  // MVP DEMO CODE:
  const { patientId } = req.params;
  const patient = MOCK_PATIENTS.find(p => p.id === patientId || p.userId === patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  if (patient.todayLog) {
    return res.json(patient.todayLog);
  }

  const defaultTodayLog: DailyLogState = {
    patientId: patient.id,
    date: new Date().toISOString().split('T')[0],
    waterGlasses: 4,
    waterTargetGlasses: 8,
    completedMealIds: ['desayuno-lun'],
    adherencePercentage: 50,
    notes: 'Seguimiento activo'
  };

  patient.todayLog = defaultTodayLog;
  return res.json(defaultTodayLog);
};

// POST /api/daily-logs
export const updateDailyLog = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const parsed = UpdateDailyLogSchema.safeParse(req.body);
   * if (!parsed.success) {
   *   return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.format() });
   * }
   * 
   * const { patientId, date, waterGlasses, completedMealIds, notes } = parsed.data;
   * const logDate = date ? new Date(date) : new Date();
   * logDate.setHours(0, 0, 0, 0);
   * 
   * // Calcular porcentaje de adherencia (4 comidas principales por defecto)
   * const totalMealsTarget = 4;
   * const completedCount = (completedMealIds || []).length;
   * const adherenceScore = Math.min(100, Math.round((completedCount / totalMealsTarget) * 100));
   * 
   * const updatedLog = await prisma.dailyLog.upsert({
   *   where: {
   *     patientId_date: {
   *       patientId,
   *       date: logDate
   *     }
   *   },
   *   update: {
   *     ...(waterGlasses !== undefined ? { waterGlasses } : {}),
   *     ...(completedMealIds ? { completedMeals: completedMealIds } : {}),
   *     adherenceScore,
   *     notes
   *   },
   *   create: {
   *     patientId,
   *     date: logDate,
   *     waterGlasses: waterGlasses || 0,
   *     waterTargetGlasses: 8,
   *     completedMeals: completedMealIds || [],
   *     adherenceScore,
   *     notes
   *   }
   * });
   * 
   * return res.json(updatedLog);
   * =========================================================================
   */

  // MVP DEMO CODE:
  try {
    const { patientId, waterGlasses, completedMealIds, notes } = req.body;
    const patient = MOCK_PATIENTS.find(p => p.id === patientId || p.userId === patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    if (!patient.todayLog) {
      patient.todayLog = {
        patientId: patient.id,
        date: new Date().toISOString().split('T')[0],
        waterGlasses: 0,
        waterTargetGlasses: 8,
        completedMealIds: [],
        adherencePercentage: 0
      };
    }

    if (waterGlasses !== undefined) {
      patient.todayLog.waterGlasses = Math.max(0, Number(waterGlasses));
    }

    if (completedMealIds !== undefined) {
      patient.todayLog.completedMealIds = completedMealIds;
      // Adherencia basada en 4 comidas diarias estándar
      const score = Math.min(100, Math.round((completedMealIds.length / 4) * 100));
      patient.todayLog.adherencePercentage = score;
      patient.adherenceRate = Math.round((patient.adherenceRate + score) / 2);
    }

    if (notes !== undefined) {
      patient.todayLog.notes = notes;
    }

    return res.json(patient.todayLog);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al actualizar el registro diario', details: error.message });
  }
};

// POST /api/daily-logs/water
export const logWater = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { patientId, delta } = req.body; // delta: +1 o -1
   * const today = new Date();
   * today.setHours(0, 0, 0, 0);
   * 
   * const log = await prisma.dailyLog.upsert({
   *   where: { patientId_date: { patientId, date: today } },
   *   update: {
   *     waterGlasses: { increment: delta }
   *   },
   *   create: {
   *     patientId,
   *     date: today,
   *     waterGlasses: Math.max(0, delta),
   *     waterTargetGlasses: 8,
   *     completedMeals: [],
   *     adherenceScore: 0
   *   }
   * });
   * return res.json(log);
   * =========================================================================
   */

  // MVP DEMO CODE:
  const { patientId, delta } = req.body;
  const patient = MOCK_PATIENTS.find(p => p.id === patientId || p.userId === patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  if (!patient.todayLog) {
    patient.todayLog = {
      patientId: patient.id,
      date: new Date().toISOString().split('T')[0],
      waterGlasses: 0,
      waterTargetGlasses: 8,
      completedMealIds: [],
      adherencePercentage: 0
    };
  }

  const current = patient.todayLog.waterGlasses || 0;
  patient.todayLog.waterGlasses = Math.max(0, current + (Number(delta) || 1));

  return res.json(patient.todayLog);
};
