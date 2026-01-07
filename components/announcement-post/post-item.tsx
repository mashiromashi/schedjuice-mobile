import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { PostSliderType } from "../announcement-post/post-data";
type Props = {
  item: PostSliderType;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  radius?: number;
};

export const PostItem = ({ item, itemWidth, radius = 10 }: Props) => {
  return (
    <View style={[{ width: itemWidth }]}>
      <View style={[styles.imageWrapper, { borderRadius: radius }]}>
        <Animated.Image
          source={
            typeof item.postUrl === "string"
              ? { uri: item.postUrl }
              : item.postUrl
          }
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  imageWrapper: {
    height: 150, 
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default PostItem;
