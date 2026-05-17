import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  Easing, 
  withDelay,
  interpolate
} from 'react-native-reanimated';

// ─── MOON COMPONENT ───
export const CheeseMoon = ({ size = 60 }) => {
  // Star twinkle values
  const star1 = useSharedValue(0);
  const star2 = useSharedValue(0);
  const star3 = useSharedValue(0);
  
  // Moon levitation
  const floatY = useSharedValue(0);

  useEffect(() => {
    // Elegant gravity float
    floatY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );

    // Random twinkling stars
    const twinkle = (val, d1, d2) => {
      val.value = withDelay(
        d1,
        withRepeat(
          withSequence(
            withTiming(1, { duration: d2, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: d2 * 1.5, easing: Easing.inOut(Easing.ease) })
          ), -1, true
        )
      );
    };

    twinkle(star1, 0, 1500);
    twinkle(star2, 800, 2000);
    twinkle(star3, 400, 1200);
  }, []);

  const baseStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }]
  }));

  const star1Style = useAnimatedStyle(() => ({
    opacity: interpolate(star1.value, [0, 1], [0.2, 1]),
    transform: [{ scale: interpolate(star1.value, [0, 1], [0.5, 1.2]) }]
  }));

  const star2Style = useAnimatedStyle(() => ({
    opacity: interpolate(star2.value, [0, 1], [0.2, 1]),
    transform: [{ scale: interpolate(star2.value, [0, 1], [0.5, 1.2]) }]
  }));

  const star3Style = useAnimatedStyle(() => ({
    opacity: interpolate(star3.value, [0, 1], [0.2, 1]),
    transform: [{ scale: interpolate(star3.value, [0, 1], [0.5, 1.2]) }]
  }));

  return (
    <Animated.View style={baseStyle}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="moonTop" cx="30%" cy="30%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="moonGlow" cx="50%" cy="50%" rx="40%" ry="40%">
            <Stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Ambient Glow */}
        <Circle cx="50" cy="50" r="45" fill="url(#moonGlow)" />

        {/* Craters & Moon Body Group */}
        <G>
          <Path d="M55,10 A40,40 0 1,0 90,55 A35,35 0 0,1 55,10 Z" fill="url(#moonTop)" />
          {/* Deep Craters */}
          <Circle cx="35" cy="45" r="7" fill="#D97706" opacity="0.75" />
          <Circle cx="45" cy="67" r="5" fill="#D97706" opacity="0.65" />
          <Circle cx="55" cy="80" r="3.5" fill="#D97706" opacity="0.5" />
          <Circle cx="24" cy="55" r="3" fill="#D97706" opacity="0.6" />
          <Circle cx="36" cy="28" r="5" fill="#D97706" opacity="0.7" />
          
          {/* Crater inner shadows (3D effect) */}
          <Circle cx="36" cy="46" r="6" fill="#B45309" opacity="0.5" />
          <Circle cx="46" cy="68" r="4" fill="#B45309" opacity="0.5" />
          <Circle cx="37" cy="29" r="4" fill="#B45309" opacity="0.4" />
        </G>
      </Svg>

      {/* Stars rendered as separate Animated.Views for proper transform support */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, star1Style]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M80,18 L82,23 L87,25 L82,27 L80,32 L78,27 L73,25 L78,23 Z" fill="#FFF" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, star2Style]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M15,80 L16,83 L19,84 L16,85 L15,88 L14,85 L11,84 L14,83 Z" fill="#FFF" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, star3Style]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M88,70 L89,72 L91,73 L89,74 L88,76 L87,74 L85,73 L87,72 Z" fill="#FFF" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};

// ─── SUN COMPONENT ───
export const RadiantSun = ({ size = 60 }) => {
  const pulse = useSharedValue(0);
  const rotateInner = useSharedValue(0);
  const rotateOuter = useSharedValue(0);

  useEffect(() => {
    // Breathing aura
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );

    // Dynamic dual-layer rotation
    rotateInner.value = withRepeat(withTiming(360, { duration: 15000, easing: Easing.linear }), -1, false);
    rotateOuter.value = withRepeat(withTiming(-360, { duration: 25000, easing: Easing.linear }), -1, false);
  }, []);

  const auraStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.25]) }]
  }));

  const innerRaysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateInner.value}deg` }]
  }));

  const outerRaysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateOuter.value}deg` }]
  }));

  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const outerAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

  return (
    <View style={{ width: size, height: size }}>
      {/* Breathing Aura - wrapped in Animated.View */}
      <Animated.View style={[{ position: 'absolute', width: size, height: size, alignItems: 'center', justifyContent: 'center' }, auraStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="sunAura" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="30%" stopColor="#FDE68A" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="38" fill="url(#sunAura)" />
        </Svg>
      </Animated.View>

      {/* Outer ambient rays (counter-clockwise) */}
      <Animated.View style={[{ position: 'absolute', width: size, height: size }, outerRaysStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <G transform="translate(50,50)">
            {outerAngles.map(angle => (
              <Path key={angle} d="M-2,-26 L2,-26 L0,-40 Z" fill="#F59E0B" opacity="0.6" transform={`rotate(${angle})`} />
            ))}
          </G>
        </Svg>
      </Animated.View>

      {/* Inner strong rays (clockwise) */}
      <Animated.View style={[{ position: 'absolute', width: size, height: size }, innerRaysStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <G transform="translate(50,50)">
            {angles.map(angle => (
              <Path key={angle} d="M-4,-24 L4,-24 L0,-38 Z" fill="#FBBF24" transform={`rotate(${angle})`} />
            ))}
          </G>
        </Svg>
      </Animated.View>

      {/* Solid Core */}
      <Svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id="sunCore" cx="40%" cy="40%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
            <Stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="22" fill="url(#sunCore)" />
      </Svg>
    </View>
  );
};
