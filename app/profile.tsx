import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Platform,
  Appearance,
  I18nManager,
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
  Globe as LanguageIcon,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';

interface SettingItem {
  id: string;
  titleKey: string;
  subtitleKey?: string;
  subtitleParams?: object;
  icon: React.ReactNode;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  // Removed Appearance listener as ThemeContext handles system theme changes more robustly

  const userStats = {
    tasksCompleted: 127,
    totalConversations: 89,
    dataProcessed: '2.4 GB',
    uptime: '99.8%',
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleToggleLanguage = () => {
    const newLang = locale === 'en' ? 'ar' : 'en';
    setLocale(newLang);
    I18nManager.forceRTL(newLang === 'ar');
    // Consider a more graceful way to reload the app or specific components if needed for full RTL/LTR switch
    Alert.alert(t('languageChanged'), t('languageSetTo', { languageName: newLang === 'ar' ? t('languageArabic') : t('languageEnglish') }));
  };

  const settingsData: SettingItem[] = [
    {
      id: 'appearance',
      titleKey: 'darkMode',
      subtitleKey: 'darkModeSubtitle',
      icon: theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />,
      type: 'toggle',
      value: theme === 'dark',
      onToggle: handleToggleTheme,
    },
    {
      id: 'language',
      titleKey: 'language',
      subtitleKey: locale === 'en' ? 'languageEnglish' : 'languageArabic',
      icon: <LanguageIcon size={20} />,
      type: 'navigation',
      onPress: handleToggleLanguage,
    },
    {
      id: 'notifications',
      titleKey: 'notifications',
      subtitleKey: 'notificationsSubtitle',
      icon: <Bell size={20} />,
      type: 'toggle',
      value: notifications,
      onToggle: (value) => {
        setNotifications(value);
        Alert.alert(t('notifications'), value ? t('notificationsEnabled') : t('notificationsDisabled'));
      },
    },
    {
      id: 'autosync',
      titleKey: 'autoSync',
      subtitleKey: 'autoSyncSubtitle',
      icon: <Wifi size={20} />,
      type: 'toggle',
      value: autoSync,
      onToggle: (value) => {
        setAutoSync(value);
        Alert.alert(t('autoSync'), value ? t('autoSyncEnabled') : t('autoSyncDisabled'));
      },
    },
    {
      id: 'privacy',
      titleKey: 'privacySecurity',
      subtitleKey: 'privacySecuritySubtitle',
      icon: <Shield size={20} />,
      type: 'navigation',
      onPress: () => Alert.alert(t('privacySecurity'), t('privacySecurityComingSoon')),
    },
    {
      id: 'help',
      titleKey: 'helpSupport',
      subtitleKey: 'helpSupportSubtitle',
      icon: <HelpCircle size={20} />,
      type: 'navigation',
      onPress: () => Alert.alert(t('helpSupport'), t('helpSupportComingSoon')),
    },
    {
      id: 'rate',
      titleKey: 'rateManusAI',
      subtitleKey: 'rateManusAISubtitle',
      icon: <Star size={20} />,
      type: 'navigation',
      onPress: () => Alert.alert(t('rateManusAI'), t('rateAppThanks')),
    },
  ];

  const dynamicStyles = getDynamicStyles(theme, locale);

  const renderSettingItem = ({ item, index }: { item: SettingItem; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={dynamicStyles.settingItem}
    >
      <TouchableOpacity
        style={dynamicStyles.settingContent}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
        activeOpacity={0.7}
      >
        <View style={dynamicStyles.settingIcon}>
          {React.cloneElement(item.icon as React.ReactElement, { color: theme === 'dark' ? '#A5B4FC' : '#64748B' })}
        </View>
        <View style={dynamicStyles.settingText}>
          <Text style={dynamicStyles.settingTitle}>{t(item.titleKey)}</Text>
          {item.subtitleKey && (
            <Text style={dynamicStyles.settingSubtitle}>{t(item.subtitleKey, item.subtitleParams)}</Text>
          )}
        </View>
        <View style={dynamicStyles.settingAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: theme === 'dark' ? '#334155' : '#E2E8F0', true: theme === 'dark' ? '#4F46E5' : '#1E40AF' }}
              thumbColor={item.value ? (Platform.OS === 'ios' ? '#FFFFFF' : (theme === 'dark' ? '#A5B4FC' : '#FFFFFF')) : '#FFFFFF'}
              ios_backgroundColor={theme === 'dark' ? '#334155' : '#E2E8F0'}
            />
          ) : (
            <ChevronRight color={theme === 'dark' ? '#94A3B8' : '#94A3B8'} size={16} style={{ transform: [{ scaleX: locale === 'ar' ? -1 : 1 }] }} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStatCard = (titleKey: string, value: string, icon: React.ReactNode, index: number) => (
    <Animated.View
      key={titleKey}
      entering={FadeInDown.duration(300).delay(200 + index * 100)}
      style={dynamicStyles.statCard}
    >
      <View style={dynamicStyles.statIcon}>
        {React.cloneElement(icon as React.ReactElement, { color: theme === 'dark' ? '#A5B4FC' : (icon as React.ReactElement).props.color || '#1E40AF' })}
      </View>
      <Text style={dynamicStyles.statValue}>{value}</Text>
      <Text style={dynamicStyles.statTitle}>{t(titleKey)}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Animated.View
        style={dynamicStyles.header}
        entering={FadeInUp.duration(400)}
      >
        <View style={dynamicStyles.profileHeader}>
          <View style={dynamicStyles.avatar}>
            <User color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} size={32} />
          </View>
          <View style={dynamicStyles.profileInfo}>
            <Text style={dynamicStyles.userName}>{t('profileUserName')}</Text>
            <Text style={dynamicStyles.userEmail}>{t('profileUserEmail')}</Text>
          </View>
          <TouchableOpacity style={dynamicStyles.editButton} onPress={() => Alert.alert(t('editProfile'), t('editProfileComingSoon'))}>
            <Settings color={theme === 'dark' ? '#CBD5E1' : '#64748B'} size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={dynamicStyles.statsSection}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <Text style={dynamicStyles.sectionTitle}>{t('usageStatistics')}</Text>
          <View style={dynamicStyles.statsGrid}>
            {renderStatCard('tasksCompletedStat', userStats.tasksCompleted.toString(), <Activity color="#10B981" size={20} />, 0)}
            {renderStatCard('conversationsStat', userStats.totalConversations.toString(), <User color="#3B82F6" size={20} />, 1)}
            {renderStatCard('dataProcessedStat', userStats.dataProcessed, <Database color="#8B5CF6" size={20} />, 2)}
            {renderStatCard('uptimeStat', userStats.uptime, <Wifi color="#F59E0B" size={20} />, 3)}
          </View>
        </Animated.View>

        <View style={dynamicStyles.settingsSection}>
          <Animated.Text
            style={dynamicStyles.sectionTitle}
            entering={FadeInDown.duration(400).delay(400)}
          >
            {t('settings')}
          </Animated.Text>
          <View style={dynamicStyles.settingsList}>
            {settingsData.map((item, index) => (
              <View key={item.id}>
                {renderSettingItem({ item, index })}
              </View>
            ))}
          </View>
        </View>

        <Animated.View
          style={dynamicStyles.dangerSection}
          entering={FadeInDown.duration(400).delay(600)}
        >
          <TouchableOpacity
            style={dynamicStyles.dangerButton}
            onPress={() => Alert.alert(t('signOut'), t('signOutConfirmation'), [
              { text: t('cancel'), style: 'cancel' },
              { text: t('signOut'), style: 'destructive', onPress: () => Alert.alert(t('signOut'), t('signedOutSuccess')) },
            ])}
          >
            <LogOut color={theme === 'dark' ? '#FCA5A5' : '#EF4444'} size={20} />
            <Text style={dynamicStyles.dangerText}>{t('signOut')}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={dynamicStyles.footer}>
          <Text style={dynamicStyles.footerText}>{t('appVersion')}</Text>
          <Text style={dynamicStyles.footerSubtext}>{t('madeWithLove')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getDynamicStyles = (theme: 'light' | 'dark', locale: 'en' | 'ar') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC',
  },
  header: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  profileHeader: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: locale === 'ar' ? 0 : 16,
    marginLeft: locale === 'ar' ? 16 : 0,
  },
  profileInfo: {
    flex: 1,
    alignItems: locale === 'ar' ? 'flex-end' : 'flex-start',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  userEmail: {
    fontSize: 14,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    marginTop: 2,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  editButton: {
    padding: 8,
    marginLeft: locale === 'ar' ? 0 : 'auto',
    marginRight: locale === 'ar' ? 'auto' : 0,
  },
  content: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
    alignItems: locale === 'ar' ? 'flex-end' : 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#E2E8F0' : '#0F172A',
    marginBottom: 16,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  statsGrid: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: theme === 'dark' ? '#000000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme === 'dark' ? 0.2 : 0.1,
    shadowRadius: 2,
    elevation: theme === 'dark' ? 3 : 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    textAlign: 'center',
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: locale === 'ar' ? 'flex-end' : 'flex-start',
  },
  settingsList: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderRadius: 12,
    shadowColor: theme === 'dark' ? '#000000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme === 'dark' ? 0.2 : 0.1,
    shadowRadius: 2,
    elevation: theme === 'dark' ? 3 : 2,
    width: '100%',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#F1F5F9',
  },
  settingContent: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingIcon: {
    marginRight: locale === 'ar' ? 0 : 16,
    marginLeft: locale === 'ar' ? 16 : 0,
    width: 24,
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    alignItems: locale === 'ar' ? 'flex-end' : 'flex-start',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme === 'dark' ? '#E2E8F0' : '#0F172A',
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    marginTop: 2,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  settingAction: {
    marginLeft: locale === 'ar' ? 0 : 12,
    marginRight: locale === 'ar' ? 12 : 0,
  },
  dangerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 10,
  },
  dangerButton: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#3F1A1A' : '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#7F1D1D' : '#FEE2E2',
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme === 'dark' ? '#FCA5A5' : '#EF4444',
    marginLeft: locale === 'ar' ? 0 : 8,
    marginRight: locale === 'ar' ? 8 : 0,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: theme === 'dark' ? '#64748B' : '#94A3B8',
  },
  footerSubtext: {
    fontSize: 10,
    color: theme === 'dark' ? '#475569' : '#CBD5E1',
    marginTop: 4,
  },
});