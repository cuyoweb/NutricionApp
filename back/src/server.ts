import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: '*', // Permitir front y mobile en desarrollo local
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Main API Router
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Ecosistema Digital de Nutrición - API Backend',
    location: 'Mendoza, Argentina',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auth: 'POST /api/auth/login',
      patients: 'GET /api/patients, GET /api/patients/:id, POST /api/patients, PUT /api/patients/:id/metrics',
      mealPlans: 'GET /api/meal-plans/active/:patientId, POST /api/meal-plans, GET /api/meal-plans/foods',
      dailyLogs: 'GET /api/daily-logs/today/:patientId, POST /api/daily-logs, POST /api/daily-logs/water',
      ai: 'POST /api/ai/substitute-food'
    }
  });
});

// Error handling fallback
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Error desconocido'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 [NutricionApp Backend API] Activo en puerto ${PORT}`);
  console.log(`📍 Endpoint base: http://localhost:${PORT}/api`);
  console.log(`📋 Documentación y Mocks: 10 pacientes en Mendoza cargados`);
  console.log(`=======================================================`);
});
