import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/store/auth';
import { COLORS } from '../../src/constants/config';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const register = useAuth((s) => s.register);
  const loading = useAuth((s) => s.loading);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [location, setLocation] = useState('');

  async function onSubmit() {
    try {
      await register({
        fullName: fullName.trim(),
        phone: phone.trim(),
        password,
        role,
        location: location || undefined,
      });
      router.replace('/(tabs)');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Register failed');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('register')}</Text>

      <View style={styles.roleRow}>
        <Pressable
          style={[styles.roleBtn, role === 'farmer' && styles.roleOn]}
          onPress={() => setRole('farmer')}
        >
          <Text>👨‍🌾 {t('farmer')}</Text>
        </Pressable>
        <Pressable
          style={[styles.roleBtn, role === 'buyer' && styles.roleOn]}
          onPress={() => setRole('buyer')}
        >
          <Text>🛒 {t('buyer')}</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>{t('fullName')}</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>{t('phone')}</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

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
          <Text style={styles.btnText}>{t('register')}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: COLORS.bg, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, color: COLORS.primary },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  roleOn: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
