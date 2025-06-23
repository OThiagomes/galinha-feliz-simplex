
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calculator,
  Package,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Client, ClientIngredient } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import IngredientForm from './IngredientForm';

const IngredientManagement: React.FC = () => {
  const { clients, selectedClient, updateClientIngredients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<ClientIngredient | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const ingredients = selectedClient?.ingredients || [];

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || ingredient.category === categoryFilter;
      const matchesAvailability = 
        availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && ingredient.availability) ||
        (availabilityFilter === 'unavailable' && !ingredient.availability);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [ingredients, searchTerm, categoryFilter, availabilityFilter]);

  const stats = {
    total: ingredients.length,
    available: ingredients.filter(i => i.availability).length,
    avgPrice: ingredients.length > 0 ? 
      ingredients.reduce((sum, i) => sum + i.currentPrice, 0) / ingredients.length : 0,
    categories: [...new Set(ingredients.map(i => i.category))].length
  };

  const handleAddIngredient = (ingredient: Omit<ClientIngredient, 'id'>) => {
    if (!selectedClient) return;
    
    const newIngredient: ClientIngredient = {
      ...ingredient,
      id: Date.now().toString()
    };

    const updatedIngredients = [...ingredients, newIngredient];
    updateClientIngredients(selectedClient.id, updatedIngredients);
    setShowForm(false);
  };

  const handleEditIngredient = (ingredient: ClientIngredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const handleUpdateIngredient = (updatedIngredient: Omit<ClientIngredient, 'id'>) => {
    if (!selectedClient || !editingIngredient) return;

    const updatedIngredients = ingredients.map(ing => 
      ing.id === editingIngredient.id 
        ? { ...updatedIngredient, id: editingIngredient.id }
        : ing
    );

    updateClientIngredients(selectedClient.id, updatedIngredients);
    setShowForm(false);
    setEditingIngredient(null);
  };

  const handleDeleteIngredient = (id: string) => {
    if (!selectedClient) return;
    
    const updatedIngredients = ingredients.filter(ing => ing.id !== id);
    updateClientIngredients(selectedClient.id, updatedIngredients);
  };

  const exportToCSV = () => {
    const headers = [
      'Nome', 'Categoria', 'Energia (kcal/kg)', 'Proteína (%)', 
      'Cálcio (%)', 'Fósforo (%)', 'Lisina (%)', 'Metionina (%)', 
      'Fibra (%)', 'Preço (R$/kg)', 'Min (%)', 'Max (%)', 'Disponível'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredIngredients.map(ing => [
        ing.name,
        ing.category,
        ing.metabolizableEnergy,
        ing.crudeProtein,
        ing.calcium,
        ing.availablePhosphorus,
        ing.lysine,
        ing.methionine,
        ing.crudeFiber,
        ing.currentPrice,
        ing.minInclusion,
        ing.maxInclusion,
        ing.availability ? 'Sim' : 'Não'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ingredientes_${selectedClient?.name || 'cliente'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!selectedClient) {
    return (
      <Card className="border-2 border-orange-100">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Package className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Selecione um Cliente</h3>
            <p className="text-gray-600">Para gerenciar ingredientes, primeiro selecione um cliente no menu superior.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700">
              <Package className="w-5 h-5" />
              {editingIngredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowForm(false);
                setEditingIngredient(null);
              }}
              className="text-gray-600 hover:bg-gray-100"
            >
              ← Voltar à Lista
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <IngredientForm
            initialData={editingIngredient || undefined}
            onSubmit={editingIngredient ? handleUpdateIngredient : handleAddIngredient}
            onCancel={() => {
              setShowForm(false);
              setEditingIngredient(null);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Gradiente */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Gestão de Ingredientes</h2>
              <p className="text-blue-100">{selectedClient.name} • {ingredients.length} ingredientes cadastrados</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-white text-green-600 hover:bg-gray-100 font-bold shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Ingrediente
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {showStats && (
        <Card className="border-2 border-green-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</div>
                <div className="text-sm text-blue-700 font-medium">Total de Ingredientes</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.available}</div>
                <div className="text-sm text-green-700 font-medium">Disponíveis</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-1">R$ {stats.avgPrice.toFixed(2)}</div>
                <div className="text-sm text-orange-700 font-medium">Preço Médio</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.categories}</div>
                <div className="text-sm text-purple-700 font-medium">Categorias</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Controles */}
      <Card className="border-2 border-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="🔍 Buscar ingredientes por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-200 focus:border-blue-400"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600 hover:bg-gray-100"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtros
                {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="text-blue-600 hover:bg-blue-100"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                {showStats ? 'Ocultar' : 'Estatísticas'}
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={exportToCSV}
                className="text-green-600 hover:bg-green-100"
              >
                <Download className="w-4 h-4 mr-1" />
                Exportar CSV
              </Button>
            </div>

            {showFilters && (
              <div className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <Label className="text-xs font-semibold text-gray-700">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🔘 Todas as Categorias</SelectItem>
                      <SelectItem value="cereais">🌾 Cereais</SelectItem>
                      <SelectItem value="oleaginosas">🥜 Oleaginosas</SelectItem>
                      <SelectItem value="subprodutos">♻️ Subprodutos</SelectItem>
                      <SelectItem value="aditivos">⚗️ Aditivos</SelectItem>
                      <SelectItem value="minerais">💎 Minerais</SelectItem>
                      <SelectItem value="vitaminas">💊 Vitaminas</SelectItem>
                      <SelectItem value="outros">📦 Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label className="text-xs font-semibold text-gray-700">Disponibilidade</Label>
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🔘 Todos os Status</SelectItem>
                      <SelectItem value="available">✅ Disponíveis</SelectItem>
                      <SelectItem value="unavailable">❌ Indisponíveis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ingredientes */}
      <Card className="border-2 border-gray-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <TableRow>
                <TableHead className="font-bold text-gray-700">Ingrediente</TableHead>
                <TableHead className="font-bold text-gray-700">Categoria</TableHead>
                <TableHead className="text-right font-bold text-gray-700">⚡ Energia</TableHead>
                <TableHead className="text-right font-bold text-gray-700">🥩 Proteína</TableHead>
                <TableHead className="text-right font-bold text-gray-700">💰 Preço</TableHead>
                <TableHead className="text-center font-bold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-bold text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-800">
                    {ingredient.name}
                    <div className="text-xs text-gray-500 mt-1">
                      {ingredient.minInclusion}-{ingredient.maxInclusion}% inclusão
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize font-medium">
                      {ingredient.category === 'cereais' && '🌾'} 
                      {ingredient.category === 'oleaginosas' && '🥜'} 
                      {ingredient.category === 'subprodutos' && '♻️'} 
                      {ingredient.category === 'aditivos' && '⚗️'} 
                      {ingredient.category === 'minerais' && '💎'} 
                      {ingredient.category === 'vitaminas' && '💊'} 
                      {ingredient.category === 'outros' && '📦'} 
                      {ingredient.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className="font-bold text-yellow-600">
                      {ingredient.metabolizableEnergy}
                    </span>
                    <div className="text-xs text-gray-500">kcal/kg</div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className="font-bold text-blue-600">
                      {ingredient.crudeProtein}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className="font-bold text-green-600">
                      R$ {ingredient.currentPrice.toFixed(2)}
                    </span>
                    <div className="text-xs text-gray-500">/kg</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={ingredient.availability ? "default" : "secondary"}
                      className={ingredient.availability 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : "bg-red-100 text-red-800 border-red-300"
                      }
                    >
                      {ingredient.availability ? '✅ Disponível' : '❌ Indisponível'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditIngredient(ingredient)}
                        className="text-blue-600 hover:bg-blue-100"
                        title="Editar ingrediente"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIngredient(ingredient.id)}
                        className="text-red-600 hover:bg-red-100"
                        title="Excluir ingrediente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredIngredients.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum ingrediente encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou criar um novo ingrediente.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientManagement;
