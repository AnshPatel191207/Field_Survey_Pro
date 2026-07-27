import { useState, useCallback } from 'react';
import {
  ScrollView, View, Text, TextInput, StyleSheet, Pressable, Platform, Alert, Image, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSurveys } from '../../context/SurveyContext';

let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function NewSurvey() {
  const { colors: Colors } = useTheme();
  const { addSurvey, setCurrentSurvey, currentSurvey } = useSurveys();

  const priorities = [
    { label: 'Low', value: 'low', color: Colors.success },
    { label: 'Medium', value: 'medium', color: Colors.warning },
    { label: 'High', value: 'high', color: Colors.danger },
  ];

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [attachedContact, setAttachedContact] = useState(null);
  const [attachedLocation, setAttachedLocation] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (currentSurvey) {
        if (currentSurvey.photo && currentSurvey.photo.uri !== attachedPhoto?.uri) {
          setAttachedPhoto(currentSurvey.photo);
        }
        if (currentSurvey.contact && currentSurvey.contact.id !== attachedContact?.id) {
          setAttachedContact(currentSurvey.contact);
        }
        if (currentSurvey.location && currentSurvey.location.latitude !== attachedLocation?.latitude) {
          setAttachedLocation(currentSurvey.location);
        }
      }
    }, [currentSurvey])
  );

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const parseDate = (s: string) => {
    const d = new Date(s + 'T00:00:00');
    if (!isNaN(d.getTime())) setDate(d);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validate = () => {
    const errs: Record<string, string | null> = {};
    if (!siteName.trim()) errs.siteName = 'Site name is required';
    if (!clientName.trim()) errs.clientName = 'Client name is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!date) errs.date = 'Date is required';
    else if (date > today) errs.date = 'Future dates are not allowed';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAttachment = (screen: string) => {
    setCurrentSurvey({
      siteName: siteName.trim() || 'Untitled',
      clientName: clientName.trim() || 'Unknown',
      description: description.trim() || '',
      priority,
      date: formatDate(date),
      photo: attachedPhoto,
      contact: attachedContact,
      location: attachedLocation,
    });
    router.push(screen);
  };

  const handleReview = () => {
    if (!validate()) return;
    setShowPreview(true);
  };

  const handleConfirmCreate = () => {
    const survey = {
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date: formatDate(date),
      photo: attachedPhoto,
      contact: attachedContact,
      location: attachedLocation,
      notes: '',
    };
    const created = addSurvey(survey);
    setCurrentSurvey({ ...survey, id: created.id });
    setShowPreview(false);

    if (Platform.OS === 'web') {
      window.alert('Survey created successfully!');
      router.push('/survey-details/' + created.id);
    } else {
      Alert.alert('Success', 'Survey created successfully!', [
        { text: 'View Details', onPress: () => router.push('/survey-details/' + created.id) },
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const removeAttachment = (type: string) => {
    if (type === 'photo') setAttachedPhoto(null);
    if (type === 'contact') setAttachedContact(null);
    if (type === 'location') setAttachedLocation(null);
    setCurrentSurvey({ ...(currentSurvey || {}), [type]: null });
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textLight;
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={[styles.sectionCard, { backgroundColor: Colors.card }]}>
            <Text style={[styles.sectionCardTitle, { color: Colors.text }]}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.primary} /> Basic Information
            </Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: Colors.text }]}>Site Name <Text style={[styles.required, { color: Colors.danger }]}>*</Text></Text>
              <TextInput
                style={[styles.input, { backgroundColor: Colors.background, color: Colors.text, borderColor: errors.siteName ? Colors.danger : Colors.border }]}
                placeholder="Enter site name"
                placeholderTextColor={Colors.textLight}
                value={siteName}
                onChangeText={(t) => { setSiteName(t); setErrors((e) => ({ ...e, siteName: null })); }}
              />
              {errors.siteName && <Text style={[styles.errorText, { color: Colors.danger }]}>{errors.siteName}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: Colors.text }]}>Client Name <Text style={[styles.required, { color: Colors.danger }]}>*</Text></Text>
              <TextInput
                style={[styles.input, { backgroundColor: Colors.background, color: Colors.text, borderColor: errors.clientName ? Colors.danger : Colors.border }]}
                placeholder="Enter client name"
                placeholderTextColor={Colors.textLight}
                value={clientName}
                onChangeText={(t) => { setClientName(t); setErrors((e) => ({ ...e, clientName: null })); }}
              />
              {errors.clientName && <Text style={[styles.errorText, { color: Colors.danger }]}>{errors.clientName}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: Colors.text }]}>Description <Text style={[styles.required, { color: Colors.danger }]}>*</Text></Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: Colors.background, color: Colors.text, borderColor: errors.description ? Colors.danger : Colors.border }]}
                placeholder="Enter survey description"
                placeholderTextColor={Colors.textLight}
                value={description}
                onChangeText={(t) => { setDescription(t); setErrors((e) => ({ ...e, description: null })); }}
                multiline
                numberOfLines={4}
              />
              {errors.description && <Text style={[styles.errorText, { color: Colors.danger }]}>{errors.description}</Text>}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: Colors.card }]}>
            <Text style={[styles.sectionCardTitle, { color: Colors.text }]}>
              <Ionicons name="options-outline" size={18} color={Colors.primary} /> Configuration
            </Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: Colors.text }]}>Priority</Text>
              <View style={styles.priorityRow}>
                {priorities.map((p) => (
                  <Pressable
                    key={p.value}
                    style={[
                      styles.priorityBtn,
                      { borderColor: Colors.border, backgroundColor: Colors.background },
                      priority === p.value && { backgroundColor: p.color + '20', borderColor: p.color },
                    ]}
                    onPress={() => setPriority(p.value)}
                  >
                    <View style={[styles.prioDot, { backgroundColor: p.color }]} />
                    <Text style={[
                      styles.priorityText,
                      { color: Colors.textSecondary },
                      priority === p.value && { color: p.color, fontWeight: '600' },
                    ]}>{p.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: Colors.text }]}>Date <Text style={[styles.required, { color: Colors.danger }]}>*</Text></Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={formatDate(date)}
                  max={formatDate(new Date())}
                  onChange={(e) => { parseDate(e.target.value); setErrors((prev) => ({ ...prev, date: null })); }}
                  style={{
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    backgroundColor: Colors.background,
                    color: Colors.text,
                    borderColor: errors.date ? Colors.danger : Colors.border,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <>
                  <Pressable style={[styles.dateBtn, { backgroundColor: Colors.background, borderColor: Colors.border }]} onPress={() => setShowPicker(true)}>
                    <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                    <Text style={[styles.dateText, { color: Colors.text }]}>{formatDate(date)}</Text>
                  </Pressable>
                  {showPicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      maximumDate={new Date()}
                      onChange={onDateChange}
                    />
                  )}
                </>
              )}
              {errors.date && <Text style={[styles.errorText, { color: Colors.danger }]}>{errors.date}</Text>}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: Colors.card }]}>
            <Text style={[styles.sectionCardTitle, { color: Colors.text }]}>
              <Ionicons name="attach-outline" size={18} color={Colors.primary} /> Survey Attachments
            </Text>
            <Text style={[styles.sectionHint, { color: Colors.textLight }]}>Add photos, contacts, or location data</Text>

            <View style={styles.attachRow}>
              <Pressable
                style={[styles.attachBtn, { borderColor: attachedPhoto ? Colors.success : Colors.border, backgroundColor: Colors.background }]}
                onPress={() => openAttachment('/camera')}
              >
                <View style={[styles.attachIconWrap, { backgroundColor: attachedPhoto ? Colors.success + '20' : Colors.primaryLight }]}>
                  <Ionicons name="camera-outline" size={24} color={attachedPhoto ? Colors.success : Colors.primary} />
                </View>
                <Text style={[styles.attachLabel, { color: Colors.text }]}>Photo</Text>
                {attachedPhoto ? (
                  <View style={styles.attachStatus}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={[styles.attachStatusText, { color: Colors.success }]}>Added</Text>
                  </View>
                ) : (
                  <Text style={[styles.attachHint, { color: Colors.textLight }]}>Tap to add</Text>
                )}
              </Pressable>

              <Pressable
                style={[styles.attachBtn, { borderColor: attachedContact ? Colors.success : Colors.border, backgroundColor: Colors.background }]}
                onPress={() => openAttachment('/contacts')}
              >
                <View style={[styles.attachIconWrap, { backgroundColor: attachedContact ? Colors.success + '20' : Colors.primaryLight }]}>
                  <Ionicons name="people-outline" size={24} color={attachedContact ? Colors.success : Colors.primary} />
                </View>
                <Text style={[styles.attachLabel, { color: Colors.text }]}>Contact</Text>
                {attachedContact ? (
                  <View style={styles.attachStatus}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={[styles.attachStatusText, { color: Colors.success }]}>Added</Text>
                  </View>
                ) : (
                  <Text style={[styles.attachHint, { color: Colors.textLight }]}>Tap to add</Text>
                )}
              </Pressable>

              <Pressable
                style={[styles.attachBtn, { borderColor: attachedLocation ? Colors.success : Colors.border, backgroundColor: Colors.background }]}
                onPress={() => openAttachment('/location')}
              >
                <View style={[styles.attachIconWrap, { backgroundColor: attachedLocation ? Colors.success + '20' : Colors.primaryLight }]}>
                  <Ionicons name="location-outline" size={24} color={attachedLocation ? Colors.success : Colors.primary} />
                </View>
                <Text style={[styles.attachLabel, { color: Colors.text }]}>Location</Text>
                {attachedLocation ? (
                  <View style={styles.attachStatus}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={[styles.attachStatusText, { color: Colors.success }]}>Added</Text>
                  </View>
                ) : (
                  <Text style={[styles.attachHint, { color: Colors.textLight }]}>Tap to add</Text>
                )}
              </Pressable>
            </View>

            {(attachedPhoto || attachedContact || attachedLocation) && (
              <View style={styles.attachedSummary}>
                <Text style={[styles.attachedSummaryTitle, { color: Colors.textSecondary }]}>Attached Items:</Text>
                {attachedPhoto && (
                  <View style={styles.attachedItem}>
                    <Ionicons name="camera" size={16} color={Colors.primary} />
                    <Text style={[styles.attachedItemText, { color: Colors.text }]} numberOfLines={1}>Photo captured</Text>
                    <Pressable onPress={() => removeAttachment('photo')}>
                      <Ionicons name="close-circle" size={18} color={Colors.danger} />
                    </Pressable>
                  </View>
                )}
                {attachedContact && (
                  <View style={styles.attachedItem}>
                    <Ionicons name="person" size={16} color={Colors.primary} />
                    <Text style={[styles.attachedItemText, { color: Colors.text }]} numberOfLines={1}>{attachedContact.name}</Text>
                    <Pressable onPress={() => removeAttachment('contact')}>
                      <Ionicons name="close-circle" size={18} color={Colors.danger} />
                    </Pressable>
                  </View>
                )}
                {attachedLocation && (
                  <View style={styles.attachedItem}>
                    <Ionicons name="location" size={16} color={Colors.primary} />
                    <Text style={[styles.attachedItemText, { color: Colors.text }]} numberOfLines={1}>
                      {attachedLocation.latitude?.toFixed(4)}, {attachedLocation.longitude?.toFixed(4)}
                    </Text>
                    <Pressable onPress={() => removeAttachment('location')}>
                      <Ionicons name="close-circle" size={18} color={Colors.danger} />
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>

          <Pressable style={[styles.submitBtn, { backgroundColor: Colors.primary }]} onPress={handleReview}>
            <Ionicons name="eye-outline" size={20} color={'#FFFFFF'} />
            <Text style={[styles.submitText, { color: '#FFFFFF' }]}>Review & Create Survey</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showPreview} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: Colors.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: Colors.primary }]}>
              <View style={[styles.previewPriorityBadge, { backgroundColor: getPriorityColor(priority) + '25' }]}>
                <View style={[styles.prioDot, { backgroundColor: getPriorityColor(priority) }]} />
                <Text style={[styles.previewPriorityText, { color: getPriorityColor(priority) }]}>{priority.toUpperCase()}</Text>
              </View>
              <Text style={styles.modalTitle}>{siteName || 'Untitled Site'}</Text>
              <Text style={styles.modalSubtitle}>{clientName || 'Unknown Client'}</Text>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={[styles.previewSection, { backgroundColor: Colors.card }]}>
                <Text style={[styles.previewSectionTitle, { color: Colors.text }]}>
                  <Ionicons name="document-text-outline" size={16} color={Colors.primary} /> Details
                </Text>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: Colors.textSecondary }]}>Date</Text>
                  <Text style={[styles.previewValue, { color: Colors.text }]}>{formatDate(date)}</Text>
                </View>
                <View style={[styles.previewDivider, { backgroundColor: Colors.border }]} />
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: Colors.textSecondary }]}>Description</Text>
                  <Text style={[styles.previewValue, { color: Colors.text }]}>{description}</Text>
                </View>
              </View>

              {attachedPhoto && (
                <View style={[styles.previewSection, { backgroundColor: Colors.card }]}>
                  <Text style={[styles.previewSectionTitle, { color: Colors.text }]}>
                    <Ionicons name="camera-outline" size={16} color={Colors.primary} /> Photo
                  </Text>
                  <Image source={{ uri: attachedPhoto.uri }} style={styles.previewPhoto} resizeMode="cover" />
                  {attachedPhoto.capturedAt && (
                    <Text style={[styles.previewCaptureTime, { color: Colors.textLight }]}>Captured: {attachedPhoto.capturedAt}</Text>
                  )}
                </View>
              )}

              {attachedContact && (
                <View style={[styles.previewSection, { backgroundColor: Colors.card }]}>
                  <Text style={[styles.previewSectionTitle, { color: Colors.text }]}>
                    <Ionicons name="people-outline" size={16} color={Colors.primary} /> Contact
                  </Text>
                  <View style={styles.previewContactRow}>
                    <View style={[styles.previewAvatar, { backgroundColor: Colors.primaryLight }]}>
                      <Text style={[styles.previewAvatarText, { color: Colors.primary }]}>
                        {attachedContact.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.previewContactName, { color: Colors.text }]}>{attachedContact.name}</Text>
                      <Text style={[styles.previewContactPhone, { color: Colors.textSecondary }]}>{attachedContact.phone || 'No number'}</Text>
                    </View>
                  </View>
                </View>
              )}

              {attachedLocation && (
                <View style={[styles.previewSection, { backgroundColor: Colors.card }]}>
                  <Text style={[styles.previewSectionTitle, { color: Colors.text }]}>
                    <Ionicons name="location-outline" size={16} color={Colors.primary} /> Location
                  </Text>
                  <View style={styles.previewLocationRow}>
                    <Ionicons name="location" size={20} color={Colors.danger} />
                    <View>
                      <Text style={[styles.previewCoordText, { color: Colors.text }]}>
                        {attachedLocation.latitude?.toFixed(6)}, {attachedLocation.longitude?.toFixed(6)}
                      </Text>
                      {attachedLocation.accuracy && (
                        <Text style={[styles.previewAccuracyText, { color: Colors.textSecondary }]}>
                          Accuracy: {attachedLocation.accuracy?.toFixed(1)}m
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              )}

              {!attachedPhoto && !attachedContact && !attachedLocation && (
                <View style={[styles.previewSection, { backgroundColor: Colors.card }]}>
                  <Text style={[styles.previewNoData, { color: Colors.textLight }]}>
                    <Ionicons name="information-circle-outline" size={16} /> No attachments added. You can add them later.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.modalBtn, { borderColor: Colors.textLight }]}
                onPress={() => setShowPreview(false)}
              >
                <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
                <Text style={[styles.modalBtnText, { color: Colors.textSecondary }]}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalConfirmBtn, { backgroundColor: Colors.primary }]}
                onPress={handleConfirmCreate}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.modalConfirmText}>Confirm & Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
    elevation: 3,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: 13,
    marginTop: -10,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  prioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityText: {
    fontSize: 14,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 15,
  },
  attachRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  attachBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  attachIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  attachHint: {
    fontSize: 11,
  },
  attachStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  attachStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  attachedSummary: {
    marginTop: 8,
    gap: 6,
  },
  attachedSummaryTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  attachedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attachedItemText: {
    fontSize: 13,
    flex: 1,
  },
  submitBtn: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  previewPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  previewPriorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.85,
    marginTop: 4,
  },
  modalBody: {
    padding: 16,
  },
  previewSection: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.04)',
    elevation: 2,
  },
  previewSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '500',
    width: 80,
  },
  previewValue: {
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  previewDivider: {
    height: 1,
    marginVertical: 8,
  },
  previewPhoto: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  previewCaptureTime: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  previewContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  previewContactName: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewContactPhone: {
    fontSize: 12,
    marginTop: 1,
  },
  previewLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewCoordText: {
    fontSize: 13,
    fontWeight: '500',
  },
  previewAccuracyText: {
    fontSize: 11,
    marginTop: 1,
  },
  previewNoData: {
    fontSize: 13,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    borderWidth: 0,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
