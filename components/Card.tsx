import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bot, Sparkles } from 'lucide-react-native';

interface CardProps {
  title?: string;
  description?: string;
  onPress?: () => void;
}

export function Card({ 
  title = "Welcome to Manus AI", 
  description = "Your intelligent assistant for any task",
  onPress 
}: CardProps) {
  return (
    <Animated.View 
      style={styles.card}
      entering={FadeInDown.duration(400)}
    >
      <View style={styles.iconContainer}>
        <Bot color="#1E40AF" size={32} />
        <Sparkles color="#3B82F6" size={16} style={styles.sparkle} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {onPress && (
        <TouchableOpacity 
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});