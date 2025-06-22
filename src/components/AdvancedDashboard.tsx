
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Target,
  AlertTriangle,
  Zap,
  Brain,
  Calendar,
  Users,
  Package,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardMetrics {
  totalFormulations: number;
  averageCost: number;
  costSavings: number;
  efficiencyScore: number;
  activeClients: number;
  ingredientsTracked: number;
  aiRecommendations: number;
  successRate: number;
}

const AdvancedDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalFormulations: 0,
    averageCost: 0,
    costSavings: 0,
    efficiencyScore: 0,
    activeClients: 0,
    ingredientsTracked: 0,
    aiRecommendations: 0,
    successRate: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simular carregamento de dados do dashboard
    setTimeout(() => {
      setMetrics({
        totalFormulations: 342,
        averageCost: 1.89,
        costSavings: 12.4,
        efficiencyScore: 94.7,
        activeClients: 28,
        ingredientsTracked: 156,
        aiRecommendations: 89,
        successRate: 97.3
      });
      setIsLoading(false);
    }, 1500);
  };

  const costTrendData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Custo Médio (R$/kg)',
        data: [2.15, 2.08, 1.95, 1.87, 1.82, 1.89],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Meta de Custo',
        data: [2.00, 2.00, 2.00, 2.00, 2.00, 2.00],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderDash: [5, 5],
      }
    ],
  };

  const ingredientUsageData = {
    labels: ['Milho', 'F. Soja', 'Calcário', 'Fosfato', 'F. Trigo', 'Outros'],
    datasets: [
      {
        data: [45, 25, 8, 5, 7, 10],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#6B7280'
        ],
      }
    ],
  };

  const performanceData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Formulações Criadas',
        data: [12, 19, 15, 22],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Formulações Otimizadas',
        data: [8, 14, 11, 18],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      }
    ],
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color: string;
    isLoading?: boolean;
  }> = ({ title, value, change, icon, color, isLoading }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`border-2 border-${color}-200 hover:shadow-lg transition-shadow`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {isLoading ? (
                <div className="mt-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <p className={`text-3xl font-bold text-${color}-600 mt-2`}>
                  {value}
                </p>
              )}
              {change && !isLoading && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {change}
                </p>
              )}
            </div>
            <div className={`bg-${color}-100 p-3 rounded-full`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Avançado</h2>
            <p className="text-indigo-100 mt-2">Análise completa e métricas em tempo real</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 px-3 py-1">
              <Brain className="w-4 h-4 mr-1" />
              IA Ativa
            </Badge>
            <Badge className="bg-white text-purple-600 px-3 py-1">
              <Activity className="w-4 h-4 mr-1" />
              Tempo Real
            </Badge>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Formulações Criadas"
          value={metrics.totalFormulations}
          change="+23% este mês"
          icon={<Target className="w-6 h-6 text-blue-600" />}
          color="blue"
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Custo Médio"
          value={`R$ ${metrics.averageCost.toFixed(2)}/kg`}
          change="-8.2% vs. anterior"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          color="green"
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Economia Total"
          value={`${metrics.costSavings}%`}
          change="Acima da meta"
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="purple"
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Eficiência IA"
          value={`${metrics.efficiencyScore}%`}
          change="+5.3% melhoria"
          icon={<Brain className="w-6 h-6 text-orange-600" />}
          color="orange"
          isLoading={isLoading}
        />
      </div>

      {/* Gráficos e Análises */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Ingredientes
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Insights IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Evolução de Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isLoading && (
                <div className="h-80">
                  <Line 
                    data={costTrendData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: 'Tendência de Custos - Últimos 6 Meses'
                        }
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-500" />
                  Uso de Ingredientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoading && (
                  <div className="h-80">
                    <Doughnut 
                      data={ingredientUsageData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right' as const,
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Alertas de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-yellow-800">Farelo de Soja</h4>
                      <p className="text-sm text-yellow-700">Estoque baixo - 3 dias restantes</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600">
                      Crítico
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 border-l-4 border-orange-400 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-orange-800">Calcário</h4>
                      <p className="text-sm text-orange-700">Preço em alta - considere compra antecipada</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      Atenção
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-green-400 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">Milho</h4>
                      <p className="text-sm text-green-700">Estoque adequado - próxima compra em 15 dias</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      OK
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Performance Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isLoading && (
                <div className="h-80">
                  <Bar 
                    data={performanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: 'Formulações por Semana'
                        }
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600">{metrics.activeClients}</div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600">{metrics.ingredientsTracked}</div>
                <p className="text-sm text-gray-600">Ingredientes Monitorados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600">{metrics.successRate}%</div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="w-5 h-5" />
                  Recomendações de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Otimização de Custos</h4>
                  <p className="text-sm text-blue-700">IA detectou oportunidade de 8.5% de economia alterando proporções de milho e farelo de soja</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Zap className="w-4 h-4 mr-1" />
                    Aplicar
                  </Button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800">Qualidade Nutricional</h4>
                  <p className="text-sm text-green-700">Formulação atual atende 98.2% dos requisitos. Ajuste mínimo pode alcançar 99.8%</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Target className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-800">Predição de Mercado</h4>
                  <p className="text-sm text-yellow-700">Preço do milho pode subir 12% nas próximas 3 semanas. Considere ajustar formulação</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Planejar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Eficiência do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Algoritmo Simplex</span>
                    <span>98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Predições IA</span>
                    <span>94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Validação Nutricional</span>
                    <span>99.1%</span>
                  </div>
                  <Progress value={99.1} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Otimização de Custos</span>
                    <span>91.8%</span>
                  </div>
                  <Progress value={91.8} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">A+</div>
                    <p className="text-sm text-gray-600">Score Geral do Sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDashboard;
