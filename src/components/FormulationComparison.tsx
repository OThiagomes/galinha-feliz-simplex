
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFormulationHistory } from '@/hooks/useFormulationHistory';

const FormulationComparison: React.FC = () => {
  const { history } = useFormulationHistory();
  const [selectedFormulations, setSelectedFormulations] = useState<string[]>([]);

  const addComparison = (id: string) => {
    if (selectedFormulations.length < 3 && !selectedFormulations.includes(id)) {
      setSelectedFormulations([...selectedFormulations, id]);
    }
  };

  const removeComparison = (id: string) => {
    setSelectedFormulations(selectedFormulations.filter(f => f !== id));
  };

  const compareFormulations = () => {
    return selectedFormulations.map(id => 
      history.find(record => record.id === id)
    ).filter(Boolean);
  };

  const formulations = compareFormulations();

  if (history.length < 2) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Salve pelo menos 2 formulações para comparar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <BarChart3 className="w-5 h-5" />
          Comparação de Formulações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Selecionar Formulações (máx. 3):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {history.slice(0, 6).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{record.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    R$ {record.result.totalCost.toFixed(4)}
                  </Badge>
                  {selectedFormulations.includes(record.id) ? (
                    <Button
                      onClick={() => removeComparison(record.id)}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addComparison(record.id)}
                      disabled={selectedFormulations.length >= 3}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                    >
                      Comparar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {formulations.length >= 2 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Comparação Detalhada:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Critério</th>
                    {formulations.map((f, idx) => (
                      <th key={idx} className="border border-gray-300 p-2 text-center">
                        {f!.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">Custo (R$/kg)</td>
                    {formulations.map((f, idx) => {
                      const isLowest = f!.result.totalCost === Math.min(...formulations.map(form => form!.result.totalCost));
                      return (
                        <td key={idx} className={`border border-gray-300 p-2 text-center ${isLowest ? 'bg-green-50 font-bold text-green-700' : ''}`}>
                          {f!.result.totalCost.toFixed(4)}
                          {isLowest && <TrendingDown className="w-4 h-4 inline ml-1 text-green-600" />}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">Proteína (%)</td>
                    {formulations.map((f, idx) => (
                      <td key={idx} className="border border-gray-300 p-2 text-center">
                        {f!.result.nutritionalProfile.protein.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">Energia (kcal/kg)</td>
                    {formulations.map((f, idx) => (
                      <td key={idx} className="border border-gray-300 p-2 text-center">
                        {f!.result.nutritionalProfile.energy.toFixed(0)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">Cálcio (%)</td>
                    {formulations.map((f, idx) => (
                      <td key={idx} className="border border-gray-300 p-2 text-center">
                        {f!.result.nutritionalProfile.calcium.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">Nº Ingredientes</td>
                    {formulations.map((f, idx) => (
                      <td key={idx} className="border border-gray-300 p-2 text-center">
                        {f!.result.ingredients.length}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormulationComparison;
