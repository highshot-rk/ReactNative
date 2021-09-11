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
  SafeAreaView,
  ScrollView,
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// テーブル表示
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// チェックボックス
import { CheckBox } from 'react-native-elements';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// モーダルダイアログ
import Modal from "react-native-modal";
// 確認ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// カラーピッカー
import { ColorPicker } from 'react-native-status-color-picker';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/CommonStyles';
import AssignPlayersStyles from './AssignPlayersStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';
import ToHalfWidth from '../../util/ToHalfWidth';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;

class AssignPlayers extends Component {
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
      // 確認ダイアログ表示フラグ
      isConfirmDialogVisible: false,
      
      // カラーモーダル設定
      team_color_home: '',
      team_color_visitor: '',
      isHome: false,
      // カラーバリエーション
      colors: [
        "#ffffff",  // Wtite
        "#000080",  // Navy
        "#ff0000",  // Red
        "#ffff00",  // Yellow
        "#87ceeb",  // Skyblue
        "#008000",  // Green
      ],

      // 画面遷移パラメータ
      itemList: null,
      game_id: '',
      date: '',
      // ドロップダウン項目
      teamList: [],
      // ドロップダウン選択値
      defaultValue: [],
      // 画面項目
      team_name_home: [],
      team_name_visitor: [],
      playerList_main_home: [],
      playerList_sub_home: [],
      playerList_main_visitor: [],
      playerList_sub_visitor: [],

      // player_number: 0,

      // 切り替えボタンの色
      // ON
      buttonColorMain: '#006a6c',
      buttonColorMainVisitor: '#006a6c',
      // OFF
      buttonColorSub: '#c0c0c0',
      buttonColorSubVisitor: '#c0c0c0',

      // テーブルヘッダー
      tableHead: ['Number', 'Player', 'Starters', 'Misses'],

      // 表示フラグ
      isDisplayHome: 'block',
      isDisplayVisitor: 'none',
      isDisplayMain: 'block',
      isDisplaySub: 'none',
      isDisplayMainVisitor: 'none',
      isDisplaySubVisitor: 'none',
      // エラーメッセージ
      errorMessage: null,
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);
    // 画面遷移パラメーター
    const { navigation } = this.props;
    const game_id = navigation.state.params.game_id;
    const date = navigation.state.params.date;
    const event = navigation.state.params.event;
    const stage = navigation.state.params.stage;
    const team = navigation.state.params.team;
    const team_name_home = navigation.state.params.team_name_home;
    const team_name_visitor = navigation.state.params.team_name_visitor;
    const team_color_home = navigation.state.params.team_color_home;
    const team_color_visitor = navigation.state.params.team_color_visitor;

    const items = {
      date: date, 
      event: event,
      stage: stage,
      team: team,
    };

    this.setState({ game_id: game_id });
    this.setState({ date: date });
    this.setState({ team_name_home: team_name_home });
    this.setState({ team_name_visitor: team_name_visitor });
    this.setState({ team_name_home: team_name_home });
    this.setState({ defaultValue: team_name_home });
    this.setState({ team_color_home: team_color_home });
    this.setState({ team_color_visitor: team_color_visitor });
    this.setState({ itemList: items});

    let list = [];
    list.push(team_name_home);
    list.push(team_name_visitor);
    this.setState({ teamList: list });

    // 画面遷移時の再レンダリング対応
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
      height: Dimensions.get('window').height
    });
  };

  // テキストボックス変更時、テキストボックスの値を更新する
  _updateText(data) {
    const player_number = data.player_number;
    const index = data.index;
    const cellIndex = data.cellIndex;

    if (this.state.isDisplayMain === 'block') {
      // Main
      this.state.playerList_main_home[index][cellIndex] = player_number;
      this.setState({ playerList_main_home: this.state.playerList_main_home });
      } else {
      // Sub
      this.state.playerList_sub_home[index][cellIndex] = player_number;
      this.setState({ playerList_sub_home: this.state.playerList_sub_home });
    }
  }
  _updateTextVisitor(data) {
    const player_number = data.player_number;
    const index = data.index;
    const cellIndex = data.cellIndex;

    if (this.state.isDisplayMainVisitor === 'block') {
      // Main
      this.state.playerList_main_visitor[index][cellIndex] = player_number;
      this.setState({ playerList_main_visitor: this.state.playerList_main_visitor });
      } else {
      // Sub
      this.state.playerList_sub_visitor[index][cellIndex] = player_number;
      this.setState({ playerList_sub_visitor: this.state.playerList_sub_visitor });
    }
  }

  // チェックボックス選択時、チェックボックスのON/OFFを更新する
  _updateCheckbox(data, index, cellIndex) {
    if (this.state.isDisplayMain === 'block') {
      // Main
      if(this.state.playerList_main_home[index][cellIndex] === true) {
        this.state.playerList_main_home[index][cellIndex] = false;
        this.setState({ playerList_main_home: this.state.playerList_main_home });
      } else {
        this.state.playerList_main_home[index][cellIndex] = true;
        // スタメン, 欠場のどちらかしか選べない
        if (cellIndex === 2) {
          this.state.playerList_main_home[index][cellIndex+1] = false;
        } else {
          this.state.playerList_main_home[index][cellIndex-1] = false;
        }
        this.setState({ playerList_main_home: this.state.playerList_main_home });
      }  
    } else {
      // Sub
      if(this.state.playerList_sub_home[index][cellIndex] === true) {
        this.state.playerList_sub_home[index][cellIndex] = false;
        this.setState({ playerList_sub_home: this.state.playerList_sub_home });
      } else {
        this.state.playerList_sub_home[index][cellIndex] = true;
        // スタメン, 欠場のどちらかしか選べない
        if (cellIndex === 2) {
          this.state.playerList_sub_home[index][cellIndex+1] = false;
        } else {
          this.state.playerList_sub_home[index][cellIndex-1] = false;
        }        
        this.setState({ playerList_sub_home: this.state.playerList_sub_home });
      }  
    }
  }
  _updateCheckboxVisitor(data, index, cellIndex) {
    if (this.state.isDisplayMainVisitor === 'block') {
      // Main
      if(this.state.playerList_main_visitor[index][cellIndex] === true) {
        this.state.playerList_main_visitor[index][cellIndex] = false;
        this.setState({ playerList_main_visitor: this.state.playerList_main_visitor });
      } else {
        this.state.playerList_main_visitor[index][cellIndex] = true;
        // スタメン, 欠場のどちらかしか選べない
        if (cellIndex === 2) {
          this.state.playerList_main_visitor[index][cellIndex+1] = false;
        } else {
          this.state.playerList_main_visitor[index][cellIndex-1] = false;
        }
        this.setState({ playerList_main_visitor: this.state.playerList_main_visitor });
      }  
    } else {
      // Sub
      if(this.state.playerList_sub_visitor[index][cellIndex] === true) {
        this.state.playerList_sub_visitor[index][cellIndex] = false;
        this.setState({ playerList_sub_visitor: this.state.playerList_sub_visitor });
      } else {
        this.state.playerList_sub_visitor[index][cellIndex] = true;
        // スタメン, 欠場のどちらかしか選べない
        if (cellIndex === 2) {
          this.state.playerList_sub_visitor[index][cellIndex+1] = false;
        } else {
          this.state.playerList_sub_visitor[index][cellIndex-1] = false;
        }
        this.setState({ playerList_sub_visitor: this.state.playerList_sub_visitor });
      }  
    }
  }
  
  // MainとSubのテーブルを切り替える
  _switchMain = () => {
    if (this.state.isDisplayMain !== 'block') {
      if(this.state.isDisplaySub === 'block') { 
        this.setState({isDisplayMain: 'block'})
        this.setState({isDisplaySub: 'none'})
        this.setState({isDisplayMainVisitor: 'none'})
        this.setState({isDisplaySubVisitor: 'none'})
        this.setState({buttonColorMain: '#006a6c'})
        this.setState({buttonColorSub: '#c0c0c0'})
      }
    } else {
      if(this.state.isDisplaySub !== 'block') { 
        this.setState({isDisplayMain: 'none'})
        this.setState({isDisplaySub: 'block'})
        this.setState({isDisplayMainVisitor: 'none'})
        this.setState({isDisplaySubVisitor: 'none'})
        this.setState({buttonColorMain: '#c0c0c0'})
        this.setState({buttonColorSub: '#006a6c'})
      }
    }
  }

  _switchSub = () => {
    if (this.state.isDisplaySub !== 'block') {
      if(this.state.isDisplayMain === 'block') { 
        this.setState({isDisplaySub: 'block'})
        this.setState({isDisplayMain: 'none'})
        this.setState({isDisplayMainVisitor: 'none'})
        this.setState({isDisplaySubVisitor: 'none'})
        this.setState({buttonColorMain: '#c0c0c0'})
        this.setState({buttonColorSub: '#006a6c'})
      }
    } else {
      if(this.state.isDisplayMain !== 'block') { 
        this.setState({isDisplaySub: 'none'})
        this.setState({isDisplayMain: 'block'})
        this.setState({isDisplayMainVisitor: 'none'})
        this.setState({isDisplaySubVisitor: 'none'})
        this.setState({buttonColorMain: '#006a6c'})
        this.setState({buttonColorSub: '#c0c0c0'})
      }
    }
  }

  _switchMainVisitor = () => {
    if (this.state.isDisplayMainVisitor !== 'block') {
      if(this.state.isDisplaySubVisitor === 'block') { 
        this.setState({isDisplayMain: 'none'})
        this.setState({isDisplaySub: 'none'})
        this.setState({isDisplayMainVisitor: 'block'})
        this.setState({isDisplaySubVisitor: 'none'})
        this.setState({buttonColorMainVisitor: '#006a6c'})
        this.setState({buttonColorSubVisitor: '#c0c0c0'})
      }
    } else {
      if(this.state.isDisplaySubVisitor !== 'block') { 
        this.setState({isDisplayMain: 'none'})
        this.setState({isDisplaySub: 'none'})
        this.setState({isDisplayMainVisitor: 'none'})
        this.setState({isDisplaySubVisitor: 'block'})
        this.setState({buttonColorMainVisitor: '#c0c0c0'})
        this.setState({buttonColorSubVisitor: '#006a6c'})
      }
    }
  }

  _switchSubVisitor = () => {
    if (this.state.isDisplaySubVisitor !== 'block') {
      if(this.state.isDisplayMainVisitor === 'block') { 
        this.setState({isDisplayMain: 'none'})
        this.setState({isDisplaySub: 'none'})
        this.setState({isDisplaySubVisitor: 'block'})
        this.setState({isDisplayMainVisitor: 'none'})
        this.setState({buttonColorMainVisitor: '#c0c0c0'})
        this.setState({buttonColorSubVisitor: '#006a6c'})
      }
    } else {
      if(this.state.isDisplayMainVisitor !== 'block') { 
        this.setState({isDisplayMain: 'none'})
        this.setState({isDisplaySub: 'none'})
        this.setState({isDisplaySubVisitor: 'none'})
        this.setState({isDisplayMainVisitor: 'block'})
        this.setState({buttonColorMainVisitor: '#006a6c'})
        this.setState({buttonColorSubVisitor: '#c0c0c0'})
      }
    }
  }

  onTeamChange(option, index) {
    this.setState({ defaultValue: option});
    if(index === 0) {
      // Home表示
      this.setState({ isDisplayHome: 'block' });
      this.setState({ isDisplayVisitor: 'none' });
      if(this.state.buttonColorMain === '#006a6c') {
        this.setState({ isDisplayMain: 'block' });
        this.setState({ isDisplaySub: 'none' });
        this.setState({ isDisplayMainVisitor: 'none' });
        this.setState({ isDisplaySubVisitor: 'none' });
        this.setState({buttonColorMain: '#006a6c'});
        this.setState({buttonColorSub: '#c0c0c0'});
      } else {
        this.setState({ isDisplayMain: 'none' });
        this.setState({ isDisplaySub: 'block' });
        this.setState({ isDisplayMainVisitor: 'none' });
        this.setState({ isDisplaySubVisitor: 'none' });
        this.setState({buttonColorMain: '#c0c0c0'});
        this.setState({buttonColorSub: '#006a6c'});
      }
    } else {
      // Visitor表示
      this.setState({ isDisplayHome: 'none' });
      this.setState({ isDisplayVisitor: 'block' });
      if(this.state.buttonColorMainVisitor === '#006a6c') {
        this.setState({ isDisplayMain: 'none' });
        this.setState({ isDisplaySub: 'none' });
        this.setState({ isDisplayMainVisitor: 'block' });
        this.setState({ isDisplaySubVisitor: 'none' });
        this.setState({buttonColorMainVisitor: '#006a6c'})
        this.setState({buttonColorSubVisitor: '#c0c0c0'})  
      } else {
        this.setState({ isDisplayMain: 'none' });
        this.setState({ isDisplaySub: 'none' });
        this.setState({ isDisplayMainVisitor: 'none' });
        this.setState({ isDisplaySubVisitor: 'block' });
        this.setState({buttonColorMainVisitor: '#c0c0c0'})
        this.setState({buttonColorSubVisitor: '#006a6c'})  
      }
    }
  }

  // カラーモーダルの色選択
  onSelectColor = (color) => {
    if(this.state.isHome === true) {
      this.setState({ 
        team_color_home: color,
      });
    } else {
      this.setState({ 
        team_color_visitor: color,
      });
    }
  }

  // カラーモーダル起動
  toggleColorModal = () => {
    this.setState({ 
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
      isHome: true,
    });
  }
  toggleColorModalVisitor = () => {
    this.setState({ 
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
      isHome: false,
    });
  }

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

  // Assignボタン押下時
  assignPlayers = async(event) => {
    let player_list_home = [], player_list_visitor = [];
    if (this.state.buttonColorMain === '#006a6c') {
      player_list_home = this.state.playerList_main_home;
    } else {
      player_list_home = this.state.playerList_sub_home;
    }
    // 入力チェック
    if (!this.inputCheck(player_list_home, this.state.team_name_home.label)) { return; }

    if (this.state.buttonColorMainVisitor === '#006a6c') {
      player_list_visitor = this.state.playerList_main_visitor;
    } else {
      player_list_visitor = this.state.playerList_sub_visitor;
    }
    // 入力チェック
    if (!this.inputCheck(player_list_visitor, this.state.team_name_visitor.label)) { return; }

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

        // スタメン, ベンチの振り分け
        // Home
        let starters_home = [], reserves_home = [];
        for (let index = 0; player_list_home[index]; index++) {
          if(player_list_home[index][2] === true) {
            // スタメン
            starters_home.push({
              number: ToHalfWidth(player_list_home[index][0]),
              user: player_list_home[index][1],
            });  
          } else if(player_list_home[index][2] === false && player_list_home[index][3] === false) {
            // ベンチスタート
            reserves_home.push({
              number: ToHalfWidth(player_list_home[index][0]),
              user: player_list_home[index][1],
            });  
          } else {
            // 欠場選手は登録しない
          }
        }
        // Visitor
        let starters_visitor = [], reserves_visitor = [];
        for (let index = 0; player_list_visitor[index]; index++) {
          if(player_list_visitor[index][2] === true) {
            // スタメン
            starters_visitor.push({
              number: ToHalfWidth(player_list_visitor[index][0]),
              user: player_list_visitor[index][1],
            });  
          } else if(player_list_visitor[index][2] === false && player_list_visitor[index][3] === false) {
            // ベンチスタート
            reserves_visitor.push({
              number: ToHalfWidth(player_list_visitor[index][0]),
              user: player_list_visitor[index][1],
            });  
          } else {
            // 欠場選手は登録しない
          }
        }

        const param = {
          category: Constants.DB_CATEGORY.UPDATE,
          pk: cognitoUser.username,
          sk: this.state.game_id,
          data: {
            starters_home: starters_home, 
            subs_home: reserves_home, 
            starters_visitor: starters_visitor, 
            subs_visitor: reserves_visitor, 
            home_teamcolors: this.state.team_color_home, 
            visitor_teamcolors: this.state.team_color_visitor,
          },
        };

        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.PUT, succ, param, Constants.SK_TYPE.GAME);
      }
    });
  }
  // Create Playerボタン押下時
  createPlayer = () => {
    // CreatePlayer画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.CREATE_PLAYER,
      // 画面遷移パラメータ
      { 
        'selectedTeam': this.state.defaultValue,
        'team': this.state.teamList,
      }
      );    
  }

  // OKボタン押下時
  goToGameInfo = (item) => {
    this.setState({ isConfirmDialogVisible: false });
    // GameInfo画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.GAME_INFO,
      // 画面遷移パラメータ
      { 
        'date': this.state.itemList.date,
        'event': this.state.itemList.event,
        'stage': this.state.itemList.stage,
        'team': this.state.itemList.team,
      }
    );
  }
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  // API Gateway経由でDynamoDBにリクエストを行う
  requestInfo = async(method, succ, param, type) => {
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
        
        let items1 = [], items2 = [];
        if(method === Constants.REQUEST_METHOD.POST) {
          // プレイヤーリスト取得
          response.data.Items.forEach(function(name, index) {
            const main_number = response.data.Items[index].main_number;
            const sub_number = response.data.Items[index].sub_number;
            const player_name = response.data.Items[index].info_name;
            const player_id = response.data.Items[index].sk;
            // チェックボックスの初期値OFF
            items1.push([
              main_number, player_name, false, false,
            ]);
            items2.push([
              sub_number, player_name, false, false,
            ]);
          })
          // プレイヤー番号の昇順に並び替え
          items1.sort(function(a, b) {
            return a[0] - b[0];
          });
          items2.sort(function(a, b) {
            return a[0] - b[0];
          });
          
          // プレイヤーリストセット
          if(type === 'home') {
            this.setState({ playerList_main_home: items1 });
            this.setState({ playerList_sub_home: items2 });
          } else {
            this.setState({ playerList_main_visitor: items1 });
            this.setState({ playerList_sub_visitor: items2 });  
          }

        } else {
          // PUTの場合は登録処理なので、確認ダイアログオープン
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
  
  // 初期処理
  init = async(event) => {
    // Cognitoユーザー取得
    cognitoUser = await GetCognitoUser();
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

        // Player情報取得（ホーム）
        let param1 = {
          category: Constants.QUERY_PATTERN.TYPE_1,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.PLAYER,
          lsi: {name: 'main_team', val: this.state.team_name_home.value},
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param1, 'home');

        // Player情報取得（ビジター）
        let param2 = {
          category: Constants.QUERY_PATTERN.TYPE_1,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.PLAYER,
          lsi: {name: 'main_team', val: this.state.team_name_visitor.value},
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param2, 'visitor');
      }
    });
  }

  // 入力チェック
  inputCheck(playerList, team_name) {
    // 入力チェックフラグ
    let isCkeck = true;
    // スタメンのカウント数
    let starter_cnt = 0;

    // 背番号リスト作成
    let playernum_list = [];
    playerList.forEach(function(name, index) {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(playerList[index][0]);
      // 正規表現(半角数字)
      let reg = new RegExp(/^([0-9]{1,3})$/);
      if(!reg.test(chkVal)) {
        isCkeck = false;
      }
      playernum_list.push(chkVal);

      if (playerList[index][2] == true) {
        starter_cnt++;
    }
    });

    // 形式チェック(数値)
    if(!isCkeck) {
      this.setState({ errorMessage: '【' + team_name + '】 ' + Messages.WARN.W004 });
      return false;  
    }

    // 背番号の重複チェック
    const duplicateArray = playernum_list.filter(function (x, i, self) {
      // return self[i].indexOf(x) !== self[i];
      return self.indexOf(x) !== self.lastIndexOf(x);
    });
    if (duplicateArray.length > 0) {
      // 重複していた場合、メッセージを出力して処理終了
      this.setState({ errorMessage: '【' + team_name + '】 ' + Messages.WARN.W005 });
      return false;
    }

    // スタメンのカウントチェック
    if (starter_cnt !== 5) {
      this.setState({ errorMessage: '【' + team_name + '】 ' + Messages.WARN.W006 });
      return false;  
    }
    
    return true;
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    const flexArr = [0.4, 2, 0.8, 0.8];
    const selectedColor = this.state.isHome ? this.state.team_color_home : this.state.team_color_visitor;

    const elementText = (data, index, cellIndex) => (
      <TextInput
        onChangeText={player_number => this._updateText({ player_number, index, cellIndex })}
        style={[styles.input, styles.formElement, AssignPlayersStyles.input_custom]}
        autoCapitalize={'none'}
        placeholder=""
        spellCheck={false}
        // placeholderTextColor={''}
        keyboardType={'default'}
        defaultValue={data}
      />
    );
    const elementText_visitor = (data, index, cellIndex) => (
      <TextInput
      onChangeText={player_number => this._updateTextVisitor({ player_number, index, cellIndex })}
      style={[styles.input, styles.formElement, AssignPlayersStyles.input_custom]}
        autoCapitalize={'none'}
        placeholder=""
        spellCheck={false}
        placeholderTextColor={''}
        keyboardType={'number-pad'}
        defaultValue={data}
      />
    );
    const elementCheckBox = (data, index, cellIndex) => (
      <CheckBox onPress={() => this._updateCheckbox(data, index, cellIndex)}
        id={`id_${index}`}
        center
        title=''
        checked={data}
        />
    );
    const elementCheckBox_visitor = (data, index, cellIndex) => (
      <CheckBox onPress={() => this._updateCheckboxVisitor(data, index, cellIndex)}
        id={`id_${index}`}
        center
        title=''
        checked={data}
        />
    );
  
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
            <View style={[styles.row, AssignPlayersStyles.contents_a]}>
              <Text style={[styles.errorText, AssignPlayersStyles.errorText_custom]}>{this.state.errorMessage}</Text>
            </View>

            <View style={[styles.row, AssignPlayersStyles.contents_b]}>
              {/* Team Color Home */}
              <View style={[styles.col, AssignPlayersStyles.contents_c, {display: this.state.isDisplayHome,}]}>
                <TouchableOpacity onPress={this.toggleColorModal}>
                  <Icon style={[styles.icon, styles.icon_tshirt, {color: this.state.team_color_home}]} name='tshirt'/>
                </TouchableOpacity>
              </View>
              {/* Team Color Visitor */}
              <View style={[styles.col, AssignPlayersStyles.contents_c, {display: this.state.isDisplayVisitor,}]}>
                <TouchableOpacity onPress={this.toggleColorModalVisitor}>
                  <Icon style={[styles.icon, styles.icon_tshirt, {color: this.state.team_color_visitor}]} name='tshirt'/>
                </TouchableOpacity>
              </View>
              {/* カラーモーダル */}
              <SafeAreaView>
                <Modal
                isVisible={this.state.isColorPickerModalVisible}
                swipeDirection={['up', 'down', 'left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.toggleColorModal}
                >
                  <View style={styles.color_modal}>
                    <ColorPicker
                      colors={this.state.colors}
                      onSelect={this.onSelectColor}
                    />
                    <TouchableOpacity
                      style={[styles.button_md, styles.formElement, styles.buttonColor_silver]}
                        onPress={this.toggleColorModal}>                  
                      <Text style={[styles.buttonText_black]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </SafeAreaView>

              <View style={[styles.col, AssignPlayersStyles.contents_c]}>
                <Text style={[styles.labelText_black, AssignPlayersStyles.labelText_custom]}>Team Name</Text>
                <Text style={[styles.labelText_black, AssignPlayersStyles.labelText_custom]}>Number</Text>
              </View>

              <View style={[styles.col, AssignPlayersStyles.contents_c]}>
                {/* Team Name */}
                <View style={styles.cell}>
                  <ModalDropdown 
                    ref="dropdown1"
                    style={[styles.dropdown, AssignPlayersStyles.dropdown_custom]}
                    textStyle={[styles.dropdown_text]}
                    dropdownStyle={[styles.dropdown_dropdown, AssignPlayersStyles.dropdown_dropdown_custom, {height: hp(this.state.teamList.length * 4.5)}]}
                    defaultValue={this.state.defaultValue.label}
                    defaultTextStyle={styles.defaultTextStyle}
                    options={this.state.teamList}
                    renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                    renderRow={this._dropdown_renderRow.bind(this)}
                    renderRowComponent={TouchableHighlight}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    onSelect={(option, index) => this.onTeamChange(option, index)}
                  />
                </View>

                {/* Number Home */}
                <View style={[styles.row, AssignPlayersStyles.contents_d, {display: this.state.isDisplayHome,}]}>
                  <TouchableOpacity style={[styles.button_md, styles.formElement, {backgroundColor: this.state.buttonColorMain}]} onPress={() => this._switchMain()}>
                    <Text style={[styles.buttonText]}>Main</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button_md, styles.formElement, {backgroundColor: this.state.buttonColorSub}]} onPress={() => this._switchSub()}>
                    <Text style={[styles.buttonText]}>Sub</Text>
                  </TouchableOpacity>
                </View>
                {/* Number Visitor */}
                <View style={[styles.row, AssignPlayersStyles.contents_d, {display: this.state.isDisplayVisitor,}]}>
                  <TouchableOpacity style={[styles.button_md, styles.formElement, {backgroundColor: this.state.buttonColorMainVisitor}]} onPress={() => this._switchMainVisitor()}>
                    <Text style={[styles.buttonText]}>Main</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button_md, styles.formElement, {backgroundColor: this.state.buttonColorSubVisitor}]} onPress={() => this._switchSubVisitor()}>
                    <Text style={[styles.buttonText]}>Sub</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.row, AssignPlayersStyles.contents_d]}>
                <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createPlayer()}>
                    <Text style={[styles.buttonText]}>Create Player</Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* Players Table Main Home */}
            <View style={[styles.column, AssignPlayersStyles.contents_e, {display: this.state.isDisplayMain,}]}>
              <View style={[{flex: 1}]}>
                <Table borderStyle={styles.tableBorderWidth}>
                  <Row data={this.state.tableHead} style={styles.tableHead} textStyle={styles.tableHeadText} flexArr={flexArr}/>
                </Table>
                <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                  <Table borderStyle={styles.tableBorderWidth}>
                    {
                      this.state.playerList_main_home.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.tableRow}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                flex={flexArr[cellIndex]}
                                key={cellIndex}
                                data={(cellIndex === 0) ? elementText(cellData, index, cellIndex) : ( (cellIndex === 2 || cellIndex === 3) ? elementCheckBox(cellData, index, cellIndex) : cellData )} textStyle={styles.tableText}/>
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </ScrollView>
                {/* 画面下部0.5%はスクロール外領域とする */}
                <Text style={{ height: this.state.height * 0.005,}}></Text>
              </View>
            </View>

            {/* Players Table Sub Home */}
            <View style={[styles.column, AssignPlayersStyles.contents_e, {display: this.state.isDisplaySub,}]}>
              <View style={[{flex: 1}]}>
                <Table borderStyle={styles.tableBorderWidth}>
                  <Row data={this.state.tableHead} style={styles.tableHead} textStyle={styles.tableHeadText} flexArr={flexArr}/>
                </Table>
                <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                  <Table borderStyle={styles.tableBorderWidth}>
                    {            
                      this.state.playerList_sub_home.map((rowData, index) => (              
                        <TableWrapper key={index} style={styles.tableRow}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                flex={flexArr[cellIndex]}
                                key={cellIndex}
                                data={(cellIndex === 0) ? elementText(cellData, index, cellIndex) : ( (cellIndex === 2 || cellIndex === 3) ? elementCheckBox(cellData, index, cellIndex) : cellData )} textStyle={styles.tableText}/>
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </ScrollView>
                {/* 画面下部0.5%はスクロール外領域とする */}
                <Text style={{ height: this.state.height * 0.005,}}></Text>
              </View>
            </View>

            {/* Players Table Main Visitor */}
            <View style={[styles.column, AssignPlayersStyles.contents_e, {display: this.state.isDisplayMainVisitor,}]}>
              <View style={[{flex: 1}]}>
                <Table borderStyle={styles.tableBorderWidth}>
                  <Row data={this.state.tableHead} style={styles.tableHead} textStyle={styles.tableHeadText} flexArr={flexArr}/>
                </Table>
                <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                  <Table borderStyle={styles.tableBorderWidth}>
                    {
                      this.state.playerList_main_visitor.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.tableRow}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                flex={flexArr[cellIndex]}
                                key={cellIndex}
                                data={(cellIndex === 0) ? elementText_visitor(cellData, index, cellIndex) : ( (cellIndex === 2 || cellIndex === 3) ? elementCheckBox_visitor(cellData, index, cellIndex) : cellData )} textStyle={styles.tableText}/>
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </ScrollView>
                {/* 画面下部0.5%はスクロール外領域とする */}
                <Text style={{ height: this.state.height * 0.005,}}></Text>
              </View>
            </View>

            {/* Players Table Sub Visitor */}
            <View style={[styles.column, AssignPlayersStyles.contents_e, {display: this.state.isDisplaySubVisitor,}]}>
              <View style={[{flex: 1}]}>
                <Table borderStyle={styles.tableBorderWidth}>
                  <Row data={this.state.tableHead} style={styles.tableHead} textStyle={[styles.labelText_black, styles.tableHeadText]} flexArr={flexArr}/>
                </Table>
                <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                  <Table borderStyle={styles.tableBorderWidth}>
                    {            
                      this.state.playerList_sub_visitor.map((rowData, index) => (              
                        <TableWrapper key={index} style={[styles.tableRow]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                flex={flexArr[cellIndex]}
                                key={cellIndex}
                                data={(cellIndex === 0) ? elementText_visitor(cellData, index, cellIndex) : ( (cellIndex === 2 || cellIndex === 3) ? elementCheckBox_visitor(cellData, index, cellIndex) : cellData )} textStyle={styles.tableText}/>
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </ScrollView>
                {/* 画面下部0.5%はスクロール外領域とする */}
                <Text style={{ height: this.state.height * 0.005,}}></Text>
              </View>
            </View>
                        
            {/* ボタン */}
            <View style={[styles.row, AssignPlayersStyles.contents_f]}>
              <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.assignPlayers()}>
                <Text style={[styles.buttonText]}>Assign</Text>
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
                onPress: () => this.goToGameInfo(this.state.itemList)
              }}
            />
          </View>
      </ImageBackground>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(AssignPlayers);