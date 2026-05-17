import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ArrowRight, Wallet, BarChart3, PieChart, TrendingUp } from 'lucide-react-native';
import PeacefulLandscape from '../src/components/ui/PeacefulLandscape';
import SoothingForest from '../src/components/ui/SoothingForest';
import StarryNight from '../src/components/ui/StarryNight';

const { width: SCREEN_W } = Dimensions.get('window');
const ONBOARDING_KEY = 'spendwise_onboarding_complete';

// Muted, earthy monochrome palette — no neon
const MUTED = {
  icon: 'rgba(255,255,255,0.55)',
  iconBg: 'rgba(255,255,255,0.06)',
  cardBg: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.05)',
  text: '#D1D5DB',
  textMuted: '#6B7280',
  dot: 'rgba(255,255,255,0.35)',
};

// ─── Feature Row ───
function FeatureRow({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)} style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Icon size={17} color={MUTED.icon} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Dot Indicator ───
function DotIndicator({ activeIndex, count }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [page, setPage] = useState(0);
  const insets = useSafeAreaInsets();

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SCREEN_W);
    setPage(idx);
  };

  const goNext = () => {
    if (page < 2) {
      scrollRef.current?.scrollTo({ x: (page + 1) * SCREEN_W, animated: true });
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {}
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {/* ━━━ PAGE 1: Welcome ━━━ */}
        <View style={styles.page}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Animated.View entering={FadeIn.duration(1200)} style={[styles.fluidHeader, { paddingTop: insets.top + 20 }]}>
              <PeacefulLandscape size={SCREEN_W} />
            </Animated.View>

            <View style={styles.pageInner}>
              <Animated.Text entering={FadeInDown.delay(600).duration(700)} style={styles.welcomeTitle}>
                Welcome to{'\n'}
                <Text style={styles.brandName}>SpendWise</Text>
              </Animated.Text>

              <Animated.Text entering={FadeInDown.delay(900).duration(600)} style={styles.welcomeSub}>
                Your personal finance tracker.{'\n'}Log, analyze, and control your spending — beautifully.
              </Animated.Text>

              <Animated.View entering={FadeInDown.delay(1200).duration(500)} style={styles.tagPill}>
                <View style={styles.tagDot} />
                <Text style={styles.tagText}>Your finances, simplified</Text>
              </Animated.View>
            </View>
          </ScrollView>
        </View>

        {/* ━━━ PAGE 2: Track Every Rupee ━━━ */}
        <View style={styles.page}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Animated.View entering={FadeIn.duration(1200)} style={[styles.fluidHeader, { paddingTop: insets.top + 20, height: SCREEN_W * 0.75 }]}>
              <SoothingForest size={SCREEN_W} />
            </Animated.View>

            <View style={styles.pageInner}>
              <Animated.Text entering={FadeInDown.delay(400).duration(600)} style={styles.pageTitle}>
                Track Every{'\n'}Rupee
              </Animated.Text>

              <Animated.Text entering={FadeInDown.delay(600).duration(500)} style={styles.pageSub}>
                Log expenses instantly with smart{'\n'}categories and detailed breakdowns.
              </Animated.Text>

              <View style={styles.features}>
                <FeatureRow icon={Wallet} delay={700}
                  title="Instant Logging"
                  desc="Add expenses in seconds with amount, category & date"
                />
                <FeatureRow icon={PieChart} delay={850}
                  title="Category Breakdown"
                  desc="See spending by food, transport, bills, shopping & more"
                />
                <FeatureRow icon={BarChart3} delay={1000}
                  title="Visual Charts"
                  desc="Beautiful line charts and donut graphs of your spending"
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* ━━━ PAGE 3: Stay In Control ━━━ */}
        <View style={styles.page}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Animated.View entering={FadeIn.duration(1200)} style={[styles.fluidHeader, { paddingTop: insets.top + 20, height: SCREEN_W * 0.75 }]}>
              <StarryNight size={SCREEN_W} />
            </Animated.View>

            <View style={styles.pageInner}>
              <Animated.Text entering={FadeInDown.delay(500).duration(600)} style={styles.pageTitle}>
                Stay In{'\n'}Control
              </Animated.Text>

              <Animated.Text entering={FadeInDown.delay(700).duration(500)} style={styles.pageSub}>
                Daily and monthly views keep you{'\n'}informed about your financial health.
              </Animated.Text>

              <View style={styles.features}>
                <FeatureRow icon={TrendingUp} delay={800}
                  title="Spending Trends"
                  desc="Track 7-day and monthly spending patterns at a glance"
                />
                <FeatureRow icon={Wallet} delay={950}
                  title="Daily & Monthly Totals"
                  desc="Switch between today's spend and full month overview"
                />
                <FeatureRow icon={BarChart3} delay={1100}
                  title="Smart Stats"
                  desc="Average daily spend, highest day, and active spending days"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* ━━ Bottom ━━ */}
      <View style={styles.bottomBar}>
        <DotIndicator activeIndex={page} count={3} />

        {page < 2 ? (
          <Pressable
            style={({ pressed }) => [styles.arrowBtn, pressed && { transform: [{ scale: 0.93 }], opacity: 0.8 }]}
            onPress={goNext}
          >
            <ArrowRight size={22} color="#111" strokeWidth={2.5} />
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.getStartedBtn, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
            onPress={completeOnboarding}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <ArrowRight size={18} color="#111" strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    width: SCREEN_W,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  fluidHeader: {
    width: SCREEN_W,
    alignItems: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  pageInner: {
    paddingHorizontal: 28,
  },
  welcomeTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 34,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: -0.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  brandName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 44,
    color: '#E5E7EB',
    letterSpacing: -1.5,
  },
  welcomeSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 16,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tagText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.5,
  },

  // ─── Pages 2 & 3 ───
  pageTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    color: '#E5E7EB',
    letterSpacing: -1,
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 12,
  },
  pageSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 28,
  },

  // ─── Features ───
  features: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: MUTED.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: MUTED.cardBorder,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: MUTED.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: MUTED.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: MUTED.textMuted,
    lineHeight: 17,
  },

  // ─── Bottom ───
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 50,
    paddingTop: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    width: 24,
    borderRadius: 4,
  },
  arrowBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  getStartedText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#111827',
    letterSpacing: -0.3,
  },
});
