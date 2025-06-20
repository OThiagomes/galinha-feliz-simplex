
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
      minProtein: 16.0,
      maxProtein: 18.0,
      minEnergy: 2750,
      maxEnergy: 2850,
      minCalcium: 3.8,
      maxCalcium: 4.2,
      minPhosphorus: 0.35,
      maxPhosphorus: 0.45,
      minLysine: 0.75,
      maxLysine: 0.85,
      minMethionine: 0.38,
      maxMethionine: 0.45,
      maxFiber: 6.0
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
                <Label htmlFor="minProtein">Mínimo</Label>
                <Input
                  id="minProtein"
                  type="number"
                  step="0.1"
                  value={requirements.minProtein}
                  onChange={(e) => updateRequirement('minProtein', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxProtein">Máximo</Label>
                <Input
                  id="maxProtein"
                  type="number"
                  step="0.1"
                  value={requirements.maxProtein}
                  onChange={(e) => updateRequirement('maxProtein', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Energia */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">Energia Metabolizável (kcal/kg)</h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minEnergy">Mínimo</Label>
                <Input
                  id="minEnergy"
                  type="number"
                  value={requirements.minEnergy}
                  onChange={(e) => updateRequirement('minEnergy', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxEnergy">Máximo</Label>
                <Input
                  id="maxEnergy"
                  type="number"
                  value={requirements.maxEnergy}
                  onChange={(e) => updateRequirement('maxEnergy', parseInt(e.target.value) || 0)}
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
                <Label htmlFor="minPhosphorus">Mínimo</Label>
                <Input
                  id="minPhosphorus"
                  type="number"
                  step="0.01"
                  value={requirements.minPhosphorus}
                  onChange={(e) => updateRequirement('minPhosphorus', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maxPhosphorus">Máximo</Label>
                <Input
                  id="maxPhosphorus"
                  type="number"
                  step="0.01"
                  value={requirements.maxPhosphorus}
                  onChange={(e) => updateRequirement('maxPhosphorus', parseFloat(e.target.value) || 0)}
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
                <Label htmlFor="maxFiber">Máximo</Label>
                <Input
                  id="maxFiber"
                  type="number"
                  step="0.1"
                  value={requirements.maxFiber}
                  onChange={(e) => updateRequirement('maxFiber', parseFloat(e.target.value) || 0)}
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
