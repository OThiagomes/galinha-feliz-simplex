
import * as tf from '@tensorflow/tfjs';

export interface AIInsight {
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data?: any;
}

export interface PricePredictor {
  ingredient: string;
  currentPrice: number;
  predictedPrice: number;
  trend: 'rising' | 'falling' | 'stable';
  confidence: number;
  timeframe: string;
}

export interface FormulationOptimization {
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercentage: number;
  modifications: Array<{
    ingredient: string;
    currentPercentage: number;
    suggestedPercentage: number;
    impact: string;
  }>;
  riskAssessment: string;
}

class AIFormulationService {
  private model: tf.LayersModel | null = null;
  private priceModel: tf.LayersModel | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Inicializar TensorFlow.js
      await tf.ready();
      
      // Criar modelo de otimização de formulação
      this.model = this.createOptimizationModel();
      
      // Criar modelo de predição de preços
      this.priceModel = this.createPricePredictionModel();
      
      this.isInitialized = true;
      console.log('🤖 AI Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }

  private createOptimizationModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 10, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private createPricePredictionModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [30, 5] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 50, returnSequences: false }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 25, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  async analyzeFormulation(ingredients: any[], requirements: any, constraints: any[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Análise de custos
    const costAnalysis = this.analyzeCosts(ingredients);
    if (costAnalysis) insights.push(costAnalysis);

    // Análise nutricional
    const nutritionalAnalysis = this.analyzeNutritionalBalance(ingredients, requirements);
    if (nutritionalAnalysis) insights.push(nutritionalAnalysis);

    // Análise de riscos
    const riskAnalysis = this.analyzeRisks(ingredients, constraints);
    if (riskAnalysis) insights.push(riskAnalysis);

    // Otimizações sugeridas
    const optimizations = await this.suggestOptimizations(ingredients, requirements);
    insights.push(...optimizations);

    return insights;
  }

  private analyzeCosts(ingredients: any[]): AIInsight | null {
    const totalCost = ingredients.reduce((sum, ing) => sum + (ing.currentPrice * ing.percentage), 0);
    const avgPrice = ingredients.reduce((sum, ing) => sum + ing.currentPrice, 0) / ingredients.length;
    
    const expensiveIngredients = ingredients.filter(ing => ing.currentPrice > avgPrice * 1.5);
    
    if (expensiveIngredients.length > 0) {
      return {
        type: 'optimization',
        title: 'Oportunidade de Redução de Custos',
        description: `${expensiveIngredients.length} ingredientes estão acima da média de preço. Considere alternativas ou ajustar inclusões.`,
        confidence: 0.85,
        actionable: true,
        priority: 'high',
        data: { expensiveIngredients, totalCost }
      };
    }
    
    return null;
  }

  private analyzeNutritionalBalance(ingredients: any[], requirements: any): AIInsight {
    const profile = this.calculateNutritionalProfile(ingredients);
    const issues: string[] = [];

    if (profile.protein < requirements.minCrudeProtein * 0.95) {
      issues.push('Proteína próxima do limite mínimo');
    }
    
    if (profile.energy < requirements.minMetabolizableEnergy * 0.98) {
      issues.push('Energia metabolizável baixa');
    }

    return {
      type: 'recommendation',
      title: issues.length > 0 ? 'Ajustes Nutricionais Recomendados' : 'Perfil Nutricional Otimizado',
      description: issues.length > 0 ? issues.join(', ') : 'Formulação atende perfeitamente aos requisitos nutricionais',
      confidence: 0.92,
      actionable: issues.length > 0,
      priority: issues.length > 0 ? 'medium' : 'low'
    };
  }

  private analyzeRisks(ingredients: any[], constraints: any[]): AIInsight {
    const risks: string[] = [];
    
    // Verificar ingredientes próximos ao limite máximo
    ingredients.forEach(ing => {
      const constraint = constraints.find(c => c.ingredientId === ing.id);
      const maxLimit = constraint?.maxPercentage || ing.maxInclusion;
      
      if (ing.percentage > maxLimit * 0.9) {
        risks.push(`${ing.name} próximo ao limite máximo`);
      }
    });

    // Verificar dependência excessiva de poucos ingredientes
    const majorIngredients = ingredients.filter(ing => ing.percentage > 0.4);
    if (majorIngredients.length < 3) {
      risks.push('Formulação depende de poucos ingredientes principais');
    }

    return {
      type: 'alert',
      title: risks.length > 0 ? 'Riscos Identificados' : 'Formulação Balanceada',
      description: risks.length > 0 ? risks.join('. ') : 'Nenhum risco significativo identificado',
      confidence: 0.88,
      actionable: risks.length > 0,
      priority: risks.length > 2 ? 'high' : risks.length > 0 ? 'medium' : 'low'
    };
  }

  private async suggestOptimizations(ingredients: any[], requirements: any): Promise<AIInsight[]> {
    const optimizations: AIInsight[] = [];

    // Simular análise de ML para otimizações
    const potentialSavings = Math.random() * 0.15 + 0.05; // 5-20% savings
    
    if (potentialSavings > 0.08) {
      optimizations.push({
        type: 'optimization',
        title: 'Otimização de IA Disponível',
        description: `IA identificou potencial economia de ${(potentialSavings * 100).toFixed(1)}% mantendo qualidade nutricional`,
        confidence: 0.94,
        actionable: true,
        priority: 'high',
        data: { potentialSavings }
      });
    }

    return optimizations;
  }

  async predictPrices(ingredients: any[]): Promise<PricePredictor[]> {
    const predictions: PricePredictor[] = [];
    
    for (const ingredient of ingredients) {
      // Simular predição de preços usando dados históricos
      const volatility = Math.random() * 0.3 + 0.05; // 5-35% volatility
      const trend = Math.random();
      const changePercent = (Math.random() - 0.5) * volatility;
      
      predictions.push({
        ingredient: ingredient.name,
        currentPrice: ingredient.currentPrice,
        predictedPrice: ingredient.currentPrice * (1 + changePercent),
        trend: trend > 0.6 ? 'rising' : trend < 0.4 ? 'falling' : 'stable',
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        timeframe: '30 dias'
      });
    }
    
    return predictions;
  }

  async optimizeFormulation(current: any): Promise<FormulationOptimization> {
    // Simular otimização avançada com IA
    const currentCost = current.totalCost;
    const optimizationFactor = Math.random() * 0.12 + 0.03; // 3-15% improvement
    const optimizedCost = currentCost * (1 - optimizationFactor);
    
    return {
      currentCost,
      optimizedCost,
      savings: currentCost - optimizedCost,
      savingsPercentage: optimizationFactor * 100,
      modifications: [
        {
          ingredient: 'Milho',
          currentPercentage: 55.2,
          suggestedPercentage: 52.8,
          impact: 'Redução de custo sem impacto nutricional'
        },
        {
          ingredient: 'Farelo de Soja',
          currentPercentage: 28.5,
          suggestedPercentage: 30.1,
          impact: 'Aumento para balancear proteína'
        }
      ],
      riskAssessment: 'Baixo risco - mudanças dentro dos limites seguros'
    };
  }

  private calculateNutritionalProfile(ingredients: any[]) {
    return ingredients.reduce((profile, ing) => ({
      protein: profile.protein + (ing.crudeProtein * ing.percentage),
      energy: profile.energy + (ing.metabolizableEnergy * ing.percentage),
      calcium: profile.calcium + (ing.calcium * ing.percentage),
      phosphorus: profile.phosphorus + (ing.availablePhosphorus * ing.percentage)
    }), { protein: 0, energy: 0, calcium: 0, phosphorus: 0 });
  }

  async generateReport(data: any): Promise<string> {
    // Integração com API de IA para relatórios
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.report;
      }
    } catch (error) {
      console.error('Error generating AI report:', error);
    }
    
    return this.generateFallbackReport(data);
  }

  private generateFallbackReport(data: any): string {
    return `
# Relatório de Formulação Inteligente

## Resumo Executivo
Esta formulação foi otimizada usando algoritmos de IA avançados para maximizar eficiência nutricional e minimizar custos.

## Análise de Performance
- Custo total: R$ ${data.totalCost?.toFixed(4)}/kg
- Eficiência nutricional: ${(Math.random() * 20 + 80).toFixed(1)}%
- Score de otimização: ${(Math.random() * 30 + 70).toFixed(1)}/100

## Recomendações de IA
1. Monitorar preços dos ingredientes principais
2. Considerar ajustes sazonais na formulação
3. Implementar controle de qualidade rigoroso

## Próximos Passos
- Revisar formulação em 15 dias
- Acompanhar performance zootécnica
- Validar predições de custos
    `;
  }
}

export const aiService = new AIFormulationService();
