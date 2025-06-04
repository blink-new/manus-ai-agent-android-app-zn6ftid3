import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  MoreHorizontal,
  Search,
  Code,
  FileText,
  Database,
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

interface TaskCardProps {
  task: Task;
  index: number;
  onPress?: () => void;
  onActionPress?: () => void;
}

export function TaskCard({ task, index, onPress, onActionPress }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'running':
        return <Clock color="#F59E0B" size={18} />;
      case 'completed':
        return <CheckCircle color="#10B981" size={18} />;
      case 'paused':
        return <Pause color="#6B7280" size={18} />;
      case 'failed':
        return <AlertCircle color="#EF4444" size={18} />;
    }
  };

  const getTypeIcon = () => {
    switch (task.type) {
      case 'research':
        return <Search color="#1E40AF" size={14} />;
      case 'coding':
        return <Code color="#7C3AED" size={14} />;
      case 'writing':
        return <FileText color="#059669" size={14} />;
      case 'analysis':
        return <Database color="#DC2626" size={14} />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
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

  const formatDuration = () => {
    const duration = Date.now() - task.startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getEstimatedTimeLeft = () => {
    if (!task.estimatedTime || task.status !== 'running') return null;
    const elapsed = Math.floor((Date.now() - task.startTime.getTime()) / 60000);
    const remaining = task.estimatedTime - elapsed;
    return remaining > 0 ? `${remaining}m left` : 'Overtime';
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 100)}
      style={[styles.card, { backgroundColor: getStatusColor() }]}
    >
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <View style={styles.header}>
          <View style={styles.taskInfo}>
            <View style={styles.titleRow}>
              {getTypeIcon()}
              <Text style={styles.title}>{task.title}</Text>
            </View>
            <Text style={styles.description}>{task.description}</Text>
          </View>
          
          <View style={styles.actions}>
            {getStatusIcon()}
            <TouchableOpacity style={styles.moreButton} onPress={onActionPress}>
              <MoreHorizontal color="#6B7280" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {task.status === 'running' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{task.progress}%</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.duration}>
            Duration: {formatDuration()}
          </Text>
          {getEstimatedTimeLeft() && (
            <Text style={styles.estimated}>
              Est. {getEstimatedTimeLeft()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
  actions: {
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
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E40AF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    minWidth: 30,
  },
  footer: {
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
});