import { Ingredient, NutritionalRequirement, FormulationResult } from '@/types/nutrition';

export class SimplexSolver {
  private tableau: number[][];
  private basicVariables: number[];
  private numVariables: number;
  private numConstraints: number;

  constructor(
    private ingredients: Ingredient[],
    private requirements: NutritionalRequirement
  ) {
    this.numVariables = ingredients.length;
    this.setupTableau();
  }

  private setupTableau() {
    // Restrições: nutricionais (13) + individuais (2*n) + soma = 100% (1)
    this.numConstraints = 14 + (2 * this.numVariables);
    
    // Tableau com variáveis de folga
    const cols = this.numVariables + this.numConstraints + 1;
    this.tableau = Array(this.numConstraints + 1).fill(null).map(() => Array(cols).fill(0));
    
    this.setupObjectiveFunction();
    this.setupConstraints();
    
    this.basicVariables = Array.from({ length: this.numConstraints }, (_, i) => this.numVariables + i);
  }

  private setupObjectiveFunction() {
    // Minimizar custo - coeficientes negativos para maximização no simplex padrão
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[0][i] = this.ingredients[i].currentPrice;
    }
  }

  private setupConstraints() {
    let row = 1;
    let slackVar = this.numVariables;

    // Restrição: soma = 100%
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = 1;
    }
    this.tableau[row][slackVar] = 1;
    this.tableau[row][this.tableau[row].length - 1] = 100;
    row++;
    slackVar++;

    // Restrições nutricionais
    this.addNutritionalConstraints(row, slackVar);
    row += 13;
    slackVar += 13;

    // Restrições individuais dos ingredientes
    this.addIngredientConstraints(row, slackVar);
  }

  private addNutritionalConstraints(startRow: number, startSlack: number) {
    let row = startRow;
    let slack = startSlack;

    // Proteína mínima: sum(xi * proteína_i) >= minCrudeProtein * 100
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = -this.ingredients[i].crudeProtein;
    }
    this.tableau[row][slack] = -1;
    this.tableau[row][this.tableau[row].length - 1] = -this.requirements.minCrudeProtein * 100;
    row++; slack++;

    // Proteína máxima: sum(xi * proteína_i) <= maxCrudeProtein * 100
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].crudeProtein;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = this.requirements.maxCrudeProtein * 100;
    row++; slack++;

    // Energia mínima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = -this.ingredients[i].metabolizableEnergy;
    }
    this.tableau[row][slack] = -1;
    this.tableau[row][this.tableau[row].length - 1] = -this.requirements.minMetabolizableEnergy * 100;
    row++; slack++;

    // Energia máxima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].metabolizableEnergy;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = this.requirements.maxMetabolizableEnergy * 100;
    row++; slack++;

    // Cálcio mínimo
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = -this.ingredients[i].calcium;
    }
    this.tableau[row][slack] = -1;
    this.tableau[row][this.tableau[row].length - 1] = -this.requirements.minCalcium * 100;
    row++; slack++;

    // Cálcio máximo
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].calcium;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = this.requirements.maxCalcium * 100;
    row++; slack++;

    // Fósforo mínimo
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = -this.ingredients[i].availablePhosphorus;
    }
    this.tableau[row][slack] = -1;
    this.tableau[row][this.tableau[row].length - 1] = -this.requirements.minAvailablePhosphorus * 100;
    row++; slack++;

    // Fósforo máximo
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].availablePhosphorus;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = this.requirements.maxAvailablePhosphorus * 100;
    row++; slack++;

    // Lisina mínima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = -this.ingredients[i].lysine;
    }
    this.tableau[row][slack] = -1;
    this.tableau[row][this.tableau[row].length - 1] = -this.requirements.minLysine * 100;
    row++; slack++;

    // Lisina máxima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].lysine;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = this.requirements.maxLysine * 100;
    row++; slack++;

    // Metionina mínima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = -this.ingredients[i].methionine;
    }
    this.tableau[row][slack] = -1;
    this.tableau[row][this.tableau[row].length - 1] = -this.requirements.minMethionine * 100;
    row++; slack++;

    // Metionina máxima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].methionine;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = this.requirements.maxMethionine * 100;
    row++; slack++;

    // Fibra máxima
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[row][i] = this.ingredients[i].crudeFiber;
    }
    this.tableau[row][slack] = 1;
    this.tableau[row][this.tableau[row].length - 1] = (this.requirements.maxCrudeFiber || 8) * 100;
  }

  private addIngredientConstraints(startRow: number, startSlack: number) {
    let row = startRow;
    let slack = startSlack;

    for (let i = 0; i < this.numVariables; i++) {
      // Restrição mínima: xi >= minInclusion
      this.tableau[row][i] = -1;
      this.tableau[row][slack] = -1;
      this.tableau[row][this.tableau[row].length - 1] = -this.ingredients[i].minInclusion;
      row++; slack++;

      // Restrição máxima: xi <= maxInclusion
      this.tableau[row][i] = 1;
      this.tableau[row][slack] = 1;
      this.tableau[row][this.tableau[row].length - 1] = this.ingredients[i].maxInclusion;
      row++; slack++;
    }
  }

  public solve(): FormulationResult {
    try {
      console.log('Tableau inicial:', this.tableau);
      
      // Resolver usando método simplex de duas fases
      if (!this.solveSimplex()) {
        return {
          ingredients: [],
          totalCost: 0,
          nutritionalProfile: {
            metabolizableEnergy: 0,
            crudeProtein: 0,
            calcium: 0,
            availablePhosphorus: 0,
            lysine: 0,
            methionine: 0,
            crudeFiber: 0
          },
          feasible: false,
          message: 'Problema inviável - não é possível atender todas as restrições nutricionais'
        };
      }

      return this.extractSolution();
    } catch (error) {
      console.error('Erro no Simplex:', error);
      return {
        ingredients: [],
        totalCost: 0,
        nutritionalProfile: {
          metabolizableEnergy: 0,
          crudeProtein: 0,
          calcium: 0,
          availablePhosphorus: 0,
          lysine: 0,
          methionine: 0,
          crudeFiber: 0
        },
        feasible: false,
        message: 'Erro durante a otimização'
      };
    }
  }

  private solveSimplex(): boolean {
    const maxIterations = 100;
    let iterations = 0;

    while (iterations < maxIterations) {
      // Encontrar variável que entra (coluna pivô)
      const pivotCol = this.findEnteringVariable();
      if (pivotCol === -1) {
        console.log('Solução ótima encontrada após', iterations, 'iterações');
        break; // Solução ótima encontrada
      }

      // Encontrar variável que sai (linha pivô)  
      const pivotRow = this.findLeavingVariable(pivotCol);
      if (pivotRow === -1) {
        console.log('Problema ilimitado');
        return false; // Problema ilimitado
      }

      console.log(`Iteração ${iterations + 1}: Pivô em (${pivotRow}, ${pivotCol})`);
      
      // Realizar operação de pivoteamento
      this.pivot(pivotRow, pivotCol);
      iterations++;
    }

    return iterations < maxIterations;
  }

  private findEnteringVariable(): number {
    let minValue = 0;
    let minIndex = -1;

    // Encontrar coeficiente mais negativo na linha objetivo
    for (let j = 0; j < this.numVariables; j++) {
      if (this.tableau[0][j] < minValue) {
        minValue = this.tableau[0][j];
        minIndex = j;
      }
    }

    return minIndex;
  }

  private findLeavingVariable(enteringCol: number): number {
    let minRatio = Infinity;
    let minIndex = -1;

    // Teste da razão mínima
    for (let i = 1; i < this.tableau.length; i++) {
      if (this.tableau[i][enteringCol] > 1e-6) { // Evitar divisão por zero
        const ratio = this.tableau[i][this.tableau[i].length - 1] / this.tableau[i][enteringCol];
        if (ratio >= 0 && ratio < minRatio) {
          minRatio = ratio;
          minIndex = i;
        }
      }
    }

    return minIndex;
  }

  private pivot(pivotRow: number, pivotCol: number): void {
    const pivotElement = this.tableau[pivotRow][pivotCol];

    // Normalizar linha do pivô
    for (let j = 0; j < this.tableau[pivotRow].length; j++) {
      this.tableau[pivotRow][j] /= pivotElement;
    }

    // Eliminar outras linhas
    for (let i = 0; i < this.tableau.length; i++) {
      if (i !== pivotRow && Math.abs(this.tableau[i][pivotCol]) > 1e-10) {
        const factor = this.tableau[i][pivotCol];
        for (let j = 0; j < this.tableau[i].length; j++) {
          this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
        }
      }
    }

    // Atualizar variáveis básicas
    this.basicVariables[pivotRow - 1] = pivotCol;
  }

  private extractSolution(): FormulationResult {
    const solution = Array(this.numVariables).fill(0);

    // Extrair valores das variáveis básicas
    for (let i = 0; i < this.basicVariables.length; i++) {
      const varIndex = this.basicVariables[i];
      if (varIndex < this.numVariables) {
        const value = this.tableau[i + 1][this.tableau[i + 1].length - 1];
        solution[varIndex] = Math.max(0, value);
      }
    }

    console.log('Solução encontrada:', solution);

    // Verificar se a soma é aproximadamente 100%
    const totalPercent = solution.reduce((sum, val) => sum + val, 0);
    console.log('Soma total:', totalPercent);

    // Normalizar se necessário (pequenos erros de arredondamento)
    if (totalPercent > 0 && Math.abs(totalPercent - 100) < 1) {
      for (let i = 0; i < solution.length; i++) {
        solution[i] = (solution[i] / totalPercent) * 100;
      }
    }

    const ingredients = this.ingredients.map((ingredient, index) => ({
      ingredient,
      percentage: solution[index] || 0,
      cost: (solution[index] || 0) * ingredient.currentPrice / 100
    })).filter(item => item.percentage > 0.001);

    const totalCost = ingredients.reduce((sum, item) => sum + item.cost, 0);

    // Calcular perfil nutricional
    const nutritionalProfile = {
      metabolizableEnergy: this.calculateNutrient(solution, 'metabolizableEnergy'),
      crudeProtein: this.calculateNutrient(solution, 'crudeProtein'),
      calcium: this.calculateNutrient(solution, 'calcium'),
      availablePhosphorus: this.calculateNutrient(solution, 'availablePhosphorus'),
      lysine: this.calculateNutrient(solution, 'lysine'),
      methionine: this.calculateNutrient(solution, 'methionine'),
      crudeFiber: this.calculateNutrient(solution, 'crudeFiber')
    };

    return {
      ingredients,
      totalCost,
      nutritionalProfile,
      feasible: ingredients.length > 0,
      message: ingredients.length > 0 ? 
        `Formulação otimizada com ${ingredients.length} ingredientes` :
        'Não foi possível encontrar uma formulação viável'
    };
  }

  private calculateNutrient(solution: number[], nutrient: keyof Ingredient): number {
    return solution.reduce((sum, percentage, index) => {
      return sum + (percentage * (this.ingredients[index][nutrient] as number)) / 100;
    }, 0);
  }
}
