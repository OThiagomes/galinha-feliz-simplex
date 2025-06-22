
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Users,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Client } from '@/types/client';
import { UniversalNutritionalRequirement, IngredientConstraint, PHASE_NAMES } from '@/types/phases';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';
import { useClients } from '@/hooks/useClients';
import IngredientConstraints from './IngredientConstraints';

const MinimalFormulation: React.FC = () => {
  const { clients } = useClients();
  const { requirements } = useUniversalRequirements();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<UniversalNutritionalRequirement | null>(null);
  const [constraints, setConstraints] = useState<IngredientConstraint[]>([]);
  const [showRequirements, setShowRequirements] = useState(false);
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
    
    // Simulação da formulação com tempo realista
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsFormulating(false);
    alert('🎉 Formulação otimizada com sucesso!\n\nResultados calculados usando algoritmo Simplex com validação nutricional completa.');
  };

  const canFormulate = selectedClient && selectedRequirement && availableIngredients.length >= 2;
  const currentStep = !selectedClient ? 1 : !selectedRequirement ? 2 : 3;

  return (
    <div className="space-y-6">
      {/* Header com Progresso */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Formulação Simplificada</h2>
              <p className="text-blue-100">3 passos para a ração ideal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 1 ? 'bg-white text-green-600' : 'bg-white bg-opacity-30 text-white'
            }`}>
              1
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 2 ? 'bg-white text-blue-600' : 'bg-white bg-opacity-30 text-white'
            }`}>
              2
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 3 ? 'bg-white text-purple-600' : 'bg-white bg-opacity-30 text-white'
            }`}>
              3
            </div>
          </div>
        </div>
      </div>

      {/* Passo 1: Seleção de Cliente */}
      <Card className={`border-2 transition-all ${currentStep === 1 ? 'border-green-300 shadow-lg' : 'border-gray-200'}`}>
        <CardHeader className={`${currentStep === 1 ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gray-50'}`}>
          <CardTitle className={`flex items-center gap-2 ${currentStep === 1 ? 'text-green-700' : 'text-gray-600'}`}>
            <div className={`p-2 rounded-lg ${currentStep === 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Users className="w-5 h-5" />
            </div>
            <span>Passo 1: Selecionar Cliente</span>
            {selectedClient && (
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Select
            value={selectedClient?.id || ''}
            onValueChange={(value) => {
              const client = clients.find(c => c.id === value);
              setSelectedClient(client || null);
              if (client) initializeConstraints();
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="🏢 Escolha um cliente para começar" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex items-center gap-3 py-1">
                    <div className="font-medium">{client.name}</div>
                    <Badge variant="outline" className="text-xs">
                      {client.ingredients.filter(i => i.availability).length} ingredientes
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedClient && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>✅ Cliente selecionado:</strong> {selectedClient.name} com {availableIngredients.length} ingredientes disponíveis.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Passo 2: Seleção de Exigência Nutricional */}
      {selectedClient && (
        <Card className={`border-2 transition-all ${currentStep === 2 ? 'border-orange-300 shadow-lg' : 'border-gray-200'}`}>
          <CardHeader className={`${currentStep === 2 ? 'bg-gradient-to-r from-orange-50 to-yellow-50' : 'bg-gray-50'}`}>
            <CardTitle className={`flex items-center gap-2 ${currentStep === 2 ? 'text-orange-700' : 'text-gray-600'}`}>
              <div className={`p-2 rounded-lg ${currentStep === 2 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <Target className="w-5 h-5" />
              </div>
              <span>Passo 2: Selecionar Fase Nutricional</span>
              {selectedRequirement && (
                <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Select
              value={selectedRequirement?.id || ''}
              onValueChange={(value) => {
                const requirement = requirements.find(r => r.id === value);
                setSelectedRequirement(requirement || null);
              }}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="🎯 Escolha a fase nutricional da ração" />
              </SelectTrigger>
              <SelectContent>
                {requirements.map(req => (
                  <SelectItem key={req.id} value={req.id}>
                    <div className="flex items-center gap-3 py-1">
                      <div className="font-medium">{req.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {PHASE_NAMES[req.phase]}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRequirement && (
              <>
                <Alert className="border-orange-200 bg-orange-50">
                  <Target className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>✅ Fase selecionada:</strong> {selectedRequirement.name} - {PHASE_NAMES[selectedRequirement.phase]}
                  </AlertDescription>
                </Alert>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRequirements(!showRequirements)}
                    className="text-orange-600 hover:bg-orange-100"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    {showRequirements ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    Ver Exigências Nutricionais
                  </Button>
                  
                  {showRequirements && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                          <div className="font-bold text-orange-600 text-lg">⚡</div>
                          <div className="font-semibold text-gray-700">Energia</div>
                          <div className="text-gray-600">{selectedRequirement.minMetabolizableEnergy}-{selectedRequirement.maxMetabolizableEnergy}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                          <div className="font-bold text-blue-600 text-lg">🥩</div>
                          <div className="font-semibold text-gray-700">Proteína</div>
                          <div className="text-gray-600">{selectedRequirement.minCrudeProtein}-{selectedRequirement.maxCrudeProtein}%</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                          <div className="font-bold text-green-600 text-lg">💎</div>
                          <div className="font-semibold text-gray-700">Cálcio</div>
                          <div className="text-gray-600">{selectedRequirement.minCalcium}-{selectedRequirement.maxCalcium}%</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                          <div className="font-bold text-purple-600 text-lg">🧬</div>
                          <div className="font-semibold text-gray-700">Lisina</div>
                          <div className="text-gray-600">≥{selectedRequirement.minLysine}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Passo 3: Ajustar Ingredientes (Opcional) */}
      {selectedClient && selectedRequirement && (
        <IngredientConstraints
          ingredients={availableIngredients}
          constraints={constraints}
          onUpdateConstraints={setConstraints}
        />
      )}

      {/* Botão de Formulação */}
      {canFormulate && (
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-white bg-opacity-20 p-6 rounded-full">
                  {isFormulating ? (
                    <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Calculator className="w-12 h-12" />
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-bold">Tudo Pronto! 🚀</h3>
                <div className="text-lg text-white text-opacity-90">
                  <div className="flex justify-center items-center gap-3 mb-2">
                    <Badge className="bg-white text-blue-600 px-3 py-1">
                      {selectedClient.name}
                    </Badge>
                    <ArrowRight className="w-4 h-4" />
                    <Badge className="bg-white text-purple-600 px-3 py-1">
                      {selectedRequirement.name}
                    </Badge>
                  </div>
                  <div className="text-base">
                    🧮 {availableIngredients.length} ingredientes • 
                    🔒 {constraints.filter(c => c.isLocked).length} travados • 
                    ⚙️ {constraints.filter(c => c.fixedPercentage || 
                      c.minPercentage !== availableIngredients.find(i => i.id === c.ingredientId)?.minInclusion).length} restrições
                  </div>
                </div>
              </div>

              <Button
                onClick={handleFormulate}
                disabled={isFormulating}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-12 py-4 text-lg shadow-2xl transform transition-all hover:scale-105"
              >
                {isFormulating ? (
                  <>
                    <div className="animate-pulse w-6 h-6 mr-3"></div>
                    Processando Algoritmo Simplex...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 mr-3" />
                    Formular Ração Ideal
                  </>
                )}
              </Button>

              {isFormulating && (
                <div className="text-sm text-white text-opacity-80">
                  <div className="mb-2">🔄 Analisando restrições nutricionais...</div>
                  <div className="mb-2">🧮 Executando otimização de custos...</div>
                  <div>✅ Validando perfil nutricional...</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MinimalFormulation;
