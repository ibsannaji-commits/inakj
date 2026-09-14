import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ordersApi } from '../../src/api/client';
import { useAuth } from '../../src/store/auth';
import { COLORS } from '../../src/constants/config';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list(),
    enabled: !!user,
  });

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>
          {t('login')} — orders
        </Text>
        <Pressable
          style={styles.btn}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.btnText}>{t('login')}</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading) {
    return (
      <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
    );
  }

  const orders = data?.data ?? [];

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16 }}
      refreshing={isRefetching}
      onRefresh={refetch}
      ListEmptyComponent={
        <Text style={styles.msg}>No orders yet</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.num}>{item.orderNumber}</Text>
          <Text style={styles.status}>
            {item.status} · {item.paymentStatus}
          </Text>
          <Text style={styles.total}>
            {Number(item.total).toLocaleString()} ETB
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: COLORS.bg,
  },
  msg: { color: COLORS.textSecondary, textAlign: 'center' },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  num: { fontWeight: '800', fontSize: 16 },
  status: { color: COLORS.textSecondary, marginTop: 4, textTransform: 'capitalize' },
  total: { color: COLORS.primary, fontWeight: '700', marginTop: 6 },
});
