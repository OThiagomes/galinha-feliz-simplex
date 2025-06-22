
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
  Calculator
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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-gray-500">
            <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Selecione um Cliente</h3>
            <p>Para gerenciar ingredientes, primeiro selecione um cliente.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {editingIngredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowForm(false);
                setEditingIngredient(null);
              }}
            >
              Voltar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
    <div className="space-y-4">
      {/* Header com Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ingredientes - {selectedClient.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                {showStats ? 'Ocultar' : 'Estatísticas'}
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Novo
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {showStats && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                <div className="text-sm text-gray-600">Disponíveis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">R$ {stats.avgPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Preço Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar ingredientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtros
                {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
            </div>

            {showFilters && (
              <div className="flex gap-4 p-4 bg-gray-50 rounded">
                <div className="flex-1">
                  <Label className="text-xs">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
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
                
                <div className="flex-1">
                  <Label className="text-xs">Disponibilidade</Label>
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="available">Disponíveis</SelectItem>
                      <SelectItem value="unavailable">Indisponíveis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ingredientes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrediente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Energia</TableHead>
                <TableHead className="text-right">Proteína</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">
                    {ingredient.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {ingredient.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {ingredient.metabolizableEnergy}
                  </TableCell>
                  <TableCell className="text-right">
                    {ingredient.crudeProtein}%
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {ingredient.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={ingredient.availability ? "default" : "secondary"}
                      className={ingredient.availability ? "bg-green-100 text-green-800" : ""}
                    >
                      {ingredient.availability ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditIngredient(ingredient)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIngredient(ingredient.id)}
                        className="text-red-600 hover:text-red-800"
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
            <div className="text-center py-12 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum ingrediente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientManagement;
