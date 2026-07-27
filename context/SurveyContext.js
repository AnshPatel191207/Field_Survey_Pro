import React, { createContext, useContext, useState, useCallback } from 'react';

const SurveyContext = createContext();

const STORAGE_KEY = 'surveys';

function generateId() {
  return 'SURV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function SurveyProvider({ children }) {
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);

  const addSurvey = useCallback((surveyData) => {
    const survey = {
      id: generateId(),
      ...surveyData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setSurveys((prev) => [survey, ...prev]);
    return survey;
  }, []);

  const updateSurvey = useCallback((id, updates) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSurvey = useCallback((id) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const submitSurvey = useCallback((id) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'submitted' } : s))
    );
  }, []);

  const getSurveyById = useCallback((id) => {
    return surveys.find((s) => s.id === id) || null;
  }, [surveys]);

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        currentSurvey,
        setCurrentSurvey,
        addSurvey,
        updateSurvey,
        deleteSurvey,
        submitSurvey,
        getSurveyById,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveys() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveys must be used within a SurveyProvider');
  }
  return context;
}
