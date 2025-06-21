
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { FormulationResult, NutritionalRequirement } from '@/types/nutrition';

interface NutritionalReportProps {
  result: FormulationResult | null;
  requirements: NutritionalRequirement;
}

const NutritionalReport: React.FC<NutritionalReportProps> = ({ result, requirements }) => {
  if (!result || !result.feasible) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Formule uma ração para ver o relatório nutricional</p>
        </CardContent>
      </Card>
    );
  }

  const checkNutrient = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return 'optimal';
    if (value < min * 0.9 || value > max * 1.1) return 'critical';
    return 'warning';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculatePercentage = (value: number, min: number, max: number) => {
    const range = max - min;
    const position = value - min;
    return Math.max(0, Math.min(100, (position / range) * 100));
  };

  const nutrients = [
    {
      name: 'Proteína Bruta',
      value: result.nutritionalProfile.crudeProtein,
      min: requirements.minCrudeProtein,
      max: requirements.maxCrudeProtein,
      unit: '%',
      status: checkNutrient(result.nutritionalProfile.crudeProtein, requirements.minCrudeProtein, requirements.maxCrudeProtein)
    },
    {
      name: 'Energia Metabolizável',
      value: result.nutritionalProfile.metabolizableEnergy,
      min: requirements.minMetabolizableEnergy,
      max: requirements.maxMetabolizableEnergy,
      unit: 'kcal/kg',
      status: checkNutrient(result.nutritionalProfile.metabolizableEnergy, requirements.minMetabolizableEnergy, requirements.maxMetabolizableEnergy)
    },
    {
      name: 'Cálcio',
      value: result.nutritionalProfile.calcium,
      min: requirements.minCalcium,
      max: requirements.maxCalcium,
      unit: '%',
      status: checkNutrient(result.nutritionalProfile.calcium, requirements.minCalcium, requirements.maxCalcium)
    },
    {
      name: 'Fósforo',
      value: result.nutritionalProfile.availablePhosphorus,
      min: requirements.minAvailablePhosphorus,
      max: requirements.maxAvailablePhosphorus,
      unit: '%',
      status: checkNutrient(result.nutritionalProfile.availablePhosphorus, requirements.minAvailablePhosphorus, requirements.maxAvailablePhosphorus)
    },
    {
      name: 'Lisina',
      value: result.nutritionalProfile.lysine,
      min: requirements.minLysine,
      max: requirements.maxLysine,
      unit: '%',
      status: checkNutrient(result.nutritionalProfile.lysine, requirements.minLysine, requirements.maxLysine)
    },
    {
      name: 'Metionina',
      value: result.nutritionalProfile.methionine,
      min: requirements.minMethionine,
      max: requirements.maxMethionine,
      unit: '%',
      status: checkNutrient(result.nutritionalProfile.methionine, requirements.minMethionine, requirements.maxMethionine)
    },
    {
      name: 'Fibra Bruta',
      value: result.nutritionalProfile.crudeFiber,
      min: 0,
      max: requirements.maxCrudeFiber || 8,
      unit: '%',
      status: result.nutritionalProfile.crudeFiber <= (requirements.maxCrudeFiber || 8) ? 'optimal' : 'warning'
    }
  ];

  const optimalCount = nutrients.filter(n => n.status === 'optimal').length;
  const warningCount = nutrients.filter(n => n.status === 'warning').length;
  const criticalCount = nutrients.filter(n => n.status === 'critical').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <FileText className="w-5 h-5" />
          Relatório Nutricional Completo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Geral */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{optimalCount}</div>
            <div className="text-sm text-green-600">Nutrientes Ideais</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{warningCount}</div>
            <div className="text-sm text-yellow-600">Atenção</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
            <div className="text-sm text-red-600">Críticos</div>
          </div>
        </div>

        {/* Análise Detalhada */}
        <div className="space-y-4">
          <h4 className="font-semibold">Análise Nutricional Detalhada:</h4>
          {nutrients.map((nutrient, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(nutrient.status)}
                  <span className="font-medium">{nutrient.name}</span>
                </div>
                <Badge className={getStatusColor(nutrient.status)}>
                  {nutrient.value.toFixed(nutrient.unit === 'kcal/kg' ? 0 : 2)} {nutrient.unit}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Min: {nutrient.min.toFixed(nutrient.unit === 'kcal/kg' ? 0 : 2)}</span>
                <span>Max: {nutrient.max.toFixed(nutrient.unit === 'kcal/kg' ? 0 : 2)}</span>
                <span className="ml-auto">
                  {nutrient.name !== 'Fibra Bruta' && (
                    <Progress 
                      value={calculatePercentage(nutrient.value, nutrient.min, nutrient.max)}
                      className="w-20 h-2"
                    />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recomendações */}
        {(warningCount > 0 || criticalCount > 0) && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Recomendações:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {nutrients.filter(n => n.status !== 'optimal').map((nutrient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>{nutrient.name}</strong>: 
                    {nutrient.value < nutrient.min ? ' Aumentar ingredientes ricos neste nutriente' : 
                     nutrient.value > nutrient.max ? ' Reduzir ingredientes ricos neste nutriente' : 
                     ' Verificar balanceamento'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionalReport;
