import Orientation from 'react-native-orientation';
import { landscapeOrientationScreens } from '../navigation/AppNavigator';

const handleOrientation = (currentRouteName) => {
  // 受け取った引数が横向き固定したいリストに含まれていたら横向きにロック、そうでなかったら縦向きにロック
  landscapeOrientationScreens.includes(currentRouteName) ?
    Orientation.lockToLandscapeLeft() :
    Orientation. lockToPortrait();
}

// ページ遷移する度に呼ばれる
export const onNavigationStateChange = (prevState, currentState) => {
  const routes = currentState.routes;
  const currentRouteName = routes[routes.length - 1].routeName;
  // 遷移後の画面名を引数に渡す
  handleOrientation(currentRouteName);
}