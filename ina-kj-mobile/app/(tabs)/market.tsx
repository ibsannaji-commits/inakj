import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { productsApi } from '../../src/api/client';
import { COLORS } from '../../src/constants/config';

export default function MarketScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = useState(params.q || '');

  useEffect(() => {
    if (params.q) setQ(params.q);
  }, [params.q]);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['products', 'market', q],
    queryFn: () =>
      productsApi.list({
        limit: 30,
        status: 'approved',
        ...(q ? { q } : {}),
      }),
  });

  const products = data?.data ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder={t('search')}
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() => refetch()}
          placeholderTextColor={COLORS.textSecondary}
        />
        <Pressable style={styles.searchBtn} onPress={() => refetch()}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>🔍</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.empty}>{t('noProducts')}</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View style={styles.icon}>
                <Text style={{ fontSize: 26 }}>🌾</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.meta}>
                  {item.grade ? `${item.grade} · ` : ''}
                  {item.location || '—'}
                </Text>
                <Text style={styles.price}>
                  {Number(item.priceEtb).toLocaleString()} ETB/{item.unit}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '700', fontSize: 15 },
  meta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  price: { fontWeight: '800', color: COLORS.primary, marginTop: 4 },
});
