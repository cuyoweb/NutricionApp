import { Patient, MealPlanDetail, DailyLogState, FoodItem, FoodSubstitutionResponse } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    userId: 'usr-001',
    fullName: 'Sofía Agustina Morales',
    email: 'sofia.morales.mza@gmail.com',
    phone: '+54 9 261 543-8812',
    locality: 'Godoy Cruz, Mendoza',
    plan: 'PREMIUM',
    planPriceArs: 12000,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    age: 29,
    heightCm: 168,
    initialWeightKg: 76.5,
    currentWeightKg: 69.2,
    targetWeightKg: 64.0,
    bodyFatPercentage: 22.8,
    muscleMassPercentage: 34.2,
    bmi: 24.5,
    streakDays: 14,
    adherenceRate: 92,
    clinicalNotes: 'Excelente progreso en recomposición corporal. Realiza crossfit 4 veces por semana en Godoy Cruz. Se incrementó la ingesta proteica post-entreno.',
    createdAt: '2026-01-10T10:00:00Z',
    lastConsultationDate: '2026-08-01',
    anthropometricHistory: [
      { date: '2026-02-01', weightKg: 76.5, bodyFatPercentage: 28.5, muscleMassPercentage: 30.1, waistCm: 84, hipCm: 104, notes: 'Consulta inicial' },
      { date: '2026-03-15', weightKg: 74.8, bodyFatPercentage: 26.8, muscleMassPercentage: 31.0, waistCm: 81, hipCm: 102, notes: 'Ajuste calórico' },
      { date: '2026-05-02', weightKg: 72.4, bodyFatPercentage: 25.1, muscleMassPercentage: 32.5, waistCm: 77, hipCm: 99, notes: 'Mejora en hidratación' },
      { date: '2026-06-20', weightKg: 70.8, bodyFatPercentage: 23.9, muscleMassPercentage: 33.4, waistCm: 75, hipCm: 97, notes: 'Excelente respuesta' },
      { date: '2026-08-01', weightKg: 69.2, bodyFatPercentage: 22.8, muscleMassPercentage: 34.2, waistCm: 73, hipCm: 95, notes: 'Cerca del objetivo' }
    ],
    todayLog: {
      patientId: 'pat-001',
      date: '2026-08-08',
      waterGlasses: 6,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun'],
      adherencePercentage: 75,
      notes: 'Entrenamiento completado a las 18hs'
    },
    activeMealPlan: {
      id: 'plan-001',
      patientId: 'pat-001',
      title: 'Recomposición Corporal & Alto Rendimiento (Mendoza Fit)',
      caloriesTarget: 1950,
      proteinGrams: 135,
      carbsGrams: 190,
      fatsGrams: 55,
      isActive: true,
      startDate: '2026-08-01',
      notes: 'Enfocado en timing de carbohidratos alrededor del entrenamiento.',
      days: [
        {
          dayOfWeek: 'Lunes',
          meals: [
            {
              id: 'desayuno-lun',
              type: 'DESAYUNO',
              title: 'Tostadas de Masa Madre con Palta y Huevos Poché',
              timeHint: '08:00 hs',
              description: '2 tostadas con palta pisada, 2 huevos poché y café con bebida de almendras.',
              items: [
                { id: 'i-1', foodName: 'Pan de Masa Madre', quantityGrams: 70, unit: 'g', category: 'Almacén', calories: 180, proteinGrams: 6, carbsGrams: 36, fatsGrams: 1 },
                { id: 'i-2', foodName: 'Palta Hass de Mendoza', quantityGrams: 50, unit: 'g', category: 'Verdulería', calories: 80, proteinGrams: 1, carbsGrams: 4, fatsGrams: 7.5 },
                { id: 'i-3', foodName: 'Huevos de Campo', quantityGrams: 100, unit: 'g', category: 'Refrigerados', calories: 140, proteinGrams: 13, carbsGrams: 1, fatsGrams: 9.5 }
              ]
            },
            {
              id: 'almuerzo-lun',
              type: 'ALMUERZO',
              title: 'Bowl de Pollo Grillado con Quinoa y Vegetales Asados',
              timeHint: '13:00 hs',
              description: 'Pechuga a la plancha, quinoa cocida, calabaza y espinaca salteada con oliva.',
              items: [
                { id: 'i-4', foodName: 'Pechuga de Pollo', quantityGrams: 150, unit: 'g', category: 'Carnicería', calories: 240, proteinGrams: 46, carbsGrams: 0, fatsGrams: 5 },
                { id: 'i-5', foodName: 'Quinoa Cocida', quantityGrams: 120, unit: 'g', category: 'Almacén', calories: 144, proteinGrams: 5, carbsGrams: 26, fatsGrams: 2.3 },
                { id: 'i-6', foodName: 'Calabaza Asada', quantityGrams: 150, unit: 'g', category: 'Verdulería', calories: 45, proteinGrams: 1.5, carbsGrams: 10, fatsGrams: 0.2 },
                { id: 'i-7', foodName: 'Aceite de Oliva Virgen Extra', quantityGrams: 10, unit: 'ml', category: 'Almacén', calories: 88, proteinGrams: 0, carbsGrams: 0, fatsGrams: 10 }
              ]
            },
            {
              id: 'merienda-lun',
              type: 'MERIENDA',
              title: 'Yogur Griego con Frutos Rojos y Nueces del Valle de Uco',
              timeHint: '17:30 hs',
              description: 'Yogur natural proteico, arándanos frescos y nueces picadas.',
              items: [
                { id: 'i-8', foodName: 'Yogur Griego Natural', quantityGrams: 170, unit: 'g', category: 'Refrigerados', calories: 130, proteinGrams: 15, carbsGrams: 6, fatsGrams: 5 },
                { id: 'i-9', foodName: 'Frutos Rojos / Arándanos', quantityGrams: 80, unit: 'g', category: 'Verdulería', calories: 45, proteinGrams: 0.8, carbsGrams: 11, fatsGrams: 0.3 },
                { id: 'i-10', foodName: 'Nueces de Mendoza', quantityGrams: 20, unit: 'g', category: 'Almacén', calories: 130, proteinGrams: 3, carbsGrams: 2.7, fatsGrams: 13 }
              ]
            },
            {
              id: 'cena-lun',
              type: 'CENA',
              title: 'Filete de Merluza al Papillote con Ensalada Multicolor',
              timeHint: '21:30 hs',
              description: 'Merluza con hierbas, tomate, rúcula, zanahoria rallada y semillas de chía.',
              items: [
                { id: 'i-11', foodName: 'Filete de Merluza Fresca', quantityGrams: 180, unit: 'g', category: 'Carnicería', calories: 160, proteinGrams: 34, carbsGrams: 0, fatsGrams: 2 },
                { id: 'i-12', foodName: 'Rúcula y Tomate Cherry', quantityGrams: 150, unit: 'g', category: 'Verdulería', calories: 35, proteinGrams: 2, carbsGrams: 6, fatsGrams: 0.4 },
                { id: 'i-13', foodName: 'Semillas de Chía', quantityGrams: 10, unit: 'g', category: 'Almacén', calories: 48, proteinGrams: 1.7, carbsGrams: 4.2, fatsGrams: 3 }
              ]
            }
          ]
        },
        {
          dayOfWeek: 'Martes',
          meals: [
            {
              id: 'desayuno-mar',
              type: 'DESAYUNO',
              title: 'Pancake de Avena, Banana y Canela con Miel de Lavalle',
              timeHint: '08:00 hs',
              description: 'Avena procesada con clara de huevo, banana pisada y un toque de miel.',
              items: [
                { id: 'i-14', foodName: 'Avena Tradicional', quantityGrams: 50, unit: 'g', category: 'Almacén', calories: 190, proteinGrams: 6.5, carbsGrams: 33, fatsGrams: 3.5 },
                { id: 'i-15', foodName: 'Claras de Huevo', quantityGrams: 120, unit: 'g', category: 'Refrigerados', calories: 60, proteinGrams: 13, carbsGrams: 0.5, fatsGrams: 0.2 },
                { id: 'i-16', foodName: 'Banana', quantityGrams: 90, unit: 'g', category: 'Verdulería', calories: 80, proteinGrams: 1, carbsGrams: 20, fatsGrams: 0.3 }
              ]
            },
            {
              id: 'almuerzo-mar',
              type: 'ALMUERZO',
              title: 'Bife de Lomo Magro con Batatas Horneadas al Romero',
              timeHint: '13:00 hs',
              description: 'Lomo a la plancha término medio con batatas crocantes y ensalada verde.',
              items: [
                { id: 'i-17', foodName: 'Bife de Lomo Vacuno', quantityGrams: 160, unit: 'g', category: 'Carnicería', calories: 230, proteinGrams: 42, carbsGrams: 0, fatsGrams: 6.5 },
                { id: 'i-18', foodName: 'Batata Asada', quantityGrams: 140, unit: 'g', category: 'Verdulería', calories: 120, proteinGrams: 2.2, carbsGrams: 28, fatsGrams: 0.2 }
              ]
            },
            {
              id: 'merienda-mar',
              type: 'MERIENDA',
              title: 'Licuado Proteico de Frutillas con Leche Descremada',
              timeHint: '17:30 hs',
              description: 'Frutillas mendocinas con leche vegetal/descremada y proteína whey.',
              items: [
                { id: 'i-19', foodName: 'Frutillas Frescas', quantityGrams: 150, unit: 'g', category: 'Verdulería', calories: 48, proteinGrams: 1, carbsGrams: 11.5, fatsGrams: 0.4 },
                { id: 'i-20', foodName: 'Leche Descremada', quantityGrams: 250, unit: 'ml', category: 'Refrigerados', calories: 85, proteinGrams: 8, carbsGrams: 12, fatsGrams: 0.5 }
              ]
            },
            {
              id: 'cena-mar',
              type: 'CENA',
              title: 'Tortilla de Espinaca y Champiñones con Tomates Asados',
              timeHint: '21:30 hs',
              description: 'Espinaca fresca salteada con ajo, huevos enteros y ensalada de hojas.',
              items: [
                { id: 'i-21', foodName: 'Espinaca Fresca', quantityGrams: 200, unit: 'g', category: 'Verdulería', calories: 46, proteinGrams: 5.8, carbsGrams: 7.2, fatsGrams: 0.8 },
                { id: 'i-22', foodName: 'Huevos de Campo', quantityGrams: 100, unit: 'g', category: 'Refrigerados', calories: 140, proteinGrams: 13, carbsGrams: 1, fatsGrams: 9.5 }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'pat-002',
    userId: 'usr-002',
    fullName: 'Matías Ezequiel Benítez',
    email: 'matias.benitez88@gmail.com',
    phone: '+54 9 261 412-9904',
    locality: 'Ciudad de Mendoza',
    plan: 'PRO',
    planPriceArs: 10000,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    age: 36,
    heightCm: 182,
    initialWeightKg: 94.0,
    currentWeightKg: 86.4,
    targetWeightKg: 80.0,
    bodyFatPercentage: 19.5,
    muscleMassPercentage: 41.0,
    bmi: 26.1,
    streakDays: 8,
    adherenceRate: 88,
    clinicalNotes: 'Reducción de perímetro abdominal de 102cm a 91cm. Muy buena respuesta a la dieta antiinflamatoria.',
    createdAt: '2026-02-15T09:00:00Z',
    lastConsultationDate: '2026-07-28',
    anthropometricHistory: [
      { date: '2026-02-15', weightKg: 94.0, bodyFatPercentage: 25.0, muscleMassPercentage: 38.0, waistCm: 102, hipCm: 108 },
      { date: '2026-04-10', weightKg: 90.5, bodyFatPercentage: 22.8, muscleMassPercentage: 39.4, waistCm: 96, hipCm: 105 },
      { date: '2026-06-05', weightKg: 88.0, bodyFatPercentage: 21.0, muscleMassPercentage: 40.2, waistCm: 93, hipCm: 103 },
      { date: '2026-07-28', weightKg: 86.4, bodyFatPercentage: 19.5, muscleMassPercentage: 41.0, waistCm: 91, hipCm: 101 }
    ],
    todayLog: {
      patientId: 'pat-002',
      date: '2026-08-08',
      waterGlasses: 5,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun'],
      adherencePercentage: 66
    }
  },
  {
    id: 'pat-003',
    userId: 'usr-003',
    fullName: 'Camila Lucía Cornejo',
    email: 'camila.cornejo.mza@outlook.com',
    phone: '+54 9 261 678-2231',
    locality: 'Luján de Cuyo, Mendoza',
    plan: 'PREMIUM',
    planPriceArs: 12000,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    age: 32,
    heightCm: 162,
    initialWeightKg: 68.0,
    currentWeightKg: 59.5,
    targetWeightKg: 57.0,
    bodyFatPercentage: 21.0,
    muscleMassPercentage: 32.8,
    bmi: 22.7,
    streakDays: 21,
    adherenceRate: 96,
    clinicalNotes: 'Objetivo prácticamente alcanzado. Plan de mantenimiento y tonificación iniciado.',
    createdAt: '2026-01-20T11:30:00Z',
    lastConsultationDate: '2026-08-03',
    anthropometricHistory: [
      { date: '2026-01-20', weightKg: 68.0, bodyFatPercentage: 29.0, waistCm: 80, hipCm: 100 },
      { date: '2026-03-30', weightKg: 63.5, bodyFatPercentage: 25.0, waistCm: 73, hipCm: 96 },
      { date: '2026-06-15', weightKg: 60.8, bodyFatPercentage: 22.5, waistCm: 69, hipCm: 93 },
      { date: '2026-08-03', weightKg: 59.5, bodyFatPercentage: 21.0, waistCm: 67, hipCm: 92 }
    ],
    todayLog: {
      patientId: 'pat-003',
      date: '2026-08-08',
      waterGlasses: 8,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun', 'merienda-lun'],
      adherencePercentage: 100
    }
  },
  {
    id: 'pat-004',
    userId: 'usr-004',
    fullName: 'Joaquín Ignacio Navarro',
    email: 'j.navarro.ing@gmail.com',
    phone: '+54 9 261 334-1188',
    locality: 'Guaymallén, Mendoza',
    plan: 'INICIAL',
    planPriceArs: 6000,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    age: 41,
    heightCm: 175,
    initialWeightKg: 89.0,
    currentWeightKg: 84.8,
    targetWeightKg: 76.0,
    bodyFatPercentage: 24.5,
    muscleMassPercentage: 36.2,
    bmi: 27.7,
    streakDays: 5,
    adherenceRate: 78,
    clinicalNotes: 'Trabajo de oficina muchas horas. Se indicaron pausas activas y mejorar ingesta hídrica.',
    createdAt: '2026-03-01T08:00:00Z',
    lastConsultationDate: '2026-07-20',
    anthropometricHistory: [
      { date: '2026-03-01', weightKg: 89.0, bodyFatPercentage: 28.0, waistCm: 98 },
      { date: '2026-05-10', weightKg: 86.7, bodyFatPercentage: 26.0, waistCm: 95 },
      { date: '2026-07-20', weightKg: 84.8, bodyFatPercentage: 24.5, waistCm: 92 }
    ],
    todayLog: {
      patientId: 'pat-004',
      date: '2026-08-08',
      waterGlasses: 4,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun'],
      adherencePercentage: 50
    }
  },
  {
    id: 'pat-005',
    userId: 'usr-005',
    fullName: 'Valentina Belén Rivas',
    email: 'valen.rivas.arq@gmail.com',
    phone: '+54 9 261 712-4409',
    locality: 'Maipú, Mendoza',
    plan: 'PRO',
    planPriceArs: 10000,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    age: 26,
    heightCm: 170,
    initialWeightKg: 64.0,
    currentWeightKg: 61.0,
    targetWeightKg: 60.0,
    bodyFatPercentage: 19.8,
    muscleMassPercentage: 35.0,
    bmi: 21.1,
    streakDays: 19,
    adherenceRate: 94,
    clinicalNotes: 'Enfocada en ganar masa muscular para running de montaña. Dieta rica en carbohidratos complejos.',
    createdAt: '2026-02-10T15:00:00Z',
    lastConsultationDate: '2026-08-02',
    anthropometricHistory: [
      { date: '2026-02-10', weightKg: 64.0, bodyFatPercentage: 23.0, muscleMassPercentage: 32.5 },
      { date: '2026-05-18', weightKg: 62.1, bodyFatPercentage: 21.2, muscleMassPercentage: 33.8 },
      { date: '2026-08-02', weightKg: 61.0, bodyFatPercentage: 19.8, muscleMassPercentage: 35.0 }
    ],
    todayLog: {
      patientId: 'pat-005',
      date: '2026-08-08',
      waterGlasses: 7,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun', 'merienda-lun'],
      adherencePercentage: 100
    }
  },
  {
    id: 'pat-006',
    userId: 'usr-006',
    fullName: 'Gonzalo Andrés Vignolo',
    email: 'gonza.vignolo@gmail.com',
    phone: '+54 9 261 498-3320',
    locality: 'Chacras de Coria, Luján de Cuyo',
    plan: 'PREMIUM',
    planPriceArs: 12000,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    age: 45,
    heightCm: 178,
    initialWeightKg: 102.5,
    currentWeightKg: 91.8,
    targetWeightKg: 82.0,
    bodyFatPercentage: 25.2,
    muscleMassPercentage: 38.5,
    bmi: 28.9,
    streakDays: 11,
    adherenceRate: 89,
    clinicalNotes: 'Control de perfil lipídico y glucemia en ayunas. Valores normalizados tras 4 meses de plan.',
    createdAt: '2026-01-05T09:00:00Z',
    lastConsultationDate: '2026-07-29',
    anthropometricHistory: [
      { date: '2026-01-05', weightKg: 102.5, bodyFatPercentage: 32.0, waistCm: 110 },
      { date: '2026-03-20', weightKg: 97.0, bodyFatPercentage: 29.0, waistCm: 103 },
      { date: '2026-05-30', weightKg: 94.2, bodyFatPercentage: 27.1, waistCm: 99 },
      { date: '2026-07-29', weightKg: 91.8, bodyFatPercentage: 25.2, waistCm: 96 }
    ],
    todayLog: {
      patientId: 'pat-006',
      date: '2026-08-08',
      waterGlasses: 6,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun'],
      adherencePercentage: 75
    }
  },
  {
    id: 'pat-007',
    userId: 'usr-007',
    fullName: 'Luciana Milagros Giménez',
    email: 'lu.gimenez.doc@gmail.com',
    phone: '+54 9 261 889-1002',
    locality: 'San Martín, Mendoza',
    plan: 'INICIAL',
    planPriceArs: 6000,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    age: 38,
    heightCm: 165,
    initialWeightKg: 73.0,
    currentWeightKg: 69.5,
    targetWeightKg: 62.0,
    bodyFatPercentage: 27.5,
    muscleMassPercentage: 29.5,
    bmi: 25.5,
    streakDays: 3,
    adherenceRate: 72,
    clinicalNotes: 'Guardias nocturnas en hospital. Se adaptaron colaciones prácticas y de bajo índice glucémico.',
    createdAt: '2026-04-01T12:00:00Z',
    lastConsultationDate: '2026-07-15',
    anthropometricHistory: [
      { date: '2026-04-01', weightKg: 73.0, bodyFatPercentage: 30.0, waistCm: 86 },
      { date: '2026-07-15', weightKg: 69.5, bodyFatPercentage: 27.5, waistCm: 82 }
    ],
    todayLog: {
      patientId: 'pat-007',
      date: '2026-08-08',
      waterGlasses: 3,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun'],
      adherencePercentage: 40
    }
  },
  {
    id: 'pat-008',
    userId: 'usr-008',
    fullName: 'Facundo Tomás Sosa',
    email: 'facu.sosa.mza@gmail.com',
    phone: '+54 9 261 223-9977',
    locality: 'Las Heras, Mendoza',
    plan: 'FREE',
    planPriceArs: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    age: 22,
    heightCm: 179,
    initialWeightKg: 68.0,
    currentWeightKg: 71.5,
    targetWeightKg: 75.0,
    bodyFatPercentage: 14.2,
    muscleMassPercentage: 44.0,
    bmi: 22.3,
    streakDays: 16,
    adherenceRate: 85,
    clinicalNotes: 'Plan de superávit calórico controlado para hipertrofia. Buena asimilación de nutrientes.',
    createdAt: '2026-03-12T14:00:00Z',
    lastConsultationDate: '2026-07-10',
    anthropometricHistory: [
      { date: '2026-03-12', weightKg: 68.0, bodyFatPercentage: 13.5, muscleMassPercentage: 41.5 },
      { date: '2026-07-10', weightKg: 71.5, bodyFatPercentage: 14.2, muscleMassPercentage: 44.0 }
    ],
    todayLog: {
      patientId: 'pat-008',
      date: '2026-08-08',
      waterGlasses: 6,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun'],
      adherencePercentage: 80
    }
  },
  {
    id: 'pat-009',
    userId: 'usr-009',
    fullName: 'María Florencia Castro',
    email: 'flor.castro.mza@gmail.com',
    phone: '+54 9 261 654-7711',
    locality: 'Godoy Cruz, Mendoza',
    plan: 'PRO',
    planPriceArs: 10000,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    age: 34,
    heightCm: 160,
    initialWeightKg: 71.2,
    currentWeightKg: 65.4,
    targetWeightKg: 58.0,
    bodyFatPercentage: 24.0,
    muscleMassPercentage: 31.0,
    bmi: 25.5,
    streakDays: 12,
    adherenceRate: 90,
    clinicalNotes: 'Vegetariana. Incorporación exitosa de legumbres, tofu y tempeh con adecuada densidad de hierro.',
    createdAt: '2026-02-01T16:30:00Z',
    lastConsultationDate: '2026-08-04',
    anthropometricHistory: [
      { date: '2026-02-01', weightKg: 71.2, bodyFatPercentage: 29.5, waistCm: 85 },
      { date: '2026-05-15', weightKg: 67.8, bodyFatPercentage: 26.3, waistCm: 79 },
      { date: '2026-08-04', weightKg: 65.4, bodyFatPercentage: 24.0, waistCm: 75 }
    ],
    todayLog: {
      patientId: 'pat-009',
      date: '2026-08-08',
      waterGlasses: 7,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun', 'almuerzo-lun'],
      adherencePercentage: 85
    }
  },
  {
    id: 'pat-010',
    userId: 'usr-010',
    fullName: 'Esteban Rodrigo Páez',
    email: 'esteban.paez.mza@gmail.com',
    phone: '+54 9 261 330-8844',
    locality: 'Ciudad de Mendoza',
    plan: 'FREE',
    planPriceArs: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    age: 48,
    heightCm: 176,
    initialWeightKg: 91.0,
    currentWeightKg: 87.2,
    targetWeightKg: 78.0,
    bodyFatPercentage: 26.0,
    muscleMassPercentage: 35.8,
    bmi: 28.1,
    streakDays: 4,
    adherenceRate: 68,
    clinicalNotes: 'Paciente en plan de prueba. Mostró interés en pasar a plan PRO para recibir seguimiento semanal.',
    createdAt: '2026-05-01T10:00:00Z',
    lastConsultationDate: '2026-07-22',
    anthropometricHistory: [
      { date: '2026-05-01', weightKg: 91.0, bodyFatPercentage: 28.5, waistCm: 101 },
      { date: '2026-07-22', weightKg: 87.2, bodyFatPercentage: 26.0, waistCm: 96 }
    ],
    todayLog: {
      patientId: 'pat-010',
      date: '2026-08-08',
      waterGlasses: 4,
      waterTargetGlasses: 8,
      completedMealIds: ['desayuno-lun'],
      adherencePercentage: 50
    }
  }
];

export const FOOD_LIBRARY: FoodItem[] = [
  { id: 'f-1', name: 'Pechuga de Pollo', category: 'Carnicería', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatsPer100g: 3.6, portionStandard: '1 filete mediano (150g)' },
  { id: 'f-2', name: 'Bife de Lomo Vacuno', category: 'Carnicería', caloriesPer100g: 143, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 4.1, portionStandard: '1 bife magro (160g)' },
  { id: 'f-3', name: 'Filete de Merluza Fresca', category: 'Carnicería', caloriesPer100g: 88, proteinPer100g: 19, carbsPer100g: 0, fatsPer100g: 1.1, portionStandard: '1 filete (180g)' },
  { id: 'f-4', name: 'Huevos de Campo', category: 'Refrigerados', caloriesPer100g: 143, proteinPer100g: 13, carbsPer100g: 0.8, fatsPer100g: 9.5, portionStandard: '2 unidades (100g)' },
  { id: 'f-5', name: 'Claras de Huevo', category: 'Refrigerados', caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatsPer100g: 0.2, portionStandard: '3 claras (100g)' },
  { id: 'f-6', name: 'Yogur Griego Natural', category: 'Refrigerados', caloriesPer100g: 75, proteinPer100g: 9, carbsPer100g: 3.5, fatsPer100g: 3.0, portionStandard: '1 pote (170g)' },
  { id: 'f-7', name: 'Leche Descremada', category: 'Refrigerados', caloriesPer100g: 34, proteinPer100g: 3.3, carbsPer100g: 4.8, fatsPer100g: 0.2, portionStandard: '1 vaso (200ml)' },
  { id: 'f-8', name: 'Palta Hass de Mendoza', category: 'Verdulería', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatsPer100g: 14.7, portionStandard: '1/2 unidad (60g)' },
  { id: 'f-9', name: 'Batata Asada', category: 'Verdulería', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatsPer100g: 0.1, portionStandard: '1 unidad chica (130g)' },
  { id: 'f-10', name: 'Calabaza Asada', category: 'Verdulería', caloriesPer100g: 30, proteinPer100g: 1.0, carbsPer100g: 6.5, fatsPer100g: 0.1, portionStandard: '1 porción (150g)' },
  { id: 'f-11', name: 'Espinaca Fresca', category: 'Verdulería', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatsPer100g: 0.4, portionStandard: '1 plato hondo (120g)' },
  { id: 'f-12', name: 'Frutos Rojos / Arándanos', category: 'Verdulería', caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatsPer100g: 0.3, portionStandard: '1 taza (100g)' },
  { id: 'f-13', name: 'Banana de Primera', category: 'Verdulería', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 22.8, fatsPer100g: 0.3, portionStandard: '1 mediana (100g)' },
  { id: 'f-14', name: 'Pan de Masa Madre', category: 'Almacén', caloriesPer100g: 250, proteinPer100g: 8.5, carbsPer100g: 50, fatsPer100g: 1.5, portionStandard: '2 rebanadas (70g)' },
  { id: 'f-15', name: 'Avena Tradicional', category: 'Almacén', caloriesPer100g: 380, proteinPer100g: 13, carbsPer100g: 66, fatsPer100g: 7, portionStandard: '1/2 taza (45g)' },
  { id: 'f-16', name: 'Quinoa Real', category: 'Almacén', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21.3, fatsPer100g: 1.9, portionStandard: '1 taza cocida (140g)' },
  { id: 'f-17', name: 'Nueces de Mendoza', category: 'Almacén', caloriesPer100g: 654, proteinPer100g: 15, carbsPer100g: 13.7, fatsPer100g: 65.2, portionStandard: '1 puñado (25g)' },
  { id: 'f-18', name: 'Aceite de Oliva Virgen Extra', category: 'Almacén', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100, portionStandard: '1 cucharada (12ml)' },
  { id: 'f-19', name: 'Lentejas Cocidas', category: 'Almacén', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatsPer100g: 0.4, portionStandard: '1 taza (150g)' },
  { id: 'f-20', name: 'Arroz Integral', category: 'Almacén', caloriesPer100g: 111, proteinPer100g: 2.6, carbsPer100g: 23, fatsPer100g: 0.9, portionStandard: '1 taza cocida (130g)' }
];

export const FOOD_SUBSTITUTIONS_DB = [
  {
    original: 'Pechuga de Pollo',
    substitute: 'Filete de Merluza Fresca',
    ratio: 1.15,
    category: 'Carnicería',
    reason: 'La merluza es más magra y ligera en digestión manteniendo el aporte proteico sin sumar grasas saturadas.'
  },
  {
    original: 'Pechuga de Pollo',
    substitute: 'Tofu Firme Orgánico',
    ratio: 1.45,
    category: 'Refrigerados',
    reason: 'Excelente reemplazo vegetal. Rico en isoflavonas y calcio con bajo índice glucémico.'
  },
  {
    original: 'Pechuga de Pollo',
    substitute: 'Huevos de Campo (2 unidades)',
    ratio: 0.85,
    category: 'Refrigerados',
    reason: 'Perfil completo de aminoácidos con colina para función cognitiva y hepática.'
  },
  {
    original: 'Arroz Blanco Cocido',
    substitute: 'Batata Asada',
    ratio: 1.25,
    category: 'Verdulería',
    reason: 'Mayor contenido de fibra y betacarotenos, menor pico de insulina postprandial.'
  },
  {
    original: 'Arroz Blanco Cocido',
    substitute: 'Quinoa Cocida',
    ratio: 0.95,
    category: 'Almacén',
    reason: 'Aporta aminoácidos esenciales y más del doble de fibra dietética.'
  },
  {
    original: 'Pan de Masa Madre',
    substitute: 'Avena Tradicional en Hojuelas',
    ratio: 0.65,
    category: 'Almacén',
    reason: 'Betaglucanos que reducen el colesterol LDL y prolongan la saciedad matutina.'
  },
  {
    original: 'Palta Hass',
    substitute: 'Nueces de Mendoza',
    ratio: 0.40,
    category: 'Almacén',
    reason: 'Aporte de grasas poliinsaturadas omega-3 de origen vegetal de alta densidad energética.'
  },
  {
    original: 'Yogur Griego Natural',
    substitute: 'Queso Ricotta Magro',
    ratio: 0.90,
    category: 'Refrigerados',
    reason: 'Aporte proteico equivalente con textura densa y alto contenido de calcio.'
  }
];

// Helper to get clone of in-memory or persisted patients in client
export function getLocalPatients(): Patient[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('nutri_local_patients');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // ignore parse error
      }
    }
  }
  return JSON.parse(JSON.stringify(MOCK_PATIENTS));
}

export function saveLocalPatients(patients: Patient[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nutri_local_patients', JSON.stringify(patients));
  }
}
