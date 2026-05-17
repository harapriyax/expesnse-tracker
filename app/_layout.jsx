import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts as useInter, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { useFonts as usePlusJakartaSans, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '../src/context/AppContext';
import { AuthProvider } from '../src/context/AuthContext';
import { SettingsProvider, useTheme } from '../src/context/SettingsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming, withSequence, runOnJS } from 'react-native-reanimated';
import ErrorBoundary from '../src/components/ui/ErrorBoundary';


SplashScreen.preventAutoHideAsync();

function AnimatedSplash({ onAnimationComplete }) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Premium spring entrance
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 14, stiffness: 100 });
    
    // Anticipation shrink followed by massive explosive zoom out
    scale.value = withDelay(
      1200, 
      withSequence(
        withTiming(0.85, { duration: 350 }),
        withTiming(20, { duration: 800 })
      )
    );

    // Fade out the icon mid-zoom
    opacity.value = withDelay(
      1550,
      withTiming(0, { duration: 300 })
    );

    // Fade out the background
    containerOpacity.value = withDelay(
      1650, 
      withTiming(0, { duration: 400 }, () => {
        runOnJS(onAnimationComplete)();
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }, containerStyle]} pointerEvents="none">
      <Animated.Image 
        source={require('../assets/images/icon.png')} 
        style={[{ width: 160, height: 160 }, animatedStyle]} 
        resizeMode="contain" 
      />
    </Animated.View>
  );
}

function InnerLayout() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' }, animation: 'slide_from_right', animationDuration: 400, detachInactiveScreens: false }}>
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ animation: 'fade' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right', animationDuration: 350 }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [interLoaded] = useInter({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
  });
  const [jakartaLoaded] = usePlusJakartaSans({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  
  const [isAppReady, setAppReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  const fontsLoaded = interLoaded && jakartaLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then(() => {
        setAppReady(true);
      });
    }
  }, [fontsLoaded]);

  if (!isAppReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider>
            <SettingsProvider>
              <AppProvider>
                <View style={{ flex: 1 }}>
                  <InnerLayout />
                  {showAnimatedSplash && (
                    <AnimatedSplash onAnimationComplete={() => setShowAnimatedSplash(false)} />
                  )}
                </View>
              </AppProvider>
            </SettingsProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
