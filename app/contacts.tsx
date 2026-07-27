import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, TextInput, Alert,
  ActivityIndicator, RefreshControl, Platform,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useSurveys } from '../context/SurveyContext';

export default function ContactsScreen() {
  const { colors: Colors } = useTheme();
  const [permission, setPermission] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { setCurrentSurvey, currentSurvey } = useSurveys();

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setPermission(status === 'granted');
    if (status === 'granted') {
      fetchContacts();
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      });
      setContacts(data);
    } catch (err) {
      if (Platform.OS === 'web') { window.alert('Failed to fetch contacts'); }
      else { Alert.alert('Error', 'Failed to fetch contacts'); }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, []);

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const copyNumber = async (phone) => {
    const number = phone?.replace(/[\s\-\(\)]/g, '');
    if (number) {
      await Clipboard.setStringAsync(number);
      if (Platform.OS === 'web') { window.alert('Contact number copied to clipboard'); }
      else { Alert.alert('Copied!', 'Contact number copied to clipboard'); }
    }
  };

  const selectContact = (contact) => {
    const phone = contact.phoneNumbers?.[0]?.digits || null;
    setCurrentSurvey({
      ...(currentSurvey || {}),
      contact: {
        name: contact.name,
        phone,
        id: contact.id,
      },
    });
    if (Platform.OS === 'web') { window.alert(`${contact.name} added to survey`); }
    else { Alert.alert('Selected', `${contact.name} added to survey`); }
    router.back();
  };

  if (permission === null) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textLight} />
        <Text style={[styles.permissionText, { color: Colors.textSecondary }]}>Contacts permission is required</Text>
        <Pressable style={[styles.permissionBtn, { backgroundColor: Colors.primary }]} onPress={requestContactsPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: Colors.text }]}
          placeholder="Search contacts..."
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

      <View style={styles.counterRow}>
        <Text style={[styles.counterText, { color: Colors.textSecondary }]}>
          {search.length > 0
            ? `${filteredContacts.length} of ${contacts.length} contacts`
            : `${contacts.length} contacts`}
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={[styles.center, { backgroundColor: Colors.background }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={Colors.textLight} />
          <Text style={[styles.emptyTitle, { color: Colors.textSecondary }]}>
            {search.length > 0 ? 'No contacts found' : 'No contacts available'}
          </Text>
          <Text style={[styles.emptySubtext, { color: Colors.textLight }]}>
            {search.length > 0
              ? 'Try a different search term'
              : 'Pull to refresh or grant contact access'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          renderItem={({ item }) => {
            const phone = item.phoneNumbers?.[0];
            return (
              <Pressable
                style={[styles.contactItem, { backgroundColor: Colors.card }]}
                onPress={() => selectContact(item)}
              >
                <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: Colors.primary }]}>{getInitials(item.name)}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: Colors.text }]} numberOfLines={1}>{item.name}</Text>
                  {phone ? (
                    <Text style={[styles.contactPhone, { color: Colors.textSecondary }]}>{phone.number}</Text>
                  ) : (
                    <Text style={[styles.noNumber, { color: Colors.textLight }]}>No Number</Text>
                  )}
                </View>
                {phone && (
                  <Pressable
                    style={styles.copyIcon}
                    onPress={() => copyNumber(phone.digits || phone.number)}
                  >
                    <Ionicons name="copy-outline" size={20} color={Colors.primary} />
                  </Pressable>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  permissionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  counterRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  counterText: {
    fontSize: 13,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.04)',
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  noNumber: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  copyIcon: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
});
