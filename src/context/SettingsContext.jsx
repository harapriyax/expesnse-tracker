import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeColors, getThemeShadows } from '../constants/colors';

const SettingsContext = createContext();

const SETTINGS_KEY = 'spendwise_settings';

const DEFAULT_SETTINGS = {
  hapticsEnabled: true,
  soundEnabled: true,
  darkMode: false,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) setSettings(JSON.parse(stored));
      } catch (e) {
        console.warn('Settings load error:', e);
      }
      setReady(true);
    })();
  }, []);

  const updateSetting = async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Settings save error:', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, ready }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}

// ─── THEME HOOK ─────────────────────────────────
// Returns { colors, shadows, isDark } dynamically
export function useTheme() {
  const { settings } = useSettings();
  const isDark = settings.darkMode;
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const shadows = useMemo(() => getThemeShadows(isDark), [isDark]);
  return { colors, shadows, isDark };
}
