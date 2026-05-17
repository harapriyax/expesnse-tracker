import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay,
  Easing, interpolate,
} from 'react-native-reanimated';

/**
 * Premium loading screen with pulsing rings and shimmer text.
 * Use: <LoadingScreen message="Loading your data..." />
 */
export default function LoadingScreen({ message = 'Loading...' }) {
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const pulse3 = useSharedValue(0);
  const textFade = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);
    pulse1.value = withRepeat(withSequence(
      withTiming(1, { duration: 1500, easing: ease }),
      withTiming(0, { duration: 1500, easing: ease }),
    ), -1, true);
    pulse2.value = withDelay(300, withRepeat(withSequence(
      withTiming(1, { duration: 1500, easing: ease }),
      withTiming(0, { duration: 1500, easing: ease }),
    ), -1, true));
    pulse3.value = withDelay(600, withRepeat(withSequence(
      withTiming(1, { duration: 1500, easing: ease }),
      withTiming(0, { duration: 1500, easing: ease }),
    ), -1, true));
    textFade.value = withRepeat(withSequence(
      withTiming(1, { duration: 1000, easing: ease }),
      withTiming(0.4, { duration: 1000, easing: ease }),
    ), -1, true);
  }, []);

  const ring1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse1.value, [0, 1], [0.8, 1.2]) }],
    opacity: interpolate(pulse1.value, [0, 1], [0.3, 0.1]),
  }));
  const ring2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse2.value, [0, 1], [0.6, 1]) }],
    opacity: interpolate(pulse2.value, [0, 1], [0.4, 0.15]),
  }));
  const ring3 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse3.value, [0, 1], [0.5, 0.8]) }],
    opacity: interpolate(pulse3.value, [0, 1], [0.5, 0.2]),
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textFade.value,
  }));

  return (
    <View style={styles.container}>
      {/* Pulsing rings */}
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.ring, styles.ring1, ring1]} />
        <Animated.View style={[styles.ring, styles.ring2, ring2]} />
        <Animated.View style={[styles.ring, styles.ring3, ring3]} />
        <View style={styles.center}>
          <Text style={styles.logo}>S</Text>
        </View>
      </View>

      <Animated.Text style={[styles.message, textStyle]}>
        {message}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 999,
  },
  ring1: {
    width: 120,
    height: 120,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  ring2: {
    width: 90,
    height: 90,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  ring3: {
    width: 60,
    height: 60,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  center: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    color: '#fff',
    letterSpacing: -1,
  },
  message: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
});
