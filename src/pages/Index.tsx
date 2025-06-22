
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Settings, Target, Users, Package, Sparkles, TrendingUp, Activity } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ClientSelector from '@/components/ClientSelector';
import UniversalRequirementsManager from '@/components/UniversalRequirementsManager';
import FormulationInterface from '@/components/FormulationInterface';
import IngredientManagement from '@/components/IngredientManagement';
import MinimalFormulation from '@/components/MinimalFormulation';
import { useClients } from '@/hooks/useClients';

const Index = () => {
  const { clients, selectedClient, setSelectedClient, addClient } = useClients();
  const [activeSection, setActiveSection] = useState('formulation');

  const renderContent = () => {
    switch (activeSection) {
      case 'formulation':
        return <MinimalFormulation />;
      
      case 'advanced-formulation':
        return <FormulationInterface />;
      
      case 'requirements':
        return <UniversalRequirementsManager />;
      
      case 'ingredients':
        return <IngredientManagement />;

      case 'clients':
        return (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
                  <p className="text-blue-100">Gerencie todos os seus clientes e seus ingredientes</p>
                </div>
              </div>
            </div>
            
            <ClientSelector
              clients={clients}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
              onAddClient={addClient}
            />
            
            {!clients.length && (
              <Card className="border-2 border-blue-100">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Adicione seu Primeiro Cliente</h3>
                    <p className="text-gray-600 mb-4">Comece criando um cliente para gerenciar ingredientes e formulações.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'presets':
        return (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Presets Nutricionais</h2>
                  <p className="text-purple-100">Exigências pré-configuradas para todas as fases</p>
                </div>
              </div>
            </div>
            <UniversalRequirementsManager />
          </div>
        );

      case 'nutritional-reports':
      case 'cost-analysis':
      case 'batch-reports':
      case 'export':
        return (
          <div className="p-6">
            <Card className="border-2 border-orange-100">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Relatórios Avançados</h3>
                  <p className="text-gray-600 mb-4">Sistema de relatórios em desenvolvimento</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-orange-800">
                      📊 Relatórios detalhados de formulação<br/>
                      💰 Análise de custos e rentabilidade<br/>
                      📈 Comparações nutricionais<br/>
                      📋 Exportação para PDF/Excel
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'calculator':
      case 'converter':
      case 'validator':
        return (
          <div className="p-6">
            <Card className="border-2 border-purple-100">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Calculator className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ferramentas Auxiliares</h3>
                  <p className="text-gray-600 mb-4">Calculadoras e conversores especializados</p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-purple-800">
                      🧮 Calculadora nutricional<br/>
                      🔄 Conversor de unidades<br/>
                      ✅ Validador de fórmulas<br/>
                      📊 Análises específicas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'help':
        return (
          <div className="p-6">
            <Card className="border-2 border-green-100">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Activity className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ajuda e Documentação</h3>
                  <p className="text-gray-600 mb-4">Guias e tutoriais completos do sistema</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-green-800">
                      📚 Manual do usuário<br/>
                      🎥 Tutoriais em vídeo<br/>
                      ❓ Perguntas frequentes<br/>
                      💬 Suporte técnico
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <MinimalFormulation />;
    }
  };

  return (
    <MainLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
