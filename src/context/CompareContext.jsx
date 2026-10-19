import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('datacampus_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('datacampus_compare', JSON.stringify(compareList));
    } catch (e) {
      console.warn("Storage error in compare:", e);
    }
  }, [compareList]);

  const addToCompare = (career) => {
    if (compareList.some(c => c.id === career.id)) {
      return { added: false, message: "La carrera ya está en el comparador" };
    }
    if (compareList.length >= 4) {
      return { added: false, message: "Puedes comparar un máximo de 4 carreras simultáneamente" };
    }
    setCompareList(prev => [...prev, career]);
    return { added: true, message: "Carrera agregada al comparador" };
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(c => c.id !== id));
  };

  const isInCompare = (id) => {
    return compareList.some(c => c.id === id);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      compareCount: compareList.length
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
