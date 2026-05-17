import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export default function SoothingForest({ size = 280 }) {
  const leafFall1 = useSharedValue(0);
  const leafFall2 = useSharedValue(0);
  const leafFall3 = useSharedValue(0);
  const riverFlow = useSharedValue(0);

  useEffect(() => {
    // Leaves falling
    const leafAnimation = (val, duration) => {
      val.value = withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1, false
      );
    };

    leafAnimation(leafFall1, 4000);
    leafAnimation(leafFall2, 5500);
    setTimeout(() => leafAnimation(leafFall3, 4500), 1000);

    // River shimmering
    riverFlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, []);

  const createLeafStyle = (animVal, startX, endX) => useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: interpolate(animVal.value, [0, 1], [startX, endX]) },
      { translateY: interpolate(animVal.value, [0, 1], [-20, size * 0.85 + 20]) },
      { rotate: `${interpolate(animVal.value, [0, 1], [0, 360])}deg` }
    ],
    opacity: interpolate(animVal.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
  }));

  const riverStyle = useAnimatedStyle(() => ({
    opacity: interpolate(riverFlow.value, [0, 1], [0.4, 0.7]),
  }));

  const w = size;
  const h = size * 0.85;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sky and distant mountains */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2c3e50" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4ca1af" stopOpacity="0.8" />
          </LinearGradient>
          <LinearGradient id="forestBack" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1e3c32" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#11221b" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path d="M0,0 L300,0 L300,255 L0,255 Z" fill="url(#skyGrad)" />
        
        {/* Sun/Light source */}
        <Circle cx="230" cy="80" r="40" fill="#f39c12" opacity="0.3" />
        <Circle cx="230" cy="80" r="25" fill="#f1c40f" opacity="0.5" />

        {/* Back Trees/Hills */}
        <Path d="M0,180 L50,140 L100,160 L150,130 L200,165 L270,120 L300,150 L300,255 L0,255 Z" fill="url(#forestBack)" />
      </Svg>

      {/* River */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2980b9" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#142a3f" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path d="M120,160 C150,180 80,210 100,255 L200,255 C160,210 220,180 180,160 Z" fill="url(#riverGrad)" />
      </Svg>

      {/* River Reflections */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, riverStyle]}>
        <Svg width={w} height={h} viewBox="0 0 300 255">
           <Ellipse cx="150" cy="190" rx="30" ry="3" fill="rgba(255,255,255,0.2)" />
           <Ellipse cx="140" cy="210" rx="40" ry="4" fill="rgba(255,255,255,0.15)" />
           <Ellipse cx="160" cy="230" rx="45" ry="4" fill="rgba(255,255,255,0.1)" />
        </Svg>
      </Animated.View>

      {/* Foreground Trees */}
      <Svg width={w} height={h} viewBox="0 0 300 255" style={{ position: 'absolute' }}>
        <Path d="M-20,100 L40,255 L-40,255 Z" fill="#0b1a14" />
        <Path d="M-10,80 L35,160 L-15,160 Z" fill="#0e241c" />
        <Path d="M10,140 L50,230 L-10,230 Z" fill="#133025" />

        <Path d="M310,90 L250,255 L350,255 Z" fill="#0b1a14" />
        <Path d="M290,130 L240,220 L320,220 Z" fill="#133025" />
      </Svg>

      {/* Animated Leaves */}
      <Animated.View style={createLeafStyle(leafFall1, w * 0.1, w * 0.3)}>
        <Svg width={12} height={12} viewBox="0 0 24 24">
          <Path d="M12,2 C12,2 20,6 20,14 C20,22 12,22 12,22 C12,22 4,22 4,14 C4,6 12,2 12,2 Z" fill="#2ecc71" opacity="0.6" />
        </Svg>
      </Animated.View>

      <Animated.View style={createLeafStyle(leafFall2, w * 0.8, w * 0.6)}>
        <Svg width={10} height={10} viewBox="0 0 24 24">
          <Path d="M12,2 C12,2 20,6 20,14 C20,22 12,22 12,22 C12,22 4,22 4,14 C4,6 12,2 12,2 Z" fill="#27ae60" opacity="0.5" />
        </Svg>
      </Animated.View>
      
      <Animated.View style={createLeafStyle(leafFall3, w * 0.5, w * 0.4)}>
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Path d="M12,2 C12,2 20,6 20,14 C20,22 12,22 12,22 C12,22 4,22 4,14 C4,6 12,2 12,2 Z" fill="#1abc9c" opacity="0.4" />
        </Svg>
      </Animated.View>
    </View>
  );
}
