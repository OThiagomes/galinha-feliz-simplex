
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { UniversalNutritionalRequirement, NutritionalPhase, PHASE_NAMES } from '@/types/phases';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';

const UniversalRequirementsManager: React.FC = () => {
  const { requirements, addRequirement, updateRequirement, deleteRequirement } = useUniversalRequirements();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState<Partial<UniversalNutritionalRequirement>>({
    name: '',
    phase: 'custom',
    isCustom: true,
    minMetabolizableEnergy: 2750,
    maxMetabolizableEnergy: 2850,
    minCrudeProtein: 16.0,
    maxCrudeProtein: 18.0,
    minCalcium: 3.8,
    maxCalcium: 4.2,
    minAvailablePhosphorus: 0.35,
    maxAvailablePhosphorus: 0.45,
    minLysine: 0.75,
    minMethionine: 0.38,
    maxCrudeFiber: 6.0
  });

  const handleSubmit = () => {
    if (!formData.name?.trim()) return;

    if (editingId) {
      updateRequirement(editingId, formData);
      setEditingId(null);
    } else {
      addRequirement(formData as Omit<UniversalNutritionalRequirement, 'id' | 'createdAt' | 'updatedAt'>);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phase: 'custom',
      isCustom: true,
      minMetabolizableEnergy: 2750,
      maxMetabolizableEnergy: 2850,
      minCrudeProtein: 16.0,
      maxCrudeProtein: 18.0,
      minCalcium: 3.8,
      maxCalcium: 4.2,
      minAvailablePhosphorus: 0.35,
      maxAvailablePhosphorus: 0.45,
      minLysine: 0.75,
      minMethionine: 0.38,
      maxCrudeFiber: 6.0
    });
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (req: UniversalNutritionalRequirement) => {
    setFormData(req);
    setEditingId(req.id);
    setShowForm(true);
  };

  const toggleDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateField = (field: keyof UniversalNutritionalRequirement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-blue-700">
            <span>Exigências Nutricionais Universais</span>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} size="sm" className="bg-blue-600">
                <Plus className="w-4 h-4 mr-1" />
                Nova
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-4 bg-blue-50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Ex: Postura Personalizada"
                    />
                  </div>
                  <div>
                    <Label>Fase</Label>
                    <Select value={formData.phase} onValueChange={(value) => updateField('phase', value as NutritionalPhase)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PHASE_NAMES).map(([key, name]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Energia Min (kcal/kg)</Label>
                    <Input
                      type="number"
                      value={formData.minMetabolizableEnergy || ''}
                      onChange={(e) => updateField('minMetabolizableEnergy', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Energia Max (kcal/kg)</Label>
                    <Input
                      type="number"
                      value={formData.maxMetabolizableEnergy || ''}
                      onChange={(e) => updateField('maxMetabolizableEnergy', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Proteína Min (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.minCrudeProtein || ''}
                      onChange={(e) => updateField('minCrudeProtein', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Proteína Max (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.maxCrudeProtein || ''}
                      onChange={(e) => updateField('maxCrudeProtein', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Cálcio Min (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.minCalcium || ''}
                      onChange={(e) => updateField('minCalcium', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Cálcio Max (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.maxCalcium || ''}
                      onChange={(e) => updateField('maxCalcium', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Lisina Min (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.minLysine || ''}
                      onChange={(e) => updateField('minLysine', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Metionina Min (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.minMethionine || ''}
                      onChange={(e) => updateField('minMethionine', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="bg-green-600">
                    {editingId ? 'Salvar' : 'Adicionar'}
                  </Button>
                  <Button onClick={resetForm} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {requirements.map((req) => (
              <Card key={req.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{req.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{PHASE_NAMES[req.phase]}</Badge>
                          {req.isCustom && <Badge variant="outline">Personalizado</Badge>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(req.id)}
                      >
                        {showDetails[req.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(req)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      {req.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRequirement(req.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {showDetails[req.id] && (
                    <div className="mt-3 pt-3 border-t grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Energia:</span>
                        <br />
                        {req.minMetabolizableEnergy} - {req.maxMetabolizableEnergy} kcal/kg
                      </div>
                      <div>
                        <span className="font-medium">Proteína:</span>
                        <br />
                        {req.minCrudeProtein} - {req.maxCrudeProtein}%
                      </div>
                      <div>
                        <span className="font-medium">Cálcio:</span>
                        <br />
                        {req.minCalcium} - {req.maxCalcium}%
                      </div>
                      <div>
                        <span className="font-medium">Lisina:</span>
                        <br />
                        {req.minLysine}% (mín)
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalRequirementsManager;
