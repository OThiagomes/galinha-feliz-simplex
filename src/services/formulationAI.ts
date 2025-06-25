
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
}

class FormulationAI {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

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
      const prompt = this.buildAnalysisPrompt(request);
      
      const completion = await this.openai!.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em formulação de rações animais com conhecimento profundo em:
            - Nutrição animal (aves, suínos, bovinos)
            - Otimização de custos em formulação
            - Análise de ingredientes e suas interações
            - Avaliação de riscos nutricionais
            - Programação linear e algoritmos de otimização
            
            Analise formulações de forma técnica, precisa e prática. Sempre forneça sugestões acionáveis.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 2048,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseAIResponse(response);

    } catch (error) {
      console.error('Erro na análise de IA:', error);
      throw new Error('Falha na análise de IA. Verifique sua conexão e chave da API.');
    }
  }

  async getFormulationSuggestions(
    ingredients: any[], 
    requirements: any, 
    currentCost: number
  ): Promise<AIFormulationSuggestion[]> {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      const prompt = `
        Analisar formulação de ração:
        
        INGREDIENTES DISPONÍVEIS:
        ${ingredients.map(ing => `
        - ${ing.name}: R$ ${ing.currentPrice}/kg
          Proteína: ${ing.crudeProtein}%
          Energia: ${ing.metabolizableEnergy} kcal/kg
          Inclusão: ${ing.minInclusion}% - ${ing.maxInclusion}%
        `).join('')}
        
        EXIGÊNCIAS:
        - Energia: ${requirements.minMetabolizableEnergy}-${requirements.maxMetabolizableEnergy} kcal/kg
        - Proteína: ${requirements.minCrudeProtein}-${requirements.maxCrudeProtein}%
        - Cálcio: ${requirements.minCalcium}-${requirements.maxCalcium}%
        
        CUSTO ATUAL: R$ ${currentCost.toFixed(4)}/kg
        
        Forneça 3-5 sugestões específicas para otimizar esta formulação.
      `;

      const completion = await this.openai!.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: [
          {
            role: "system",
            content: "Especialista em formulação. Forneça sugestões práticas e específicas."
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
      return this.parseSuggestions(response);

    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      return [];
    }
  }

  private buildAnalysisPrompt(request: AIFormulationRequest): string {
    return `
      ANÁLISE DE FORMULAÇÃO DE RAÇÃO

      INGREDIENTES (${request.ingredients.length}):
      ${request.ingredients.map(ing => `
      • ${ing.name} - R$ ${ing.currentPrice}/kg
        - Proteína Bruta: ${ing.crudeProtein}%
        - Energia Metabolizável: ${ing.metabolizableEnergy} kcal/kg
        - Cálcio: ${ing.calcium}%
        - Fósforo Disponível: ${ing.availablePhosphorus}%
        - Inclusão permitida: ${ing.minInclusion}% - ${ing.maxInclusion}%
      `).join('')}

      EXIGÊNCIAS NUTRICIONAIS:
      - Energia: ${request.requirements.minMetabolizableEnergy}-${request.requirements.maxMetabolizableEnergy} kcal/kg
      - Proteína: ${request.requirements.minCrudeProtein}-${request.requirements.maxCrudeProtein}%
      - Cálcio: ${request.requirements.minCalcium}-${request.requirements.maxCalcium}%
      - Fósforo: ${request.requirements.minAvailablePhosphorus}-${request.requirements.maxAvailablePhosphorus}%
      - Lisina: ≥${request.requirements.minLysine}%
      - Metionina: ≥${request.requirements.minMethionine}%

      RESTRIÇÕES:
      ${request.constraints.map(c => {
        const ing = request.ingredients.find(i => i.id === c.ingredientId);
        return `• ${ing?.name}: ${c.minPercentage}%-${c.maxPercentage}%${c.isLocked ? ' (TRAVADO)' : ''}`;
      }).join('\n')}

      ${request.context ? `CONTEXTO ADICIONAL: ${request.context}` : ''}

      Analise esta formulação e forneça:
      1. Avaliação geral da viabilidade
      2. Identificação de riscos nutricionais
      3. Oportunidades de otimização de custos
      4. Sugestões específicas para melhorar a formulação
      5. Alertas sobre possíveis problemas

      Seja técnico, específico e prático em suas recomendações.
    `;
  }

  private parseAIResponse(response: string): AIAnalysisResult {
    // Parse basic AI response into structured format
    const suggestions: AIFormulationSuggestion[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    // Extract suggestions from AI response
    let currentSuggestion: Partial<AIFormulationSuggestion> = {};
    
    for (const line of lines) {
      if (line.includes('otimização') || line.includes('redução') || line.includes('alternativa')) {
        if (currentSuggestion.title) {
          suggestions.push(currentSuggestion as AIFormulationSuggestion);
        }
        currentSuggestion = {
          type: 'optimization',
          title: line.substring(0, 60),
          description: line,
          confidence: 0.8,
          priority: 'medium',
          suggestion: line
        };
      }
    }

    if (currentSuggestion.title) {
      suggestions.push(currentSuggestion as AIFormulationSuggestion);
    }

    return {
      suggestions,
      overallAssessment: response.substring(0, 200),
      riskFactors: [],
      opportunities: [],
      confidence: 0.85
    };
  }

  private parseSuggestions(response: string): AIFormulationSuggestion[] {
    const suggestions: AIFormulationSuggestion[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.includes('-') || line.includes('•') || line.includes('*')) {
        suggestions.push({
          type: 'improvement',
          title: line.substring(0, 50),
          description: line,
          confidence: 0.75,
          priority: 'medium',
          suggestion: line.replace(/[-•*]\s*/, '')
        });
      }
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }
}

export const formulationAI = new FormulationAI();
