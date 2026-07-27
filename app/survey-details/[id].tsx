import { ScrollView, View, Text, Image, StyleSheet, Pressable, Alert, Platform, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSurveys } from '../../context/SurveyContext';

export default function SurveyDetails() {
  const { colors: Colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { getSurveyById, submitSurvey, deleteSurvey, setCurrentSurvey } = useSurveys();
  const survey = getSurveyById(id);

  if (!survey) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textLight} />
        <Text style={[styles.emptyTitle, { color: Colors.textSecondary }]}>Survey Not Found</Text>
        <Pressable style={[styles.backBtn, { backgroundColor: Colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
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

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(message)) onConfirm();
    } else {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: onConfirm },
      ]);
    }
  };

  const handleSubmit = () => {
    confirmAction('Submit Survey', 'Submit this survey?', () => {
      submitSurvey(survey.id);
      if (Platform.OS === 'web') window.alert('Survey submitted!');
      else Alert.alert('Success', 'Survey submitted!');
    });
  };

  const handleDelete = () => {
    confirmAction('Delete Survey', `Delete "${survey.siteName}"? This cannot be undone.`, () => {
      deleteSurvey(survey.id);
      router.back();
    });
  };

  const handleShare = async () => {
    const shareData = {
      message: `Survey: ${survey.siteName}\nClient: ${survey.clientName}\nDate: ${survey.date}\nStatus: ${survey.status}\nPriority: ${survey.priority}\nID: ${survey.id}`,
    };
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(shareData.message);
      window.alert('Survey details copied to clipboard');
    } else {
      try { await Share.share(shareData); } catch {}
    }
  };

  const handleEdit = () => {
    setCurrentSurvey(survey);
    router.push('/(tabs)/new-survey');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.banner, { backgroundColor: Colors.primary }]}>
        <View style={styles.bannerTop}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(survey.priority) + '20' }]}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(survey.priority) }]} />
            <Text style={[styles.priorityText, { color: getPriorityColor(survey.priority) }]}>
              {survey.priority?.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statusBadge, {
            backgroundColor: survey.status === 'submitted' ? Colors.success + '20' : Colors.warning + '20',
          }]}>
            <Text style={[styles.statusText, {
              color: survey.status === 'submitted' ? Colors.success : Colors.warning,
            }]}>
              {survey.status === 'submitted' ? 'Submitted' : 'Pending'}
            </Text>
          </View>
        </View>
        <Text style={styles.bannerTitle}>{survey.siteName}</Text>
        <Text style={styles.bannerSubtitle}>{survey.clientName}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: Colors.card }]}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Details</Text>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Date:</Text>
          <Text style={[styles.detailValue, { color: Colors.text }]}>{survey.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Description:</Text>
          <Text style={[styles.detailValue, { color: Colors.text }]}>{survey.description}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="finger-print-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Survey ID:</Text>
          <Text style={[styles.detailValue, { color: Colors.text }]}>{survey.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Created:</Text>
          <Text style={[styles.detailValue, { color: Colors.text }]}>{new Date(survey.createdAt).toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.textSecondary} />
          <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Status:</Text>
          <Text style={[styles.detailValue, { color: Colors.text }]}>{survey.status}</Text>
        </View>
      </View>

      {survey.photo && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Site Photo</Text>
          <Image source={{ uri: survey.photo.uri }} style={styles.photo} />
          {survey.photo.capturedAt && (
            <Text style={[styles.captureTime, { color: Colors.textLight }]}>Captured: {survey.photo.capturedAt}</Text>
          )}
        </View>
      )}

      {survey.contact && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Contact</Text>
          <View style={styles.contactCard}>
            <View style={[styles.contactAvatar, { backgroundColor: Colors.primaryLight }]}>
              <Text style={[styles.contactInitials, { color: Colors.primary }]}>
                {survey.contact.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={[styles.contactName, { color: Colors.text }]}>{survey.contact.name}</Text>
              <Text style={[styles.contactValue, { color: Colors.textSecondary }]}>
                {survey.contact.phone || 'No Number'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {survey.location && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Location</Text>
          <View style={styles.locationCard}>
            <Ionicons name="location" size={20} color={Colors.danger} />
            <View>
              <Text style={[styles.coordText, { color: Colors.text }]}>
                {survey.location.latitude?.toFixed(6)}, {survey.location.longitude?.toFixed(6)}
              </Text>
              {survey.location.accuracy && (
                <Text style={[styles.accuracyText, { color: Colors.textSecondary }]}>Accuracy: {survey.location.accuracy?.toFixed(1)}m</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {survey.notes && (
        <View style={[styles.section, { backgroundColor: Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Notes</Text>
          <View style={[styles.notesCard, { backgroundColor: Colors.background }]}>
            <Text style={[styles.notesText, { color: Colors.text }]}>{survey.notes}</Text>
          </View>
        </View>
      )}

      <View style={styles.btnRow}>
        <Pressable style={[styles.editBtn, { borderColor: Colors.primary }]} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
          <Text style={[styles.editText, { color: Colors.primary }]}>Edit</Text>
        </Pressable>
        <Pressable style={[styles.shareBtn, { borderColor: Colors.primary }]} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={Colors.primary} />
          <Text style={[styles.shareText, { color: Colors.primary }]}>Share</Text>
        </Pressable>
        {survey.status !== 'submitted' && (
          <Pressable style={[styles.submitBtn, { backgroundColor: Colors.success }]} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        )}
        <Pressable style={[styles.deleteActionBtn, { borderColor: Colors.danger }]} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          <Text style={[styles.deleteText, { color: Colors.danger }]}>Delete</Text>
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
    gap: 12,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
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
  bannerTop: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
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
    gap: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  detailValue: {
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
  contactValue: {
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
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 14,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
