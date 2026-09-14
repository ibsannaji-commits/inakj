import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/store/auth';
import { COLORS } from '../../src/constants/config';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{t('welcome')}</Text>
        <Pressable
          style={styles.btn}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.btnText}>{t('login')}</Text>
        </Pressable>
        <Pressable
          style={styles.btnOutline}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.btnOutlineText}>{t('register')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.avatar}>
          {user.role === 'farmer' ? '👨‍🌾' : '🛒'}
        </Text>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.meta}>
          {user.phone} · {user.role}
          {user.isVerified ? ` · ✓ ${t('verified')}` : ''}
        </Text>
      </View>

      <Pressable
        style={styles.row}
        onPress={() => router.push('/messages')}
      >
        <Text>💬 {t('messages')}</Text>
      </Pressable>

      {user.role === 'farmer' && (
        <Pressable
          style={styles.row}
          onPress={() => router.push('/farmer/add-product')}
        >
          <Text>
            ➕ {i18n.language === 'om' ? 'Oomisha dabali' : 'Add product'}
          </Text>
        </Pressable>
      )}

      <View style={styles.langRow}>
        <Pressable
          onPress={() => i18n.changeLanguage('om')}
          style={[styles.langBtn, i18n.language === 'om' && styles.langOn]}
        >
          <Text>OM</Text>
        </Pressable>
        <Pressable
          onPress={() => i18n.changeLanguage('en')}
          style={[styles.langBtn, i18n.language === 'en' && styles.langOn]}
        >
          <Text>EN</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.btn, { backgroundColor: COLORS.danger, marginTop: 24 }]}
        onPress={async () => {
          await logout();
        }}
      >
        <Text style={styles.btnText}>{t('logout')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.bg,
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  avatar: { fontSize: 48, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: '800' },
  meta: { color: COLORS.textSecondary, marginTop: 4 },
  row: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  langOn: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 160,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 160,
  },
  btnOutlineText: { color: COLORS.primary, fontWeight: '700' },
});
