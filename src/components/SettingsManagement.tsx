
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Database, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Save,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

interface SettingsConfig {
  [key: string]: any;
}

const SettingsManagement = () => {
  const [settings, setSettings] = useState<SettingsConfig>({
    // Configurações Gerais
    companyName: 'Formulador Pro',
    defaultCurrency: 'BRL',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    
    // Configurações de Formulação
    defaultOptimization: 'min-cost',
    enableAI: true,
    maxIterations: 1000,
    convergenceTolerance: 0.001,
    
    // Configurações de Interface
    theme: 'light',
    showAnimations: true,
    compactMode: false,
    autoSave: true,
    
    // Configurações de Relatórios
    reportFormat: 'pdf',
    includeCharts: true,
    includeCosts: true,
    includeNutrition: true,
    
    // Configurações de Notificações
    priceAlerts: true,
    formulationAlerts: true,
    systemNotifications: true,
    emailNotifications: false
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('formulator-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('formulator-settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    localStorage.removeItem('formulator-settings');
    window.location.reload();
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefault = 'formulator-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefault);
    linkElement.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings({ ...settings, ...importedSettings });
        } catch (error) {
          console.error('Erro ao importar configurações:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const settingsCategories = [
    {
      id: 'general',
      title: 'Geral',
      icon: Settings,
      settings: [
        { key: 'companyName', label: 'Nome da Empresa', type: 'text' },
        { key: 'defaultCurrency', label: 'Moeda Padrão', type: 'select', options: [
          { value: 'BRL', label: 'Real (R$)' },
          { value: 'USD', label: 'Dólar ($)' },
          { value: 'EUR', label: 'Euro (€)' }
        ]},
        { key: 'language', label: 'Idioma', type: 'select', options: [
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'en-US', label: 'English (US)' },
          { value: 'es-ES', label: 'Español' }
        ]},
        { key: 'timezone', label: 'Fuso Horário', type: 'select', options: [
          { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
          { value: 'America/New_York', label: 'Nova York (GMT-5)' },
          { value: 'Europe/London', label: 'Londres (GMT+0)' }
        ]}
      ]
    },
    {
      id: 'formulation',
      title: 'Formulação',
      icon: Database,
      settings: [
        { key: 'defaultOptimization', label: 'Otimização Padrão', type: 'select', options: [
          { value: 'min-cost', label: 'Menor Custo' },
          { value: 'max-margin', label: 'Maior Margem' },
          { value: 'best-conversion', label: 'Melhor Conversão' }
        ]},
        { key: 'enableAI', label: 'Habilitar IA', type: 'boolean' },
        { key: 'maxIterations', label: 'Max. Iterações', type: 'number' },
        { key: 'convergenceTolerance', label: 'Tolerância de Convergência', type: 'number' }
      ]
    },
    {
      id: 'interface',
      title: 'Interface',
      icon: Palette,
      settings: [
        { key: 'theme', label: 'Tema', type: 'select', options: [
          { value: 'light', label: 'Claro' },
          { value: 'dark', label: 'Escuro' },
          { value: 'auto', label: 'Automático' }
        ]},
        { key: 'showAnimations', label: 'Mostrar Animações', type: 'boolean' },
        { key: 'compactMode', label: 'Modo Compacto', type: 'boolean' },
        { key: 'autoSave', label: 'Salvamento Automático', type: 'boolean' }
      ]
    },
    {
      id: 'reports',
      title: 'Relatórios',
      icon: Download,
      settings: [
        { key: 'reportFormat', label: 'Formato Padrão', type: 'select', options: [
          { value: 'pdf', label: 'PDF' },
          { value: 'excel', label: 'Excel' },
          { value: 'csv', label: 'CSV' }
        ]},
        { key: 'includeCharts', label: 'Incluir Gráficos', type: 'boolean' },
        { key: 'includeCosts', label: 'Incluir Custos', type: 'boolean' },
        { key: 'includeNutrition', label: 'Incluir Nutrição', type: 'boolean' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: Bell,
      settings: [
        { key: 'priceAlerts', label: 'Alertas de Preço', type: 'boolean' },
        { key: 'formulationAlerts', label: 'Alertas de Formulação', type: 'boolean' },
        { key: 'systemNotifications', label: 'Notificações do Sistema', type: 'boolean' },
        { key: 'emailNotifications', label: 'Notificações por Email', type: 'boolean' }
      ]
    }
  ];

  const renderSettingInput = (setting: any) => {
    const value = settings[setting.key];

    switch (setting.type) {
      case 'text':
      case 'number':
        return (
          <Input
            type={setting.type}
            value={value || ''}
            onChange={(e) => updateSetting(setting.key, 
              setting.type === 'number' ? parseFloat(e.target.value) : e.target.value
            )}
            className="w-full"
          />
        );
      
      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => updateSetting(setting.key, val)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => updateSetting(setting.key, checked)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 via-blue-600 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
              <p className="text-blue-100">Personalize sua experiência de formulação</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={exportSettings}
              variant="ghost"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                variant="ghost"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status de Salvamento */}
      {saved && (
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configurações salvas com sucesso!
          </AlertDescription>
        </Alert>
      )}

      {/* Configurações */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {settingsCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="w-4 h-4" />
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {settingsCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6 mt-6">
                <div className="grid gap-6">
                  {category.settings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      {renderSettingInput(setting)}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Button
          onClick={resetSettings}
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Restaurar Padrões
        </Button>
        
        <Button
          onClick={saveSettings}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default SettingsManagement;
