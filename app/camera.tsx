import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, Pressable, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useSurveys } from '../context/SurveyContext';

export default function CameraScreen() {
  const { colors: Colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const { setCurrentSurvey, currentSurvey } = useSurveys();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.background }]}>
        <Ionicons name="videocam-off-outline" size={64} color={Colors.textLight} />
        <Text style={[styles.permissionText, { color: Colors.textSecondary }]}>Camera permission is required</Text>
        <Pressable style={[styles.permissionBtn, { backgroundColor: Colors.primary }]} onPress={requestPermission}>
          <Text style={[styles.permissionBtnText, { color: Colors.white }]}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        setPhoto(result.uri);
        setCaptureTime(new Date().toLocaleString());
      } catch (err) {
        if (Platform.OS === 'web') { window.alert('Failed to capture photo'); }
        else { Alert.alert('Error', 'Failed to capture photo'); }
      } finally {
        setLoading(false);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setCaptureTime(null);
  };

  const deletePhoto = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this photo?')) setPhoto(null);
    } else {
      Alert.alert(
        'Delete Photo',
        'Are you sure you want to delete this photo?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => setPhoto(null) },
        ]
      );
    }
  };

  const usePhoto = () => {
    setCurrentSurvey({ ...(currentSurvey || {}), photo: { uri: photo, capturedAt: captureTime } });
    if (Platform.OS === 'web') { window.alert('Photo saved to survey!'); }
    else { Alert.alert('Success', 'Photo saved to survey!'); }
    router.back();
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} resizeMode="contain" />
        <View style={styles.previewOverlay}>
          {captureTime && (
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={16} color={'#FFFFFF'} />
              <Text style={[styles.timeText, { color: '#FFFFFF' }]}>{captureTime}</Text>
            </View>
          )}
          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} onPress={retakePhoto}>
              <Ionicons name="camera-reverse-outline" size={24} color={'#FFFFFF'} />
              <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Retake</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.useBtn]} onPress={usePhoto}>
              <Ionicons name="checkmark-circle" size={24} color={'#FFFFFF'} />
              <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Use Photo</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={deletePhoto}>
              <Ionicons name="trash-outline" size={24} color={'#FFFFFF'} />
              <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setLoading(false)}
        onMountError={(err) => {
          if (Platform.OS === 'web') { window.alert('Camera Error: ' + err.message); }
          else { Alert.alert('Camera Error', err.message); }
        }}
      />
      {loading ? (
        <View style={[styles.loadingOverlay, { backgroundColor: Colors.black }]}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={[styles.loadingText, { color: Colors.white }]}>Opening camera...</Text>
        </View>
      ) : (
        <View style={styles.cameraOverlay}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={Colors.white} />
          </Pressable>
          <Pressable style={[styles.captureBtn, { borderColor: Colors.white }]} onPress={takePhoto}>
            <View style={[styles.captureInner, { backgroundColor: Colors.white }]} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
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
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 50,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 8,
  },
  captureBtn: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  preview: {
    flex: 1,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  useBtn: {
    backgroundColor: '#4CAF50CC',
  },
  deleteBtn: {
    backgroundColor: '#F44336CC',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
