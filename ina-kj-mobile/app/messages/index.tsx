import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/config';

export default function MessagesScreen() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>💬 Messages</Text>
      <Text style={styles.sub}>
        Connect Socket.io to ina-kj-api for realtime chat.
      </Text>
      <Text style={styles.code}>WS: join / message:new</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  sub: { color: COLORS.textSecondary, textAlign: 'center' },
  code: {
    marginTop: 16,
    fontFamily: 'monospace',
    color: COLORS.primary,
  },
});
