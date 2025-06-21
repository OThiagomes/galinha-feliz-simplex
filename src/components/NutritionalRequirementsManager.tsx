
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NutritionalRequirement } from '@/types/nutrition';

interface NutritionalRequirementsManagerProps {
  requirements: NutritionalRequirement[];
  selectedRequirement: NutritionalRequirement | null;
  onRequirementsChange: (requirements: NutritionalRequirement[]) => void;
  onSelectedRequirementChange: (requirement: NutritionalRequirement | null) => void;
}

const NutritionalRequirementsManager: React.FC<NutritionalRequirementsManagerProps> = ({
  requirements,
  selectedRequirement,
  onRequirementsChange,
  onSelectedRequirementChange
}) => {
  const [activeTab, setActiveTab] = useState('profiles');

  const phaseProfiles = {
    'pre-lay': { name: 'Pré-postura', weeks: '16-18', color: 'bg-purple-100 text-purple-800' },
    'early-lay': { name: 'Início Postura', weeks: '18-25', color: 'bg-blue-100 text-blue-800' },
    'peak-lay': { name: 'Pico Postura', weeks: '25-45', color: 'bg-green-100 text-green-800' },
    'post-peak': { name: 'Pós-pico', weeks: '45-72', color: 'bg-yellow-100 text-yellow-800' },
    'end-lay': { name: 'Final Postura', weeks: '72+', color: 'bg-red-100 text-red-800'  }
  };

  const strainNames = {
    'hy-line-w36': 'Hy-Line W-36',
    'lohmann-lsl': 'Lohmann LSL',
    'bovans-white': 'Bovans White',
    'hy-line-brown': 'Hy-Line Brown',
    'lohmann-brown': 'Lohmann Brown',
    'isa-brown': 'ISA Brown',
    'caipira': 'Caipira',
    'colonial': 'Colonial'
  };

  const createDefaultRequirement = (phase: string): NutritionalRequirement => {
    const baseRequirements = {
      'pre-lay': {
        minMetabolizableEnergy: 2800, maxMetabolizableEnergy: 2900,
        minCrudeProtein: 17.0, maxCrudeProtein: 18.0,
        minCalcium: 2.0, maxCalcium: 2.5,
        minAvailablePhosphorus: 0.42, maxAvailablePhosphorus: 0.45,
        minLysine: 0.85, minMethionine: 0.45
      },
      'early-lay': {
        minMetabolizableEnergy: 2750, maxMetabolizableEnergy: 2850,
        minCrudeProtein: 17.5, maxCrudeProtein: 18.5,
        minCalcium: 3.8, maxCalcium: 4.0,
        minAvailablePhosphorus: 0.38, maxAvailablePhosphorus: 0.42,
        minLysine: 0.88, minMethionine: 0.48
      },
      'peak-lay': {
        minMetabolizableEnergy: 2750, maxMetabolizableEnergy: 2800,
        minCrudeProtein: 16.5, maxCrudeProtein: 17.5,
        minCalcium: 4.0, maxCalcium: 4.2,
        minAvailablePhosphorus: 0.35, maxAvailablePhosphorus: 0.38,
        minLysine: 0.85, minMethionine: 0.45
      },
      'post-peak': {
        minMetabolizableEnergy: 2700, maxMetabolizableEnergy: 2750,
        minCrudeProtein: 15.5, maxCrudeProtein: 16.5,
        minCalcium: 4.2, maxCalcium: 4.5,
        minAvailablePhosphorus: 0.32, maxAvailablePhosphorus: 0.35,
        minLysine: 0.80, minMethionine: 0.42
      },
      'end-lay': {
        minMetabolizableEnergy: 2650, maxMetabolizableEnergy: 2700,
        minCrudeProtein: 15.0, maxCrudeProtein: 16.0,
        minCalcium: 4.3, maxCalcium: 4.6,
        minAvailablePhosphorus: 0.30, maxAvailablePhosphorus: 0.33,
        minLysine: 0.75, minMethionine: 0.40
      }
    };

    const base = baseRequirements[phase as keyof typeof baseRequirements] || baseRequirements['peak-lay'];
    
    return {
      profileName: `${phaseProfiles[phase as keyof typeof phaseProfiles]?.name || 'Perfil'} - Padrão`,
      phase: phase as any,
      ...base,
      maxCrudeFiber: 6.0
    };
  };

  const handleAddProfile = (phase: string) => {
    const newRequirement = createDefaultRequirement(phase);
    const updatedRequirements = [...requirements, newRequirement];
    onRequirementsChange(updatedRequirements);
    onSelectedRequirementChange(newRequirement);
  };

  const updateRequirementField = (field: keyof NutritionalRequirement, value: any) => {
    if (!selectedRequirement) return;
    
    const updatedRequirement = {
      ...selectedRequirement,
      [field]: value
    };
    
    const updatedRequirements = requirements.map(req => 
      req === selectedRequirement ? updatedRequirement : req
    );
    
    onRequirementsChange(updatedRequirements);
    onSelectedRequirementChange(updatedRequirement);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profiles">Perfis Disponíveis</TabsTrigger>
          <TabsTrigger value="details">Detalhes do Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(phaseProfiles).map(([phase, info]) => (
              <Card key={phase} className="relative">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Badge className={info.color + ' mb-2'}>{info.weeks} sem</Badge>
                    <h3 className="font-medium text-sm mb-2">{info.name}</h3>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      {requirements.filter(req => req.phase === phase).map((req, idx) => (
                        <div 
                          key={idx}
                          className={`p-1 rounded cursor-pointer ${
                            selectedRequirement === req ? 'bg-blue-100' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => onSelectedRequirementChange(req)}
                        >
                          {req.profileName}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAddProfile(phase)}
                      className="w-full"
                    >
                      Novo Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          {selectedRequirement ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Editando: {selectedRequirement.profileName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profileName">Nome do Perfil</Label>
                    <Input
                      id="profileName"
                      value={selectedRequirement.profileName}
                      onChange={(e) => updateRequirementField('profileName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="strain">Linhagem</Label>
                    <Select
                      value={selectedRequirement.strain || ''}
                      onValueChange={(value) => updateRequirementField('strain', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a linhagem" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(strainNames).map(([key, name]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Energia */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-700">Energia Metabolizável (kcal/kg)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="minEnergy">Mínimo</Label>
                        <Input
                          id="minEnergy"
                          type="number"
                          value={selectedRequirement.minMetabolizableEnergy}
                          onChange={(e) => updateRequirementField('minMetabolizableEnergy', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxEnergy">Máximo</Label>
                        <Input
                          id="maxEnergy"
                          type="number"
                          value={selectedRequirement.maxMetabolizableEnergy}
                          onChange={(e) => updateRequirementField('maxMetabolizableEnergy', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Proteína */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-700">Proteína Bruta (%)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="minProtein">Mínimo</Label>
                        <Input
                          id="minProtein"
                          type="number"
                          step="0.1"
                          value={selectedRequirement.minCrudeProtein}
                          onChange={(e) => updateRequirementField('minCrudeProtein', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxProtein">Máximo</Label>
                        <Input
                          id="maxProtein"
                          type="number"
                          step="0.1"
                          value={selectedRequirement.maxCrudeProtein}
                          onChange={(e) => updateRequirementField('maxCrudeProtein', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cálcio */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-700">Cálcio (%)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="minCalcium">Mínimo</Label>
                        <Input
                          id="minCalcium"
                          type="number"
                          step="0.1"
                          value={selectedRequirement.minCalcium}
                          onChange={(e) => updateRequirementField('minCalcium', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxCalcium">Máximo</Label>
                        <Input
                          id="maxCalcium"
                          type="number"
                          step="0.1"
                          value={selectedRequirement.maxCalcium}
                          onChange={(e) => updateRequirementField('maxCalcium', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fósforo */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-700">Fósforo Disponível (%)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="minPhosphorus">Mínimo</Label>
                        <Input
                          id="minPhosphorus"
                          type="number"
                          step="0.01"
                          value={selectedRequirement.minAvailablePhosphorus}
                          onChange={(e) => updateRequirementField('minAvailablePhosphorus', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxPhosphorus">Máximo</Label>
                        <Input
                          id="maxPhosphorus"
                          type="number"
                          step="0.01"
                          value={selectedRequirement.maxAvailablePhosphorus}
                          onChange={(e) => updateRequirementField('maxAvailablePhosphorus', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aminoácidos */}
                <div>
                  <h4 className="font-medium text-orange-700 mb-3">Aminoácidos Digestíveis (%)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="minLysine">Lisina (mín)</Label>
                      <Input
                        id="minLysine"
                        type="number"
                        step="0.01"
                        value={selectedRequirement.minLysine}
                        onChange={(e) => updateRequirementField('minLysine', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minMethionine">Metionina (mín)</Label>
                      <Input
                        id="minMethionine"
                        type="number"
                        step="0.01"
                        value={selectedRequirement.minMethionine}
                        onChange={(e) => updateRequirementField('minMethionine', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minThreonine">Treonina (mín)</Label>
                      <Input
                        id="minThreonine"
                        type="number"
                        step="0.01"
                        value={selectedRequirement.minThreonine || ''}
                        onChange={(e) => updateRequirementField('minThreonine', parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minTryptophan">Triptofano (mín)</Label>
                      <Input
                        id="minTryptophan"
                        type="number"
                        step="0.01"
                        value={selectedRequirement.minTryptophan || ''}
                        onChange={(e) => updateRequirementField('minTryptophan', parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Selecione um perfil nutricional</h3>
                  <p>Escolha um perfil da aba "Perfis Disponíveis" para visualizar e editar suas exigências.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionalRequirementsManager;
