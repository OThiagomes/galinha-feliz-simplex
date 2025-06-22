
import { useState, useEffect } from 'react';
import { UniversalNutritionalRequirement, NutritionalPhase } from '@/types/phases';

const DEFAULT_REQUIREMENTS: Omit<UniversalNutritionalRequirement, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Pré-Inicial',
    phase: 'pre-inicial',
    isCustom: false,
    minMetabolizableEnergy: 2900,
    maxMetabolizableEnergy: 3000,
    minCrudeProtein: 21.0,
    maxCrudeProtein: 23.0,
    minCalcium: 0.9,
    maxCalcium: 1.1,
    minAvailablePhosphorus: 0.45,
    maxAvailablePhosphorus: 0.55,
    minLysine: 1.35,
    minMethionine: 0.50,
    maxCrudeFiber: 3.5
  },
  {
    name: 'Inicial',
    phase: 'inicial',
    isCustom: false,
    minMetabolizableEnergy: 2850,
    maxMetabolizableEnergy: 2950,
    minCrudeProtein: 19.0,
    maxCrudeProtein: 21.0,
    minCalcium: 0.8,
    maxCalcium: 1.0,
    minAvailablePhosphorus: 0.40,
    maxAvailablePhosphorus: 0.50,
    minLysine: 1.20,
    minMethionine: 0.45,
    maxCrudeFiber: 4.0
  },
  {
    name: 'Pré-Postura',
    phase: 'pre-postura',
    isCustom: false,
    minMetabolizableEnergy: 2800,
    maxMetabolizableEnergy: 2900,
    minCrudeProtein: 17.0,
    maxCrudeProtein: 18.0,
    minCalcium: 2.0,
    maxCalcium: 2.5,
    minAvailablePhosphorus: 0.42,
    maxAvailablePhosphorus: 0.45,
    minLysine: 0.85,
    minMethionine: 0.45,
    maxCrudeFiber: 6.0
  },
  {
    name: 'Postura 1',
    phase: 'postura-1',
    isCustom: false,
    minMetabolizableEnergy: 2750,
    maxMetabolizableEnergy: 2850,
    minCrudeProtein: 17.5,
    maxCrudeProtein: 18.5,
    minCalcium: 3.8,
    maxCalcium: 4.0,
    minAvailablePhosphorus: 0.38,
    maxAvailablePhosphorus: 0.42,
    minLysine: 0.88,
    minMethionine: 0.48,
    maxCrudeFiber: 6.0
  }
];

export const useUniversalRequirements = () => {
  const [requirements, setRequirements] = useState<UniversalNutritionalRequirement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('universal-requirements');
    if (stored) {
      setRequirements(JSON.parse(stored));
    } else {
      const defaultReqs = DEFAULT_REQUIREMENTS.map(req => ({
        ...req,
        id: Date.now().toString() + Math.random(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setRequirements(defaultReqs);
      localStorage.setItem('universal-requirements', JSON.stringify(defaultReqs));
    }
  }, []);

  const saveRequirements = (newRequirements: UniversalNutritionalRequirement[]) => {
    setRequirements(newRequirements);
    localStorage.setItem('universal-requirements', JSON.stringify(newRequirements));
  };

  const addRequirement = (requirement: Omit<UniversalNutritionalRequirement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReq: UniversalNutritionalRequirement = {
      ...requirement,
      id: Date.now().toString(),
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

  return {
    requirements,
    addRequirement,
    updateRequirement,
    deleteRequirement
  };
};
