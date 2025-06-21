
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NutritionalRequirement } from '@/types/nutrition';

interface RequirementsFormProps {
  requirements: NutritionalRequirement;
  onRequirementsChange: (requirements: NutritionalRequirement) => void;
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({ requirements, onRequirementsChange }) => {
  const updateRequirement = (field: keyof NutritionalRequirement, value: number) => {
    onRequirementsChange({
      ...requirements,
      [field]: value
    });
  };

  const loadDefaultRequirements = () => {
    const defaultReqs: NutritionalRequirement = {
      profileName: 'Poedeiras Comerciais - Padrão',
      phase: 'peak-lay',
      minMetabolizableEnergy: 2750,
      maxMetabolizableEnergy: 2850,
      minCrudeProtein: 16.0,
      maxCrudeProtein: 18.0,
      minCalcium: 3.8,
      maxCalcium: 4.2,
      minAvailablePhosphorus: 0.35,
      maxAvailablePhosphorus: 0.45,
      minLysine: 0.75,
      maxLysine: 0.85,
      minMethionine: 0.38,
      maxMethionine: 0.45,
      maxCrudeFiber: 6.0
    };
    
    onRequirementsChange(defaultReqs);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-orange-700">Exigências Nutricionais - Poedeiras Comerciais</span>
          <Button 
            onClick={loadDefaultRequirements} 
            variant="outline" 
            size="sm"
            className="bg-orange-50 hover:bg-orange-100"
          >
            Carregar Padrão NRC
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Proteína */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Proteína Bruta (%)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minCrudeProtein">Mínimo</Label>
                <Input
                  id="minCrudeProtein"
                  type="number"
                  step="0.1"
                  value={requirements.minCrudeProtein}
                  onChange={(e) => updateRequirement('minCrudeProtein', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxCrudeProtein">Máximo</Label>
                <Input
                  id="maxCrudeProtein"
                  type="number"
                  step="0.1"
                  value={requirements.maxCrudeProtein}
                  onChange={(e) => updateRequirement('maxCrudeProtein', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Energia */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Energia Metabolizável (kcal/kg)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minMetabolizableEnergy">Mínimo</Label>
                <Input
                  id="minMetabolizableEnergy"
                  type="number"
                  value={requirements.minMetabolizableEnergy}
                  onChange={(e) => updateRequirement('minMetabolizableEnergy', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxMetabolizableEnergy">Máximo</Label>
                <Input
                  id="maxMetabolizableEnergy"
                  type="number"
                  value={requirements.maxMetabolizableEnergy}
                  onChange={(e) => updateRequirement('maxMetabolizableEnergy', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Cálcio */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Cálcio (%)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minCalcium">Mínimo</Label>
                <Input
                  id="minCalcium"
                  type="number"
                  step="0.1"
                  value={requirements.minCalcium}
                  onChange={(e) => updateRequirement('minCalcium', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxCalcium">Máximo</Label>
                <Input
                  id="maxCalcium"
                  type="number"
                  step="0.1"
                  value={requirements.maxCalcium}
                  onChange={(e) => updateRequirement('maxCalcium', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Fósforo */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Fósforo Disponível (%)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minAvailablePhosphorus">Mínimo</Label>
                <Input
                  id="minAvailablePhosphorus"
                  type="number"
                  step="0.01"
                  value={requirements.minAvailablePhosphorus}
                  onChange={(e) => updateRequirement('minAvailablePhosphorus', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxAvailablePhosphorus">Máximo</Label>
                <Input
                  id="maxAvailablePhosphorus"
                  type="number"
                  step="0.01"
                  value={requirements.maxAvailablePhosphorus}
                  onChange={(e) => updateRequirement('maxAvailablePhosphorus', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Lisina */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Lisina Digestível (%)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minLysine">Mínimo</Label>
                <Input
                  id="minLysine"
                  type="number"
                  step="0.01"
                  value={requirements.minLysine}
                  onChange={(e) => updateRequirement('minLysine', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxLysine">Máximo</Label>
                <Input
                  id="maxLysine"
                  type="number"
                  step="0.01"
                  value={requirements.maxLysine}
                  onChange={(e) => updateRequirement('maxLysine', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Metionina */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Metionina Digestível (%)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minMethionine">Mínimo</Label>
                <Input
                  id="minMethionine"
                  type="number"
                  step="0.01"
                  value={requirements.minMethionine}
                  onChange={(e) => updateRequirement('minMethionine', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxMethionine">Máximo</Label>
                <Input
                  id="maxMethionine"
                  type="number"
                  step="0.01"
                  value={requirements.maxMethionine}
                  onChange={(e) => updateRequirement('maxMethionine', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Fibra */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Fibra Bruta (% máx)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="maxCrudeFiber">Máximo</Label>
                <Input
                  id="maxCrudeFiber"
                  type="number"
                  step="0.1"
                  value={requirements.maxCrudeFiber}
                  onChange={(e) => updateRequirement('maxCrudeFiber', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsForm;
