import { StatusBar } from 'expo-status-bar';
import React, { Component }　from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// ローカルインポート
import styles from './CommonStyles';
import Constants from './Constants';
import Messages from './Messages';
import GetCognitoUser from '../util/GetCognitoUser';
import RequestApi from '../util/RequestApi';

class APITestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      apiname: '',
      method: '',
    };

  }

  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
  }

  submit = async(event) => {
    const { apiname, method } = this.state;
    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async(err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // 成功
        console.log('ref token : ' + succ.getAccessToken().getJwtToken());

        let param = {
          'category': 0,
          'pk': cognitoUser.username,
          'sk': cognitoUser.username,
          'data': param,
        };

        // let param = {
        //   event_start_date: '20200401', 
        //   info_name: 'EV_TEST_001', 
        //   end_date: '20200430', 
        //   short_name: 'EV_TEST_001', 
        //   initial: 'EV', 
        // };

        // API接続
        await RequestApi(
          method, 
          Constants.API_BASE_URL + apiname,
          succ.getAccessToken().getJwtToken(), 
          param,
        ).then((response) => {
          alert("APIGateWay→lambda　接続成功!")  
          if(response !== null) {
            console.log(response.data)

          } else {
              throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          alert(Messages.ERROR.E001);
          if (error.response) {
            console.log(error.response);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log(error.message);
          }
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TextInput
          onChangeText={apiname => this.setState({ apiname })}
          style={[styles.input, styles.formElement, Teststyles.login_input]}
          autoCapitalize={'none'}
          placeholder={'API名を入力してください  (例) info'}
          spellCheck={false}
          placeholderTextColor={'#aaa'}
          keyboardType={'default'}
          defaultValue=""
        />
        <TextInput
          onChangeText={method => this.setState({ method })}
          style={[styles.input, styles.formElement, Teststyles.login_input]}
          autoCapitalize={'none'}
          placeholder={'メソッドを入力してください  (例) post'}
          spellCheck={false}
          placeholderTextColor={'#aaa'}
          keyboardType={'default'}
          defaultValue=""
        />
        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit()}>
          <Text style={styles.buttonText}>API Gateway 接続テスト 開始</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const Teststyles = StyleSheet.create({
  login_input: {
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 20,
  },
});

export default APITestScreen;
