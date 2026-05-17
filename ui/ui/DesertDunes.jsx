import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, RadialGradient, Stop, Ellipse, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export default function DesertDunes({ size = 280 }) {
  const heatShimmer = useSharedValue(0);
  const sunPulse = useSharedValue(0);
  const sandDrift = useSharedValue(0);

  useEffect(() => {
    heatShimmer.value = withRepeat(withSequence(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    sunPulse.value = withRepeat(withSequence(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    sandDrift.value = withRepeat(withSequence(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(heatShimmer.value, [0, 1], [0.1, 0.3]),
    transform: [{ translateY: interpolate(heatShimmer.value, [0, 1], [0, -3]) }],
  }));

  const sunStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sunPulse.value, [0, 1], [0.7, 1]),
    transform: [{ scale: interpolate(sunPulse.value, [0, 1], [1, 1.08]) }],
  }));

  const driftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sandDrift.value, [0, 1], [0.3, 0.6]),
    transform: [{ translateX: interpolate(sandDrift.value, [0, 1], [-10, 10]) }],
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sunset sky */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="desertSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1A0533" stopOpacity="1" />
            <Stop offset="25%" stopColor="#4A1942" stopOpacity="1" />
            <Stop offset="50%" stopColor="#C0392B" stopOpacity="0.7" />
            <Stop offset="75%" stopColor="#E67E22" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#F39C12" stopOpacity="0.6" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#desertSky)" />
      </Svg>

      {/* Sun */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.25, alignSelf: 'center' }, sunStyle]}>
        <Svg width={80} height={80} viewBox="0 0 80 80">
          <Defs>
            <RadialGradient id="desertSun" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
              <Stop offset="40%" stopColor="#FBBF24" stopOpacity="0.9" />
              <Stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="40" cy="40" r="38" fill="url(#desertSun)" />
          <Circle cx="40" cy="40" r="16" fill="#FEF3C7" />
        </Svg>
      </Animated.View>

      {/* Heat shimmer */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.45, left: 0, right: 0 }, shimmerStyle]}>
        <Svg width={w} height={40} viewBox="0 0 300 40">
          <Path d="M0,20 Q30,15 60,22 T120,18 T180,24 T240,16 T300,22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <Path d="M0,28 Q40,22 80,30 T160,24 T240,32 T300,26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        </Svg>
      </Animated.View>

      {/* Sand dunes */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="dune1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#D4A260" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#B8860B" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="dune2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#C8953D" stopOpacity="1" />
            <Stop offset="100%" stopColor="#A0732B" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="dune3" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#B8860B" stopOpacity="1" />
            <Stop offset="100%" stopColor="#8B6914" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* Far dunes */}
        <Path d="M-20,170 Q60,140 120,165 T240,145 T320,170 L320,255 L-20,255 Z" fill="url(#dune1)" opacity="0.7" />
        {/* Mid dunes */}
        <Path d="M-10,195 Q80,160 160,190 T280,170 T310,195 L310,255 L-10,255 Z" fill="url(#dune2)" />
        {/* Near dunes */}
        <Path d="M0,220 Q60,195 140,215 T260,200 T300,225 L300,255 L0,255 Z" fill="url(#dune3)" />
        {/* Sand highlight on ridge */}
        <Path d="M80,162 Q120,148 160,162" fill="none" stroke="rgba(255,235,180,0.3)" strokeWidth="1.5" />
      </Svg>

      {/* Drifting sand particles */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, driftStyle]}>
        <Svg width={w} height={40} viewBox="0 0 300 40">
          <Circle cx="50" cy="20" r="1" fill="#D4A260" opacity="0.5" />
          <Circle cx="120" cy="15" r="0.8" fill="#D4A260" opacity="0.4" />
          <Circle cx="200" cy="25" r="1.2" fill="#D4A260" opacity="0.3" />
          <Circle cx="260" cy="18" r="0.7" fill="#D4A260" opacity="0.5" />
        </Svg>
      </Animated.View>
    </View>
  );
}
