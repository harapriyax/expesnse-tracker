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

export default function FloatingPetals({ size = 280 }) {
  const petal1 = useSharedValue(0);
  const petal2 = useSharedValue(0);
  const petal3 = useSharedValue(0);
  const petal4 = useSharedValue(0);
  const petal5 = useSharedValue(0);
  const breeze = useSharedValue(0);

  useEffect(() => {
    petal1.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.linear }), -1, false);
    petal2.value = withDelay(800, withRepeat(withTiming(1, { duration: 6500, easing: Easing.linear }), -1, false));
    petal3.value = withDelay(1600, withRepeat(withTiming(1, { duration: 4500, easing: Easing.linear }), -1, false));
    petal4.value = withDelay(2400, withRepeat(withTiming(1, { duration: 7000, easing: Easing.linear }), -1, false));
    petal5.value = withDelay(3200, withRepeat(withTiming(1, { duration: 5500, easing: Easing.linear }), -1, false));

    breeze.value = withRepeat(withSequence(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const makePetalStyle = (val, startX, endX, swayAmp) => useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: interpolate(val.value, [0, 0.25, 0.5, 0.75, 1], [startX, startX + swayAmp, endX, endX - swayAmp * 0.5, endX + swayAmp * 0.3]) },
      { translateY: interpolate(val.value, [0, 1], [-20, size * 0.85 + 20]) },
      { rotate: `${interpolate(val.value, [0, 1], [0, 720])}deg` },
      { scaleX: interpolate(val.value, [0, 0.5, 1], [1, 0.6, 1]) },
    ],
    opacity: interpolate(val.value, [0, 0.05, 0.85, 1], [0, 0.9, 0.9, 0]),
  }));

  const breezeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breeze.value, [0, 1], [0.15, 0.3]),
    transform: [{ translateX: interpolate(breeze.value, [0, 1], [-5, 5]) }],
  }));

  const w = size;
  const h = size * 0.85;

  const PetalSvg = ({ color, sz }) => (
    <Svg width={sz} height={sz} viewBox="0 0 24 24">
      <Path d="M12,2 C14,6 18,8 18,13 C18,17 15,20 12,22 C9,20 6,17 6,13 C6,8 10,6 12,2 Z" fill={color} opacity="0.85" />
      <Path d="M12,6 C12,6 14,10 12,18" fill="none" stroke={color === '#FBBAD3' ? '#E88AAF' : '#D4729B'} strokeWidth="0.5" opacity="0.4" />
    </Svg>
  );

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sky gradient */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="petalSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF0F5" stopOpacity="1" />
            <Stop offset="50%" stopColor="#FFE4EF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F8D0E0" stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#petalSky)" />
      </Svg>

      {/* Branch */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Path d="M-20,60 Q60,40 120,70 T220,50 T310,80" fill="none" stroke="#8B6C5C" strokeWidth="3" opacity="0.6" />
        <Path d="M120,70 Q130,40 140,30" fill="none" stroke="#8B6C5C" strokeWidth="2" opacity="0.5" />
        <Path d="M180,55 Q185,35 195,25" fill="none" stroke="#8B6C5C" strokeWidth="1.5" opacity="0.4" />

        {/* Static blossoms on branch */}
        <Circle cx="60" cy="48" r="6" fill="#FFB7D5" opacity="0.7" />
        <Circle cx="62" cy="46" r="4" fill="#FFC8DF" opacity="0.8" />
        <Circle cx="100" cy="58" r="7" fill="#FFB7D5" opacity="0.6" />
        <Circle cx="102" cy="56" r="5" fill="#FFDCE8" opacity="0.8" />
        <Circle cx="145" cy="48" r="5" fill="#FFB7D5" opacity="0.7" />
        <Circle cx="190" cy="52" r="6" fill="#FFC8DF" opacity="0.6" />
        <Circle cx="192" cy="50" r="4" fill="#FFE0ED" opacity="0.8" />
        <Circle cx="230" cy="56" r="5" fill="#FFB7D5" opacity="0.5" />

        {/* Soft ground */}
        <Path d="M0,220 Q75,210 150,225 Q225,240 300,215 L300,255 L0,255 Z" fill="#F0D4C8" opacity="0.3" />
      </Svg>

      {/* Breeze highlight */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, breezeStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <RadialGradient id="blossomGlow" cx="50%" cy="30%" rx="40%" ry="30%">
              <Stop offset="0%" stopColor="#FF69B4" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#FF69B4" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="150" cy="80" rx="120" ry="60" fill="url(#blossomGlow)" />
        </Svg>
      </Animated.View>

      {/* Floating petals */}
      <Animated.View style={makePetalStyle(petal1, w * 0.15, w * 0.35, 25)}>
        <PetalSvg color="#FBBAD3" sz={14} />
      </Animated.View>
      <Animated.View style={makePetalStyle(petal2, w * 0.7, w * 0.55, 30)}>
        <PetalSvg color="#F5A0C0" sz={12} />
      </Animated.View>
      <Animated.View style={makePetalStyle(petal3, w * 0.45, w * 0.6, 20)}>
        <PetalSvg color="#FFD0E0" sz={10} />
      </Animated.View>
      <Animated.View style={makePetalStyle(petal4, w * 0.85, w * 0.7, 18)}>
        <PetalSvg color="#FBBAD3" sz={11} />
      </Animated.View>
      <Animated.View style={makePetalStyle(petal5, w * 0.3, w * 0.15, 22)}>
        <PetalSvg color="#F5A0C0" sz={13} />
      </Animated.View>
    </View>
  );
}
