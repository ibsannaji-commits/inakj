import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCart } from '../src/store/cart';
import { useAuth } from '../src/store/auth';
import { ordersApi } from '../src/api/client';
import { COLORS } from '../src/constants/config';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const { items, total, clear } = useCart();
  const user = useAuth((s) => s.user);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [loading, setLoading] = useState(false);

  async function placeOrder() {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Cart empty');
      return;
    }
    setLoading(true);
    try {
      const { data } = await ordersApi.create({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        deliveryMethod: 'platform',
        deliveryAddress: {
          fullName: user.fullName,
          phone: user.phone,
          address,
          city,
        },
        paymentMethod: 'telebirr',
      });
      clear();
      Alert.alert(
        'OK',
        `Order ${data.orderNumber} created. Total: ${Number(data.total).toLocaleString()} ETB`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/orders') }]
      );
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Order failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('checkout')}</Text>
      <Text style={styles.total}>
        {t('total')}: {total.toLocaleString()} ETB
      </Text>
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Bole, ..."
      />
      <Text style={styles.label}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Pressable
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={placeOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{t('pay')} / Place order</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: COLORS.bg, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
  },
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
    marginTop: 12,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
