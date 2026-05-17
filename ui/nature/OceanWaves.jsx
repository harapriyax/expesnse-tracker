import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
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
 * OceanWaves — Calm seashore with rolling waves and seagulls
 */
export default function OceanWaves({ size = 280 }) {
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const foam = useSharedValue(0);
  const bird1 = useSharedValue(0);
  const bird2 = useSharedValue(0);

  useEffect(() => {
    wave1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
    wave2.value = withDelay(800, withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    ));
    foam.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
    bird1.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false
    );
    bird2.value = withDelay(2000, withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.linear }), -1, false
    ));
  }, []);

  const waveStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(wave1.value, [0, 1], [0, 8]) }],
  }));
  const waveStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(wave2.value, [0, 1], [0, -6]) }],
  }));
  const foamStyle = useAnimatedStyle(() => ({
    opacity: interpolate(foam.value, [0, 1], [0.3, 0.7]),
  }));
  const birdStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(bird1.value, [0, 1], [-20, size + 20]) },
      { translateY: interpolate(bird1.value, [0, 0.5, 1], [0, -15, 0]) },
    ],
    opacity: interpolate(bird1.value, [0, 0.05, 0.9, 1], [0, 1, 1, 0]),
  }));
  const birdStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(bird2.value, [0, 1], [-30, size + 30]) },
      { translateY: interpolate(bird2.value, [0, 0.5, 1], [0, -10, 5]) },
    ],
    opacity: interpolate(bird2.value, [0, 0.05, 0.9, 1], [0, 0.7, 0.7, 0]),
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Ocean sky */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="oceanSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1a1a3e" stopOpacity="1" />
            <Stop offset="40%" stopColor="#2d3a6e" stopOpacity="1" />
            <Stop offset="70%" stopColor="#4a6fa5" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#c7a17a" stopOpacity="0.5" />
          </LinearGradient>
        </Defs>
        <Path d="M0,0 L300,0 L300,255 L0,255 Z" fill="url(#oceanSky)" />

        {/* Horizon glow */}
        <Ellipse cx="150" cy="145" rx="180" ry="25" fill="#e8985a" opacity="0.2" />
      </Svg>

      {/* Waves Layer 1 - back */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, width: w, height: h }, waveStyle1]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <LinearGradient id="wave1" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1a3a5e" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#0c1e33" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path d="M0,160 Q50,145 100,160 T200,155 T300,165 L300,255 L0,255 Z" fill="url(#wave1)" />
        </Svg>
      </Animated.View>

      {/* Waves Layer 2 - mid */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, width: w, height: h }, waveStyle2]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Defs>
            <LinearGradient id="wave2" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1e4a70" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#0a1828" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path d="M0,175 Q60,165 120,178 T240,170 T300,180 L300,255 L0,255 Z" fill="url(#wave2)" />
        </Svg>
      </Animated.View>

      {/* Waves Layer 3 - front */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, width: w, height: h }, waveStyle1]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Path d="M0,195 Q40,188 80,198 T160,192 T240,200 T300,194 L300,255 L0,255 Z" fill="#060e18" />
        </Svg>
      </Animated.View>

      {/* Foam shimmer */}
      <Animated.View style={[{ position: 'absolute', bottom: 0, width: w, height: h }, foamStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
          <Path d="M10,195 Q50,190 90,196" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <Path d="M120,192 Q160,188 200,194" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <Path d="M230,196 Q260,192 290,198" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </Svg>
      </Animated.View>

      {/* Seagulls */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.2 }, birdStyle1]}>
        <Svg width={20} height={10} viewBox="0 0 20 10">
          <Path d="M0,5 Q5,0 10,5 Q15,0 20,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: h * 0.28 }, birdStyle2]}>
        <Svg width={15} height={8} viewBox="0 0 15 8">
          <Path d="M0,4 Q4,0 7.5,4 Q11,0 15,4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </Svg>
      </Animated.View>

      {/* Stars */}
      <Svg width={w} height={h * 0.5} viewBox="0 0 300 120" style={{ position: 'absolute', top: 0 }}>
        <Circle cx="50" cy="25" r="1" fill="#fff" opacity="0.3" />
        <Circle cx="180" cy="15" r="1.2" fill="#fff" opacity="0.4" />
        <Circle cx="270" cy="40" r="0.8" fill="#fff" opacity="0.25" />
        <Circle cx="100" cy="35" r="1" fill="#fff" opacity="0.35" />
      </Svg>
    </View>
  );
}
