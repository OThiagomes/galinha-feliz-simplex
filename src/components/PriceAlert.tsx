import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, TrendingUp, Bell, DollarSign } from 'lucide-react';
import { Ingredient } from '@/types/nutrition';

interface PriceAlertProps {
  ingredients: Ingredient[];
}

interface PriceAlert {
  ingredientId: string;
  maxPrice: number;
  enabled: boolean;
}

const PriceAlert: React.FC<PriceAlertProps> = ({ ingredients }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState({ ingredientId: '', maxPrice: 0 });

  useEffect(() => {
    const savedAlerts = localStorage.getItem('price-alerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const saveAlerts = (newAlerts: PriceAlert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem('price-alerts', JSON.stringify(newAlerts));
  };

  const addAlert = () => {
    if (newAlert.ingredientId && newAlert.maxPrice > 0) {
      const alert: PriceAlert = {
        ingredientId: newAlert.ingredientId,
        maxPrice: newAlert.maxPrice,
        enabled: true
      };
      saveAlerts([...alerts, alert]);
      setNewAlert({ ingredientId: '', maxPrice: 0 });
    }
  };

  const removeAlert = (index: number) => {
    const newAlerts = alerts.filter((_, i) => i !== index);
    saveAlerts(newAlerts);
  };

  const toggleAlert = (index: number) => {
    const newAlerts = [...alerts];
    newAlerts[index].enabled = !newAlerts[index].enabled;
    saveAlerts(newAlerts);
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => alert.enabled).map(alert => {
      const ingredient = ingredients.find(ing => ing.id === alert.ingredientId);
      if (ingredient && ingredient.price > alert.maxPrice) {
        return {
          ...alert,
          ingredientName: ingredient.name,
          currentPrice: ingredient.price,
          difference: ingredient.price - alert.maxPrice
        };
      }
      return null;
    }).filter(Boolean);
  };

  const activeAlerts = getActiveAlerts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Bell className="w-5 h-5" />
          Alertas de Preço
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            {activeAlerts.map((alert, index) => (
              <Alert key={index} className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <strong>{alert.ingredientName}</strong> está acima do preço limite!
                  <br />
                  Preço atual: R$ {alert.currentPrice.toFixed(4)}/kg 
                  (R$ {alert.difference.toFixed(4)} acima do limite)
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Add New Alert */}
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-semibold mb-3">Adicionar Novo Alerta:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Ingrediente</Label>
              <select 
                className="w-full p-2 border rounded"
                value={newAlert.ingredientId}
                onChange={(e) => setNewAlert({...newAlert, ingredientId: e.target.value})}
              >
                <option value="">Selecionar...</option>
                {ingredients.map(ing => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Preço Máximo (R$/kg)</Label>
              <Input
                type="number"
                step="0.001"
                value={newAlert.maxPrice || ''}
                onChange={(e) => setNewAlert({...newAlert, maxPrice: parseFloat(e.target.value) || 0})}
                placeholder="0.000"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addAlert} className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        {/* Existing Alerts */}
        {alerts.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Alertas Configurados:</h4>
            <div className="space-y-2">
              {alerts.map((alert, index) => {
                const ingredient = ingredients.find(ing => ing.id === alert.ingredientId);
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <span className="font-medium">{ingredient?.name || 'Ingrediente não encontrado'}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        Máx: R$ {alert.maxPrice.toFixed(4)}/kg
                      </span>
                      {ingredient && (
                        <span className={`text-sm ml-2 ${ingredient.price > alert.maxPrice ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                          Atual: R$ {ingredient.price.toFixed(4)}/kg
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => toggleAlert(index)}
                        variant="outline"
                        size="sm"
                        className={alert.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100'}
                      >
                        {alert.enabled ? 'Ativo' : 'Inativo'}
                      </Button>
                      <Button
                        onClick={() => removeAlert(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceAlert;
