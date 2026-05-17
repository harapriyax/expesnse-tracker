import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Pressable, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withSpring, FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Radius, Shadows } from '../../src/constants/colors';
import AppPressable from '../../src/components/ui/AnimatedPressable';
import GradientMesh from '../../src/components/ui/GradientMesh';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { db } from '../../src/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../src/context/SettingsContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, signInWithGoogle } = useAuth();
  const { colors, shadows, isDark } = useTheme();
  const iconScale = useSharedValue(1);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await register(email, password);
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid, 'profile', 'info'), {
        name: name.trim(),
        age: age ? parseInt(age) : null,
        createdAt: new Date().toISOString()
      });
      router.replace('/(tabs)');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setErrorMsg('That email address is already in use.');
      } else if (e.code === 'auth/invalid-email') {
        setErrorMsg('That email address is invalid.');
      } else if (e.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      // Create profile if it doesn't exist yet
      const profileRef = doc(db, 'users', userCredential.user.uid, 'profile', 'info');
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          name: userCredential.user.displayName || '',
          age: null,
          createdAt: new Date().toISOString()
        });
      }
      router.replace('/(tabs)');
    } catch (e) {
      if (e.message?.includes('cancelled')) {
        // User cancelled — don't show error
      } else {
        setErrorMsg(e.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
    iconScale.value = withSequence(
      withTiming(0.6, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
  };
  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }]
  }));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#000' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <GradientMesh />
      <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity activeOpacity={0.7} style={[styles.backBtn, { backgroundColor: isDark ? colors.surface.card : '#fff', ...shadows.card }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Create Account.</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Start tracking your spending.</Text>
        </View>

        {errorMsg ? (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.errorBox}>
            <AlertCircle size={16} color={colors.rose} />
            <Text style={[styles.errorText, { color: colors.rose }]}>{errorMsg}</Text>
          </Animated.View>
        ) : null}

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? colors.surface.card : '#fff', borderColor: colors.border.subtle, color: colors.text.primary, ...shadows.card }]}
            placeholder="Your name"
            placeholderTextColor={colors.text.tertiary}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? colors.surface.card : '#fff', borderColor: colors.border.subtle, color: colors.text.primary, ...shadows.card }]}
            placeholder="Age (optional)"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="number-pad"
            maxLength={3}
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? colors.surface.card : '#fff', borderColor: colors.border.subtle, color: colors.text.primary, ...shadows.card }]}
            placeholder="Email address"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? colors.surface.card : '#fff', borderColor: colors.border.subtle, color: colors.text.primary, paddingRight: 50, ...shadows.card }]}
              placeholder="Password"
              placeholderTextColor={colors.text.tertiary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable style={styles.eyeBtn} onPress={togglePassword}>
              <Animated.View style={iconAnimStyle}>
                {showPassword
                  ? <EyeOff size={20} color={colors.text.tertiary} />
                  : <Eye size={20} color={colors.text.tertiary} />}
              </Animated.View>
            </Pressable>
          </View>

          <AppPressable style={[styles.submitBtn, { backgroundColor: colors.text.primary, ...shadows.button }]} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={isDark ? '#000' : '#fff'} />
            ) : (
              <Text style={[styles.submitText, { color: isDark ? '#000' : '#fff' }]}>Sign Up</Text>
            )}
          </AppPressable>

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border.subtle }]} />
            <Text style={[styles.dividerText, { color: colors.text.tertiary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border.subtle }]} />
          </View>

          <AppPressable style={[styles.googleBtn, { backgroundColor: isDark ? colors.surface.card : '#fff', borderColor: colors.border.subtle, ...shadows.card }]} onPress={handleGoogleSignIn} disabled={loading}>
            <Text style={[styles.googleText, { color: colors.text.primary }]}>Continue with Google</Text>
          </AppPressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: Radius.xl,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
    ...Shadows.card,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    ...Typography.headingXL,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  form: {
    gap: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: Radius.xl,
    paddingHorizontal: 20,
    paddingVertical: 18,
    ...Typography.body,
    ...Shadows.card,
  },
  passwordWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: 18,
    top: 18,
    padding: 2,
  },
  submitBtn: {
    backgroundColor: Colors.text.primary,
    borderRadius: Radius.xl,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Shadows.button,
  },
  submitText: {
    ...Typography.bodyBold,
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.subtle,
  },
  dividerText: {
    ...Typography.label,
    marginHorizontal: 16,
    color: Colors.text.tertiary,
  },
  googleBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: Radius.xl,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  googleText: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  linkText: {
    ...Typography.bodyBold,
    color: Colors.accent,
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: Radius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
  },
});
