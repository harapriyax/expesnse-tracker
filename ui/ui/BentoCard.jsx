import { View, StyleSheet } from 'react-native';
import { Radius } from '../../constants/colors';
import { useTheme } from '../../context/SettingsContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BentoCard({
  children, style, dark = false, interactive = false, index = 0, noPadding = false, ...props
}) {
  const { colors, shadows, isDark } = useTheme();

  const baseStyle = {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: dark ? 0 : 1,
    borderColor: dark ? 'transparent' : (isDark ? colors.border.subtle : 'rgba(0,0,0,0.04)'),
    ...(dark ? shadows.dark : shadows.card),
  };

  const bg = dark
    ? (isDark ? '#1A1A1A' : '#111827')
    : (isDark ? colors.surface.card : '#FFFFFF');

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).duration(350).damping(22).stiffness(200)}
      style={[baseStyle, !noPadding && styles.padding, { backgroundColor: bg }, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  padding: {
    padding: 18,
  },
});
