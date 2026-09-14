import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/store/auth';
import { COLORS } from '../../src/constants/config';

export default function LoginScreen() {
  const { t } = useTranslation();
  const login = useAuth((s) => s.login);
  const loading = useAuth((s) => s.loading);
  const [phone, setPhone] = useState('+251');
  const [password, setPassword] = useState('');

  async function onSubmit() {
    try {
      await login(phone.trim(), password);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Login failed');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>{t('login')}</Text>
      <Text style={styles.label}>{t('phone')}</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <Text style={styles.label}>{t('password')}</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{t('login')}</Text>
        )}
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>{t('register')}</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 24,
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 24, color: COLORS.primary },
  label: { fontWeight: '600', marginBottom: 6, color: COLORS.text },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
