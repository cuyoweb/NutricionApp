'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Search, 
  Check, 
  ChevronRight, 
  Flame, 
  Apple, 
  ArrowLeft,
  Layers
} from 'lucide-react';
import { Header } from '../../../components/Header';
import { api } from '../../../lib/api';
import { Patient, FoodItem, MealSlotDetail, DayPlanDetail } from '../../../types';

function CrearDietaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPatientId = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  
  // Diet plan state
  const [planTitle, setPlanTitle] = useState('Plan Recomposición Corporal - Mendoza Fit');
  const [targetCalories, setTargetCalories] = useState(1950);
  const [targetProtein, setTargetProtein] = useState(135);
  const [targetCarbs, setTargetCarbs] = useState(190);
  const [targetFats, setTargetFats] = useState(55);
  const [planNotes, setPlanNotes] = useState('Priorizar fuentes de proteína magra y vegetales de estación.');

  // Current day being edited
  const [activeDay, setActiveDay] = useState('Lunes');
  const [activeMealType, setActiveMealType] = useState<'DESAYUNO' | 'MEDIA_MANANA' | 'ALMUERZO' | 'MERIENDA' | 'CENA'>('DESAYUNO');

  // Days structure
  const [daysPlan, setDaysPlan] = useState<DayPlanDetail[]>([
    {
      dayOfWeek: 'Lunes',
      meals: [
        {
          id: 'm-1',
          type: 'DESAYUNO',
          title: 'Tostadas de Masa Madre con Palta y Huevos Poché',
          timeHint: '08:00 hs',
          description: 'Desayuno balanceado rico en grasas saludables y proteína de alto valor biológico.',
          items: [
            { id: 'it-1', foodName: 'Pan de Masa Madre', quantityGrams: 70, unit: 'g', category: 'Almacén', calories: 175, proteinGrams: 6, carbsGrams: 35, fatsGrams: 1 },
            { id: 'it-2', foodName: 'Palta Hass de Mendoza', quantityGrams: 50, unit: 'g', category: 'Verdulería', calories: 80, proteinGrams: 1, carbsGrams: 4, fatsGrams: 7.5 },
            { id: 'it-3', foodName: 'Huevos de Campo', quantityGrams: 100, unit: 'g', category: 'Refrigerados', calories: 143, proteinGrams: 13, carbsGrams: 0.8, fatsGrams: 9.5 }
          ]
        },
        {
          id: 'm-2',
          type: 'ALMUERZO',
          title: 'Bowl de Pollo Grillado con Quinoa y Calabaza Asada',
          timeHint: '13:00 hs',
          description: 'Aporte de carbohidratos complejos y proteína magra.',
          items: [
            { id: 'it-4', foodName: 'Pechuga de Pollo', quantityGrams: 150, unit: 'g', category: 'Carnicería', calories: 247, proteinGrams: 46.5, carbsGrams: 0, fatsGrams: 5.4 },
            { id: 'it-5', foodName: 'Quinoa Real', quantityGrams: 120, unit: 'g', category: 'Almacén', calories: 144, proteinGrams: 5.2, carbsGrams: 25.5, fatsGrams: 2.2 },
            { id: 'it-6', foodName: 'Calabaza Asada', quantityGrams: 150, unit: 'g', category: 'Verdulería', calories: 45, proteinGrams: 1.5, carbsGrams: 9.7, fatsGrams: 0.1 }
          ]
        },
        {
          id: 'm-3',
          type: 'MERIENDA',
          title: 'Yogur Griego con Frutos Rojos y Nueces de Mendoza',
          timeHint: '17:30 hs',
          description: 'Merienda saciante con antioxidantes naturales.',
          items: [
            { id: 'it-7', foodName: 'Yogur Griego Natural', quantityGrams: 170, unit: 'g', category: 'Refrigerados', calories: 127, proteinGrams: 15.3, carbsGrams: 5.9, fatsGrams: 5.1 },
            { id: 'it-8', foodName: 'Frutos Rojos / Arándanos', quantityGrams: 80, unit: 'g', category: 'Verdulería', calories: 45, proteinGrams: 0.5, carbsGrams: 11.2, fatsGrams: 0.2 },
            { id: 'it-9', foodName: 'Nueces de Mendoza', quantityGrams: 20, unit: 'g', category: 'Almacén', calories: 130, proteinGrams: 3, carbsGrams: 2.7, fatsGrams: 13 }
          ]
        },
        {
          id: 'm-4',
          type: 'CENA',
          title: 'Filete de Merluza con Ensalada de Espinaca y Chía',
          timeHint: '21:30 hs',
          description: 'Cena ligera de rápida asimilación nocturna.',
          items: [
            { id: 'it-10', foodName: 'Filete de Merluza Fresca', quantityGrams: 180, unit: 'g', category: 'Carnicería', calories: 158, proteinGrams: 34.2, carbsGrams: 0, fatsGrams: 1.9 },
            { id: 'it-11', foodName: 'Espinaca Fresca', quantityGrams: 150, unit: 'g', category: 'Verdulería', calories: 34, proteinGrams: 4.3, carbsGrams: 5.4, fatsGrams: 0.6 }
          ]
        }
      ]
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const [patientsData, foodsData] = await Promise.all([
          api.getPatients(),
          api.getFoods()
        ]);
        setPatients(patientsData);
        setFoods(foodsData);
        if (!selectedPatientId && patientsData.length > 0) {
          setSelectedPatientId(patientsData[0].id);
        }
      } catch (err) {
        console.error('Error initializing diet creator:', err);
      }
    }
    init();
  }, []);

  // Compute calculated totals for active day
  const currentDay = daysPlan.find(d => d.dayOfWeek === activeDay) || daysPlan[0];
  const allItems = currentDay?.meals.flatMap(m => m.items) || [];
  const calculatedCalories = Math.round(allItems.reduce((acc, it) => acc + it.calories, 0));
  const calculatedProtein = Math.round(allItems.reduce((acc, it) => acc + it.proteinGrams, 0));
  const calculatedCarbs = Math.round(allItems.reduce((acc, it) => acc + it.carbsGrams, 0));
  const calculatedFats = Math.round(allItems.reduce((acc, it) => acc + it.fatsGrams, 0));

  // Add food to current active meal slot
  const handleAddFoodToMeal = (food: FoodItem) => {
    const defaultGrams = 100;
    const factor = defaultGrams / 100;

    const newItem = {
      id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodName: food.name,
      quantityGrams: defaultGrams,
      unit: 'g',
      category: food.category,
      calories: Math.round(food.caloriesPer100g * factor),
      proteinGrams: Math.round(food.proteinPer100g * factor),
      carbsGrams: Math.round(food.carbsPer100g * factor),
      fatsGrams: Math.round(food.fatsPer100g * factor)
    };

    setDaysPlan(prevDays => {
      return prevDays.map(day => {
        if (day.dayOfWeek !== activeDay) return day;

        let mealExists = day.meals.find(m => m.type === activeMealType);
        if (!mealExists) {
          mealExists = {
            id: `m-${Date.now()}`,
            type: activeMealType,
            title: `${activeMealType.charAt(0) + activeMealType.slice(1).toLowerCase().replace('_', ' ')} Nutritivo`,
            timeHint: activeMealType === 'DESAYUNO' ? '08:30 hs' : activeMealType === 'ALMUERZO' ? '13:00 hs' : activeMealType === 'MERIENDA' ? '17:30 hs' : '21:30 hs',
            description: 'Comida balanceada',
            items: []
          };
          day.meals.push(mealExists);
        }

        return {
          ...day,
          meals: day.meals.map(m => {
            if (m.type === activeMealType) {
              return { ...m, items: [...m.items, newItem] };
            }
            return m;
          })
        };
      });
    });
  };

  // Remove food item from meal slot
  const handleRemoveFoodItem = (mealType: string, itemId: string) => {
    setDaysPlan(prevDays => {
      return prevDays.map(day => {
        if (day.dayOfWeek !== activeDay) return day;
        return {
          ...day,
          meals: day.meals.map(m => {
            if (m.type === mealType) {
              return { ...m, items: m.items.filter(it => it.id !== itemId) };
            }
            return m;
          })
        };
      });
    });
  };

  // Update item grams
  const handleUpdateItemGrams = (mealType: string, itemId: string, newGrams: number) => {
    if (newGrams <= 0) return;
    setDaysPlan(prevDays => {
      return prevDays.map(day => {
        if (day.dayOfWeek !== activeDay) return day;
        return {
          ...day,
          meals: day.meals.map(m => {
            if (m.type === mealType) {
              return {
                ...m,
                items: m.items.map(it => {
                  if (it.id === itemId) {
                    const foodObj = foods.find(f => f.name === it.foodName);
                    const calPer100 = foodObj ? foodObj.caloriesPer100g : (it.calories / it.quantityGrams) * 100;
                    const protPer100 = foodObj ? foodObj.proteinPer100g : (it.proteinGrams / it.quantityGrams) * 100;
                    const carbsPer100 = foodObj ? foodObj.carbsPer100g : (it.carbsGrams / it.quantityGrams) * 100;
                    const fatsPer100 = foodObj ? foodObj.fatsPer100g : (it.fatsGrams / it.quantityGrams) * 100;
                    const factor = newGrams / 100;

                    return {
                      ...it,
                      quantityGrams: newGrams,
                      calories: Math.round(calPer100 * factor),
                      proteinGrams: Math.round(protPer100 * factor),
                      carbsGrams: Math.round(carbsPer100 * factor),
                      fatsGrams: Math.round(fatsPer100 * factor)
                    };
                  }
                  return it;
                })
              };
            }
            return m;
          })
        };
      });
    });
  };

  const handleSavePlan = async () => {
    if (!selectedPatientId) return;
    setSaving(true);
    setSuccessMsg('');

    try {
      await api.createOrUpdateMealPlan({
        patientId: selectedPatientId,
        title: planTitle,
        caloriesTarget: targetCalories,
        proteinGrams: targetProtein,
        carbsGrams: targetCarbs,
        fatsGrams: targetFats,
        notes: planNotes,
        days: daysPlan
      });

      setSuccessMsg('¡Plan nutricional asignado y sincronizado con éxito!');
      setTimeout(() => {
        router.push(`/pacientes/${selectedPatientId}`);
      }, 1200);
    } catch (err) {
      console.error('Error saving plan:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredFoods = foods.filter(f => {
    const matchCat = selectedCategory === 'TODOS' || f.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = !foodSearch || f.name.toLowerCase().includes(foodSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header 
        title="Creador Visual de Dietas" 
        subtitle="Prescripción inteligente por comidas, alimentos y balance de macronutrientes" 
      />

      <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Controls: Patient & Targets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Seleccionar Paciente Destinatario
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.plan} - {p.locality.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Título del Plan
              </label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Macro Target inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Calorías Objetivo (kcal)</label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-amber-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Proteínas (g)</label>
              <input
                type="number"
                value={targetProtein}
                onChange={(e) => setTargetProtein(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-blue-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Carbohidratos (g)</label>
              <input
                type="number"
                value={targetCarbs}
                onChange={(e) => setTargetCarbs(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-emerald-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Grasas (g)</label>
              <input
                type="number"
                value={targetFats}
                onChange={(e) => setTargetFats(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-purple-600 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Live Macro Gauge vs Targets */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shadow-sm">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Calorías del Día</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-amber-600">{calculatedCalories}</span>
              <span className="text-[11px] text-slate-500 font-mono">/ {targetCalories} kcal</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Proteínas Calculadas</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-blue-600">{calculatedProtein}g</span>
              <span className="text-[11px] text-slate-500 font-mono">/ {targetProtein}g</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Carbohidratos Calculados</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-emerald-600">{calculatedCarbs}g</span>
              <span className="text-[11px] text-slate-500 font-mono">/ {targetCarbs}g</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Grasas Calculadas</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-purple-600">{calculatedFats}g</span>
              <span className="text-[11px] text-slate-500 font-mono">/ {targetFats}g</span>
            </div>
          </div>
        </div>

        {/* Builder Work Area: Left (Day & Meals), Right (Food Catalog Library) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Day and Meal Slots Builder (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeDay === d
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Active Meal Type Selector for adding items */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-sm">
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Agregar alimentos a:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {(['DESAYUNO', 'ALMUERZO', 'MERIENDA', 'CENA'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveMealType(type)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      activeMealType === type
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Meals in the current day */}
            <div className="space-y-4">
              {currentDay?.meals.map(meal => (
                <div key={meal.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      {meal.type}
                    </span>
                    <span className="text-[11px] text-slate-500">{meal.items.length} alimentos</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {meal.items.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        Sin alimentos asignados. Selecciona alimentos del catálogo a la derecha.
                      </p>
                    ) : (
                      meal.items.map(it => (
                        <div key={it.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs hover:border-slate-200 transition-colors">
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-slate-800 block truncate">{it.foodName}</span>
                            <span className="text-[10px] text-slate-500">
                              {it.calories} kcal • P: {it.proteinGrams}g | C: {it.carbsGrams}g | G: {it.fatsGrams}g
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={10}
                                max={1000}
                                step={10}
                                value={it.quantityGrams}
                                onChange={(e) => handleUpdateItemGrams(meal.type, it.id, Number(e.target.value))}
                                className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 font-mono text-center shadow-sm"
                              />
                              <span className="text-slate-500 text-xs font-medium">{it.unit}</span>
                            </div>

                            <button
                              onClick={() => handleRemoveFoodItem(meal.type, it.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Searchable Food Library (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-500" />
                Catálogo de Alimentos (Mendoza)
              </h3>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-bold">
                Destino: {activeMealType}
              </span>
            </div>

            {/* Food Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pollo, avena, palta, merluza..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-emerald-500 shadow-inner"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {['TODOS', 'Carnicería', 'Verdulería', 'Almacén', 'Refrigerados'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food Cards List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredFoods.map(food => (
                <div
                  key={food.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-soft transition-all flex items-center justify-between text-xs group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                      {food.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="text-emerald-600 font-medium">{food.category}</span>
                      <span>• {food.caloriesPer100g} kcal/100g</span>
                      <span>• P: {food.proteinPer100g}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddFoodToMeal(food)}
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg border border-emerald-100 hover:border-transparent transition-all cursor-pointer shrink-0"
                    title={`Agregar a ${activeMealType}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            {successMsg ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <Check className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Al guardar, la dieta semanal se activará inmediatamente en la app del paciente.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/pacientes')}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSavePlan}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Prescribir & Guardar Dieta'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CrearDietaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-400 text-xs">Cargando creador de dietas...</div>}>
      <CrearDietaContent />
    </Suspense>
  );
}
