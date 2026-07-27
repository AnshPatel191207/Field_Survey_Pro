import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function QuickActionCards() {
  const { colors: Colors } = useTheme();
  const actions: { label: string; icon: keyof typeof Ionicons.glyphMap; route: string; color: string }[] = [
    { label: 'New Survey', icon: 'add-circle-outline', route: '/(tabs)/new-survey', color: Colors.primary },
    { label: 'Camera', icon: 'camera-outline', route: '/camera', color: '#FF6B6B' },
    { label: 'Location', icon: 'location-outline', route: '/location', color: '#4ECDC4' },
    { label: 'Contacts', icon: 'people-outline', route: '/contacts', color: '#FFB347' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: Colors.text }]}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: action.color + '15' },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push(action.route)}
          >
            <View style={[styles.iconWrap, { backgroundColor: action.color + '25' }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={[styles.label, { color: action.color }]}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
