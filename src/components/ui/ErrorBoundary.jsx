import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react-native';

/**
 * ErrorBoundary — catches JS render errors and shows a premium error screen
 * Usage: Wrap any component tree with <ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console for debugging
    console.error('🔴 ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          {/* Gradient background */}
          <LinearGradient
            colors={['#000000', '#0A0A0A', '#111111', '#000000']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Decorative glow orbs */}
          <View style={styles.glowOrb1} />
          <View style={styles.glowOrb2} />

          <View style={styles.content}>
            {/* Error icon with glow */}
            <View style={styles.iconContainer}>
              <View style={styles.iconGlow} />
              <View style={styles.iconCircle}>
                <AlertTriangle size={36} color="#F43F5E" strokeWidth={2} />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred. Don't worry — your data is safe.
            </Text>

            {/* Error details card */}
            <View style={styles.errorCard}>
              <Text style={styles.errorLabel}>ERROR DETAILS</Text>
              <Text style={styles.errorMessage} numberOfLines={4}>
                {this.state.error?.message || 'Unknown error'}
              </Text>
              {this.state.errorInfo?.componentStack && (
                <Text style={styles.errorStack} numberOfLines={3}>
                  {this.state.errorInfo.componentStack.trim().split('\n').slice(0, 3).join('\n')}
                </Text>
              )}
            </View>

            {/* Actions */}
            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}
              onPress={this.handleRetry}
            >
              <RefreshCw size={18} color="#fff" strokeWidth={2.5} />
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>

            {this.props.onGoHome && (
              <Pressable
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={this.props.onGoHome}
              >
                <Home size={16} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                <Text style={styles.homeText}>Go to Dashboard</Text>
              </Pressable>
            )}

            {/* Footer branding */}
            <View style={styles.footer}>
              <Text style={styles.footerBrand}>SpendWise</Text>
              <Text style={styles.footerVersion}>v1.0.0</Text>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  glowOrb1: {
    position: 'absolute',
    top: '15%',
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(244, 63, 94, 0.06)',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '20%',
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 26,
    color: '#F9FAFB',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: 28,
  },
  errorCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 32,
  },
  errorLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(244, 63, 94, 0.7)',
    marginBottom: 10,
  },
  errorMessage: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 19,
  },
  errorStack: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#4B5563',
    marginTop: 10,
    lineHeight: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 14,
  },
  retryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#111827',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    width: '100%',
  },
  homeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    gap: 4,
  },
  footerBrand: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.1)',
    letterSpacing: 1,
  },
  footerVersion: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.06)',
  },
});
