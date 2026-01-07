import { ImageSourcePropType } from "react-native";
export type ImageSliderType ={
    id : number;
    imageUrl : ImageSourcePropType;
    
}

export const sliderData : ImageSliderType[] = [
  { id: 1, imageUrl: require('@/assets/images/banner1.png') },
  { id: 2, imageUrl: require('@/assets/images/banner1.png') },
  { id: 3, imageUrl: require('@/assets/images/banner1.png') },
  { id: 4, imageUrl: require('@/assets/images/banner1.png') },
]