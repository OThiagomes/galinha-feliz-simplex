
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  ingredients: ClientIngredient[];
}

export interface ClientIngredient {
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
  availability: boolean;
  notes?: string;
}

export interface ClientFormulation {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  date: string;
  result: any; // FormulationResult
  ingredients: ClientIngredient[];
}
