
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  RefreshCw,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { formulationAI, AIFormulationSuggestion, AIAnalysisResult } from '@/services/formulationAI';

interface AIFormulationInsightsProps {
  ingredients: any[];
  requirements: any;
  constraints: any[];
  currentFormulation?: any;
  onApplySuggestion?: (suggestion: AIFormulationSuggestion) => void;
}

const AIFormulationInsights: React.FC<AIFormulationInsightsProps> = ({
  ingredients,
  requirements,
  constraints,
  currentFormulation,
  onApplySuggestion
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Load API key from settings
    const settings = localStorage.getItem('formulator-settings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      if (parsedSettings.nvidiaApiKey) {
        setApiKey(parsedSettings.nvidiaApiKey);
        formulationAI.initialize(parsedSettings.nvidiaApiKey);
      }
    }
  }, []);

  const analyzeFormulation = async () => {
    if (!formulationAI.isInitialized()) {
      setError('Configure a chave da API NVIDIA nas configurações primeiro.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await formulationAI.analyzeFormulation({
        ingredients,
        requirements,
        constraints,
        currentFormulation,
        context: 'Análise completa de formulação para otimização'
      });

      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na análise de IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'improvement': return Lightbulb;
      default: return Zap;
    }
  };

  const getSuggestionColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-orange-300 bg-orange-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  const canAnalyze = ingredients.length > 0 && requirements && formulationAI.isInitialized();

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="w-5 h-5" />
          </div>
          <span>Análise Inteligente de Formulação</span>
          <Badge variant="outline" className="ml-auto">NVIDIA AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!formulationAI.isInitialized() ? (
          <Alert className="border-yellow-300 bg-yellow-50">
            <Settings className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Configure a IA:</strong> Adicione sua chave da API NVIDIA nas configurações para habilitar a análise inteligente.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert className="border-red-300 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Erro:</strong> {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Botão de Análise */}
            <div className="text-center">
              <Button
                onClick={analyzeFormulation}
                disabled={!canAnalyze || isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analisando com IA...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Analisar Formulação
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="mt-4 space-y-2">
                  <Progress value={75} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Processando {ingredients.length} ingredientes com NVIDIA AI...
                  </p>
                </div>
              )}
            </div>

            {/* Resultados da Análise */}
            {analysis && (
              <div className="space-y-4">
                {/* Avaliação Geral */}
                <Alert className="border-green-300 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Avaliação Geral:</strong> {analysis.overallAssessment}
                    <div className="mt-2">
                      <Badge variant="outline" className="text-green-700">
                        Confiança: {(analysis.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Sugestões de IA */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Sugestões Inteligentes ({analysis.suggestions.length})
                  </h4>
                  
                  {analysis.suggestions.map((suggestion, index) => {
                    const IconComponent = getSuggestionIcon(suggestion.type);
                    return (
                      <Card key={index} className={`border-2 ${getSuggestionColor(suggestion.priority)}`}>
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
                                <h5 className="font-medium text-gray-800 mb-1">
                                  {suggestion.title}
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">
                                  {suggestion.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.type}
                                  </Badge>
                                  <Badge variant="outline" className={`text-xs ${
                                    suggestion.priority === 'high' ? 'text-red-600' :
                                    suggestion.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                                  }`}>
                                    {suggestion.priority}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {(suggestion.confidence * 100).toFixed(0)}% confiança
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {onApplySuggestion && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onApplySuggestion(suggestion)}
                                className="ml-3"
                              >
                                Aplicar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Fatores de Risco */}
                {analysis.riskFactors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Fatores de Risco
                    </h4>
                    {analysis.riskFactors.map((risk, index) => (
                      <div key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {risk}
                      </div>
                    ))}
                  </div>
                )}

                {/* Oportunidades */}
                {analysis.opportunities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Oportunidades
                    </h4>
                    {analysis.opportunities.map((opportunity, index) => (
                      <div key={index} className="text-sm text-green-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {opportunity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIFormulationInsights;
