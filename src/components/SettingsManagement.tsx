
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Zap,
  Brain,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    // Configurações Gerais
    companyName: 'NutriFormula Pro',
    userEmail: 'admin@exemplo.com',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    
    // Notificações
    emailNotifications: true,
    stockAlerts: true,
    priceAlerts: true,
    systemUpdates: false,
    
    // IA e Otimização
    aiEnabled: true,
    autoOptimization: true,
    tensorFlowModel: 'advanced',
    predictionAccuracy: 'high',
    
    // Interface
    theme: 'light',
    compactMode: false,
    showAdvancedFeatures: true,
    
    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 30,
    autoLogout: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: 'Configurações Gerais',
      icon: Settings,
      color: 'bg-blue-100 text-blue-600',
      settings: [
        { key: 'companyName', label: 'Nome da Empresa', type: 'text' },
        { key: 'userEmail', label: 'Email Principal', type: 'email' },
        { key: 'language', label: 'Idioma', type: 'select', options: [
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'en-US', label: 'English (US)' },
          { value: 'es-ES', label: 'Español' }
        ]},
        { key: 'timezone', label: 'Fuso Horário', type: 'text' }
      ]
    },
    {
      title: 'Notificações',
      icon: Bell,
      color: 'bg-yellow-100 text-yellow-600',
      settings: [
        { key: 'emailNotifications', label: 'Notificações por Email', type: 'switch' },
        { key: 'stockAlerts', label: 'Alertas de Estoque', type: 'switch' },
        { key: 'priceAlerts', label: 'Alertas de Preço', type: 'switch' },
        { key: 'systemUpdates', label: 'Atualizações do Sistema', type: 'switch' }
      ]
    },
    {
      title: 'Inteligência Artificial',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
      settings: [
        { key: 'aiEnabled', label: 'IA Habilitada', type: 'switch' },
        { key: 'autoOptimization', label: 'Otimização Automática',  type: 'switch' },
        { key: 'tensorFlowModel', label: 'Modelo TensorFlow', type: 'select', options: [
          { value: 'basic', label: 'Básico' },
          { value: 'advanced', label: 'Avançado' },
          { value: 'expert', label: 'Expert' }
        ]},
        { key: 'predictionAccuracy', label: 'Precisão das Predições', type: 'select', options: [
          { value: 'standard', label: 'Padrão' },
          { value: 'high', label: 'Alta' },
          { value: 'maximum', label: 'Máxima' }
        ]}
      ]
    },
    {
      title: 'Interface',
      icon: Palette,
      color: 'bg-green-100 text-green-600',
      settings: [
        { key: 'theme', label: 'Tema', type: 'select', options: [
          { value: 'light', label: 'Claro' },
          { value: 'dark', label: 'Escuro' },
          { value: 'auto', label: 'Automático' }
        ]},
        { key: 'compactMode', label: 'Modo Compacto', type: 'switch' },
        { key: 'showAdvancedFeatures', label: 'Recursos Avançados', type: 'switch' }
      ]
    },
    {
      title: 'Segurança',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
      settings: [
        { key: 'twoFactorAuth', label: 'Autenticação 2FA', type: 'switch' },
        { key: 'sessionTimeout', label: 'Timeout da Sessão (min)', type: 'number' },
        { key: 'autoLogout', label: 'Logout Automático', type: 'switch' }
      ]
    }
  ];

  const renderSettingInput = (setting) => {
    switch (setting.type) {
      case 'switch':
        return (
          <Switch
            checked={settings[setting.key]}
            onCheckedChange={(value) => handleSettingChange(setting.key, value)}
          />
        );
      case 'select':
        return (
          <select
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="px-3 py-2 border rounded-md w-full max-w-xs"
          >
            {setting.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
            className="w-full max-w-xs"
          />
        );
      default:
        return (
          <Input
            type={setting.type}
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full max-w-xs"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Configurações do Sistema</h2>
          <p className="text-gray-600">Personalize e configure o NutriFormula</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar Padrões
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Sistema Operacional</h3>
                <p className="text-green-700">Todos os serviços funcionando normalmente</p>
              </div>
            </div>
            <Badge className="bg-green-600">
              Versão 2.1.0
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${section.color}`}>
                  <section.icon className="w-5 h-5" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-2">
                  <div>
                    <label className="font-medium text-gray-700">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    )}
                  </div>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Database className="w-5 h-5 text-gray-600" />
            </div>
            Gerenciamento de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
            <Button variant="outline" className="justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Importar Dados
            </Button>
            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Sistema
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Estatísticas de Uso</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Formulações Criadas</p>
                <p className="font-semibold">1,247</p>
              </div>
              <div>
                <p className="text-gray-600">Espaço Utilizado</p>
                <p className="font-semibold">2.3 GB</p>
              </div>
              <div>
                <p className="text-gray-600">Usuários Ativos</p>
                <p className="font-semibold">12</p>
              </div>
              <div>
                <p className="text-gray-600">Último Backup</p>
                <p className="font-semibold">Hoje, 03:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
