import { useState, useEffect } from 'react';
import { Client, ClientIngredient, ClientFormulation } from '@/types/client';
import { FormulationResult } from '@/types/nutrition';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientFormulations, setClientFormulations] = useState<ClientFormulation[]>([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('feed-formulator-clients');
    if (savedClients) {
      const parsedClients = JSON.parse(savedClients);
      setClients(parsedClients);
      if (parsedClients.length > 0) {
        setSelectedClient(parsedClients[0]);
      }
    }

    const savedFormulations = localStorage.getItem('feed-formulator-client-formulations');
    if (savedFormulations) {
      setClientFormulations(JSON.parse(savedFormulations));
    }
  }, []);

  const saveClients = (updatedClients: Client[]) => {
    setClients(updatedClients);
    localStorage.setItem('feed-formulator-clients', JSON.stringify(updatedClients));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'ingredients'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ingredients: []
    };
    
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
    
    if (!selectedClient) {
      setSelectedClient(newClient);
    }
    
    return newClient;
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    );
    saveClients(updatedClients);
    
    if (selectedClient?.id === clientId) {
      setSelectedClient({ ...selectedClient, ...updates });
    }
  };

  const deleteClient = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    saveClients(updatedClients);
    
    if (selectedClient?.id === clientId) {
      setSelectedClient(updatedClients.length > 0 ? updatedClients[0] : null);
    }
  };

  const updateClientIngredients = (clientId: string, ingredients: ClientIngredient[]) => {
    setClients(prev => {
      const updated = prev.map(client => 
        client.id === clientId 
          ? { ...client, ingredients }
          : client
      );
      localStorage.setItem('clients', JSON.stringify(updated));
      return updated;
    });
  };

  const saveClientFormulation = (result: FormulationResult, name: string, ingredients: ClientIngredient[]) => {
    if (!selectedClient || !result.feasible) return;

    const formulation: ClientFormulation = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      name,
      date: new Date().toISOString(),
      result,
      ingredients
    };

    const updatedFormulations = [formulation, ...clientFormulations].slice(0, 50);
    setClientFormulations(updatedFormulations);
    localStorage.setItem('feed-formulator-client-formulations', JSON.stringify(updatedFormulations));
  };

  const getClientFormulations = (clientId: string) => {
    return clientFormulations.filter(f => f.clientId === clientId);
  };

  return {
    clients,
    selectedClient,
    setSelectedClient,
    addClient,
    updateClient,
    deleteClient,
    updateClientIngredients,
    saveClientFormulation,
    getClientFormulations,
    clientFormulations
  };
};
