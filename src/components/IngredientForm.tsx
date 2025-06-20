
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Ingredient } from '@/types/nutrition';

interface IngredientFormProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ ingredients, onIngredientsChange }) => {
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    protein: 0,
    energy: 0,
    calcium: 0,
    phosphorus: 0,
    lysine: 0,
    methionine: 0,
    fiber: 0,
    price: 0,
    minPercent: 0,
    maxPercent: 100,
  });

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.price) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.name,
        protein: newIngredient.protein || 0,
        energy: newIngredient.energy || 0,
        calcium: newIngredient.calcium || 0,
        phosphorus: newIngredient.phosphorus || 0,
        lysine: newIngredient.lysine || 0,
        methionine: newIngredient.methionine || 0,
        fiber: newIngredient.fiber || 0,
        price: newIngredient.price || 0,
        minPercent: newIngredient.minPercent || 0,
        maxPercent: newIngredient.maxPercent || 100,
      };
      
      onIngredientsChange([...ingredients, ingredient]);
      setNewIngredient({
        name: '',
        protein: 0,
        energy: 0,
        calcium: 0,
        phosphorus: 0,
        lysine: 0,
        methionine: 0,
        fiber: 0,
        price: 0,
        minPercent: 0,
        maxPercent: 100,
      });
    }
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter(ing => ing.id !== id));
  };

  const loadDefaultIngredients = () => {
    const defaultIngredients: Ingredient[] = [
      {
        id: '1',
        name: 'Milho',
        protein: 8.5,
        energy: 3300,
        calcium: 0.02,
        phosphorus: 0.28,
        lysine: 0.26,
        methionine: 0.18,
        fiber: 2.2,
        price: 0.65,
        minPercent: 0,
        maxPercent: 70,
      },
      {
        id: '2',
        name: 'Farelo de Soja',
        protein: 45.0,
        energy: 2230,
        calcium: 0.25,
        phosphorus: 0.65,
        lysine: 2.85,
        methionine: 0.65,
        fiber: 7.0,
        price: 1.20,
        minPercent: 15,
        maxPercent: 35,
      },
      {
        id: '3',
        name: 'Calcário Calcítico',
        protein: 0,
        energy: 0,
        calcium: 38.0,
        phosphorus: 0,
        lysine: 0,
        methionine: 0,
        fiber: 0,
        price: 0.15,
        minPercent: 0,
        maxPercent: 12,
      },
      {
        id: '4',
        name: 'Fosfato Bicálcico',
        protein: 0,
        energy: 0,
        calcium: 23.0,
        phosphorus: 18.0,
        lysine: 0,
        methionine: 0,
        fiber: 0,
        price: 2.80,
        minPercent: 0,
        maxPercent: 3,
      },
      {
        id: '5',
        name: 'Farinha de Carne e Ossos',
        protein: 40.0,
        energy: 2000,
        calcium: 10.0,
        phosphorus: 5.0,
        lysine: 2.2,
        methionine: 0.7,
        fiber: 2.5,
        price: 1.80,
        minPercent: 0,
        maxPercent: 8,
      },
    ];
    
    onIngredientsChange(defaultIngredients);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-green-700">Ingredientes Disponíveis</span>
          <Button 
            onClick={loadDefaultIngredients} 
            variant="outline" 
            size="sm"
            className="bg-green-50 hover:bg-green-100"
          >
            Carregar Ingredientes Padrão
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Formulário para adicionar novo ingrediente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              placeholder="Ex: Milho"
            />
          </div>
          <div>
            <Label htmlFor="protein">Proteína (%)</Label>
            <Input
              id="protein"
              type="number"
              step="0.1"
              value={newIngredient.protein}
              onChange={(e) => setNewIngredient({ ...newIngredient, protein: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="energy">Energia (kcal/kg)</Label>
            <Input
              id="energy"
              type="number"
              value={newIngredient.energy}
              onChange={(e) => setNewIngredient({ ...newIngredient, energy: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="calcium">Cálcio (%)</Label>
            <Input
              id="calcium"
              type="number"
              step="0.01"
              value={newIngredient.calcium}
              onChange={(e) => setNewIngredient({ ...newIngredient, calcium: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="phosphorus">Fósforo (%)</Label>
            <Input
              id="phosphorus"
              type="number"
              step="0.01"
              value={newIngredient.phosphorus}
              onChange={(e) => setNewIngredient({ ...newIngredient, phosphorus: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="lysine">Lisina (%)</Label>
            <Input
              id="lysine"
              type="number"
              step="0.01"
              value={newIngredient.lysine}
              onChange={(e) => setNewIngredient({ ...newIngredient, lysine: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="methionine">Metionina (%)</Label>
            <Input
              id="methionine"
              type="number"
              step="0.01"
              value={newIngredient.methionine}
              onChange={(e) => setNewIngredient({ ...newIngredient, methionine: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="fiber">Fibra (%)</Label>
            <Input
              id="fiber"
              type="number"
              step="0.1"
              value={newIngredient.fiber}
              onChange={(e) => setNewIngredient({ ...newIngredient, fiber: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="price">Preço (R$/kg)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={newIngredient.price}
              onChange={(e) => setNewIngredient({ ...newIngredient, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="minPercent">Mín (%)</Label>
            <Input
              id="minPercent"
              type="number"
              step="0.1"
              value={newIngredient.minPercent}
              onChange={(e) => setNewIngredient({ ...newIngredient, minPercent: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="maxPercent">Máx (%)</Label>
            <Input
              id="maxPercent"
              type="number"
              step="0.1"
              value={newIngredient.maxPercent}
              onChange={(e) => setNewIngredient({ ...newIngredient, maxPercent: parseFloat(e.target.value) || 100 })}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addIngredient} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de ingredientes */}
        <div className="space-y-2">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 flex-1 text-sm">
                <div className="font-medium text-green-700">{ingredient.name}</div>
                <div>Prot: {ingredient.protein}%</div>
                <div>Energia: {ingredient.energy}</div>
                <div>Ca: {ingredient.calcium}%</div>
                <div>P: {ingredient.phosphorus}%</div>
                <div>Lys: {ingredient.lysine}%</div>
                <div>Met: {ingredient.methionine}%</div>
                <div>R$ {ingredient.price.toFixed(2)}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeIngredient(ingredient.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientForm;
