import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  MoreHorizontal,
  Search,
  Code,
  FileText,
  Database,
  Globe
} from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  type: 'research' | 'coding' | 'analysis' | 'writing';
  progress: number;
  startTime: Date;
  estimatedTime?: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Market Research Analysis',
    description: 'Gathering comprehensive data on mobile app market trends',
    status: 'running',
    type: 'research',
    progress: 65,
    startTime: new Date(Date.now() - 25 * 60 * 1000),
    estimatedTime: 45,
  },
  {
    id: '2',
    title: 'Code Review & Optimization',
    description: 'Analyzing React Native performance bottlenecks',
    status: 'completed',
    type: 'coding',
    progress: 100,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'User Documentation',
    description: 'Creating comprehensive API documentation',
    status: 'paused',
    type: 'writing',
    progress: 40,
    startTime: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Data Processing Pipeline',
    description: 'Setting up automated data analysis workflow',
    status: 'failed',
    type: 'analysis',
    progress: 20,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'running' | 'completed'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return <Clock color="#F59E0B" size={20} />;
      case 'completed':
        return <CheckCircle color="#10B981" size={20} />;
      case 'paused':
        return <Pause color="#6B7280" size={20} />;
      case 'failed':
        return <AlertCircle color="#EF4444" size={20} />;
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'research':
        return <Search color="#1E40AF" size={16} />;
      case 'coding':
        return <Code color="#7C3AED" size={16} />;
      case 'writing':
        return <FileText color="#059669" size={16} />;
      case 'analysis':
        return <Database color="#DC2626" size={16} />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return '#FEF3C7';
      case 'completed':
        return '#D1FAE5';
      case 'paused':
        return '#F3F4F6';
      case 'failed':
        return '#FEE2E2';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const formatDuration = (startTime: Date) => {
    const duration = Date.now() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 100)}
      style={[styles.taskCard, { backgroundColor: getStatusColor(item.status) }]}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <View style={styles.taskTitleRow}>
            {getTypeIcon(item.type)}
            <Text style={styles.taskTitle}>{item.title}</Text>
          </View>
          <Text style={styles.taskDescription}>{item.description}</Text>
        </View>
        <View style={styles.taskActions}>
          {getStatusIcon(item.status)}
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal color="#6B7280" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {item.status === 'running' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      )}

      <View style={styles.taskFooter}>
        <Text style={styles.duration}>
          Duration: {formatDuration(item.startTime)}
        </Text>
        {item.estimatedTime && item.status === 'running' && (
          <Text style={styles.estimated}>
            Est. {item.estimatedTime - Math.floor((Date.now() - item.startTime.getTime()) / 60000)}m left
          </Text>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(400)}
      >
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.headerSubtitle}>Monitor your AI assistant's work</Text>
      </Animated.View>

      <View style={styles.filterContainer}>
        {['all', 'running', 'completed'].map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterButton,
              filter === filterOption && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterOption as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === filterOption && styles.filterTextActive,
              ]}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CheckCircle color="#94A3B8" size={48} />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              Start a conversation to see your tasks here
            </Text>
          </View>
        }
      />
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  },
  filterButtonActive: {
    backgroundColor: '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  tasksList: {
    flex: 1,
  },
  tasksContent: {
    padding: 16,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginLeft: 12,
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E40AF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    minWidth: 30,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
  },
  estimated: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
});