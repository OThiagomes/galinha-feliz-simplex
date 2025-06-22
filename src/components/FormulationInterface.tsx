import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  Play, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Target
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Client, ClientIngredient } from '@/types/client';
import { UniversalNutritionalRequirement, IngredientConstraint, PHASE_NAMES } from '@/types/phases';
import { useClients } from '@/hooks/useClients';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';

interface FormulationResult {
  ingredients: Array<{
    ingredient: ClientIngredient;
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
  };
  feasible: boolean;
  message?: string;
}

const FormulationInterface: React.FC = () => {
  const { clients } = useClients();
  const { requirements } = useUniversalRequirements();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<UniversalNutritionalRequirement | null>(null);
  const [constraints, setConstraints] = useState<IngredientConstraint[]>([]);
  const [result, setResult] = useState<FormulationResult | null>(null);
  const [isFormulating, setIsFormulating] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const availableIngredients = selectedClient ? 
    selectedClient.ingredients.filter(ing => ing.availability) : [];

  const initializeConstraints = (client: Client) => {
    const newConstraints = client.ingredients
      .filter(ing => ing.availability)
      .map(ing => ({
        ingredientId: ing.id,
        minPercentage: ing.minInclusion,
        maxPercentage: ing.maxInclusion,
        isLocked: false
      }));
    
    setConstraints(newConstraints);
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    if (client) {
      initializeConstraints(client);
    }
    setResult(null);
  };

  const updateConstraint = (ingredientId: string, field: keyof IngredientConstraint, value: any) => {
    setConstraints(prev => prev.map(c => 
      c.ingredientId === ingredientId 
        ? { ...c, [field]: value }
        : c
    ));
  };

  const mockFormulation = async (): Promise<FormulationResult> => {
    // Simulação simplificada do algoritmo simplex
    await new Promise(resolve => setTimeout(resolve, 2000));

    const totalIngredients = availableIngredients.slice(0, 5);
    const basePercentages = [45, 25, 15, 10, 5];
    
    const mockResult: FormulationResult = {
      ingredients: totalIngredients.map((ing, idx) => ({
        ingredient: ing,
        percentage: basePercentages[idx] || 0,
        cost: (basePercentages[idx] || 0) * ing.currentPrice / 100
      })),
      totalCost: totalIngredients.reduce((sum, ing, idx) => 
        sum + ((basePercentages[idx] || 0) * ing.currentPrice / 100), 0),
      nutritionalProfile: {
        metabolizableEnergy: 2850,
        crudeProtein: 18.5,
        calcium: 3.8,
        availablePhosphorus: 0.40,
        lysine: 0.85,
        methionine: 0.45,
        crudeFiber: 4.2
      },
      feasible: true,
      message: 'Formulação otimizada com sucesso!'
    };

    return mockResult;
  };

  const handleFormulate = async () => {
    if (!selectedClient || !selectedRequirement) return;
    
    setIsFormulating(true);
    try {
      const formulationResult = await mockFormulation();
      setResult(formulationResult);
    } catch (error) {
      console.error('Erro na formulação:', error);
    } finally {
      setIsFormulating(false);
    }
  };

  const chartData = result ? result.ingredients.map(item => ({
    name: item.ingredient.name,
    value: item.percentage,
    cost: item.cost
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartConfig = {
    percentage: {
      label: "Porcentagem",
    },
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Configuração da Formulação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Cliente</Label>
              <Select value={selectedClient?.id || ''} onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.ingredients.filter(i => i.availability).length} ingredientes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fase Nutricional</Label>
              <Select 
                value={selectedRequirement?.id || ''} 
                onValueChange={(value) => {
                  const req = requirements.find(r => r.id === value);
                  setSelectedRequirement(req || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fase" />
                </SelectTrigger>
                <SelectContent>
                  {requirements.map(req => (
                    <SelectItem key={req.id} value={req.id}>
                      {req.name} - {PHASE_NAMES[req.phase]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedRequirement && (
            <div className="p-3 bg-blue-50 rounded grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>Energia:</strong> {selectedRequirement.minMetabolizableEnergy}-{selectedRequirement.maxMetabolizableEnergy}</div>
              <div><strong>Proteína:</strong> {selectedRequirement.minCrudeProtein}-{selectedRequirement.maxCrudeProtein}%</div>
              <div><strong>Cálcio:</strong> {selectedRequirement.minCalcium}-{selectedRequirement.maxCalcium}%</div>
              <div><strong>Lisina:</strong> ≥{selectedRequirement.minLysine}%</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restrições de Ingredientes */}
      {selectedClient && availableIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-purple-700">Restrições de Ingredientes</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConstraints(!showConstraints)}
              >
                {showConstraints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showConstraints ? 'Ocultar' : 'Mostrar'}
              </Button>
            </CardTitle>
          </CardHeader>
          
          {showConstraints && (
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableIngredients.map(ingredient => {
                  const constraint = constraints.find(c => c.ingredientId === ingredient.id);
                  if (!constraint) return null;

                  return (
                    <div key={ingredient.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div className="flex-1 font-medium text-sm">
                        {ingredient.name}
                        <div className="text-xs text-gray-500">R$ {ingredient.currentPrice.toFixed(2)}/kg</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Min:</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={constraint.minPercentage || ''}
                            onChange={(e) => updateConstraint(ingredient.id, 'minPercentage', parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                          />
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Max:</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={constraint.maxPercentage || ''}
                            onChange={(e) => updateConstraint(ingredient.id, 'maxPercentage', parseFloat(e.target.value) || 100)}
                            className="w-16 h-8 text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Fixo:</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={constraint.fixedPercentage || ''}
                            onChange={(e) => updateConstraint(ingredient.id, 'fixedPercentage', parseFloat(e.target.value) || undefined)}
                            className="w-16 h-8 text-xs"
                            placeholder="--"
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateConstraint(ingredient.id, 'isLocked', !constraint.isLocked)}
                          className={constraint.isLocked ? 'text-red-600' : 'text-gray-400'}
                        >
                          {constraint.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Botão de Formulação */}
      {selectedClient && selectedRequirement && (
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <Button
              onClick={handleFormulate}
              disabled={isFormulating}
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-bold"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {isFormulating ? 'Formulando...' : 'Otimizar Formulação'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-green-700">Resultado da Formulação</span>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    Custo: R$ {result.totalCost.toFixed(4)}/kg
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCharts(!showCharts)}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {showCharts ? 'Ocultar' : 'Gráficos'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tabela de Ingredientes */}
                <div>
                  <h4 className="font-semibold mb-3">Composição da Ração</h4>
                  <div className="space-y-2">
                    {result.ingredients.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{item.ingredient.name}</span>
                        <div className="text-right">
                          <div className="font-bold">{item.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">R$ {item.cost.toFixed(4)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perfil Nutricional */}
                <div>
                  <h4 className="font-semibold mb-3">Perfil Nutricional</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Energia Metabolizável:</span>
                      <span className="font-bold">{result.nutritionalProfile.metabolizableEnergy} kcal/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proteína Bruta:</span>
                      <span className="font-bold">{result.nutritionalProfile.crudeProtein}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cálcio:</span>
                      <span className="font-bold">{result.nutritionalProfile.calcium}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fósforo Disponível:</span>
                      <span className="font-bold">{result.nutritionalProfile.availablePhosphorus}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lisina:</span>
                      <span className="font-bold">{result.nutritionalProfile.lysine}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metionina:</span>
                      <span className="font-bold">{result.nutritionalProfile.methionine}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              {showCharts && chartData.length > 0 && (
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-center">Composição (%)</h4>
                    <ChartContainer
                      config={chartConfig}
                      className="h-64"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-center">Custo por Ingrediente</h4>
                    <ChartContainer
                      config={chartConfig}
                      className="h-64"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="cost" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FormulationInterface;
