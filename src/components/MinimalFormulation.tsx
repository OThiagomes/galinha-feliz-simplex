
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Settings, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';
import { Client } from '@/types/client';
import { UniversalNutritionalRequirement, IngredientConstraint, PHASE_NAMES } from '@/types/phases';
import { Ingredient } from '@/types/nutrition';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';
import { useClients } from '@/hooks/useClients';

const MinimalFormulation: React.FC = () => {
  const { clients } = useClients();
  const { requirements } = useUniversalRequirements();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<UniversalNutritionalRequirement | null>(null);
  const [constraints, setConstraints] = useState<IngredientConstraint[]>([]);
  const [showConstraints, setShowConstraints] = useState(false);
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

  const updateConstraint = (ingredientId: string, field: keyof IngredientConstraint, value: any) => {
    setConstraints(prev => prev.map(c => 
      c.ingredientId === ingredientId 
        ? { ...c, [field]: value }
        : c
    ));
  };

  const toggleLock = (ingredientId: string) => {
    setConstraints(prev => prev.map(c => 
      c.ingredientId === ingredientId 
        ? { ...c, isLocked: !c.isLocked }
        : c
    ));
  };

  const handleFormulate = async () => {
    if (!selectedClient || !selectedRequirement) return;
    
    setIsFormulating(true);
    
    // Simulação da formulação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsFormulating(false);
    alert('Formulação concluída! (Esta é uma simulação)');
  };

  const canFormulate = selectedClient && selectedRequirement && availableIngredients.length >= 2;

  return (
    <div className="space-y-4">
      {/* Seleção de Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700">1. Selecionar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedClient?.id || ''}
            onValueChange={(value) => {
              const client = clients.find(c => c.id === value);
              setSelectedClient(client || null);
              if (client) initializeConstraints();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({client.ingredients.filter(i => i.availability).length} ingredientes)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Seleção de Exigência Nutricional */}
      {selectedClient && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">2. Selecionar Fase Nutricional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select
                value={selectedRequirement?.id || ''}
                onValueChange={(value) => {
                  const requirement = requirements.find(r => r.id === value);
                  setSelectedRequirement(requirement || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a fase nutricional" />
                </SelectTrigger>
                <SelectContent>
                  {requirements.map(req => (
                    <SelectItem key={req.id} value={req.id}>
                      {req.name} - {PHASE_NAMES[req.phase]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRequirement && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRequirements(!showRequirements)}
                    className="text-orange-600"
                  >
                    {showRequirements ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    Ver Exigências
                  </Button>
                  
                  {showRequirements && (
                    <div className="mt-2 p-3 bg-orange-50 rounded grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>Energia: {selectedRequirement.minMetabolizableEnergy}-{selectedRequirement.maxMetabolizableEnergy}</div>
                      <div>Proteína: {selectedRequirement.minCrudeProtein}-{selectedRequirement.maxCrudeProtein}%</div>
                      <div>Cálcio: {selectedRequirement.minCalcium}-{selectedRequirement.maxCalcium}%</div>
                      <div>Lisina: {selectedRequirement.minLysine}% (mín)</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restrições de Ingredientes */}
      {selectedClient && selectedRequirement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-purple-700">
              <span>3. Ajustar Ingredientes (Opcional)</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConstraints(!showConstraints)}
              >
                <Settings className="w-4 h-4 mr-1" />
                {showConstraints ? 'Ocultar' : 'Mostrar'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showConstraints && (
            <CardContent>
              <div className="space-y-2">
                {availableIngredients.map(ingredient => {
                  const constraint = constraints.find(c => c.ingredientId === ingredient.id);
                  if (!constraint) return null;

                  return (
                    <div key={ingredient.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div className="flex-1 font-medium text-sm">
                        {ingredient.name}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Min:</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={constraint.minPercentage || ''}
                            onChange={(e) => updateConstraint(ingredient.id, 'minPercentage', parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                            disabled={constraint.isLocked}
                          />
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Max:</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={constraint.maxPercentage || ''}
                            onChange={(e) => updateConstraint(ingredient.id, 'maxPercentage', parseFloat(e.target.value) || 100)}
                            className="w-16 h-8 text-xs"
                            disabled={constraint.isLocked}
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Fixo:</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={constraint.fixedPercentage || ''}
                            onChange={(e) => updateConstraint(ingredient.id, 'fixedPercentage', parseFloat(e.target.value) || undefined)}
                            className="w-16 h-8 text-xs"
                            placeholder="--"
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLock(ingredient.id)}
                          className={constraint.isLocked ? 'text-red-600' : 'text-gray-400'}
                        >
                          {constraint.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Botão de Formulação */}
      {canFormulate && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div>
                <Badge className="bg-white text-blue-600 mb-2">
                  {selectedClient.name} • {selectedRequirement.name}
                </Badge>
                <div className="text-sm opacity-90">
                  {availableIngredients.length} ingredientes • {constraints.filter(c => c.isLocked).length} travados
                </div>
              </div>
              
              <Button
                onClick={handleFormulate}
                disabled={isFormulating}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {isFormulating ? 'Formulando...' : 'Formular Ração'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MinimalFormulation;
