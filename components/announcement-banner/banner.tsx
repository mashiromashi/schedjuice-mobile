import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, View, ViewToken } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { sliderData, ImageSliderType } from './slider-data';
import SliderItem from './slider-item';
import Pagination from './pagination';

type Props = { itemslist?: ImageSliderType[]; enablePagination?: boolean };

export const Banner = ({ itemslist = sliderData, enablePagination = true }: Props) => {
  const { width } = Dimensions.get('screen');
  const scrollX = useSharedValue(0);
  const [pagniationIndex, setPaginationIndex] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => (scrollX.value = e.contentOffset.x),
  });

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const idx = info.viewableItems?.[0]?.index;
      if (typeof idx === 'number') setPaginationIndex(idx);
    },
    []
  );
  console.log(itemslist);
  return (
    <View>
      <Animated.FlatList
        data={itemslist}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => <SliderItem item={item} index={index} scrollX={scrollX} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        bounces={false}
        removeClippedSubviews
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      {enablePagination && (
        <Pagination items={itemslist} pagniationIndex={pagniationIndex} scrollX={scrollX} />
      )}
    </View>
  );
};
