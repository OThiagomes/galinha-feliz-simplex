
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  ingredients: ClientIngredient[];
  nutritionalProfiles?: string[]; // IDs dos perfis nutricionais associados
}

export interface ClientIngredient {
  id: string;
  name: string;
  
  // Informações básicas
  category: 'cereais' | 'oleaginosas' | 'subprodutos' | 'aditivos' | 'minerais' | 'vitaminas' | 'outros';
  origin: 'nacional' | 'importado';
  
  // Energia
  metabolizableEnergy: number; // kcal/kg
  
  // Proteína e aminoácidos principais
  crudeProtein: number; // %
  lysine: number; // %
  methionine: number; // %
  
  // Minerais principais
  calcium: number; // %
  availablePhosphorus: number; // %
  
  // Outros componentes
  crudeFiber: number; // %
  
  // Parâmetros econômicos e técnicos
  currentPrice: number; // R$/kg
  minInclusion: number; // %
  maxInclusion: number; // %
  
  // Status
  availability: boolean;
  notes?: string;
  
  // Campos opcionais para informações completas
  scientificName?: string;
  grossEnergy?: number;
  digestibleEnergy?: number;
  digestibleProtein?: number;
  
  // Aminoácidos adicionais
  threonine?: number;
  tryptophan?: number;
  arginine?: number;
  valine?: number;
  isoleucine?: number;
  leucine?: number;
  histidine?: number;
  phenylalanineTyrosine?: number;
  
  // Minerais adicionais
  totalPhosphorus?: number;
  sodium?: number;
  potassium?: number;
  magnesium?: number;
  
  // Microminerais
  iron?: number;
  zinc?: number;
  manganese?: number;
  copper?: number;
  
  // Vitaminas
  vitaminA?: number;
  vitaminD3?: number;
  vitaminE?: number;
  
  // Outros componentes
  neutralDetergentFiber?: number;
  acidDetergentFiber?: number;
  etherExtract?: number;
  dryMatter?: number;
  
  // Parâmetros de qualidade
  digestibility?: number;
  palatability?: number;
  
  // Informações econômicas
  freight?: number;
  additionalCosts?: number;
  supplier?: string;
}

export interface ClientFormulation {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  date: string;
  result: any; // FormulationResult
  ingredients: ClientIngredient[];
  nutritionalProfile?: any; // NutritionalRequirement usado
}
