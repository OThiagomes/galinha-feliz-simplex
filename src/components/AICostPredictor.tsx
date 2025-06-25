
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  Calendar,
  BarChart3,
  AlertTriangle,
  Zap,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formulationAI, AIPrediction } from '@/services/formulationAI';

interface AICostPredictorProps {
  ingredients: any[];
  onPredictionUpdate?: (prediction: AIPrediction) => void;
}

const AICostPredictor: React.FC<AICostPredictorProps> = ({
  ingredients,
  onPredictionUpdate
}) => {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPrediction = async () => {
    if (!formulationAI.isInitialized() || ingredients.length === 0) {
      setError('IA não configurada ou nenhum ingrediente disponível');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await formulationAI.predictCosts(ingredients);
      setPrediction(result);
      onPredictionUpdate?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na predição');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Dados simulados para o gráfico de tendências
  const trendData = prediction ? [
    { periodo: 'Hoje', valor: 1.0, tendencia: 'atual' },
    { periodo: '7 dias', valor: prediction.costForecast.next7Days, tendencia: 'previsao' },
    { periodo: '30 dias', valor: prediction.costForecast.next30Days, tendencia: 'previsao' },
  ] : [];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600 bg-red-50 border-red-200';
      case 'down': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span>Predição Inteligente de Custos</span>
          <Badge variant="outline" className="ml-auto">IA Preditiva</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!formulationAI.isInitialized() ? (
          <Alert className="border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Configure a chave da API NVIDIA nas configurações para habilitar predições.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert className="border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Erro:</strong> {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Botão de Análise */}
            <div className="text-center">
              <Button
                onClick={runPrediction}
                disabled={ingredients.length === 0 || isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analisando Tendências...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Prever Custos com IA
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="mt-4 space-y-2">
                  <Progress value={60} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Analisando {ingredients.length} ingredientes e tendências de mercado...
                  </p>
                </div>
              )}
            </div>

            {/* Resultados da Predição */}
            {prediction && (
              <div className="space-y-6">
                {/* Resumo da Tendência */}
                <div className={`p-4 rounded-lg border-2 ${getTrendColor(prediction.costForecast.trend)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(prediction.costForecast.trend)}
                      <h4 className="font-semibold">
                        Tendência: {prediction.costForecast.trend === 'up' ? 'Alta' : 
                                   prediction.costForecast.trend === 'down' ? 'Baixa' : 'Estável'}
                      </h4>
                    </div>
                    <Badge variant="outline">
                      {(prediction.costForecast.confidence * 100).toFixed(0)}% confiança
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white bg-opacity-50 rounded">
                      <div className="text-2xl font-bold">
                        {((prediction.costForecast.next7Days - 1) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">7 dias</div>
                    </div>
                    <div className="text-center p-3 bg-white bg-opacity-50 rounded">
                      <div className="text-2xl font-bold">
                        {((prediction.costForecast.next30Days - 1) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">30 dias</div>
                    </div>
                    <div className="text-center p-3 bg-white bg-opacity-50 rounded">
                      <div className="text-lg font-semibold">
                        {prediction.costForecast.trend === 'up' ? 'Compre Agora' : 
                         prediction.costForecast.trend === 'down' ? 'Aguarde' : 'Neutro'}
                      </div>
                      <div className="text-sm text-gray-600">Recomendação</div>
                    </div>
                  </div>
                </div>

                {/* Gráfico de Tendências */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Evolução Prevista de Custos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="periodo" />
                          <YAxis 
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          />
                          <Tooltip 
                            formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Variação']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="valor" 
                            stroke="#8884d8" 
                            strokeWidth={3}
                            dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights de Mercado */}
                {prediction.marketInsights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <DollarSign className="w-5 h-5" />
                        Insights de Mercado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {prediction.marketInsights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-sm text-blue-800">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Fatores Sazonais */}
                {prediction.seasonalFactors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <Calendar className="w-5 h-5" />
                        Fatores Sazonais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {prediction.seasonalFactors.map((factor, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                            <p className="text-sm text-orange-800">{factor}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICostPredictor;
