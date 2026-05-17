import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, RadialGradient, Stop, Rect, Ellipse, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

/**
 * PeacefulLandscape — A serene mountain + water + sunrise SVG animation
 */
export default function PeacefulLandscape({ size = 280 }) {
  const sunRise = useSharedValue(0);
  const waterShimmer = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const cloud1X = useSharedValue(0);
  const cloud2X = useSharedValue(0);

  useEffect(() => {
    // Sun slowly rises
    sunRise.value = withTiming(1, { duration: 3000, easing: Easing.out(Easing.cubic) });

    // Water shimmer
    waterShimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );

    // Glow pulse
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );

    // Clouds drifting
    cloud1X.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-12, { duration: 8000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );

    cloud2X.value = withDelay(2000, withRepeat(
      withSequence(
        withTiming(-8, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 10000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    ));
  }, []);

  // Sun position animated
  const sunStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(sunRise.value, [0, 1], [30, 0]) },
    ],
    opacity: interpolate(sunRise.value, [0, 0.3, 1], [0, 0.5, 1]),
  }));

  // Glow around sun
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.4, 0.8]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [1, 1.15]) }],
  }));

  // Water reflection shimmer
  const waterStyle = useAnimatedStyle(() => ({
    opacity: interpolate(waterShimmer.value, [0, 1], [0.3, 0.7]),
  }));

  // Cloud 1
  const cloud1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud1X.value }],
    opacity: 0.5,
  }));

  // Cloud 2
  const cloud2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud2X.value }],
    opacity: 0.35,
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sky gradient background */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1a1a2e" stopOpacity="1" />
            <Stop offset="40%" stopColor="#16213e" stopOpacity="1" />
            <Stop offset="70%" stopColor="#2d1b4e" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#e8985a" stopOpacity="0.4" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#skyGrad)" />
      </Svg>

      {/* Sun glow halo */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.2, alignSelf: 'center' }, glowStyle]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Defs>
            <RadialGradient id="sunGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
              <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="60" cy="60" r="58" fill="url(#sunGlow)" />
        </Svg>
      </Animated.View>

      {/* Rising Sun */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.25, alignSelf: 'center' }, sunStyle]}>
        <Svg width={56} height={56} viewBox="0 0 56 56">
          <Defs>
            <RadialGradient id="sunBody" cx="40%" cy="40%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
              <Stop offset="60%" stopColor="#FBBF24" stopOpacity="1" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Circle cx="28" cy="28" r="22" fill="url(#sunBody)" />
        </Svg>
      </Animated.View>

      {/* Clouds */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.18, left: w * 0.05 }, cloud1Style]}>
        <Svg width={70} height={28} viewBox="0 0 70 28">
          <Ellipse cx="25" cy="18" rx="20" ry="9" fill="rgba(255,255,255,0.15)" />
          <Ellipse cx="45" cy="14" rx="22" ry="11" fill="rgba(255,255,255,0.12)" />
          <Ellipse cx="35" cy="19" rx="15" ry="8" fill="rgba(255,255,255,0.1)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[{ position: 'absolute', top: h * 0.12, right: w * 0.08 }, cloud2Style]}>
        <Svg width={55} height={22} viewBox="0 0 55 22">
          <Ellipse cx="20" cy="14" rx="16" ry="7" fill="rgba(255,255,255,0.12)" />
          <Ellipse cx="36" cy="11" rx="18" ry="9" fill="rgba(255,255,255,0.09)" />
        </Svg>
      </Animated.View>

      {/* Mountains */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2d1b4e" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1a1a2e" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#3d2b5e" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.9" />
          </LinearGradient>
          <LinearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1e1535" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0f0f1a" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Back mountain range */}
        <Path d="M0,170 L40,125 L80,140 L120,100 L160,120 L200,90 L240,115 L280,105 L300,130 L300,255 L0,255 Z" fill="url(#mtn2)" opacity="0.7" />

        {/* Main mountain */}
        <Path d="M-20,200 L70,110 L100,135 L150,85 L200,130 L230,115 L300,165 L300,255 L0,255 Z" fill="url(#mtn1)" />

        {/* Snow caps */}
        <Path d="M150,85 L143,100 L157,100 Z" fill="rgba(255,255,255,0.3)" />
        <Path d="M70,110 L65,120 L78,118 Z" fill="rgba(255,255,255,0.2)" />

        {/* Front mountain */}
        <Path d="M-10,220 L50,160 L90,175 L130,150 L180,170 L250,145 L310,190 L310,255 L-10,255 Z" fill="url(#mtn3)" />
      </Svg>

      {/* Water / Lake */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1a1a3e" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#0f0f2a" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#050510" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path d="M0,200 Q75,192 150,198 Q225,204 300,196 L300,255 L0,255 Z" fill="url(#waterGrad)" />
      </Svg>

      {/* Water shimmer reflections */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, width: w, height: h * 0.22 }, waterStyle]}>
        <Svg width={w} height={h * 0.22} viewBox="0 0 300 56">
          {/* Sun reflection streak */}
          <Rect x="125" y="5" width="50" height="2" rx="1" fill="#FBBF24" opacity="0.4" />
          <Rect x="130" y="12" width="40" height="1.5" rx="1" fill="#FBBF24" opacity="0.3" />
          <Rect x="135" y="18" width="30" height="1" rx="1" fill="#FBBF24" opacity="0.25" />
          <Rect x="138" y="24" width="24" height="1" rx="1" fill="#FBBF24" opacity="0.2" />

          {/* Ripple lines */}
          <Path d="M20,30 Q75,27 150,31 Q225,35 280,29" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <Path d="M10,40 Q80,37 150,41 Q220,45 290,39" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <Path d="M30,48 Q90,45 150,49 Q210,53 270,47" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </Svg>
      </Animated.View>

      {/* Tiny stars in the sky */}
      <Svg width={w} height={h * 0.4} viewBox="0 0 300 100" style={{ position: 'absolute', top: 0 }}>
        <Circle cx="40" cy="20" r="1" fill="#fff" opacity="0.4" />
        <Circle cx="260" cy="15" r="1.2" fill="#fff" opacity="0.3" />
        <Circle cx="180" cy="10" r="0.8" fill="#fff" opacity="0.5" />
        <Circle cx="90" cy="30" r="1" fill="#fff" opacity="0.25" />
        <Circle cx="220" cy="35" r="0.7" fill="#fff" opacity="0.35" />
        <Circle cx="130" cy="8" r="1.1" fill="#fff" opacity="0.2" />
      </Svg>
    </View>
  );
}
