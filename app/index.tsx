import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Send, Bot } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Manus, your AI assistant. I can help you with information gathering, data analysis, writing, coding, and much more. What would you like to work on today?',
      isUser: false,
      timestamp: new Date(),
      status: 'delivered',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
        status: 'sending',
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(userMessage.text),
          isUser: false,
          timestamp: new Date(),
          status: 'delivered',
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "I understand you need help with that. Let me analyze this step by step and provide you with a comprehensive solution.",
      "That's an interesting challenge! I'll break this down into manageable parts and walk you through the process.",
      "I can definitely assist you with this task. Let me gather the relevant information and provide you with detailed guidance.",
      "Great question! I'll use my capabilities to research this thoroughly and give you actionable insights.",
      "I'm on it! This falls right into my expertise area. Let me process this information and deliver exactly what you need.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Bot color="#1E40AF" size={18} />
        </View>
      )}
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(400)}
      >
        <View style={styles.headerContent}>
          <View style={styles.statusIndicator} />
          <Text style={styles.headerTitle}>Manus AI</Text>
          <Text style={styles.headerSubtitle}>AI Assistant</Text>
        </View>
      </Animated.View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Send color={inputText.trim() ? '#FFFFFF' : '#94A3B8'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
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
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#0F172A',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  sendButtonActive: {
    backgroundColor: '#1E40AF',
  },
});