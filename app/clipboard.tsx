import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView, Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSurveys } from '../context/SurveyContext';

export default function ClipboardScreen() {
  const { colors: Colors } = useTheme();
  const { surveys, currentSurvey } = useSurveys();
  const [notes, setNotes] = useState('');
  const [lastCopied, setLastCopied] = useState(null);

  useEffect(() => {
    checkClipboard();
  }, []);

  const checkClipboard = async () => {
    const content = await Clipboard.getStringAsync();
    if (content) {
      setLastCopied(content.slice(0, 50) + (content.length > 50 ? '...' : ''));
    }
  };

  const webAlert = (msg: string) => { if (Platform.OS === 'web') window.alert(msg); else Alert.alert('', msg); };

  const copySurveyId = async () => {
    if (currentSurvey?.id) {
      await Clipboard.setStringAsync(currentSurvey.id);
      setLastCopied(currentSurvey.id);
      webAlert(`Survey ID ${currentSurvey.id} copied`);
    } else {
      webAlert('Create a survey first');
    }
  };

  const copyContactNumber = async () => {
    if (currentSurvey?.contact?.phone) {
      await Clipboard.setStringAsync(currentSurvey.contact.phone);
      setLastCopied(currentSurvey.contact.phone);
      webAlert('Contact number copied');
    } else {
      webAlert('No contact saved in current survey');
    }
  };

  const copyLocation = async () => {
    if (currentSurvey?.location) {
      const text = `${currentSurvey.location.latitude}, ${currentSurvey.location.longitude}`;
      await Clipboard.setStringAsync(text);
      setLastCopied(text);
      webAlert('Location coordinates copied');
    } else {
      webAlert('No location saved in current survey');
    }
  };

  const pasteNotes = async () => {
    const content = await Clipboard.getStringAsync();
    if (content) {
      setNotes(content);
      webAlert('Clipboard content pasted to notes');
    } else {
      webAlert('Clipboard is empty');
    }
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setLastCopied(null);
    setNotes('');
    webAlert('Clipboard data cleared');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { backgroundColor: Colors.card }]}>
        <View style={[styles.headerIcon, { backgroundColor: Colors.primaryLight }]}>
          <Ionicons name="clipboard" size={36} color={Colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: Colors.text }]}>Clipboard Manager</Text>

        {lastCopied && (
          <View style={[styles.lastCopied, { backgroundColor: Colors.background }]}>
            <Ionicons name="time-outline" size={16} color={Colors.textLight} />
            <Text style={[styles.lastCopiedText, { color: Colors.textLight }]} numberOfLines={1}>Last: {lastCopied}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Quick Copy</Text>
        <View style={styles.btnGroup}>
          <Pressable style={[styles.copyBtn, { backgroundColor: Colors.primary }]} onPress={copySurveyId}>
            <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
            <Text style={styles.copyBtnText}>Copy Survey ID</Text>
          </Pressable>
          <Pressable style={[styles.copyBtn, { backgroundColor: Colors.primary }]} onPress={copyContactNumber}>
            <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
            <Text style={styles.copyBtnText}>Copy Contact No.</Text>
          </Pressable>
          <Pressable style={[styles.copyBtn, { backgroundColor: Colors.primary }]} onPress={copyLocation}>
            <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
            <Text style={styles.copyBtnText}>Copy Location</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Notes</Text>
        <TextInput
          style={[styles.notesInput, { backgroundColor: Colors.card, color: Colors.text, borderColor: Colors.border }]}
          placeholder="Paste or type notes here..."
          placeholderTextColor={Colors.textLight}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={5}
        />
        <View style={styles.notesActions}>
          <Pressable style={[styles.pasteBtn, { borderColor: Colors.primary }]} onPress={pasteNotes}>
            <Ionicons name="clipboard-outline" size={18} color={Colors.primary} />
            <Text style={[styles.pasteText, { color: Colors.primary }]}>Paste from Clipboard</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={[styles.clearBtn, { borderColor: Colors.danger }]} onPress={clearClipboard}>
        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
        <Text style={[styles.clearText, { color: Colors.danger }]}>Clear Clipboard Data</Text>
      </Pressable>

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
    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
    elevation: 3,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  lastCopied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lastCopiedText: {
    fontSize: 12,
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  btnGroup: {
    gap: 10,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  notesInput: {
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  notesActions: {
    marginTop: 8,
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  pasteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
