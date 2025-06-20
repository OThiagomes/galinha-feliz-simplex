
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
    // Número de restrições: 
    // - 2 para proteína (min/max)
    // - 2 para energia (min/max)
    // - 2 para cálcio (min/max)
    // - 2 para fósforo (min/max)
    // - 2 para lisina (min/max)
    // - 2 para metionina (min/max)
    // - 1 para fibra (max)
    // - 2*n para limites individuais de ingredientes (min/max)
    // - 1 para soma = 100%
    this.numConstraints = 13 + (2 * this.numVariables) + 1;
    
    // Tableau: [restrições][variáveis + folga + RHS]
    const cols = this.numVariables + this.numConstraints + 1;
    this.tableau = Array(this.numConstraints + 1).fill(null).map(() => Array(cols).fill(0));
    
    let constraintRow = 0;
    let slackVar = this.numVariables;

    // Função objetivo (minimizar custo)
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[0][i] = this.ingredients[i].price;
    }

    // Restrição: soma = 100%
    for (let i = 0; i < this.numVariables; i++) {
      this.tableau[constraintRow + 1][i] = 1;
    }
    this.tableau[constraintRow + 1][slackVar] = 1;
    this.tableau[constraintRow + 1][cols - 1] = 100;
    constraintRow++;
    slackVar++;

    // Restrições nutricionais
    this.addNutritionalConstraints(constraintRow, slackVar);
    constraintRow += 13;
    slackVar += 13;

    // Restrições individuais dos ingredientes
    this.addIngredientConstraints(constraintRow, slackVar);

    this.basicVariables = Array.from({ length: this.numConstraints }, (_, i) => this.numVariables + i);
  }

  private addNutritionalConstraints(startRow: number, startSlack: number) {
    const constraints = [
      // Proteína min/max
      { nutrient: 'protein', min: this.requirements.minProtein, max: this.requirements.maxProtein },
      // Energia min/max
      { nutrient: 'energy', min: this.requirements.minEnergy, max: this.requirements.maxEnergy },
      // Cálcio min/max
      { nutrient: 'calcium', min: this.requirements.minCalcium, max: this.requirements.maxCalcium },
      // Fósforo min/max
      { nutrient: 'phosphorus', min: this.requirements.minPhosphorus, max: this.requirements.maxPhosphorus },
      // Lisina min/max
      { nutrient: 'lysine', min: this.requirements.minLysine, max: this.requirements.maxLysine },
      // Metionina min/max
      { nutrient: 'methionine', min: this.requirements.minMethionine, max: this.requirements.maxMethionine },
      // Fibra max
      { nutrient: 'fiber', min: 0, max: this.requirements.maxFiber }
    ];

    let row = startRow + 1;
    let slack = startSlack;

    constraints.forEach(constraint => {
      // Restrição mínima (>=)
      if (constraint.min > 0) {
        for (let i = 0; i < this.numVariables; i++) {
          this.tableau[row][i] = -(this.ingredients[i][constraint.nutrient as keyof Ingredient] as number);
        }
        this.tableau[row][slack] = -1;
        this.tableau[row][this.tableau[0].length - 1] = -constraint.min * 100;
        row++;
        slack++;
      }

      // Restrição máxima (<=)
      for (let i = 0; i < this.numVariables; i++) {
        this.tableau[row][i] = this.ingredients[i][constraint.nutrient as keyof Ingredient] as number;
      }
      this.tableau[row][slack] = 1;
      this.tableau[row][this.tableau[0].length - 1] = constraint.max * 100;
      row++;
      slack++;
    });
  }

  private addIngredientConstraints(startRow: number, startSlack: number) {
    let row = startRow + 1;
    let slack = startSlack;

    for (let i = 0; i < this.numVariables; i++) {
      // Restrição mínima
      this.tableau[row][i] = -1;
      this.tableau[row][slack] = -1;
      this.tableau[row][this.tableau[0].length - 1] = -this.ingredients[i].minPercent;
      row++;
      slack++;

      // Restrição máxima
      this.tableau[row][i] = 1;
      this.tableau[row][slack] = 1;
      this.tableau[row][this.tableau[0].length - 1] = this.ingredients[i].maxPercent;
      row++;
      slack++;
    }
  }

  public solve(): FormulationResult {
    try {
      // Fase I: Encontrar solução básica viável
      if (!this.phaseOne()) {
        return {
          ingredients: [],
          totalCost: 0,
          nutritionalProfile: {
            protein: 0,
            energy: 0,
            calcium: 0,
            phosphorus: 0,
            lysine: 0,
            methionine: 0,
            fiber: 0
          },
          feasible: false,
          message: 'Problema inviável - não é possível atender todas as restrições'
        };
      }

      // Fase II: Otimizar
      this.phaseTwo();

      return this.extractSolution();
    } catch (error) {
      return {
        ingredients: [],
        totalCost: 0,
        nutritionalProfile: {
          protein: 0,
          energy: 0,
          calcium: 0,
          phosphorus: 0,
          lysine: 0,
          methionine: 0,
          fiber: 0
        },
        feasible: false,
        message: 'Erro durante a otimização'
      };
    }
  }

  private phaseOne(): boolean {
    // Implementação simplificada da Fase I
    // Adiciona variáveis artificiais e tenta encontrar solução básica viável
    const maxIterations = 1000;
    let iterations = 0;

    while (iterations < maxIterations) {
      const pivotCol = this.findEnteringVariable();
      if (pivotCol === -1) break;

      const pivotRow = this.findLeavingVariable(pivotCol);
      if (pivotRow === -1) return false; // Ilimitado

      this.pivot(pivotRow, pivotCol);
      iterations++;
    }

    return true;
  }

  private phaseTwo(): void {
    const maxIterations = 1000;
    let iterations = 0;

    while (iterations < maxIterations) {
      const pivotCol = this.findEnteringVariable();
      if (pivotCol === -1) break;

      const pivotRow = this.findLeavingVariable(pivotCol);
      if (pivotRow === -1) break; // Ilimitado

      this.pivot(pivotRow, pivotCol);
      iterations++;
    }
  }

  private findEnteringVariable(): number {
    let minValue = 0;
    let minIndex = -1;

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

    for (let i = 1; i < this.tableau.length; i++) {
      if (this.tableau[i][enteringCol] > 0) {
        const ratio = this.tableau[i][this.tableau[i].length - 1] / this.tableau[i][enteringCol];
        if (ratio < minRatio) {
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
      if (i !== pivotRow) {
        const factor = this.tableau[i][pivotCol];
        for (let j = 0; j < this.tableau[i].length; j++) {
          this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
        }
      }
    }

    this.basicVariables[pivotRow - 1] = pivotCol;
  }

  private extractSolution(): FormulationResult {
    const solution = Array(this.numVariables).fill(0);

    // Extrair valores das variáveis básicas
    for (let i = 0; i < this.basicVariables.length; i++) {
      const varIndex = this.basicVariables[i];
      if (varIndex < this.numVariables) {
        solution[varIndex] = Math.max(0, this.tableau[i + 1][this.tableau[i + 1].length - 1]);
      }
    }

    const ingredients = this.ingredients.map((ingredient, index) => ({
      ingredient,
      percentage: solution[index] || 0,
      cost: (solution[index] || 0) * ingredient.price / 100
    })).filter(item => item.percentage > 0.01);

    const totalCost = ingredients.reduce((sum, item) => sum + item.cost, 0);

    // Calcular perfil nutricional
    const nutritionalProfile = {
      protein: this.calculateNutrient(solution, 'protein'),
      energy: this.calculateNutrient(solution, 'energy'),
      calcium: this.calculateNutrient(solution, 'calcium'),
      phosphorus: this.calculateNutrient(solution, 'phosphorus'),
      lysine: this.calculateNutrient(solution, 'lysine'),
      methionine: this.calculateNutrient(solution, 'methionine'),
      fiber: this.calculateNutrient(solution, 'fiber')
    };

    return {
      ingredients,
      totalCost,
      nutritionalProfile,
      feasible: true
    };
  }

  private calculateNutrient(solution: number[], nutrient: keyof Ingredient): number {
    return solution.reduce((sum, percentage, index) => {
      return sum + (percentage * (this.ingredients[index][nutrient] as number)) / 100;
    }, 0);
  }
}
