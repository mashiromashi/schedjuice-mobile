import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

//This is just for image data hard codes
const imageCarousel = [
  { id: 1, imageUrl: require("../assets/images/banner1.png") },
  { id: 2, imageUrl: require("../assets/images/banner2.webp")},
  { id: 3, imageUrl: require("../assets/images/banner3.jpg") },
  { id: 4, imageUrl: require("../assets/images/banner4.jpg") },
];

//This is banner, also can call imageCarousel components
const Banner = () => {

  return (
    <View className="w-screen">
      <ScrollView className="h-[100]" horizontal={true} showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row w-screen">
          {imageCarousel.map((image,index)=>(
                <Image style={styles.image} source={image.imageUrl} className="w-[92%] mr-4 rounded-lg ml-4" resizeMode="cover" key={index}/>
            ))}
        </View>
      </ScrollView>
    </View>
    
  );
};

export default Banner;

const styles = StyleSheet.create({
  image : {
    width: "100%",
    height: 100,
  },
});
