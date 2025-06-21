
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, User, Mail, Phone, Calendar } from 'lucide-react';
import { Client } from '@/types/client';
import { toast } from '@/hooks/use-toast';

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
  onAddClient: (client: Omit<Client, 'id' | 'createdAt' | 'ingredients'>) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  clients, 
  selectedClient, 
  onSelectClient, 
  onAddClient 
}) => {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleAddClient = () => {
    if (!newClientData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive"
      });
      return;
    }

    onAddClient(newClientData);
    setNewClientData({ name: '', email: '', phone: '' });
    setIsAddingClient(false);
    
    toast({
      title: "Cliente Adicionado!",
      description: `${newClientData.name} foi adicionado com sucesso.`
    });
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Users className="w-5 h-5" />
          Seleção de Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="client-select">Cliente Ativo</Label>
            <Select 
              value={selectedClient?.id || ''} 
              onValueChange={(value) => {
                const client = clients.find(c => c.id === value);
                if (client) onSelectClient(client);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {client.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 mt-6">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client-name">Nome *</Label>
                  <Input
                    id="client-name"
                    value={newClientData.name}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newClientData.email}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="client-phone">Telefone</Label>
                  <Input
                    id="client-phone"
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddClient} className="flex-1">
                    Adicionar Cliente
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingClient(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selectedClient && (
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-700">{selectedClient.name}</h4>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {selectedClient.ingredients.length} ingredientes
              </Badge>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedClient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {selectedClient.email}
                </div>
              )}
              {selectedClient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  {selectedClient.phone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Cliente desde {new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        )}

        {clients.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum cliente cadastrado</p>
            <p className="text-xs">Adicione seu primeiro cliente para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
