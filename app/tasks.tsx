import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  Platform,
  I18nManager,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Briefcase,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { TaskCard } from '@/components/TaskCard';
import { useRouter } from 'expo-router';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  type: 'research' | 'coding' | 'analysis' | 'writing' | 'general';
  progress: number;
  startTime: Date;
  estimatedTime?: number;
  details?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Market Research Analysis',
    description: 'Gathering comprehensive data on mobile app market trends for Q3.',
    status: 'running',
    type: 'research',
    progress: 65,
    startTime: new Date(Date.now() - 25 * 60 * 1000),
    estimatedTime: 45,
    details: 'Currently analyzing competitor data and user survey results. Initial findings suggest a strong demand for feature X.',
  },
  {
    id: '2',
    title: 'Code Review & Optimization',
    description: 'Analyzing React Native performance bottlenecks in the chat module.',
    status: 'completed',
    type: 'coding',
    progress: 100,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: 'Identified and resolved three major performance issues. Optimized FlatList rendering and reduced component re-renders by 40%.',
  },
  {
    id: '3',
    title: 'User Documentation Update',
    description: 'Creating comprehensive API documentation for v2.0 release.',
    status: 'paused',
    type: 'writing',
    progress: 40,
    startTime: new Date(Date.now() - 60 * 60 * 1000),
    estimatedTime: 120,
    details: 'Drafted sections for Authentication and Core API endpoints. Pending review and examples for advanced features.',
  },
  {
    id: '4',
    title: 'Data Processing Pipeline Setup',
    description: 'Setting up automated data analysis workflow for user engagement metrics.',
    status: 'failed',
    type: 'analysis',
    progress: 20,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    details: 'Pipeline setup failed due to an authentication error with the data warehouse. Error code: 503. Needs credentials update.',
  },
  {
    id: '5',
    title: 'New Feature Brainstorming',
    description: 'Exploring ideas for the next major feature release.',
    status: 'running',
    type: 'general',
    progress: 30,
    startTime: new Date(Date.now() - 10 * 60 * 1000),
    estimatedTime: 60,
    details: 'Currently gathering user feedback and analyzing market gaps. Three potential feature ideas are being evaluated.',
  },
];

export default function TasksScreen() {
  const { theme } = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'paused' | 'failed'>('all');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.status === 'running' && task.progress < 100
            ? { ...task, progress: Math.min(task.progress + 5, 100) }
            : task
        )
      );
      setRefreshing(false);
      Alert.alert(t("taskUpdated"), t("refreshingTasks"));
    }, 1500);
  }, [t]);

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      t('taskDetailsTitle', { taskTitle: task.title }),
      t('taskDetailsMessage', {
        status: t(task.status),
        progress: task.progress,
        type: t(task.type),
        startTime: new Date(task.startTime).toLocaleString(locale),
        details: task.details || t('noDetails', { defaultValue: 'No additional details.' }),
      }),
      [{ text: t("ok") }]
    );
  };

  const handleTaskActionPress = (task: Task) => {
    let actions = [];
    if (task.status === 'running') {
      actions.push({ text: t('pauseTask'), onPress: () => updateTaskStatus(task.id, 'paused') });
    }
    if (task.status === 'paused') {
      actions.push({ text: t('resumeTask'), onPress: () => updateTaskStatus(task.id, 'running') });
    }
    if (task.status !== 'completed' && task.status !== 'failed') {
      actions.push({ text: t('markAsCompleted'), onPress: () => updateTaskStatus(task.id, 'completed') });
    }
    if (task.status !== 'failed') {
      actions.push({ text: t('markAsFailed'), onPress: () => updateTaskStatus(task.id, 'failed') });
    }
    actions.push({ text: t('viewDetails'), onPress: () => handleTaskPress(task) });
    actions.push({ text: t('cancel'), style: 'cancel' });

    Alert.alert(t('actionsForTask', { taskTitle: task.title }), t('whatWouldYouLikeToDo'), actions);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress }
          : task
      )
    );
    Alert.alert(t("taskUpdated"), t("taskStatusChangedTo", { status: t(newStatus) }));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => (
    <View style={{ transform: [{ scaleX: locale === 'ar' ? -1 : 1 }] }}>
      <TaskCard
        task={item}
        index={index}
        onPress={() => handleTaskPress(item)}
        onActionPress={() => handleTaskActionPress(item)}
      />
    </View>
  );

  const dynamicStyles = getDynamicStyles(theme, locale);
  const filterOptions: Task['status'][] = ['running', 'completed', 'paused', 'failed'];

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Animated.View
        style={dynamicStyles.header}
        entering={FadeInUp.duration(400)}
      >
        <Text style={dynamicStyles.headerTitle}>{t('tasks')}</Text>
        <Text style={dynamicStyles.headerSubtitle}>{t('tasksHeaderSubtitle')}</Text>
      </Animated.View>

      <View style={dynamicStyles.filterContainer}>
        <TouchableOpacity
          key='all'
          style={[
            dynamicStyles.filterButton,
            filter === 'all' && dynamicStyles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              dynamicStyles.filterText,
              filter === 'all' && dynamicStyles.filterTextActive,
            ]}
          >
            {t('all')}
          </Text>
        </TouchableOpacity>
        {filterOptions.map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              dynamicStyles.filterButton,
              filter === filterOption && dynamicStyles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterOption)}
          >
            <Text
              style={[
                dynamicStyles.filterText,
                filter === filterOption && dynamicStyles.filterTextActive,
              ]}
            >
              {t(filterOption)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={[dynamicStyles.tasksList, { transform: [{ scaleX: locale === 'ar' ? -1 : 1 }] }]}
        contentContainerStyle={dynamicStyles.tasksContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme === 'dark' ? '#A5B4FC' : '#1E40AF'}
            title={t("refreshingTasks")}
            titleColor={theme === 'dark' ? '#94A3B8' : '#64748B'}
          />
        }
        ListEmptyComponent={
          <Animated.View
            style={dynamicStyles.emptyState}
            entering={FadeInDown.duration(500)}
          >
            <Briefcase color={theme === 'dark' ? '#64748B' : '#94A3B8'} size={48} />
            <Text style={dynamicStyles.emptyTitle}>{t('noTasksFoundForFilter', { filter: t(filter) })}</Text>
            <Text style={dynamicStyles.emptySubtitle}>
              {t('tryDifferentFilter')}
            </Text>
            {filter !== 'all' && (
              <TouchableOpacity onPress={() => setFilter('all')} style={dynamicStyles.showAllButton}>
                <Text style={dynamicStyles.showAllButtonText}>{t('showAllTasks')}</Text>
              </TouchableOpacity>
            )}
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
  filterContainer: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#E2E8F0',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: locale === 'ar' ? 0 : 10,
    marginLeft: locale === 'ar' ? 10 : 0,
    backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9',
  },
  filterButtonActive: {
    backgroundColor: theme === 'dark' ? '#4F46E5' : '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme === 'dark' ? '#CBD5E1' : '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  tasksList: {
    flex: 1,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  tasksContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    paddingHorizontal: 20,
  },
  showAllButton: {
    marginTop: 20,
    backgroundColor: theme === 'dark' ? '#4F46E5' : '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  showAllButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});