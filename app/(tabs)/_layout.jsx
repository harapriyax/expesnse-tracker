import { Tabs, Redirect } from 'expo-router';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import {
  Wallet, MoreHorizontal
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme, useSettings } from '../../src/context/SettingsContext';

import Animated, { LinearTransition, FadeIn, FadeOut, Easing } from 'react-native-reanimated';

const APPLE_EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

function TabIcon({ icon: Icon, focused, label }) {
  return (
    <Animated.View layout={LinearTransition.duration(200).easing(APPLE_EASE)} style={styles.tabItem}>
      <Icon
        size={22}
        strokeWidth={focused ? 2.5 : 2}
        color={focused ? '#FFFFFF' : Colors.textDark.tertiary}
      />
      {focused && (
        <Animated.View 
          entering={FadeIn.duration(200).easing(APPLE_EASE)} 
          exiting={FadeOut.duration(150)}
          style={styles.activeDot} 
        />
      )}
    </Animated.View>
  );
}


export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user, authReady } = useAuth();
  const { colors, isDark } = useTheme();
  const { settings } = useSettings();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('spendwise_onboarding_complete').then(val => {
      setOnboardingDone(val === 'true');
    }).catch(() => setOnboardingDone(false));
  }, []);

  if (!authReady || onboardingDone === null) {
    return <View style={{ flex: 1, backgroundColor: colors.surface.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? '#111111' : Colors.slate.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderTopWidth: isDark ? 1 : 0,
          borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'transparent',
          height: 70 + insets.bottom,
          paddingTop: 12,
          paddingBottom: insets.bottom + 8,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: Colors.textDark.tertiary,
        animation: 'shift',
        freezeOnBlur: false,
        detachInactiveScreens: false,
        sceneStyle: { backgroundColor: '#000' },
      }}
      screenListeners={{
        tabPress: () => {
          const hapticsOn = settings?.hapticsEnabled ?? true;
          if (hapticsOn) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Wallet} focused={focused} label="Expenses" />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={MoreHorizontal} focused={focused} label="More" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
});
