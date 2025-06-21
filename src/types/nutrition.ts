
export interface Ingredient {
  id: string;
  
  // Informações Básicas
  name: string;
  scientificName?: string;
  internalCode?: string;
  sindiracaoCode?: string;
  category: 'cereais' | 'oleaginosas' | 'subprodutos' | 'aditivos' | 'minerais' | 'vitaminas' | 'outros';
  origin: 'nacional' | 'importado';
  mainSupplier?: string;
  alternativeSuppliers?: string[];
  seasonality?: string;
  regionalAvailability?: string;

  // Energia
  metabolizableEnergy: number; // kcal/kg
  grossEnergy?: number; // kcal/kg
  digestibleEnergy?: number; // kcal/kg

  // Proteínas e Aminoácidos
  crudeProtein: number; // %
  digestibleProtein?: number; // %
  
  // Aminoácidos Essenciais Digestíveis (%)
  lysine: number;
  methionine: number;
  methionineCystine?: number;
  threonine?: number;
  tryptophan?: number;
  arginine?: number;
  valine?: number;
  isoleucine?: number;
  leucine?: number;
  histidine?: number;
  phenylalanineTyrosine?: number;

  // Minerais (%)
  calcium: number;
  totalPhosphorus?: number;
  availablePhosphorus: number;
  sodium?: number;
  potassium?: number;
  magnesium?: number;
  chlorine?: number;
  sulfur?: number;

  // Microminerais (mg/kg)
  iron?: number;
  zinc?: number;
  manganese?: number;
  copper?: number;
  iodine?: number;
  selenium?: number;

  // Vitaminas
  vitaminA?: number; // UI/kg
  vitaminD3?: number; // UI/kg
  vitaminE?: number; // mg/kg
  vitaminK?: number; // mg/kg
  thiamine?: number; // mg/kg
  riboflavin?: number; // mg/kg
  niacin?: number; // mg/kg
  pantothenicAcid?: number; // mg/kg
  pyridoxine?: number; // mg/kg
  biotin?: number; // mcg/kg
  folicAcid?: number; // mg/kg
  cobalamin?: number; // mcg/kg
  choline?: number; // mg/kg

  // Outros Componentes (%)
  crudeFiber: number;
  neutralDetergentFiber?: number;
  acidDetergentFiber?: number;
  etherExtract?: number;
  dryMatter?: number;
  mineralMatter?: number;
  nitrogenFreeExtract?: number;

  // Parâmetros Econômicos
  currentPrice: number; // R$/kg
  priceHistory?: Array<{ date: string; price: number }>;
  minHistoricalPrice?: number;
  maxHistoricalPrice?: number;
  freight?: number;
  additionalCosts?: number;

  // Limitações Técnicas
  minInclusion: number; // %
  maxInclusion: number; // %
  incompatibilities?: string[];
  processingFactors?: number;
  density?: number; // kg/m³
  granulometry?: string;
  maxMoisture?: number; // %

  // Fatores de Qualidade
  digestibility?: number; // %
  palatability?: number; // 1-10
  antinutritionalFactors?: string[];
  possibleContaminants?: string[];
  shelfLife?: number; // dias
  storageConditions?: string;
}

export interface NutritionalRequirement {
  // Identificação
  profileName: string;
  strain?: 'hy-line-w36' | 'lohmann-lsl' | 'bovans-white' | 'hy-line-brown' | 'lohmann-brown' | 'isa-brown' | 'caipira' | 'colonial';
  phase: 'pre-lay' | 'early-lay' | 'peak-lay' | 'post-peak' | 'end-lay';
  ageWeeks?: { min: number; max: number };

  // Energia
  minMetabolizableEnergy: number; // kcal/kg
  maxMetabolizableEnergy: number; // kcal/kg

  // Proteína
  minCrudeProtein: number; // %
  maxCrudeProtein: number; // %

  // Aminoácidos Digestíveis
  minLysine: number; // %
  maxLysine?: number; // %
  minMethionine: number; // %
  maxMethionine?: number; // %
  minMethionineCystine?: number; // %
  maxMethionineCystine?: number; // %
  minThreonine?: number; // %
  maxThreonine?: number; // %
  minTryptophan?: number; // %
  maxTryptophan?: number; // %

  // Minerais
  minCalcium: number; // %
  maxCalcium: number; // %
  minAvailablePhosphorus: number; // %
  maxAvailablePhosphorus: number; // %
  minSodium?: number; // %
  maxSodium?: number; // %

  // Outros
  maxCrudeFiber?: number; // %
  minLinoleicAcid?: number; // %

  // Ajustes Ambientais
  temperatureAdjustment?: number; // fator multiplicador
  humidityAdjustment?: number;
  altitudeAdjustment?: number;
  housingSystem?: 'cage' | 'floor' | 'free-range';
}

export interface FormulationResult {
  ingredients: Array<{
    ingredient: Ingredient;
    percentage: number;
    cost: number;
  }>;
  totalCost: number;
  nutritionalProfile: {
    metabolizableEnergy: number;
    crudeProtein: number;
    calcium: number;
    availablePhosphorus: number;
    lysine: number;
    methionine: number;
    crudeFiber: number;
    [key: string]: number;
  };
  feasible: boolean;
  message?: string;
  optimizationType?: 'min-cost' | 'max-margin' | 'best-conversion' | 'multi-objective' | 'sustainability';
  performanceMetrics?: {
    feedConversion?: number;
    eggProduction?: number;
    eggWeight?: number;
    mortality?: number;
  };
}

// Interfaces para compatibilidade com o sistema atual
export interface LegacyIngredient {
  id: string;
  name: string;
  protein: number;
  energy: number;
  calcium: number;
  phosphorus: number;
  lysine: number;
  methionine: number;
  fiber: number;
  price: number;
  minPercent: number;
  maxPercent: number;
}

export interface LegacyNutritionalRequirement {
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
