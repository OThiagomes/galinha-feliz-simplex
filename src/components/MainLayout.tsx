
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DashboardIcon,
  PersonIcon,
  MixIcon,
  CalculatorIcon,
  BarChartIcon,
  GearIcon,
  LightbulbIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import AdvancedDashboard from './AdvancedDashboard';
import ClientsManagement from './ClientsManagement';
import IngredientsManagement from './IngredientsManagement';
import FormulationInterface from './FormulationInterface';
import ReportsManagement from './ReportsManagement';
import SettingsManagement from './SettingsManagement';
import MinimalFormulation from './MinimalFormulation';
import RequirementsManager from './RequirementsManager';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
    { key: 'clients', icon: <PersonIcon className="w-5 h-5" />, label: 'Clientes' },
    { key: 'ingredients', icon: <MixIcon className="w-5 h-5" />, label: 'Ingredientes' },
    { key: 'formulation', icon: <CalculatorIcon className="w-5 h-5" />, label: 'Formulação Avançada' },
    { key: 'minimal', icon: <LightbulbIcon className="w-5 h-5" />, label: 'Formulação Simplificada' },
    { key: 'requirements', icon: <GearIcon className="w-5 h-5" />, label: 'Exigências Nutricionais' },
    { key: 'reports', icon: <BarChartIcon className="w-5 h-5" />, label: 'Relatórios' },
    { key: 'settings', icon: <GearIcon className="w-5 h-5" />, label: 'Configurações' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdvancedDashboard />;
      case 'clients':
        return <ClientsManagement />;
      case 'ingredients':
        return <IngredientsManagement />;
      case 'formulation':
        return <FormulationInterface />;
      case 'minimal':
        return <MinimalFormulation />;
      case 'requirements':
        return <RequirementsManager />;
      case 'reports':
        return <ReportsManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <AdvancedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-orange-600">Formulador Pro</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <HamburgerMenuIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
                activeSection === item.key
                  ? 'bg-orange-100 text-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find(item => item.key === activeSection)?.label}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Sistema Ativo
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
