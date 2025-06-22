
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Settings, Target, Users } from 'lucide-react';
import ClientSelector from '@/components/ClientSelector';
import UniversalRequirementsManager from '@/components/UniversalRequirementsManager';
import MinimalFormulation from '@/components/MinimalFormulation';
import { useClients } from '@/hooks/useClients';

const Index = () => {
  const { clients, selectedClient, setSelectedClient, addClient } = useClients();
  const [activeTab, setActiveTab] = useState('formulation');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Minimalista */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Sistema de Formulação
          </h1>
          <p className="text-gray-600 text-sm">
            Otimização nutricional para aves
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Gestão de Clientes */}
        <div className="mb-6">
          <ClientSelector
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            onAddClient={addClient}
          />
        </div>

        {/* Tabs Principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="formulation" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Formulação
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Exigências
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Ingredientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formulation">
            <MinimalFormulation />
          </TabsContent>

          <TabsContent value="requirements">
            <UniversalRequirementsManager />
          </TabsContent>

          <TabsContent value="ingredients">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center text-gray-500">
                  <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Gestão de Ingredientes</h3>
                  <p>Selecione um cliente para gerenciar seus ingredientes</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {!clients.length && (
          <Card className="mt-8">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Adicione um Cliente</h3>
                <p>Para começar, adicione um cliente no seletor acima.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
