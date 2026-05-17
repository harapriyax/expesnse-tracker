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

export default function RainForest({ size = 280 }) {
  const rain1 = useSharedValue(0);
  const rain2 = useSharedValue(0);
  const rain3 = useSharedValue(0);
  const rain4 = useSharedValue(0);
  const leafSway = useSharedValue(0);
  const mistDrift = useSharedValue(0);

  useEffect(() => {
    rain1.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.linear }), -1, false);
    rain2.value = withDelay(300, withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1, false));
    rain3.value = withDelay(600, withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1, false));
    rain4.value = withDelay(900, withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), -1, false));

    leafSway.value = withRepeat(withSequence(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);

    mistDrift.value = withRepeat(withSequence(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
  }, []);

  const makeRainStyle = (val, left) => useAnimatedStyle(() => ({
    position: 'absolute', left,
    transform: [{ translateY: interpolate(val.value, [0, 1], [-15, size * 0.85 + 15]) }],
    opacity: interpolate(val.value, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0]),
  }));

  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(leafSway.value, [0, 1], [-3, 3])}deg` }],
  }));

  const mistStyle = useAnimatedStyle(() => ({
    opacity: interpolate(mistDrift.value, [0, 1], [0.08, 0.2]),
    transform: [{ translateX: interpolate(mistDrift.value, [0, 1], [-20, 20]) }],
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Forest sky */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="rainSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1A2F1A" stopOpacity="1" />
            <Stop offset="40%" stopColor="#2D4A2D" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#1A3320" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="300" height="255" fill="url(#rainSky)" />
      </Svg>

      {/* Tropical leaves (swaying) */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, swayStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          {/* Big leaf top-left */}
          <Path d="M-10,30 Q40,10 80,50 Q50,60 30,80 Q10,50 -10,30 Z" fill="#2D6B3D" opacity="0.7" />
          <Path d="M-5,32 Q40,20 70,48" fill="none" stroke="#1E4D2B" strokeWidth="1" opacity="0.5" />

          {/* Big leaf top-right */}
          <Path d="M310,20 Q260,5 220,40 Q250,55 270,75 Q290,40 310,20 Z" fill="#1F5C2F" opacity="0.6" />
          <Path d="M305,22 Q260,15 230,38" fill="none" stroke="#174423" strokeWidth="1" opacity="0.4" />

          {/* Hanging vine left */}
          <Path d="M20,0 Q15,30 25,60 Q20,90 30,120" fill="none" stroke="#3D8B4F" strokeWidth="2" opacity="0.5" />
          <Ellipse cx="30" cy="125" rx="4" ry="6" fill="#2D6B3D" opacity="0.6" />
          <Ellipse cx="26" cy="115" rx="3" ry="5" fill="#3D8B4F" opacity="0.5" />

          {/* Hanging vine right */}
          <Path d="M280,0 Q285,40 275,80 Q280,110 270,140" fill="none" stroke="#3D8B4F" strokeWidth="1.5" opacity="0.4" />
          <Ellipse cx="270" cy="145" rx="3" ry="5" fill="#2D6B3D" opacity="0.5" />

          {/* Mid leaves */}
          <Path d="M60,0 Q80,-5 100,20 Q80,30 65,25 Q55,15 60,0 Z" fill="#3D8B4F" opacity="0.5" />
          <Path d="M200,0 Q220,-5 235,15 Q215,25 205,20 Q195,10 200,0 Z" fill="#2D6B3D" opacity="0.4" />
        </Svg>
      </Animated.View>

      {/* Dense understory */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="under" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1A3320" stopOpacity="0" />
            <Stop offset="100%" stopColor="#0D1A12" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path d="M0,180 Q50,160 100,185 T200,170 T300,190 L300,255 L0,255 Z" fill="url(#under)" />
        {/* Ground ferns */}
        <Path d="M20,220 Q40,200 60,225" fill="none" stroke="#2D6B3D" strokeWidth="1.5" opacity="0.3" />
        <Path d="M240,215 Q260,195 280,220" fill="none" stroke="#2D6B3D" strokeWidth="1.5" opacity="0.25" />
      </Svg>

      {/* Mist */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.5 }, mistStyle]}>
        <Svg width={w + 40} height={60} viewBox="0 0 340 60">
          <Ellipse cx="170" cy="30" rx="170" ry="25" fill="rgba(255,255,255,0.06)" />
        </Svg>
      </Animated.View>

      {/* Rain drops */}
      <Animated.View style={makeRainStyle(rain1, w * 0.15)}>
        <View style={{ width: 1.5, height: 18, backgroundColor: 'rgba(180,220,250,0.5)', borderRadius: 1 }} />
      </Animated.View>
      <Animated.View style={makeRainStyle(rain2, w * 0.4)}>
        <View style={{ width: 1, height: 14, backgroundColor: 'rgba(180,220,250,0.4)', borderRadius: 1 }} />
      </Animated.View>
      <Animated.View style={makeRainStyle(rain3, w * 0.65)}>
        <View style={{ width: 1.5, height: 20, backgroundColor: 'rgba(180,220,250,0.5)', borderRadius: 1 }} />
      </Animated.View>
      <Animated.View style={makeRainStyle(rain4, w * 0.85)}>
        <View style={{ width: 1, height: 12, backgroundColor: 'rgba(180,220,250,0.35)', borderRadius: 1 }} />
      </Animated.View>
    </View>
  );
}
