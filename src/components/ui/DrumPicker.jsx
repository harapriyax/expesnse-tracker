import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { useTheme } from '../../context/SettingsContext';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;

// Extracted to its own component so hooks are called at the top level
function DrumItem({ item, index, scrollY, textPrimary, getLabel }) {
  const itemIndex = index - 1; // logical index

  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollY.value - itemIndex * ITEM_HEIGHT);
    const scale = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1.1, 0.6, 0.4], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1, 0.3, 0.1], Extrapolation.CLAMP);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.item, { height: ITEM_HEIGHT }]}>
      <Animated.Text style={[styles.baseText, { color: textPrimary }, animatedStyle]}>
        {getLabel(item)}
      </Animated.Text>
    </View>
  );
}

export default function DrumPicker({
  data = [],
  selectedValue,
  onValueChange,
  width = 68,
  formatLabel,
}) {
  let themeCtx;
  try { themeCtx = useTheme(); } catch { themeCtx = null; }
  const colors = themeCtx?.colors;

  const textPrimary = colors?.text?.primary || '#F9FAFB';

  const scrollY = useSharedValue(0);
  const listRef = useRef();

  // Create pad items: one empty item at top, one at bottom
  const extendedData = ['', ...data, ''];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const getLabel = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    if (formatLabel) return formatLabel(value);
    return String(value).padStart(2, '0');
  };

  const handleMomentumScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    let index = Math.round(y / ITEM_HEIGHT);
    if (index < 0) index = 0;
    if (index >= data.length) index = data.length - 1;
    
    if (data[index] !== selectedValue) {
      onValueChange(data[index]);
    }
  };

  const renderItem = ({ item, index }) => {
    if (item === '') {
      return <View style={{ height: ITEM_HEIGHT }} />;
    }

    return (
      <DrumItem
        item={item}
        index={index}
        scrollY={scrollY}
        textPrimary={textPrimary}
        getLabel={getLabel}
      />
    );
  };

  return (
    <View style={[styles.container, { width, height: ITEM_HEIGHT * VISIBLE_ITEMS }]}>
      <Animated.FlatList
        ref={listRef}
        data={extendedData}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={Math.max(0, data.indexOf(selectedValue))}
        renderItem={renderItem}
        style={{ flex: 1, width: '100%' }}
      />
    </View>
  );
}

// ─── TimeDrumPicker: Hours + Minutes side by side ───
export function TimeDrumPicker({ hours, minutes, onHoursChange, onMinutesChange }) {
  let themeCtx;
  try { themeCtx = useTheme(); } catch { themeCtx = null; }
  const colors = themeCtx?.colors;

  const hourData = Array.from({ length: 24 }, (_, i) => i);
  const minuteData = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <View style={styles.timeDrumContainer}>
      <View style={styles.drumRow}>
        <DrumPicker
          data={hourData}
          selectedValue={hours}
          onValueChange={onHoursChange}
          width={72}
        />
        <Animated.Text style={[styles.colonText, { color: colors?.text?.primary || '#fff' }]}>:</Animated.Text>
        <DrumPicker
          data={minuteData}
          selectedValue={minutes}
          onValueChange={onMinutesChange}
          width={72}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  baseText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 36,
    letterSpacing: -1.5,
  },
  timeDrumContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  drumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  colonText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 34,
    marginHorizontal: 8,
    opacity: 0.4,
    marginBottom: 4,
  },
});
