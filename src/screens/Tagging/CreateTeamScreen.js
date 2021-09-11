/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView } from 'react-native';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// プログレスダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ローカルインポート
import styles from '../../common/CommonStyles';
import CreateCommonStyles from './CreateCommonStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import ToHalfWidth from '../../util/ToHalfWidth';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;

class CreateTeam extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,

      // ローディングスピナー表示フラグ
      isLoadingVisible: false,
      // ダイアログ表示フラグ
      isConfirmDialogVisible: false,
      // APIパラメータのcategory
      category: Constants.DB_CATEGORY.ADD,
      // OKボタン押下時のスクリーンID
      screenId: Constants.SCREEN_ID.CREATE_GAME,
      // SK
      sk:Constants.SK_TYPE.TEAM,
      // ラベル
      label_team_name: 'Team Name',
      label_short_name: 'Short Name',
      label_initial: 'Initial',
      label_button: 'Create Team',
      // 画面入力フォーム
      team_name: '',
      short_name: '',
      initial: '',
      // エラーメッセージ
      errorMessage: '',
    };

    this.inputCheck = this.inputCheck.bind(this);
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);
    // Edit画面からの遷移時処理
    const { navigation } = this.props;
    if (navigation.state.params) {
      if (navigation.state.params.category) {
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT})
      } else if (navigation.state.params.data) {
        const infoData = navigation.state.params.data;
        this.setState({infoData:infoData});
        this.setState({team_name:infoData.info_name});
        this.setState({short_name:infoData.short_name});
        this.setState({initial:infoData.initial});
        this.setState({sk:infoData.sk});
        this.setState({label_button:'Edit Team'});
        this.setState({category:Constants.DB_CATEGORY.UPDATE});
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT})
      }
    }
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

  // Create Teamボタン押下時
  createTeam = async(event) => {
    const {
      team_name,
      short_name,
      initial,
      category,
      sk
    } = this.state;

    // 入力チェック
    if (!this.inputCheck(team_name, short_name, initial)) { return; }
    this.setState({ errorMessage: '' });

    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async(err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // ローディングスピナー起動
        this.setState({ isLoadingVisible: true, });

        // 成功
        console.log('ref token : ' + succ.getAccessToken().getJwtToken());

        const param = {
          category: category,
          pk: cognitoUser.username,
          sk: sk,
          data: {
            info_name: team_name,
            short_name: short_name,
            initial: initial,
          },
        };

        // API接続
        await RequestApi(
          Constants.REQUEST_METHOD.PUT,
          Constants.API_BASE_URL + 'info',
          succ.getAccessToken().getJwtToken(),
          param,
        ).then((response) => {
          // ローディングスピナークローズ
          this.setState({ isLoadingVisible: false, });
          if(response !== null) {
            console.log(response.data)
            // 確認ダイアログオープン
            this.setState({
              isConfirmDialogVisible: true,
            });

          } else {
              throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          // ローディングスピナークローズ
          this.setState({ isLoadingVisible: false, });

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

  // OKボタン押下時
  backToGame = () => {
    this.setState({ isConfirmDialogVisible: false });
    // CreateGame画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(this.state.screenId);
  }
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  // 入力チェック
  inputCheck(team_name, short_name, initial) {
    if (team_name === '') {
      this.setState({ errorMessage: this.state.label_team_name + Messages.WARN.W001 });
      return false;
    }
    if (short_name === '') {
      this.setState({ errorMessage: this.state.label_short_name + Messages.WARN.W001 });
      return false;
    } else {
      if (short_name.length > 10) {
        this.setState({ errorMessage: this.state.label_short_name + Messages.WARN.W002 });
        return false;
      }
    }
    if (initial === '') {
      this.setState({ errorMessage: this.state.label_initial + Messages.WARN.W001 });
      return false;
    } else {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(initial);
      // 小文字 -> 大文字
      chkVal = chkVal.toUpperCase();
      // 正規表現(英字3文字)
      let reg = new RegExp(/^([a-zA-Z]{3})$/);
      if(!reg.test(chkVal)) {
        this.setState({ errorMessage: this.state.label_initial + Messages.WARN.W003 });
        return false;
      }
    }
    return true;
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
          style={[{width: this.state.width, height: this.state.height}, styles.container,]}>

          {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
          <Spinner
            visible={this.state.isLoadingVisible}
            textContent={Messages.INFO.I003}
            textStyle={styles.labelText}
            overlayColor={'#rgba(0, 0, 0, 0.3)'}
          />

          {/* Error Message */}
          <View style={[styles.row, CreateCommonStyles.contents_a]}>
            <Text style={[styles.errorText, CreateCommonStyles.errorText_custom]}>{this.state.errorMessage}</Text>
          </View>

          {/* Team Name */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>Team Name</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={team_name => this.setState({ team_name })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Team'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.team_name}
            />
          </View>

          {/* Short Name */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>Short Name</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={short_name => this.setState({ short_name })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Short Name'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.short_name}
            />
          </View>

          {/* Initial */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>Initial</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={initial => this.setState({ initial })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Initial'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.initial}
            />
          </View>

          {/* 登録ボタン */}
          <View style={[styles.row, CreateCommonStyles.contents_f]}>
          <View paddingHorizontal={wp(28.9)} />
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createTeam()}>
              <Text style={[styles.buttonText]}>{this.state.label_button}</Text>
            </TouchableOpacity>
          </View>

          {/* 確認ダイアログ */}
          <ConfirmDialog
            title=""
            message={Messages.INFO.I002}
            visible={this.state.isConfirmDialogVisible}
            onTouchOutside={() => this.setState({ isConfirmDialogVisible: false })}
            positiveButton={{
              title: 'OK',
              onPress: () => this.backToGame()
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

export default CreateTeam;