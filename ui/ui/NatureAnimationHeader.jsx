import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/SettingsContext';

import PeacefulLandscape from './PeacefulLandscape';
import SoothingForest from './SoothingForest';
import StarryNight from './StarryNight';
import OceanWaves from '../nature/OceanWaves';
import FloatingPetals from './FloatingPetals';
import NorthernLights from './NorthernLights';
import DesertDunes from './DesertDunes';
import CosmicNebula from './CosmicNebula';
import RainForest from './RainForest';
import ZenGarden from './ZenGarden';
import LotusBloom from './LotusBloom';

const { width: SCREEN_W } = Dimensions.get('window');

const SCENE_MAP = {
  landscape: PeacefulLandscape,
  forest: SoothingForest,
  starryNight: StarryNight,
  ocean: OceanWaves,
  petals: FloatingPetals,
  aurora: NorthernLights,
  desert: DesertDunes,
  nebula: CosmicNebula,
  rainforest: RainForest,
  zen: ZenGarden,
  lotus: LotusBloom,
};

export default React.memo(function NatureAnimationHeader({ scene = 'landscape', compact = false }) {
  const { isDark } = useTheme();
  const AnimationComponent = SCENE_MAP[scene] || PeacefulLandscape;
  const animSize = SCREEN_W + 4; // slightly wider than screen to avoid edge gaps

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={[styles.container, compact && styles.containerCompact]}
    >
      <View style={styles.animationWrapper}>
        <AnimationComponent size={animSize} />
      </View>
      <LinearGradient
        colors={[
          'transparent',
          isDark ? 'rgba(0,0,0,0.5)' : 'rgba(248,250,252,0.5)',
          isDark ? '#000' : '#f8fafc',
        ]}
        locations={[0, 0.5, 1]}
        style={styles.fadeGradient}
      />
    </Animated.View>
  );
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: -20,
    marginTop: -10,
    marginBottom: -40,
    zIndex: 0,
  },
  containerCompact: {
    marginBottom: -30,
  },
  animationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});
