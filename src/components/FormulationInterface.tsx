
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Award
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Client, ClientIngredient } from '@/types/client';
import { UniversalNutritionalRequirement, IngredientConstraint, PHASE_NAMES } from '@/types/phases';
import { useClients } from '@/hooks/useClients';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';
import IngredientConstraints from './IngredientConstraints';

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
  nutritionalValidation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

const FormulationInterface: React.FC = () => {
  const { clients } = useClients();
  const { requirements } = useUniversalRequirements();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<UniversalNutritionalRequirement | null>(null);
  const [constraints, setConstraints] = useState<IngredientConstraint[]>([]);
  const [result, setResult] = useState<FormulationResult | null>(null);
  const [isFormulating, setIsFormulating] = useState(false);
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

  const calculateNutritionalProfile = (ingredientResults: Array<{ingredient: ClientIngredient; percentage: number}>) => {
    const totalPercentage = ingredientResults.reduce((sum, item) => sum + item.percentage, 0);
    
    return {
      metabolizableEnergy: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.metabolizableEnergy * item.percentage / 100), 0),
      crudeProtein: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.crudeProtein * item.percentage / 100), 0),
      calcium: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.calcium * item.percentage / 100), 0),
      availablePhosphorus: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.availablePhosphorus * item.percentage / 100), 0),
      lysine: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.lysine * item.percentage / 100), 0),
      methionine: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.methionine * item.percentage / 100), 0),
      crudeFiber: ingredientResults.reduce((sum, item) => 
        sum + (item.ingredient.crudeFiber * item.percentage / 100), 0)
    };
  };

  const validateNutritionalProfile = (profile: any, requirement: UniversalNutritionalRequirement) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar energia
    if (profile.metabolizableEnergy < requirement.minMetabolizableEnergy) {
      errors.push(`Energia muito baixa: ${profile.metabolizableEnergy.toFixed(0)} < ${requirement.minMetabolizableEnergy}`);
    } else if (profile.metabolizableEnergy > requirement.maxMetabolizableEnergy) {
      errors.push(`Energia muito alta: ${profile.metabolizableEnergy.toFixed(0)} > ${requirement.maxMetabolizableEnergy}`);
    }

    // Validar proteína
    if (profile.crudeProtein < requirement.minCrudeProtein) {
      errors.push(`Proteína muito baixa: ${profile.crudeProtein.toFixed(1)}% < ${requirement.minCrudeProtein}%`);
    } else if (profile.crudeProtein > requirement.maxCrudeProtein) {
      errors.push(`Proteína muito alta: ${profile.crudeProtein.toFixed(1)}% > ${requirement.maxCrudeProtein}%`);
    }

    // Validar cálcio
    if (profile.calcium < requirement.minCalcium) {
      errors.push(`Cálcio muito baixo: ${profile.calcium.toFixed(2)}% < ${requirement.minCalcium}%`);
    } else if (profile.calcium > requirement.maxCalcium) {
      errors.push(`Cálcio muito alto: ${profile.calcium.toFixed(2)}% > ${requirement.maxCalcium}%`);
    }

    // Validar fósforo
    if (profile.availablePhosphorus < requirement.minAvailablePhosphorus) {
      errors.push(`Fósforo muito baixo: ${profile.availablePhosphorus.toFixed(2)}% < ${requirement.minAvailablePhosphorus}%`);
    } else if (profile.availablePhosphorus > requirement.maxAvailablePhosphorus) {
      errors.push(`Fósforo muito alto: ${profile.availablePhosphorus.toFixed(2)}% > ${requirement.maxAvailablePhosphorus}%`);
    }

    // Validar lisina
    if (profile.lysine < requirement.minLysine) {
      errors.push(`Lisina muito baixa: ${profile.lysine.toFixed(2)}% < ${requirement.minLysine}%`);
    }

    // Validar metionina
    if (profile.methionine < requirement.minMethionine) {
      errors.push(`Metionina muito baixa: ${profile.methionine.toFixed(2)}% < ${requirement.minMethionine}%`);
    }

    // Validar fibra
    if (profile.crudeFiber > requirement.maxCrudeFiber) {
      warnings.push(`Fibra alta: ${profile.crudeFiber.toFixed(1)}% > ${requirement.maxCrudeFiber}%`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const mockFormulation = async (): Promise<FormulationResult> => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const totalIngredients = availableIngredients.slice(0, 5);
    const basePercentages = [45, 25, 15, 10, 5];
    
    const ingredientResults = totalIngredients.map((ing, idx) => ({
      ingredient: ing,
      percentage: basePercentages[idx] || 0,
      cost: (basePercentages[idx] || 0) * ing.currentPrice / 100
    }));

    const nutritionalProfile = calculateNutritionalProfile(ingredientResults);
    const validation = selectedRequirement ? 
      validateNutritionalProfile(nutritionalProfile, selectedRequirement) : 
      { isValid: true, errors: [], warnings: [] };

    const mockResult: FormulationResult = {
      ingredients: ingredientResults,
      totalCost: ingredientResults.reduce((sum, item) => sum + item.cost, 0),
      nutritionalProfile,
      feasible: validation.isValid,
      message: validation.isValid ? 
        'Formulação otimizada com sucesso!' : 
        'Formulação não atende todos os requisitos nutricionais',
      nutritionalValidation: validation
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const chartConfig = {
    percentage: {
      label: "Porcentagem",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header com Gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Formulação Avançada</h2>
            <p className="text-blue-100">Sistema de otimização nutricional com IA</p>
          </div>
        </div>
      </div>

      {/* Seleção de Perfil */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Configuração da Formulação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Cliente</Label>
              <Select value={selectedClient?.id || ''} onValueChange={handleClientChange}>
                <SelectTrigger className="mt-1">
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
              <Label className="text-sm font-semibold text-gray-700">Fase Nutricional</Label>
              <Select 
                value={selectedRequirement?.id || ''} 
                onValueChange={(value) => {
                  const req = requirements.find(r => r.id === value);
                  setSelectedRequirement(req || null);
                }}
              >
                <SelectTrigger className="mt-1">
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
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-gray-700">Energia</div>
                    <div className="text-gray-600">{selectedRequirement.minMetabolizableEnergy}-{selectedRequirement.maxMetabolizableEnergy}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-700">Proteína</div>
                    <div className="text-gray-600">{selectedRequirement.minCrudeProtein}-{selectedRequirement.maxCrudeProtein}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-700">Cálcio</div>
                    <div className="text-gray-600">{selectedRequirement.minCalcium}-{selectedRequirement.maxCalcium}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-700">Lisina</div>
                    <div className="text-gray-600">≥{selectedRequirement.minLysine}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restrições de Ingredientes */}
      {selectedClient && availableIngredients.length > 0 && (
        <IngredientConstraints
          ingredients={availableIngredients}
          constraints={constraints}
          onUpdateConstraints={setConstraints}
        />
      )}

      {/* Botão de Formulação */}
      {selectedClient && selectedRequirement && (
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  {isFormulating ? (
                    <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Calculator className="w-8 h-8" />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Pronto para Otimizar!</h3>
                <p className="text-white text-opacity-90">
                  {availableIngredients.length} ingredientes • {constraints.filter(c => c.isLocked).length} restrições
                </p>
              </div>

              <Button
                onClick={handleFormulate}
                disabled={isFormulating}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 font-bold px-8 py-3 shadow-lg"
              >
                {isFormulating ? (
                  <>
                    <div className="animate-pulse w-5 h-5 mr-2"></div>
                    Processando Algoritmo Simplex...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Otimizar Formulação
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {result && (
        <div className="space-y-6">
          {/* Validação Nutricional */}
          {result.nutritionalValidation && (
            <div className="space-y-3">
              {result.nutritionalValidation.errors.length > 0 && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Erros Nutricionais:</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {result.nutritionalValidation.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {result.nutritionalValidation.warnings.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="font-semibold mb-2 text-yellow-800">Avisos:</div>
                    <ul className="list-disc pl-4 space-y-1 text-yellow-700">
                      {result.nutritionalValidation.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {result.nutritionalValidation.isValid && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="font-semibold">✅ Formulação Aprovada!</div>
                    <div>Todos os requisitos nutricionais foram atendidos.</div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  Resultado da Formulação
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    💰 Custo: R$ {result.totalCost.toFixed(4)}/kg
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCharts(!showCharts)}
                    className="text-green-600 hover:bg-green-100"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {showCharts ? 'Ocultar' : 'Gráficos'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Tabela de Ingredientes */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Composição da Ração
                  </h4>
                  <div className="space-y-3">
                    {result.ingredients.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <span className="font-medium text-gray-800">{item.ingredient.name}</span>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{item.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">R$ {item.cost.toFixed(4)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perfil Nutricional */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Perfil Nutricional Atingido
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="text-gray-700">Energia Metabolizável:</span>
                      <span className="font-bold text-blue-600">{result.nutritionalProfile.metabolizableEnergy.toFixed(0)} kcal/kg</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-gray-700">Proteína Bruta:</span>
                      <span className="font-bold text-green-600">{result.nutritionalProfile.crudeProtein.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span className="text-gray-700">Cálcio:</span>
                      <span className="font-bold text-purple-600">{result.nutritionalProfile.calcium.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-50 rounded">
                      <span className="text-gray-700">Fósforo Disponível:</span>
                      <span className="font-bold text-orange-600">{result.nutritionalProfile.availablePhosphorus.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-indigo-50 rounded">
                      <span className="text-gray-700">Lisina:</span>
                      <span className="font-bold text-indigo-600">{result.nutritionalProfile.lysine.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-pink-50 rounded">
                      <span className="text-gray-700">Metionina:</span>
                      <span className="font-bold text-pink-600">{result.nutritionalProfile.methionine.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              {showCharts && chartData.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <h4 className="font-semibold mb-4 text-center text-gray-800">📊 Composição (%)</h4>
                      <ChartContainer config={chartConfig} className="h-64">
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

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                      <h4 className="font-semibold mb-4 text-center text-gray-800">💰 Custo por Ingrediente</h4>
                      <ChartContainer config={chartConfig} className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="cost" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
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
