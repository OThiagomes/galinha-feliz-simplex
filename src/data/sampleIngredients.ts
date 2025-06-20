
import { Ingredient } from '@/types/nutrition';

export const sampleIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Milho',
    protein: 8.5,
    energy: 3380,
    calcium: 0.05,
    phosphorus: 0.28,
    lysine: 0.26,
    methionine: 0.18,
    fiber: 2.0,
    price: 0.85,
    minPercent: 40.0,
    maxPercent: 70.0
  },
  {
    id: '2',
    name: 'Farelo de Soja',
    protein: 45.0,
    energy: 2230,
    calcium: 0.25,
    phosphorus: 0.62,
    lysine: 2.85,
    methionine: 0.65,
    fiber: 3.2,
    price: 1.45,
    minPercent: 15.0,
    maxPercent: 35.0
  },
  {
    id: '3',
    name: 'Calcário Calcítico',
    protein: 0.0,
    energy: 0,
    calcium: 38.0,
    phosphorus: 0.0,
    lysine: 0.0,
    methionine: 0.0,
    fiber: 0.0,
    price: 0.12,
    minPercent: 8.0,
    maxPercent: 12.0
  },
  {
    id: '4',
    name: 'Fosfato Bicálcico',
    protein: 0.0,
    energy: 0,
    calcium: 23.0,
    phosphorus: 18.0,
    lysine: 0.0,
    methionine: 0.0,
    fiber: 0.0,
    price: 2.80,
    minPercent: 1.0,
    maxPercent: 2.5
  },
  {
    id: '5',
    name: 'Farelo de Trigo',
    protein: 16.0,
    energy: 1900,
    calcium: 0.12,
    phosphorus: 1.0,
    lysine: 0.65,
    methionine: 0.23,
    fiber: 10.0,
    price: 0.75,
    minPercent: 0.0,
    maxPercent: 15.0
  }
];
