
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormulationResult } from '@/types/nutrition';
import { CheckCircle, XCircle, DollarSign, Calculator, Download, FileText } from 'lucide-react';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';

interface ResultsDisplayProps {
  result: FormulationResult | null;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Calculando formulação...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Clique em "Formular Ração" para ver os resultados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Formulação */}
      <Card className={`border-2 ${result.feasible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.feasible ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            {result.feasible ? 'Formulação Viável' : 'Formulação Inviável'}
          </CardTitle>
        </CardHeader>
        {result.message && (
          <CardContent>
            <p className={result.feasible ? 'text-green-700' : 'text-red-700'}>
              {result.message}
            </p>
          </CardContent>
        )}
      </Card>

      {result.feasible && (
        <>
          {/* Export Actions */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Exportar Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => exportToCSV(result)}
                  variant="outline"
                  className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
                <Button 
                  onClick={() => exportToPDF(result)}
                  variant="outline"
                  className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <FileText className="w-4 h-4" />
                  Imprimir PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custo Total */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <DollarSign className="w-5 h-5" />
                Custo da Formulação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                R$ {result.totalCost.toFixed(4)}/kg
              </div>
              <p className="text-sm text-green-600 mt-2">
                Para 1 tonelada: R$ {(result.totalCost * 1000).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Composição da Ração */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700">Composição da Ração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.ingredients.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-700">{item.ingredient.name}</h4>
                      <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                        <span>Proteína: {item.ingredient.crudeProtein}%</span>
                        <span>Energia: {item.ingredient.metabolizableEnergy} kcal/kg</span>
                        <span>Cálcio: {item.ingredient.calcium}%</span>
                        <span>Preço: R$ {item.ingredient.currentPrice.toFixed(2)}/kg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-lg font-bold bg-orange-100 text-orange-700">
                        {item.percentage.toFixed(2)}%
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        R$ {item.cost.toFixed(4)}/kg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Perfil Nutricional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Perfil Nutricional da Ração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Proteína Bruta</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.crudeProtein.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Energia Metabolizável</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.metabolizableEnergy.toFixed(0)} kcal/kg</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Cálcio</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.calcium.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Fósforo</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.availablePhosphorus.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Lisina</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.lysine.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Metionina</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.methionine.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Fibra Bruta</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.nutritionalProfile.crudeFiber.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ResultsDisplay;
