import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import QuickActionCards from '../../components/QuickActionCards';
import RecentSurveySummary from '../../components/RecentSurveySummary';
import { useTheme } from '../../context/ThemeContext';
import { useSurveys } from '../../context/SurveyContext';

export default function Dashboard() {
  const { colors: Colors } = useTheme();
  const { surveys } = useSurveys();
  const today = new Date().toDateString();
  const todayCount = surveys.filter((s) => {
    const sDate = new Date(s.createdAt).toDateString();
    return sDate === today;
  }).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['left', 'right', 'bottom']}>
      <AppHeader title="Field Survey Pro" />
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.welcomeCard, { backgroundColor: Colors.primary }]}>
          <View style={styles.welcomeContent}>
            <Text style={[styles.greeting, { color: '#FFFFFF' }]}>Welcome back! 👋</Text>
            <Text style={[styles.studentName, { color: '#FFFFFF' }]}>Ansh Patel</Text>
            <Text style={[styles.studentInfo, { color: '#FFFFFF' }]}>B.Tech CSE | Roll No: 2210997067</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={64} color={Colors.primaryLight} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.card }]}>
            <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
            <Text style={[styles.statNumber, { color: Colors.text }]}>{todayCount}</Text>
            <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>Today's Surveys</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.card }]}>
            <Ionicons name="time" size={28} color={Colors.warning} />
            <Text style={[styles.statNumber, { color: Colors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>Total Surveys</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.card }]}>
            <Ionicons name="flag" size={28} color={Colors.primary} />
            <Text style={[styles.statNumber, { color: Colors.text }]}>{surveys.filter(s => s.status === 'submitted').length}</Text>
            <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>Submitted</Text>
          </View>
        </View>

        <QuickActionCards />
        <RecentSurveySummary />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  welcomeCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.9,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  studentInfo: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 4,
  },
  avatar: {
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
