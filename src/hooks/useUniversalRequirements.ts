
import { useState, useEffect } from 'react';
import { UniversalNutritionalRequirement, NutritionalPhase } from '@/types/phases';

const DEFAULT_REQUIREMENTS: Omit<UniversalNutritionalRequirement, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Frango de Corte
  {
    name: 'Frango Pré-Inicial (1-7 dias)',
    phase: 'pre-inicial',
    isCustom: false,
    minMetabolizableEnergy: 2950,
    maxMetabolizableEnergy: 3050,
    minCrudeProtein: 22.0,
    maxCrudeProtein: 24.0,
    minCalcium: 0.90,
    maxCalcium: 1.10,
    minAvailablePhosphorus: 0.45,
    maxAvailablePhosphorus: 0.55,
    minLysine: 1.44,
    minMethionine: 0.50,
    minThreonine: 0.94,
    minTryptophan: 0.23,
    maxCrudeFiber: 3.0
  },
  {
    name: 'Frango Inicial (8-21 dias)',
    phase: 'inicial',
    isCustom: false,
    minMetabolizableEnergy: 2900,
    maxMetabolizableEnergy: 3000,
    minCrudeProtein: 20.0,
    maxCrudeProtein: 22.0,
    minCalcium: 0.84,
    maxCalcium: 1.00,
    minAvailablePhosphorus: 0.42,
    maxAvailablePhosphorus: 0.50,
    minLysine: 1.29,
    minMethionine: 0.46,
    minThreonine: 0.84,
    minTryptophan: 0.20,
    maxCrudeFiber: 4.0
  },
  {
    name: 'Frango Crescimento 1 (22-35 dias)',
    phase: 'crescimento-1',
    isCustom: false,
    minMetabolizableEnergy: 2850,
    maxMetabolizableEnergy: 2950,
    minCrudeProtein: 18.5,
    maxCrudeProtein: 20.0,
    minCalcium: 0.78,
    maxCalcium: 0.92,
    minAvailablePhosphorus: 0.39,
    maxAvailablePhosphorus: 0.46,
    minLysine: 1.17,
    minMethionine: 0.42,
    minThreonine: 0.76,
    minTryptophan: 0.18,
    maxCrudeFiber: 5.0
  },
  {
    name: 'Frango Crescimento 2 (36-42 dias)',
    phase: 'crescimento-2',
    isCustom: false,
    minMetabolizableEnergy: 2800,
    maxMetabolizableEnergy: 2900,
    minCrudeProtein: 17.0,
    maxCrudeProtein: 19.0,
    minCalcium: 0.72,
    maxCalcium: 0.84,
    minAvailablePhosphorus: 0.36,
    maxAvailablePhosphorus: 0.42,
    minLysine: 1.05,
    minMethionine: 0.38,
    minThreonine: 0.68,
    minTryptophan: 0.16,
    maxCrudeFiber: 5.5
  },
  {
    name: 'Frango Crescimento 3 (43+ dias)',
    phase: 'crescimento-3',
    isCustom: false,
    minMetabolizableEnergy: 2750,
    maxMetabolizableEnergy: 2850,
    minCrudeProtein: 16.0,
    maxCrudeProtein: 18.0,
    minCalcium: 0.65,
    maxCalcium: 0.78,
    minAvailablePhosphorus: 0.33,
    maxAvailablePhosphorus: 0.39,
    minLysine: 0.95,
    minMethionine: 0.35,
    minThreonine: 0.62,
    minTryptophan: 0.15,
    maxCrudeFiber: 6.0
  },
  
  // Poedeiras
  {
    name: 'Poedeira Pré-Postura (16-18 semanas)',
    phase: 'pre-postura',
    isCustom: false,
    minMetabolizableEnergy: 2750,
    maxMetabolizableEnergy: 2850,
    minCrudeProtein: 16.5,
    maxCrudeProtein: 17.5,
    minCalcium: 2.0,
    maxCalcium: 2.5,
    minAvailablePhosphorus: 0.42,
    maxAvailablePhosphorus: 0.50,
    minLysine: 0.85,
    minMethionine: 0.45,
    minThreonine: 0.58,
    minTryptophan: 0.17,
    maxCrudeFiber: 6.0
  },
  {
    name: 'Poedeira Postura 1 (19-45 semanas)',
    phase: 'postura-1',
    isCustom: false,
    minMetabolizableEnergy: 2750,
    maxMetabolizableEnergy: 2850,
    minCrudeProtein: 17.0,
    maxCrudeProtein: 18.0,
    minCalcium: 3.8,
    maxCalcium: 4.2,
    minAvailablePhosphorus: 0.38,
    maxAvailablePhosphorus: 0.45,
    minLysine: 0.88,
    minMethionine: 0.48,
    minThreonine: 0.60,
    minTryptophan: 0.18,
    maxCrudeFiber: 6.5
  },
  {
    name: 'Poedeira Postura 2 (46-65 semanas)',
    phase: 'postura-2',
    isCustom: false,
    minMetabolizableEnergy: 2700,
    maxMetabolizableEnergy: 2800,
    minCrudeProtein: 16.5,
    maxCrudeProtein: 17.5,
    minCalcium: 4.0,
    maxCalcium: 4.4,
    minAvailablePhosphorus: 0.36,
    maxAvailablePhosphorus: 0.42,
    minLysine: 0.85,
    minMethionine: 0.46,
    minThreonine: 0.58,
    minTryptophan: 0.17,
    maxCrudeFiber: 7.0
  },
  {
    name: 'Poedeira Postura 3 (66-80 semanas)',
    phase: 'postura-3',
    isCustom: false,
    minMetabolizableEnergy: 2650,
    maxMetabolizableEnergy: 2750,
    minCrudeProtein: 16.0,
    maxCrudeProtein: 17.0,
    minCalcium: 4.2,
    maxCalcium: 4.6,
    minAvailablePhosphorus: 0.34,
    maxAvailablePhosphorus: 0.40,
    minLysine: 0.82,
    minMethionine: 0.44,
    minThreonine: 0.56,
    minTryptophan: 0.16,
    maxCrudeFiber: 7.5
  },
  {
    name: 'Poedeira Postura 4 (81-95 semanas)',
    phase: 'postura-4',
    isCustom: false,
    minMetabolizableEnergy: 2600,
    maxMetabolizableEnergy: 2700,
    minCrudeProtein: 15.5,
    maxCrudeProtein: 16.5,
    minCalcium: 4.4,
    maxCalcium: 4.8,
    minAvailablePhosphorus: 0.32,
    maxAvailablePhosphorus: 0.38,
    minLysine: 0.80,
    minMethionine: 0.42,
    minThreonine: 0.54,
    minTryptophan: 0.15,
    maxCrudeFiber: 8.0
  },
  {
    name: 'Poedeira Postura 5 (96+ semanas)',
    phase: 'postura-5',
    isCustom: false,
    minMetabolizableEnergy: 2550,
    maxMetabolizableEnergy: 2650,
    minCrudeProtein: 15.0,
    maxCrudeProtein: 16.0,
    minCalcium: 4.6,
    maxCalcium: 5.0,
    minAvailablePhosphorus: 0.30,
    maxAvailablePhosphorus: 0.36,
    minLysine: 0.78,
    minMethionine: 0.40,
    minThreonine: 0.52,
    minTryptophan: 0.14,
    maxCrudeFiber: 8.5
  }
];

export const useUniversalRequirements = () => {
  const [requirements, setRequirements] = useState<UniversalNutritionalRequirement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('universal-requirements');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Verificar se tem todos os presets atualizados
        if (parsed.length < DEFAULT_REQUIREMENTS.length) {
          initializeWithDefaults();
        } else {
          setRequirements(parsed);
        }
      } catch {
        initializeWithDefaults();
      }
    } else {
      initializeWithDefaults();
    }
  }, []);

  const initializeWithDefaults = () => {
    const defaultReqs = DEFAULT_REQUIREMENTS.map((req, index) => ({
      ...req,
      id: `default-${index}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    setRequirements(defaultReqs);
    localStorage.setItem('universal-requirements', JSON.stringify(defaultReqs));
  };

  const saveRequirements = (newRequirements: UniversalNutritionalRequirement[]) => {
    setRequirements(newRequirements);
    localStorage.setItem('universal-requirements', JSON.stringify(newRequirements));
  };

  const addRequirement = (requirement: Omit<UniversalNutritionalRequirement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReq: UniversalNutritionalRequirement = {
      ...requirement,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...requirements, newReq];
    saveRequirements(updated);
    return newReq;
  };

  const updateRequirement = (id: string, updates: Partial<UniversalNutritionalRequirement>) => {
    const updated = requirements.map(req => 
      req.id === id 
        ? { ...req, ...updates, updatedAt: new Date().toISOString() }
        : req
    );
    saveRequirements(updated);
  };

  const deleteRequirement = (id: string) => {
    const updated = requirements.filter(req => req.id !== id);
    saveRequirements(updated);
  };

  const resetToDefaults = () => {
    initializeWithDefaults();
  };

  return {
    requirements,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    resetToDefaults
  };
};
