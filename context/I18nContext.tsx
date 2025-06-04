import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import ar from './ar.json';

export type Language = 'en' | 'ar';

interface I18nContextType {
  i18n: I18n;
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (scope: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  en,
  ar,
};

const i18nInstance = new I18n(translations);
i18nInstance.enableFallback = true;

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>(Localization.getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en');

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('appLocale') as Language | null;
        if (savedLocale) {
          setLocaleState(savedLocale);
          i18nInstance.locale = savedLocale;
        } else {
          // If no saved locale, use the device's locale if it's supported, otherwise default to 'en'
          const deviceLocale = Localization.getLocales()[0]?.languageCode;
          const initialLocale = deviceLocale === 'ar' ? 'ar' : 'en';
          setLocaleState(initialLocale);
          i18nInstance.locale = initialLocale;
        }
      } catch (error) {
        console.error('Failed to load locale from storage', error);
        i18nInstance.locale = 'en'; // Fallback to English
      }
    };
    loadLocale();
  }, []);

  const setLocale = async (newLocale: Language) => {
    try {
      await AsyncStorage.setItem('appLocale', newLocale);
      i18nInstance.locale = newLocale;
      setLocaleState(newLocale);
      // You might need to force a re-render or use a different mechanism if components don't update
      // For Expo, Localization.locale might need to be considered for system components if applicable
    } catch (error) {
      console.error('Failed to save locale to storage', error);
    }
  };

  const t = (scope: string, options?: any) => {
    return i18nInstance.t(scope, { ...options, locale });
  };

  return (
    <I18nContext.Provider value={{ i18n: i18nInstance, locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
