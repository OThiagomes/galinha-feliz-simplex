import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Beaker, 
  BarChart3 
} from 'lucide-react';

const AdvancedDashboard = () => {
  const stats = [
    {
      title: 'Clientes Ativos',
      value: '12',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Ingredientes Cadastrados',
      value: '45',
      icon: <Beaker className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Formulações Realizadas',
      value: '28',
      icon: <LayoutDashboard className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Relatórios Gerados',
      value: '8',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Dashboard Principal</h1>
        <p className="text-orange-100">Visão geral do sistema de formulação</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Formulação para Cliente ABC</p>
                  <p className="text-sm text-gray-600">Há 2 horas</p>
                </div>
                <Badge variant="secondary">Concluída</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Novo ingrediente cadastrado</p>
                  <p className="text-sm text-gray-600">Há 1 dia</p>
                </div>
                <Badge variant="secondary">Novo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Relatório mensal gerado</p>
                  <p className="text-sm text-gray-600">Há 3 dias</p>
                </div>
                <Badge variant="secondary">Relatório</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Formulações Hoje</span>
                <Badge className="bg-green-100 text-green-700">3 concluídas</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Clientes Ativos</span>
                <Badge className="bg-blue-100 text-blue-700">12 ativos</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Ingredientes em Falta</span>
                <Badge className="bg-yellow-100 text-yellow-700">2 alertas</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Sistema</span>
                <Badge className="bg-green-100 text-green-700">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
