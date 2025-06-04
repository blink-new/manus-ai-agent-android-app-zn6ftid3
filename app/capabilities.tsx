import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
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
  Download,
  Upload,
  Zap,
  Brain,
} from 'lucide-react-native';

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'research' | 'development' | 'analysis' | 'automation';
}

const capabilities: Capability[] = [
  {
    id: '1',
    title: 'Information Research',
    description: 'Gather comprehensive data from multiple sources',
    icon: <Search color="#FFFFFF" size={24} />,
    color: '#3B82F6',
    category: 'research',
  },
  {
    id: '2',
    title: 'Data Analysis',
    description: 'Process and analyze complex datasets',
    icon: <BarChart3 color="#FFFFFF" size={24} />,
    color: '#8B5CF6',
    category: 'analysis',
  },
  {
    id: '3',
    title: 'Code Generation',
    description: 'Write and optimize code in multiple languages',
    icon: <Code color="#FFFFFF" size={24} />,
    color: '#10B981',
    category: 'development',
  },
  {
    id: '4',
    title: 'Content Writing',
    description: 'Create articles, reports, and documentation',
    icon: <FileText color="#FFFFFF" size={24} />,
    color: '#F59E0B',
    category: 'research',
  },
  {
    id: '5',
    title: 'Web Automation',
    description: 'Automate browser tasks and web interactions',
    icon: <Globe color="#FFFFFF" size={24} />,
    color: '#EF4444',
    category: 'automation',
  },
  {
    id: '6',
    title: 'Database Operations',
    description: 'Query, analyze, and manage databases',
    icon: <Database color="#FFFFFF" size={24} />,
    color: '#6366F1',
    category: 'development',
  },
  {
    id: '7',
    title: 'File Processing',
    description: 'Read, write, and manipulate various file formats',
    icon: <Upload color="#FFFFFF" size={24} />,
    color: '#14B8A6',
    category: 'automation',
  },
  {
    id: '8',
    title: 'System Integration',
    description: 'Connect and configure various tools and services',
    icon: <Settings color="#FFFFFF" size={24} />,
    color: '#84CC16',
    category: 'automation',
  },
];

const categories = [
  { key: 'research', label: 'Research & Analysis', icon: Brain },
  { key: 'development', label: 'Development', icon: Code },
  { key: 'analysis', label: 'Data Analysis', icon: BarChart3 },
  { key: 'automation', label: 'Automation', icon: Zap },
] as const;

export default function CapabilitiesScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('research');

  const filteredCapabilities = capabilities.filter(
    (capability) => capability.category === selectedCategory
  );

  const renderCapabilityCard = ({ item, index }: { item: Capability; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 100)}
      style={styles.capabilityCard}
    >
      <TouchableOpacity style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          {item.icon}
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        <View style={styles.cardArrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(400)}
      >
        <Text style={styles.headerTitle}>Capabilities</Text>
        <Text style={styles.headerSubtitle}>Explore what Manus AI can do for you</Text>
      </Animated.View>

      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <IconComponent 
                  color={selectedCategory === category.key ? '#FFFFFF' : '#64748B'} 
                  size={18} 
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.key && styles.categoryTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.capabilitiesGrid}>
          {filteredCapabilities.map((capability, index) => (
            <View key={capability.id}>
              {renderCapabilityCard({ item: capability, index })}
            </View>
          ))}
        </View>

        <Animated.View 
          style={styles.quickStartSection}
          entering={FadeInDown.duration(400).delay(600)}
        >
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Text style={styles.sectionDescription}>
            Get started quickly with these common workflows
          </Text>
          
          <View style={styles.quickStartCards}>
            <TouchableOpacity style={styles.quickStartCard}>
              <MessageSquare color="#1E40AF" size={20} />
              <Text style={styles.quickStartText}>Ask a Question</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickStartCard}>
              <Search color="#1E40AF" size={20} />
              <Text style={styles.quickStartText}>Research Topic</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickStartCard}>
              <Code color="#1E40AF" size={20} />
              <Text style={styles.quickStartText}>Generate Code</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
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
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  },
  categoryButtonActive: {
    backgroundColor: '#1E40AF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  capabilitiesGrid: {
    padding: 16,
  },
  capabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  cardArrow: {
    padding: 8,
  },
  arrowText: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '300',
  },
  quickStartSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  quickStartCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStartCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickStartText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    marginTop: 8,
    textAlign: 'center',
  },
});