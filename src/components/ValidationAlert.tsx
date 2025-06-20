
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Ingredient, NutritionalRequirement } from '@/types/nutrition';

interface ValidationAlertProps {
  ingredients: Ingredient[];
  requirements: NutritionalRequirement;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ ingredients, requirements }) => {
  const validationErrors: string[] = [];
  const validationWarnings: string[] = [];

  // Validar ingredientes
  if (ingredients.length < 2) {
    validationErrors.push('Adicione pelo menos 2 ingredientes para formular a ração');
  }

  ingredients.forEach((ingredient, index) => {
    if (!ingredient.name.trim()) {
      validationErrors.push(`Ingrediente ${index + 1}: Nome é obrigatório`);
    }
    if (ingredient.price <= 0) {
      validationErrors.push(`${ingredient.name}: Preço deve ser maior que zero`);
    }
    if (ingredient.minPercent > ingredient.maxPercent) {
      validationErrors.push(`${ingredient.name}: Porcentagem mínima não pode ser maior que a máxima`);
    }
    if (ingredient.maxPercent > 100) {
      validationWarnings.push(`${ingredient.name}: Porcentagem máxima muito alta (>100%)`);
    }
  });

  // Validar exigências nutricionais
  if (requirements.minProtein >= requirements.maxProtein) {
    validationErrors.push('Proteína: Valor mínimo deve ser menor que o máximo');
  }
  if (requirements.minEnergy >= requirements.maxEnergy) {
    validationErrors.push('Energia: Valor mínimo deve ser menor que o máximo');
  }
  if (requirements.minCalcium >= requirements.maxCalcium) {
    validationErrors.push('Cálcio: Valor mínimo deve ser menor que o máximo');
  }
  if (requirements.minPhosphorus >= requirements.maxPhosphorus) {
    validationErrors.push('Fósforo: Valor mínimo deve ser menor que o máximo');
  }

  // Verificar se os ingredientes podem atender às exigências
  const maxProtein = Math.max(...ingredients.map(i => i.protein));
  const minProtein = Math.min(...ingredients.map(i => i.protein));
  if (maxProtein < requirements.minProtein) {
    validationWarnings.push('Nenhum ingrediente atende à exigência mínima de proteína');
  }

  if (validationErrors.length === 0 && validationWarnings.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Dados validados com sucesso! Pronto para formular.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">Erros encontrados:</div>
            <ul className="list-disc pl-4 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {validationWarnings.length > 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <div className="font-semibold mb-1">Avisos:</div>
            <ul className="list-disc pl-4 space-y-1">
              {validationWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ValidationAlert;
