
import { useState, useEffect } from 'react';
import { FormulationResult } from '@/types/nutrition';

interface FormulationRecord {
  id: string;
  date: string;
  result: FormulationResult;
  name: string;
}

export const useFormulationHistory = () => {
  const [history, setHistory] = useState<FormulationRecord[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('formulation-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveFormulation = (result: FormulationResult, name?: string) => {
    if (!result.feasible) return;

    const record: FormulationRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      result,
      name: name || `Formulação ${new Date().toLocaleDateString('pt-BR')}`
    };

    const newHistory = [record, ...history].slice(0, 10); // Manter apenas as 10 mais recentes
    setHistory(newHistory);
    localStorage.setItem('formulation-history', JSON.stringify(newHistory));
  };

  const deleteFormulation = (id: string) => {
    const newHistory = history.filter(record => record.id !== id);
    setHistory(newHistory);
    localStorage.setItem('formulation-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('formulation-history');
  };

  return {
    history,
    saveFormulation,
    deleteFormulation,
    clearHistory
  };
};
