
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Zap, Target, TrendingDown, Database, Save, Settings, Users, FileText, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ClientSelector from '@/components/ClientSelector';
import IngredientForm from '@/components/IngredientForm';
import RequirementsForm from '@/components/RequirementsForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FormulationHistory from '@/components/FormulationHistory';
import FormulationComparison from '@/components/FormulationComparison';
import NutritionalReport from '@/components/NutritionalReport';
import PriceAlert from '@/components/PriceAlert';
import ValidationAlert from '@/components/ValidationAlert';
import { Ingredient, NutritionalRequirement, FormulationResult } from '@/types/nutrition';
import { ClientIngredient } from '@/types/client';
import { SimplexSolver } from '@/utils/simplex';
import { sampleIngredients } from '@/data/sampleIngredients';
import { useClients } from '@/hooks/useClients';

const Index = () => {
  const {
    clients,
    selectedClient,
    setSelectedClient,
    addClient,
    updateClientIngredients,
    saveClientFormulation,
    getClientFormulations
  } = useClients();

  const [requirements, setRequirements] = useState<NutritionalRequirement>({
    minProtein: 16.0,
    maxProtein: 18.0,
    minEnergy: 2750,
    maxEnergy: 2850,
    minCalcium: 3.8,
    maxCalcium: 4.2,
    minPhosphorus: 0.35,
    maxPhosphorus: 0.45,
    minLysine: 0.75,
    maxLysine: 0.85,
    minMethionine: 0.38,
    maxMethionine: 0.45,
    maxFiber: 6.0
  });
  
  const [result, setResult] = useState<FormulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formulationName, setFormulationName] = useState('');
  const [activeTab, setActiveTab] = useState('formulation');

  // Converter ClientIngredient para Ingredient para compatibilidade
  const convertToIngredients = (clientIngredients: ClientIngredient[]): Ingredient[] => {
    return clientIngredients
      .filter(ing => ing.availability)
      .map(ing => ({
        name: ing.name,
        protein: ing.protein,
        energy: ing.energy,
        calcium: ing.calcium,
        phosphorus: ing.phosphorus,
        lysine: ing.lysine,
        methionine: ing.methionine,
        fiber: ing.fiber,
        price: ing.price
      }));
  };

  const handleLoadSampleData = () => {
    if (!selectedClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive"
      });
      return;
    }

    const clientIngredients: ClientIngredient[] = sampleIngredients.map((ing, index) => ({
      id: (Date.now() + index).toString(),
      ...ing,
      availability: true,
      notes: 'Ingrediente padrão'
    }));

    updateClientIngredients(selectedClient.id, clientIngredients);
    
    toast({
      title: "Dados Carregados",
      description: `Ingredientes padrão adicionados para ${selectedClient.name}`,
    });
  };

  const handleSaveFormulation = () => {
    if (result && result.feasible && selectedClient) {
      const name = formulationName.trim() || `Formulação ${new Date().toLocaleDateString('pt-BR')}`;
      saveClientFormulation(result, name, selectedClient.ingredients);
      setFormulationName('');
      toast({
        title: "Formulação Salva!",
        description: `"${name}" foi salva para ${selectedClient.name}.`,
      });
    }
  };

  const handleFormulate = async () => {
    if (!selectedClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive"
      });
      return;
    }

    const ingredients = convertToIngredients(selectedClient.ingredients);
    
    if (ingredients.length < 2) {
      toast({
        title: "Erro",
        description: "O cliente precisa ter pelo menos 2 ingredientes disponíveis",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const solver = new SimplexSolver(ingredients, requirements);
      const formulationResult = await new Promise<FormulationResult>((resolve) => {
        setTimeout(() => {
          resolve(solver.solve());
        }, 1500);
      });
      
      setResult(formulationResult);
      
      if (formulationResult.feasible) {
        toast({
          title: "Formulação Concluída!",
          description: `Ração formulada para ${selectedClient.name} - R$ ${formulationResult.totalCost.toFixed(4)}/kg`
        });
      } else {
        toast({
          title: "Formulação Inviável",
          description: formulationResult.message || "Não foi possível atender todas as restrições",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Formulação",
        description: "Ocorreu um erro durante o cálculo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentIngredients = selectedClient ? convertToIngredients(selectedClient.ingredients) : [];
  const hasValidationErrors = () => {
    return !selectedClient || 
           currentIngredients.length < 2 || 
           currentIngredients.some(i => !i.name.trim() || i.price <= 0) ||
           requirements.minProtein >= requirements.maxProtein ||
           requirements.minEnergy >= requirements.maxEnergy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header Profissional */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">
              Sistema de Formulação de Ração
            </h1>
            <p className="text-xl opacity-90 mb-2">
              Poedeiras Comerciais - Otimização Nutricional Profissional
            </p>
            <div className="flex justify-center items-center gap-6 text-sm opacity-80">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Precisão NRC
              </span>
              <span className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Custo Otimizado
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Multi-Cliente
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Seção de Cliente */}
        <div className="mb-8">
          <ClientSelector
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            onAddClient={addClient}
          />
        </div>

        {selectedClient && (
          <>
            {/* Dados de Exemplo */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-700">Ingredientes Padrão</h3>
                    <p className="text-sm text-blue-600">Carregue dados base para começar rapidamente</p>
                  </div>
                  <Button 
                    onClick={handleLoadSampleData}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Carregar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Abas Organizado */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                <TabsTrigger value="formulation" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span className="hidden sm:block">Formulação</span>
                </TabsTrigger>
                <TabsTrigger value="ingredients" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:block">Ingredientes</span>
                </TabsTrigger>
                <TabsTrigger value="requirements" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:block">Exigências</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:block">Relatórios</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="formulation" className="space-y-6">
                <ValidationAlert ingredients={currentIngredients} requirements={requirements} />
                
                {/* Botão de Formulação */}
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-3">Formular Ração</h3>
                    <p className="mb-6 opacity-90 text-lg">
                      Cliente: <strong>{selectedClient.name}</strong> • {currentIngredients.length} ingredientes disponíveis
                    </p>
                    <Button 
                      onClick={handleFormulate}
                      disabled={isLoading || hasValidationErrors()}
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      {isLoading ? 'Calculando...' : 'Iniciar Formulação'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Salvar Formulação */}
                {result && result.feasible && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700">Salvar Formulação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label htmlFor="formulationName">Nome da Formulação</Label>
                          <Input
                            id="formulationName"
                            value={formulationName}
                            onChange={(e) => setFormulationName(e.target.value)}
                            placeholder={`Ração ${selectedClient.name} - ${new Date().toLocaleDateString('pt-BR')}`}
                          />
                        </div>
                        <Button 
                          onClick={handleSaveFormulation}
                          className="bg-green-600 hover:bg-green-700 mt-6"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <ResultsDisplay result={result} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="ingredients">
                <IngredientForm 
                  ingredients={currentIngredients}
                  onIngredientsChange={(ingredients) => {
                    const clientIngredients: ClientIngredient[] = ingredients.map((ing, index) => ({
                      id: selectedClient.ingredients[index]?.id || (Date.now() + index).toString(),
                      ...ing,
                      availability: true,
                      notes: selectedClient.ingredients[index]?.notes || ''
                    }));
                    updateClientIngredients(selectedClient.id, clientIngredients);
                  }}
                />
              </TabsContent>

              <TabsContent value="requirements">
                <RequirementsForm
                  requirements={requirements}
                  onRequirementsChange={setRequirements}
                />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <NutritionalReport result={result} requirements={requirements} />
                  <PriceAlert ingredients={currentIngredients} />
                </div>
                
                <Separator />
                
                <FormulationHistory />
                
                <Separator />
                
                <FormulationComparison />
              </TabsContent>
            </Tabs>
          </>
        )}

        {!selectedClient && (
          <Card className="mt-8">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Selecione ou Adicione um Cliente</h3>
                <p>Para começar a formular rações, selecione um cliente existente ou adicione um novo.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações do Sistema */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300">
            <CardContent className="p-6 text-center">
              <Target className="w-10 h-10 mx-auto text-green-700 mb-3" />
              <h3 className="font-semibold text-green-700 mb-2">Precisão Nutricional</h3>
              <p className="text-sm text-green-600">Formulações seguem padrões NRC para poedeiras comerciais</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-10 h-10 mx-auto text-orange-700 mb-3" />
              <h3 className="font-semibold text-orange-700 mb-2">Otimização de Custos</h3>
              <p className="text-sm text-orange-600">Algoritmo Simplex para máxima eficiência econômica</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto text-blue-700 mb-3" />
              <h3 className="font-semibold text-blue-700 mb-2">Gestão Multi-Cliente</h3>
              <p className="text-sm text-blue-600">Ingredientes e preços personalizados por cliente</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
