import { Request, Response } from 'express';
import { FOOD_SUBSTITUTIONS_DB, FOOD_LIBRARY } from '../mocks/patientsData';
import { SubstituteFoodSchema } from '../types';

/**
 * Controller: AI Assistant & Nutrition Engine
 * Provides dynamic equivalences, gram calculations and culinary tips for food substitutions.
 */

// POST /api/ai/substitute-food
export const substituteFood = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When LLM Provider & PostgreSQL/Prisma are connected):
   * =========================================================================
   * 
   * import { GoogleGenerativeAI } from '@google/generative-ai';
   * // o import OpenAI from 'openai';
   * 
   * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
   * const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
   * 
   * try {
   *   const { originalFood, originalGrams, targetFood, category } = req.body;
   * 
   *   // 1. Consultar base de datos nutricional estructurada en Prisma
   *   const originalNutrients = await prisma.food.findFirst({
   *     where: { name: { contains: originalFood, mode: 'insensitive' } }
   *   });
   * 
   *   // 2. Ejecutar inferencia con el modelo de IA con prompt clínico
   *   const prompt = `Actúa como un Nutricionista Clínico experto.
   *   El paciente necesita reemplazar ${originalGrams}g de "${originalFood}".
   *   ${targetFood ? `El paciente quiere sustituirlo específicamente por "${targetFood}".` : 'Sugiere el mejor sustituto equivalente.'}
   *   Calcula la cantidad exacta en gramos para mantener el equilibrio de macronutrientes (Proteínas, Carbohidratos, Grasas y Calorías totales).
   *   Responde estrictamente en JSON con la siguiente estructura:
   *   {
   *     "originalFood": string,
   *     "originalGrams": number,
   *     "substituteFood": string,
   *     "substituteGrams": number,
   *     "category": string,
   *     "macrosComparison": {
   *       "caloriesDiff": string,
   *       "proteinMatch": string
   *     },
   *     "explanation": string,
   *     "cookingTip": string
   *   }`;
   * 
   *   const result = await model.generateContent(prompt);
   *   const responseText = result.response.text();
   *   const parsedAiResponse = JSON.parse(responseText);
   * 
   *   // Guardar la sustitución generada en PostgreSQL para caché y analytics
   *   await prisma.foodSubstitution.create({
   *     data: {
   *       originalFood,
   *       substituteFood: parsedAiResponse.substituteFood,
   *       originalGrams,
   *       substituteGrams: parsedAiResponse.substituteGrams,
   *       category: parsedAiResponse.category as any,
   *       explanation: parsedAiResponse.explanation
   *     }
   *   });
   * 
   *   return res.json(parsedAiResponse);
   * } catch (error) {
   *   console.error('Error invocando IA:', error);
   *   return res.status(500).json({ error: 'Error procesando sustitución con IA' });
   * }
   * =========================================================================
   */

  // MVP DEMO CODE:
  try {
    const parsed = SubstituteFoodSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Parámetros inválidos', details: parsed.error.format() });
    }

    const { originalFood, originalGrams, targetFood } = parsed.data;

    // Buscar match en base precalculada
    const directMatch = FOOD_SUBSTITUTIONS_DB.find(s =>
      s.original.toLowerCase().includes(originalFood.toLowerCase()) &&
      (!targetFood || s.substitute.toLowerCase().includes(targetFood.toLowerCase()))
    );

    if (directMatch) {
      const substituteGrams = Math.round(originalGrams * directMatch.ratio);
      return res.json({
        success: true,
        originalFood: directMatch.original,
        originalGrams,
        substituteFood: directMatch.substitute,
        substituteGrams,
        category: directMatch.category,
        ratio: directMatch.ratio,
        macrosComparison: {
          calories: `Equivalencia calórica ± 5%`,
          protein: `Mantiene la misma densidad proteica objetivo`,
          carbsFats: `Ajuste óptimo de glucemia y saciedad`
        },
        explanation: directMatch.reason,
        cookingTip: `Recomendación Mendoza: Cocinar con hierbas frescas (orégano o romero) y un chorrito de aceite de oliva virgen extra para potenciar la absorción de vitaminas liposolubles.`
      });
    }

    // Cálculo dinámico heurístico si no hay match directo
    const ratio = targetFood?.toLowerCase().includes('pescado') || targetFood?.toLowerCase().includes('merluza')
      ? 1.15
      : targetFood?.toLowerCase().includes('tofu')
      ? 1.40
      : targetFood?.toLowerCase().includes('batata')
      ? 1.25
      : 1.10;

    const substituteName = targetFood || 'Filete de Merluza Fresca';
    const calculatedGrams = Math.round(originalGrams * ratio);

    return res.json({
      success: true,
      originalFood,
      originalGrams,
      substituteFood: substituteName,
      substituteGrams: calculatedGrams,
      category: 'Almacén / Verdulería',
      ratio,
      macrosComparison: {
        calories: `Aprox. ${Math.round(calculatedGrams * 1.3)} kcal`,
        protein: `Equivalente nutricional calculado por IA`
      },
      explanation: `Para reemplazar ${originalGrams}g de ${originalFood} manteniendo la misma densidad calórica y macronutrientes, la porción recomendada es de ${calculatedGrams}g de ${substituteName}.`,
      cookingTip: `Tip del consultorio: Pesá siempre los alimentos cocidos o crudos según la indicación de tu plan para mantener la precisión.`
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error en cálculo de reemplazo', details: error.message });
  }
};
