import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withTiming,
  Easing, LinearTransition
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../../context/SettingsContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Hyperresponsive: instant snap-in, springy release
const SMOOTH_IN = { duration: 60, easing: Easing.out(Easing.cubic) };
const SMOOTH_OUT = { duration: 180, easing: Easing.out(Easing.poly(4)) };

export default function AppPressable({
  children, onPress, style, haptic = true, scaleDown = 0.96, disabled = false, ...props
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const { settings } = useSettings();
  const hapticsEnabled = settings?.hapticsEnabled ?? true;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(scaleDown, SMOOTH_IN);
    opacity.value = withTiming(0.75, SMOOTH_IN);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, SMOOTH_OUT);
    opacity.value = withTiming(1, SMOOTH_OUT);
  };

  const handlePress = () => {
    if (disabled) return;
    if (haptic && hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      layout={LinearTransition.duration(200).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
