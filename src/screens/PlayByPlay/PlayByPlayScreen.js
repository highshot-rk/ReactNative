/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// モーダルダイアログ
import Modal from "react-native-modal";
// テーブル表示
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// 検索ボックス、チェックボックス
import { SearchBar, CheckBox } from 'react-native-elements';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/CommonStyles';
import PlayByPlayStyles from './PlayByPlayStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';
import ExcludeDuplicate from '../../util/ExcludeDuplicateArray';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;

class PlayByPlay extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = { 
      width: 0, 
      height: 0,

      cognitoUser: null,
      token: null,
      // 画面ID
      screen_category: Constants.SCREEN_CATEGORY.PLAY_BY_PLAY,
      // ローディングスピナー表示フラグ
      isLoadingVisible: false,
      // 確認ダイアログ表示フラグ
      isConfirmDialogVisible: false,
      // 編集モーダル表示フラグ
      isEditModalVisible: false,
      // スコアテーブルヘッダー
      scoreTableHead: [
        ['Team', 'Q1', 'Q2', 'Q3', 'Q4', 'OT', '合計', 'Foul', 'TO'],
      ],
      // スコアテーブルデータ（モック用）
      // scoreDatas: [
      //   ['Team 東京 ABC', '10', '6', '8', '6', '0', '30', '2', '2'],
      //   ['Team 東北 XYZ', '6', '12', '6', '10', '0', '34', '4', '1'],
      // ],
      scoreDatas: [],
      // スコアテーブルの幅
      flexScoreArr: [300, 100, 100, 100, 100, 100, 100, 100, 100],

      // プレイバイプレイテーブルヘッダー
      tableHead: [
        [
          'Player',
          'Play',
          'Result',
          'Period',
          'Time',
          'Score',
          'Player',
          'Play',
          'Result',
          'timestamp',
          'connection_id',
          'home_visitor',
          'add_user',
          'conv_coordinate',
          'coordinate',
          'shot_area',
          'point',
          'check_flag',
          'update_user',
        ],
      ],
      // プレイバイプレイテーブルデータ（モック用）
      playbyplayDatas: [
        ['#10 AAA', 'Change', 'In', 'Q1', '10:00', '99-99', '', '', ''],
        ['#11 AAA', 'DEF_REB', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#12 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#13 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#14 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#15 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#16 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#17 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#18 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['#19 AAA', 'Change', 'In', 'Q1', '10:00', '0-0', '', '', ''],
        ['', '', '', 'Q1', '10:00', '0-0', '#20 BBB', 'ABC', 'In'],
        ['', '', '', 'Q1', '10:00', '0-0', '#21 BBB', 'ABC', 'In'],
        ['', '', '', 'Q1', '10:00', '0-0', '#22 BBB', 'ABC', 'In'],
        ['', '', '', 'Q1', '10:00', '0-0', '#23 BBB', 'ABC', 'In'],
        ['', '', '', 'Q1', '10:00', '0-0', '#24 BBB', 'ABC', 'In'],
        ['', '', '', 'Q2', '10:00', '0-0', '#25 BBB', 'ABC', 'Out'],
        ['', '', '', 'Q2', '10:00', '0-0', '#26 BBB', 'DEF_REB', ''],
        ['', '', '', 'Q2', '10:00', '0-0', '#27 BBB', 'Change', 'Out'],
        ['', '', '', 'Q2', '10:00', '0-0', '#28 BBB', 'Change', 'Out'],
        ['', '', '', 'Q2', '10:00', '0-0', '#29 BBB', 'Change', 'Out'],
        ['#10 AAA', 'Change', 'In', 'Q3', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q3', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q3', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q3', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q3', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q4', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q4', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q4', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q4', '10:00', '0-0', 'BBB', 'Change', 'In'],
        ['#10 AAA', 'Change', 'In', 'Q4', '10:00', '0-0', 'BBB', 'Change', 'In'],
      ],
      // playbyplayDatas: [],

      // プレイバイプレイテーブルの幅
      flexArr: [120, 100, 100, 80, 80, 80, 120, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


      // 抽出結果格納用
      filteredPlaybyplayDatas: [],
      resultPlaybyplayDatas: [],

      // 検索テキスト値
      searchText: '',
      // 選択行の色
      selectedBgColor: '',
      // 選択行のインデックス番号
      selectedIndex: -1,

      // 時間ドロップダウンリスト
      hourList: [
        {label:'00', value: '00'},
        {label:'01', value: '01'},
        {label:'02', value: '02'},
        {label:'03', value: '03'},
        {label:'04', value: '04'},
        {label:'05', value: '05'},
        {label:'06', value: '06'},
        {label:'07', value: '07'},
        {label:'08', value: '08'},
        {label:'09', value: '09'},
        {label:'10', value: '10'},
        {label:'11', value: '11'},
        {label:'12', value: '12'},
        {label:'13', value: '13'},
        {label:'14', value: '14'},
        {label:'15', value: '15'},
        {label:'16', value: '16'},
        {label:'17', value: '17'},
        {label:'18', value: '18'},
        {label:'19', value: '19'},
        {label:'20', value: '20'},
        {label:'21', value: '21'},
        {label:'22', value: '22'},
        {label:'23', value: '23'},
      ],
      // 分ドロップダウンリスト
      minuteList: [
        {label:'00', value: '00'},
        {label:'01', value: '01'},
        {label:'02', value: '02'},
        {label:'03', value: '03'},
        {label:'04', value: '04'},
        {label:'05', value: '05'},
        {label:'06', value: '06'},
        {label:'07', value: '07'},
        {label:'08', value: '08'},
        {label:'09', value: '09'},
        {label:'10', value: '10'},
        {label:'11', value: '11'},
        {label:'12', value: '12'},
        {label:'13', value: '13'},
        {label:'14', value: '14'},
        {label:'15', value: '15'},
        {label:'16', value: '16'},
        {label:'17', value: '17'},
        {label:'18', value: '18'},
        {label:'19', value: '19'},
        {label:'20', value: '20'},
        {label:'21', value: '21'},
        {label:'22', value: '22'},
        {label:'23', value: '23'},
        {label:'24', value: '24'},
        {label:'25', value: '25'},
        {label:'26', value: '26'},
        {label:'27', value: '27'},
        {label:'28', value: '28'},
        {label:'29', value: '29'},
        {label:'30', value: '30'},
        {label:'31', value: '31'},
        {label:'32', value: '32'},
        {label:'33', value: '33'},
        {label:'34', value: '34'},
        {label:'35', value: '35'},
        {label:'36', value: '36'},
        {label:'37', value: '37'},
        {label:'38', value: '38'},
        {label:'39', value: '39'},
        {label:'40', value: '40'},
        {label:'41', value: '41'},
        {label:'42', value: '42'},
        {label:'43', value: '43'},
        {label:'44', value: '44'},
        {label:'45', value: '45'},
        {label:'46', value: '46'},
        {label:'47', value: '47'},
        {label:'48', value: '48'},
        {label:'49', value: '49'},
        {label:'50', value: '50'},
        {label:'51', value: '51'},
        {label:'52', value: '52'},
        {label:'53', value: '53'},
        {label:'54', value: '54'},
        {label:'55', value: '55'},
        {label:'56', value: '56'},
        {label:'57', value: '57'},
        {label:'58', value: '58'},
        {label:'59', value: '59'},
      ],
      // ピリオドドロップダウンリスト
      periodList: Constants.PERIOD_LIST,
      // チームドロップダウンリスト
      teamList: [],
      // プレイヤードロップダウンリスト
      playerList: [],
      // プレイドロップダウンリスト
      playList: Constants.PLAY_LIST,
      // リザルトドロップダウンリスト
      resultList: [],
      // リザルトリスト（フリースロー）ドロップダウンリスト
      resultList_ft1: [],
      resultList_ft2: [],
      resultList_ft3: [],

      // プレイヤー（ホーム）リスト
      playerListHome: [],
      // プレイヤー（ビジター）リスト
      playerListVisitor: [],

      // スコア情報
      scoreList: [],
      // プレイバイプレイ情報
      playbyplayList: [],

      // 行データ
      rowData: [],

      // チェックボックスのON/OFF状態制御
      checked: false,

      // ドロップダウンの活性・非活性状態制御
      disabled: true,
      dropdownBgColor: '#c0c0c0',
      disabled_result: true,
      dropdownBgColor_result: '#c0c0c0',
      disabled_result_ft1: true,
      dropdownBgColor_result_ft1: '#c0c0c0',
      disabled_result_ft2: true,
      dropdownBgColor_result_ft2: '#c0c0c0',
      disabled_result_ft3: true,
      dropdownBgColor_result_ft3: '#c0c0c0',

      // ドロップダウンの表示・非表示状態制御
      displayed_result: 'block',
      displayed_ft: 'none',

      // ホーム・ビジターを識別するフラグ
      home_visitor: 0, // 0:Home, 1:Visitor
      // ゲーム情報ラベル
      date:  [],
      event: [],
      stage: [],
      game_card: [],
      game_id: '',

      // スコア情報ラベル
      team_home: [],
      team_visitor: [],

      // 編集モーダルドロップダウン初期選択値
      hour: '',
      minute: '',
      period: '',
      team: '',
      player: [],
      play: '',
      result: '',
      result_ft1: '',
      result_ft2: '',
      result_ft3: '',

      // ラベル名称
      label_period: 'Period',
      label_gametime: 'Time',
      label_event: 'Event',
      label_team: 'Team',
      label_player: 'Player',
      label_play: 'Play',
      label_result: 'Result',

      // ピリオドボタン名称
      period_all: { label: 'ALL', color: '#006a6c' },
      period_q1: { label: 'Q1', color: '#c0c0c0' },
      period_q2: { label: 'Q2', color: '#c0c0c0' },
      period_q3: { label: 'Q3', color: '#c0c0c0' },
      period_q4: { label: 'Q4', color: '#c0c0c0' },
      period_ot: { label: 'OT', color: '#c0c0c0' },
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);

    const { navigation } = this.props;    
    // 画面遷移時の再レンダリング対応
    this.focusListener = navigation.addListener("didFocus", (payload) => {
      // 画面遷移パラメーター
      if (payload.state.params!== undefined) {
        this.setState({
          date: payload.state.params.date,
          event: payload.state.params.event,
          stage: payload.state.params.stage,
          game_card: payload.state.params.game_card,
          team_home: payload.state.params.team_home,
          team_visitor: payload.state.params.team_visitor,
          game_id: payload.state.params.game_id,
        });
      }

      // 初期処理
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

  // 行選択時のイベント
  _onSelectedRow(rowData, index) {
    this.setState({
      selectedBgColor: '#a3d6cc', // 選択行をアイスグリーンに変更
      selectedIndex: index,
    });
    // 行データセット
    this.setState({ rowData: rowData });    
  }

  // ピリオド押下時のイベント処理
  _onChangePeriod(label) {
    // 選択行の色リセット
    this.setState({
      selectedBgColor: '',
      selectedIndex: -1,
    });

    let filtered = []; 
    if (label === 'ALL') {
      filtered = this.state.playbyplayDatas;
      this.setState({filteredPlaybyplayDatas: filtered});
      this.setState({
        period_all: { label: 'ALL', color: '#006a6c' },
        period_q1: { label: 'Q1', color: '#c0c0c0' },
        period_q2: { label: 'Q2', color: '#c0c0c0' },
        period_q3: { label: 'Q3', color: '#c0c0c0' },
        period_q4: { label: 'Q4', color: '#c0c0c0' },
        period_ot: { label: 'OT', color: '#c0c0c0' },
      });
    } else {
      filtered = this.state.playbyplayDatas.filter(item => item[3] === label);
      this.setState({filteredPlaybyplayDatas: filtered});
      if (label === 'Q1') {
        this.setState({
          period_q1: { label: 'Q1', color: '#006a6c' },
          period_all: { label: 'ALL', color: '#c0c0c0' },
          period_q2: { label: 'Q2', color: '#c0c0c0' },
          period_q3: { label: 'Q3', color: '#c0c0c0' },
          period_q4: { label: 'Q4', color: '#c0c0c0' },
          period_ot: { label: 'OT', color: '#c0c0c0' },
        });  
      } else if(label === 'Q2') {
        this.setState({
          period_q2: { label: 'Q2', color: '#006a6c' },
          period_all: { label: 'ALL', color: '#c0c0c0' },
          period_q1: { label: 'Q1', color: '#c0c0c0' },
          period_q3: { label: 'Q3', color: '#c0c0c0' },
          period_q4: { label: 'Q4', color: '#c0c0c0' },
          period_ot: { label: 'OT', color: '#c0c0c0' },
        });  

      } else if(label === 'Q3') {
        this.setState({
          period_q3: { label: 'Q3', color: '#006a6c' },
          period_all: { label: 'ALL', color: '#c0c0c0' },
          period_q1: { label: 'Q1', color: '#c0c0c0' },
          period_q2: { label: 'Q2', color: '#c0c0c0' },
          period_q4: { label: 'Q4', color: '#c0c0c0' },
          period_ot: { label: 'OT', color: '#c0c0c0' },
        });  
      } else if(label === 'Q4') {
        this.setState({
          period_q4: { label: 'Q4', color: '#006a6c' },
          period_all: { label: 'ALL', color: '#c0c0c0' },
          period_q1: { label: 'Q1', color: '#c0c0c0' },
          period_q2: { label: 'Q2', color: '#c0c0c0' },
          period_q3: { label: 'Q3', color: '#c0c0c0' },
          period_ot: { label: 'OT', color: '#c0c0c0' },
        });  
      } else {
        this.setState({
          period_ot: { label: 'Q4', color: '#006a6c' },
          period_all: { label: 'ALL', color: '#c0c0c0' },
          period_q1: { label: 'Q1', color: '#c0c0c0' },
          period_q2: { label: 'Q2', color: '#c0c0c0' },
          period_q3: { label: 'Q3', color: '#c0c0c0' },
          period_q4: { label: 'Q4', color: '#c0c0c0' },
        });
      }
    }
    this.search(this.state.searchText, filtered);
  }

  // 検索ボックス入力時のイベント
  _searchFilterFunction = (text) => {
    this.setState({searchText: text})
    if (text) {
      const textData = text.toUpperCase();
      let newData = [];
      this.state.filteredPlaybyplayDatas.forEach(function (items) {
        items.some(function (item) {
          const itemData = item ? String(item).toUpperCase() : ''.toUpperCase();
          // テキストの文字列が含まれるかどうか
          if (itemData.indexOf(textData) > -1) {
            newData.push(items)
            return true;
          }
        });
      });
      this.setState({resultPlaybyplayDatas: newData});
    } else {
      // Inserted text is blank
      this.setState({resultPlaybyplayDatas: this.state.filteredPlaybyplayDatas});
    }
  };

  // 編集モーダルの開閉
  _toggleEditModal = () => {
    if(this.state.selectedBgColor === '#a3d6cc') {
      this.setState({
        isEditModalVisible: !this.state.isEditModalVisible,
      });

      // 編集モーダルの入力項目セット
      // home_visitorフラグの更新
      if(this.state.rowData[11] === 0) { 
        this.setState({ home_visitor: 0 });
      } else {
        this.setState({ home_visitor: 1 });
      };
      // 時刻
      this.setState({ hour: this.state.rowData[4].slice(0, 2) });
      this.setState({ minute: this.state.rowData[4].slice(-2) });
      // ピリオド
      this.setState({ period: this.state.rowData[3] });
      // チーム
      if(this.state.rowData[11] === 0) { this.setState({ team: this.state.team_home }); }
      else { this.setState({ team: this.state.team_visitor }); };
      this.setState({ teamList: [this.state.team_home, this.state.team_visitor ]});
      this.setState({ checked: false });
      this.setState({ disabled: true });
      this.setState({ dropdownBgColor: '#c0c0c0' });
      // プレイヤー
      let player_home = this.state.rowData[0];
      let player_visitor = this.state.rowData[6];
      if(this.state.rowData[11] === 0) {
        // Home
        const player = this.state.playerListHome.filter(function(obj) { return obj.label === player_home });
        this.setState({ player: player[0] });
        this.setState({ playerList: this.state.playerListHome });
      } else {
        // Visitor
        const player = this.state.playerListVisitor.filter(function(obj) { return obj.label === player_visitor });
        this.setState({ player: player[0] });
        this.setState({ playerList: this.state.playerListVisitor });
      };
      // プレイ
      if(this.state.rowData[11] === 0) { this.setState({ play: this.state.rowData[1] }); }
      else { this.setState({ play: this.state.rowData[7] }); };
      // リザルト
      if(this.state.rowData[11] === 0) { 
        this.setResult(this.state.rowData[1]);
        this.setState({ result: this.state.rowData[2] });
      } else {
        this.setResult(this.state.rowData[7]);
        this.setState({ result: this.state.rowData[8] });
      };
    }
  }

  // 選択画面へ遷移するボタン押下時
  _gameSelection = () => {
    // GameSelection画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.GAME_SELECTION,
      // 画面遷移パラメータ
      { 
        'date': {
          label: this.state.date.label,
          value: this.state.date.value
        },
        'event': {
          label: this.state.event.label,
          value: this.state.event.value
        },
        'stage': {
          label: this.state.stage.label,
          value: this.state.stage.value
        },
        'game_card': {
          label: this.state.game_card.label,
          value: this.state.game_card.value
        },
        'team_home': {
          label: this.state.team_home.label,
          value: this.state.team_home.value
        },
        'team_visitor': {
          label: this.state.team_visitor.label,
          value: this.state.team_visitor.value
        },
        'game_id': this.state.game_id,
        'screen_category': this.state.screen_category,
      }      
    );
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

  // チェックボックス選択時のイベント
  _onSelectCheckbox() {
    this.setState({ checked: !this.state.checked });
    this.setState({ disabled: !this.state.disabled });
    this.setState({ dropdownBgColor: this.state.disabled ? '#ffffff' : '#c0c0c0' });
  }

  // チームドロップダウン変更時のイベント
  _onSelectTeam(option) {
    if(this.state.team_home.value === option.value) {
      this.setState({ player: this.state.playerListHome[0] });
      this.setState({ playerList: this.state.playerListHome });
      this.setState({ home_visitor: 0 }); // Home
    } else {
      this.setState({ player: this.state.playerListVisitor[0] });
      this.setState({ playerList: this.state.playerListVisitor });
      this.setState({ home_visitor: 1 }); // Visitor
    }
  }

  // プレイドロップダウン変更時のイベント
  _onSelectPlay(option) {
    this.setState({ play: option.label });
    this.setResult(option.label);
  }

  _addPlayByPlay = () => {
    this._toggleEditModal();
  }
  _deletePlayByPlay = () => {
    this._toggleEditModal();
  }

  // Add/Update/Deleteボタン押下時のイベント
  _updatePlayByPlay = async(category) => {

    // プレイヤー名取得
    let player = [];
    let label = this.state.player.label;
    if (this.state.home_visitor === 0) {
      // Home
      player = this.state.playerListHome.filter(function(obj) { return obj.label === label });
    } else {
      // Visitor
      player = this.state.playerListVisitor.filter(function(obj) { return obj.label === label });
    }
    const re = /\s+/;
    const playerArr = player[0].label.split(re);
    let player_name = '';
    if (!playerArr[2]) { player_name =String(playerArr[1]); }
    else { player_name =String(playerArr[1]) + " " + String(playerArr[2]); }

    const player_num = playerArr[0].slice(1);
    const player_id = player[0].value;
    
    // パラメーターセット
    const param = {
      category: category,
      user_id: this.state.cognitoUser.username,
      game_id: this.state.game_id,
      // game_id: 'gm_1626139799278010', // テスト実行用
      data: {
        timestamp: this.state.rowData[9],
        connection_id: this.state.rowData[10],
        period : this.state.period,
        game_time: this.state.hour + ':' + this.state.minute,
        team_id: this.state.rowData[11] === 0 ? this.state.team_home.value : this.state.team_visitor.value,
        // team_id: 'tm_1626139798748004', // テスト実行用
        team_name: this.state.rowData[11] === 0 ? this.state.team_home.label : this.state.team_visitor.label,
        player_id: player_id,
        player_name: player_name,
        player_num: player_num,
        play: this.state.play,
        result: this.state.result,
        ft1: this.state.result_ft1,
        ft2: this.state.result_ft2,
        ft3: this.state.result_ft3,
        check_flag: this.state.rowData[17],
        conv_coordinate: this.state.rowData[13],
        coordinate: this.state.rowData[14],
        shot_area: this.state.rowData[15],
        point: this.state.rowData[16],
      },
    };
    // API接続
    this.requestInfo(Constants.REQUEST_METHOD.PUT, this.state.token, param, Constants.SK_TYPE.NONE, Constants.API_NAME.PLAY_BY_PLAY);
      
  }
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/  
  // 初期処理
  init = async(event) => {
    // ピリオドボタン初期化
    this.setState({
      period_all: { label: 'ALL', color: '#006a6c' },
      period_q1: { label: 'Q1', color: '#c0c0c0' },
      period_q2: { label: 'Q2', color: '#c0c0c0' },
      period_q3: { label: 'Q3', color: '#c0c0c0' },
      period_q4: { label: 'Q4', color: '#c0c0c0' },
      period_ot: { label: 'OT', color: '#c0c0c0' },
    });

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
        this.setState({ cognitoUser: cognitoUser });
        this.setState({ token: succ.getAccessToken().getJwtToken() });

        // Game情報取得
        const param1 = {
          category: Constants.QUERY_PATTERN.TYPE_0,
          pk: cognitoUser.username,
          // sk: 'gm_1624385549663141',
          sk: this.state.game_id,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ.getAccessToken().getJwtToken(), param1, Constants.SK_TYPE.GAME, Constants.API_NAME.INFO);

      }
    });
  }

  // API Gateway経由でDynamoDBにリクエストを行う
  requestInfo = async(method, token, param, type, api_name) => {
    // API接続
    await RequestApi(
      method, 
      Constants.API_BASE_URL + api_name,
      token,
      param,
    ).then((response) => {
      if(response !== null) {
        if(method === Constants.REQUEST_METHOD.POST) {
          if(type === Constants.SK_TYPE.GAME) {
            // スコア情報取得
            const scoreinfo = [];
            response.data.Items.forEach(function(item, index) {
              scoreinfo.push({
                score_q1_home: item.socre ? ( item.score[1] ? item.score[1][0] : 0) : 0,
                score_q2_home: item.socre ? ( item.score[2] ? item.score[2][0] : 0) : 0,
                score_q3_home: item.socre ? ( item.score[3] ? item.score[3][0] : 0) : 0,
                score_q4_home: item.socre ? ( item.score[4] ? item.score[4][0] : 0) : 0,
                score_ot_home: item.socre ? ( item.score[5] ? item.score[5][0] : 0) : 0,
                foul_home: item.tagging_data_temp ? item.tagging_data_temp.teamfoul_home : 0,
                timeout_home: item.tagging_data_temp ? item.tagging_data_temp.timeout_home : 0,
                score_total_home: item.socre ? ( item.score[6] ? item.score[6][0] : 0) : 0,
                score_q1_visitor: item.socre ? ( item.score[1] ? item.score[1][1] : 0) : 0,
                score_q2_visitor: item.socre ? ( item.score[2] ? item.score[2][1] : 0) : 0,
                score_q3_visitor: item.socre ? ( item.score[3] ? item.score[3][1] : 0) : 0,
                score_q4_visitor: item.socre ? ( item.score[4] ? item.score[4][1] : 0) : 0,
                score_ot_visitor: item.socre ? ( item.score[5] ? item.score[5][1] : 0) : 0,
                score_total_visitor: item.socre ? ( item.score[6] ? item.score[6][1] : 0) : 0,
                foul_visitor: item.tagging_data_temp ? item.tagging_data_temp.teamfoul_visitor : 0,
                timeout_visitor: item.tagging_data_temp ? item.tagging_data_temp.timeout_visitor : 0,
              });
            })
            // スコアデータ格納
            const datas = [];
            datas.push([
              this.state.team_home.label,
              scoreinfo[0].score_q1_home,
              scoreinfo[0].score_q2_home, 
              scoreinfo[0].score_q3_home,
              scoreinfo[0].score_q4_home,
              scoreinfo[0].score_ot_home,
              scoreinfo[0].score_total_home,
              scoreinfo[0].foul_home,
              scoreinfo[0].timeout_home,
            ]);
            datas.push([
              this.state.team_visitor.label,
              scoreinfo[0].score_q1_visitor,
              scoreinfo[0].score_q2_visitor, 
              scoreinfo[0].score_q3_visitor,
              scoreinfo[0].score_q4_visitor,
              scoreinfo[0].score_ot_visitor,
              scoreinfo[0].score_total_visitor,
              scoreinfo[0].foul_visitor,
              scoreinfo[0].timeout_visitor,
            ]);
            this.setState({ scoreList: scoreinfo });
            this.setState({ scoreDatas: datas });

            // プレイバイプレイ情報取得
            const param2 = {
              user_id: this.state.cognitoUser.username,
              game_id: this.state.game_id,
              team_id_home: this.state.team_home.value,
              team_id_visitor: this.state.team_visitor.value,
              // // テスト実行用
              // game_id: 'gm_1626139799278010',
              // team_id_home: 'tm_1626139798748004',
              // team_id_visitor: 'tm_1626139798748003',
            };
            // API接続
            this.requestInfo(Constants.REQUEST_METHOD.POST, this.state.token, param2, Constants.SK_TYPE.NONE, Constants.API_NAME.PLAY_BY_PLAY);

          } else {
            if(response.data.length === 0) {
              console.log("該当のデータが存在しません");
              // ローディングスピナークローズ
              this.setState({ isLoadingVisible: false, });
              return;
            }
            // プレイバイプレイ情報取得
            const playbyplayinfo = [];
            response.data.forEach(function(item, index) {
              playbyplayinfo.push({
                image_home: item.img_h,
                image_visitor: item.img_v,
                period: item.period,
                play_home: item.play_h,
                play_visitor: item.play_v,
                player_home: item.player_h,
                player_id: item.player_id,
                player_visitor: item.player_v,
                result_home: item.result_h,
                result_visitor: item.result_v,
                score: item.score,
                time: item.time,
                timestamp: item.timestamp,
                connection_id: item.connection_id,
                home_visitor: item.h_v,
                add_user: item.add_user,
                conv_coordinate: item.conv_coordinate,
                coordinate: item.coordinate,
                shot_area: item.shot_area,
                point: item.point,
                check_flag: item.check_flag,
                update_user: item.update_user,
              });
            })

            // プレイバイプレイデータ格納
            let datas = [];
            let playerDatasHome = [], playerDatasVisitor = [];
            playbyplayinfo.forEach(function(item) {
              datas.push([
                item.player_home,
                item.play_home,
                item.result_home,
                item.period,
                item.time,
                item.score,
                item.player_visitor,
                item.play_visitor,
                item.result_visitor,
                item.timestamp,
                item.connection_id,
                item.home_visitor,
                item.add_user,
                item.conv_coordinate,
                item.coordinate,
                item.shot_area,
                item.point,
                item.check_flag,
                item.update_user,
              ]);
              if(item.home_visitor === 0) {
                playerDatasHome.push({              
                  label: item.player_home, value: item.player_id
                });
              } else {
                playerDatasVisitor.push({              
                  label: item.player_visitor, value: item.player_id
                });  
              }
            });

            // Periodの昇順、Timeの降順にソート
            datas = this.sortedDatas(datas);

            this.setState({ playbyplayList: playbyplayinfo });
            this.setState({ playbyplayDatas: datas });
            this.setState({ resultPlaybyplayDatas: datas });
            this.setState({ filteredPlaybyplayDatas: datas });

            // 重複除外
            playerDatasHome = ExcludeDuplicate(playerDatasHome);
            playerDatasVisitor = ExcludeDuplicate(playerDatasVisitor);
            this.setState({ playerListHome: playerDatasHome});
            this.setState({ playerListVisitor: playerDatasVisitor});

            // ローディングスピナークローズ
            this.setState({ isLoadingVisible: false, });
          }
        
        } else {
          // レコードの登録・更新・削除処理

          // リザルト値変換
          const result_value = this.convertResultValue();

          // レコードセット
          const record = [
            this.state.home_visitor === 0 ? this.state.player.label : '',
            this.state.home_visitor === 0 ? this.state.play : '',
            this.state.home_visitor === 0 ? result_value : '',
            this.state.period,
            this.state.hour + ':' + this.state.minute,
            this.state.rowData[5],
            this.state.home_visitor === 0 ? '' : this.state.player.label,
            this.state.home_visitor === 0 ? '' : this.state.play,
            this.state.home_visitor === 0 ? '' : result_value,
            this.state.rowData[9],
            this.state.rowData[10],
            this.state.home_visitor,
            this.state.rowData[12],
            this.state.rowData[13],
            this.state.rowData[14],
            this.state.rowData[15],
            this.state.rowData[16],
            this.state.rowData[17],
            this.state.rowData[18],
          ];

          let addData1 = this.state.resultPlaybyplayDatas;
          let addData2 = this.state.playbyplayDatas;

          if (param.category == Constants.DB_CATEGORY.ADD) {            
            // レコード追加
            addData1.push(record);
            addData2.push(record);
            // Periodの昇順、Timeの降順にソート
            addData1 = this.sortedDatas(addData1);
            addData2 = this.sortedDatas(addData2);
            console.log("登録完了")

          } else if (param.category == Constants.DB_CATEGORY.UPDATE) {
            // レコード更新
            addData1.splice(this.state.selectedIndex, 1, record);
            addData2.splice(this.state.selectedIndex, 1, record);
            console.log("更新完了")
          }　else if (param.category == Constants.DB_CATEGORY.DELETE) {
            // レコード削除
            addData1.splice(this.state.selectedIndex, 1);
            addData2.splice(this.state.selectedIndex, 1);
            console.log("削除完了")
          }　else {
            // 存在しないカテゴリ
            console.log('存在しないカテゴリが選択されました');
          }
          this.setState({ resultPlaybyplayDatas: addData1 });
          this.setState({ playbyplayDatas: addData2 });

          // ローディングスピナークローズ
          this.setState({ isLoadingVisible: false, });
          // 編集モーダルクローズ
          this.setState({ isEditModalVisible: false, });
          // 選択行リセット
          this.setState({
            selectedBgColor: '',
            selectedIndex: -1,
          });
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

  // プレイデータに応じてリザルト値を変換する
  convertResultValue() {
    let result_value = '';
    if (this.state.play === "FT :1Shoot" || this.state.play === "FT :2Shoot" || this.state.play === "FT :3Shoot") {
      let shot_result = '', shot_result1 = '', shot_result2 = '', shot_result3 = '';
      if (this.state.play === "FT :1Shoot") {
        if (this.state.result_ft1 === 'Made') { shot_result1 = '〇';　}
        else if (this.state.result_ft1 === 'Miss') { shot_result1 = 'ー'; }
        else { shot_result1 = ''; }
        shot_result = shot_result1;
        result_value = this.state.home_visitor === 0 ? this.state.result : '';
      } else if (this.state.play === "FT :2Shoot") {
        if (this.state.result_ft1 === 'Made') { shot_result1 = '〇';　}
        else if (this.state.result_ft1 === 'Miss') { shot_result1 = 'ー'; }
        else { shot_result1 = ''; }
        if (this.state.result_ft2 === 'Made') { shot_result2 = '〇';　}
        else if (this.state.result_ft2 === 'Miss') { shot_result2 = 'ー'; }
        else { shot_result2 = ''; }
        shot_result = shot_result1 + ' ' + shot_result2;
      } else {
        if (this.state.result_ft1 === 'Made') { shot_result1 = '〇';　}
        else if (this.state.result_ft1 === 'Miss') { shot_result1 = 'ー'; }
        else { shot_result1 = ''; }
        if (this.state.result_ft2 === 'Made') { shot_result2 = '〇';　}
        else if (this.state.result_ft2 === 'Miss') { shot_result2 = 'ー'; }
        else { shot_result2 = ''; }
        if (this.state.result_ft3 === 'Made') { shot_result3 = '〇';　}
        else if (this.state.result_ft3 === 'Miss') { shot_result3 = 'ー'; }
        else { shot_result3 = ''; }
        shot_result = shot_result1 + ' ' + shot_result2 + ' ' + shot_result3;
      }
      result_value = shot_result;
    } else {
      result_value = this.state.result;
    }
    return result_value;
  }

  // リザルトドロップダウンのリスト値セット
  setResult(play_value) {
    let resultList = [];
    if ( play_value === "2P" || play_value === "3P") {
      this.setState({
        displayed_result: 'block',
        disabled_result: false ,
        dropdownBgColor_result: '#ffffff' ,

        displayed_ft: 'none',
        disabled_result_ft1: true ,
        dropdownBgColor_result_ft1: '#c0c0c0' ,
        disabled_result_ft2: true ,
        dropdownBgColor_result_ft2: '#c0c0c0' ,
        disabled_result_ft3: true ,
        dropdownBgColor_result_ft3: '#c0c0c0' ,

        result: Constants.RESULT_SHOT_LIST[0].label ,
        resultList: Constants.RESULT_SHOT_LIST ,
      });
    } else if (play_value === "Change") {
      this.setState({
        displayed_result: 'block',
        disabled_result: false ,
        dropdownBgColor_result: '#ffffff' ,

        displayed_ft: 'none',
        disabled_result_ft1: true ,
        dropdownBgColor_result_ft1: '#c0c0c0' ,
        disabled_result_ft2: true ,
        dropdownBgColor_result_ft2: '#c0c0c0' ,
        disabled_result_ft3: true ,
        dropdownBgColor_result_ft3: '#c0c0c0' ,

        result: Constants.RESULT_CHANGE_LIST[0].label ,
        resultList: Constants.RESULT_CHANGE_LIST ,
      });
    } else if (play_value === "TO") {
      this.setState({
        displayed_result: 'block',
        disabled_result: false ,
        dropdownBgColor_result: '#ffffff' ,

        displayed_ft: 'none',
        disabled_result_ft1: true ,
        dropdownBgColor_result_ft1: '#c0c0c0' ,
        disabled_result_ft2: true ,
        dropdownBgColor_result_ft2: '#c0c0c0' ,
        disabled_result_ft3: true ,
        dropdownBgColor_result_ft3: '#c0c0c0' ,

        result: Constants.RESULT_TO_LIST[0].label ,
        resultList: Constants.RESULT_TO_LIST ,
      });
    } else if (play_value === "Shot") {
      this.setState({
        displayed_result: 'block',
        disabled_result: false ,
        dropdownBgColor_result: '#ffffff' ,

        displayed_ft: 'none',
        disabled_result_ft1: true ,
        dropdownBgColor_result_ft1: '#c0c0c0' ,
        disabled_result_ft2: true ,
        dropdownBgColor_result_ft2: '#c0c0c0' ,
        disabled_result_ft3: true ,
        dropdownBgColor_result_ft3: '#c0c0c0' ,

        result: Constants.RESULT_DEF_FOUL_LIST[0].label ,
        resultList: Constants.RESULT_DEF_FOUL_LIST ,
      });
    } else if (play_value === "FT :1Shoot" || play_value === "FT :2Shoot" || play_value === "FT :3Shoot") {  
      this.setState({
        displayed_result: 'none',
        disabled_result: true ,
        dropdownBgColor_result: '#c0c0c0' ,
      });

      if(play_value === "FT :1Shoot") {
        this.setState({
          displayed_ft: 'block',
          disabled_result_ft1: false ,
          dropdownBgColor_result_ft1: '#ffffff' ,
          disabled_result_ft2: true ,
          dropdownBgColor_result_ft2: '#c0c0c0' ,
          disabled_result_ft3: true ,
          dropdownBgColor_result_ft3: '#c0c0c0' ,

          result_ft1: Constants.RESULT_FT_LIST[0].label,
          resultList_ft1: Constants.RESULT_FT_LIST,  
          result_ft2: '',
          resultList_ft2: [],
          result_ft3: '',
          resultList_ft3: [],
        });          
      } else if (play_value === "FT :2Shoot") {
        this.setState({
          displayed_ft: 'block',
          disabled_result_ft1: false ,
          dropdownBgColor_result_ft1: '#ffffff' ,
          disabled_result_ft2: false ,
          dropdownBgColor_result_ft2: '#ffffff' ,
          disabled_result_ft3: true ,
          dropdownBgColor_result_ft3: '#c0c0c0' ,

          result_ft1: Constants.RESULT_FT_LIST[0].label,
          resultList_ft1: Constants.RESULT_FT_LIST,
          result_ft2: Constants.RESULT_FT_LIST[0].label,
          resultList_ft2: Constants.RESULT_FT_LIST,
          result_ft3: '',
          resultList_ft3: [],
        });
      } else {
        this.setState({
          displayed_ft: 'block',
          disabled_result_ft1: false ,
          dropdownBgColor_result_ft1: '#ffffff' ,
          disabled_result_ft2: false ,
          dropdownBgColor_result_ft2: '#ffffff' ,
          disabled_result_ft3: false ,
          dropdownBgColor_result_ft3: '#ffffff' ,

          result_ft1: Constants.RESULT_FT_LIST[0].label,
          resultList_ft1: Constants.RESULT_FT_LIST,
          result_ft2: Constants.RESULT_FT_LIST[0].label,
          resultList_ft2: Constants.RESULT_FT_LIST,
          result_ft3: Constants.RESULT_FT_LIST[0].label,
          resultList_ft3: Constants.RESULT_FT_LIST ,  
        });
      }

    } else {
      this.setState({
        displayed_result: 'block',
        disabled_result: true ,
        dropdownBgColor_result: '#c0c0c0' ,

        displayed_ft: 'none',
        disabled_result_ft1: true ,
        dropdownBgColor_result_ft1: '#c0c0c0' ,
        disabled_result_ft2: true ,
        dropdownBgColor_result_ft2: '#c0c0c0' ,
        disabled_result_ft3: true ,
        dropdownBgColor_result_ft3: '#c0c0c0' ,

        result: '',
        resultList: [] ,
      });
    }
  };

  // 配列のソート処理
  sortedDatas(obj) {
    const sorted = obj.sort( (a, b) => {
      // Periodの昇順にソート
      const period_num_src = a[3].slice(-1);
      const period_num_dst = b[3].slice(-1);
      if(period_num_src > period_num_dst) return 1;
      if(period_num_src < period_num_dst) return -1;
      // Timeの降順にソート
      const time_src = a[4].slice(0,2) + a[4].slice(-2);
      const time_dst = b[4].slice(0,2) + b[4].slice(-2);
      if(time_src > time_dst) return -1;
      if(time_src < time_dst) return 1;
      return 0;
    })
    return sorted;
  }
  // 検索処理
  search(text, datas) {
    if (text) {
      const textData = text.toUpperCase();
      let newData = [];
      datas.forEach(function (items) {
        items.some(function (item) {
          const itemData = item ? String(item).toUpperCase() : ''.toUpperCase();
          // テキストの文字列が含まれるかどうか
          if (itemData.indexOf(textData) > -1) {
            newData.push(items)
            return true;
          }
        });
      });
      this.setState({resultPlaybyplayDatas: newData});
    } else {
      // Inserted text is blank
      this.setState({resultPlaybyplayDatas: datas});
    }
  };
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    const searchText = this.state;
  
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

            {/* ゲーム情報 */}
            <View style={[styles.row, PlayByPlayStyles.base, PlayByPlayStyles.info_area]}>
              <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_custom]}>Date : {this.state.date.label}</Text>
              <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_custom]}>Event : {this.state.event.label}</Text>
              <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_custom]}>Stage : {this.state.stage.label}</Text>
              <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_custom]}>Game : {this.state.game_card.label}</Text>
            </View>

            {/* スコアテーブル */}
            <View style={[styles.row, PlayByPlayStyles.base, PlayByPlayStyles.score_area]}>
              <View style={[styles.column, PlayByPlayStyles.score_area_inner]}>
                <View style={[{flex: 1}]}>
                  {/* テーブルヘッダー */}
                  <Table>
                    {
                      this.state.scoreTableHead.map((rowData, index) => (
                        <TableWrapper key={index} style={[styles.tableRow, PlayByPlayStyles.tableHead_custom]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                flex={this.state.flexScoreArr[cellIndex]}
                                style={[
                                  ( cellIndex === 3 || cellIndex === 4 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0.5}
                                ]}
                                key={cellIndex}
                                data={cellData}
                                textStyle={[styles.tableHeadText, PlayByPlayStyles.tableHeadText_custom]}
                              />
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>

                  {/* テーブルデータ */}
                  <Table>
                    {
                      this.state.scoreDatas.map((rowData, index) => (
                        <TableWrapper
                        key={index}
                        style={[
                          styles.tableRow,
                          PlayByPlayStyles.tableRow_custom,
                          index%2 && {backgroundColor: '#F7F6E7'}
                          ]}
                        >
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                flex={this.state.flexScoreArr[cellIndex]}
                                style={[
                                  ( cellIndex === 3 || cellIndex === 4 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0.5}
                                ]}
                                key={cellIndex}
                                data={cellData}
                                textStyle={[styles.tableText, PlayByPlayStyles.tableText_custom]}
                              />
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </View>
              </View>
            </View>

            {/* ボタンエリア */}
            <View style={[styles.row, PlayByPlayStyles.base, PlayByPlayStyles.button_area]}>
              <TouchableOpacity style={[styles.button_xsm, styles.formElement, {backgroundColor: this.state.period_all.color},]} onPress={() => this._onChangePeriod(this.state.period_all.label)}>
                <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>{this.state.period_all.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button_xsm, styles.formElement, {backgroundColor: this.state.period_q1.color},]} onPress={() => this._onChangePeriod(this.state.period_q1.label)}>
                <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>{this.state.period_q1.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button_xsm, styles.formElement, {backgroundColor: this.state.period_q2.color},]} onPress={() => this._onChangePeriod(this.state.period_q2.label)}>
                <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>{this.state.period_q2.label}</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={[styles.button_xsm, styles.formElement, {backgroundColor: this.state.period_q3.color},]} onPress={() => this._onChangePeriod(this.state.period_q3.label)}>
                <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>{this.state.period_q3.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button_xsm, styles.formElement, {backgroundColor: this.state.period_q4.color},]} onPress={() => this._onChangePeriod(this.state.period_q4.label)}>
                <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>{this.state.period_q4.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button_xsm, styles.formElement, {backgroundColor: this.state.period_ot.color},]} onPress={() => this._onChangePeriod(this.state.period_ot.label)}>
                <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>{this.state.period_ot.label}</Text>
              </TouchableOpacity>

              {/* 余白 */}
              <View paddingHorizontal={wp(2.2)} />

              <View>
                <View style={[styles.row, PlayByPlayStyles.other_button_area]}>
                  {/* データ更新ボタン */}
                  <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this.init()}>
                    <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>
                      <Icon style={[styles.icon_sync]} name='sync-alt'/>
                    </Text>
                  </TouchableOpacity>
                  {/* レコード編集ボタン */}
                  <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._toggleEditModal()}>
                    <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>
                    <Icon style={[styles.icon_sync]} name='edit'/>
                    </Text>
                  </TouchableOpacity>
                  {/* 選択画面へ遷移するボタン */}
                  <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._gameSelection()}>
                    <Text style={[styles.buttonText, PlayByPlayStyles.buttonText_custom]}>
                      <MCIcon style={[styles.icon_sync]} name='form-select'/>
                    </Text>
                  </TouchableOpacity>

                  {/* 検索ボックス */}
                  <SearchBar
                    // round
                    searchIcon={{ size: 20 }}
                    onChangeText={(text) => this._searchFilterFunction(text)}
                    onClear={(text) => this._searchFilterFunction('')}
                    placeholder={Messages.INFO.I005}
                    containerStyle={styles.searchBarContainerStyle}
                    inputContainerStyle={styles.searchBarInputContainerStyle}
                    inputStyle={styles.searchBarInputStyle}
                    leftIconContainerStyle={styles.searchBarLeftIconContainerStyle}
                    rightIconContainerStyle={styles.searchBarlRightIconContainerStyle}
                    value={searchText}
                  />
                </View>
              </View>
            </View>

            {/* Play By Play テーブル */}
            <View style={[styles.row, PlayByPlayStyles.base, PlayByPlayStyles.table_area]}>
              <View style={[styles.column, PlayByPlayStyles.table_area_inner,]}>
                <View style={[{flex: 1}]}>
                  {/* テーブルヘッダー */}
                  <Table>
                    {
                      this.state.tableHead.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          flexArr={this.state.flexArr}
                          style={[
                            styles.tableRow,
                            PlayByPlayStyles.tableHead_custom,
                            {backgroundColor: '#006a6c'},
                          ]}
                          textStyle={[styles.tableHeadText, PlayByPlayStyles.tableHeadText_custom]}
                        />
                      ))
                    }
                  </Table>

                  {/* テーブルデータ */}
                  <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                    <Table>
                      {
                        this.state.resultPlaybyplayDatas.map((rowData, index) => (
                          <Row
                            key={index}
                            data={rowData}
                            onPress={() => this._onSelectedRow(rowData, index)}
                            flexArr={this.state.flexArr}
                            style={[
                              styles.tableRow,
                              PlayByPlayStyles.tableRow_custom,
                              ( index%2 ) && {backgroundColor: '#F7F6E7'},
                              ( this.state.selectedIndex === index ) && {backgroundColor: this.state.selectedBgColor},
                            ]}
                            textStyle={[styles.tableText, PlayByPlayStyles.tableText_custom]}
                          />
                        ))
                      }
                    </Table>
                  </ScrollView>
                  {/* 画面下部0.5%はスクロール外領域とする */}
                  <Text style={{ height: this.state.height * 0.005,}}></Text>
                </View>
              </View>
            </View>
          </View>

          {/* 編集モーダルダイアログ */}
          <SafeAreaView>
            <Modal
            style={PlayByPlayStyles.edit_modal}
            isVisible={this.state.isEditModalVisible}
            swipeDirection={['up', 'down', 'left', 'right']}
            animationInTiming={1}
            animationOutTiming={1}
            onBackdropPress={this._toggleEditModal}
            >
              <View style={PlayByPlayStyles.edit_modal_inner}>

                {/* Period */}
                <View style={[styles.row,]}>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal]}>{this.state.label_period}</Text>
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown1"
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_period,]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_period, {height: hp(this.state.periodList.length * 4.5)}]}
                      defaultValue={this.state.period}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.periodList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ period: option.label })}
                    />
                  </View>
                  <View paddingHorizontal={wp(12)} />
                </View>

                {/* Date Time */}
                <View style={[styles.row,]}>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal]}>{this.state.label_gametime}</Text>
                  <View style={styles.cell}>
                    <ModalDropdown
                      ref="dropdown2"
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_datetime]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_datetime,]}
                      defaultValue={this.state.hour}
                      defaultTextStyle={PlayByPlayStyles.defaultTextStyle_custom}
                      options={this.state.hourList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ hour: option.label })}
                    />
                  </View>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal_term]}>：</Text>
                  <View style={styles.cell}>
                    <ModalDropdown
                      ref="dropdown3"
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_datetime]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_datetime,]}
                      defaultValue={this.state.minute}
                      defaultTextStyle={PlayByPlayStyles.defaultTextStyle_custom}
                      options={this.state.minuteList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ minute: option.label })}
                    />
                  </View>
                  <View paddingHorizontal={wp(6.7)} />
                </View>

                {/* Team */}
                <View style={[styles.row]}>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal]}>{this.state.label_team}</Text>
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown5"
                      disabled={this.state.disabled}
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_team, {backgroundColor: this.state.dropdownBgColor}]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_team, {height: hp(this.state.teamList.length * 4.5)}]}
                      defaultValue={this.state.team.label}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.teamList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this._onSelectTeam(option)}
                    />
                  </View>
                  <CheckBox onPress={() => this._onSelectCheckbox()}
                    center
                    title=''
                    checked={this.state.checked}
                  />

                </View>

                {/* Player */}
                <View style={[styles.row]}>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal]}>{this.state.label_player}</Text>
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown6"
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_event]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_event, {height: hp(this.state.playerList.length * 4.5)}]}
                      defaultValue={this.state.player.label}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.playerList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ player: option })}
                    />
                  </View>
                </View>

                {/* Play */}
                <View style={[styles.row]}>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal]}>{this.state.label_play}</Text>
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown7"
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_event]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_event, {height: hp(this.state.playList.length * 4.5)}]}
                      defaultValue={this.state.play}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.playList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this._onSelectPlay(option)}
                    />
                  </View>
                </View>

                {/* Result */}
                <View style={[styles.row]}>
                  <Text style={[styles.labelText_black, PlayByPlayStyles.labelText_modal]}>{this.state.label_result}</Text>
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown8"
                      disabled={this.state.disabled_result}
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_event, {backgroundColor: this.state.dropdownBgColor_result, display: this.state.displayed_result}]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_event, {height: hp(this.state.resultList.length * 4.5)}]}
                      defaultValue={this.state.result}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.resultList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ result: option.label })}
                    />
                  </View>

                  {/* Result フリースロー1 */}
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown9"
                      disabled={this.state.disabled_result_ft1}
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_ft, {backgroundColor: this.state.dropdownBgColor_result_ft1, display: this.state.displayed_ft}]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_ft, {height: hp(this.state.resultList_ft1.length * 4.5)}]}
                      defaultValue={this.state.result_ft1}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.resultList_ft1}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ result_ft1: option.label })}
                    />
                  </View>

                  {/* Result フリースロー2 */}
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown10"
                      disabled={this.state.disabled_result_ft2}
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_ft, {backgroundColor: this.state.dropdownBgColor_result_ft2, display: this.state.displayed_ft}]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_ft, {height: hp(this.state.resultList_ft2.length * 4.5)}]}
                      defaultValue={this.state.result_ft2}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.resultList_ft2}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ result_ft2: option.label })}
                    />
                  </View>

                  {/* Result フリースロー3 */}
                  <View style={[styles.cell]}>
                    <ModalDropdown
                      ref="dropdown11"
                      disabled={this.state.disabled_result_ft3}
                      style={[styles.dropdown, PlayByPlayStyles.dropdown_ft, {backgroundColor: this.state.dropdownBgColor_result_ft3, display: this.state.displayed_ft}]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, PlayByPlayStyles.dropdown_dropdown_ft, {height: hp(this.state.resultList_ft3.length * 4.5)}]}
                      defaultValue={this.state.result_ft3}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.resultList_ft3}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                      onSelect={(option, index) => this.setState({ result_ft3: option.label })}
                    />
                  </View>

                </View>

                <View paddingVertical={hp(2)} />

                {/* ボタン */}
                <View style={[styles.row]}>
                <TouchableOpacity
                  style={[styles.button_sm, styles.formElement]}
                  onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.ADD)}>
                    <Text style={[styles.buttonText]}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button_sm, styles.formElement]}
                    onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.UPDATE)}>
                    <Text style={[styles.buttonText]}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button_sm, styles.formElement, styles.buttonColor_red]}
                    onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.DELETE)}>
                    <Text style={[styles.buttonText]}>Delete</Text>
                  </TouchableOpacity>
                  <View paddingHorizontal={wp(5)} />
                  <TouchableOpacity
                    style={[styles.button_sm, styles.formElement, styles.buttonColor_silver]}
                      onPress={this._toggleEditModal}>
                    <Text style={[styles.buttonText_black]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
      </ImageBackground>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(PlayByPlay);