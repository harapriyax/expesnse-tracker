import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CalendarDays } from 'lucide-react-native';
import { Colors, Radius } from '../../constants/colors';
import { useTheme } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { CheeseMoon, RadiantSun } from '../ui/CelestialAnimations';

export default function TopBar() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  // Subtle glow pulse for the icon container
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.4, 0.8]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [1, 1.08]) }],
  }));

  useEffect(() => {
    if (!user?.uid || !db) return;
    const unsub = onSnapshot(
      doc(db, 'users', user.uid, 'profile', 'info'),
      (snap) => {
        if (snap.exists()) setProfile(snap.data());
      },
      () => {}
    );
    return () => unsub();
  }, [user]);

  const now = new Date();
  const h = now.getHours();

  let greeting = 'Good Morning';
  let TimeIcon = RadiantSun;
  let isNight = false;
  let gradientColors = isDark
    ? ['rgba(251,191,36,0.12)', 'rgba(245,158,11,0.04)']
    : ['rgba(254,240,138,0.5)', 'rgba(251,191,36,0.15)'];
  let iconGlow = isDark ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.15)';

  if (h >= 12 && h < 17) {
    greeting = 'Good Afternoon';
    TimeIcon = RadiantSun;
    gradientColors = isDark
      ? ['rgba(251,191,36,0.12)', 'rgba(245,158,11,0.04)']
      : ['rgba(254,240,138,0.45)', 'rgba(251,191,36,0.1)'];
    iconGlow = isDark ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.15)';
  } else if (h >= 17 && h < 21) {
    greeting = 'Good Evening';
    TimeIcon = CheeseMoon;
    isNight = true;
    gradientColors = isDark
      ? ['rgba(99,102,241,0.12)', 'rgba(129,140,248,0.04)']
      : ['rgba(199,210,254,0.5)', 'rgba(165,180,252,0.15)'];
    iconGlow = isDark ? 'rgba(129,140,248,0.25)' : 'rgba(165,180,252,0.3)';
  } else if (h >= 21 || h < 5) {
    greeting = 'Good Night';
    TimeIcon = CheeseMoon;
    isNight = true;
    gradientColors = isDark
      ? ['rgba(99,102,241,0.1)', 'rgba(67,56,202,0.04)']
      : ['rgba(199,210,254,0.45)', 'rgba(165,180,252,0.1)'];
    iconGlow = isDark ? 'rgba(129,140,248,0.2)' : 'rgba(165,180,252,0.25)';
  }

  const userName = profile?.name || user?.email?.split('@')[0] || 'Friend';

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.container}>
      <BlurView
        intensity={isDark ? 50 : 80}
        tint={isDark ? 'dark' : 'default'}
        style={[
          styles.card,
          {
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
        <View style={styles.topRow}>
          {/* Icon with glow ring */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.iconGlow,
                glowStyle,
                { backgroundColor: iconGlow },
              ]}
            />
            <View style={styles.iconInner}>
              <TimeIcon size={48} />
            </View>
          </View>

          {/* Greeting text */}
          <View style={styles.textContainer}>
            <Text style={[styles.greetingLabel, { color: colors.text.tertiary }]}>
              {greeting}
            </Text>
            <Text
              style={[styles.userName, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {userName}
            </Text>
            {profile?.age ? (
              <View style={[styles.agePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.ageText, { color: colors.text.secondary }]}>
                  {profile.age} yrs
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Date strip */}
        <View style={[styles.dateStrip, { borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
          <View style={[styles.datePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
            <CalendarDays size={12} color={colors.text.tertiary} strokeWidth={2.5} />
            <Text style={[styles.dateText, { color: colors.text.secondary }]}>
              {format(now, 'EEEE, MMMM do')}
            </Text>
          </View>
          <View style={[styles.liveIndicator, { backgroundColor: isNight ? colors.indigo : colors.amber }]}>
            <View style={[styles.liveDot, { backgroundColor: isNight ? '#C7D2FE' : '#FEF08A' }]} />
          </View>
        </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  iconInner: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  greetingLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  userName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  agePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  ageText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  dateStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  dateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  liveIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
