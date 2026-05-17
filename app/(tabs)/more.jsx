import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppPressable from '../../src/components/ui/AnimatedPressable';
import GradientMesh from '../../src/components/ui/GradientMesh';
import NatureAnimationHeader from '../../src/components/ui/NatureAnimationHeader';

import { Colors, Radius, Shadows } from '../../src/constants/colors';
import { useTheme } from '../../src/context/SettingsContext';
import { Settings, ChevronRight } from 'lucide-react-native';

export default function More() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, shadows, isDark } = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <GradientMesh scene="clouds" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <NatureAnimationHeader scene="petals" />

        {/* Settings Card */}
        <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>ACCOUNT</Text>
        <Animated.View entering={FadeInDown.delay(0).duration(500)}>
          <AppPressable onPress={() => router.push('/settings')} style={[styles.card, { backgroundColor: isDark ? colors.surface.card : Colors.surface.card, borderColor: colors.border.subtle, ...shadows.card }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <LinearGradient colors={['#374151', '#6b7280']} style={styles.iconBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Settings size={20} color="#fff" strokeWidth={2} />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardLabel, { color: colors.text.primary }]}>Settings</Text>
                <Text style={[styles.cardDesc, { color: colors.text.tertiary }]}>Preferences, account & logout</Text>
              </View>
              <View style={[styles.arrow, { backgroundColor: isDark ? colors.surface.active : Colors.surface.active }]}>
                <ChevronRight size={14} color={colors.text.tertiary} />
              </View>
            </View>
          </AppPressable>
        </Animated.View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
          <Text style={[styles.footerBrand, { color: colors.text.primary }]}>SpendWise</Text>
          <Text style={[styles.footerTag, { color: colors.text.tertiary }]}>Your finances, simplified.</Text>
        </View>
        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { paddingHorizontal: 20 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 2, color: Colors.text.tertiary, marginBottom: 12 },

  grid: { gap: 8 },
  card: {
    backgroundColor: Colors.surface.card, borderRadius: Radius['2xl'],
    paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border.subtle,
    ...Shadows.card,
  },
  iconBox: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  cardLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.text.primary },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.text.tertiary, marginTop: 1 },
  arrow: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.surface.active, alignItems: 'center', justifyContent: 'center',
  },

  footer: {
    alignItems: 'center', marginTop: 30, paddingVertical: 20,
    borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.02)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
  },
  footerBrand: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: Colors.text.primary, marginBottom: 4 },
  footerTag: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.text.tertiary },
  copyright: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 8, letterSpacing: 0.3 },
  copyrightLink: { fontFamily: 'Inter_500Medium', textDecorationLine: 'underline' },
});
