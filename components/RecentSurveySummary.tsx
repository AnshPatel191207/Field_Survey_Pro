import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useSurveys } from '../context/SurveyContext';

export default function RecentSurveySummary() {
  const { colors: Colors } = useTheme();
  const { surveys } = useSurveys();
  const recent = surveys.slice(0, 5);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textLight;
    }
  };

  if (surveys.length === 0) {
    return (
        <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Recent Surveys</Text>
        <View style={[styles.emptyState, { backgroundColor: Colors.card }]}>
          <Ionicons name="document-text-outline" size={40} color={Colors.textLight} />
          <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>No surveys yet</Text>
          <Text style={[styles.emptySubtext, { color: Colors.textLight }]}>Create your first survey to get started</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Recent Surveys</Text>
        <Pressable onPress={() => router.push('/(tabs)/history')}>
          <Text style={[styles.seeAll, { color: Colors.primary }]}>See All</Text>
        </Pressable>
      </View>
      <FlatList
        data={recent}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.item, { backgroundColor: Colors.card }]}
            onPress={() => router.push(`/survey-details/${item.id}`)}
          >
            <View style={styles.itemLeft}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
              <View style={styles.itemInfo}>
                <Text style={[styles.siteName, { color: Colors.text }]} numberOfLines={1}>{item.siteName}</Text>
                <Text style={[styles.clientName, { color: Colors.textSecondary }]} numberOfLines={1}>{item.clientName}</Text>
                <Text style={[styles.date, { color: Colors.textLight }]}>{item.date}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  itemInfo: {
    flex: 1,
  },
  siteName: {
    fontSize: 15,
    fontWeight: '600',
  },
  clientName: {
    fontSize: 13,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 16,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
  },
});
