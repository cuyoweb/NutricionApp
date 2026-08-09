import { Router } from 'express';
import { getPatients, getPatientById, createPatient, updatePatientMetrics } from '../controllers/patientController';

const router = Router();

// GET /api/patients
router.get('/', getPatients);

// GET /api/patients/:id
router.get('/:id', getPatientById);

// POST /api/patients
router.post('/', createPatient);

// PUT /api/patients/:id/metrics
router.put('/:id/metrics', updatePatientMetrics);

export default router;
