
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  DollarSign,
  Activity,
  BarChart3,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Client } from '@/types/client';
import { UniversalNutritionalRequirement, IngredientConstraint, PHASE_NAMES } from '@/types/phases';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';
import { useClients } from '@/hooks/useClients';
import { formulateWithAdvancedSimplex, SimplexResult } from '@/utils/simplexAdvanced';
import IngredientConstraints from './IngredientConstraints';

const FormulationInterface: React.FC = () => {
  const { clients } = useClients();
  const { requirements } = useUniversalRequirements();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<UniversalNutritionalRequirement | null>(null);
  const [constraints, setConstraints] = useState<IngredientConstraint[]>([]);
  const [result, setResult] = useState<SimplexResult | null>(null);
  const [isFormulating, setIsFormulating] = useState(false);

  const availableIngredients = selectedClient ? 
    selectedClient.ingredients.filter(ing => ing.availability) : [];

  const initializeConstraints = () => {
    if (!selectedClient) return;
    
    const newConstraints = selectedClient.ingredients
      .filter(ing => ing.availability)
      .map(ing => ({
        ingredientId: ing.id,
        minPercentage: ing.minInclusion,
        maxPercentage: ing.maxInclusion,
        isLocked: false
      }));
    
    setConstraints(newConstraints);
  };

  const handleFormulate = async () => {
    if (!selectedClient || !selectedRequirement) return;
    
    setIsFormulating(true);
    setResult(null);
    
    // Simulação de processamento para mostrar o progresso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const formulationResult = formulateWithAdvancedSimplex(
        availableIngredients,
        selectedRequirement,
        constraints
      );
      
      setResult(formulationResult);
    } catch (error) {
      setResult({
        success: false,
        solution: {},
        totalCost: 0,
        nutritionalProfile: {
          metabolizableEnergy: 0,
          crudeProtein: 0,
          calcium: 0,
          availablePhosphorus: 0,
          lysine: 0,
          methionine: 0,
          threonine: 0,
          tryptophan: 0,
          crudeFiber: 0
        },
        feasible: false,
        violations: ['Erro interno no algoritmo'],
        iterations: 0,
        error: 'Erro ao executar formulação'
      });
    }
    
    setIsFormulating(false);
  };

  // Dados para gráficos
  const pieData = useMemo(() => {
    if (!result?.success) return [];
    
    return Object.entries(result.solution)
      .filter(([_, percentage]) => percentage > 0.01)
      .map(([ingredientId, percentage]) => {
        const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
        return {
          name: ingredient?.name || 'Desconhecido',
          value: percentage * 100,
          cost: (percentage * (ingredient?.currentPrice || 0)).toFixed(2)
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [result, availableIngredients]);

  const nutritionalComparisonData = useMemo(() => {
    if (!result?.success || !selectedRequirement) return [];

    const profile = result.nutritionalProfile;
    
    return [
      {
        nutrient: 'Energia',
        atual: profile.metabolizableEnergy,
        minimo: selectedRequirement.minMetabolizableEnergy,
        maximo: selectedRequirement.maxMetabolizableEnergy,
        unidade: 'kcal/kg'
      },
      {
        nutrient: 'Proteína',
        atual: profile.crudeProtein,
        minimo: selectedRequirement.minCrudeProtein,
        maximo: selectedRequirement.maxCrudeProtein,
        unidade: '%'
      },
      {
        nutrient: 'Cálcio',
        atual: profile.calcium,
        minimo: selectedRequirement.minCalcium,
        maximo: selectedRequirement.maxCalcium,
        unidade: '%'
      },
      {
        nutrient: 'Lisina',
        atual: profile.lysine,
        minimo: selectedRequirement.minLysine,
        maximo: selectedRequirement.minLysine * 1.2,
        unidade: '%'
      }
    ];
  }, [result, selectedRequirement]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const canFormulate = selectedClient && selectedRequirement && availableIngredients.length >= 2;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Formulação Avançada</h2>
            <p className="text-blue-100">Algoritmo Simplex com validação nutricional completa</p>
          </div>
        </div>
      </div>

      {/* Seleções */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Target className="w-5 h-5" />
              Cliente e Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Select
              value={selectedClient?.id || ''}
              onValueChange={(value) => {
                const client = clients.find(c => c.id === value);
                setSelectedClient(client || null);
                if (client) initializeConstraints();
                setResult(null);
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="🏢 Selecionar Cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-3 py-1">
                      <span className="font-medium">{client.name}</span>
                      <Badge variant="outline">
                        {client.ingredients.filter(i => i.availability).length} ingredientes
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedClient && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>✅ {availableIngredients.length} ingredientes disponíveis</strong>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Sparkles className="w-5 h-5" />
              Exigência Nutricional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Select
              value={selectedRequirement?.id || ''}
              onValueChange={(value) => {
                const requirement = requirements.find(r => r.id === value);
                setSelectedRequirement(requirement || null);
                setResult(null);
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="🎯 Selecionar Fase" />
              </SelectTrigger>
              <SelectContent>
                {requirements.map(req => (
                  <SelectItem key={req.id} value={req.id}>
                    <div className="flex items-center gap-3 py-1">
                      <span className="font-medium">{req.name}</span>
                      <Badge variant="outline">
                        {PHASE_NAMES[req.phase]}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedRequirement && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800 space-y-1">
                  <div><strong>⚡ Energia:</strong> {selecte

dRequirement.minMetabolizableEnergy}-{selectedRequirement.maxMetabolizableEnergy} kcal/kg</div>
                  <div><strong>🥩 Proteína:</strong> {selectedRequirement.minCrudeProtein}-{selectedRequirement.maxCrudeProtein}%</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Restrições de Ingredientes */}
      {selectedClient && selectedRequirement && (
        <IngredientConstraints
          ingredients={availableIngredients}
          constraints={constraints}
          onUpdateConstraints={setConstraints}
        />
      )}

      {/* Botão de Formulação */}
      {canFormulate && (
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-white bg-opacity-20 p-6 rounded-full">
                  {isFormulating ? (
                    <RefreshCw className="w-12 h-12 animate-spin" />
                  ) : (
                    <Zap className="w-12 h-12" />
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">
                  {isFormulating ? 'Processando...' : 'Executar Formulação'}
                </h3>
                <p className="text-lg text-white text-opacity-90">
                  {isFormulating 
                    ? 'Executando algoritmo Simplex com validação nutricional'
                    : 'Otimização automática de custos com restrições nutricionais'
                  }
                </p>
              </div>

              {isFormulating && (
                <div className="space-y-2">
                  <Progress value={75} className="w-full max-w-md mx-auto" />
                  <div className="text-sm text-white text-opacity-80">
                    Analisando {availableIngredients.length} ingredientes e {constraints.length} restrições...
                  </div>
                </div>
              )}

              <Button
                onClick={handleFormulate}
                disabled={isFormulating}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-12 py-4 text-lg"
              >
                {isFormulating ? (
                  <>
                    <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                    Formulando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-6 h-6 mr-3" />
                    Iniciar Formulação
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
          {/* Status da Formulação */}
          <Alert className={`border-2 ${result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                <div className="font-bold text-lg mb-2">
                  {result.success ? '✅ Formulação Concluída!' : '❌ Formulação Falhou'}
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Iterações:</strong> {result.iterations}
                  </div>
                  <div>
                    <strong>Status:</strong> {result.feasible ? 'Viável' : 'Inviável'}
                  </div>
                  <div>
                    <strong>Custo:</strong> R$ {result.totalCost.toFixed(4)}/kg
                  </div>
                </div>
                {result.error && (
                  <div className="mt-2 text-red-700 font-medium">
                    <strong>Erro:</strong> {result.error}
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>

          {/* Violações */}
          {result.violations.length > 0 && (
            <Card className="border-2 border-yellow-300">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5" />
                  Violações Nutricionais ({result.violations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {result.violations.map((violation, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-yellow-800">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      {violation}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráficos e Resultados */}
          {result.success && pieData.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Composição da Ração */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <BarChart3 className="w-5 h-5" />
                    Composição da Ração
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value.toFixed(2)}%`, 'Inclusão']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.value.toFixed(2)}%</div>
                          <div className="text-xs text-gray-500">R$ {item.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Perfil Nutricional */}
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Activity className="w-5 h-5" />
                    Perfil Nutricional
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={nutritionalComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nutrient" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="minimo" fill="#8884d8" name="Mínimo" />
                        <Bar dataKey="atual" fill="#82ca9d" name="Atual" />
                        <Bar dataKey="maximo" fill="#ffc658" name="Máximo" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resumo de Custos */}
          {result.success && (
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <DollarSign className="w-5 h-5" />
                  Análise de Custos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      R$ {result.totalCost.toFixed(4)}
                    </div>
                    <div className="text-sm text-blue-700 font-medium">Custo por kg</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      R$ {(result.totalCost * 1000).toFixed(2)}
                    </div>
                    <div className="text-sm text-green-700 font-medium">Custo por tonelada</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {result.iterations}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">Iterações Simplex</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {pieData.length}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">Ingredientes Usados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default FormulationInterface;
