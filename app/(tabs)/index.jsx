import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { format, parseISO, startOfMonth, endOfMonth, subDays, eachDayOfInterval, isSameMonth } from 'date-fns';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import BentoCard from '../../src/components/ui/BentoCard';
import AppPressable from '../../src/components/ui/AnimatedPressable';
import GradientMesh from '../../src/components/ui/GradientMesh';
import NatureAnimationHeader from '../../src/components/ui/NatureAnimationHeader';
import Modal from '../../src/components/ui/Modal';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useApp } from '../../src/context/AppContext';
import { getDateKey } from '../../src/utils/streaks';
import { Colors, Radius, Shadows } from '../../src/constants/colors';
import { useTheme } from '../../src/context/SettingsContext';
import { Plus, Trash2, TrendingUp, UtensilsCrossed, Car, ShoppingBag, Lightbulb, HeartPulse, Gamepad2, Package, Wallet, PlusCircle, CalendarDays, Activity } from 'lucide-react-native';

const CATS = [
  { key: 'food', label: 'Food', icon: UtensilsCrossed, color: '#f43f5e' },
  { key: 'transport', label: 'Transport', icon: Car, color: '#3b82f6' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#8b5cf6' },
  { key: 'bills', label: 'Bills', icon: Lightbulb, color: '#f59e0b' },
  { key: 'health', label: 'Health', icon: HeartPulse, color: '#10b981' },
  { key: 'entertainment', label: 'Fun', icon: Gamepad2, color: '#6366f1' },
  { key: 'other', label: 'Other', icon: Package, color: '#6b7280' },
];

const CHART_GRADIENT_START = '#8b5cf6';
const CHART_GRADIENT_END = '#6366f1';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: '', description: '', category: 'food' });
  const [view, setView] = useState('date');
  const [viewDate, setViewDate] = useState(new Date());
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [showViewPicker, setShowViewPicker] = useState(false);
  const [showExpensePicker, setShowExpensePicker] = useState(false);
  
  const insets = useSafeAreaInsets();
  const viewDateKey = format(viewDate, 'yyyy-MM-dd');
  const isViewToday = viewDateKey === getDateKey();
  const { colors, shadows, isDark } = useTheme();

  // ─── FIX: Filter expenses for the selected date ───
  const dateExp = useMemo(() => expenses.filter(e => e.date === viewDateKey), [expenses, viewDateKey]);
  const dateTotal = useMemo(() => dateExp.reduce((s, e) => s + Number(e.amount), 0), [dateExp]);

  // ─── FIX: Month calculation now uses viewDate's month, not always current month ───
  const monthExp = useMemo(() => {
    const ms = startOfMonth(viewDate);
    const me = endOfMonth(viewDate);
    return expenses.filter(e => { const d = parseISO(e.date); return d >= ms && d <= me; });
  }, [expenses, viewDate]);
  const monthTotal = useMemo(() => monthExp.reduce((s, e) => s + Number(e.amount), 0), [monthExp]);

  // ─── FIX: Corrected toggle — view is 'date' or 'month' ───
  const activeExp = view === 'date' ? dateExp : monthExp;
  const activeTotal = view === 'date' ? dateTotal : monthTotal;

  const catBreakdown = useMemo(() => {
    const b = {};
    activeExp.forEach(e => { b[e.category] = (b[e.category] || 0) + Number(e.amount); });
    return Object.entries(b).map(([k, v]) => {
      const c = CATS.find(x => x.key === k);
      return { key: k, amount: v, ...c };
    }).sort((a, b) => b.amount - a.amount);
  }, [activeExp]);
  const maxCat = Math.max(...catBreakdown.map(c => c.amount), 1);

  // ─── Chart Data ───
  const chartData = useMemo(() => {
    if (view === 'date') {
      // Show last 7 days ending on viewDate
      const days = [];
      for (let i = 6; i >= 0; i--) {
        days.push(subDays(viewDate, i));
      }
      return days.map(day => {
        const key = format(day, 'yyyy-MM-dd');
        const total = expenses.filter(e => e.date === key).reduce((s, e) => s + Number(e.amount), 0);
        return {
          value: total,
          label: format(day, 'MMM dd'),
        };
      });
    } else {
      // Show daily totals for the month of viewDate
      const ms = startOfMonth(viewDate);
      const me = endOfMonth(viewDate);
      const allDays = eachDayOfInterval({ start: ms, end: me });
      
      // Group and show every few days to keep chart readable
      const step = allDays.length > 15 ? 3 : 1;
      const grouped = [];
      for (let i = 0; i < allDays.length; i += step) {
        const chunk = allDays.slice(i, Math.min(i + step, allDays.length));
        const total = chunk.reduce((acc, day) => {
          const key = format(day, 'yyyy-MM-dd');
          return acc + expenses.filter(e => e.date === key).reduce((s, e) => s + Number(e.amount), 0);
        }, 0);
        grouped.push({
          value: total,
          label: format(chunk[0], 'MMM dd'),
        });
      }
      return grouped;
    }
  }, [expenses, view, viewDate, viewDateKey]);

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  const handleAdd = () => {
    if (!form.amount || !form.description.trim()) return;
    addExpense({ ...form, date: format(expenseDate, 'yyyy-MM-dd') });
    setForm({ amount: '', description: '', category: 'food' });
    setShowAdd(false);
  };
  
  const onViewDateChange = (event, selectedDate) => {
    setShowViewPicker(false);
    if (selectedDate) {
      setViewDate(selectedDate);
      setView('date');
    }
  };
  
  const onExpenseDateChange = (event, selectedDate) => {
    setShowExpensePicker(false);
    if (selectedDate) setExpenseDate(selectedDate);
  };

  const donutData = useMemo(() => {
    // Generate data for the donut chart from breakdown
    return catBreakdown.filter(c => c.amount > 0).map(c => ({
      value: c.amount,
      color: c.color || colors.accent,
      label: c.label,
      focused: true
    }));
  }, [catBreakdown, colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <GradientMesh scene="rain" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <NatureAnimationHeader scene="ocean" />

        {/* Cinematic Header */}
        <View style={styles.headerSection}>
          <Animated.View entering={FadeInUp.delay(200).duration(700)}>
            <Text style={[styles.headerSub, { color: isDark ? 'rgba(255,255,255,0.9)' : colors.text.secondary }]}>FINANCIAL OVERVIEW</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(350).duration(700)}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Expenses</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(450).duration(600)} style={styles.headerControls}>
            <View style={[styles.toggleBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : Colors.surface.card, borderColor: colors.border.subtle }]}>
              {[{ k: 'date', l: isViewToday ? 'Today' : format(viewDate, 'MMM d') }, { k: 'month', l: format(viewDate, 'MMMM') }].map(v => (
                <AppPressable key={v.k} onPress={() => {
                  if (v.k === 'date') setShowViewPicker(true);
                  else setView(v.k);
                }}
                  style={[styles.toggleBtn, view === v.k && [styles.toggleActive, { backgroundColor: isDark ? colors.surface.active : Colors.surface.active }]]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {v.k === 'date' && <CalendarDays size={12} color={view === v.k ? colors.text.primary : colors.text.tertiary} />}
                    <Text style={[styles.toggleText, { color: colors.text.tertiary }, view === v.k && [styles.toggleTextActive, { color: colors.text.primary }]]}>{v.l}</Text>
                  </View>
                </AppPressable>
              ))}
            </View>
            <AppPressable onPress={() => { setExpenseDate(viewDate); setShowAdd(true); }} style={[styles.addBtn, { backgroundColor: isDark ? colors.surface.card : '#111827', ...shadows.card }]}>
              <Plus size={16} color="#fff" strokeWidth={2.5} />
            </AppPressable>
          </Animated.View>
        </View>

        {showViewPicker && (
          <DateTimePicker value={viewDate} mode="date" display="default" maximumDate={new Date()} onChange={onViewDateChange} />
        )}

        {/* Total Hero */}
        <BentoCard dark index={0} style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Wallet size={24} color="#fff" strokeWidth={2} />
          </View>
          <Text style={styles.heroLabel}>{view === 'date' ? `${isViewToday ? "Today's" : format(viewDate, 'MMM d')} Total Spend` : `${format(viewDate, 'MMMM yyyy')} Total Spend`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={styles.heroCurrency}>₹</Text>
            <Text style={styles.heroAmount}>{activeTotal.toLocaleString()}</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{activeExp.length} Recorded Transaction{activeExp.length !== 1 ? 's' : ''}</Text>
          </View>
        </BentoCard>

        {/* Category Breakdown */}
        <BentoCard index={1} style={{ marginTop: 16 }}>
          <View style={styles.catHeader}>
            <Text style={[styles.labelText, { color: colors.text.tertiary }]}>SPENDING BY CATEGORY</Text>
            <TrendingUp size={14} color={colors.text.tertiary} />
          </View>
          {catBreakdown.length > 0 ? catBreakdown.map(c => {
            const Icon = c.icon || Package;
            const itemColor = c.color || colors.accent;
            return (
              <View key={c.key} style={styles.catRow}>
                <View style={[styles.catIcon, { backgroundColor: itemColor + '15' }]}>
                  <Icon size={16} color={itemColor} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.catLabelRow}>
                    <Text style={[styles.catLabel, { color: colors.text.primary }]}>{c.label}</Text>
                    <Text style={[styles.catAmount, { color: colors.text.primary }]}>₹{c.amount.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.catTrack, { backgroundColor: isDark ? colors.surface.active : Colors.surface.active }]}>
                    <View style={[styles.catFill, { width: `${(c.amount / maxCat) * 100}%`, backgroundColor: itemColor }]} />
                  </View>
                </View>
              </View>
            );
          }) : (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <View style={{ opacity: 0.2, marginBottom: 10 }}>
                <Package size={40} color={colors.text.tertiary} />
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.text.tertiary }}>No expenses to analyze.</Text>
            </View>
          )}
        </BentoCard>

        {/* Transaction List */}
        <BentoCard index={2} style={{ marginTop: 16 }}>
          <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>DETAILED TRANSACTIONS</Text>
          {activeExp.map((e, i) => {
            const c = CATS.find(x => x.key === e.category);
            const Icon = c?.icon || Package;
            return (
              <View key={e.id} style={[styles.txRow, i < activeExp.length - 1 && [styles.txBorder, { borderBottomColor: colors.border.subtle }]]}>
                <View style={[styles.txIcon, { borderColor: colors.border.subtle, backgroundColor: isDark ? colors.surface.active : '#fff' }]}>
                  <Icon size={18} color={c?.color || colors.text.secondary} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.txDesc, { color: colors.text.primary }]} numberOfLines={1}>{e.description}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Text style={[styles.txCat, { color: colors.text.secondary }]}>{c?.label || 'Other'}</Text>
                    {view === 'month' && <Text style={[styles.txDate, { color: colors.text.tertiary }]}>• {format(parseISO(e.date), 'MMM d')}</Text>}
                  </View>
                </View>
                <Text style={[styles.txAmount, { color: colors.text.primary }]}>₹{Number(e.amount).toLocaleString()}</Text>
                <AppPressable onPress={() => deleteExpense(e.id)} style={[styles.deleteBtn, { backgroundColor: isDark ? colors.surface.active : Colors.surface.active }]}>
                  <Trash2 size={14} color={colors.rose} strokeWidth={2} />
                </AppPressable>
              </View>
            );
          })}
          {activeExp.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <View style={{ opacity: 0.3, marginBottom: 10 }}>
                <Wallet size={24} color={Colors.text.tertiary} />
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.text.secondary }}>Your wallet is taking a rest.</Text>
            </View>
          )}
        </BentoCard>

        {/* ━━━ Spending Graph ━━━ */}
        <BentoCard index={3} style={{ marginTop: 16 }}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.labelText, { color: colors.text.tertiary }]}>SPENDING TREND</Text>
              <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                {view === 'date' ? 'Last 7 days' : format(viewDate, 'MMMM yyyy')}
              </Text>
            </View>
            <View style={[styles.chartIconBox, { backgroundColor: isDark ? 'rgba(56,130,246,0.15)' : 'rgba(56,130,246,0.1)' }]}>
              <Activity size={16} color="#3b82f6" strokeWidth={2.5} />
            </View>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              curved
              thickness={6}
              color="#3b82f6"
              hideDataPoints
              isAnimated
              animationDuration={1200}
              spacing={view === 'date' ? 38 : 28}
              initialSpacing={10}
              endSpacing={10}
              maxValue={maxChartValue * 1.15}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.text.tertiary }}
              xAxisLabelTextStyle={{ fontFamily: 'Inter_600SemiBold', fontSize: 9, color: colors.text.tertiary, marginTop: 4, width: 40 }}
              hideRules
              yAxisLabelPrefix="₹"
              formatYLabel={(val) => {
                const n = Number(val);
                if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
                if (n === 0) return '0';
                return `${Math.round(n)}`;
              }}
              backgroundColor="transparent"
              height={160}
              areaChart
              startFillColor="rgba(59, 130, 246, 0.4)"
              endFillColor="rgba(59, 130, 246, 0.0)"
              startOpacity={0.9}
              endOpacity={0.1}
              shadowColor="#3b82f6"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.4}
              shadowRadius={12}
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                pointerStripWidth: 2,
                pointerColor: '#3b82f6',
                radius: 6,
                pointerLabelWidth: 60,
                pointerLabelHeight: 30,
                activatePointersOnLongPress: false,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: items => {
                  return (
                    <View style={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 }}>
                      <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: isDark ? '#fff' : '#000' }}>
                        ₹{items[0].value}
                      </Text>
                    </View>
                  );
                },
              }}
            />
          </View>



          {/* Quick Stats */}
          {chartData.length > 0 && (
            <View style={[styles.quickStats, { borderTopColor: colors.border.subtle }]}>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatLabel, { color: colors.text.tertiary }]}>AVG / DAY</Text>
                <Text style={[styles.quickStatValue, { color: colors.text.primary }]}>
                  ₹{Math.round(chartData.reduce((s, d) => s + d.value, 0) / chartData.filter(d => d.value > 0).length || 0).toLocaleString()}
                </Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: colors.border.subtle }]} />
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatLabel, { color: colors.text.tertiary }]}>HIGHEST</Text>
                <Text style={[styles.quickStatValue, { color: colors.text.primary }]}>
                  ₹{Math.max(...chartData.map(d => d.value)).toLocaleString()}
                </Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: colors.border.subtle }]} />
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatLabel, { color: colors.text.tertiary }]}>DAYS</Text>
                <Text style={[styles.quickStatValue, { color: colors.text.primary }]}>
                  {chartData.filter(d => d.value > 0).length}
                </Text>
              </View>
            </View>
          )}
        </BentoCard>

        {/* ━━━ Category Distribution (Donut) ━━━ */}
        {donutData.length > 0 && (
          <BentoCard index={4} style={{ marginTop: 16 }}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.labelText, { color: colors.text.tertiary }]}>DISTRIBUTION</Text>
                <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                  {view === 'date' ? 'Today' : format(viewDate, 'MMMM')} Breakdown
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
              <PieChart
                donut
                data={donutData}
                innerRadius={60}
                radius={100}
                backgroundColor="transparent"
                centerLabelComponent={() => {
                  return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontSize: 22, color: colors.text.primary, fontFamily: 'Inter_800ExtraBold', letterSpacing: -1}}>₹{activeTotal.toLocaleString()}</Text>
                      <Text style={{fontSize: 10, color: colors.text.tertiary, fontFamily: 'Inter_600SemiBold'}}>{view === 'date' ? 'Spent' : 'Total'}</Text>
                    </View>
                  );
                }}
              />
            </View>
            
            {/* Minimal Donut Legend */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 10 }}>
               {donutData.map((d, i) => (
                 <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: d.color }} />
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.text.secondary }}>{d.label}</Text>
                 </View>
               ))}
            </View>
          </BentoCard>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Record Transaction">
        <View style={{ gap: 20 }}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>AMOUNT SPENT</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.amountCurrency}>₹</Text>
              <TextInput value={form.amount} onChangeText={t => setForm(p => ({ ...p, amount: t }))}
                placeholder="0" placeholderTextColor={Colors.text.tertiary + '30'} keyboardType="numeric"
                style={styles.amountInput} />
            </View>
          </View>
          <View>
            <Text style={styles.modalLabel}>Date</Text>
            <AppPressable onPress={() => setShowExpensePicker(true)} style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.text.primary }}>{format(expenseDate, 'MMMM d, yyyy')}</Text>
              <CalendarDays size={18} color={Colors.text.tertiary} />
            </AppPressable>
            {showExpensePicker && (
              <DateTimePicker value={expenseDate} mode="date" display="default" maximumDate={new Date()} onChange={onExpenseDateChange} />
            )}
          </View>
          <View>
            <Text style={styles.modalLabel}>What did you buy?</Text>
            <TextInput value={form.description} onChangeText={t => setForm(p => ({ ...p, description: t }))}
              placeholder="e.g. Morning Coffee" placeholderTextColor={Colors.text.tertiary}
              style={styles.input} />
          </View>
          <View>
            <Text style={styles.modalLabel}>Category</Text>
            <View style={styles.catGrid}>
              {CATS.map(c => {
                const Icon = c.icon;
                const active = form.category === c.key;
                return (
                  <AppPressable key={c.key} onPress={() => setForm(p => ({ ...p, category: c.key }))}
                    style={[styles.catBtn, active && { borderColor: c.color, backgroundColor: '#fff', ...Shadows.card }]}>
                    <Icon size={18} color={active ? c.color : Colors.text.tertiary} strokeWidth={2.5} />
                    <Text style={[styles.catBtnText, active && { color: Colors.text.primary }]}>{c.label}</Text>
                  </AppPressable>
                );
              })}
            </View>
          </View>
          <AppPressable onPress={handleAdd} disabled={!form.amount || !form.description.trim()}
            style={[styles.confirmBtn, (!form.amount || !form.description.trim()) && { opacity: 0.5 }]}>
            <PlusCircle size={16} color="#fff" />
            <Text style={styles.confirmText}>Confirm Transaction</Text>
          </AppPressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { paddingHorizontal: 20 },
  headerSection: { marginBottom: 20 },
  headerSub: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  toggleBox: { flexDirection: 'row', backgroundColor: Colors.surface.active, borderRadius: 12, padding: 3 },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  toggleActive: { backgroundColor: Colors.surface.card, ...Shadows.card, borderWidth: 1, borderColor: Colors.border.subtle },
  toggleText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.text.tertiary },
  toggleTextActive: { color: Colors.text.primary },
  addBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.text.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.button },

  heroCard: { alignItems: 'center', paddingVertical: 30 },
  heroIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  heroCurrency: { fontFamily: 'Inter_500Medium', fontSize: 20, color: 'rgba(255,255,255,0.7)', marginTop: 6, marginRight: 2 },
  heroAmount: { fontFamily: 'Inter_800ExtraBold', fontSize: 52, color: '#fff', letterSpacing: -1.5 },
  heroPill: { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  heroPillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.9)' },

  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  labelText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, color: Colors.text.tertiary },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  catIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catLabel: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.text.primary },
  catAmount: { fontFamily: 'Inter_800ExtraBold', fontSize: 13, color: Colors.text.primary, letterSpacing: -0.3 },
  catTrack: { height: 5, backgroundColor: Colors.surface.active, borderRadius: 999, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 999 },

  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, color: Colors.text.tertiary, borderBottomWidth: 1, borderBottomColor: Colors.border.subtle, paddingBottom: 12, marginBottom: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border.subtle },
  txIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  txDesc: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.text.primary },
  txCat: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.text.tertiary, letterSpacing: 1, textTransform: 'uppercase' },
  txDate: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.text.tertiary, letterSpacing: 0.5 },
  txAmount: { fontFamily: 'Inter_800ExtraBold', fontSize: 15, color: Colors.text.primary, marginRight: 6 },
  deleteBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: `${Colors.rose}15`, alignItems: 'center', justifyContent: 'center' },

  // ─── Chart Styles ───
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  chartSubtitle: { fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 4 },
  chartIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chartContainer: { alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  quickStats: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 16 },
  quickStatItem: { flex: 1, alignItems: 'center' },
  quickStatLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1, marginBottom: 4 },
  quickStatValue: { fontFamily: 'Inter_800ExtraBold', fontSize: 16, letterSpacing: -0.5 },
  quickStatDivider: { width: 1, height: '100%' },

  amountBox: { backgroundColor: '#fff', padding: 24, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.border.subtle, ...Shadows.card },
  amountLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, color: Colors.text.tertiary, marginBottom: 8 },
  amountCurrency: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 22, color: Colors.text.tertiary, marginRight: 4 },
  amountInput: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 46, color: Colors.text.primary, textAlign: 'center', minWidth: 100 },
  modalLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.text.secondary, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border.subtle, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.text.primary },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catBtn: { width: '31%', flexGrow: 1, alignItems: 'center', gap: 8, paddingVertical: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border.subtle },
  catBtnText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 11, color: Colors.text.tertiary },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.text.primary, borderRadius: 18, paddingVertical: 18, ...Shadows.button, width: '100%', marginBottom: 10 },
  confirmText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: '#fff' },
});
