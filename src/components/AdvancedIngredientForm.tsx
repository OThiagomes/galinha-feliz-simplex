
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Ingredient } from '@/types/nutrition';
import { toast } from '@/hooks/use-toast';

interface AdvancedIngredientFormProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

const AdvancedIngredientForm: React.FC<AdvancedIngredientFormProps> = ({
  ingredients,
  onIngredientsChange
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const createNewIngredient = (): Ingredient => ({
    id: Date.now().toString(),
    name: '',
    category: 'cereais',
    origin: 'nacional',
    metabolizableEnergy: 0,
    crudeProtein: 0,
    lysine: 0,
    methionine: 0,
    calcium: 0,
    availablePhosphorus: 0,
    crudeFiber: 0,
    currentPrice: 0,
    minInclusion: 0,
    maxInclusion: 100
  });

  const handleAddIngredient = () => {
    const newIngredient = createNewIngredient();
    setSelectedIngredient(newIngredient);
    setActiveTab('basic');
  };

  const handleSaveIngredient = () => {
    if (!selectedIngredient || !selectedIngredient.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do ingrediente é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const existingIndex = ingredients.findIndex(ing => ing.id === selectedIngredient.id);
    let updatedIngredients;

    if (existingIndex >= 0) {
      updatedIngredients = [...ingredients];
      updatedIngredients[existingIndex] = selectedIngredient;
    } else {
      updatedIngredients = [...ingredients, selectedIngredient];
    }

    onIngredientsChange(updatedIngredients);
    
    toast({
      title: "Sucesso",
      description: `Ingrediente "${selectedIngredient.name}" salvo com sucesso`,
    });
  };

  const handleDeleteIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter(ing => ing.id !== id);
    onIngredientsChange(updatedIngredients);
    
    if (selectedIngredient?.id === id) {
      setSelectedIngredient(null);
    }
    
    toast({
      title: "Ingrediente Removido",
      description: "Ingrediente removido com sucesso",
    });
  };

  const updateIngredientField = (field: keyof Ingredient, value: any) => {
    if (!selectedIngredient) return;
    
    setSelectedIngredient({
      ...selectedIngredient,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Ingredientes */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ingredientes</span>
            <Button onClick={handleAddIngredient} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedIngredient?.id === ingredient.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIngredient(ingredient)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{ingredient.name}</h4>
                  <p className="text-sm text-gray-500">
                    {ingredient.category} • R$ {ingredient.currentPrice.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIngredient(ingredient.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Formulário Detalhado */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedIngredient?.id && ingredients.find(i => i.id === selectedIngredient.id)
                ? `Editando: ${selectedIngredient.name}`
                : 'Novo Ingrediente'
              }
            </span>
            {selectedIngredient && (
              <Button onClick={handleSaveIngredient} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        {selectedIngredient ? (
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="energy">Energia</TabsTrigger>
                <TabsTrigger value="protein">Proteína</TabsTrigger>
                <TabsTrigger value="minerals">Minerais</TabsTrigger>
                <TabsTrigger value="vitamins">Vitaminas</TabsTrigger>
                <TabsTrigger value="economic">Econômico</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Comercial *</Label>
                    <Input
                      id="name"
                      value={selectedIngredient.name}
                      onChange={(e) => updateIngredientField('name', e.target.value)}
                      placeholder="Ex: Milho Grão"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scientificName">Nome Científico</Label>
                    <Input
                      id="scientificName"
                      value={selectedIngredient.scientificName || ''}
                      onChange={(e) => updateIngredientField('scientificName', e.target.value)}
                      placeholder="Ex: Zea mays"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={selectedIngredient.category}
                      onValueChange={(value) => updateIngredientField('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cereais">Cereais</SelectItem>
                        <SelectItem value="oleaginosas">Oleaginosas</SelectItem>
                        <SelectItem value="subprodutos">Subprodutos</SelectItem>
                        <SelectItem value="aditivos">Aditivos</SelectItem>
                        <SelectItem value="minerais">Minerais</SelectItem>
                        <SelectItem value="vitaminas">Vitaminas</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="origin">Origem</Label>
                    <Select
                      value={selectedIngredient.origin}
                      onValueChange={(value) => updateIngredientField('origin', value as 'nacional' | 'importado')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nacional">Nacional</SelectItem>
                        <SelectItem value="importado">Importado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="energy" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="metabolizableEnergy">Energia Metabolizável (kcal/kg) *</Label>
                    <Input
                      id="metabolizableEnergy"
                      type="number"
                      value={selectedIngredient.metabolizableEnergy}
                      onChange={(e) => updateIngredientField('metabolizableEnergy', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="grossEnergy">Energia Bruta (kcal/kg)</Label>
                    <Input
                      id="grossEnergy"
                      type="number"
                      value={selectedIngredient.grossEnergy || ''}
                      onChange={(e) => updateIngredientField('grossEnergy', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="digestibleEnergy">Energia Digestível (kcal/kg)</Label>
                    <Input
                      id="digestibleEnergy"
                      type="number"
                      value={selectedIngredient.digestibleEnergy || ''}
                      onChange={(e) => updateIngredientField('digestibleEnergy', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="protein" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="crudeProtein">Proteína Bruta (%) *</Label>
                    <Input
                      id="crudeProtein"
                      type="number"
                      step="0.1"
                      value={selectedIngredient.crudeProtein}
                      onChange={(e) => updateIngredientField('crudeProtein', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lysine">Lisina Digestível (%) *</Label>
                    <Input
                      id="lysine"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.lysine}
                      onChange={(e) => updateIngredientField('lysine', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="methionine">Metionina Digestível (%) *</Label>
                    <Input
                      id="methionine"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.methionine}
                      onChange={(e) => updateIngredientField('methionine', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="threonine">Treonina Digestível (%)</Label>
                    <Input
                      id="threonine"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.threonine || ''}
                      onChange={(e) => updateIngredientField('threonine', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tryptophan">Triptofano Digestível (%)</Label>
                    <Input
                      id="tryptophan"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.tryptophan || ''}
                      onChange={(e) => updateIngredientField('tryptophan', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="arginine">Arginina Digestível (%)</Label>
                    <Input
                      id="arginine"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.arginine || ''}
                      onChange={(e) => updateIngredientField('arginine', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="minerals" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="calcium">Cálcio (%) *</Label>
                    <Input
                      id="calcium"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.calcium}
                      onChange={(e) => updateIngredientField('calcium', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availablePhosphorus">Fósforo Disponível (%) *</Label>
                    <Input
                      id="availablePhosphorus"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.availablePhosphorus}
                      onChange={(e) => updateIngredientField('availablePhosphorus', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sodium">Sódio (%)</Label>
                    <Input
                      id="sodium"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.sodium || ''}
                      onChange={(e) => updateIngredientField('sodium', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="potassium">Potássio (%)</Label>
                    <Input
                      id="potassium"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.potassium || ''}
                      onChange={(e) => updateIngredientField('potassium', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <h4 className="font-medium">Microminerais (mg/kg)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="iron">Ferro</Label>
                    <Input
                      id="iron"
                      type="number"
                      value={selectedIngredient.iron || ''}
                      onChange={(e) => updateIngredientField('iron', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zinc">Zinco</Label>
                    <Input
                      id="zinc"
                      type="number"
                      value={selectedIngredient.zinc || ''}
                      onChange={(e) => updateIngredientField('zinc', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="manganese">Manganês</Label>
                    <Input
                      id="manganese"
                      type="number"
                      value={selectedIngredient.manganese || ''}
                      onChange={(e) => updateIngredientField('manganese', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vitamins" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="vitaminA">Vitamina A (UI/kg)</Label>
                    <Input
                      id="vitaminA"
                      type="number"
                      value={selectedIngredient.vitaminA || ''}
                      onChange={(e) => updateIngredientField('vitaminA', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vitaminD3">Vitamina D3 (UI/kg)</Label>
                    <Input
                      id="vitaminD3"
                      type="number"
                      value={selectedIngredient.vitaminD3 || ''}
                      onChange={(e) => updateIngredientField('vitaminD3', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vitaminE">Vitamina E (mg/kg)</Label>
                    <Input
                      id="vitaminE"
                      type="number"
                      value={selectedIngredient.vitaminE || ''}
                      onChange={(e) => updateIngredientField('vitaminE', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="economic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPrice">Preço Atual (R$/kg) *</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.currentPrice}
                      onChange={(e) => updateIngredientField('currentPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="freight">Frete (R$/kg)</Label>
                    <Input
                      id="freight"
                      type="number"
                      step="0.01"
                      value={selectedIngredient.freight || ''}
                      onChange={(e) => updateIngredientField('freight', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minInclusion">Inclusão Mínima (%)</Label>
                    <Input
                      id="minInclusion"
                      type="number"
                      step="0.1"
                      value={selectedIngredient.minInclusion}
                      onChange={(e) => updateIngredientField('minInclusion', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxInclusion">Inclusão Máxima (%)</Label>
                    <Input
                      id="maxInclusion"
                      type="number"
                      step="0.1"
                      value={selectedIngredient.maxInclusion}
                      onChange={(e) => updateIngredientField('maxInclusion', parseFloat(e.target.value) || 100)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        ) : (
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">Selecione um ingrediente</h3>
              <p>Escolha um ingrediente da lista ou adicione um novo para começar a editar.</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AdvancedIngredientForm;
