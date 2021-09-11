/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// 確認ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
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

class CreatePlayer extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      // Cognito User
      cognitoUser: null,
      // ローディングスピナー表示フラグ
      isLoadingVisible: false,
      // ダイアログ表示フラグ
      isConfirmDialogVisible: false,
      // APIパラメータのcategory
      category: Constants.DB_CATEGORY.ADD,
      // OKボタン押下時のスクリーンID
      screenId: null,
      // SK
      sk:Constants.SK_TYPE.PLAYER,
      // ラベル
      label_player_name: 'Player Name (JA)',
      label_team_name: 'Team Name',
      label_main_number: 'Main Number',
      label_sub_number: 'Sub Number',
      label_position: 'Position',
      label_button: 'Create Player',
      // ドロップダウンのリスト値
      teamList: [],
      // ドロップダウン選択値
      defaultValue_team: [],
      // 画面遷移パラメーター
      params: null,
      // 画面入力フォーム
      player_name: '',
      team_name: [],
      main_number: '',
      sub_number: '',
      position: 'Please select...',
      // エラーメッセージ
      errorMessage: '',
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);

    // 画面遷移時の再レンダリング対応
    const { navigation } = this.props;
    if  (navigation.state.params) {
      // 画面遷移パラメーター
      if (navigation.state.params.selectedTeam) {
        this.setState({ defaultValue_team: navigation.state.params.selectedTeam });
        this.setState({ team_name: navigation.state.params.selectedTeam });
        this.setState({ teamList: navigation.state.params.team });
      } else if (navigation.state.params.data) {
        const infoData = navigation.state.params.data;
        this.setState({infoData:infoData});
        this.setState({player_name:infoData.info_name});
        this.setState({main_number:infoData.main_number});
        this.setState({sub_number:infoData.sub_number});
        this.setState({position:infoData.main_position});
        this.setState({date_to:infoData.end_date});
        this.setState({sk:infoData.sk});
        this.setState({team_name:{label:infoData.team_name ,value:infoData.main_team}});
        this.setState({defaultValue_team:{label:infoData.team_name ,value:infoData.main_team}});
        this.setState({label_button:'Edit Player'});
        this.setState({category:Constants.DB_CATEGORY.UPDATE});
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT});
        // 初期処理
        this.init();
      }
    };
    this.focusListener = navigation.addListener("didFocus", () => {
      this.init();
    });
  }
/*--------------------------------------------------------------------------
 * イベント処理
 *------------------------------------------------------------------------*/
  _onLayout(event) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  };

  _dropdown_renderButtonText(rowData) {
    const {label, value} = rowData;
    return `${label}`;
  }

  _dropdown_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;

    return (
      <View style={[styles.dropdown_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
        <Text style={[styles.dropdown_row_text, highlighted && {color: 'blue', fontWeight: 'bold'}]}>
          {`${rowData.label}`}
        </Text>
      </View>
    );
  }

  _dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == this.state.teamList.length - 1) return;
    let key = `spr_${rowID}`;
    return (
      <View
        style={styles.dropdown_separator}
        key={key}
      />
    );
  }

  // Create Playerボタン押下時
  createPlayer = async(event) => {
    const {
      player_name,
      team_name,
      main_number,
      sub_number,
      position,
      category,
      sk
    } = this.state;

    // 入力チェック
    if (!this.inputCheck(player_name, team_name.label, main_number, sub_number, position)) { return; }
    this.setState({ errorMessage: '' });

    // Cognitoユーザー取得
    if (this.state.cognitoUser) {
      cognitoUser = this.state.cognitoUser;
    } else {
      cognitoUser = await GetCognitoUser();
    }
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
            info_name: player_name,
            main_team: team_name.value,
            main_number: ToHalfWidth(main_number),
            sub_number: ToHalfWidth(sub_number),
            main_position: position,
          },
        };

      //   // API接続
      //   this.requestInfo(Constants.REQUEST_METHOD.PUT, succ, param);
      // }
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
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  // 初期処理
  init = async(event) => {
    // Cognitoユーザー取得
    cognitoUser = await GetCognitoUser();
    this.setState({cognitoUser: cognitoUser})
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

        // Team情報取得
        let param = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.TEAM,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param);
      }
    });
  }
  // API Gateway経由でDynamoDBにリクエストを行う
  requestInfo = async(method, succ, param) => {
    // API接続
    await RequestApi(
      method,
      Constants.API_BASE_URL + 'info',
      succ.getAccessToken().getJwtToken(),
      param,
    ).then((response) => {
      // ローディングスピナークローズ
      this.setState({ isLoadingVisible: false, });

      if(response !== null) {
        const items = [];
        if(method === Constants.REQUEST_METHOD.POST) {
          // イベントリスト、チームリストセット
          response.data.Items.forEach(function(name, index) {
            const label = response.data.Items[index].info_name;
            const value = response.data.Items[index].sk;
            items.push({
              label: label,
              value: value,
            });
          })
          this.setState({ teamList: items });
        } else {
          // 確認ダイアログオープン
          this.setState({ isConfirmDialogVisible: true });
        }
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

  // 入力チェック
  inputCheck(player_name, team_name, main_number, sub_number, position) {
    if (player_name === '') {
      this.setState({ errorMessage: this.state.label_player_name + Messages.WARN.W001 });
      return false;
    }
    if(team_name === '') {
      this.setState({ errorMessage: this.state.label_team_name + Messages.WARN.W001 });
      return false;
    }
    if(main_number === '') {
      this.setState({ errorMessage: this.state.label_main_number + Messages.WARN.W001 });
      return false;
    } else {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(main_number);
      // 正規表現(半角数字1~3桁)
      let reg = new RegExp(/^([0-9]{1,3})$/);
      if (!reg.test(chkVal)) {
        this.setState({ errorMessage: this.state.label_main_number + Messages.WARN.W009 });
        return false;
      }
    }
    if (sub_number === '') {
      // サブの背番号は任意項目のため、エラーとしない
    } else {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(sub_number);
      // 正規表現(半角数字1~3桁)
      let reg = new RegExp(/^([0-9]{1,3})$/);
      if (!reg.test(chkVal)) {
        this.setState({ errorMessage: this.state.label_sub_number + Messages.WARN.W009 });
        return false;
      }
    }
    if (position === '') {
      this.setState({ errorMessage: this.state.label_position + Messages.WARN.W001 });
      return false;
    }
    return true;
  }

  // OKボタン押下時
  goToScreen = () => {
    this.setState({ isConfirmDialogVisible: false });
    if (this.state.screenId) {
      // AssignMember画面にプッシュ遷移
      const { navigation } = this.props;
      navigation.navigate(this.state.screenId)
    } else {
      // 画面入力フォーム
      this.setState({player_name: ''})
      this.setState({main_number: ''})
      this.setState({sub_number: ''})
      this.setState({position: 'Please select...'})
    };
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

          {/* Player Name */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_player_name}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={player_name => this.setState({ player_name })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Player Name'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.player_name}
            />
          </View>

          {/* Team Name */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_team_name}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown"
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                defaultValue={this.state.defaultValue_team.label}
                defaultTextStyle={styles.defaultTextStyle}
                options={this.state.teamList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ team_name: option })}
              />
            </View>

          </View>

          {/* Number Main */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_main_number}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={main_number => this.setState({ main_number })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              keyboardType='numeric'
              autoCapitalize={'none'}
              placeholder={'Enter the Main Number'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.main_number}
            />
          </View>

          {/* Number Sub */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_sub_number}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={sub_number => this.setState({ sub_number })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              keyboardType='numeric'
              autoCapitalize={'none'}
              placeholder={'Enter the Sub Number'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.sub_number}
            />
          </View>

          {/* Position */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_position}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown"
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                defaultValue={this.state.position}
                defaultTextStyle={styles.defaultTextStyle}
                options={Constants.POSITION_LIST}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ position: option.label })}
              />
            </View>
          </View>

          {/* 登録ボタン */}
          <View style={[styles.row, CreateCommonStyles.contents_g]}>
          <View paddingHorizontal={wp(28.9)} />
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createPlayer()}>
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
              // onPress: () => this.setState({ isConfirmDialogVisible: false })
              onPress: () => this.goToScreen()
            }}
          />

        </View>
      </ImageBackground>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(CreatePlayer);