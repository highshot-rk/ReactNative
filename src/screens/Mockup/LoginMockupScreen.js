/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
// React
import React, { Component } from 'react';
// Splash Screen
import * as SplashScreen from 'expo-splash-screen';
// React-Native
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
// AWS Cognito
import {
  AuthenticationDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// ダイアログ
import Dialog from "react-native-dialog";
// 生体認証
import * as LocalAuthentication from "expo-local-authentication";
// ローカルインポート
import styles from '../../common/CommonStyles.js';
import Constants from '../../common/Constants.js';
import Auth from '../../util/Authentication.js';
class LoginMockupScreen extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0, 
      height: 0,
  
      username: '',
      password: '',

      // ログインダイアログ表示フラグ
      isLoginDialoglVisible: false,

      //Splashのステータス管理（標準false）
      isReady: false,
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    //Splashが自動的に消えるのを防止
    SplashScreen.preventAutoHideAsync();
    this.checkUser();
  }
/*--------------------------------------------------------------------------
 * イベント処理
 *------------------------------------------------------------------------*/
  _onLayout(event) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    });
  };

  // ログインボタン押下時
  _login = () => {
    // const { username, password } = this.state;
    // モックアップ用テストデータ
    const username = 'dss_basket';
    const password = 'DssBasket01';

    this.setState({
      username: username,
      password: password,
    });

    // Cognito認証
    Auth(username, password, this.props, 'mock');
    this._toggleLoginModal();
  }

  // 認証サポートチェック
  // 返り値が1は指紋認証、2は顔認証を意味する。
  // デバイスがどちらの認証方法にも対応している場合、配列に両方含まれた[1,2]。
  // どちらにも対応していない場合空配列が返る。
  supportAuthentication = async () => {
    const result = await LocalAuthentication.supportedAuthenticationTypesAsync();
    alert(result);
  };

  // デバイスチェック
  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      alert("有効なデバイスです");
    } else {
      alert("無効なデバイスです");
    }
  };

  // 生体認証チェック
  checkForBiometrics = async () => {
    const biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (biometricRecords) {
      alert("生体認証有効");
    } else {
      alert("生体認証無効");
    }
  };

  // 認証チェック
  handleAuthentication = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "このアプリケーションはセキュリティ保護のためTouchID/FaceIDを認証として使います",
      cancelLabel: "キャンセル",
      fallbackLabel: "認証に失敗しました",
      disableDeviceFallback: false,
    });
    if (result.success) {
      // alert("認証成功");
      this._login();
    } else {
      LocalAuthentication.cancelAuthenticate();
      // alert("認証失敗");
    }
  };

  // ログインモーダルの開閉
  _toggleLoginModal = () => {
    this.setState({
      isLoginDialoglVisible: !this.state.isLoginDialoglVisible,
    });
  }

  //コールバック
  //3秒待って、splash画面を隠す。そしてステータスをtrueに。
  updateAsync = async () => {
    await sleep(3000);
    this.setState({ isReady: true })
    // // 認証チェック実行
    // this.handleAuthentication();
  }

  // 【開発用】スタブボタン押下
  _stub = () => {
    const { navigation } = this.props;
    // Stubに遷移
    navigation.navigate('Stub');
  }

/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  checkUser = () => {
    const { username, password } = this.state;
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: Constants.appConfig.UserPoolId,
      ClientId: Constants.appConfig.ClientId
    };
    const userPool = new CognitoUserPool(poolData);
    userPool.storage.sync((err, result) => {
      // AsyncStorage MemoryStorage variables are now synced
      // to userPool.storage and cognitoUser.storage values
      // for checking session and user with built in storage
    });
    this.setState({
      isLoginDialoglVisible: !this.state.isLoginDialoglVisible,
    });
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {

    // ステータスがfalseならSplashと同じ画像を表示
    if (!this.state.isReady) {
      return (
        <ImageBackground 
          source={require('../../../assets/splash_logo.png')} //いちおうSplashと同じ画像を表示（関係ないみたい）
          onLoad={this.updateAsync} //読み込みが終わったらCallbackをキック
          style={styles.bgImage}
        >
        </ImageBackground>
      );
    }
    
    return (
      <ImageBackground 
        source={require('../../../assets/splash_logo.png')} 
        style={styles.bgImage}
      >      
        <Text style={[styles.lineBreak]}>{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}</Text>
        <TouchableOpacity style={[styles.button_sm, styles.formElement, {backgroundColor: 'lightsteelblue'}]} onPress={() => this._stub()}>
          <Text style={styles.buttonText}>Stub</Text>
        </TouchableOpacity>

        {/* ログインダイアログ */}
        {/* <View style={styles.container}>
          <Dialog.Container
            visible={this.state.isLoginDialoglVisible}
            blurStyle={{ backgroundColor: "#f9f9f9" }}
          >
            <Dialog.Title>サインインが必要です</Dialog.Title>
            <Dialog.Description>
              ID・パスワードを入力してください
            </Dialog.Description>
            <Dialog.Input
              onChangeText={username => this.setState({ username })}
              autoCapitalize={'none'}
              placeholder={'Username'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.username}
            />  
            <Dialog.Input
              onChangeText={password => this.setState({ password })}
              placeholder={'Password'}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              secureTextEntry
              defaultValue={this.state.password}            
            />  
            <Dialog.Button label="サインイン" onPress={() => this._login()} />
          </Dialog.Container>
        </View> */}
      </ImageBackground>
    );
  }
}

//sleepコマンド作成
export const sleep = (sec) => {
  return new Promise(resolve => {
      setTimeout(resolve, sec);
  })
}

export default LoginMockupScreen;