import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
// ローカルインポート
import styles from '../../common/CommonStyles';
import Constants from '../../common/Constants';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/

// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;
class EditInfo extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);
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
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  submit_1 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // GameInfoScreen
    navigation.navigate(Constants.SCREEN_ID.EDIT_EVENT,{'id':'EVENT'});
  }
  submit_2 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreateGameScreen
    navigation.navigate(Constants.SCREEN_ID.EDIT_EVENT,{'id':'GAME'});
  }
  submit_3 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreateEventScreen
    navigation.navigate(Constants.SCREEN_ID.EDIT_EVENT,{'id':'TEAM'});
  }
  submit_4 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreateTeamScreen
    navigation.navigate(Constants.SCREEN_ID.EDIT_EVENT,{'id':'PLAYER'});
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    return (
      <ImageBackground
        source={imgPath}
        style={styles.bgImage}
        imageStyle={{resizeMode: 'repeat'}}>
        <View
          onLayout={this._onLayout.bind(this)}
          style={[{width: this.state.width, height: this.state.height}, styles.container, {backgroundColor: '#f0f6da'}]}>

          <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_1()}>
            <Text style={styles.buttonText}>EVENT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_2()}>
          <Text style={styles.buttonText}>GAME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_3()}>
          <Text style={styles.buttonText}>TEAM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_4()}>
          <Text style={styles.buttonText}>PLAYER</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    );
  }
}

export default EditInfo;
