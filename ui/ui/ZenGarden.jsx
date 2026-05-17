import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, RadialGradient, Stop, Ellipse, Rect, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export default function ZenGarden({ size = 280 }) {
  const ripple = useSharedValue(0);
  const breathe = useSharedValue(0);
  const waterDrip = useSharedValue(0);

  useEffect(() => {
    ripple.value = withRepeat(withSequence(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    breathe.value = withRepeat(withSequence(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    waterDrip.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) }),
      -1, false
    );
  }, []);

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ripple.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(ripple.value, [0, 1], [0.95, 1.05]) }],
  }));

  const breatheStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.5, 0.8]),
  }));

  const dripStyle = useAnimatedStyle(() => ({
    opacity: interpolate(waterDrip.value, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0]),
    transform: [{ translateY: interpolate(waterDrip.value, [0, 1], [0, 30]) }],
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sand base */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="sandBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F5F0E8" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E8DFD0" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#sandBg)" />
      </Svg>

      {/* Raked sand lines */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, rippleStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          {/* Concentric raked circles around the main stone */}
          <Ellipse cx="150" cy="160" rx="40" ry="16" fill="none" stroke="#D4C9B5" strokeWidth="1" opacity="0.6" />
          <Ellipse cx="150" cy="160" rx="55" ry="22" fill="none" stroke="#D4C9B5" strokeWidth="0.8" opacity="0.5" />
          <Ellipse cx="150" cy="160" rx="72" ry="29" fill="none" stroke="#D4C9B5" strokeWidth="0.7" opacity="0.4" />
          <Ellipse cx="150" cy="160" rx="90" ry="36" fill="none" stroke="#D4C9B5" strokeWidth="0.6" opacity="0.3" />
          <Ellipse cx="150" cy="160" rx="110" ry="44" fill="none" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.2" />

          {/* Straight rake lines */}
          <Line x1="0" y1="80" x2="300" y2="80" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.3" />
          <Line x1="0" y1="95" x2="300" y2="95" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.25" />
          <Line x1="0" y1="110" x2="300" y2="110" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.2" />
          <Line x1="0" y1="210" x2="300" y2="210" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.3" />
          <Line x1="0" y1="225" x2="300" y2="225" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.25" />
          <Line x1="0" y1="240" x2="300" y2="240" stroke="#D4C9B5" strokeWidth="0.5" opacity="0.2" />
        </Svg>
      </Animated.View>

      {/* Stones */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id="stone1" cx="40%" cy="35%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#9E9589" stopOpacity="1" />
            <Stop offset="100%" stopColor="#6B6358" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="stone2" cx="45%" cy="40%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#8B8178" stopOpacity="1" />
            <Stop offset="100%" stopColor="#5C544C" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* Main stone cluster */}
        <Ellipse cx="150" cy="150" rx="22" ry="16" fill="url(#stone1)" />
        <Ellipse cx="152" cy="148" rx="18" ry="12" fill="#A09888" opacity="0.3" />
        {/* Small stone */}
        <Ellipse cx="130" cy="158" rx="10" ry="7" fill="url(#stone2)" />
        {/* Tiny stone */}
        <Ellipse cx="170" cy="155" rx="6" ry="4" fill="#7A7068" />

        {/* Side stone group */}
        <Ellipse cx="70" cy="130" rx="14" ry="10" fill="url(#stone2)" />
        <Ellipse cx="60" cy="135" rx="8" ry="5" fill="#7A7068" />
      </Svg>

      {/* Bamboo fountain */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        {/* Bamboo spout */}
        <Path d="M230,50 L240,50 L240,90 L244,92 L244,100 L226,100 L226,92 L230,90 Z" fill="#6B8E23" opacity="0.7" />
        <Rect x="232" y="52" width="6" height="2" fill="#556B2F" opacity="0.4" />
        <Rect x="232" y="65" width="6" height="2" fill="#556B2F" opacity="0.4" />
        <Rect x="232" y="78" width="6" height="2" fill="#556B2F" opacity="0.4" />
        {/* Water basin */}
        <Ellipse cx="235" cy="115" rx="18" ry="8" fill="#7BA7BC" opacity="0.4" />
        <Ellipse cx="235" cy="115" rx="20" ry="9" fill="none" stroke="#6B6358" strokeWidth="3" />
      </Svg>

      {/* Water drip animation */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.38, right: w * 0.2 }, dripStyle]}>
        <Svg width={6} height={10} viewBox="0 0 6 10">
          <Path d="M3,0 C3,0 6,5 3,9 C0,5 3,0 3,0 Z" fill="#7BA7BC" opacity="0.6" />
        </Svg>
      </Animated.View>

      {/* Ambient light */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, breatheStyle]}>
        <Svg width={w} height={h * 0.5} viewBox="0 0 300 128">
          <Defs>
            <RadialGradient id="zenLight" cx="70%" cy="20%" rx="40%" ry="40%">
              <Stop offset="0%" stopColor="#FEF9E7" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#FEF9E7" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="210" cy="50" rx="120" ry="50" fill="url(#zenLight)" />
        </Svg>
      </Animated.View>
    </View>
  );
}
