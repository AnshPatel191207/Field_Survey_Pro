import { ScrollView, View, Text, Image, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSurveys } from '../context/SurveyContext';

export default function SurveyPreview() {
  const { colors: Colors } = useTheme();
  const { currentSurvey, updateSurvey, submitSurvey } = useSurveys();

  if (!currentSurvey || !currentSurvey.id) {
    return (
      <View style={[styles.emptyState, { backgroundColor: Colors.background }]}>
        <Ionicons name="document-text-outline" size={64} color={Colors.textLight} />
        <Text style={[styles.emptyTitle, { color: Colors.textSecondary }]}>No Survey Selected</Text>
        <Text style={[styles.emptySubtext, { color: Colors.textLight }]}>Create a new survey first</Text>
        <Pressable style={[styles.createBtn, { backgroundColor: Colors.primary }]} onPress={() => router.push('/(tabs)/new-survey')}>
          <Text style={styles.createBtnText}>Create Survey</Text>
        </Pressable>
      </View>
    );
  }

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textLight;
    }
  };

  const handleSubmit = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to submit this survey?')) {
        submitSurvey(currentSurvey.id);
        window.alert('Survey submitted successfully!');
        router.push('/(tabs)/history');
      }
    } else {
      Alert.alert(
        'Submit Survey',
        'Are you sure you want to submit this survey?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              submitSurvey(currentSurvey.id);
              Alert.alert('Success', 'Survey submitted successfully!');
              router.push('/(tabs)/history');
            },
          },
        ]
      );
    }
  };

  const handleEdit = () => {
    router.push('/(tabs)/new-survey');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.banner, { backgroundColor: Colors.primary }]}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(currentSurvey.priority) + '20' }]}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(currentSurvey.priority) }]} />
          <Text style={[styles.priorityText, { color: getPriorityColor(currentSurvey.priority) }]}>
            {currentSurvey.priority?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.bannerTitle}>{currentSurvey.siteName}</Text>
        <Text style={styles.bannerSubtitle}>{currentSurvey.clientName}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: Colors.card }]}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Survey Details</Text>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailText, { color: Colors.text }]}>{currentSurvey.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailText, { color: Colors.text }]}>{currentSurvey.description}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="finger-print-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailText, { color: Colors.text }]}>ID: {currentSurvey.id}</Text>
        </View>
      </View>

      {currentSurvey.photo && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Site Photo</Text>
          <Image source={{ uri: currentSurvey.photo.uri }} style={styles.photo} />
          {currentSurvey.photo.capturedAt && (
            <Text style={[styles.captureTime, { color: Colors.textLight }]}>Captured: {currentSurvey.photo.capturedAt}</Text>
          )}
        </View>
      )}

      {currentSurvey.contact && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Contact</Text>
          <View style={styles.contactCard}>
            <View style={[styles.contactAvatar, { backgroundColor: Colors.primaryLight }]}>
              <Text style={[styles.contactInitials, { color: Colors.primary }]}>
                {currentSurvey.contact.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={[styles.contactName, { color: Colors.text }]}>{currentSurvey.contact.name}</Text>
              <Text style={[styles.contactPhone, { color: Colors.textSecondary }]}>
                {currentSurvey.contact.phone || 'No Number'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {currentSurvey.location && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Location</Text>
          <View style={styles.locationCard}>
            <Ionicons name="location" size={20} color={Colors.danger} />
            <View>
              <Text style={[styles.coordText, { color: Colors.text }]}>
                {currentSurvey.location.latitude?.toFixed(6)}, {currentSurvey.location.longitude?.toFixed(6)}
              </Text>
              {currentSurvey.location.accuracy && (
                <Text style={[styles.accuracyText, { color: Colors.textSecondary }]}>Accuracy: {currentSurvey.location.accuracy?.toFixed(1)}m</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {currentSurvey.notes && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Notes</Text>
          <View style={[styles.notesCard, { backgroundColor: Colors.background }]}>
            <Text style={[styles.notesText, { color: Colors.text }]}>{currentSurvey.notes}</Text>
          </View>
        </View>
      )}

      <View style={styles.btnRow}>
        <Pressable style={[styles.editBtn, { borderColor: Colors.primary }]} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
          <Text style={[styles.editText, { color: Colors.primary }]}>Edit Survey</Text>
        </Pressable>
        <Pressable style={[styles.submitBtn, { backgroundColor: Colors.success }]} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitText}>Submit Survey</Text>
        </Pressable>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
  },
  createBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  banner: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.85,
    marginTop: 4,
  },
  section: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.04)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  captureTime: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitials: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  accuracyText: {
    fontSize: 12,
    marginTop: 2,
  },
  notesCard: {
    borderRadius: 10,
    padding: 12,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  btnRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  editText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
