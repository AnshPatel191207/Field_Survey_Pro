import { View, Text, StyleSheet } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function AppHeader({ title }) {
  const { colors: Colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { backgroundColor: Colors.primary, paddingTop: insets.top + 8 }]}>
      <DrawerToggleButton tintColor="#FFFFFF" />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 34,
  },
});
