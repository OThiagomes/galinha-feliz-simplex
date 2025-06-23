
import React, { useState } from 'react';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator,
  BarChart3,
  Brain,
  Settings,
  Users,
  Package,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
  Activity,
  FileText,
  Bell,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import FormulationInterface from './FormulationInterface';
import MinimalFormulation from './MinimalFormulation';
import AdvancedDashboard from './AdvancedDashboard';
import AIInsights from './AIInsights';
import { useClients } from '@/hooks/useClients';
import { useUniversalRequirements } from '@/hooks/useUniversalRequirements';

type ActiveView = 'dashboard' | 'formulation' | 'minimal' | 'ai-insights' | 'clients' | 'ingredients' | 'reports' | 'settings';

const MainLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const { clients } = useClients();
  const { requirements } = useUniversalRequirements();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      id: 'dashboard' as ActiveView,
      badge: "Pro",
      color: "text-blue-600"
    },
    {
      title: "Formulação Avançada",
      icon: Calculator,
      id: 'formulation' as ActiveView,
      badge: "IA",
      color: "text-purple-600"
    },
    {
      title: "Formulação Simples",
      icon: Zap,
      id: 'minimal' as ActiveView,
      badge: "Rápido",
      color: "text-green-600"
    },
    {
      title: "Insights de IA",
      icon: Brain,
      id: 'ai-insights' as ActiveView,
      badge: "Novo",
      color: "text-orange-600"
    }
  ];

  const dataItems = [
    {
      title: "Clientes",
      icon: Users,
      id: 'clients' as ActiveView,
      count: clients.length,
      color: "text-indigo-600"
    },
    {
      title: "Ingredientes",
      icon: Package,
      id: 'ingredients' as ActiveView,
      count: 156,
      color: "text-emerald-600"
    },
    {
      title: "Exigências",
      icon: Target,
      id: 'requirements' as ActiveView,
      count: requirements.length,
      color: "text-rose-600"
    }
  ];

  const systemItems = [
    {
      title: "Relatórios",
      icon: FileText,
      id: 'reports' as ActiveView,
      color: "text-cyan-600"
    },
    {
      title: "Configurações",
      icon: Settings,
      id: 'settings' as ActiveView,
      color: "text-gray-600"
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdvancedDashboard />;
      case 'formulation':
        return <FormulationInterface />;
      case 'minimal':
        return <MinimalFormulation />;
      case 'ai-insights':
        return (
          <AIInsights 
            ingredients={[]} 
            requirements={null} 
            constraints={[]} 
            currentResult={null}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Em Desenvolvimento</h3>
              <p className="text-gray-600">Esta seção estará disponível em breve!</p>
            </div>
          </div>
        );
    }
  };

  const getActiveItemTitle = () => {
    const allItems = [...navigationItems, ...dataItems, ...systemItems];
    const activeItem = allItems.find(item => item.id === activeView);
    return activeItem?.title || 'Dashboard';
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar className="border-r-2 border-gray-200 bg-white">
        <SidebarHeader className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800">NutriFormula</h2>
              <p className="text-xs text-gray-500">Sistema IA Avançado</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          {/* Navegação Principal */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              🧮 Formulação
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-gray-100 ${
                        activeView === item.id 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 shadow-sm' 
                          : ''
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-600' : item.color}`} />
                      <span className={`font-medium ${activeView === item.id ? 'text-blue-800' : 'text-gray-700'}`}>
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 ml-auto">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 ${
                            activeView === item.id ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
                          }`}
                        >
                          {item.badge}
                        </Badge>
                        {activeView === item.id && <ChevronRight className="w-4 h-4 text-blue-600" />}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Dados */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              📊 Dados
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dataItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-gray-100 ${
                        activeView === item.id 
                          ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-gray-500 shadow-sm' 
                          : ''
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-gray-700' : item.color}`} />
                      <span className={`font-medium ${activeView === item.id ? 'text-gray-800' : 'text-gray-700'}`}>
                        {item.title}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`ml-auto text-xs ${
                          activeView === item.id ? 'bg-gray-200 text-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        {item.count}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Sistema */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              ⚙️ Sistema
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-gray-100 ${
                        activeView === item.id 
                          ? 'bg-gray-100 border-l-4 border-gray-400' 
                          : ''
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-gray-700' : item.color}`} />
                      <span className={`font-medium ${activeView === item.id ? 'text-gray-800' : 'text-gray-700'}`}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200 p-4">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Sistema Online</span>
              </div>
              <div className="text-xs text-green-700">
                IA ativa • Todos os serviços operando
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Bell className="w-4 h-4 mr-1" />
                Alertas
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <HelpCircle className="w-4 h-4 mr-1" />
                Ajuda
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{getActiveItemTitle()}</h1>
                <p className="text-sm text-gray-600">
                  {activeView === 'dashboard' && 'Visão geral e métricas do sistema'}
                  {activeView === 'formulation' && 'Formulação com algoritmo Simplex avançado'}
                  {activeView === 'minimal' && 'Interface simplificada para formulação rápida'}
                  {activeView === 'ai-insights' && 'Análises inteligentes com TensorFlow'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                <Brain className="w-4 h-4 mr-1" />
                IA Ativa
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-300">
                <TrendingUp className="w-4 h-4 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
