import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/SettingsContext';
import { useApp } from '../../context/AppContext';
import { isCompletedToday } from '../../utils/streaks';

// High Performance Gamified Aura Component
export default function SolaceAura() {
  const { isDark } = useTheme();
  const { habits, sleepLogs, expenses } = useApp();

  // 1. Calculate Habit %
  const todayDow = new Date().getDay();
  const todaysHabits = habits.filter(h => h.days.includes(todayDow));
  const doneHabits = todaysHabits.filter(h => isCompletedToday(h.completions));
  const habitPct = todaysHabits.length > 0 ? doneHabits.length / todaysHabits.length : 1; // Default to 1 if no habits

  // 2. Calculate Sleep Score (Using latest sleep log)
  // Assumes sleepLogs are sorted descending by date
  const latestSleep = sleepLogs[0];
  let sleepScore = 0.8; // Default fair
  if (latestSleep && latestSleep.quality) {
    if (latestSleep.quality === 'great') sleepScore = 1.0;
    else if (latestSleep.quality === 'good') sleepScore = 0.8;
    else if (latestSleep.quality === 'fair') sleepScore = 0.5;
    else if (latestSleep.quality === 'poor') sleepScore = 0.2;
  }

  // 3. Calculate Expense Pressure
  // Assume a daily budget threshold of ~1500 INR for pressure scaling
  const todayKey = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses
    .filter(e => e.date === todayKey)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  const expensePressure = Math.min(todayExpenses / 1500, 1);

  // Overall Solace State (0 to 1) 
  // High = Zen/Perfect (All habits done, great sleep, no expenses)
  // Low = Stressed (No habits done, poor sleep, high expenses)
  const solaceState = (habitPct * 0.5) + (sleepScore * 0.3) + ((1 - expensePressure) * 0.2);

  // Animation Values
  const pulse = useSharedValue(0);
  const colorProgress = useSharedValue(solaceState);

  useEffect(() => {
    // Breathing animation logic based on state
    // Higher score = slower, more calm breathing
    // Lower score = faster, more anxious pulsing
    const breathDuration = solaceState > 0.7 ? 4000 : solaceState > 0.4 ? 2500 : 1500;
    
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: breathDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: breathDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Smoothly transition colors when state changes
    colorProgress.value = withTiming(solaceState, { duration: 1000 });
  }, [solaceState]);

  // Animated Styles for multi-layered orbs
  const p1Style = useAnimatedStyle(() => {
    // Map State to Colors:
    // 0 = Red/Purple (Stressed)
    // 0.5 = Gold/Purple (Neutral)
    // 1 = Teal/Green (Zen)
    const bgColor = interpolateColor(
      colorProgress.value,
      [0, 0.5, 1],
      ['#e11d48', '#d946ef', '#10b981']
    );

    return {
      backgroundColor: bgColor,
      transform: [
        { scale: 1 + (pulse.value * 0.2) },
      ],
      opacity: 0.3 + (pulse.value * 0.3),
    };
  });

  const p2Style = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      colorProgress.value,
      [0, 0.5, 1],
      ['#fb923c', '#8b5cf6', '#3b82f6']
    );

    return {
      backgroundColor: bgColor,
      transform: [
        { scale: 1.2 - (pulse.value * 0.15) },
        { translateX: pulse.value * 20 },
      ],
      opacity: 0.2 + (pulse.value * 0.2),
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.orb, styles.orb1, p1Style]} />
      <Animated.View style={[styles.orb, styles.orb2, p2Style]} />
      <BlurView 
        intensity={isDark ? 90 : 70} 
        tint={isDark ? 'dark' : 'light'} 
        style={StyleSheet.absoluteFill} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 250,
    height: 250,
    top: -50,
    left: -50,
  },
  orb2: {
    width: 300,
    height: 300,
    top: -100,
    right: -50,
  }
});
