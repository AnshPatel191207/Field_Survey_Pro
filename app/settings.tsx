import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const modes = [
  { key: 'system', label: 'System Default', icon: 'settings-outline' as const },
  { key: 'light', label: 'Light Mode', icon: 'sunny-outline' as const },
  { key: 'dark', label: 'Dark Mode', icon: 'moon-outline' as const },
];

export default function Settings() {
  const { colors, mode, setMode, isDark } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <View style={styles.iconWrap}>
          <Ionicons name="settings-outline" size={48} color={'#FFFFFF'} />
        </View>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Field Survey Pro v1.0.0</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Theme</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Choose your preferred appearance</Text>
        {modes.map((m) => (
          <Pressable
            key={m.key}
            style={[
              styles.modeItem,
              { backgroundColor: colors.background, borderColor: colors.border },
              mode === m.key && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
            ]}
            onPress={() => setMode(m.key)}
          >
            <View style={[styles.modeIconWrap, {
              backgroundColor: mode === m.key ? colors.primary + '20' : colors.primaryLight,
            }]}>
              <Ionicons
                name={m.icon}
                size={22}
                color={mode === m.key ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={styles.modeInfo}>
              <Text style={[styles.modeLabel, { color: colors.text }]}>{m.label}</Text>
              {m.key === 'system' && (
                <Text style={[styles.modeHint, { color: colors.textLight }]}>
                  Currently: {isDark ? 'Dark' : 'Light'}
                </Text>
              )}
            </View>
            {mode === m.key && (
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>Ansh Patel</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>2210997067</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>B.E. CE - CodingGita x SU</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Info</Text>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.text }]}>React Native | Expo SDK 54</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="code-slash-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.text }]}>Smart Field Survey & Inspection App</Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconWrap: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.04)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  modeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeInfo: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  modeHint: {
    fontSize: 12,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
});
