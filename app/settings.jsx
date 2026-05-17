import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppPressable from '../src/components/ui/AnimatedPressable';
import AnimatedSwitch from '../src/components/ui/AnimatedSwitch';
import GradientMesh from '../src/components/ui/GradientMesh';
import NatureAnimationHeader from '../src/components/ui/NatureAnimationHeader';
import { Colors, Typography, Radius, Shadows } from '../src/constants/colors';
import { useAuth } from '../src/context/AuthContext';
import { useSettings, useTheme } from '../src/context/SettingsContext';
import {
  Vibrate, Volume2, Moon, LogOut, ChevronLeft, User, Shield, Info
} from 'lucide-react-native';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { colors, shadows, isDark } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of SpendWise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const toggleItems = [
    {
      key: 'hapticsEnabled',
      icon: Vibrate,
      label: 'Haptic Feedback',
      desc: 'Vibrations on button presses',
      color: '#8b5cf6',
    },
    {
      key: 'soundEnabled',
      icon: Volume2,
      label: 'Sound Effects',
      desc: 'Audio feedback for actions',
      color: '#3b82f6',
    },
    {
      key: 'darkMode',
      icon: Moon,
      label: 'Dark Mode',
      desc: 'Switch to dark appearance',
      color: '#6366F1',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GradientMesh scene="mist" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={[styles.backBtn, { backgroundColor: isDark ? colors.surface.card : '#fff', ...shadows.card }]} onPress={() => router.back()}>
          <ChevronLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <NatureAnimationHeader scene="zen" compact />

        {/* Account Card */}
        <Animated.View entering={FadeInDown.delay(0).duration(500)}>
          <View style={[styles.accountCard, { backgroundColor: isDark ? colors.surface.card : '#fff', ...shadows.card }]}>
            <View style={[styles.avatarCircle, { backgroundColor: isDark ? colors.indigo : '#111827', borderColor: isDark ? `${colors.indigo}40` : 'rgba(0,0,0,0.06)' }]}>
              <User size={24} color="#fff" strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.accountName, { color: colors.text.primary }]}>
                {user?.email || 'Guest'}
              </Text>
              <Text style={[styles.accountSub, { color: colors.text.tertiary }]}>SpendWise</Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.08)' }]}>
              <Shield size={14} color={colors.accent} />
            </View>
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>PREFERENCES</Text>
          <View style={[styles.settingsGroup, { backgroundColor: isDark ? colors.surface.card : '#fff', ...shadows.card }]}>
            {toggleItems.map((item, i) => (
              <View
                key={item.key}
                style={[
                  styles.settingRow,
                  i < toggleItems.length - 1 && [styles.settingRowBorder, { borderBottomColor: colors.border.subtle }],
                ]}
              >
                <View
                  style={[styles.settingIcon, { backgroundColor: item.color }]}
                >
                  <item.icon size={16} color="#fff" strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, { color: colors.text.primary }]}>{item.label}</Text>
                  <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>{item.desc}</Text>
                </View>
                <AnimatedSwitch
                  value={settings[item.key]}
                  onValueChange={(val) => updateSetting(item.key, val)}
                  activeColor={item.color}
                  icon={item.icon}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>ABOUT</Text>
          <View style={[styles.settingsGroup, { backgroundColor: isDark ? colors.surface.card : '#fff', ...shadows.card }]}>
            <View style={styles.settingRow}>
              <View
                style={[styles.settingIcon, { backgroundColor: Colors.mint }]}
              >
                <Info size={16} color="#fff" strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Version</Text>
                <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>SpendWise v1.0.0</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(240).duration(500)}>
          <AppPressable style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#F43F5E" strokeWidth={2.5} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </AppPressable>
        </Animated.View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  /* Account */
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: Radius['2xl'],
    padding: 20,
    gap: 14,
    marginBottom: 28,
    ...Shadows.card,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  accountSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Sections */
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.text.tertiary,
    marginBottom: 10,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderRadius: Radius['2xl'],
    paddingHorizontal: 16,
    marginBottom: 28,
    ...Shadows.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  settingDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 1,
  },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(244, 63, 94, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.12)',
    borderRadius: Radius['2xl'],
    paddingVertical: 18,
  },
  logoutText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#F43F5E',
  },
});
