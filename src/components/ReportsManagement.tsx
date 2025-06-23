
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChartIcon, 
  DownloadIcon, 
  CalendarIcon,
  PersonIcon,
  MixIcon
} from '@radix-ui/react-icons';

const ReportsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedClient, setSelectedClient] = useState('all');

  const reportTypes = [
    {
      id: 'formulations',
      title: 'Relatório de Formulações',
      description: 'Análise detalhada das formulações realizadas',
      icon: <MixIcon className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      id: 'costs',
      title: 'Relatório de Custos',
      description: 'Análise de custos por formulação e período',
      icon: <BarChartIcon className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      id: 'clients',
      title: 'Relatório de Clientes',
      description: 'Atividade e histórico por cliente',
      icon: <PersonIcon className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      id: 'ingredients',
      title: 'Relatório de Ingredientes',
      description: 'Uso e variação de preços dos ingredientes',
      icon: <MixIcon className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  const recentReports = [
    {
      name: 'Formulações - Janeiro 2024',
      type: 'Formulações',
      date: '2024-01-31',
      size: '2.1 MB',
    },
    {
      name: 'Custos - Dezembro 2023',
      type: 'Custos',
      date: '2023-12-31',
      size: '1.8 MB',
    },
    {
      name: 'Clientes - Q4 2023',
      type: 'Clientes',
      date: '2023-12-31',
      size: '1.2 MB',
    },
  ];

  const handleGenerateReport = (reportType: string) => {
    console.log(`Gerando relatório: ${reportType}, período: ${selectedPeriod}, cliente: ${selectedClient}`);
    // Aqui seria implementada a lógica de geração de relatório
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">Relatórios e Análises</h1>
        <p className="text-purple-100">Gere relatórios detalhados sobre formulações, custos e desempenho</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Gerar Relatórios</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Período</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Última Semana</SelectItem>
                      <SelectItem value="monthly">Último Mês</SelectItem>
                      <SelectItem value="quarterly">Último Trimestre</SelectItem>
                      <SelectItem value="yearly">Último Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cliente</label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Clientes</SelectItem>
                      <SelectItem value="client1">Cliente ABC</SelectItem>
                      <SelectItem value="client2">Cliente XYZ</SelectItem>
                      <SelectItem value="client3">Cliente 123</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Relatórios */}
          <div className="grid md:grid-cols-2 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${report.color} text-white`}>
                      {report.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleGenerateReport(report.id)}
                    className="w-full"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Tipo: {report.type}</span>
                        <span>Data: {new Date(report.date).toLocaleDateString('pt-BR')}</span>
                        <span>Tamanho: {report.size}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
