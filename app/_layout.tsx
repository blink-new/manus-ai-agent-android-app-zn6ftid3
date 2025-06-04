import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { MessageCircle, CheckSquare, Zap, User } from 'lucide-react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1E40AF',
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E2E8F0',
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 80,
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
            title: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <MessageCircle color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <CheckSquare color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="capabilities"
          options={{
            title: 'Capabilities',
            tabBarIcon: ({ color, size }) => (
              <Zap color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}