/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
// グリッド表示
import { FlatGrid } from 'react-native-super-grid';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// アコーディオン表示
import Accordion from "@gapur/react-native-accordion";
// 確認ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローカルインポート
import styles from '../../common/CommonStyles';
import MenuStyles from './MenuStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// ウィンドウの幅
const ITEM_WIDTH = Dimensions.get('window').width;
// Cognitoユーザー
let cognitoUser = {};
// メニュー表示用アイテム
// let menu_items = [
//   { id: 1, name: 'Live Tagging', icon: 'user-tag' },
//   { id: 2, name: 'Stats Viewer', icon: 'chart-bar' },
//   { id: 3, name: 'Edit Info', icon: 'pen-square' },
//   { id: 4, name: 'Play by Play', icon: 'basketball-ball' },
// ];
class MenuScreen extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props)
    this.state = {
      dialogVisible: false,
      cognitoUser: {},
      menu_items: [],
      imgPath: [],
      img: '',
    }

    this.setState = this.setState.bind(this);
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される前にに呼び出されるメソッド
  componentDidMount = async(event) => {
    // 画面遷移パラメーター
    const { navigation } = this.props;
    const user_id = navigation.state.params.user_id;

    // Cognitoユーザー取得
    cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async(err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // 成功
        console.log('ref token : ' + succ.getAccessToken().getJwtToken());

        let param = {
          'category': Constants.QUERY_PATTERN.TYPE_0,
          'pk': cognitoUser.username,
          'sk': cognitoUser.username,
        };

        // API接続
        await RequestApi(
          Constants.REQUEST_METHOD.POST,
          Constants.API_BASE_URL + 'info',
          succ.getAccessToken().getJwtToken(),
          param,
        ).then((response) => {
          if(response !== null) {
            console.log(response.data.Items[0].tile)
            // メニュー表示用アイテム
            this.setState({ menu_items: response.data.Items[0].tile });
            // 背景画像
            this.setState({ img: response.data.Items[0].image_path });
            this.setState({ imgPath: require("../../../assets/resources/bg_stage.jpg") });

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
/*--------------------------------------------------------------------------
 * イベント処理
 *------------------------------------------------------------------------*/
  // ログアウトアイコン押下時
  logout = () => {

    // サインアウト処理
    cognitoUser.signOut();

    // ログイン画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.LOG_IN);
  }

  // グリッドアイテム押下時
  transition = (id) => {
    // 各画面にプッシュ遷移
    const { navigation } = this.props;
    if(id === Constants.SCREEN_CATEGORY.LIVE_TAGGING) {
      // Live Tagging
      navigation.navigate(Constants.SCREEN_ID.GAME_INFO);
    } else if(id === Constants.SCREEN_CATEGORY.STATS_VIEWER) {
      // Stats Viewer (Game Selection)
      navigation.navigate(Constants.SCREEN_ID.GAME_SELECTION,
        // 画面遷移パラメータ
        { 'screen_category': id }
      );
    } else if(id === Constants.SCREEN_CATEGORY.EDIT_INFO) {
      // Edit Info
      navigation.navigate(Constants.SCREEN_ID.EDIT_INFO);
    } else if(id === Constants.SCREEN_CATEGORY.PLAY_BY_PLAY) {
      // Play by Play (Game Selection)
      navigation.navigate(Constants.SCREEN_ID.GAME_SELECTION,
        // 画面遷移パラメータ
        { 'screen_category': id }
      );
    } else {
      navigation.navigate('Login');
    }
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    return (
      <ImageBackground source={this.state.imgPath} style={styles.bgImage}>
        <View style={styles.container}>
          <View style={[MenuStyles.menu_row, MenuStyles.menu_row_height]}>
            <Accordion style={MenuStyles.menu_accordion}
              showButton
              renderHeader={() =>
              <View style={MenuStyles.menu_row}>
                <Text style={styles.labelText}> {cognitoUser.username}　</Text>
                <Icon style={styles.icon} name='user-circle'/>
              </View>}
            >
              <View style={[MenuStyles.menu_row, MenuStyles.menu_row_padding]}>
                <Text style={[styles.labelText, MenuStyles.menu_accordion_labelText]}>Log Out　</Text>
                <TouchableOpacity onPress={() => this.setState({ dialogVisible: true })}>
                  <Icon style={[styles.icon, MenuStyles.menu_accordion_icon]} name='sign-out-alt'/>
                </TouchableOpacity>

                {/* 確認ダイアログ */}
                <ConfirmDialog
                  title="ログアウト 確認画面"
                  message={Messages.INFO.I001}
                  visible={this.state.dialogVisible}
                  onTouchOutside={() => this.setState({ dialogVisible: false })}
                  positiveButton={{
                      title: 'はい',
                      onPress: () => {
                          this.setState({ dialogVisible: false },
                          this.logout());
                      }
                  }}
                  negativeButton={{
                      title: 'いいえ',
                      onPress: () => this.setState({ dialogVisible: false })
                  }}
                />
              </View>
            </Accordion>
          </View>

          {/* メニューリスト */}
          <View style={MenuStyles.menu_column}>
            <Text style={[styles.title, MenuStyles.menu_title]}>{Constants.TITLE_MENU}</Text>
            <FlatGrid
              itemDimension={ITEM_WIDTH / 7}
              data={this.state.menu_items}
              style={[MenuStyles.menu_gridView]}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => this.transition(item.id)}>
                  <View style={[MenuStyles.menu_gridItem_container]}>
                    <Text style={[styles.labelText_black, MenuStyles.menu_gridItem_name]}>{item.name}</Text>
                    <Icon style={MenuStyles.menu_gridItem_icon} name={item.icon}/>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default MenuScreen;