import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function Profile() {
  const { colors: Colors } = useTheme();

  const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string; route: string; color: string }[] = [
    { icon: 'camera-outline', label: 'Camera', route: '/camera', color: '#FF6B6B' },
    { icon: 'people-outline', label: 'Contacts', route: '/contacts', color: '#FFB347' },
    { icon: 'location-outline', label: 'Location', route: '/location', color: '#4ECDC4' },
    { icon: 'clipboard-outline', label: 'Clipboard', route: '/clipboard', color: Colors.primary },
    { icon: 'document-text-outline', label: 'Survey Preview', route: '/survey-preview', color: '#9B59B6' },
    { icon: 'settings-outline', label: 'Settings', route: '/settings', color: '#95A5A6' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.profileCard, { backgroundColor: Colors.primary }]}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person-circle" size={80} color={Colors.primaryLight} />
        </View>
        <Text style={styles.name}>{'Ansh Patel'}</Text>
        <Text style={styles.rollNo}>{'Roll No: 2210997067'}</Text>
        <Text style={styles.branch}>{'B.E. Computer Engineering'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="school-outline" size={20} color={Colors.primary} />
            <Text style={styles.statText}>CodingGita x SU</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Quick Access</Text>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: Colors.card },
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => router.push(item.route)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, { color: Colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </Pressable>
        ))}
      </View>

      <View style={styles.appInfo}>
        <Text style={[styles.appName, { color: Colors.textLight }]}>Field Survey Pro v1.0.0</Text>
        <Text style={[styles.appDesc, { color: Colors.textLight }]}>React Native | Expo SDK 54</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  avatarLarge: {
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rollNo: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.85,
    marginTop: 4,
  },
  branch: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.75,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.04)',
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    gap: 4,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
  },
  appDesc: {
    fontSize: 12,
  },
});
