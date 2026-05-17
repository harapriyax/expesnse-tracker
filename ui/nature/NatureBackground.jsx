import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../context/SettingsContext';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Ellipse, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Time Constants ───
const TIME_OF_DAY = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night',
};

function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 11) return TIME_OF_DAY.MORNING;
  if (hour >= 11 && hour < 17) return TIME_OF_DAY.AFTERNOON;
  if (hour >= 17 && hour < 20) return TIME_OF_DAY.EVENING;
  return TIME_OF_DAY.NIGHT;
}

function getAmbientGradient(time, isDark) {
  if (isDark) {
    return ['#000000', '#000000'];
  }
  return ['#f8fafc', '#f1f5f9'];
}

/**
 * NatureBackground — Supports different ambient scenes per page.
 * 
 * Scenes: 'aurora', 'leaves', 'stars', 'rain', 'clouds', 'fireflies',
 *         'ripples', 'orbs', 'snow', 'waves', 'mist', 'default'
 */
export default React.memo(function NatureBackground({ scene = 'default' }) {
  const { isDark } = useTheme();
  const hour = new Date().getHours();
  const time = getTimeOfDay(hour);
  const [topColor, bottomColor] = getAmbientGradient(time, isDark);
  const baseOpacity = isDark ? 1 : 0.5;

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: isDark ? '#000' : '#f8fafc' }]}>
      {/* Soft ambient gradient — no heavy SVG landscapes */}
      <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="ambientBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={topColor} stopOpacity={0.6 * baseOpacity} />
            <Stop offset="100%" stopColor={bottomColor} stopOpacity={baseOpacity} />
          </LinearGradient>
        </Defs>
        <Path d="M0,0 L1000,0 L1000,2000 L0,2000 Z" fill="url(#ambientBg)" />
      </Svg>

      {/* Scene-specific subtle ambient effect */}
      <AmbientScene scene={scene} isDark={isDark} time={time} />
    </View>
  );
})

// ─── Ambient Scene Router ───
function AmbientScene({ scene, isDark, time }) {
  switch (scene) {
    case 'aurora': return <AuroraScene isDark={isDark} />;
    case 'leaves': return <LeavesScene isDark={isDark} />;
    case 'stars': return <StarsScene isDark={isDark} />;
    case 'rain': return <RainScene isDark={isDark} />;
    case 'clouds': return <CloudsScene isDark={isDark} />;
    case 'fireflies': return <FirefliesScene isDark={isDark} />;
    case 'ripples': return <RipplesScene isDark={isDark} />;
    case 'orbs': return <OrbsScene isDark={isDark} />;
    case 'snow': return <SnowScene isDark={isDark} />;
    case 'waves': return <WavesScene isDark={isDark} />;
    case 'mist': return <MistScene isDark={isDark} />;
    default: return <DefaultScene isDark={isDark} time={time} />;
  }
}

// ─── DEFAULT: Gentle floating dots ───
function DefaultScene({ isDark, time }) {
  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);

  useEffect(() => {
    float1.value = withRepeat(withSequence(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    float2.value = withDelay(2000, withRepeat(withSequence(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);

  const dot1 = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float1.value, [0, 1], [-10, 10]) }],
    opacity: interpolate(float1.value, [0, 1], [0.08, 0.15]),
  }));
  const dot2 = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float2.value, [0, 1], [5, -8]) }],
    opacity: interpolate(float2.value, [0, 1], [0.05, 0.12]),
  }));

  const c = isDark ? '#fff' : '#000';
  return (
    <>
      <Animated.View style={[{ position: 'absolute', top: '20%', left: '15%' }, dot1]}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: c, opacity: 0.03 }} />
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: '50%', right: '10%' }, dot2]}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: c, opacity: 0.02 }} />
      </Animated.View>
    </>
  );
}

// ─── AURORA: Soft northern lights shimmer ───
function AuroraScene({ isDark }) {
  const shimmer = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withSequence(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    drift.value = withRepeat(withSequence(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const aurora1 = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.03, 0.08]),
    transform: [{ translateX: interpolate(drift.value, [0, 1], [-15, 15]) }],
  }));
  const aurora2 = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.05, 0.1]),
    transform: [{ translateX: interpolate(drift.value, [0, 1], [10, -10]) }],
  }));

  return (
    <>
      <Animated.View style={[{ position: 'absolute', top: '5%', left: '-10%', right: '-10%' }, aurora1]}>
        <Svg width={SCREEN_W + 60} height={200} viewBox="0 0 400 200">
          <Defs>
            <LinearGradient id="au1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="200" cy="100" rx="200" ry="60" fill="url(#au1)" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: '15%', left: '0%', right: '-5%' }, aurora2]}>
        <Svg width={SCREEN_W + 30} height={160} viewBox="0 0 400 160">
          <Defs>
            <LinearGradient id="au2" x1="0" y1="0" x2="1" y2="0.5">
              <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0" />
              <Stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="200" cy="80" rx="180" ry="50" fill="url(#au2)" />
        </Svg>
      </Animated.View>
    </>
  );
}

// ─── LEAVES: Gentle falling leaves ───
function LeavesScene({ isDark }) {
  const leaf1 = useSharedValue(0);
  const leaf2 = useSharedValue(0);
  const leaf3 = useSharedValue(0);

  useEffect(() => {
    leaf1.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.linear }), -1, false);
    leaf2.value = withDelay(2500, withRepeat(withTiming(1, { duration: 9000, easing: Easing.linear }), -1, false));
    leaf3.value = withDelay(4000, withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false));
  }, []);

  const makeLeafStyle = (val, startX, endX) => useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: interpolate(val.value, [0, 1], [startX, endX]) },
      { translateY: interpolate(val.value, [0, 1], [-30, SCREEN_H + 30]) },
      { rotate: `${interpolate(val.value, [0, 1], [0, 540])}deg` },
    ],
    opacity: interpolate(val.value, [0, 0.05, 0.9, 1], [0, 0.15, 0.15, 0]),
  }));

  const leafColor = isDark ? '#34D399' : '#059669';
  return (
    <>
      <Animated.View style={makeLeafStyle(leaf1, SCREEN_W * 0.2, SCREEN_W * 0.35)}>
        <Svg width={14} height={14} viewBox="0 0 24 24">
          <Path d="M12,2 C12,2 20,6 20,14 C20,22 12,22 12,22 C12,22 4,22 4,14 C4,6 12,2 12,2 Z" fill={leafColor} />
        </Svg>
      </Animated.View>
      <Animated.View style={makeLeafStyle(leaf2, SCREEN_W * 0.7, SCREEN_W * 0.55)}>
        <Svg width={11} height={11} viewBox="0 0 24 24">
          <Path d="M12,2 C12,2 20,6 20,14 C20,22 12,22 12,22 C12,22 4,22 4,14 C4,6 12,2 12,2 Z" fill={leafColor} />
        </Svg>
      </Animated.View>
      <Animated.View style={makeLeafStyle(leaf3, SCREEN_W * 0.45, SCREEN_W * 0.3)}>
        <Svg width={9} height={9} viewBox="0 0 24 24">
          <Path d="M12,2 C12,2 20,6 20,14 C20,22 12,22 12,22 C12,22 4,22 4,14 C4,6 12,2 12,2 Z" fill={leafColor} />
        </Svg>
      </Animated.View>
    </>
  );
}

// ─── STARS: Twinkling stars ───
function StarsScene({ isDark }) {
  const tw1 = useSharedValue(0);
  const tw2 = useSharedValue(0);
  const tw3 = useSharedValue(0);

  useEffect(() => {
    tw1.value = withRepeat(withSequence(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    tw2.value = withDelay(700, withRepeat(withSequence(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
    tw3.value = withDelay(1500, withRepeat(withSequence(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);

  const star = (val, top, left) => useAnimatedStyle(() => ({
    position: 'absolute', top, left,
    opacity: interpolate(val.value, [0, 1], [0.05, isDark ? 0.2 : 0.08]),
    transform: [{ scale: interpolate(val.value, [0, 1], [0.8, 1.3]) }],
  }));

  const c = isDark ? '#FEF08A' : '#92400E';
  return (
    <>
      <Animated.View style={star(tw1, '12%', '20%')}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={star(tw2, '25%', '75%')}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={star(tw3, '8%', '55%')}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={star(tw1, '35%', '85%')}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={star(tw2, '18%', '42%')}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c }} />
      </Animated.View>
    </>
  );
}

// ─── RAIN: Gentle rain streaks ───
function RainScene({ isDark }) {
  const drop1 = useSharedValue(0);
  const drop2 = useSharedValue(0);
  const drop3 = useSharedValue(0);

  useEffect(() => {
    drop1.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.linear }), -1, false);
    drop2.value = withDelay(400, withRepeat(withTiming(1, { duration: 2200, easing: Easing.linear }), -1, false));
    drop3.value = withDelay(900, withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), -1, false));
  }, []);

  const dropStyle = (val, left) => useAnimatedStyle(() => ({
    position: 'absolute', left,
    transform: [{ translateY: interpolate(val.value, [0, 1], [-20, SCREEN_H + 20]) }],
    opacity: interpolate(val.value, [0, 0.1, 0.9, 1], [0, isDark ? 0.1 : 0.06, isDark ? 0.1 : 0.06, 0]),
  }));

  const c = isDark ? 'rgba(147,197,253,0.4)' : 'rgba(59,130,246,0.15)';
  return (
    <>
      <Animated.View style={dropStyle(drop1, '25%')}>
        <View style={{ width: 1.5, height: 20, backgroundColor: c, borderRadius: 1 }} />
      </Animated.View>
      <Animated.View style={dropStyle(drop2, '55%')}>
        <View style={{ width: 1, height: 16, backgroundColor: c, borderRadius: 1 }} />
      </Animated.View>
      <Animated.View style={dropStyle(drop3, '78%')}>
        <View style={{ width: 1.5, height: 22, backgroundColor: c, borderRadius: 1 }} />
      </Animated.View>
      <Animated.View style={dropStyle(drop1, '42%')}>
        <View style={{ width: 1, height: 14, backgroundColor: c, borderRadius: 1 }} />
      </Animated.View>
    </>
  );
}

// ─── CLOUDS: Soft drifting clouds ───
function CloudsScene({ isDark }) {
  const drift1 = useSharedValue(0);
  const drift2 = useSharedValue(0);

  useEffect(() => {
    drift1.value = withRepeat(withSequence(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 12000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    drift2.value = withDelay(3000, withRepeat(withSequence(
      withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 15000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);

  const c1 = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(drift1.value, [0, 1], [-30, 30]) }],
    opacity: isDark ? 0.04 : 0.06,
  }));
  const c2 = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(drift2.value, [0, 1], [20, -20]) }],
    opacity: isDark ? 0.03 : 0.05,
  }));

  const fill = isDark ? '#fff' : '#94A3B8';
  return (
    <>
      <Animated.View style={[{ position: 'absolute', top: '10%', left: '5%' }, c1]}>
        <Svg width={140} height={50} viewBox="0 0 140 50">
          <Ellipse cx="50" cy="30" rx="40" ry="15" fill={fill} />
          <Ellipse cx="90" cy="25" rx="45" ry="18" fill={fill} />
          <Ellipse cx="70" cy="32" rx="30" ry="12" fill={fill} />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: '30%', right: '-5%' }, c2]}>
        <Svg width={120} height={40} viewBox="0 0 120 40">
          <Ellipse cx="40" cy="25" rx="35" ry="12" fill={fill} />
          <Ellipse cx="75" cy="20" rx="38" ry="15" fill={fill} />
        </Svg>
      </Animated.View>
    </>
  );
}

// ─── FIREFLIES: Floating warm dots ───
function FirefliesScene({ isDark }) {
  const f1 = useSharedValue(0);
  const f2 = useSharedValue(0);
  const f3 = useSharedValue(0);

  useEffect(() => {
    f1.value = withRepeat(withSequence(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    f2.value = withDelay(1500, withRepeat(withSequence(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
    f3.value = withDelay(3000, withRepeat(withSequence(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);

  const fly = (val, top, left) => useAnimatedStyle(() => ({
    position: 'absolute', top, left,
    opacity: interpolate(val.value, [0, 1], [0.02, isDark ? 0.15 : 0.08]),
    transform: [
      { translateY: interpolate(val.value, [0, 1], [-8, 8]) },
      { translateX: interpolate(val.value, [0, 1], [-5, 5]) },
      { scale: interpolate(val.value, [0, 1], [0.7, 1.2]) },
    ],
  }));

  const c = isDark ? '#FBBF24' : '#D97706';
  return (
    <>
      <Animated.View style={fly(f1, '20%', '30%')}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={fly(f2, '45%', '70%')}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={fly(f3, '65%', '15%')}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={fly(f1, '75%', '60%')}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c }} />
      </Animated.View>
    </>
  );
}

// ─── RIPPLES: Expanding water ripples ───
function RipplesScene({ isDark }) {
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);

  useEffect(() => {
    r1.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }), -1, false);
    r2.value = withDelay(2000, withRepeat(withTiming(1, { duration: 5000, easing: Easing.out(Easing.quad) }), -1, false));
  }, []);

  const ripple = (val, top, left) => useAnimatedStyle(() => ({
    position: 'absolute', top, left,
    width: interpolate(val.value, [0, 1], [10, 120]),
    height: interpolate(val.value, [0, 1], [10, 120]),
    borderRadius: interpolate(val.value, [0, 1], [5, 60]),
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
    opacity: interpolate(val.value, [0, 0.2, 1], [0, 0.15, 0]),
  }));

  return (
    <>
      <Animated.View style={ripple(r1, '30%', '25%')} />
      <Animated.View style={ripple(r2, '55%', '60%')} />
    </>
  );
}

// ─── ORBS: Gently rising luminous orbs ───
function OrbsScene({ isDark }) {
  const o1 = useSharedValue(0);
  const o2 = useSharedValue(0);
  const o3 = useSharedValue(0);

  useEffect(() => {
    o1.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }), -1, false);
    o2.value = withDelay(2500, withRepeat(withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }), -1, false));
    o3.value = withDelay(5000, withRepeat(withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }), -1, false));
  }, []);

  const orb = (val, left, sz) => useAnimatedStyle(() => ({
    position: 'absolute', left,
    bottom: interpolate(val.value, [0, 1], [-sz, SCREEN_H + sz]),
    opacity: interpolate(val.value, [0, 0.1, 0.8, 1], [0, isDark ? 0.1 : 0.05, isDark ? 0.1 : 0.05, 0]),
    transform: [{ translateX: interpolate(val.value, [0, 0.5, 1], [0, 15, 0]) }],
  }));

  const c = isDark ? '#A78BFA' : '#7C3AED';
  return (
    <>
      <Animated.View style={orb(o1, '20%', 16)}>
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={orb(o2, '55%', 12)}>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={orb(o3, '75%', 10)}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c }} />
      </Animated.View>
    </>
  );
}

// ─── SNOW: Gentle snowfall ───
function SnowScene({ isDark }) {
  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);

  useEffect(() => {
    s1.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.linear }), -1, false);
    s2.value = withDelay(1500, withRepeat(withTiming(1, { duration: 7000, easing: Easing.linear }), -1, false));
    s3.value = withDelay(3000, withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false));
  }, []);

  const flake = (val, left) => useAnimatedStyle(() => ({
    position: 'absolute', left,
    transform: [
      { translateY: interpolate(val.value, [0, 1], [-10, SCREEN_H + 20]) },
      { translateX: interpolate(val.value, [0, 0.5, 1], [0, 20, 0]) },
    ],
    opacity: interpolate(val.value, [0, 0.05, 0.9, 1], [0, isDark ? 0.12 : 0.06, isDark ? 0.12 : 0.06, 0]),
  }));

  const c = isDark ? '#fff' : '#94A3B8';
  return (
    <>
      <Animated.View style={flake(s1, '15%')}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={flake(s2, '50%')}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: c }} />
      </Animated.View>
      <Animated.View style={flake(s3, '80%')}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c }} />
      </Animated.View>
    </>
  );
}

// ─── WAVES: Gentle horizontal wave lines ───
function WavesScene({ isDark }) {
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withRepeat(withSequence(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const waveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(wave.value, [0, 1], [0.03, 0.08]),
    transform: [{ translateY: interpolate(wave.value, [0, 1], [0, 6]) }],
  }));

  const c = isDark ? 'rgba(96,165,250,0.3)' : 'rgba(59,130,246,0.1)';
  return (
    <Animated.View style={[{ position: 'absolute', bottom: '20%', width: '100%' }, waveStyle]}>
      <Svg width={SCREEN_W} height={60} viewBox="0 0 400 60">
        <Path d="M0,20 Q50,10 100,25 T200,18 T300,28 T400,15" fill="none" stroke={c} strokeWidth="2" />
        <Path d="M0,35 Q60,25 120,38 T240,30 T360,40 T400,32" fill="none" stroke={c} strokeWidth="1.5" />
        <Path d="M0,48 Q70,40 140,50 T280,42 T400,50" fill="none" stroke={c} strokeWidth="1" />
      </Svg>
    </Animated.View>
  );
}

// ─── MIST: Floating mist patches ───
function MistScene({ isDark }) {
  const m1 = useSharedValue(0);
  const m2 = useSharedValue(0);

  useEffect(() => {
    m1.value = withRepeat(withSequence(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    m2.value = withDelay(4000, withRepeat(withSequence(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 12000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);

  const mist1 = useAnimatedStyle(() => ({
    opacity: interpolate(m1.value, [0, 1], [0.02, 0.06]),
    transform: [{ translateX: interpolate(m1.value, [0, 1], [-20, 20]) }],
  }));
  const mist2 = useAnimatedStyle(() => ({
    opacity: interpolate(m2.value, [0, 1], [0.03, 0.07]),
    transform: [{ translateX: interpolate(m2.value, [0, 1], [15, -15]) }],
  }));

  const c = isDark ? '#fff' : '#64748B';
  return (
    <>
      <Animated.View style={[{ position: 'absolute', top: '40%', left: '-10%' }, mist1]}>
        <View style={{ width: SCREEN_W * 0.8, height: 60, backgroundColor: c, borderRadius: 30 }} />
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: '60%', right: '-10%' }, mist2]}>
        <View style={{ width: SCREEN_W * 0.7, height: 40, backgroundColor: c, borderRadius: 20 }} />
      </Animated.View>
    </>
  );
}
