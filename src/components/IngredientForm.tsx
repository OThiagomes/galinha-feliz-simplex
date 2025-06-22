
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ClientIngredient } from '@/types/client';

interface IngredientFormProps {
  initialData?: ClientIngredient;
  onSubmit: (ingredient: Omit<ClientIngredient, 'id'>) => void;
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Omit<ClientIngredient, 'id'>>({
    name: '',
    category: 'cereais',
    origin: 'nacional',
    metabolizableEnergy: 0,
    crudeProtein: 0,
    lysine: 0,
    methionine: 0,
    calcium: 0,
    availablePhosphorus: 0,
    crudeFiber: 0,
    currentPrice: 0,
    minInclusion: 0,
    maxInclusion: 100,
    availability: true
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...dataWithoutId } = initialData;
      setFormData(dataWithoutId);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Ingrediente *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ex: Milho"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cereais">Cereais</SelectItem>
              <SelectItem value="oleaginosas">Oleaginosas</SelectItem>
              <SelectItem value="subprodutos">Subprodutos</SelectItem>
              <SelectItem value="aditivos">Aditivos</SelectItem>
              <SelectItem value="minerais">Minerais</SelectItem>
              <SelectItem value="vitaminas">Vitaminas</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="metabolizableEnergy">Energia Metabolizável (kcal/kg)</Label>
          <Input
            id="metabolizableEnergy"
            type="number"
            value={formData.metabolizableEnergy}
            onChange={(e) => updateField('metabolizableEnergy', parseInt(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="crudeProtein">Proteína Bruta (%)</Label>
          <Input
            id="crudeProtein"
            type="number"
            step="0.1"
            value={formData.crudeProtein}
            onChange={(e) => updateField('crudeProtein', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="crudeFiber">Fibra Bruta (%)</Label>
          <Input
            id="crudeFiber"
            type="number"
            step="0.1"
            value={formData.crudeFiber}
            onChange={(e) => updateField('crudeFiber', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="calcium">Cálcio (%)</Label>
          <Input
            id="calcium"
            type="number"
            step="0.01"
            value={formData.calcium}
            onChange={(e) => updateField('calcium', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="availablePhosphorus">Fósforo Disponível (%)</Label>
          <Input
            id="availablePhosphorus"
            type="number"
            step="0.01"
            value={formData.availablePhosphorus}
            onChange={(e) => updateField('availablePhosphorus', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="lysine">Lisina (%)</Label>
          <Input
            id="lysine"
            type="number"
            step="0.01"
            value={formData.lysine}
            onChange={(e) => updateField('lysine', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="methionine">Metionina (%)</Label>
          <Input
            id="methionine"
            type="number"
            step="0.01"
            value={formData.methionine}
            onChange={(e) => updateField('methionine', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="currentPrice">Preço Atual (R$/kg) *</Label>
          <Input
            id="currentPrice"
            type="number"
            step="0.01"
            value={formData.currentPrice}
            onChange={(e) => updateField('currentPrice', parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <div>
          <Label htmlFor="minInclusion">Inclusão Mínima (%)</Label>
          <Input
            id="minInclusion"
            type="number"
            step="0.1"
            value={formData.minInclusion}
            onChange={(e) => updateField('minInclusion', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="maxInclusion">Inclusão Máxima (%)</Label>
          <Input
            id="maxInclusion"
            type="number"
            step="0.1"
            value={formData.maxInclusion}
            onChange={(e) => updateField('maxInclusion', parseFloat(e.target.value) || 100)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="availability"
          checked={formData.availability}
          onCheckedChange={(checked) => updateField('availability', checked)}
        />
        <Label htmlFor="availability">Ingrediente disponível</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? 'Atualizar Ingrediente' : 'Adicionar Ingrediente'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default IngredientForm;
