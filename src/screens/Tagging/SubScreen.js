import {widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';

export function wp(widthPercent){
  return widthPercentageToDP(90) * widthPercent / 100;
}
export function hp(heightPercent){
  return heightPercentageToDP(80) * heightPercent / 100;
}
