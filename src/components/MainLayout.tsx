
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
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Target,
  Package,
  BarChart3,
  Users,
  Settings,
  Zap,
  TrendingUp,
  FileText,
  Database,
  ChevronRight,
  Sparkles,
  Activity,
  PieChart,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeSection, onSectionChange }) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['formulation', 'management']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const menuSections = [
    {
      id: 'formulation',
      label: 'Formulação',
      icon: Calculator,
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      items: [
        { id: 'formulation', label: 'Formulação Rápida', icon: Zap, badge: 'Popular' },
        { id: 'advanced-formulation', label: 'Formulação Avançada', icon: Calculator },
        { id: 'optimization', label: 'Otimização', icon: TrendingUp },
        { id: 'comparison', label: 'Comparação', icon: BarChart3 }
      ]
    },
    {
      id: 'management',
      label: 'Gestão',
      icon: Database,
      color: 'bg-gradient-to-r from-green-500 to-teal-600',
      items: [
        { id: 'ingredients', label: 'Ingredientes', icon: Package },
        { id: 'requirements', label: 'Exigências', icon: Target },
        { id: 'clients', label: 'Clientes', icon: Users },
        { id: 'presets', label: 'Presets', icon: Sparkles, badge: 'Novo' }
      ]
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      items: [
        { id: 'nutritional-reports', label: 'Relatórios Nutricionais', icon: PieChart },
        { id: 'cost-analysis', label: 'Análise de Custos', icon: TrendingUp },
        { id: 'batch-reports', label: 'Relatórios de Lote', icon: FileText },
        { id: 'export', label: 'Exportação', icon: Activity }
      ]
    },
    {
      id: 'tools',
      label: 'Ferramentas',
      icon: Settings,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      items: [
        { id: 'calculator', label: 'Calculadora Nutricional', icon: Calculator },
        { id: 'converter', label: 'Conversor de Unidades', icon: Activity },
        { id: 'validator', label: 'Validador de Fórmulas', icon: Target },
        { id: 'help', label: 'Ajuda e Tutoriais', icon: HelpCircle }
      ]
    }
  ];

  const AppSidebar = () => (
    <Sidebar>
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-4">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Sistema de Formulação</h2>
            <p className="text-xs text-blue-100">Otimização Nutricional Avançada</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-gray-50 to-white">
        {menuSections.map((section) => (
          <SidebarGroup key={section.id} className="mb-2">
            <SidebarGroupLabel 
              className="cursor-pointer flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => toggleGroup(section.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${section.color} shadow-sm`}>
                  <section.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-700">{section.label}</span>
              </div>
              <ChevronRight 
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedGroups.includes(section.id) ? 'rotate-90' : ''
                }`} 
              />
            </SidebarGroupLabel>
            
            {expandedGroups.includes(section.id) && (
              <SidebarGroupContent>
                <SidebarMenu className="ml-4 space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeSection === item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-gray-100 ${
                          activeSection === item.id 
                            ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 font-medium' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${
                          activeSection === item.id ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-2 py-0 ${
                              item.badge === 'Popular' ? 'bg-green-100 text-green-700' :
                              item.badge === 'Novo' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t bg-gradient-to-r from-gray-100 to-blue-50 p-4">
        <div className="space-y-3">
          <div className="text-center text-xs text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="font-medium">Sistema Ativo</span>
            </div>
            <div className="bg-white bg-opacity-80 rounded-lg p-2">
              <div className="text-sm font-semibold text-gray-800">v2.0.0</div>
              <div className="text-xs text-gray-500">Formulação Avançada</div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-gray-600 hover:bg-white hover:text-gray-800"
            onClick={() => onSectionChange('help')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Documentação
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="hidden lg:block">
                    <h1 className="text-xl font-bold text-gray-800">
                      {menuSections
                        .flatMap(s => s.items)
                        .find(item => item.id === activeSection)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Sistema integrado de formulação nutricional
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
