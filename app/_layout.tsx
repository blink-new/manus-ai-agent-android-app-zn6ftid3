import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { MessageCircle, CheckSquare, Zap, User } from 'lucide-react-native';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { I18nProvider, useI18n } from '@/context/I18nContext';
import { Platform, I18nManager } from 'react-native';

function AppLayout() {
  const { theme } = useTheme();
  const { t, locale } = useI18n();
  useFrameworkReady();

  useEffect(() => {
    I18nManager.forceRTL(locale === 'ar');
  }, [locale]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme === 'dark' ? '#A5B4FC' : '#1E40AF',
          tabBarInactiveTintColor: theme === 'dark' ? '#94A3B8' : '#64748B',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
            borderTopColor: theme === 'dark' ? '#1E293B' : '#E2E8F0',
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 24 : 8,
            height: Platform.OS === 'ios' ? 90 : 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('chat'),
            tabBarIcon: ({ color, size }) => (
              <MessageCircle color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: t('tasks'),
            tabBarIcon: ({ color, size }) => (
              <CheckSquare color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="capabilities"
          options={{
            title: t('capabilities'),
            tabBarIcon: ({ color, size }) => (
              <Zap color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('profile'),
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppLayout />
      </I18nProvider>
    </ThemeProvider>
  );
}