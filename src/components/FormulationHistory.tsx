
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, Download, FileText } from 'lucide-react';
import { useFormulationHistory } from '@/hooks/useFormulationHistory';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';

const FormulationHistory: React.FC = () => {
  const { history, deleteFormulation, clearHistory } = useFormulationHistory();

  if (history.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Nenhuma formulação salva ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-purple-700">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Formulações
          </div>
          <Button 
            onClick={clearHistory}
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            Limpar Histórico
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((record) => (
            <div key={record.id} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-700">{record.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    R$ {record.result.totalCost.toFixed(4)}/kg
                  </Badge>
                  <Button
                    onClick={() => exportToCSV(record.result)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => exportToPDF(record.result)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <FileText className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => deleteFormulation(record.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-2">
                <span>Data: {new Date(record.date).toLocaleDateString('pt-BR')}</span>
                <span>Ingredientes: {record.result.ingredients.length}</span>
                <span>Proteína: {record.result.nutritionalProfile.protein.toFixed(1)}%</span>
                <span>Energia: {record.result.nutritionalProfile.energy.toFixed(0)} kcal/kg</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulationHistory;
