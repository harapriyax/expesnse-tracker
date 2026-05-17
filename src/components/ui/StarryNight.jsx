import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export default function StarryNight({ size = 280 }) {
  const twinkle1 = useSharedValue(0);
  const twinkle2 = useSharedValue(0);
  const shootingStar = useSharedValue(0);
  const moonGlow = useSharedValue(0);

  useEffect(() => {
    // Star twinkling
    const twinkle = (val, duration) => {
      val.value = withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
    };

    twinkle(twinkle1, 2000);
    setTimeout(() => twinkle(twinkle2, 3000), 500);

    // Shooting star
    shootingStar.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 }), // Reset instantly
        withTiming(0, { duration: 5000 }) // Wait before next
      ), -1, false
    );

    // Moon glow
    moonGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, []);

  const createTwinkleStyle = (animVal) => useAnimatedStyle(() => ({
    opacity: interpolate(animVal.value, [0, 1], [0.2, 0.8]),
    transform: [{ scale: interpolate(animVal.value, [0, 1], [0.8, 1.2]) }]
  }));

  const shootingStarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shootingStar.value, [0, 1], [size * 0.8, -size * 0.2]) },
      { translateY: interpolate(shootingStar.value, [0, 1], [-20, size * 0.5]) }
    ],
    opacity: interpolate(shootingStar.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(moonGlow.value, [0, 1], [0.5, 0.9]),
    transform: [{ scale: interpolate(moonGlow.value, [0, 1], [1, 1.1]) }]
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sky Base */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0B0F19" stopOpacity="1" />
            <Stop offset="60%" stopColor="#1A183A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#2E1C40" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>
        <Path d="M0,0 L300,0 L300,255 L0,255 Z" fill="url(#nightSky)" />
        
        {/* Subtle Aurora */}
        <Path d="M-50,150 Q100,50 200,100 T400,0" fill="none" stroke="#2DD4BF" strokeWidth="40" opacity="0.05" filter="blur(10px)" />
        <Path d="M-50,200 Q150,100 250,150 T400,50" fill="none" stroke="#818CF8" strokeWidth="50" opacity="0.05" filter="blur(15px)" />
      </Svg>

      {/* Moon */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.15, right: w * 0.2 }, moonStyle]}>
        <Svg width={60} height={60} viewBox="0 0 60 60">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="30" cy="30" r="30" fill="url(#glow)" />
          <Circle cx="30" cy="30" r="12" fill="#F8FAFC" />
          {/* Craters */}
          <Circle cx="26" cy="26" r="3" fill="#CBD5E1" opacity="0.5" />
          <Circle cx="34" cy="32" r="2" fill="#CBD5E1" opacity="0.4" />
        </Svg>
      </Animated.View>

      {/* Static Stars */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
         <Circle cx="30" cy="40" r="1" fill="#fff" opacity="0.3" />
         <Circle cx="120" cy="20" r="1.5" fill="#fff" opacity="0.4" />
         <Circle cx="250" cy="60" r="0.8" fill="#fff" opacity="0.5" />
         <Circle cx="80" cy="90" r="1.2" fill="#fff" opacity="0.2" />
         <Circle cx="200" cy="110" r="1" fill="#fff" opacity="0.3" />
         <Circle cx="150" cy="50" r="0.5" fill="#fff" opacity="0.6" />
      </Svg>

      {/* Twinkling Stars */}
      <Animated.View style={[{ position: 'absolute', top: h * 0.2, left: w * 0.1 }, createTwinkleStyle(twinkle1)]}>
        <Svg width={10} height={10} viewBox="0 0 10 10">
          <Circle cx="5" cy="5" r="2" fill="#FEF08A" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: h * 0.4, right: w * 0.3 }, createTwinkleStyle(twinkle2)]}>
        <Svg width={8} height={8} viewBox="0 0 8 8">
          <Circle cx="4" cy="4" r="1.5" fill="#93C5FD" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: h * 0.1, right: w * 0.4 }, createTwinkleStyle(twinkle1)]}>
        <Svg width={6} height={6} viewBox="0 0 6 6">
          <Circle cx="3" cy="3" r="1" fill="#FFF" />
        </Svg>
      </Animated.View>

      {/* Shooting Star */}
      <Animated.View style={[{ position: 'absolute', top: 0, right: 0 }, shootingStarStyle]}>
        <Svg width={100} height={20} viewBox="0 0 100 20">
          <Defs>
            <LinearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <Stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.8" />
            </LinearGradient>
          </Defs>
          <Path d="M0,10 L95,10 L100,11 L95,12 Z" fill="url(#trail)" />
          <Circle cx="98" cy="10.5" r="2" fill="#fff" />
        </Svg>
      </Animated.View>

      {/* Silhouetted Mountains Foreground */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute', bottom: 0 }}>
         {/* Distant Hills */}
         <Path d="M0,180 Q80,140 150,190 T300,160 L300,255 L0,255 Z" fill="#1E1B4B" opacity="0.8" />
         {/* Mid Mountains */}
         <Path d="M-20,200 L60,150 L120,180 L180,130 L260,190 L320,150 L320,255 L-20,255 Z" fill="#111827" />
         {/* Foreground Pines */}
         <Path d="M10,180 L20,150 L30,180 Z" fill="#030712" />
         <Path d="M20,160 L30,130 L40,160 Z" fill="#030712" />
         <Path d="M15,190 L30,140 L45,190 Z" fill="#030712" />

         <Path d="M260,190 L275,140 L290,190 Z" fill="#030712" />
         <Path d="M275,170 L285,130 L295,170 Z" fill="#030712" />
      </Svg>
    </View>
  );
}
