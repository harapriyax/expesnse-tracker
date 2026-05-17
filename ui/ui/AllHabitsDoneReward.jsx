import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function AllHabitsDoneReward({ onComplete }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const particlesY = useSharedValue(0);

  useEffect(() => {
    // 1. Fade in & scale up
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 })
    );

    // 2. Rotate magical rays
    rotation.value = withTiming(360, { duration: 4000, easing: Easing.linear });

    // 3. Float particles upward
    particlesY.value = withTiming(-height, { duration: 3000, easing: Easing.out(Easing.quad) });

    // 4. Fade out after 2.5s and trigger onComplete
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, () => {
        if (onComplete) runOnJS(onComplete)();
      });
    }, 2500);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 9999,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const raysStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const particlesStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateY: particlesY.value }],
    opacity: interpolate(opacity.value, [0, 1], [0, 0.8]),
  }));

  return (
    <Animated.View style={containerStyle} pointerEvents="none">
      {/* Floating particles */}
      <Animated.View style={particlesStyle}>
        <Svg width={width} height={height * 2}>
           {Array.from({ length: 30 }).map((_, i) => (
             <Circle 
               key={i}
               cx={Math.random() * width}
               cy={(Math.random() * height * 1.5) + (height * 0.5)}
               r={Math.random() * 3 + 1}
               fill="#FBBF24"
               opacity={Math.random() * 0.8 + 0.2}
             />
           ))}
        </Svg>
      </Animated.View>

      {/* Spinning Rays */}
      <Animated.View style={raysStyle}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
           {Array.from({ length: 12 }).map((_, i) => (
             <Path 
               key={i}
               d="M148,50 L152,50 L150,150 Z"
               fill="#FEF08A"
               opacity="0.5"
               transform={`rotate(${i * 30} 150 150)`}
             />
           ))}
        </Svg>
      </Animated.View>

      {/* Main Icon (Checkmark in a glowing circle) */}
      <Animated.View style={iconStyle}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="50" fill="#34D399" />
          <Circle cx="60" cy="60" r="40" fill="#10B981" />
          <Path d="M40,60 L55,75 L85,45" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
