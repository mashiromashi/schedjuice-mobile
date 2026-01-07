import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ImageSliderType } from './slider-data';

type Props = {
  item: ImageSliderType;
  index: number;
  scrollX: SharedValue<number>;
};

const { width } = Dimensions.get('screen');

export const SliderItem = ({ item, index, scrollX }: Props) => {
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [0.95, 1, 0.95],
          Extrapolation.CLAMP 
        ),
      },
    ],
  }));

  return (
    <View className = "items-center justify-center" style={styles.container}>
      <View style={styles.imageWrapper}>
        <Animated.Image
          source={
            typeof item.imageUrl === 'string'
              ? { uri: item.imageUrl }
              : item.imageUrl
          }
          style={[styles.image, rStyle]}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
  },
  imageWrapper: {
    
    width,
    height: 150,
    borderRadius: 8,
    overflow : 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SliderItem;
