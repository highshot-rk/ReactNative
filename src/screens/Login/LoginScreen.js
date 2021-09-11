/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import { StatusBar } from 'expo-status-bar';
// React
import React, { Component } from 'react';
// React-Native
import {
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
// AWS Cognito
import {
  AuthenticationDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
// 背景グラデーション
import { LinearGradient } from "expo-linear-gradient";
// ローカルインポート
import styles from '../../common/CommonStyles.js';
import Constants from '../../common/Constants.js';
import LoginStyles from './LoginStyles.js';
import Auth from '../../util/Authentication.js';

class LoginScreen extends Component {
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
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
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
    const { username, password } = this.state;
    // Cognito認証
    Auth(username, password, this.props, 'dev');
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
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    return (
      <LinearGradient
        onLayout={this._onLayout.bind(this)}
        style={[{width: this.state.width, height: this.state.height}, styles.container,]}
        colors={['#70AD47', '#e0ffff']} 
        start={{x: 0.0, y: 0.0}} 
        end={{x: 0, y: 1}}
      >
        <StatusBar style="auto" />
        <Text style={[styles.title, LoginStyles.login_title]}>Welcome!
        </Text>
        <TextInput
          onChangeText={username => this.setState({ username })}
          style={[styles.input, styles.formElement, LoginStyles.login_input]}
          autoCapitalize={'none'}
          placeholder={'Username'}
          spellCheck={false}
          placeholderTextColor={'#aaa'}
          keyboardType={'default'}
          defaultValue=""
        />
        <TextInput
          onChangeText={password => this.setState({ password })}
          style={[styles.input, styles.formElement, LoginStyles.login_input]}
          placeholder={'Password'}
          placeholderTextColor={'#aaa'}ß
          keyboardType={'default'}
          secureTextEntry
          defaultValue=""
        />
        <TouchableOpacity style={[styles.login_button, styles.formElement]} onPress={() => this._login()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={[styles.lineBreak]}>{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}</Text>
        <TouchableOpacity style={[styles.button_sm, styles.formElement, {backgroundColor: 'lightsteelblue'}]} onPress={() => this._stub()}>
          <Text style={styles.buttonText}>Stub</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

export default LoginScreen;