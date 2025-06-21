
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Zap, Target, TrendingDown, Database, Save } from 'lucide-react';
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
  const { saveFormulation } = useFormulationHistory();

  // Load sample data on component mount
  useEffect(() => {
    if (ingredients.length === 0) {
      setIngredients(sampleIngredients);
      toast({
        title: "Dados de Exemplo Carregados",
        description: "Ingredientes padrão foram adicionados. Você pode modificá-los ou adicionar novos.",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-orange-500 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Formulador de Ração - Poedeiras
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Otimização de custos com algoritmo Simplex
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6" />
                <span>Atende Exigências NRC</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                <span>Minimiza Custos</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                <span>Resultados Instantâneos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulários */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sample Data Card */}
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-indigo-700">Dados de Exemplo</h3>
                    <p className="text-sm text-indigo-600">Use ingredientes padrão para testar o sistema</p>
                  </div>
                  <Button 
                    onClick={handleLoadSampleData}
                    variant="outline"
                    size="sm"
                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Carregar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Validação */}
            <ValidationAlert ingredients={ingredients} requirements={requirements} />
            
            <IngredientForm 
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />
            
            <RequirementsForm
              requirements={requirements}
              onRequirementsChange={setRequirements}
            />
            
            {/* Botão de Formulação */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Pronto para Formular?</h3>
                  <p className="mb-6 opacity-90">
                    O algoritmo Simplex irá otimizar sua formulação considerando todas as restrições nutricionais
                  </p>
                  <Button 
                    onClick={handleFormulate}
                    disabled={isLoading || hasValidationErrors()}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg"
                  >
                    <Calculator className="w-6 h-6 mr-2" />
                    {isLoading ? 'Formulando...' : 'Formular Ração'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Salvar Formulação */}
            {result && result.feasible && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="formulationName">Nome da Formulação</Label>
                      <Input
                        id="formulationName"
                        value={formulationName}
                        onChange={(e) => setFormulationName(e.target.value)}
                        placeholder="Ex: Ração Postura Verão 2024"
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
          </div>

          {/* Resultados */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Resultados</h2>
              <ResultsDisplay result={result} isLoading={isLoading} />
              <FormulationHistory />
              <FormulationComparison />
              <NutritionalReport result={result} requirements={requirements} />
              <PriceAlert ingredients={ingredients} />
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Precisão Nutricional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600">
                Atende rigorosamente às exigências nutricionais estabelecidas pelo NRC para poedeiras comerciais.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Otimização de Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-600">
                Algoritmo Simplex encontra a formulação de menor custo que atende todas as restrições.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Método Científico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600">
                Baseado em programação linear, garantindo soluções matematicamente ótimas e confiáveis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
