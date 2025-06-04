import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  FlatList,
  I18nManager,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Search,
  Database,
  FileText,
  Code,
  Globe,
  Settings,
  BarChart3,
  MessageSquare,
  Zap,
  Brain,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'expo-router';

interface Capability {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  color: string;
  darkColor?: string;
  category: 'research' | 'development' | 'analysis' | 'automation' | 'general';
  action?: () => void;
}

const capabilitiesData: Capability[] = [
  {
    id: '1',
    titleKey: 'capabilityInformationResearchTitle',
    descriptionKey: 'capabilityInformationResearchDescription',
    icon: <Search color="#FFFFFF" size={24} />,
    color: '#3B82F6',
    darkColor: '#60A5FA',
    category: 'research',
  },
  {
    id: '2',
    titleKey: 'capabilityDataAnalysisTitle',
    descriptionKey: 'capabilityDataAnalysisDescription',
    icon: <BarChart3 color="#FFFFFF" size={24} />,
    color: '#8B5CF6',
    darkColor: '#A78BFA',
    category: 'analysis',
  },
  {
    id: '3',
    titleKey: 'capabilityCodeGenerationTitle',
    descriptionKey: 'capabilityCodeGenerationDescription',
    icon: <Code color="#FFFFFF" size={24} />,
    color: '#10B981',
    darkColor: '#34D399',
    category: 'development',
  },
  {
    id: '4',
    titleKey: 'capabilityContentWritingTitle',
    descriptionKey: 'capabilityContentWritingDescription',
    icon: <FileText color="#FFFFFF" size={24} />,
    color: '#F59E0B',
    darkColor: '#FBBF24',
    category: 'research',
  },
  {
    id: '5',
    titleKey: 'capabilityWebAutomationTitle',
    descriptionKey: 'capabilityWebAutomationDescription',
    icon: <Globe color="#FFFFFF" size={24} />,
    color: '#EF4444',
    darkColor: '#F87171',
    category: 'automation',
  },
  {
    id: '6',
    titleKey: 'capabilityDatabaseManagementTitle',
    descriptionKey: 'capabilityDatabaseManagementDescription',
    icon: <Database color="#FFFFFF" size={24} />,
    color: '#6366F1',
    darkColor: '#818CF8',
    category: 'development',
  },
  {
    id: '7',
    titleKey: 'capabilityFileSystemOperationsTitle',
    descriptionKey: 'capabilityFileSystemOperationsDescription',
    icon: <Upload color="#FFFFFF" size={24} />,
    color: '#14B8A6',
    darkColor: '#2DD4BF',
    category: 'automation',
  },
  {
    id: '8',
    titleKey: 'capabilitySystemConfigurationTitle',
    descriptionKey: 'capabilitySystemConfigurationDescription',
    icon: <Settings color="#FFFFFF" size={24} />,
    color: '#84CC16',
    darkColor: '#A3E635',
    category: 'automation',
  },
  {
    id: '9',
    titleKey: 'capabilityGeneralProblemSolvingTitle',
    descriptionKey: 'capabilityGeneralProblemSolvingDescription',
    icon: <Brain color="#FFFFFF" size={24} />,
    color: '#EC4899',
    darkColor: '#F472B6',
    category: 'general',
  },
];

const categories = [
  { key: 'research', labelKey: 'research', icon: Search },
  { key: 'development', labelKey: 'development', icon: Code },
  { key: 'analysis', labelKey: 'analysis', icon: BarChart3 },
  { key: 'automation', labelKey: 'automation', icon: Zap },
  { key: 'general', labelKey: 'general', icon: Brain },
] as const;

export default function CapabilitiesScreen() {
  const { theme } = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<Capability['category']>(categories[0].key);

  const handleCapabilityPress = (capability: Capability) => {
    const translatedTitle = t(capability.titleKey);
    if (capability.action) {
      capability.action();
    } else {
      Alert.alert(
        t('startChatActionTitle', { title: translatedTitle }),
        t('startChatActionMessage', { title: translatedTitle }),
        [
          { text: t('cancel'), style: "cancel" },
          { text: t('startChat'), onPress: () => router.push({ pathname: '/', params: { prefill: t('prefillHelpWith', { defaultValue: 'I need help with {{title}}.', title: translatedTitle.toLowerCase() }) }}) }
        ]
      );
    }
  };

  const handleQuickStartPress = (actionKey: string, prefillMessageKey: string, prefillParams?: object) => {
    Alert.alert(
      t(actionKey),
      t('startChatActionMessage', { title: t(prefillMessageKey, prefillParams) }),
      [
        { text: t('cancel'), style: "cancel" },
        { text: t('startChat'), onPress: () => router.push({ pathname: '/', params: { prefill: t(prefillMessageKey, prefillParams) }}) }
      ]
    );
  };

  const filteredCapabilities = capabilitiesData.filter(
    (capability) => capability.category === selectedCategory
  );

  const dynamicStyles = getDynamicStyles(theme, locale);

  const renderCapabilityCard = ({ item, index }: { item: Capability; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 100)}
      style={dynamicStyles.capabilityCard}
    >
      <TouchableOpacity
        style={dynamicStyles.cardContent}
        onPress={() => handleCapabilityPress(item)}
        activeOpacity={0.7}
      >
        <View style={[dynamicStyles.iconContainer, { backgroundColor: theme === 'dark' ? (item.darkColor || item.color) : item.color }]}>
          {item.icon}
        </View>
        <View style={dynamicStyles.cardText}>
          <Text style={dynamicStyles.cardTitle}>{t(item.titleKey)}</Text>
          <Text style={dynamicStyles.cardDescription}>{t(item.descriptionKey)}</Text>
        </View>
        <View style={dynamicStyles.cardArrow}>
          <ChevronRight color={theme === 'dark' ? '#64748B' : '#94A3B8'} size={20} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Animated.View
        style={dynamicStyles.header}
        entering={FadeInUp.duration(400)}
      >
        <Text style={dynamicStyles.headerTitle}>{t('capabilities')}</Text>
        <Text style={dynamicStyles.headerSubtitle}>{t('capabilitiesHeaderSubtitle')}</Text>
      </Animated.View>

      <View style={dynamicStyles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.categoryScrollContent}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.key;
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  dynamicStyles.categoryButton,
                  isActive && dynamicStyles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.key)}
                activeOpacity={0.7}
              >
                <IconComponent
                  color={isActive ? '#FFFFFF' : (theme === 'dark' ? '#CBD5E1' : '#64748B')}
                  size={18}
                />
                <Text
                  style={[
                    dynamicStyles.categoryText,
                    isActive && dynamicStyles.categoryTextActive,
                  ]}
                >
                  {t(category.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCapabilities}
        renderItem={renderCapabilityCard}
        keyExtractor={(item) => item.id}
        style={[dynamicStyles.content, { transform: [{ scaleX: locale === 'ar' ? -1 : 1 }] }]}
        contentContainerStyle={dynamicStyles.capabilitiesGrid}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Animated.View
            style={dynamicStyles.quickStartSection}
            entering={FadeInDown.duration(400).delay(filteredCapabilities.length * 100 + 200)}
          >
            <Text style={dynamicStyles.sectionTitle}>{t('quickStart')}</Text>
            <Text style={dynamicStyles.sectionDescription}>
              {t('quickStartDescription')}
            </Text>

            <View style={dynamicStyles.quickStartCards}>
              <TouchableOpacity
                style={dynamicStyles.quickStartCard}
                onPress={() => handleQuickStartPress('askAQuestion', 'prefillAskQuestion', { defaultValue: 'I have a question about...' })}
                activeOpacity={0.7}
              >
                <MessageSquare color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} size={20} />
                <Text style={dynamicStyles.quickStartText}>{t('askAQuestion')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={dynamicStyles.quickStartCard}
                onPress={() => handleQuickStartPress('researchTopic', 'prefillResearchTopic', { defaultValue: 'Can you research the topic of...' })}
                activeOpacity={0.7}
              >
                <Search color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} size={20} />
                <Text style={dynamicStyles.quickStartText}>{t('researchTopic')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={dynamicStyles.quickStartCard}
                onPress={() => handleQuickStartPress('generateCode', 'prefillGenerateCode', { defaultValue: 'Please generate code for...' })}
                activeOpacity={0.7}
              >
                <Code color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} size={20} />
                <Text style={dynamicStyles.quickStartText}>{t('generateCode')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        }
        ListEmptyComponent={
          <Animated.View style={dynamicStyles.emptyState} entering={FadeInDown.duration(300)}>
            <Zap color={theme === 'dark' ? '#64748B' : '#94A3B8'} size={48} />
            <Text style={dynamicStyles.emptyTitle}>{t('noCapabilitiesFound')}</Text>
            <Text style={dynamicStyles.emptySubtitle}>{t('selectDifferentCategory')}</Text>
          </Animated.View>
        }
      />
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    alignItems: locale === 'ar' ? 'flex-end' : 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    marginTop: 4,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  categoryContainer: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
  },
  categoryButton: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: locale === 'ar' ? 0 : 10,
    marginLeft: locale === 'ar' ? 10 : 0,
    backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9',
  },
  categoryButtonActive: {
    backgroundColor: theme === 'dark' ? '#4F46E5' : '#1E40AF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme === 'dark' ? '#CBD5E1' : '#64748B',
    marginLeft: locale === 'ar' ? 0 : 6,
    marginRight: locale === 'ar' ? 6 : 0,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    transform: for FlatList itself is applied inline
  },
  capabilitiesGrid: {
    padding: 16,
  },
  capabilityCard: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme === 'dark' ? '#000000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme === 'dark' ? 0.2 : 0.1,
    shadowRadius: 3,
    elevation: theme === 'dark' ? 3 : 2,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  cardContent: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: locale === 'ar' ? 0 : 16,
    marginLeft: locale === 'ar' ? 16 : 0,
  },
  cardText: {
    flex: 1,
    alignItems: locale === 'ar' ? 'flex-end' : 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#E2E8F0' : '#0F172A',
    marginBottom: 4,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  cardDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#9CA3AF' : '#64748B',
    lineHeight: 20,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  cardArrow: {
    paddingLeft: locale === 'ar' ? 0 : 8,
    paddingRight: locale === 'ar' ? 8 : 0,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  quickStartSection: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: theme === 'dark' ? '#000000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme === 'dark' ? 0.2 : 0.1,
    shadowRadius: 3,
    elevation: theme === 'dark' ? 3 : 2,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#E2E8F0' : '#0F172A',
    marginBottom: 4,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  sectionDescription: {
    fontSize: 14,
    color: theme === 'dark' ? '#9CA3AF' : '#64748B',
    marginBottom: 16,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  quickStartCards: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
  },
  quickStartCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
  },
  quickStartText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme === 'dark' ? '#A5B4FC' : '#1E40AF',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === 'dark' ? '#CBD5E1' : '#64748B',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme === 'dark' ? '#94A3B8' : '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
});