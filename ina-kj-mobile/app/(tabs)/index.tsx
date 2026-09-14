import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../src/api/client';
import { COLORS } from '../../src/constants/config';
import { useState } from 'react';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [q, setQ] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => productsApi.list({ limit: 8, status: 'approved' }),
  });

  const products = data?.data ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{t('appName')}</Text>
        <Text style={styles.heroSub}>{t('tagline')}</Text>
        <View style={styles.langRow}>
          <Pressable
            onPress={() => i18n.changeLanguage('om')}
            style={[styles.langBtn, i18n.language === 'om' && styles.langActive]}
          >
            <Text style={styles.langText}>OM</Text>
          </Pressable>
          <Pressable
            onPress={() => i18n.changeLanguage('en')}
            style={[styles.langBtn, i18n.language === 'en' && styles.langActive]}
          >
            <Text style={styles.langText}>EN</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder={t('search')}
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() =>
            router.push({ pathname: '/(tabs)/market', params: { q } })
          }
          style={styles.searchInput}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {i18n.language === 'om' ? 'Oomisha Filatamoo' : 'Featured Products'}
          </Text>
          <Link href="/(tabs)/market" style={styles.link}>
            {i18n.language === 'om' ? 'Hunda →' : 'See all →'}
          </Link>
        </View>

        {isLoading && <ActivityIndicator color={COLORS.primary} />}

        {!isLoading && products.length === 0 && (
          <Text style={styles.empty}>{t('noProducts')}</Text>
        )}

        {products.map((p) => (
          <Pressable
            key={p.id}
            style={styles.card}
            onPress={() => router.push(`/product/${p.id}`)}
          >
            <View style={styles.cardIcon}>
              <Text style={{ fontSize: 28 }}>🌿</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={styles.cardMeta}>
                {p.location || '—'}
                {p.seller?.isVerified ? ` · ✓ ${t('verified')}` : ''}
              </Text>
              <Text style={styles.cardPrice}>
                {Number(p.priceEtb).toLocaleString()} ETB/{p.unit}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 12,
  },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.9)', marginTop: 6, fontSize: 13 },
  langRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  langActive: { backgroundColor: '#fff' },
  langText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  searchBox: { padding: 16, marginTop: -8 },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 15,
  },
  section: { paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  link: { color: COLORS.primary, fontWeight: '600' },
  empty: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    alignItems: 'center',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontWeight: '700', fontSize: 15, color: COLORS.text },
  cardMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cardPrice: {
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
    fontSize: 15,
  },
});
