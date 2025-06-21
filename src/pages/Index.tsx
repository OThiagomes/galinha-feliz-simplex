
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calculator, Zap, Target, TrendingDown, Database, Save, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import IngredientForm from '@/components/IngredientForm';
import RequirementsForm from '@/components/RequirementsForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FormulationHistory from '@/components/FormulationHistory';
import FormulationComparison from '@/components/FormulationComparison';
import NutritionalReport from '@/components/NutritionalReport';
import PriceAlert from '@/components/PriceAlert';
import ValidationAlert from '@/components/ValidationAlert';
import { Ingredient, NutritionalRequirement, FormulationResult } from '@/types/nutrition';
import { SimplexSolver } from '@/utils/simplex';
import { sampleIngredients } from '@/data/sampleIngredients';
import { useFormulationHistory } from '@/hooks/useFormulationHistory';

const Index = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
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
  const [activeSection, setActiveSection] = useState<'ingredients' | 'requirements' | 'results'>('ingredients');
  const { saveFormulation } = useFormulationHistory();

  // Load sample data on component mount
  useEffect(() => {
    if (ingredients.length === 0) {
      setIngredients(sampleIngredients);
      toast({
        title: "Dados de Exemplo Carregados",
        description: "Ingredientes padrão foram adicionados. Você pode modificá-los conforme necessário.",
      });
    }
  }, []);

  const handleLoadSampleData = () => {
    setIngredients(sampleIngredients);
    toast({
      title: "Dados Recarregados",
      description: "Ingredientes padrão foram restaurados.",
    });
  };

  const handleSaveFormulation = () => {
    if (result && result.feasible) {
      const name = formulationName.trim() || `Formulação ${new Date().toLocaleDateString('pt-BR')}`;
      saveFormulation(result, name);
      setFormulationName('');
      toast({
        title: "Formulação Salva!",
        description: `"${name}" foi adicionada ao histórico.`,
      });
    }
  };

  const handleFormulate = async () => {
    if (ingredients.length < 2) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos 2 ingredientes para formular a ração.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Iniciando formulação com ingredientes:', ingredients);
      console.log('Exigências nutricionais:', requirements);
      
      const solver = new SimplexSolver(ingredients, requirements);
      const formulationResult = await new Promise<FormulationResult>((resolve) => {
        setTimeout(() => {
          resolve(solver.solve());
        }, 1500); // Simular processamento mais realista
      });
      
      console.log('Resultado da formulação:', formulationResult);
      setResult(formulationResult);
      
      if (formulationResult.feasible) {
        toast({
          title: "Formulação Concluída!",
          description: `Ração formulada com custo de R$ ${formulationResult.totalCost.toFixed(4)}/kg`
        });
      } else {
        toast({
          title: "Formulação Inviável",
          description: formulationResult.message || "Não foi possível atender todas as restrições",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro durante a formulação:', error);
      toast({
        title: "Erro na Formulação",
        description: "Ocorreu um erro durante o cálculo. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasValidationErrors = () => {
    return ingredients.length < 2 || 
           ingredients.some(i => !i.name.trim() || i.price <= 0) ||
           requirements.minProtein >= requirements.maxProtein ||
           requirements.minEnergy >= requirements.maxEnergy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header Simplificado */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Formulador de Ração - Poedeiras
          </h1>
          <p className="text-lg opacity-90">
            Sistema profissional de otimização nutricional
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Seção Principal de Formulação */}
          <div className="xl:col-span-3 space-y-6">
            {/* Navegação por Seções */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeSection === 'ingredients' ? 'default' : 'outline'}
                    onClick={() => setActiveSection('ingredients')}
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Ingredientes
                  </Button>
                  <Button
                    variant={activeSection === 'requirements' ? 'default' : 'outline'}
                    onClick={() => setActiveSection('requirements')}
                    size="sm"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Exigências
                  </Button>
                  <Button
                    variant={activeSection === 'results' ? 'default' : 'outline'}
                    onClick={() => setActiveSection('results')}
                    size="sm"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Resultados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dados de Exemplo - Compacto */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-700">Dados Padrão</h3>
                    <p className="text-sm text-blue-600">Ingredientes comuns para formulação</p>
                  </div>
                  <Button 
                    onClick={handleLoadSampleData}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Carregar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Validação */}
            <ValidationAlert ingredients={ingredients} requirements={requirements} />

            {/* Conteúdo das Seções */}
            {activeSection === 'ingredients' && (
              <IngredientForm 
                ingredients={ingredients}
                onIngredientsChange={setIngredients}
              />
            )}

            {activeSection === 'requirements' && (
              <RequirementsForm
                requirements={requirements}
                onRequirementsChange={setRequirements}
              />
            )}

            {activeSection === 'results' && (
              <div className="space-y-6">
                {/* Botão de Formulação */}
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-3">Formular Ração</h3>
                    <p className="mb-4 opacity-90">
                      Otimização com algoritmo Simplex
                    </p>
                    <Button 
                      onClick={handleFormulate}
                      disabled={isLoading || hasValidationErrors()}
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      {isLoading ? 'Formulando...' : 'Formular Ração'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Salvar Formulação */}
                {result && result.feasible && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor="formulationName">Nome da Formulação</Label>
                          <Input
                            id="formulationName"
                            value={formulationName}
                            onChange={(e) => setFormulationName(e.target.value)}
                            placeholder="Ex: Ração Postura Janeiro 2024"
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
              </div>
            )}
          </div>

          {/* Painel Lateral */}
          <div className="xl:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Análises</h2>
            
            <NutritionalReport result={result} requirements={requirements} />
            
            <Separator />
            
            <FormulationHistory />
            
            <Separator />
            
            <FormulationComparison />
            
            <Separator />
            
            <PriceAlert ingredients={ingredients} />
          </div>
        </div>

        {/* Informações do Sistema - Compacta */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto text-green-700 mb-2" />
              <h3 className="font-semibold text-green-700 mb-1">Precisão Nutricional</h3>
              <p className="text-sm text-green-600">Atende exigências NRC</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-8 h-8 mx-auto text-orange-700 mb-2" />
              <h3 className="font-semibold text-orange-700 mb-1">Otimização de Custos</h3>
              <p className="text-sm text-orange-600">Algoritmo Simplex</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto text-blue-700 mb-2" />
              <h3 className="font-semibold text-blue-700 mb-1">Resultados Rápidos</h3>
              <p className="text-sm text-blue-600">Cálculos instantâneos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
