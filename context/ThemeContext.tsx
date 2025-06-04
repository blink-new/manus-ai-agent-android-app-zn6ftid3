import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() || 'light';
  const [theme, setThemeState] = useState<Theme>(systemColorScheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme') as Theme | null;
        if (savedTheme) {
          setThemeState(savedTheme);
        } else {
          setThemeState(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
        setThemeState(systemColorScheme);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
      setThemeState(newTheme);
      // For iOS, Appearance.setColorScheme might be needed if you want to influence system-level UI elements
      // For Android, this is generally handled at the app level by theming
      if (Platform.OS === 'ios') {
        Appearance.setColorScheme(newTheme);
      }
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Listen to system theme changes if no theme is explicitly set by user
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem('appTheme').then(savedTheme => {
        if (!savedTheme) { // Only update if user hasn't set a preference
          const newSystemTheme = colorScheme || 'light';
          setThemeState(newSystemTheme);
        }
      });
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
