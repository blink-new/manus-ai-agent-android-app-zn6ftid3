import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  MoreHorizontal,
  Search,
  Code,
  FileText,
  Database,
  Briefcase,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import type { Task } from '@/app/tasks';

interface TaskCardProps {
  task: Task;
  index: number;
  onPress?: () => void;
  onActionPress?: () => void;
}

export function TaskCard({ task, index, onPress, onActionPress }: TaskCardProps) {
  const { theme } = useTheme();
  const dynamicStyles = getDynamicStyles(theme);

  const getStatusIcon = () => {
    const iconColor = task.status === 'failed' ? dynamicStyles.statusIconFailed.color :
                      task.status === 'completed' ? dynamicStyles.statusIconCompleted.color :
                      task.status === 'running' ? dynamicStyles.statusIconRunning.color :
                      dynamicStyles.statusIconPaused.color;
    switch (task.status) {
      case 'running':
        return <Clock color={iconColor} size={18} />;
      case 'completed':
        return <CheckCircle color={iconColor} size={18} />;
      case 'paused':
        return <Pause color={iconColor} size={18} />;
      case 'failed':
        return <AlertCircle color={iconColor} size={18} />;
    }
  };

  const getTypeIcon = () => {
    const iconColor = theme === 'dark' ? dynamicStyles.typeIconDark.color : dynamicStyles.typeIconLight.color;
    switch (task.type) {
      case 'research':
        return <Search color={iconColor} size={14} />;
      case 'coding':
        return <Code color={iconColor} size={14} />;
      case 'writing':
        return <FileText color={iconColor} size={14} />;
      case 'analysis':
        return <Database color={iconColor} size={14} />;
      case 'general':
        return <Briefcase color={iconColor} size={14} />;
      default:
        return <Briefcase color={iconColor} size={14} />;
    }
  };

  const getCardBackgroundColor = () => {
    if (theme === 'dark') {
        switch (task.status) {
            case 'running': return '#3730A3';
            case 'completed': return '#065F46';
            case 'paused': return '#374151';
            case 'failed': return '#7F1D1D';
            default: return '#1E293B';
        }
    } else {
        switch (task.status) {
            case 'running': return '#EEF2FF';
            case 'completed': return '#D1FAE5';
            case 'paused': return '#F3F4F6';
            case 'failed': return '#FEE2E2';
            default: return '#FFFFFF';
        }
    }
  };

  const formatDuration = () => {
    const duration = Date.now() - new Date(task.startTime).getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getEstimatedTimeLeft = () => {
    if (!task.estimatedTime || task.status !== 'running') return null;
    const elapsed = Math.floor((Date.now() - new Date(task.startTime).getTime()) / 60000);
    const remaining = task.estimatedTime - elapsed;
    if (remaining <= 0 && task.progress < 100) return 'Overdue';
    if (remaining <= 0 && task.progress === 100) return 'Completed';
    return remaining > 0 ? `${remaining}m left` : null;
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 100)}
      style={[dynamicStyles.card, { backgroundColor: getCardBackgroundColor() }]}
    >
      <TouchableOpacity 
        style={dynamicStyles.cardContent} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.taskInfo}>
            <View style={dynamicStyles.titleRow}>
              <View style={dynamicStyles.typeIconContainer}>{getTypeIcon()}</View>
              <Text style={dynamicStyles.title} numberOfLines={1} ellipsizeMode="tail">{task.title}</Text>
            </View>
            <Text style={dynamicStyles.description} numberOfLines={2} ellipsizeMode="tail">{task.description}</Text>
          </View>
          
          <View style={dynamicStyles.actions}>
            {getStatusIcon()}
            <TouchableOpacity style={dynamicStyles.moreButton} onPress={onActionPress} activeOpacity={0.5}>
              <MoreHorizontal color={theme === 'dark' ? '#9CA3AF' : '#6B7280'} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {task.status === 'running' && task.progress < 100 && (
          <View style={dynamicStyles.progressContainer}>
            <View style={dynamicStyles.progressBar}>
              <View style={[dynamicStyles.progressFill, { width: `${task.progress}%` }]} />
            </View>
            <Text style={dynamicStyles.progressText}>{task.progress}%</Text>
          </View>
        )}

        <View style={dynamicStyles.footer}>
          <Text style={dynamicStyles.duration}>
            Duration: {formatDuration()}
          </Text>
          {getEstimatedTimeLeft() && (
            <Text style={[dynamicStyles.estimated, getEstimatedTimeLeft() === 'Overdue' && dynamicStyles.overdueText]}>
              Est. {getEstimatedTimeLeft()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const getDynamicStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme === 'dark' ? '#000000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.25 : 0.1,
    shadowRadius: 4,
    elevation: theme === 'dark' ? 4 : 3,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeIconContainer: {
    marginRight: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#F3F4F6' : '#1F2937',
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginLeft: 10,
    padding: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: theme === 'dark' ? '#374151' : '#E5E7EB',
    borderRadius: 2.5,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme === 'dark' ? '#818CF8' : '#4F46E5',
    borderRadius: 2.5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme === 'dark' ? '#C7D2FE' : '#312E81',
    minWidth: 35,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  duration: {
    fontSize: 12,
    color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
  },
  estimated: {
    fontSize: 12,
    color: theme === 'dark' ? '#FCD34D' : '#F59E0B',
    fontWeight: '500',
  },
  overdueText: {
    color: theme === 'dark' ? '#FCA5A5' : '#EF4444',
  },
  statusIconRunning: {
    color: theme === 'dark' ? '#FCD34D' : '#F59E0B',
  },
  statusIconCompleted: {
    color: theme === 'dark' ? '#6EE7B7' : '#10B981',
  },
  statusIconPaused: {
    color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
  },
  statusIconFailed: {
    color: theme === 'dark' ? '#FCA5A5' : '#EF4444',
  },
  typeIconLight: {
      color: '#4B5563',
  },
  typeIconDark: {
      color: '#D1D5DB',
  }
});