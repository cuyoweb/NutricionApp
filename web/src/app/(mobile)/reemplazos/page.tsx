'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRightLeft, 
  ChefHat, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { mobileApi } from '../../../lib/api';
import { FoodSubstitutionResponse } from '../../../types';

function ReemplazosContent() {
  const searchParams = useSearchParams();
  const initialFood = searchParams.get('food') || 'Pechuga de Pollo';
  const initialGrams = Number(searchParams.get('grams')) || 150;

  const [originalFood, setOriginalFood] = useState(initialFood);
  const [originalGrams, setOriginalGrams] = useState(initialGrams);
  const [targetFood, setTargetFood] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodSubstitutionResponse | null>(null);

  const quickOptions = [
    { label: '🍗 Pechuga Pollo (150g)', food: 'Pechuga de Pollo', grams: 150 },
    { label: '🍚 Arroz Blanco (100g)', food: 'Arroz Blanco Cocido', grams: 100 },
    { label: '🍞 Pan Masa Madre (70g)', food: 'Pan de Masa Madre', grams: 70 },
    { label: '🥑 Palta Hass (50g)', food: 'Palta Hass', grams: 50 },
    { label: '🥛 Yogur Griego (170g)', food: 'Yogur Griego Natural', grams: 170 }
  ];

  const handleCalculate = async (foodName = originalFood, grams = originalGrams, target = targetFood) => {
    setLoading(true);
    try {
      const res = await mobileApi.substituteFood({
        originalFood: foodName,
        originalGrams: grams,
        targetFood: target || undefined
      });
      setResult(res);
    } catch (err) {
      console.error('Error in AI substitution:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate(initialFood, initialGrams);
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-5 rounded-3xl border border-emerald-200 shadow-soft">
        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Inteligencia Nutricional</span>
        </div>
        <h2 className="text-base font-bold text-slate-800">Calculadora de Reemplazos</h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          ¿No tenés un ingrediente? Calculá la porción exacta para no alterar tus calorías ni nutrientes.
        </p>
      </div>

      {/* Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setOriginalFood(opt.food);
              setOriginalGrams(opt.grams);
              handleCalculate(opt.food, opt.grams);
            }}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition-colors cursor-pointer shadow-xs"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3.5">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alimento a reemplazar
            </label>
            <input
              type="text"
              value={originalFood}
              onChange={(e) => setOriginalFood(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="ej: Pechuga de Pollo"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gramos (g)
            </label>
            <input
              type="number"
              value={originalGrams}
              onChange={(e) => setOriginalGrams(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-800 font-bold text-center"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Reemplazo sugerido (Opcional)
          </label>
          <input
            type="text"
            value={targetFood}
            onChange={(e) => setTargetFood(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="ej: Filete de Merluza, Tofu, Batata..."
          />
        </div>

        <button
          onClick={() => handleCalculate()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-green-glow transition-all active:scale-95 cursor-pointer text-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Calculando con IA...' : 'Calcular Equivalencia'}</span>
        </button>
      </div>

      {/* Result Comparison Card */}
      {result && (
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-emerald-200 space-y-3.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-center flex-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Original</span>
              <span className="text-xs font-bold text-slate-800 block truncate mt-0.5">{result.originalFood}</span>
              <span className="text-xs font-bold text-slate-600">{result.originalGrams}g</span>
            </div>

            <div className="p-2.5 rounded-full bg-white text-emerald-700 shadow-xs shrink-0 mx-2">
              <ArrowRightLeft className="w-4 h-4" />
            </div>

            <div className="text-center flex-1">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Equivalente IA</span>
              <span className="text-xs font-bold text-emerald-900 block truncate mt-0.5">{result.substituteFood}</span>
              <span className="text-sm font-black text-white bg-emerald-600 px-2.5 py-0.5 rounded-lg inline-block shadow-xs mt-0.5">
                {result.substituteGrams}g
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <p className="text-slate-700 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-xs flex items-start gap-2.5">
            <ChefHat className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block">Consejo Saludable</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                {result.cookingTip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReemplazosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Cargando asistente...</div>}>
      <ReemplazosContent />
    </Suspense>
  );
}
