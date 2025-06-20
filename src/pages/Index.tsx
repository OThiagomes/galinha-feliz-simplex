
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Zap, Target, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import IngredientForm from '@/components/IngredientForm';
import RequirementsForm from '@/components/RequirementsForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Ingredient, NutritionalRequirement, FormulationResult } from '@/types/nutrition';
import { SimplexSolver } from '@/utils/simplex';

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
        }, 1000); // Simular processamento
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
                    disabled={isLoading || ingredients.length < 2}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg"
                  >
                    <Calculator className="w-6 h-6 mr-2" />
                    {isLoading ? 'Formulando...' : 'Formular Ração'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados</h2>
              <ResultsDisplay result={result} isLoading={isLoading} />
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
