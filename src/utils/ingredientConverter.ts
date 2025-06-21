
import { Ingredient, LegacyIngredient, LegacyNutritionalRequirement, NutritionalRequirement } from '@/types/nutrition';
import { ClientIngredient } from '@/types/client';

export const convertClientIngredientsToAdvanced = (clientIngredients: ClientIngredient[]): Ingredient[] => {
  return clientIngredients
    .filter(ing => ing.availability)
    .map(ing => ({
      id: ing.id,
      name: ing.name,
      category: ing.category,
      origin: ing.origin,
      metabolizableEnergy: ing.metabolizableEnergy,
      crudeProtein: ing.crudeProtein,
      lysine: ing.lysine,
      methionine: ing.methionine,
      calcium: ing.calcium,
      availablePhosphorus: ing.availablePhosphorus,
      crudeFiber: ing.crudeFiber,
      currentPrice: ing.currentPrice,
      minInclusion: ing.minInclusion,
      maxInclusion: ing.maxInclusion,
      
      // Campos opcionais
      scientificName: ing.scientificName,
      grossEnergy: ing.grossEnergy,
      digestibleEnergy: ing.digestibleEnergy,
      digestibleProtein: ing.digestibleProtein,
      threonine: ing.threonine,
      tryptophan: ing.tryptophan,
      arginine: ing.arginine,
      valine: ing.valine,
      isoleucine: ing.isoleucine,
      leucine: ing.leucine,
      histidine: ing.histidine,
      phenylalanineTyrosine: ing.phenylalanineTyrosine,
      totalPhosphorus: ing.totalPhosphorus,
      sodium: ing.sodium,
      potassium: ing.potassium,
      magnesium: ing.magnesium,
      iron: ing.iron,
      zinc: ing.zinc,
      manganese: ing.manganese,
      copper: ing.copper,
      vitaminA: ing.vitaminA,
      vitaminD3: ing.vitaminD3,
      vitaminE: ing.vitaminE,
      neutralDetergentFiber: ing.neutralDetergentFiber,
      acidDetergentFiber: ing.acidDetergentFiber,
      etherExtract: ing.etherExtract,
      dryMatter: ing.dryMatter,
      digestibility: ing.digestibility,
      palatability: ing.palatability,
      freight: ing.freight,
      additionalCosts: ing.additionalCosts,
      mainSupplier: ing.supplier
    }));
};

export const convertAdvancedToClientIngredients = (ingredients: Ingredient[]): ClientIngredient[] => {
  return ingredients.map(ing => ({
    id: ing.id,
    name: ing.name,
    category: ing.category,
    origin: ing.origin,
    metabolizableEnergy: ing.metabolizableEnergy,
    crudeProtein: ing.crudeProtein,
    lysine: ing.lysine,
    methionine: ing.methionine,
    calcium: ing.calcium,
    availablePhosphorus: ing.availablePhosphorus,
    crudeFiber: ing.crudeFiber,
    currentPrice: ing.currentPrice,
    minInclusion: ing.minInclusion,
    maxInclusion: ing.maxInclusion,
    availability: true,
    
    // Campos opcionais
    scientificName: ing.scientificName,
    grossEnergy: ing.grossEnergy,
    digestibleEnergy: ing.digestibleEnergy,
    digestibleProtein: ing.digestibleProtein,
    threonine: ing.threonine,
    tryptophan: ing.tryptophan,
    arginine: ing.arginine,
    valine: ing.valine,
    isoleucine: ing.isoleucine,
    leucine: ing.leucine,
    histidine: ing.histidine,
    phenylalanineTyrosine: ing.phenylalanineTyrosine,
    totalPhosphorus: ing.totalPhosphorus,
    sodium: ing.sodium,
    potassium: ing.potassium,
    magnesium: ing.magnesium,
    iron: ing.iron,
    zinc: ing.zinc,
    manganese: ing.manganese,
    copper: ing.copper,
    vitaminA: ing.vitaminA,
    vitaminD3: ing.vitaminD3,
    vitaminE: ing.vitaminE,
    neutralDetergentFiber: ing.neutralDetergentFiber,
    acidDetergentFiber: ing.acidDetergentFiber,
    etherExtract: ing.etherExtract,
    dryMatter: ing.dryMatter,
    digestibility: ing.digestibility,
    palatability: ing.palatability,
    freight: ing.freight,
    additionalCosts: ing.additionalCosts,
    supplier: ing.mainSupplier
  }));
};

// Para compatibilidade com o sistema atual
export const convertToLegacyIngredients = (clientIngredients: ClientIngredient[]): LegacyIngredient[] => {
  return clientIngredients
    .filter(ing => ing.availability)
    .map(ing => ({
      id: ing.id,
      name: ing.name,
      protein: ing.crudeProtein,
      energy: ing.metabolizableEnergy,
      calcium: ing.calcium,
      phosphorus: ing.availablePhosphorus,
      lysine: ing.lysine,
      methionine: ing.methionine,
      fiber: ing.crudeFiber,
      price: ing.currentPrice,
      minPercent: ing.minInclusion,
      maxPercent: ing.maxInclusion
    }));
};

export const convertToLegacyRequirements = (requirement: NutritionalRequirement): LegacyNutritionalRequirement => {
  return {
    minProtein: requirement.minCrudeProtein,
    maxProtein: requirement.maxCrudeProtein,
    minEnergy: requirement.minMetabolizableEnergy,
    maxEnergy: requirement.maxMetabolizableEnergy,
    minCalcium: requirement.minCalcium,
    maxCalcium: requirement.maxCalcium,
    minPhosphorus: requirement.minAvailablePhosphorus,
    maxPhosphorus: requirement.maxAvailablePhosphorus,
    minLysine: requirement.minLysine,
    maxLysine: requirement.maxLysine || requirement.minLysine * 1.2,
    minMethionine: requirement.minMethionine,
    maxMethionine: requirement.maxMethionine || requirement.minMethionine * 1.2,
    maxFiber: requirement.maxCrudeFiber || 6.0
  };
};
