import { ImageSourcePropType } from 'react-native';
export type PostSliderType = {
  id: number;
  postUrl: ImageSourcePropType;
};

export const postData: PostSliderType[] = [
  { id: 2, postUrl: require('@/assets/images/post2.jpg') },
  { id: 3, postUrl: require('@/assets/images/post3.jpg') },
  { id: 5, postUrl: require('@/assets/images/post2.jpg') },
];
