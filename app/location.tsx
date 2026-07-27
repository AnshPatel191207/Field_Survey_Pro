import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Platform,
} from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useSurveys } from '../context/SurveyContext';

export default function LocationScreen() {
  const { colors: Colors } = useTheme();
  const { setCurrentSurvey, currentSurvey } = useSurveys();
  const [permission, setPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status === 'granted');
    if (status === 'granted') {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (err) {
      if (Platform.OS === 'web') { window.alert('Failed to get location'); }
      else { Alert.alert('Error', 'Failed to get location'); }
    } finally {
      setLoading(false);
    }
  };

  const copyLocation = async () => {
    if (location) {
      const text = `${location.coords.latitude}, ${location.coords.longitude}`;
      await Clipboard.setStringAsync(text);
      if (Platform.OS === 'web') { window.alert('Location coordinates copied to clipboard'); }
      else { Alert.alert('Copied!', 'Location coordinates copied to clipboard'); }
    }
  };

  const saveLocation = () => {
    setCurrentSurvey({
      ...(currentSurvey || {}),
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
    });
    if (Platform.OS === 'web') { window.alert('Location saved to survey!'); }
    else { Alert.alert('Success', 'Location saved to survey!'); }
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
        <Text style={[styles.permissionText, { color: Colors.textSecondary }]}>Location permission is required</Text>
        <Pressable style={[styles.permissionBtn, { backgroundColor: Colors.primary }]} onPress={requestLocationPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.card, { backgroundColor: Colors.card }]}>
        <View style={[styles.headerIcon, { backgroundColor: Colors.primaryLight }]}>
          <Ionicons name="location" size={40} color={Colors.primary} />
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={[styles.loadingText, { color: Colors.textSecondary }]}>Fetching location...</Text>
          </View>
        ) : location ? (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: Colors.textSecondary }]}>Latitude</Text>
              <Text style={[styles.infoValue, { color: Colors.text }]}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: Colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: Colors.textSecondary }]}>Longitude</Text>
              <Text style={[styles.infoValue, { color: Colors.text }]}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: Colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: Colors.textSecondary }]}>Accuracy</Text>
              <Text style={[styles.infoValue, { color: Colors.text }]}>{location.coords.accuracy?.toFixed(1) ?? 'N/A'} m</Text>
            </View>
          </View>
        ) : (
          <Text style={[styles.noLocation, { color: Colors.textLight }]}>Unable to fetch location</Text>
        )}

        <View style={styles.btnGroup}>
          <Pressable style={[styles.refreshBtn, { borderColor: Colors.primary }]} onPress={getCurrentLocation}>
            <Ionicons name="refresh" size={20} color={Colors.primary} />
            <Text style={[styles.refreshText, { color: Colors.primary }]}>Refresh</Text>
          </Pressable>
          {location && (
            <>
              <Pressable style={[styles.copyBtn, { backgroundColor: Colors.primary }]} onPress={copyLocation}>
                <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
                <Text style={styles.copyText}>Copy Location</Text>
              </Pressable>
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.success }]} onPress={saveLocation}>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveText}>Save to Survey</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.10)',
    elevation: 4,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  loadingState: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
  },
  noLocation: {
    fontSize: 15,
    marginBottom: 20,
  },
  btnGroup: {
    width: '100%',
    gap: 10,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  refreshText: {
    fontSize: 15,
    fontWeight: '600',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  copyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
