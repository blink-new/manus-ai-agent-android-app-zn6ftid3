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
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Send, Bot } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { MessageBubble } from '@/components/MessageBubble';
import { useLocalSearchParams } from 'expo-router';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
}

export default function ChatScreen() {
  const { theme } = useTheme();
  const { t, locale } = useI18n();
  const params = useLocalSearchParams<{ prefill?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState(params.prefill || '');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: t('initialGreeting'),
        isUser: false,
        timestamp: new Date(),
        status: 'delivered',
      },
    ]);
  }, [t]);

  useEffect(() => {
    if (params.prefill) {
      // This is a bit of a hack for expo-router, ideally, you'd navigate without the param
      // For now, we just ensure it doesn't re-trigger if the component re-renders with same params
    }
  }, [params.prefill]);

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
      setIsAiTyping(true);

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(userMessage.text),
          isUser: false,
          timestamp: new Date(),
          status: 'delivered',
        };
        setMessages(prev => prev.map(msg => msg.id === userMessage.id ? {...msg, status: 'delivered'} : msg));
        setMessages(prev => [...prev, aiResponse]);
        setIsAiTyping(false);
      }, 1500 + Math.random() * 1000);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes(t('hello').toLowerCase()) || lowerInput.includes(t('hi').toLowerCase())) {
      return t('responseHello');
    }
    if (lowerInput.includes(t('howAreYou').toLowerCase())) {
      return t('responseHowAreYou');
    }
    if (lowerInput.includes(t('thank').toLowerCase())) {
      return t('responseThankYou');
    }
    if (lowerInput.includes(t('help').toLowerCase()) || lowerInput.includes(t('assist').toLowerCase())){
        return t('responseHelp');
    }
    const responses = [
      t('genericResponse1'),
      t('genericResponse2'),
      t('genericResponse3'),
      t('genericResponse4'),
      t('genericResponse5'),
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble message={item} index={index} />
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const dynamicStyles = getDynamicStyles(theme, locale);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Animated.View
        style={dynamicStyles.header}
        entering={FadeInUp.duration(400)}
      >
        <View style={dynamicStyles.headerContent}>
          <View style={[dynamicStyles.statusIndicator, isAiTyping && dynamicStyles.typingIndicator]} />
          <Text style={dynamicStyles.headerTitle}>{t('manusAI')}</Text>
          <Text style={dynamicStyles.headerSubtitle}>{isAiTyping ? t('typing') : t('online')}</Text>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        style={dynamicStyles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? (Platform.Version > '10' ? 90 : 60) : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={dynamicStyles.messagesList}
          contentContainerStyle={dynamicStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isAiTyping ? (
              <View style={dynamicStyles.typingBubbleContainer}>
                <View style={dynamicStyles.aiAvatarSmall}>
                  <Bot color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} size={14} />
                </View>
                <View style={dynamicStyles.typingBubble}>
                  <ActivityIndicator size="small" color={theme === 'dark' ? '#A5B4FC' : '#1E40AF'} />
                </View>
              </View>
            ) : null
          }
        />

        <View style={dynamicStyles.inputContainer}>
          <View style={dynamicStyles.inputWrapper}>
            <TextInput
              style={dynamicStyles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t('typeYourMessage')}
              placeholderTextColor={theme === 'dark' ? '#64748B' : '#94A3B8'}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
              textAlign={locale === 'ar' ? 'right' : 'left'}
            />
            <TouchableOpacity
              style={[dynamicStyles.sendButton, inputText.trim() ? dynamicStyles.sendButtonActive : null]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isAiTyping}
            >
              <Send
                color={inputText.trim() && !isAiTyping ? (theme === 'dark' ? '#0F172A' : '#FFFFFF') : (theme === 'dark' ? '#475569' : '#94A3B8')}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
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
  typingIndicator: {
    backgroundColor: '#F59E0B',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  messagesContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  inputWrapper: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    backgroundColor: theme === 'dark' ? '#0F172A' : '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme === 'dark' ? '#E2E8F0' : '#0F172A',
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    writingDirection: locale === 'ar' ? 'rtl' : 'ltr',
  },
  sendButton: {
    marginLeft: locale === 'ar' ? 0 : 12,
    marginRight: locale === 'ar' ? 12 : 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  sendButtonActive: {
    backgroundColor: theme === 'dark' ? '#A5B4FC' : '#1E40AF',
  },
  typingBubbleContainer: {
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ scaleX: locale === 'ar' ? -1 : 1 }],
  },
  aiAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme === 'dark' ? '#334155' : '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: locale === 'ar' ? 0 : 8,
    marginLeft: locale === 'ar' ? 8 : 0,
  },
  typingBubble: {
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomLeftRadius: locale === 'ar' ? 16 : 4,
    borderBottomRightRadius: locale === 'ar' ? 4 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});