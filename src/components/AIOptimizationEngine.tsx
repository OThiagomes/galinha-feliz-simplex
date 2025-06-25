
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle,
  RefreshCw,
  Lightbulb,
  DollarSign,
  Activity
} from 'lucide-react';
import { formulationAI, AIFormulationSuggestion } from '@/services/formulationAI';

interface AIOptimizationEngineProps {
  ingredients: any[];
  requirements: any;
  currentFormulation: any;
  onOptimizationApply?: (suggestion: AIFormulationSuggestion) => void;
}

const AIOptimizationEngine: React.FC<AIOptimizationEngineProps> = ({
  ingredients,
  requirements,
  currentFormulation,
  onOptimizationApply
}) => {
  const [optimizations, setOptimizations] = useState<AIFormulationSuggestion[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runOptimization = async () => {
    if (!formulationAI.isInitialized() || !currentFormulation) {
      setError('IA não configurada ou formulação não disponível');
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const suggestions = await formulationAI.optimizeFormulation(
        ingredients,
        requirements,
        currentFormulation
      );
      setOptimizations(suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na otimização');
    } finally {
      setIsOptimizing(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'improvement': return Lightbulb;
      default: return Target;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50 text-red-800';
      case 'medium': return 'border-orange-300 bg-orange-50 text-orange-800';
      default: return 'border-blue-300 bg-blue-50 text-blue-800';
    }
  };

  const canOptimize = formulationAI.isInitialized() && currentFormulation && ingredients.length > 0;

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2 text-green-700">
          <div className="bg-green-100 p-2 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <span>Motor de Otimização IA</span>
          <Badge variant="outline" className="ml-auto">Automático</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {error ? (
          <Alert className="border-red-300 bg-red-50">
            <AlertDescription className="text-red-800">
              <strong>Erro:</strong> {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Status da Formulação Atual */}
            {currentFormulation && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <h4 className="font-semibold text-blue-800 mb-3">Formulação Atual</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span><strong>Custo:</strong> R$ {currentFormulation.totalCost?.toFixed(4)}/kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span><strong>Energia:</strong> {currentFormulation.nutritionalProfile?.metabolizableEnergy} kcal/kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span><strong>Proteína:</strong> {currentFormulation.nutritionalProfile?.crudeProtein}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Otimização */}
            <div className="text-center">
              <Button
                onClick={runOptimization}
                disabled={!canOptimize || isOptimizing}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Otimizando com IA...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Otimizar Formulação
                  </>
                )}
              </Button>

              {isOptimizing && (
                <div className="mt-4 space-y-2">
                  <Progress value={70} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Analisando {ingredients.length} ingredientes para otimização...
                  </p>
                </div>
              )}
            </div>

            {/* Sugestões de Otimização */}
            {optimizations.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Otimizações Recomendadas ({optimizations.length})
                </h4>

                <div className="space-y-3">
                  {optimizations.map((suggestion, index) => {
                    const IconComponent = getSuggestionIcon(suggestion.type);
                    return (
                      <Card key={index} className={`border-2 ${getPriorityColor(suggestion.priority)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                suggestion.priority === 'high' ? 'bg-red-100' :
                                suggestion.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
                              }`}>
                                <IconComponent className={`w-4 h-4 ${
                                  suggestion.priority === 'high' ? 'text-red-600' :
                                  suggestion.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium mb-1">
                                  {suggestion.title}
                                </h5>
                                <p className="text-sm mb-3">
                                  {suggestion.description}
                                </p>
                                
                                {/* Impactos Esperados */}
                                {suggestion.impact && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {suggestion.impact.cost !== undefined && (
                                      <Badge variant="outline" className="text-xs">
                                        Custo: {suggestion.impact.cost > 0 ? '+' : ''}{(suggestion.impact.cost * 100).toFixed(1)}%
                                      </Badge>
                                    )}
                                    {suggestion.impact.nutrition && (
                                      <Badge variant="outline" className="text-xs">
                                        {suggestion.impact.nutrition}
                                      </Badge>
                                    )}
                                    {suggestion.impact.feasibility && (
                                      <Badge variant="outline" className="text-xs">
                                        Viabilidade: {suggestion.impact.feasibility}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.priority} prioridade
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {(suggestion.confidence * 100).toFixed(0)}% confiança
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {onOptimizationApply && (
                              <div className="flex gap-2 ml-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onOptimizationApply(suggestion)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Aplicar
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Resumo das Otimizações */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-green-800 mb-2">Resumo das Otimizações</h5>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
                      <div>
                        <strong>Total de Sugestões:</strong> {optimizations.length}
                      </div>
                      <div>
                        <strong>Alta Prioridade:</strong> {optimizations.filter(s => s.priority === 'high').length}
                      </div>
                      <div>
                        <strong>Confiança Média:</strong> {(optimizations.reduce((sum, s) => sum + s.confidence, 0) / optimizations.length * 100).toFixed(0)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIOptimizationEngine;
