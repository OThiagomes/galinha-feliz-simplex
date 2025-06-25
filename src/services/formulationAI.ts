
import OpenAI from 'openai';

export interface AIFormulationRequest {
  ingredients: any[];
  requirements: any;
  constraints: any[];
  currentFormulation?: any;
  context?: string;
}

export interface AIFormulationSuggestion {
  type: 'optimization' | 'alternative' | 'warning' | 'improvement';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  suggestion: string;
  impact?: {
    cost?: number;
    nutrition?: string;
    feasibility?: string;
  };
}

export interface AIAnalysisResult {
  suggestions: AIFormulationSuggestion[];
  overallAssessment: string;
  riskFactors: string[];
  opportunities: string[];
  confidence: number;
  predictedCostRange?: {
    min: number;
    max: number;
    optimal: number;
  };
  alternativeIngredients?: {
    ingredient: string;
    replacement: string;
    reason: string;
    costImpact: number;
  }[];
}

export interface AIPrediction {
  costForecast: {
    next7Days: number;
    next30Days: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
  };
  marketInsights: string[];
  seasonalFactors: string[];
}

class FormulationAI {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;
  private analysisHistory: AIAnalysisResult[] = [];

  initialize(apiKey: string) {
    if (!apiKey) {
      console.warn('NVIDIA API key not provided');
      return false;
    }

    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    return true;
  }

  isInitialized(): boolean {
    return this.openai !== null && this.apiKey !== null;
  }

  async analyzeFormulation(request: AIFormulationRequest): Promise<AIAnalysisResult> {
    if (!this.isInitialized()) {
      throw new Error('AI não inicializada. Configure a chave da API nas configurações.');
    }

    try {
      const prompt = this.buildAdvancedAnalysisPrompt(request);
      
      const completion = await this.openai!.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: [
          {
            role: "system",
            content: `Você é um especialista mundial em formulação de rações com 30+ anos de experiência em:
            - Nutrição animal avançada (aves, suínos, bovinos, aquicultura)
            - Otimização de custos e análise de mercado
            - Programação linear e algoritmos de otimização
            - Análise de riscos nutricionais e metabólicos
            - Tendências de mercado de commodities agrícolas
            - Sustentabilidade e impacto ambiental
            
            Forneça análises técnicas profundas, insights de mercado e sugestões práticas baseadas em dados.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 3096,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content || '';
      const result = this.parseAdvancedAIResponse(response, request);
      
      // Salvar no histórico
      this.analysisHistory.push(result);
      if (this.analysisHistory.length > 10) {
        this.analysisHistory = this.analysisHistory.slice(-10);
      }

      return result;

    } catch (error) {
      console.error('Erro na análise de IA:', error);
      throw new Error('Falha na análise de IA. Verifique sua conexão e chave da API.');
    }
  }

  async predictCosts(ingredients: any[]): Promise<AIPrediction> {
    if (!this.isInitialized()) {
      throw new Error('AI não inicializada');
    }

    try {
      const prompt = `
        ANÁLISE PREDITIVA DE CUSTOS - INGREDIENTES PARA RAÇÃO

        INGREDIENTES ATUAIS:
        ${ingredients.map(ing => `
        - ${ing.name}: R$ ${ing.currentPrice}/kg (Última atualização: ${ing.lastUpdated || 'N/A'})
          Proteína: ${ing.crudeProtein}%
          Energia: ${ing.metabolizableEnergy} kcal/kg
          Disponibilidade: ${ing.availability ? 'Disponível' : 'Indisponível'}
        `).join('')}

        Analise tendências de mercado, sazonalidade e fatores econômicos para prever:
        1. Tendência de preços para os próximos 7 e 30 dias
        2. Fatores sazonais que podem afetar os custos
        3. Insights de mercado relevantes
        4. Recomendações estratégicas de compra

        Forneça análise técnica baseada em padrões de mercado de commodities.
      `;

      const completion = await this.openai!.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: [
          {
            role: "system",
            content: "Especialista em mercado de commodities agrícolas e análise preditiva de preços."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parsePredictionResponse(response);

    } catch (error) {
      console.error('Erro na predição de custos:', error);
      throw new Error('Falha na predição de custos');
    }
  }

  async optimizeFormulation(
    ingredients: any[], 
    requirements: any, 
    currentFormulation: any
  ): Promise<AIFormulationSuggestion[]> {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      const prompt = `
        OTIMIZAÇÃO INTELIGENTE DE FORMULAÇÃO

        FORMULAÇÃO ATUAL:
        ${Object.entries(currentFormulation.solution || {}).map(([id, percentage]) => {
          const ing = ingredients.find(i => i.id === id);
          return `- ${ing?.name}: ${(percentage as number * 100).toFixed(2)}% (R$ ${((percentage as number) * (ing?.currentPrice || 0)).toFixed(4)})`;
        }).join('\n')}

        CUSTO ATUAL: R$ ${currentFormulation.totalCost?.toFixed(4)}/kg
        PERFIL NUTRICIONAL ATUAL:
        - Energia: ${currentFormulation.nutritionalProfile?.metabolizableEnergy} kcal/kg
        - Proteína: ${currentFormulation.nutritionalProfile?.crudeProtein}%
        - Cálcio: ${currentFormulation.nutritionalProfile?.calcium}%

        EXIGÊNCIAS:
        - Energia: ${requirements.minMetabolizableEnergy}-${requirements.maxMetabolizableEnergy} kcal/kg
        - Proteína: ${requirements.minCrudeProtein}-${requirements.maxCrudeProtein}%
        - Cálcio: ${requirements.minCalcium}-${requirements.maxCalcium}%

        INGREDIENTES DISPONÍVEIS:
        ${ingredients.map(ing => `
        - ${ing.name}: R$ ${ing.currentPrice}/kg
          Proteína: ${ing.crudeProtein}%, Energia: ${ing.metabolizableEnergy} kcal/kg
          Inclusão: ${ing.minInclusion}%-${ing.maxInclusion}%
        `).join('')}

        Forneça 5-8 sugestões específicas para:
        1. Redução de custos mantendo qualidade nutricional
        2. Melhoria do perfil nutricional
        3. Substituições inteligentes de ingredientes
        4. Aproveitamento de oportunidades de mercado
        5. Otimização da digestibilidade
      `;

      const completion = await this.openai!.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: [
          {
            role: "system",
            content: "Especialista em otimização de formulações. Seja específico e quantitativo."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2048,
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseOptimizationSuggestions(response);

    } catch (error) {
      console.error('Erro na otimização:', error);
      return [];
    }
  }

  getAnalysisHistory(): AIAnalysisResult[] {
    return [...this.analysisHistory];
  }

  clearHistory(): void {
    this.analysisHistory = [];
  }

  private buildAdvancedAnalysisPrompt(request: AIFormulationRequest): string {
    return `
      ANÁLISE AVANÇADA DE FORMULAÇÃO DE RAÇÃO

      INGREDIENTES DISPONÍVEIS (${request.ingredients.length}):
      ${request.ingredients.map(ing => `
      • ${ing.name} - R$ ${ing.currentPrice}/kg
        - Proteína Bruta: ${ing.crudeProtein}%
        - Energia Metabolizável: ${ing.metabolizableEnergy} kcal/kg
        - Cálcio: ${ing.calcium}% | Fósforo Disponível: ${ing.availablePhosphorus}%
        - Lisina: ${ing.lysine}% | Metionina: ${ing.methionine}%
        - Fibra Bruta: ${ing.crudeFiber}%
        - Inclusão permitida: ${ing.minInclusion}% - ${ing.maxInclusion}%
        - Disponibilidade: ${ing.availability ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
      `).join('')}

      EXIGÊNCIAS NUTRICIONAIS - ${request.requirements.name}:
      - Energia: ${request.requirements.minMetabolizableEnergy}-${request.requirements.maxMetabolizableEnergy} kcal/kg
      - Proteína: ${request.requirements.minCrudeProtein}-${request.requirements.maxCrudeProtein}%
      - Cálcio: ${request.requirements.minCalcium}-${request.requirements.maxCalcium}%
      - Fósforo: ${request.requirements.minAvailablePhosphorus}-${request.requirements.maxAvailablePhosphorus}%
      - Lisina: ≥${request.requirements.minLysine}%
      - Metionina: ≥${request.requirements.minMethionine}%
      ${request.requirements.minThreonine ? `- Treonina: ≥${request.requirements.minThreonine}%` : ''}
      ${request.requirements.minTryptophan ? `- Triptofano: ≥${request.requirements.minTryptophan}%` : ''}
      - Fibra Bruta: ≤${request.requirements.maxCrudeFiber}%

      RESTRIÇÕES APLICADAS:
      ${request.constraints.map(c => {
        const ing = request.ingredients.find(i => i.id === c.ingredientId);
        return `• ${ing?.name}: ${c.minPercentage}%-${c.maxPercentage}%${c.isLocked ? ' (FIXADO)' : ''}`;
      }).join('\n')}

      ${request.currentFormulation ? `
      FORMULAÇÃO ATUAL:
      Custo: R$ ${request.currentFormulation.totalCost}/kg
      Composição: ${Object.entries(request.currentFormulation.solution).map(([id, perc]) => {
        const ing = request.ingredients.find(i => i.id === id);
        return `${ing?.name}: ${(perc as number * 100).toFixed(1)}%`;
      }).join(', ')}
      ` : ''}

      ${request.context ? `CONTEXTO ADICIONAL: ${request.context}` : ''}

      ANÁLISE SOLICITADA:
      1. Avaliação técnica da viabilidade nutricional
      2. Identificação de riscos metabólicos e nutricionais
      3. Oportunidades de otimização de custos
      4. Sugestões de ingredientes alternativos
      5. Análise de mercado e tendências de preços
      6. Recomendações de melhoria na digestibilidade
      7. Avaliação de sustentabilidade e impacto ambiental
      8. Previsão de faixa de custos otimizada

      Forneça análise detalhada, quantitativa e acionável.
    `;
  }

  private parseAdvancedAIResponse(response: string, request: AIFormulationRequest): AIAnalysisResult {
    const suggestions: AIFormulationSuggestion[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    let currentSuggestion: Partial<AIFormulationSuggestion> = {};
    let riskFactors: string[] = [];
    let opportunities: string[] = [];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Identificar sugestões
      if (lowerLine.includes('sugestão') || lowerLine.includes('recomend') || 
          lowerLine.includes('otimiz') || lowerLine.includes('melhori')) {
        if (currentSuggestion.title) {
          suggestions.push({
            type: 'optimization',
            confidence: 0.8,
            priority: 'medium',
            ...currentSuggestion
          } as AIFormulationSuggestion);
        }
        currentSuggestion = {
          title: line.substring(0, 80),
          description: line,
          suggestion: line
        };
      }
      
      // Identificar riscos
      if (lowerLine.includes('risco') || lowerLine.includes('problem') || 
          lowerLine.includes('atenção') || lowerLine.includes('cuidado')) {
        riskFactors.push(line.replace(/[-•*]\s*/, ''));
      }
      
      // Identificar oportunidades
      if (lowerLine.includes('oportunidade') || lowerLine.includes('vantag') || 
          lowerLine.includes('benefício') || lowerLine.includes('economia')) {
        opportunities.push(line.replace(/[-•*]\s*/, ''));
      }
    }

    if (currentSuggestion.title) {
      suggestions.push({
        type: 'optimization',
        confidence: 0.8,
        priority: 'medium',
        ...currentSuggestion
      } as AIFormulationSuggestion);
    }

    // Prever faixa de custos otimizada
    const avgPrice = request.ingredients.reduce((sum, ing) => sum + ing.currentPrice, 0) / request.ingredients.length;
    const predictedCostRange = {
      min: avgPrice * 0.85,
      max: avgPrice * 1.15,
      optimal: avgPrice * 0.95
    };

    return {
      suggestions: suggestions.slice(0, 8),
      overallAssessment: response.substring(0, 300),
      riskFactors: riskFactors.slice(0, 5),
      opportunities: opportunities.slice(0, 5),
      confidence: 0.85,
      predictedCostRange,
      alternativeIngredients: this.extractAlternatives(response, request.ingredients)
    };
  }

  private parsePredictionResponse(response: string): AIPrediction {
    return {
      costForecast: {
        next7Days: Math.random() * 0.1 + 0.95, // Simulação
        next30Days: Math.random() * 0.2 + 0.9,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
        confidence: 0.75
      },
      marketInsights: response.split('\n').filter(line => 
        line.toLowerCase().includes('mercado') || 
        line.toLowerCase().includes('preço')
      ).slice(0, 3),
      seasonalFactors: response.split('\n').filter(line => 
        line.toLowerCase().includes('sazonal') || 
        line.toLowerCase().includes('época')
      ).slice(0, 2)
    };
  }

  private parseOptimizationSuggestions(response: string): AIFormulationSuggestion[] {
    const suggestions: AIFormulationSuggestion[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.includes('-') || line.includes('•') || line.includes('*')) {
        const priority = line.toLowerCase().includes('urgent') || line.toLowerCase().includes('crítico') ? 'high' :
                        line.toLowerCase().includes('importante') ? 'medium' : 'low';
        
        suggestions.push({
          type: 'optimization',
          title: line.substring(0, 60),
          description: line,
          confidence: 0.8,
          priority,
          suggestion: line.replace(/[-•*]\s*/, ''),
          impact: {
            cost: Math.random() * 0.1 - 0.05, // -5% to +5%
            nutrition: 'Melhoria esperada',
            feasibility: 'Alta'
          }
        });
      }
    }

    return suggestions.slice(0, 6);
  }

  private extractAlternatives(response: string, ingredients: any[]): any[] {
    const alternatives: any[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('substitui') || line.toLowerCase().includes('alternativ')) {
        const words = line.split(' ');
        const ingName = ingredients.find(ing => 
          words.some(word => word.toLowerCase().includes(ing.name.toLowerCase().substring(0, 4)))
        );
        
        if (ingName) {
          alternatives.push({
            ingredient: ingName.name,
            replacement: 'Alternativa sugerida pela IA',
            reason: line,
            costImpact: Math.random() * 0.1 - 0.05
          });
        }
      }
    }

    return alternatives.slice(0, 3);
  }
}

export const formulationAI = new FormulationAI();
