
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Settings2,
  Sliders
} from 'lucide-react';
import { ClientIngredient } from '@/types/client';
import { IngredientConstraint } from '@/types/phases';

interface IngredientConstraintsProps {
  ingredients: ClientIngredient[];
  constraints: IngredientConstraint[];
  onUpdateConstraints: (constraints: IngredientConstraint[]) => void;
}

const IngredientConstraints: React.FC<IngredientConstraintsProps> = ({
  ingredients,
  constraints,
  onUpdateConstraints
}) => {
  const [showConstraints, setShowConstraints] = useState(false);

  const updateConstraint = (ingredientId: string, field: keyof IngredientConstraint, value: any) => {
    const newConstraints = constraints.map(c => 
      c.ingredientId === ingredientId 
        ? { ...c, [field]: value }
        : c
    );
    onUpdateConstraints(newConstraints);
  };

  const lockedCount = constraints.filter(c => c.isLocked).length;
  const constrainedCount = constraints.filter(c => c.fixedPercentage || c.minPercentage !== ingredients.find(i => i.id === c.ingredientId)?.minInclusion).length;

  return (
    <Card className="border-2 border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-700">
            <Settings2 className="w-5 h-5" />
            <span>Restrições de Ingredientes</span>
            {constrainedCount > 0 && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-normal">
                {constrainedCount} modificados
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConstraints(!showConstraints)}
            className="text-purple-600 hover:bg-purple-100"
          >
            <Sliders className="w-4 h-4 mr-1" />
            {showConstraints ? (
              <>
                <ChevronUp className="w-4 h-4 ml-1" />
                Minimizar
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 ml-1" />
                Configurar ({ingredients.length})
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {showConstraints && (
        <CardContent className="p-6">
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-700">
              <strong>💡 Dica:</strong> Use restrições para controlar a formulação:
              <ul className="mt-1 ml-4 list-disc space-y-1">
                <li><strong>Min/Max:</strong> Define limites de inclusão</li>
                <li><strong>Fixo:</strong> Força um percentual específico</li>
                <li><strong>Travar:</strong> Bloqueia qualquer alteração</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {ingredients.map(ingredient => {
              const constraint = constraints.find(c => c.ingredientId === ingredient.id);
              if (!constraint) return null;

              const isModified = constraint.fixedPercentage || 
                constraint.minPercentage !== ingredient.minInclusion || 
                constraint.maxPercentage !== ingredient.maxInclusion;

              return (
                <div 
                  key={ingredient.id} 
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    constraint.isLocked 
                      ? 'bg-red-50 border-red-200' 
                      : isModified 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{ingredient.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span>💰 R$ {ingredient.currentPrice.toFixed(2)}/kg</span>
                      <span>🔋 {ingredient.metabolizableEnergy} kcal</span>
                      <span>🥩 {ingredient.crudeProtein}% PB</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold text-gray-600">Min:</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={constraint.minPercentage || ''}
                        onChange={(e) => updateConstraint(ingredient.id, 'minPercentage', parseFloat(e.target.value) || 0)}
                        className="w-16 h-8 text-xs"
                        disabled={constraint.isLocked}
                      />
                      <span className="text-xs text-gray-400">%</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold text-gray-600">Max:</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={constraint.maxPercentage || ''}
                        onChange={(e) => updateConstraint(ingredient.id, 'maxPercentage', parseFloat(e.target.value) || 100)}
                        className="w-16 h-8 text-xs"
                        disabled={constraint.isLocked}
                      />
                      <span className="text-xs text-gray-400">%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold text-gray-600">Fixo:</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={constraint.fixedPercentage || ''}
                        onChange={(e) => updateConstraint(ingredient.id, 'fixedPercentage', parseFloat(e.target.value) || undefined)}
                        className="w-16 h-8 text-xs"
                        placeholder="--"
                        disabled={constraint.isLocked}
                      />
                      <span className="text-xs text-gray-400">%</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateConstraint(ingredient.id, 'isLocked', !constraint.isLocked)}
                      className={`p-2 ${
                        constraint.isLocked 
                          ? 'text-red-600 hover:bg-red-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={constraint.isLocked ? 'Destravar ingrediente' : 'Travar ingrediente'}
                    >
                      {constraint.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {lockedCount > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <strong>{lockedCount} ingrediente(s) travado(s)</strong>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default IngredientConstraints;
