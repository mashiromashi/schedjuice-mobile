import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { postData, PostSliderType } from "../announcement-post/post-data";
import PostItem from "./post-item";

type Props = {
  itemslist?: PostSliderType[];
  tilesPerScreen?: number;     
  gap?: number;             
  radius?: number;           
  horizontalPadding?: number; 
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Post = ({
  itemslist = postData,
  tilesPerScreen = 2.8,
  gap = 8,
  radius = 10,
  horizontalPadding = 12,
}: Props) => {
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  
  const itemWidth = useMemo(() => {
    const totalPadding = horizontalPadding * 2;
    const gaps = gap * Math.floor(tilesPerScreen - 1);
    const usable = SCREEN_WIDTH - totalPadding - gaps;
    return Math.floor(usable / tilesPerScreen);
  }, [tilesPerScreen, gap, horizontalPadding]);

  const snapInterval = itemWidth + gap;

  return (
    <View>
      <Animated.FlatList
        data={itemslist}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        renderItem={({ item, index }) => (
          <PostItem
            item={item}
            index={index}
            scrollX={scrollX}
            itemWidth={itemWidth}
            radius={radius}
          />
        )}
        // snapping to each tile
        snapToInterval={snapInterval}
        decelerationRate="fast"
        disableIntervalMomentum
        // IMPORTANT: wire the animated scroll
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        bounces={false}
      />
    </View>
  );
};
