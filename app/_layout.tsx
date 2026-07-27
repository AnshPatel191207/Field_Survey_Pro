import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SurveyProvider } from '../context/SurveyContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Drawer
        screenOptions={{
          drawerStyle: { backgroundColor: colors.card, width: 280 },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.text,
          drawerLabelStyle: { fontSize: 16, fontWeight: '500' },
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Dashboard',
            drawerLabel: 'Dashboard',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="camera"
          options={{
            title: 'Camera',
            drawerLabel: 'Camera',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="camera-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="contacts"
          options={{
            title: 'Contacts',
            drawerLabel: 'Contacts',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="location"
          options={{
            title: 'Location',
            drawerLabel: 'Location',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="clipboard"
          options={{
            title: 'Clipboard',
            drawerLabel: 'Clipboard',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="survey-preview"
          options={{
            title: 'Survey Preview',
            drawerLabel: 'Survey',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerLabel: 'Settings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="survey-details/[id]"
          options={{
            title: 'Survey Details',
            drawerLabel: 'Survey Details',
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SurveyProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </SurveyProvider>
    </SafeAreaProvider>
  );
}
