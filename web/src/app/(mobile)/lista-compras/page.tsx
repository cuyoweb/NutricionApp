'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Check, 
  RotateCcw, 
  Apple, 
  Beef, 
  Package, 
  Milk,
  Store,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../lib/mobileAuthContext';

interface CategorizedGroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: 'Verdulería' | 'Almacén' | 'Carnicería' | 'Refrigerados';
  checked: boolean;
}

export default function ListaComprasPage() {
  const { activePlan } = useAuth();
  const [items, setItems] = useState<CategorizedGroceryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');

  // Consolidate ingredients dynamically from active plan
  useEffect(() => {
    if (activePlan) {
      const map: Record<string, { totalGrams: number; unit: string; category: string }> = {};

      activePlan.days.forEach(day => {
        day.meals.forEach(meal => {
          meal.items.forEach(it => {
            let cat: any = it.category;
            if (!['Verdulería', 'Almacén', 'Carnicería', 'Refrigerados'].includes(cat)) {
              cat = 'Almacén';
            }

            if (!map[it.foodName]) {
              map[it.foodName] = {
                totalGrams: 0,
                unit: it.unit || 'g',
                category: cat
              };
            }
            map[it.foodName].totalGrams += it.quantityGrams;
          });
        });
      });

      const consolidated: CategorizedGroceryItem[] = Object.entries(map).map(([foodName, data], index) => ({
        id: `groc-${index}`,
        name: foodName,
        quantity: data.totalGrams >= 1000 ? `${(data.totalGrams / 1000).toFixed(1)} kg` : `${data.totalGrams} ${data.unit}`,
        category: data.category as any,
        checked: false
      }));

      if (consolidated.length > 0) {
        setItems(consolidated);
      } else {
        setItems([
          { id: '1', name: 'Palta Hass de Mendoza', quantity: '500 g', category: 'Verdulería', checked: false },
          { id: '2', name: 'Frutos Rojos / Arándanos', quantity: '300 g', category: 'Verdulería', checked: false },
          { id: '3', name: 'Calabaza & Espinaca', quantity: '1 kg', category: 'Verdulería', checked: false },
          { id: '4', name: 'Pechuga de Pollo', quantity: '1.2 kg', category: 'Carnicería', checked: true },
          { id: '5', name: 'Filete de Merluza', quantity: '800 g', category: 'Carnicería', checked: false },
          { id: '6', name: 'Huevos de Campo', quantity: '1 docena', category: 'Refrigerados', checked: true },
          { id: '7', name: 'Yogur Griego Natural', quantity: '4 potes', category: 'Refrigerados', checked: false },
          { id: '8', name: 'Pan de Masa Madre', quantity: '1 molde', category: 'Almacén', checked: false },
          { id: '9', name: 'Quinoa Real', quantity: '500 g', category: 'Almacén', checked: false },
          { id: '10', name: 'Nueces de Mendoza', quantity: '200 g', category: 'Almacén', checked: false }
        ]);
      }
    }
  }, [activePlan]);

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleReset = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: false })));
  };

  const categories = ['TODOS', 'Verdulería', 'Carnicería', 'Almacén', 'Refrigerados'];
  const filtered = items.filter(i => selectedCategory === 'TODOS' || i.category === selectedCategory);

  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

  const categoryIcons: Record<string, string> = {
    Verdulería: '🥦',
    Carnicería: '🥩',
    Almacén: '🌾',
    Refrigerados: '🥛',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" /> Supermercado
            </span>
            <h2 className="text-base font-bold text-slate-800 mt-0.5">Lista de Compras</h2>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors cursor-pointer"
            title="Desmarcar todo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500">Comprados</span>
            <span className="font-bold text-emerald-700">
              {checkedCount} de {items.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const emoji = categoryIcons[cat] || '🛒';
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-green-glow'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{emoji}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
              item.checked
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                  item.checked
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              <div className="min-w-0">
                <span className={`text-xs font-bold block truncate ${
                  item.checked ? 'line-through text-slate-400' : 'text-slate-800'
                }`}>
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {item.category}
                </span>
              </div>
            </div>

            <span className={`text-xs font-bold px-2.5 py-1 rounded-xl shrink-0 ml-2 ${
              item.checked ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
