
import { ClientIngredient } from '@/types/client';
import { UniversalNutritionalRequirement, IngredientConstraint } from '@/types/phases';

export interface SimplexResult {
  success: boolean;
  solution: Record<string, number>;
  totalCost: number;
  nutritionalProfile: {
    metabolizableEnergy: number;
    crudeProtein: number;
    calcium: number;
    availablePhosphorus: number;
    lysine: number;
    methionine: number;
    threonine: number;
    tryptophan: number;
    crudeFiber: number;
  };
  feasible: boolean;
  violations: string[];
  iterations: number;
  error?: string;
}

interface SimplexTableau {
  tableau: number[][];
  basis: number[];
  costs: number[];
  variables: string[];
}

export class AdvancedSimplex {
  private ingredients: ClientIngredient[];
  private requirement: UniversalNutritionalRequirement;
  private constraints: IngredientConstraint[];
  private tolerance = 1e-10;
  private maxIterations = 1000;

  constructor(
    ingredients: ClientIngredient[],
    requirement: UniversalNutritionalRequirement,
    constraints: IngredientConstraint[]
  ) {
    this.ingredients = ingredients;
    this.requirement = requirement;
    this.constraints = constraints;
  }

  solve(): SimplexResult {
    try {
      // Preparar dados
      const availableIngredients = this.ingredients.filter(ing => ing.availability);
      
      if (availableIngredients.length === 0) {
        return {
          success: false,
          solution: {},
          totalCost: 0,
          nutritionalProfile: this.getEmptyProfile(),
          feasible: false,
          violations: ['Nenhum ingrediente disponível'],
          iterations: 0,
          error: 'Nenhum ingrediente disponível para formulação'
        };
      }

      // Construir tableau
      const tableau = this.buildTableau(availableIngredients);
      
      // Resolver usando método Simplex Dual
      const result = this.solveSimplex(tableau);
      
      if (!result.success) {
        return {
          success: false,
          solution: {},
          totalCost: 0,
          nutritionalProfile: this.getEmptyProfile(),
          feasible: false,
          violations: ['Problema inviável - restrições conflitantes'],
          iterations: result.iterations || 0,
          error: result.error || 'Solução não encontrada'
        };
      }

      // Extrair solução
      const solution = this.extractSolution(result.tableau!, availableIngredients);
      const nutritionalProfile = this.calculateNutritionalProfile(solution);
      const violations = this.validateSolution(nutritionalProfile);
      
      return {
        success: true,
        solution,
        totalCost: this.calculateTotalCost(solution),
        nutritionalProfile,
        feasible: violations.length === 0,
        violations,
        iterations: result.iterations || 0
      };

    } catch (error) {
      return {
        success: false,
        solution: {},
        totalCost: 0,
        nutritionalProfile: this.getEmptyProfile(),
        feasible: false,
        violations: ['Erro interno no algoritmo'],
        iterations: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  private buildTableau(ingredients: ClientIngredient[]): SimplexTableau {
    const numVars = ingredients.length;
    const constraints: number[][] = [];
    const rhs: number[] = [];
    const costs: number[] = ingredients.map(ing => ing.currentPrice);
    const variables = ingredients.map(ing => ing.name);

    // Restrições nutricionais (inequações)
    
    // Energia Metabolizável (min/max)
    constraints.push(ingredients.map(ing => ing.metabolizableEnergy));
    rhs.push(this.requirement.minMetabolizableEnergy);
    
    constraints.push(ingredients.map(ing => -ing.metabolizableEnergy));
    rhs.push(-this.requirement.maxMetabolizableEnergy);

    // Proteína Bruta (min/max)
    constraints.push(ingredients.map(ing => ing.crudeProtein));
    rhs.push(this.requirement.minCrudeProtein);
    
    constraints.push(ingredients.map(ing => -ing.crudeProtein));
    rhs.push(-this.requirement.maxCrudeProtein);

    // Cálcio (min/max)
    constraints.push(ingredients.map(ing => ing.calcium));
    rhs.push(this.requirement.minCalcium);
    
    constraints.push(ingredients.map(ing => -ing.calcium));
    rhs.push(-this.requirement.maxCalcium);

    // Fósforo Disponível (min/max)
    constraints.push(ingredients.map(ing => ing.availablePhosphorus));
    rhs.push(this.requirement.minAvailablePhosphorus);
    
    constraints.push(ingredients.map(ing => -ing.availablePhosphorus));
    rhs.push(-this.requirement.maxAvailablePhosphorus);

    // Lisina (min)
    constraints.push(ingredients.map(ing => ing.lysine));
    rhs.push(this.requirement.minLysine);

    // Metionina (min)
    constraints.push(ingredients.map(ing => ing.methionine));
    rhs.push(this.requirement.minMethionine);

    // Treonina (min) - se definida
    if (this.requirement.minThreonine) {
      constraints.push(ingredients.map(ing => ing.threonine || 0));
      rhs.push(this.requirement.minThreonine);
    }

    // Triptofano (min) - se definida
    if (this.requirement.minTryptophan) {
      constraints.push(ingredients.map(ing => ing.tryptophan || 0));
      rhs.push(this.requirement.minTryptophan);
    }

    // Fibra Bruta (max)
    constraints.push(ingredients.map(ing => -ing.crudeFiber));
    rhs.push(-this.requirement.maxCrudeFiber);

    // Restrições de inclusão por ingrediente
    ingredients.forEach((ingredient, index) => {
      const constraint = this.constraints.find(c => c.ingredientId === ingredient.id);
      
      if (constraint?.fixedPercentage !== undefined) {
        // Inclusão fixa
        const fixedConstraint = new Array(numVars).fill(0);
        fixedConstraint[index] = 1;
        constraints.push([...fixedConstraint]);
        rhs.push(constraint.fixedPercentage / 100);
        
        constraints.push([...fixedConstraint.map(x => -x)]);
        rhs.push(-constraint.fixedPercentage / 100);
      } else {
        // Inclusão mínima
        if (constraint?.minPercentage !== undefined) {
          const minConstraint = new Array(numVars).fill(0);
          minConstraint[index] = 1;
          constraints.push([...minConstraint]);
          rhs.push(constraint.minPercentage / 100);
        } else {
          const minConstraint = new Array(numVars).fill(0);
          minConstraint[index] = 1;
          constraints.push([...minConstraint]);
          rhs.push(ingredient.minInclusion / 100);
        }
        
        // Inclusão máxima
        if (constraint?.maxPercentage !== undefined) {
          const maxConstraint = new Array(numVars).fill(0);
          maxConstraint[index] = -1;
          constraints.push([...maxConstraint]);
          rhs.push(-constraint.maxPercentage / 100);
        } else {
          const maxConstraint = new Array(numVars).fill(0);
          maxConstraint[index] = -1;
          constraints.push([...maxConstraint]);
          rhs.push(-ingredient.maxInclusion / 100);
        }
      }
    });

    // Restrição de soma = 100%
    constraints.push(new Array(numVars).fill(1));
    rhs.push(1.0);

    // Construir tableau padrão
    const numConstraints = constraints.length;
    const numSlackVars = numConstraints;
    const totalVars = numVars + numSlackVars;

    const tableau: number[][] = [];
    
    // Linhas das restrições
    for (let i = 0; i < numConstraints; i++) {
      const row = new Array(totalVars + 1).fill(0);
      // Variáveis originais
      for (let j = 0; j < numVars; j++) {
        row[j] = constraints[i][j];
      }
      // Variável de folga
      row[numVars + i] = 1;
      // RHS
      row[totalVars] = rhs[i];
      tableau.push(row);
    }

    // Linha da função objetivo
    const objRow = new Array(totalVars + 1).fill(0);
    for (let j = 0; j < numVars; j++) {
      objRow[j] = costs[j];
    }
    tableau.push(objRow);

    const basis = Array.from({ length: numConstraints }, (_, i) => numVars + i);

    return {
      tableau,
      basis,
      costs,
      variables
    };
  }

  private solveSimplex(tableauData: SimplexTableau): { success: boolean; tableau?: number[][]; iterations?: number; error?: string } {
    const { tableau } = tableauData;
    let iterations = 0;

    try {
      while (iterations < this.maxIterations) {
        iterations++;

        // Verificar otimalidade
        const pivotCol = this.findPivotColumn(tableau);
        if (pivotCol === -1) {
          // Solução ótima encontrada
          return { success: true, tableau, iterations };
        }

        // Encontrar linha pivô
        const pivotRow = this.findPivotRow(tableau, pivotCol);
        if (pivotRow === -1) {
          // Problema ilimitado
          return { success: false, error: 'Problema ilimitado', iterations };
        }

        // Operações de pivô
        this.pivot(tableau, pivotRow, pivotCol);
        
        // Verificar viabilidade
        if (!this.checkFeasibility(tableau)) {
          return { success: false, error: 'Solução inviável', iterations };
        }
      }

      return { success: false, error: 'Máximo de iterações atingido', iterations };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro no algoritmo', 
        iterations 
      };
    }
  }

  private findPivotColumn(tableau: number[][]): number {
    const objRow = tableau[tableau.length - 1];
    let minValue = 0;
    let pivotCol = -1;

    for (let j = 0; j < objRow.length - 1; j++) {
      if (objRow[j] < minValue) {
        minValue = objRow[j];
        pivotCol = j;
      }
    }

    return pivotCol;
  }

  private findPivotRow(tableau: number[][], pivotCol: number): number {
    let minRatio = Infinity;
    let pivotRow = -1;

    for (let i = 0; i < tableau.length - 1; i++) {
      const pivot = tableau[i][pivotCol];
      const rhs = tableau[i][tableau[i].length - 1];

      if (pivot > this.tolerance && rhs >= 0) {
        const ratio = rhs / pivot;
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }

    return pivotRow;
  }

  private pivot(tableau: number[][], pivotRow: number, pivotCol: number): void {
    const pivotElement = tableau[pivotRow][pivotCol];
    
    // Normalizar linha pivô
    for (let j = 0; j < tableau[pivotRow].length; j++) {
      tableau[pivotRow][j] /= pivotElement;
    }

    // Eliminar outras linhas
    for (let i = 0; i < tableau.length; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j < tableau[i].length; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }
  }

  private checkFeasibility(tableau: number[][]): boolean {
    for (let i = 0; i < tableau.length - 1; i++) {
      const rhs = tableau[i][tableau[i].length - 1];
      if (rhs < -this.tolerance) {
        return false;
      }
    }
    return true;
  }

  private extractSolution(tableau: number[][], ingredients: ClientIngredient[]): Record<string, number> {
    const solution: Record<string, number> = {};
    
    ingredients.forEach((ingredient, index) => {
      solution[ingredient.id] = 0;
    });

    // Encontrar variáveis básicas
    for (let i = 0; i < tableau.length - 1; i++) {
      let basicVar = -1;
      let count = 0;
      
      for (let j = 0; j < ingredients.length; j++) {
        if (Math.abs(tableau[i][j]) > this.tolerance) {
          if (Math.abs(tableau[i][j] - 1) < this.tolerance) {
            basicVar = j;
            count++;
          } else {
            count = 2; // Não é variável básica
            break;
          }
        }
      }
      
      if (count === 1 && basicVar >= 0) {
        const value = tableau[i][tableau[i].length - 1];
        solution[ingredients[basicVar].id] = Math.max(0, value);
      }
    }

    return solution;
  }

  private calculateNutritionalProfile(solution: Record<string, number>) {
    const profile = this.getEmptyProfile();
    
    this.ingredients.forEach(ingredient => {
      const percentage = solution[ingredient.id] || 0;
      
      profile.metabolizableEnergy += ingredient.metabolizableEnergy * percentage;
      profile.crudeProtein += ingredient.crudeProtein * percentage;
      profile.calcium += ingredient.calcium * percentage;
      profile.availablePhosphorus += ingredient.availablePhosphorus * percentage;
      profile.lysine += ingredient.lysine * percentage;
      profile.methionine += ingredient.methionine * percentage;
      profile.threonine += (ingredient.threonine || 0) * percentage;
      profile.tryptophan += (ingredient.tryptophan || 0) * percentage;
      profile.crudeFiber += ingredient.crudeFiber * percentage;
    });

    return profile;
  }

  private validateSolution(profile: any): string[] {
    const violations: string[] = [];

    if (profile.metabolizableEnergy < this.requirement.minMetabolizableEnergy) {
      violations.push(`Energia metabolizável abaixo do mínimo: ${profile.metabolizableEnergy.toFixed(0)} < ${this.requirement.minMetabolizableEnergy}`);
    }
    if (profile.metabolizableEnergy > this.requirement.maxMetabolizableEnergy) {
      violations.push(`Energia metabolizável acima do máximo: ${profile.metabolizableEnergy.toFixed(0)} > ${this.requirement.maxMetabolizableEnergy}`);
    }

    if (profile.crudeProtein < this.requirement.minCrudeProtein) {
      violations.push(`Proteína bruta abaixo do mínimo: ${profile.crudeProtein.toFixed(2)}% < ${this.requirement.minCrudeProtein}%`);
    }
    if (profile.crudeProtein > this.requirement.maxCrudeProtein) {
      violations.push(`Proteína bruta acima do máximo: ${profile.crudeProtein.toFixed(2)}% > ${this.requirement.maxCrudeProtein}%`);
    }

    if (profile.calcium < this.requirement.minCalcium) {
      violations.push(`Cálcio abaixo do mínimo: ${profile.calcium.toFixed(3)}% < ${this.requirement.minCalcium}%`);
    }
    if (profile.calcium > this.requirement.maxCalcium) {
      violations.push(`Cálcio acima do máximo: ${profile.calcium.toFixed(3)}% > ${this.requirement.maxCalcium}%`);
    }

    if (profile.lysine < this.requirement.minLysine) {
      violations.push(`Lisina abaixo do mínimo: ${profile.lysine.toFixed(3)}% < ${this.requirement.minLysine}%`);
    }

    if (profile.methionine < this.requirement.minMethionine) {
      violations.push(`Metionina abaixo do mínimo: ${profile.methionine.toFixed(3)}% < ${this.requirement.minMethionine}%`);
    }

    if (profile.crudeFiber > this.requirement.maxCrudeFiber) {
      violations.push(`Fibra bruta acima do máximo: ${profile.crudeFiber.toFixed(2)}% > ${this.requirement.maxCrudeFiber}%`);
    }

    return violations;
  }

  private calculateTotalCost(solution: Record<string, number>): number {
    return this.ingredients.reduce((total, ingredient) => {
      const percentage = solution[ingredient.id] || 0;
      return total + (percentage * ingredient.currentPrice);
    }, 0);
  }

  private getEmptyProfile() {
    return {
      metabolizableEnergy: 0,
      crudeProtein: 0,
      calcium: 0,
      availablePhosphorus: 0,
      lysine: 0,
      methionine: 0,
      threonine: 0,
      tryptophan: 0,
      crudeFiber: 0
    };
  }
}

export const formulateWithAdvancedSimplex = (
  ingredients: ClientIngredient[],
  requirement: UniversalNutritionalRequirement,
  constraints: IngredientConstraint[]
): SimplexResult => {
  const simplex = new AdvancedSimplex(ingredients, requirement, constraints);
  return simplex.solve();
};
