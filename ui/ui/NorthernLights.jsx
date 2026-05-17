import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Ellipse, Rect } from 'react-native-svg';
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

export default function NorthernLights({ size = 280 }) {
  const curtain1 = useSharedValue(0);
  const curtain2 = useSharedValue(0);
  const curtain3 = useSharedValue(0);
  const starTwinkle = useSharedValue(0);

  useEffect(() => {
    curtain1.value = withRepeat(withSequence(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    curtain2.value = withDelay(1500, withRepeat(withSequence(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));

    curtain3.value = withDelay(3000, withRepeat(withSequence(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.sin) })
    ), -1, true));

    starTwinkle.value = withRepeat(withSequence(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const c1Style = useAnimatedStyle(() => ({
    opacity: interpolate(curtain1.value, [0, 1], [0.3, 0.7]),
    transform: [
      { translateX: interpolate(curtain1.value, [0, 1], [-15, 15]) },
      { scaleY: interpolate(curtain1.value, [0, 1], [0.9, 1.1]) },
    ],
  }));

  const c2Style = useAnimatedStyle(() => ({
    opacity: interpolate(curtain2.value, [0, 1], [0.2, 0.6]),
    transform: [
      { translateX: interpolate(curtain2.value, [0, 1], [10, -10]) },
      { scaleY: interpolate(curtain2.value, [0, 1], [1, 0.85]) },
    ],
  }));

  const c3Style = useAnimatedStyle(() => ({
    opacity: interpolate(curtain3.value, [0, 1], [0.15, 0.5]),
    transform: [{ translateX: interpolate(curtain3.value, [0, 1], [-8, 12]) }],
  }));

  const starsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(starTwinkle.value, [0, 1], [0.3, 0.9]),
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Dark sky */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="auroraSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#040B1A" stopOpacity="1" />
            <Stop offset="40%" stopColor="#0A1628" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0D1F3C" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#auroraSky)" />
      </Svg>

      {/* Aurora Curtain 1 — Green */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, c1Style]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <LinearGradient id="aGreen" x1="0.3" y1="0" x2="0.7" y2="1">
              <Stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
              <Stop offset="40%" stopColor="#34D399" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#34D399" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d="M40,0 Q80,40 60,120 T100,200 L140,200 Q120,120 150,60 T120,0 Z" fill="url(#aGreen)" />
          <Path d="M100,0 Q130,50 110,140 T160,220 L190,220 Q170,130 200,70 T170,0 Z" fill="url(#aGreen)" opacity="0.6" />
        </Svg>
      </Animated.View>

      {/* Aurora Curtain 2 — Purple */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, c2Style]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <LinearGradient id="aPurple" x1="0.5" y1="0" x2="0.5" y2="1">
              <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
              <Stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d="M160,0 Q190,60 170,150 T220,240 L260,240 Q240,140 270,80 T240,0 Z" fill="url(#aPurple)" />
        </Svg>
      </Animated.View>

      {/* Aurora Curtain 3 — Teal glow */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, c3Style]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <LinearGradient id="aTeal" x1="0.4" y1="0" x2="0.6" y2="1">
              <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="150" cy="60" rx="100" ry="40" fill="url(#aTeal)" />
        </Svg>
      </Animated.View>

      {/* Stars */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, starsStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Circle cx="30" cy="25" r="1.2" fill="#fff" />
          <Circle cx="80" cy="15" r="0.8" fill="#fff" />
          <Circle cx="140" cy="30" r="1" fill="#fff" />
          <Circle cx="200" cy="12" r="1.3" fill="#fff" />
          <Circle cx="260" cy="22" r="0.9" fill="#fff" />
          <Circle cx="50" cy="55" r="0.7" fill="#fff" />
          <Circle cx="230" cy="45" r="1.1" fill="#fff" />
          <Circle cx="170" cy="8" r="0.6" fill="#fff" />
        </Svg>
      </Animated.View>

      {/* Snowy mountains silhouette */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Path d="M0,200 L40,170 L80,185 L130,155 L170,175 L220,145 L270,170 L300,160 L300,255 L0,255 Z" fill="#0A1628" opacity="0.9" />
        <Path d="M130,155 L125,165 L135,163 Z" fill="rgba(255,255,255,0.15)" />
        <Path d="M220,145 L215,158 L227,155 Z" fill="rgba(255,255,255,0.12)" />
        <Path d="M-10,210 L30,190 L80,205 L130,185 L180,200 L250,180 L310,205 L310,255 L-10,255 Z" fill="#060E1D" />
      </Svg>
    </View>
  );
}
