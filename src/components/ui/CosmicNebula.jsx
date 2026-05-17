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

export default function CosmicNebula({ size = 280 }) {
  const nebula1 = useSharedValue(0);
  const nebula2 = useSharedValue(0);
  const starPulse1 = useSharedValue(0);
  const starPulse2 = useSharedValue(0);
  const cosmicGlow = useSharedValue(0);

  useEffect(() => {
    nebula1.value = withRepeat(withSequence(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    nebula2.value = withDelay(2000, withRepeat(withSequence(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));

    starPulse1.value = withRepeat(withSequence(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    starPulse2.value = withDelay(800, withRepeat(withSequence(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
    ), -1, true));

    cosmicGlow.value = withRepeat(withSequence(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const n1Style = useAnimatedStyle(() => ({
    opacity: interpolate(nebula1.value, [0, 1], [0.4, 0.8]),
    transform: [
      { scale: interpolate(nebula1.value, [0, 1], [0.95, 1.05]) },
      { rotate: `${interpolate(nebula1.value, [0, 1], [-2, 2])}deg` },
    ],
  }));

  const n2Style = useAnimatedStyle(() => ({
    opacity: interpolate(nebula2.value, [0, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(nebula2.value, [0, 1], [1, 0.92]) }],
  }));

  const s1Style = useAnimatedStyle(() => ({
    opacity: interpolate(starPulse1.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(starPulse1.value, [0, 1], [0.6, 1.4]) }],
  }));

  const s2Style = useAnimatedStyle(() => ({
    opacity: interpolate(starPulse2.value, [0, 1], [0.2, 0.9]),
    transform: [{ scale: interpolate(starPulse2.value, [0, 1], [0.7, 1.3]) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(cosmicGlow.value, [0, 1], [0.2, 0.5]),
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Deep space background */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="cosmosBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#0A0015" stopOpacity="1" />
            <Stop offset="40%" stopColor="#120028" stopOpacity="1" />
            <Stop offset="100%" stopColor="#05001A" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#cosmosBg)" />
        {/* Distant stars */}
        <Circle cx="20" cy="30" r="0.7" fill="#fff" opacity="0.4" />
        <Circle cx="65" cy="15" r="0.5" fill="#fff" opacity="0.3" />
        <Circle cx="110" cy="45" r="0.8" fill="#fff" opacity="0.5" />
        <Circle cx="180" cy="20" r="0.6" fill="#fff" opacity="0.3" />
        <Circle cx="220" cy="50" r="0.9" fill="#fff" opacity="0.4" />
        <Circle cx="270" cy="30" r="0.5" fill="#fff" opacity="0.5" />
        <Circle cx="40" cy="80" r="0.6" fill="#fff" opacity="0.2" />
        <Circle cx="150" cy="70" r="0.7" fill="#fff" opacity="0.3" />
        <Circle cx="250" cy="75" r="0.4" fill="#fff" opacity="0.4" />
        <Circle cx="90" cy="180" r="0.6" fill="#fff" opacity="0.2" />
        <Circle cx="200" cy="200" r="0.5" fill="#fff" opacity="0.3" />
      </Svg>

      {/* Nebula cloud 1 — Purple/Pink */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, n1Style]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <RadialGradient id="neb1" cx="35%" cy="40%" rx="35%" ry="30%">
              <Stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
              <Stop offset="40%" stopColor="#A855F7" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="neb1b" cx="60%" cy="35%" rx="25%" ry="20%">
              <Stop offset="0%" stopColor="#F472B6" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="105" cy="100" rx="105" ry="80" fill="url(#neb1)" />
          <Ellipse cx="180" cy="90" rx="70" ry="50" fill="url(#neb1b)" />
        </Svg>
      </Animated.View>

      {/* Nebula cloud 2 — Blue/Teal */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, n2Style]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <RadialGradient id="neb2" cx="65%" cy="55%" rx="30%" ry="25%">
              <Stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
              <Stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="neb2b" cx="45%" cy="60%" rx="20%" ry="18%">
              <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="195" cy="140" rx="90" ry="65" fill="url(#neb2)" />
          <Ellipse cx="135" cy="155" rx="60" ry="45" fill="url(#neb2b)" />
        </Svg>
      </Animated.View>

      {/* Central cosmic glow */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, glowStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <RadialGradient id="centerGlow" cx="50%" cy="45%" rx="20%" ry="18%">
              <Stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#E9D5FF" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="150" cy="115" rx="60" ry="45" fill="url(#centerGlow)" />
        </Svg>
      </Animated.View>

      {/* Bright pulsing stars */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.25, left: w * 0.2 }, s1Style]}>
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path d="M8,0 L9,6 L16,8 L9,10 L8,16 L7,10 L0,8 L7,6 Z" fill="#E9D5FF" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: h * 0.5, right: w * 0.25 }, s2Style]}>
        <Svg width={12} height={12} viewBox="0 0 16 16">
          <Path d="M8,0 L9,6 L16,8 L9,10 L8,16 L7,10 L0,8 L7,6 Z" fill="#93C5FD" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: h * 0.15, right: w * 0.15 }, s1Style]}>
        <Svg width={8} height={8} viewBox="0 0 16 16">
          <Path d="M8,0 L9,6 L16,8 L9,10 L8,16 L7,10 L0,8 L7,6 Z" fill="#FDE68A" />
        </Svg>
      </Animated.View>
    </View>
  );
}
