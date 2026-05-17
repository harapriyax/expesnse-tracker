import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, RadialGradient, Stop, Ellipse, Rect } from 'react-native-svg';
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

export default function LotusBloom({ size = 280 }) {
  const bloom = useSharedValue(0);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const glow = useSharedValue(0);
  const leafFloat = useSharedValue(0);

  useEffect(() => {
    bloom.value = withRepeat(withSequence(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    ripple1.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.out(Easing.quad) }),
      -1, false
    );

    ripple2.value = withDelay(1500, withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }),
      -1, false
    ));

    glow.value = withRepeat(withSequence(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    leafFloat.value = withRepeat(withSequence(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const bloomStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(bloom.value, [0, 1], [0.95, 1.05]) },
      { translateY: interpolate(bloom.value, [0, 1], [2, -2]) },
    ],
  }));

  const r1Style = useAnimatedStyle(() => ({
    opacity: interpolate(ripple1.value, [0, 0.2, 1], [0, 0.4, 0]),
    transform: [{ scale: interpolate(ripple1.value, [0, 1], [0.5, 1.8]) }],
  }));

  const r2Style = useAnimatedStyle(() => ({
    opacity: interpolate(ripple2.value, [0, 0.2, 1], [0, 0.3, 0]),
    transform: [{ scale: interpolate(ripple2.value, [0, 1], [0.4, 1.6]) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.3, 0.7]),
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(leafFloat.value, [0, 1], [-5, 5]) },
      { translateY: interpolate(leafFloat.value, [0, 1], [2, -2]) },
    ],
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Water background */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="waterBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0E3B4D" stopOpacity="1" />
            <Stop offset="50%" stopColor="#0A2F3D" stopOpacity="1" />
            <Stop offset="100%" stopColor="#06202D" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#waterBg)" />

        {/* Water surface texture */}
        <Path d="M0,100 Q75,95 150,102 Q225,109 300,98" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <Path d="M0,130 Q80,125 160,133 Q240,141 300,128" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <Path d="M0,160 Q70,155 140,163 Q210,171 300,158" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        <Path d="M0,190 Q90,185 180,193 Q270,201 300,188" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
      </Svg>

      {/* Ripple 1 */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.45, alignSelf: 'center' }, r1Style]}>
        <Svg width={120} height={50} viewBox="0 0 120 50">
          <Ellipse cx="60" cy="25" rx="55" ry="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </Svg>
      </Animated.View>

      {/* Ripple 2 */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.43, alignSelf: 'center' }, r2Style]}>
        <Svg width={160} height={65} viewBox="0 0 160 65">
          <Ellipse cx="80" cy="32" rx="75" ry="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        </Svg>
      </Animated.View>

      {/* Glow behind lotus */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.2, alignSelf: 'center' }, glowStyle]}>
        <Svg width={140} height={100} viewBox="0 0 140 100">
          <Defs>
            <RadialGradient id="lotusGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.4" />
              <Stop offset="50%" stopColor="#F472B6" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="70" cy="50" rx="65" ry="45" fill="url(#lotusGlow)" />
        </Svg>
      </Animated.View>

      {/* Lotus flower */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.15, alignSelf: 'center' }, bloomStyle]}>
        <Svg width={120} height={100} viewBox="0 0 120 100">
          <Defs>
            <LinearGradient id="lp1" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FBB6CE" stopOpacity="1" />
              <Stop offset="100%" stopColor="#F687B3" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="lp2" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FECDD3" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FBB6CE" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="lp3" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFE4E6" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FECDD3" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Back petals */}
          <Path d="M60,55 Q40,20 20,40 Q30,55 60,55 Z" fill="url(#lp1)" opacity="0.8" />
          <Path d="M60,55 Q80,20 100,40 Q90,55 60,55 Z" fill="url(#lp1)" opacity="0.8" />
          <Path d="M60,55 Q60,10 45,25 Q50,50 60,55 Z" fill="url(#lp2)" opacity="0.85" />
          <Path d="M60,55 Q60,10 75,25 Q70,50 60,55 Z" fill="url(#lp2)" opacity="0.85" />
          {/* Front petals */}
          <Path d="M60,55 Q50,30 35,42 Q45,55 60,55 Z" fill="url(#lp3)" />
          <Path d="M60,55 Q70,30 85,42 Q75,55 60,55 Z" fill="url(#lp3)" />
          <Path d="M60,55 Q60,25 55,35 Q55,50 60,55 Z" fill="#FFF1F2" opacity="0.9" />
          <Path d="M60,55 Q60,25 65,35 Q65,50 60,55 Z" fill="#FFF1F2" opacity="0.9" />
          {/* Center */}
          <Circle cx="60" cy="50" r="5" fill="#FBBF24" opacity="0.8" />
          <Circle cx="58" cy="48" r="1.5" fill="#F59E0B" opacity="0.6" />
          <Circle cx="62" cy="48" r="1.5" fill="#F59E0B" opacity="0.6" />
          <Circle cx="60" cy="52" r="1.5" fill="#F59E0B" opacity="0.6" />
        </Svg>
      </Animated.View>

      {/* Lily pads */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.55, left: w * 0.05 }, floatStyle]}>
        <Svg width={60} height={30} viewBox="0 0 60 30">
          <Ellipse cx="30" cy="15" rx="28" ry="12" fill="#0D4D3A" opacity="0.6" />
          <Path d="M30,3 L30,15" fill="none" stroke="#0A3D2E" strokeWidth="0.8" opacity="0.4" />
        </Svg>
      </Animated.View>

      <Animated.View style={[{ position: 'absolute', top: h * 0.65, right: w * 0.08 }, floatStyle]}>
        <Svg width={45} height={22} viewBox="0 0 45 22">
          <Ellipse cx="22" cy="11" rx="20" ry="9" fill="#0D4D3A" opacity="0.5" />
          <Path d="M22,2 L22,11" fill="none" stroke="#0A3D2E" strokeWidth="0.6" opacity="0.3" />
        </Svg>
      </Animated.View>

      {/* Lotus pad under flower */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Ellipse cx="150" cy="165" rx="35" ry="14" fill="#0D5B43" opacity="0.5" />
        <Path d="M150,151 L150,165" fill="none" stroke="#0A4D3A" strokeWidth="0.8" opacity="0.3" />
      </Svg>
    </View>
  );
}
