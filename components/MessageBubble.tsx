import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bot, User, Check, CheckCheck, AlertTriangle, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'delivered' | 'error';
  };
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const { theme } = useTheme();
  const dynamicStyles = getDynamicStyles(theme, message.isUser);

  const getStatusIcon = () => {
    if (!message.isUser) return null;

    switch (message.status) {
      case 'sending':
        return <Clock color={dynamicStyles.statusIcon.color} size={12} style={dynamicStyles.statusIcon} />;
      case 'sent':
        return <Check color={dynamicStyles.statusIcon.color} size={12} style={dynamicStyles.statusIcon} />;
      case 'delivered':
        return <CheckCheck color={dynamicStyles.statusIcon.color} size={12} style={dynamicStyles.statusIcon} />;
      case 'error':
        return <AlertTriangle color={dynamicStyles.statusIconError.color} size={12} style={dynamicStyles.statusIcon} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[
        dynamicStyles.messageContainer,
        message.isUser ? dynamicStyles.userMessage : dynamicStyles.aiMessage,
      ]}
    >
      {!message.isUser && (
        <View style={dynamicStyles.avatarContainer}>
          <View style={dynamicStyles.aiAvatar}>
            <Bot color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} size={16} />
          </View>
        </View>
      )}
      
      <View style={[
        dynamicStyles.messageBubble,
        message.isUser ? dynamicStyles.userBubble : dynamicStyles.aiBubble,
      ]}>
        <Text style={[
          dynamicStyles.messageText,
          message.isUser ? dynamicStyles.userText : dynamicStyles.aiText,
        ]}>
          {message.text}
        </Text>
        
        <View style={dynamicStyles.messageFooter}>
          <Text style={dynamicStyles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          {getStatusIcon()}
        </View>
      </View>
      
      {message.isUser && (
         <View style={dynamicStyles.avatarContainer}>
            {/* User avatar can be added here if desired */}
         </View>
      )}
    </Animated.View>
  );
}

const getDynamicStyles = (theme: 'light' | 'dark', messageIsUser: boolean) => StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    alignItems: 'center',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: theme === 'dark' ? '#4F46E5' : '#1E40AF',
    borderBottomRightRadius: 6,
    marginLeft: 36, 
  },
  aiBubble: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderBottomLeftRadius: 6,
    marginRight: 8, 
    shadowColor: theme === 'dark' ? '#000000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme === 'dark' ? 0.25 : 0.1,
    shadowRadius: 2,
    elevation: theme === 'dark' ? 2 : 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: theme === 'dark' ? '#E2E8F0' : '#0F172A',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 11,
    // Correctly set timestamp color based on theme and whether it's a user message
    color: messageIsUser 
           ? (theme === 'dark' ? '#A5B4FC' : '#A5B4FC') 
           : (theme === 'dark' ? '#64748B' : '#94A3B8'),
    marginRight: messageIsUser && Platform.OS === 'android' ? 4 : (messageIsUser && Platform.OS === 'ios' ? 2 : 0), // Adjusted margin for status icon
  },
  statusIcon: {
    // color for status icon (Check, CheckCheck, Clock)
    color: theme === 'dark' ? '#A5B4FC' : '#A5B4FC',
    marginLeft: Platform.OS === 'android' ? 2 : 4, // Adjusted margin for status icon
  },
  statusIconError: {
    // color for error status icon (AlertTriangle)
    color: theme === 'dark' ? '#FCA5A5' : '#EF4444',
  }
});