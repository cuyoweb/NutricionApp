# 🥗 Ecosistema Digital de Nutrición (Mendoza, Argentina)

Plataforma integral full-stack de prescripción inteligente de dietas, seguimiento clínico antropométrico y aplicación móvil para pacientes.

---

## 🏗️ Estructura del Monorepo

El proyecto está organizado en **3 carpetas independientes** en la raíz:

```
NutricionApp/
├── back/               # API REST (Node.js + Express + TypeScript + Zod + Prisma Blueprint)
├── front/              # Dashboard Web de la Nutricionista (Next.js 14 + Tailwind + Recharts)
├── mobile/             # Web App Mobile-First para Pacientes (Next.js 14 + Framer Motion)
├── package.json        # Orquestador raíz con scripts concurrentes
└── README.md           # Documentación técnica completa
```

---

## ⚡ Inicio Rápido (3 Comandos)

### 1. Instalar todas las dependencias
Desde la raíz del proyecto ejecuta:
```bash
npm run install:all
```

### 2. Iniciar todo el ecosistema en paralelo
```bash
npm run dev:all
```

Esto levantará los 3 servicios simultáneamente:
- 🌐 **Backend API:** [http://localhost:4000](http://localhost:4000) (Endpoints bajo `/api`)
- 💻 **Dashboard Nutricionista:** [http://localhost:3000](http://localhost:3000)
- 📱 **App Mobile Pacientes:** [http://localhost:3001](http://localhost:3001)

---

## 🔧 Ejecución Individual por Carpeta

Si prefieres ejecutar los proyectos en terminales separadas:

### 1. Backend (`/back`)
```bash
cd back
npm run dev
# Corre en http://localhost:4000
```

### 2. Dashboard Nutricionista (`/front`)
```bash
cd front
npm run dev
# Corre en http://localhost:3000
```

### 3. App Mobile Paciente (`/mobile`)
```bash
cd mobile
npm run dev
# Corre en http://localhost:3001
```

---

## 📂 Descripción Detallada de Módulos

### 1. Backend REST API (`/back`)
- **Tecnologías:** Express, TypeScript, Zod, CORS, Tsx.
- **Dataset Realista:** 10 pacientes de Mendoza (Godoy Cruz, Ciudad, Maipú, Luján de Cuyo, Guaymallén, San Martín, Las Heras) con historial antropométrico real, planes de comida y checklists.
- **Planes Mapeados:**
  - `FREE` ($0)
  - `INICIAL` ($6.000 ARS/mes)
  - `PRO` ($10.000 ARS/mes)
  - `PREMIUM` ($12.000 ARS/mes)
- **Código de Producción Comentado:**
  - Archivo `prisma/schema.prisma` completo con modelos relacionales (`User`, `PatientProfile`, `AnthropometricRecord`, `MealPlan`, `Food`, `DailyLog`, `FoodSubstitution`).
  - Todos los controladores en `src/controllers/` incluyen bloques detallados de código listos para reemplazar los mocks por consultas reales a PostgreSQL mediante Prisma ORM.
- **Endpoints:**
  - `POST /api/auth/login`: Autenticación simulada según rol (`NUTRITIONIST` o `PATIENT`).
  - `GET /api/patients`: Lista de los 10 pacientes con filtros de búsqueda y plan.
  - `GET /api/patients/:id`: Ficha clínica y métricas detalladas.
  - `POST /api/patients`: Registro de nuevos pacientes.
  - `PUT /api/patients/:id/metrics`: Registro de control antropométrico (peso, grasa, músculo).
  - `GET /api/meal-plans/active/:patientId`: Dieta semanal activa y macros.
  - `POST /api/meal-plans`: Prescripción y asignación de planes de comida.
  - `GET /api/meal-plans/foods`: Catálogo de alimentos con valores nutricionales por 100g.
  - `GET /api/daily-logs/today/:patientId`: Estado del día (comidas realizadas y agua).
  - `POST /api/daily-logs`: Actualización de comidas completadas y cálculo de adherencia.
  - `POST /api/daily-logs/water`: Contador de vasos de agua (+1 / -1).
  - `POST /api/ai/substitute-food`: Cálculo de equivalencias en gramos y consejos culinarios mediante IA.

---

### 2. Dashboard Administrativo Nutricionista (`/front`)
- **Tecnologías:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Estética:** Corporativo, elegante, Midnight Slate (`#0f172a`), badges de planes con precios.
- **Vistas:**
  - `/login`: Acceso profesional con botón 1-click para la Lic. Valentina Rossi (M.P. 1842 - Mendoza).
  - `/dashboard`: Tarjetas KPI (Total pacientes, MRR mensual ~$74.000 ARS, adherencia media 86%), gráficos de distribución de planes y evolución temporal.
  - `/pacientes`: Tabla completa con buscador en tiempo real, pestañas de filtro por plan y botón de ficha.
  - `/pacientes/[id]`: Ficha clínica con pestañas de *Métricas Antropométricas & Evolución* (gráfico interactivo de peso y bioimpedancia), *Plan Nutricional Activo* y *Seguimiento Diario*.
  - `/crear-dieta`: Diseñador interactivo de planes semanales con catálogo de alimentos y cálculo en tiempo real de calorías y macronutrientes.

---

### 3. App Mobile-First Paciente (`/mobile`)
- **Tecnologías:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Estética:** Contenedor smartphone centrado (`max-w-[430px]`), barra de navegación inferior fija (`Mi Día`, `Compras`, `Reemplazos`, `Progreso`).
- **Vistas:**
  - `/login`: Selector interactivo para ingresar como cualquiera de los 10 pacientes y probar diferentes personas y planes.
  - `/` (*Mi Día*): Menú interactivo de hoy, checklist de comidas con feedback instantáneo, contador de agua interactivo (+1 / -1 vaso) y barra de adherencia.
  - `/lista-compras`: Consolidador dinámico de compras agrupado por rubros (*Verdulería*, *Almacén*, *Carnicería*, *Refrigerados*) con casilleros para tildar en el súper.
  - `/reemplazos`: Asistente interactivo de IA para calcular la cantidad equivalente exacta en gramos al sustituir un ingrediente manteniendo los macros.
  - `/mi-progreso`: Gráfico de evolución de peso corporal, porcentaje de grasa, masa muscular, IMC y notas de la nutricionista.

---

## 👨‍⚕️ Perfil Clínico de Demostración
- **Nutricionista:** Lic. Valentina Rossi
- **Matrícula Profesional:** M.P. 1842 (Colegio de Nutricionistas de Mendoza)
- **Consultorio:** Av. San Martín 1240, 4to Piso, Ciudad de Mendoza
- **Pacientes en Demo:** 10 pacientes reales con planes FREE, INICIAL, PRO y PREMIUM.
