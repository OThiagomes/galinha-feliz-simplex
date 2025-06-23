
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';
import { UniversalNutritionalRequirement, NutritionalPhase, PHASE_NAMES } from '@/types/phases';

const RequirementsManager = () => {
  const { requirements, addRequirement, updateRequirement, deleteRequirement, resetToDefaults } = useUniversalRequirements();
  const [activeTab, setActiveTab] = useState('list');
  const [editingRequirement, setEditingRequirement] = useState<UniversalNutritionalRequirement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRequirement, setNewRequirement] = useState<Omit<UniversalNutritionalRequirement, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    phase: 'postura-1',
    isCustom: true,
    minMetabolizableEnergy: 2750,
    maxMetabolizableEnergy: 2850,
    minCrudeProtein: 16.0,
    maxCrudeProtein: 18.0,
    minCalcium: 3.8,
    maxCalcium: 4.2,
    minAvailablePhosphorus: 0.35,
    maxAvailablePhosphorus: 0.45,
    minLysine: 0.85,
    minMethionine: 0.45,
    minThreonine: 0.60,
    minTryptophan: 0.18,
    maxCrudeFiber: 6.0
  });

  const phaseGroups = {
    frango: ['pre-inicial', 'inicial', 'crescimento-1', 'crescimento-2', 'crescimento-3'],
    poedeira: ['pre-postura', 'postura-1', 'postura-2', 'postura-3', 'postura-4', 'postura-5']
  };

  const handleSaveNew = () => {
    if (newRequirement.name.trim()) {
      addRequirement(newRequirement);
      setShowAddForm(false);
      setNewRequirement({
        ...newRequirement,
        name: '',
        isCustom: true
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingRequirement) {
      updateRequirement(editingRequirement.id, editingRequirement);
      setEditingRequirement(null);
      setActiveTab('list');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta exigência nutricional?')) {
      deleteRequirement(id);
    }
  };

  const updateNewRequirement = (field: keyof typeof newRequirement, value: any) => {
    setNewRequirement(prev => ({ ...prev, [field]: value }));
  };

  const updateEditingRequirement = (field: keyof UniversalNutritionalRequirement, value: any) => {
    if (editingRequirement) {
      setEditingRequirement(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const getPhaseColor = (phase: NutritionalPhase) => {
    if (phaseGroups.frango.includes(phase)) return 'bg-blue-100 text-blue-800';
    if (phaseGroups.poedeira.includes(phase)) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const RequirementForm = ({ 
    requirement, 
    onUpdate, 
    onSave, 
    onCancel, 
    title 
  }: {
    requirement: any;
    onUpdate: (field: string, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
    title: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Target className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome da Exigência</Label>
            <Input
              id="name"
              value={requirement.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="Ex: Poedeira Comercial - Peak"
            />
          </div>
          <div>
            <Label htmlFor="phase">Fase Nutricional</Label>
            <Select
              value={requirement.phase}
              onValueChange={(value) => onUpdate('phase', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem disabled value="">-- Frango de Corte --</SelectItem>
                {phaseGroups.frango.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {PHASE_NAMES[phase as NutritionalPhase]}
                  </SelectItem>
                ))}
                <SelectItem disabled value="">-- Poedeiras --</SelectItem>
                {phaseGroups.poedeira.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {PHASE_NAMES[phase as NutritionalPhase]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Energia Metabolizável (kcal/kg)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mínimo</Label>
                <Input
                  type="number"
                  value={requirement.minMetabolizableEnergy}
                  onChange={(e) => onUpdate('minMetabolizableEnergy', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Máximo</Label>
                <Input
                  type="number"
                  value={requirement.maxMetabolizableEnergy}
                  onChange={(e) => onUpdate('maxMetabolizableEnergy', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <h4 className="font-semibold text-blue-700">Proteína Bruta (%)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mínimo</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={requirement.minCrudeProtein}
                  onChange={(e) => onUpdate('minCrudeProtein', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Máximo</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={requirement.maxCrudeProtein}
                  onChange={(e) => onUpdate('maxCrudeProtein', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <h4 className="font-semibold text-green-700">Cálcio (%)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mínimo</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={requirement.minCalcium}
                  onChange={(e) => onUpdate('minCalcium', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Máximo</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={requirement.maxCalcium}
                  onChange={(e) => onUpdate('maxCalcium', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <h4 className="font-semibold text-purple-700">Fósforo Disponível (%)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mínimo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={requirement.minAvailablePhosphorus}
                  onChange={(e) => onUpdate('minAvailablePhosphorus', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Máximo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={requirement.maxAvailablePhosphorus}
                  onChange={(e) => onUpdate('maxAvailablePhosphorus', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg">
          <h4 className="font-semibold text-gray-700">Aminoácidos Digestíveis (%)</h4>
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <Label>Lisina (mín)</Label>
              <Input
                type="number"
                step="0.01"
                value={requirement.minLysine}
                onChange={(e) => onUpdate('minLysine', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Metionina (mín)</Label>
              <Input
                type="number"
                step="0.01"
                value={requirement.minMethionine}
                onChange={(e) => onUpdate('minMethionine', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Treonina (mín)</Label>
              <Input
                type="number"
                step="0.01"
                value={requirement.minThreonine || ''}
                onChange={(e) => onUpdate('minThreonine', parseFloat(e.target.value) || undefined)}
              />
            </div>
            <div>
              <Label>Triptofano (mín)</Label>
              <Input
                type="number"
                step="0.01"
                value={requirement.minTryptophan || ''}
                onChange={(e) => onUpdate('minTryptophan', parseFloat(e.target.value) || undefined)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
          <h4 className="font-semibold text-red-700">Outros</h4>
          <div>
            <Label>Fibra Bruta (% máx)</Label>
            <Input
              type="number"
              step="0.1"
              value={requirement.maxCrudeFiber}
              onChange={(e) => onUpdate('maxCrudeFiber', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Exigência
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Exigências Nutricionais</h2>
              <p className="text-orange-100">Gerencie perfis nutricionais para formulação</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setActiveTab('add');
              }}
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Exigência
            </Button>
            <Button
              onClick={() => {
                if (confirm('Isso irá restaurar todas as exigências padrão. Continuar?')) {
                  resetToDefaults();
                }
              }}
              variant="ghost"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrões
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Lista de Exigências</TabsTrigger>
          {showAddForm && <TabsTrigger value="add">Nova Exigência</TabsTrigger>}
          {editingRequirement && <TabsTrigger value="edit">Editar Exigência</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Resumo por Categoria */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-blue-700">🐤 Frango de Corte</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {requirements
                    .filter(req => phaseGroups.frango.includes(req.phase))
                    .map(req => (
                      <div key={req.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">{req.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingRequirement(req);
                              setActiveTab('edit');
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          {req.isCustom && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(req.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-green-700">🥚 Poedeiras</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {requirements
                    .filter(req => phaseGroups.poedeira.includes(req.phase))
                    .map(req => (
                      <div key={req.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">{req.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingRequirement(req);
                              setActiveTab('edit');
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          {req.isCustom && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(req.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista Completa */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as Exigências ({requirements.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requirements.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{req.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPhaseColor(req.phase)}>
                            {PHASE_NAMES[req.phase]}
                          </Badge>
                          {req.isCustom && (
                            <Badge variant="outline" className="text-xs">
                              Personalizado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="text-right">
                        <div><strong>Energia:</strong> {req.minMetabolizableEnergy}-{req.maxMetabolizableEnergy} kcal/kg</div>
                        <div><strong>Proteína:</strong> {req.minCrudeProtein}-{req.maxCrudeProtein}%</div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingRequirement(req);
                            setActiveTab('edit');
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        {req.isCustom && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(req.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <RequirementForm
            requirement={newRequirement}
            onUpdate={updateNewRequirement}
            onSave={handleSaveNew}
            onCancel={() => {
              setShowAddForm(false);
              setActiveTab('list');
            }}
            title="Nova Exigência Nutricional"
          />
        </TabsContent>

        <TabsContent value="edit">
          {editingRequirement && (
            <RequirementForm
              requirement={editingRequirement}
              onUpdate={updateEditingRequirement}
              onSave={handleSaveEdit}
              onCancel={() => {
                setEditingRequirement(null);
                setActiveTab('list');
              }}
              title={`Editando: ${editingRequirement.name}`}
            />
          )}
        </TabsContent>
      </Tabs>

      {requirements.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Nenhuma exigência nutricional encontrada. Clique em "Restaurar Padrões" para carregar as exigências básicas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RequirementsManager;
