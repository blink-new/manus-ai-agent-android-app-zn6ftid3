import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bot, User } from 'lucide-react-native';

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
  const getStatusColor = () => {
    switch (message.status) {
      case 'sending':
        return '#F59E0B';
      case 'sent':
        return '#3B82F6';
      case 'delivered':
        return '#10B981';
      case 'error':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!message.isUser && (
        <View style={styles.avatar}>
          <Bot color="#1E40AF" size={16} />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.aiText,
        ]}>
          {message.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          
          {message.status && message.isUser && (
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          )}
        </View>
      </View>
      
      {message.isUser && (
        <View style={styles.avatar}>
          <User color="#FFFFFF" size={16} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#1E40AF',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#0F172A',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
});