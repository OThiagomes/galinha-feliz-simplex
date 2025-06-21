
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
    crudeProtein: 0,
    metabolizableEnergy: 0,
    calcium: 0,
    availablePhosphorus: 0,
    lysine: 0,
    methionine: 0,
    crudeFiber: 0,
    currentPrice: 0,
    minInclusion: 0,
    maxInclusion: 100,
  });

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.currentPrice) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.name,
        category: 'outros',
        origin: 'nacional',
        metabolizableEnergy: newIngredient.metabolizableEnergy || 0,
        crudeProtein: newIngredient.crudeProtein || 0,
        lysine: newIngredient.lysine || 0,
        methionine: newIngredient.methionine || 0,
        calcium: newIngredient.calcium || 0,
        availablePhosphorus: newIngredient.availablePhosphorus || 0,
        crudeFiber: newIngredient.crudeFiber || 0,
        currentPrice: newIngredient.currentPrice || 0,
        minInclusion: newIngredient.minInclusion || 0,
        maxInclusion: newIngredient.maxInclusion || 100,
      };
      
      onIngredientsChange([...ingredients, ingredient]);
      setNewIngredient({
        name: '',
        crudeProtein: 0,
        metabolizableEnergy: 0,
        calcium: 0,
        availablePhosphorus: 0,
        lysine: 0,
        methionine: 0,
        crudeFiber: 0,
        currentPrice: 0,
        minInclusion: 0,
        maxInclusion: 100,
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
        category: 'cereais',
        origin: 'nacional',
        metabolizableEnergy: 3300,
        crudeProtein: 8.5,
        lysine: 0.26,
        methionine: 0.18,
        calcium: 0.02,
        availablePhosphorus: 0.28,
        crudeFiber: 2.2,
        currentPrice: 0.65,
        minInclusion: 0,
        maxInclusion: 70,
      },
      {
        id: '2',
        name: 'Farelo de Soja',
        category: 'oleaginosas',
        origin: 'nacional',
        metabolizableEnergy: 2230,
        crudeProtein: 45.0,
        lysine: 2.85,
        methionine: 0.65,
        calcium: 0.25,
        availablePhosphorus: 0.65,
        crudeFiber: 7.0,
        currentPrice: 1.20,
        minInclusion: 15,
        maxInclusion: 35,
      },
      {
        id: '3',
        name: 'Calcário Calcítico',
        category: 'minerais',
        origin: 'nacional',
        metabolizableEnergy: 0,
        crudeProtein: 0,
        lysine: 0,
        methionine: 0,
        calcium: 38.0,
        availablePhosphorus: 0,
        crudeFiber: 0,
        currentPrice: 0.15,
        minInclusion: 0,
        maxInclusion: 12,
      },
      {
        id: '4',
        name: 'Fosfato Bicálcico',
        category: 'minerais',
        origin: 'nacional',
        metabolizableEnergy: 0,
        crudeProtein: 0,
        lysine: 0,
        methionine: 0,
        calcium: 23.0,
        availablePhosphorus: 18.0,
        crudeFiber: 0,
        currentPrice: 2.80,
        minInclusion: 0,
        maxInclusion: 3,
      },
      {
        id: '5',
        name: 'Farinha de Carne e Ossos',
        category: 'subprodutos',
        origin: 'nacional',
        metabolizableEnergy: 2000,
        crudeProtein: 40.0,
        lysine: 2.2,
        methionine: 0.7,
        calcium: 10.0,
        availablePhosphorus: 5.0,
        crudeFiber: 2.5,
        currentPrice: 1.80,
        minInclusion: 0,
        maxInclusion: 8,
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
            <Label htmlFor="crudeProtein">Proteína (%)</Label>
            <Input
              id="crudeProtein"
              type="number"
              step="0.1"
              value={newIngredient.crudeProtein}
              onChange={(e) => setNewIngredient({ ...newIngredient, crudeProtein: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="metabolizableEnergy">Energia (kcal/kg)</Label>
            <Input
              id="metabolizableEnergy"
              type="number"
              value={newIngredient.metabolizableEnergy}
              onChange={(e) => setNewIngredient({ ...newIngredient, metabolizableEnergy: parseInt(e.target.value) || 0 })}
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
            <Label htmlFor="availablePhosphorus">Fósforo (%)</Label>
            <Input
              id="availablePhosphorus"
              type="number"
              step="0.01"
              value={newIngredient.availablePhosphorus}
              onChange={(e) => setNewIngredient({ ...newIngredient, availablePhosphorus: parseFloat(e.target.value) || 0 })}
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
            <Label htmlFor="crudeFiber">Fibra (%)</Label>
            <Input
              id="crudeFiber"
              type="number"
              step="0.1"
              value={newIngredient.crudeFiber}
              onChange={(e) => setNewIngredient({ ...newIngredient, crudeFiber: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="currentPrice">Preço (R$/kg)</Label>
            <Input
              id="currentPrice"
              type="number"
              step="0.01"
              value={newIngredient.currentPrice}
              onChange={(e) => setNewIngredient({ ...newIngredient, currentPrice: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="minInclusion">Mín (%)</Label>
            <Input
              id="minInclusion"
              type="number"
              step="0.1"
              value={newIngredient.minInclusion}
              onChange={(e) => setNewIngredient({ ...newIngredient, minInclusion: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="maxInclusion">Máx (%)</Label>
            <Input
              id="maxInclusion"
              type="number"
              step="0.1"
              value={newIngredient.maxInclusion}
              onChange={(e) => setNewIngredient({ ...newIngredient, maxInclusion: parseFloat(e.target.value) || 100 })}
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
                <div>Prot: {ingredient.crudeProtein}%</div>
                <div>Energia: {ingredient.metabolizableEnergy}</div>
                <div>Ca: {ingredient.calcium}%</div>
                <div>P: {ingredient.availablePhosphorus}%</div>
                <div>Lys: {ingredient.lysine}%</div>
                <div>Met: {ingredient.methionine}%</div>
                <div>R$ {ingredient.currentPrice.toFixed(2)}</div>
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
