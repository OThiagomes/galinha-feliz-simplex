
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  Building2
} from 'lucide-react';
import { useClients } from '@/hooks/useClients';

const ClientsManagement = () => {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      addClient(newClient);
      setNewClient({ name: '', email: '', phone: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestão de Clientes</h2>
          <p className="text-gray-600">Gerencie sua base de clientes para formulação</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Nome"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <Input
              placeholder="Telefone"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddClient}>Salvar Cliente</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <p className="text-gray-600 text-sm">Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <Badge variant="default">
                  Ativo
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  {client.ingredients.length} ingredientes cadastrados
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-500">Adicione novos clientes para começar a formular</p>
        </div>
      )}
    </div>
  );
};

export default ClientsManagement;
