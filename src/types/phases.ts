
export type NutritionalPhase = 
  | 'pre-inicial'
  | 'inicial' 
  | 'crescimento-1'
  | 'crescimento-2'
  | 'crescimento-3'
  | 'pre-postura'
  | 'postura-1'
  | 'postura-2'
  | 'postura-3'
  | 'postura-4'
  | 'postura-5'
  | 'custom';

export interface UniversalNutritionalRequirement {
  id: string;
  name: string;
  phase: NutritionalPhase;
  isCustom: boolean;
  
  // Energia
  minMetabolizableEnergy: number;
  maxMetabolizableEnergy: number;
  
  // Proteína
  minCrudeProtein: number;
  maxCrudeProtein: number;
  
  // Minerais
  minCalcium: number;
  maxCalcium: number;
  minAvailablePhosphorus: number;
  maxAvailablePhosphorus: number;
  
  // Aminoácidos
  minLysine: number;
  minMethionine: number;
  minThreonine?: number;
  minTryptophan?: number;
  
  // Outros
  maxCrudeFiber: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface IngredientConstraint {
  ingredientId: string;
  minPercentage?: number;
  maxPercentage?: number;
  fixedPercentage?: number;
  isLocked: boolean;
}

export interface FormulationSettings {
  clientId: string;
  requirementId: string;
  constraints: IngredientConstraint[];
}

export const PHASE_NAMES: Record<NutritionalPhase, string> = {
  'pre-inicial': 'Pré-Inicial',
  'inicial': 'Inicial',
  'crescimento-1': 'Crescimento 1',
  'crescimento-2': 'Crescimento 2', 
  'crescimento-3': 'Crescimento 3',
  'pre-postura': 'Pré-Postura',
  'postura-1': 'Postura 1',
  'postura-2': 'Postura 2',
  'postura-3': 'Postura 3',
  'postura-4': 'Postura 4',
  'postura-5': 'Postura 5',
  'custom': 'Personalizado'
};
