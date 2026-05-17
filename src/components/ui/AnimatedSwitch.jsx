import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing, interpolateColor
} from 'react-native-reanimated';
import { useSettings, useTheme } from '../../context/SettingsContext';
import { Colors } from '../../constants/colors';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';

export default function AnimatedSwitch({ value, onValueChange, icon: Icon, activeColor }) {
  const { isDark, colors } = useTheme();
  const { settings } = useSettings();
  const hapticsEnabled = settings?.hapticsEnabled ?? true;
  
  // Shared values for animations
  const translateX = useSharedValue(value ? 24 : 2);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withSpring(value ? 24 : 2, { 
      damping: 20, 
      stiffness: 250, 
      mass: 0.8 
    });
  }, [value]);

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 100, easing: Easing.out(Easing.cubic) });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.poly(3)) });
  };

  const handlePress = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(!value);
  };

  const trackStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      translateX.value,
      [2, 24],
      [isDark ? colors.surface.active : Colors.surface.active, activeColor || colors.accent]
    );
    return { backgroundColor: bg };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value }
      ]
    };
  });

  return (
    <Pressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          {Icon && (
            <Animated.View style={styles.iconWrap}>
               <Icon size={12} color={value ? (activeColor || colors.accent) : colors.text.tertiary} strokeWidth={3} />
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 30,
    borderRadius: 999,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
