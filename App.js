import React from 'react';
import AppLoading from 'expo-app-loading';
// LogBox
import { LogBox } from 'react-native';
// デバイスの向き
import Orientation from 'react-native-orientation';
import { Asset } from 'expo-asset';
// カスタムフォント
import * as Font from 'expo-font';
// ローカルインポート
import AppNavigator from './src/navigation/AppNavigator';

export default class App extends React.Component{

  state = {
    fontsLoaded: false,
  };

  async loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/resources/bg_2.png'),
        require('./assets/resources/aogaku_logo.png'), 
        require('./assets/resources/waseda_logo.png'), 
      ]),

      Font.loadAsync({
        // Load a font `Raleway` from a static resource
        'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),

        // Any string can be used as the fontFamily name. Here we use an object to provide more control
        'Raleway-Bold': {
          uri: require('./assets/fonts/Raleway-Bold.ttf'),
          display: Font.FontDisplay.FALLBACK,
        },
        'Raleway-SemiBold': {
          uri: require('./assets/fonts/Raleway-SemiBold.ttf'),
          display: Font.FontDisplay.FALLBACK,
        },
      }),
    ]);
    this.setState({ fontsLoaded: true });
  }
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // LogBox非表示
    LogBox.ignoreAllLogs();
    // デバイスの向きを横固定
    Orientation.lockToLandscapeLeft;
    // フォントをロード
    this.loadResourcesAsync();
  }

  render() {
    if (this.state.fontsLoaded) {
      return (
        <AppNavigator />
      );
    } else {
      return <AppLoading />;
    }
  }
}