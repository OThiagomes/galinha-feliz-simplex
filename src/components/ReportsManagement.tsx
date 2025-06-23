
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Target
} from 'lucide-react';

const ReportsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportTypes = [
    {
      id: 'formulations',
      title: 'Relatório de Formulações',
      description: 'Análise detalhada das formulações criadas',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
      count: 45
    },
    {
      id: 'ingredients',
      title: 'Relatório de Ingredientes',
      description: 'Uso e consumo de ingredientes',
      icon: Package,
      color: 'bg-green-100 text-green-600',
      count: 156
    },
    {
      id: 'clients',
      title: 'Relatório de Clientes',
      description: 'Atividade e demandas dos clientes',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      count: 23
    },
    {
      id: 'costs',
      title: 'Relatório de Custos',
      description: 'Análise financeira e otimização',
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
      count: 12
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Formulações - Dezembro 2024',
      type: 'Formulações',
      date: '2024-12-20',
      status: 'completed',
      downloads: 15
    },
    {
      id: 2,
      name: 'Análise de Custos - Q4 2024',
      type: 'Custos',
      date: '2024-12-18',
      status: 'completed',
      downloads: 8
    },
    {
      id: 3,
      name: 'Consumo de Ingredientes - Nov 2024',
      type: 'Ingredientes',
      date: '2024-12-15',
      status: 'processing',
      downloads: 0
    }
  ];

  const metrics = [
    {
      title: 'Formulações Criadas',
      value: '245',
      change: '+12%',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Custo Médio/Ton',
      value: 'R$ 1.850',
      change: '-5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Eficiência',
      value: '94.2%',
      change: '+2%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Clientes Ativos',
      value: '89',
      change: '+8%',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Central de Relatórios</h2>
          <p className="text-gray-600">Análises e insights detalhados</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Tudo
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} vs período anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Tipos de Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-4 rounded-lg ${report.color} mb-4`}>
                  <report.icon className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">{report.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <Badge variant="secondary">{report.count} registros</Badge>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Relatórios Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Badge variant={report.type === 'Formulações' ? 'default' : 'secondary'}>
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge 
                      variant={report.status === 'completed' ? 'default' : 'secondary'}
                      className={report.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {report.status === 'completed' ? 'Concluído' : 'Processando'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{report.downloads} downloads</p>
                  </div>
                  <Button size="sm" disabled={report.status !== 'completed'}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Formulações por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de formulações seria exibido aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de custos seria exibido aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManagement;
