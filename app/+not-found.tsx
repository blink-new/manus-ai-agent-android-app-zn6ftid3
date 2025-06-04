import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, I18nManager } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const { t, locale } = useI18n();
  const dynamicStyles = getDynamicStyles(theme, locale);

  return (
    <>
      <Stack.Screen options={{ title: t('oops') }} />
      <View style={dynamicStyles.container}>
        <AlertTriangle color={theme === 'dark' ? '#F87171' : '#EF4444'} size={64} />
        <Text style={dynamicStyles.title}>{t('screenNotExist')}</Text>
        <Link href="/" style={dynamicStyles.link}>
          <Text style={dynamicStyles.linkText}>{t('goToHomeScreen')}</Text>
        </Link>
      </View>
    </>
  );
}

const getDynamicStyles = (theme: 'light' | 'dark', locale: 'en' | 'ar') => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
    marginVertical: 20,
    textAlign: locale === 'ar' ? 'right' : 'left',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: theme === 'dark' ? '#A5B4FC' : '#1E40AF',
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginVertical: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
});