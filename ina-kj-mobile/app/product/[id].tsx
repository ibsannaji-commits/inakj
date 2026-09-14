import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { productsApi } from '../../src/api/client';
import { useCart } from '../../src/store/cart';
import { COLORS } from '../../src/constants/config';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const add = useCart((s) => s.add);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(id!),
    enabled: !!id,
  });

  const p = data?.data;

  if (isLoading || !p) {
    return (
      <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
    );
  }

  function addCart() {
    add({
      productId: p!.id,
      name: p!.name,
      unitPrice: Number(p!.priceEtb),
      unit: p!.unit,
      sellerId: p!.seller?.id,
      quantity: 1,
    });
    Alert.alert('OK', t('addToCart'));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.hero}>
        <Text style={{ fontSize: 64 }}>🌿</Text>
      </View>
      <Text style={styles.title}>{p.name}</Text>
      <Text style={styles.price}>
        {Number(p.priceEtb).toLocaleString()} ETB/{p.unit}
      </Text>
      <Text style={styles.meta}>
        {p.location || '—'}
        {p.grade ? ` · Grade ${p.grade}` : ''}
      </Text>
      {p.seller && (
        <Text style={styles.seller}>
          {p.seller.fullName}
          {p.seller.isVerified ? ` · ✓ ${t('verified')}` : ''}
        </Text>
      )}
      {p.description ? (
        <Text style={styles.desc}>{p.description}</Text>
      ) : null}

      <Pressable style={styles.btn} onPress={addCart}>
        <Text style={styles.btnText}>{t('addToCart')}</Text>
      </Pressable>
      <Pressable
        style={[styles.btn, styles.btnOutline]}
        onPress={() => {
          addCart();
          router.push('/checkout');
        }}
      >
        <Text style={[styles.btnText, { color: COLORS.primary }]}>
          {t('buyNow')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: {
    height: 160,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800' },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 8,
  },
  meta: { color: COLORS.textSecondary, marginTop: 6 },
  seller: { marginTop: 8, fontWeight: '600' },
  desc: { marginTop: 16, lineHeight: 22, color: COLORS.textSecondary },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  btnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
