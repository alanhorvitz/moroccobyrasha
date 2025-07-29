"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/lib/translations';
import { saveUserPreferences, getData } from '@/lib/storage';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const preferences = getData('userPreferences');
    if (preferences?.language) {
      setLanguageState(preferences.language as Language);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'ar', 'fr', 'es', 'it'].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    // Update document direction for RTL languages
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveUserPreferences({ language: lang });
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let translation: unknown = translations[language];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && translation !== null) {
        translation = (translation as Record<string, unknown>)[k];
      } else {
        translation = undefined;
        break;
      }
    }

    if (typeof translation !== 'string') {
      // Fallback to English if translation not found
      translation = translations.en;
      for (const k of keys) {
        if (translation && typeof translation === 'object' && translation !== null) {
          translation = (translation as Record<string, unknown>)[k];
        } else {
          return key; // Return key if no translation found
        }
      }
    }

    if (typeof translation === 'string' && params) {
      // Replace parameters in translation
      return translation.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return translation || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};