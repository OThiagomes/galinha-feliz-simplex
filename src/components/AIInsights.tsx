
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  Target,
  DollarSign,
  Activity,
  Zap,
  RefreshCw,
  Download,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, AIInsight, PricePredictor, FormulationOptimization } from '@/services/aiService';

interface AIInsightsProps {
  ingredients: any[];
  requirements: any;
  constraints: any[];
  currentResult: any;
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  ingredients, 
  requirements, 
  constraints, 
  currentResult 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<PricePredictor[]>([]);
  const [optimization, setOptimization] = useState<FormulationOptimization | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInitialized, setAiInitialized] = useState(false);

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    if (aiInitialized && ingredients.length > 0) {
      performAIAnalysis();
    }
  }, [ingredients, requirements, constraints, aiInitialized]);

  const initializeAI = async () => {
    try {
      await aiService.initialize();
      setAiInitialized(true);
    } catch (error) {
      console.error('Failed to initialize AI:', error);
    }
  };

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Análise de insights
      const aiInsights = await aiService.analyzeFormulation(ingredients, requirements, constraints);
      setInsights(aiInsights);

      // Predições de preços
      const pricePredictions = await aiService.predictPrices(ingredients);
      setPredictions(pricePredictions);

      // Otimização
      if (currentResult) {
        const optimizationResult = await aiService.optimizeFormulation(currentResult);
        setOptimization(optimizationResult);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="w-5 h-5" />;
      case 'prediction': return <TrendingUp className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Análise de IA Avançada</h3>
              <p className="text-purple-100">Insights inteligentes com TensorFlow e Machine Learning</p>
            </div>
            {isAnalyzing && (
              <div className="ml-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Status da IA */}
      <Alert className={`border-2 ${aiInitialized ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
        <Brain className={`h-5 w-5 ${aiInitialized ? 'text-green-600' : 'text-yellow-600'}`} />
        <AlertDescription className={aiInitialized ? 'text-green-800' : 'text-yellow-800'}>
          <div className="flex items-center justify-between">
            <div>
              <strong>Status da IA:</strong> {aiInitialized ? '🟢 Ativa e Operacional' : '🟡 Inicializando...'}
            </div>
            {aiInitialized && (
              <Badge variant="outline" className="bg-white">
                <Sparkles className="w-4 h-4 mr-1" />
                TensorFlow.js Ready
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Insights de IA */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Insights Inteligentes ({insights.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Alert className={`border-2 ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {(insight.confidence * 100).toFixed(0)}% confiança
                            </Badge>
                            <Badge variant={insight.actionable ? 'default' : 'secondary'} className="text-xs">
                              {insight.actionable ? 'Acionável' : 'Informativo'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm">{insight.description}</p>
                        {insight.actionable && (
                          <Button size="sm" className="mt-2" variant="outline">
                            <Zap className="w-4 h-4 mr-1" />
                            Aplicar Sugestão
                          </Button>
                        )}
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Predições de Preços */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Predições de Preços IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.slice(0, 6).map((pred, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{pred.ingredient}</h5>
                    <div className="flex items-center gap-1">
                      {pred.trend === 'rising' ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      ) : pred.trend === 'falling' ? (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Atual:</span>
                      <span className="font-semibold">R$ {pred.currentPrice.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Previsto:</span>
                      <span className={`font-semibold ${
                        pred.predictedPrice > pred.currentPrice ? 'text-red-600' : 'text-green-600'
                      }`}>
                        R$ {pred.predictedPrice.toFixed(3)}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Confiança</span>
                        <span>{(pred.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={pred.confidence * 100} className="h-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Otimização IA */}
      {optimization && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="w-5 h-5" />
              Otimização Sugerida pela IA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  R$ {optimization.currentCost.toFixed(4)}
                </div>
                <div className="text-sm text-red-700 font-medium">Custo Atual</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  R$ {optimization.optimizedCost.toFixed(4)}
                </div>
                <div className="text-sm text-green-700 font-medium">Custo Otimizado</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {optimization.savingsPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-700 font-medium">Economia Prevista</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Modificações Sugeridas:</h4>
              {optimization.modifications.map((mod, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{mod.ingredient}</span>
                    <p className="text-sm text-gray-600">{mod.impact}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {mod.currentPercentage.toFixed(1)}% → {mod.suggestedPercentage.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${
                      mod.suggestedPercentage > mod.currentPercentage ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {mod.suggestedPercentage > mod.currentPercentage ? '+' : ''}
                      {(mod.suggestedPercentage - mod.currentPercentage).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Avaliação de Risco:</strong> {optimization.riskAssessment}
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 mt-4">
              <Button className="flex-1">
                <Target className="w-4 h-4 mr-2" />
                Aplicar Otimização
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Relatório IA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <div className="flex gap-3">
        <Button 
          onClick={performAIAnalysis} 
          disabled={isAnalyzing || !aiInitialized}
          className="flex-1"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Brain className="w-4 h-4 mr-2" />
          )}
          {isAnalyzing ? 'Analisando...' : 'Nova Análise IA'}
        </Button>
        
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Insights
        </Button>
      </div>
    </div>
  );
};

export default AIInsights;
