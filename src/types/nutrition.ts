
export interface Ingredient {
  id: string;
  name: string;
  protein: number; // %
  energy: number; // kcal/kg
  calcium: number; // %
  phosphorus: number; // %
  lysine: number; // %
  methionine: number; // %
  fiber: number; // %
  price: number; // R$/kg
  minPercent: number; // % mínimo na ração
  maxPercent: number; // % máximo na ração
}

export interface NutritionalRequirement {
  minProtein: number;
  maxProtein: number;
  minEnergy: number;
  maxEnergy: number;
  minCalcium: number;
  maxCalcium: number;
  minPhosphorus: number;
  maxPhosphorus: number;
  minLysine: number;
  maxLysine: number;
  minMethionine: number;
  maxMethionine: number;
  maxFiber: number;
}

export interface FormulationResult {
  ingredients: Array<{
    ingredient: Ingredient;
    percentage: number;
    cost: number;
  }>;
  totalCost: number;
  nutritionalProfile: {
    protein: number;
    energy: number;
    calcium: number;
    phosphorus: number;
    lysine: number;
    methionine: number;
    fiber: number;
  };
  feasible: boolean;
  message?: string;
}
