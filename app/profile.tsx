import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  User,
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  Wifi,
  HelpCircle,
  Star,
  LogOut,
  ChevronRight,
  Activity,
  Database,
} from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const userStats = {
    tasksCompleted: 127,
    totalConversations: 89,
    dataProcessed: '2.4 GB',
    uptime: '99.8%',
  };

  const settingsData: SettingItem[] = [
    {
      id: 'appearance',
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark themes',
      icon: darkMode ? <Moon color="#64748B" size={20} /> : <Sun color="#64748B" size={20} />,
      type: 'toggle',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Task completion and status updates',
      icon: <Bell color="#64748B" size={20} />,
      type: 'toggle',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'autosync',
      title: 'Auto Sync',
      subtitle: 'Automatically sync data across devices',
      icon: <Wifi color="#64748B" size={20} />,
      type: 'toggle',
      value: autoSync,
      onToggle: setAutoSync,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage your data and privacy settings',
      icon: <Shield color="#64748B" size={20} />,
      type: 'navigation',
      onPress: () => Alert.alert('Privacy & Security', 'Feature coming soon'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: <HelpCircle color="#64748B" size={20} />,
      type: 'navigation',
      onPress: () => Alert.alert('Help & Support', 'Feature coming soon'),
    },
    {
      id: 'rate',
      title: 'Rate Manus AI',
      subtitle: 'Share your experience with others',
      icon: <Star color="#64748B" size={20} />,
      type: 'navigation',
      onPress: () => Alert.alert('Rate App', 'Thank you for your feedback!'),
    },
  ];

  const renderSettingItem = ({ item, index }: { item: SettingItem; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={styles.settingItem}
    >
      <TouchableOpacity
        style={styles.settingContent}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E2E8F0', true: '#1E40AF' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          ) : (
            <ChevronRight color="#94A3B8" size={16} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStatCard = (title: string, value: string, icon: React.ReactNode, index: number) => (
    <Animated.View
      key={title}
      entering={FadeInDown.duration(300).delay(200 + index * 100)}
      style={styles.statCard}
    >
      <View style={styles.statIcon}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(400)}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <User color="#1E40AF" size={32} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Manus User</Text>
            <Text style={styles.userEmail}>user@manus.ai</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Settings color="#64748B" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={styles.statsSection}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Usage Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Tasks Completed', userStats.tasksCompleted.toString(), <Activity color="#10B981" size={20} />, 0)}
            {renderStatCard('Conversations', userStats.totalConversations.toString(), <User color="#3B82F6" size={20} />, 1)}
            {renderStatCard('Data Processed', userStats.dataProcessed, <Database color="#8B5CF6" size={20} />, 2)}
            {renderStatCard('Uptime', userStats.uptime, <Wifi color="#F59E0B" size={20} />, 3)}
          </View>
        </Animated.View>

        <View style={styles.settingsSection}>
          <Animated.Text 
            style={styles.sectionTitle}
            entering={FadeInDown.duration(400).delay(400)}
          >
            Settings
          </Animated.Text>
          <View style={styles.settingsList}>
            {settingsData.map((item, index) => (
              <View key={item.id}>
                {renderSettingItem({ item, index })}
              </View>
            ))}
          </View>
        </View>

        <Animated.View 
          style={styles.dangerSection}
          entering={FadeInDown.duration(400).delay(800)}
        >
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive' },
            ])}
          >
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.dangerText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Manus AI Agent v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ by the Manus Team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  settingAction: {
    marginLeft: 12,
  },
  dangerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  footerSubtext: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 4,
  },
});