// Solace Design System — Premium Tokens
import { StyleSheet } from 'react-native';

export const Colors = {
  // Surface layers - pristine light mode
  surface: {
    bg: '#F9FAFB',
    card: '#FFFFFF',
    hover: '#F3F4F6',
    active: '#E5E7EB',
  },

  // Dark focal anchor cards
  slate: {
    bg: '#0A0A0A',
    card: 'rgba(10, 10, 10, 0.90)',
    hover: '#171717',
  },

  // Borders
  border: {
    subtle: 'rgba(0, 0, 0, 0.04)',
    strong: 'rgba(0, 0, 0, 0.08)',
    focus: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },

  // Text (light surfaces)
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
  },

  // Text (dark surfaces)
  textDark: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
  },

  // Premium Accent palette
  accent: '#2563EB',
  accentHover: '#3B82F6',
  rose: '#F43F5E',
  mint: '#10B981',
  amber: '#F59E0B',
  indigo: '#6366F1',
  purple: '#8B5CF6',

  // Semantic
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// ─── OLED Dark Palette ─────────────────────────
export const DarkColors = {
  surface: {
    bg: '#000000',
    card: '#111111',
    hover: '#1A1A1A',
    active: '#2A2A2A',
  },
  slate: {
    bg: '#000000',
    card: '#111111',
    hover: '#1A1A1A',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    tertiary: '#6B7280',
  },
  textDark: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
  },
  accent: '#3B82F6',
  accentHover: '#60A5FA',
  rose: '#FB7185',
  mint: '#34D399',
  amber: '#FBBF24',
  indigo: '#818CF8',
  purple: '#A78BFA',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Returns the correct color palette based on theme
export function getThemeColors(isDark) {
  return isDark ? DarkColors : Colors;
}

// Dark-aware shadows
export function getThemeShadows(isDark) {
  if (isDark) {
    return {
      card: { elevation: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
      cardHover: { elevation: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
      dark: { elevation: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
      button: { elevation: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    };
  }
  return Shadows;
}

// Premium Stripe-like soft shadows (Nullifying Android's muddy elevation)
export const Shadows = {
  card: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardHover: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  dark: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
};

// Hyper-modern UI Typography
export const Typography = {
  headingXL: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 40,
    letterSpacing: -1,
    lineHeight: 44,
    color: Colors.text.primary,
  },
  headingLG: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 30,
    letterSpacing: -0.75,
    lineHeight: 36,
    color: Colors.text.primary,
  },
  headingMD: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    letterSpacing: -0.5,
    color: Colors.text.primary,
  },
  statBig: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 56,
    letterSpacing: -2,
    lineHeight: 56,
    color: Colors.text.primary,
  },
  statMD: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 28,
    letterSpacing: -1,
    lineHeight: 28,
    color: Colors.text.primary,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.text.tertiary,
  },
  body: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: Colors.text.primary,
  },
  bodyBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: Colors.text.primary,
  },
};

// Spacing scale
export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20,
  '2xl': 24, '3xl': 32, '4xl': 40, '5xl': 48,
};

// Border radius
export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 20,
  '2xl': 24, '3xl': 32, full: 999,
};
