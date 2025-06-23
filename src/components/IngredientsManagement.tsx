
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap
} from 'lucide-react';
import { sampleIngredients } from '@/data/sampleIngredients';

const IngredientsManagement = () => {
  const [ingredients] = useState(sampleIngredients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(ingredients.map(ing => ing.category))];
  
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ingredient.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (stock) => {
    if (stock > 100) return 'bg-green-100 text-green-800';
    if (stock > 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPriceStatus = (price) => {
    const variation = Math.random() * 20 - 10; // Simulação de variação
    return variation > 0 ? 'up' : 'down';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestão de Ingredientes</h2>
          <p className="text-gray-600">Controle seu estoque e preços</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ingrediente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Todas Categorias' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ingredientes</p>
                <p className="text-2xl font-bold">{ingredients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Em Estoque</p>
                <p className="text-2xl font-bold text-green-600">
                  {ingredients.filter(ing => ing.stock > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-600">
                  {ingredients.filter(ing => ing.stock < 50).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold">
                  R$ {(ingredients.reduce((acc, ing) => acc + ing.price, 0) / ingredients.length).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ingredientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Ingrediente</th>
                  <th className="text-left p-3">Categoria</th>
                  <th className="text-left p-3">Preço/kg</th>
                  <th className="text-left p-3">Estoque</th>
                  <th className="text-left p-3">Proteína</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Zap className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium">{ingredient.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{ingredient.category}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>R$ {ingredient.price.toFixed(2)}</span>
                        {getPriceStatus(ingredient.price) === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(ingredient.stock)}>
                        {ingredient.stock} kg
                      </Badge>
                    </td>
                    <td className="p-3">{ingredient.protein.toFixed(1)}%</td>
                    <td className="p-3">
                      <Badge variant={ingredient.stock > 50 ? 'default' : 'destructive'}>
                        {ingredient.stock > 50 ? 'Disponível' : 'Baixo'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientsManagement;
