import { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, TextInput, Alert, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSurveys } from '../../context/SurveyContext';

export default function History() {
  const { colors: Colors } = useTheme();
  const { surveys, deleteSurvey } = useSurveys();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const priorities = [
    { label: 'All', value: 'all', color: Colors.primary },
    { label: 'High', value: 'high', color: Colors.danger },
    { label: 'Medium', value: 'medium', color: Colors.warning },
    { label: 'Low', value: 'low', color: Colors.success },
  ];

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.siteName?.toLowerCase().includes(search.toLowerCase()) ||
      s.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      s.id?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textLight;
    }
  };

  const handleDelete = (id: string, siteName: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete "${siteName}"?`);
      if (confirmed) deleteSurvey(id);
    } else {
      Alert.alert(
        'Delete Survey',
        `Are you sure you want to delete "${siteName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteSurvey(id),
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: Colors.text }]}
          placeholder="Search by site, client or ID..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textLight} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {priorities.map((p) => (
          <Pressable
            key={p.value}
            style={[
              styles.filterBtn,
              { borderColor: Colors.border, backgroundColor: Colors.card },
              filter === p.value && { backgroundColor: p.color + '20', borderColor: p.color },
            ]}
            onPress={() => setFilter(p.value)}
          >
            <Text style={[
              styles.filterText,
              { color: Colors.textSecondary },
              filter === p.value && { color: p.color, fontWeight: '600' },
            ]}>{p.label}</Text>
          </Pressable>
        ))}
      </View>

      {filteredSurveys.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color={Colors.textLight} />
          <Text style={[styles.emptyTitle, { color: Colors.textSecondary }]}>
            {surveys.length === 0 ? 'No surveys yet' : 'No matching surveys'}
          </Text>
          <Text style={[styles.emptySubtext, { color: Colors.textLight }]}>
            {surveys.length === 0
              ? 'Create your first survey to get started'
              : 'Try adjusting your search or filter'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.surveyItem, { backgroundColor: Colors.card }]}
              onPress={() => router.push(`/survey-details/${item.id}`)}
            >
              <View style={styles.itemHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
                  <Text style={[styles.priorityLabel, { color: getPriorityColor(item.priority) }]}>
                    {item.priority?.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: item.status === 'submitted' ? Colors.success + '15' : Colors.warning + '15',
                }]}>
                  <Text style={[styles.statusLabel, {
                    color: item.status === 'submitted' ? Colors.success : Colors.warning,
                  }]}>
                    {item.status === 'submitted' ? 'Submitted' : 'Pending'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.siteName, { color: Colors.text }]}>{item.siteName}</Text>
              <Text style={[styles.clientName, { color: Colors.textSecondary }]}>{item.clientName}</Text>

              <View style={styles.itemFooter}>
                <Text style={[styles.itemDate, { color: Colors.textLight }]}>{item.date}</Text>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id, item.siteName)}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  filterText: { fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  surveyItem: {
    borderRadius: 16, padding: 16, marginBottom: 10,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  priorityDot: { width: 7, height: 7, borderRadius: 4 },
  priorityLabel: { fontSize: 11, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusLabel: { fontSize: 11, fontWeight: '600' },
  siteName: { fontSize: 16, fontWeight: '600' },
  clientName: { fontSize: 14, marginTop: 2 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  itemDate: { fontSize: 12 },
  deleteBtn: { padding: 6 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});
