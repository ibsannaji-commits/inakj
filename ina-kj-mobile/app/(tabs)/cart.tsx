import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../src/constants/config';
import { useCart } from '../../src/store/cart';

export default function CartScreen() {
  const { t } = useTranslation();
  const { items, total, updateQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={{ fontSize: 48 }}>🛒</Text>
        <Text style={styles.emptyText}>{t('cart')} — empty</Text>
        <Pressable
          style={styles.btn}
          onPress={() => router.push('/(tabs)/market')}
        >
          <Text style={styles.btnText}>{t('market')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.productId} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.unitPrice.toLocaleString()} ETB × {item.quantity}
            </Text>
          </View>
          <View style={styles.qty}>
            <Pressable onPress={() => updateQty(item.productId, item.quantity - 1)}>
              <Text style={styles.qtyBtn}>−</Text>
            </Pressable>
            <Text style={styles.qtyVal}>{item.quantity}</Text>
            <Pressable onPress={() => updateQty(item.productId, item.quantity + 1)}>
              <Text style={styles.qtyBtn}>+</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => remove(item.productId)}>
            <Text style={{ color: COLORS.danger }}>✕</Text>
          </Pressable>
        </View>
      ))}
      <View style={styles.footer}>
        <Text style={styles.total}>
          {t('total')}: {total.toLocaleString()} ETB
        </Text>
        <Pressable
          style={styles.btn}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.btnText}>{t('checkout')} →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.bg,
  },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: { fontWeight: '700' },
  meta: { fontSize: 12, color: COLORS.textSecondary },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    paddingHorizontal: 8,
  },
  qtyVal: { fontWeight: '700', minWidth: 24, textAlign: 'center' },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  total: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 12 },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
