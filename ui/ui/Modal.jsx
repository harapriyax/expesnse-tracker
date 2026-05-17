import { View, Text, StyleSheet, Modal as RNModal, Pressable, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Typography } from '../../constants/colors';
import { useTheme } from '../../context/SettingsContext';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Modal({ isOpen, onClose, title, children }) {
  const insets = useSafeAreaInsets();
  let themeCtx;
  try { themeCtx = useTheme(); } catch { themeCtx = null; }
  const colors = themeCtx?.colors || Colors;
  const isDark = themeCtx?.isDark || false;

  if (!isOpen) return null;

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(252, 253, 253, 0.85)' }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Animated.View
          entering={SlideInDown.duration(400).easing(Easing.out(Easing.poly(3)))}
          exiting={SlideOutDown.duration(250)}
          style={[styles.content, {
            paddingBottom: insets.bottom + 20,
            backgroundColor: isDark ? colors.surface.card : Colors.surface.card,
            borderColor: colors.border.subtle,
          }]}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border.strong }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.subtle }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? colors.surface.active : Colors.surface.active }]}>
              <X size={18} color={colors.text.tertiary} />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
            <View style={{ height: 20 }} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderWidth: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
});
