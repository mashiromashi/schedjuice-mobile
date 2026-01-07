import { Dimensions, StyleSheet , Text , View } from "react-native";
import React from "react";
import { ImageSliderType } from "./slider-data";
import Animated,{ Extrapolation, interpolate, SharedValue } from "react-native-reanimated";
import { Container } from "lucide-react-native";
import { useAnimatedStyle } from "react-native-reanimated";
import clsx from "clsx";
type Props = {
    items : ImageSliderType[];
    pagniationIndex: number;
    scrollX : SharedValue<number>;
}
const {width} = Dimensions.get('screen');
const Pagination = ({items = [],pagniationIndex = 0,scrollX} : Props) =>{
    return (
        <View className = "flex-row h-14 justify-center items-center ">
            {
              items.map((_,index) => {
                const pgAnimationStyle = useAnimatedStyle(() =>{
                    const dotWidth = interpolate (
                        scrollX.value,
                        [(index -1 ) * width , index * width , (index + 1) * width],
                        [8,20,8],
                        Extrapolation.CLAMP
                    )
                    return {width : dotWidth}
                })
                return (
                    <Animated.View key={index} style={pgAnimationStyle} className= {clsx("w-2 h-2 rounded-full m-1 " , pagniationIndex === index ? "bg-pagination-active-dot" : "bg-pagination-dot" )}/>

                )
              })
            }
        </View>
    )
}

export default Pagination;
