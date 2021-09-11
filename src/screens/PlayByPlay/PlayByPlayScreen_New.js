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
  Image,
  StyleSheet
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import Picker from 'react-native-picker-js';

import WheelPicker from 'react-native-picker';
// モーダルダイアログ
import Modal from "react-native-modal";
// import Picker from 'react-native-wheel-picker';
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
// Prop
import PropTypes from 'prop-types';
// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/CommonStyles';
import PlayByPlayStyles from './PlayByPlayStyles_New';
import BaseStyles from '../../common/BaseStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';
import ExcludeDuplicate from '../../util/ExcludeDuplicateArray';
import { justifyContent } from 'styled-system';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';

const win = Dimensions.get('window');

var PickerItem = Picker.Item;

const propTypes = {
  closePlayByPlayModal: PropTypes.func
};
const teams = [
  { label: '', value: '',key:'' },
  { label: '青山学院', value: 'tm_001',key:'tm_001' },
  { label: '早稲田', value: 'tm_002', key:'tm_002' }
];
const players = {
  'tm_001' : [
    {label:'#10 AAA',value:'pl_001',key:'pl_001'},
    {label:'#11 BBB',value:'pl_002',key:'pl_002'},
    {label:'#12 CCC',value:'pl_003',key:'pl_003'},
    {label:'#13 DDD',value:'pl_004',key:'pl_004'},
    {label:'#14 EEE',value:'pl_005',key:'pl_005'},
    {label:'#15 FFF',value:'pl_006',key:'pl_006'},
    {label:'#16 GGG',value:'pl_007',key:'pl_007'},
    {label:'#17 HHH',value:'pl_008',key:'pl_008'},
    {label:'#18 III',value:'pl_009',key:'pl_009'},
    {label:'#19 JJJ',value:'pl_010',key:'pl_010'},
  ],
  'tm_002': [
    {label:'#20 あああ',value:'pl_011',key:'pl_011'},
    {label:'#21 いいい',value:'pl_012',key:'pl_012'},
    {label:'#22 ううう',value:'pl_013',key:'pl_013'},
    {label:'#23 えええ',value:'pl_014',key:'pl_014'},
    {label:'#24 おおお',value:'pl_015',key:'pl_015'},
    {label:'#25 かかか',value:'pl_016',key:'pl_016'},
    {label:'#26 ききき',value:'pl_017',key:'pl_017'},
    {label:'#27 くくく',value:'pl_018',key:'pl_018'},
    {label:'#28 けけけ',value:'pl_019',key:'pl_019'},
    {label:'#29 こここ',value:'pl_020',key:'pl_020'},
  ]
};

const results = {
  '2P': Constants.RESULT_SHOT_LIST,
  '3P': Constants.RESULT_SHOT_LIST,
  'TO': Constants.RESULT_TO_LIST,
  'Change': Constants.RESULT_CHANGE_LIST,
  'FT :1Shot': Constants.RESULT_FT_LIST,
  'FT :2Shot': Constants.RESULT_FT_LIST,
  'FT :3Shot': Constants.RESULT_FT_LIST,
  'Assist':'',
  'DEF_REB':'',
  'OFFF_REB':'',
  'BLOCK':'',
  'DEF_REB':'',
  'OFF_FOUL':'',
  'DEF_FOUL':'',
  'Steal':'',
  'TimeOut':'',
  '':'',
}

const hours = Constants.TIMES;

const minutes = Constants.TIMES;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: wp(25),
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 7,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icons
  },
  iconContainer: {
    top: 17,
    right: 20,
  },
});

const styleTemp = StyleSheet.create({
  labelText_custom: {
    fontSize: RFPercentage(1.5),
    width: wp(16),
    height: hp(4.5),
    justifyContent:'center'
  },
  button: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    // fontSize: RFPercentage(2),
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: wp(25),
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 7,
    backgroundColor: '#75787b',
    color: '#ffffff',

  }
})
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
      // ダイアログ表示フラグ
      isDialogVisible : true,
      // 編集モーダル表示フラグ
      isEditModalVisible: false,
      // タイムピッカー表示フラグ
      isTimePickerVisible: false,
      // 検索モーダル表示フラグ
      isFilterModalVisible: false,

      // プレイバイプレイテーブルヘッダー
      tableHead: [
        [
          'Player',
          'Play',
          'Result',
          '',
          'P',
          'Time',
          'Score',
          '',
          'Player',
          'Play',
          'Result',
          'team_id',
          'player_id',
          'timestamp',
          'play',
          'result',
          'connection_id',
          'home_visitor',
          'conv_coordinate',
          'shot_area',
          'point',
        ]
      ],
      // プレイバイプレイテーブルデータ（モック用）
      playbyplayDatas: [
        ['#10 AAA', 'Change', 'In', '', 'Q1', '10:00', '21-21','', '', '', '','tm_001','pl_001','Change','In'],
        ['#11 BBB', 'DEF_REB', '', '','Q1', '10:00', '0-0','', '', '', '','tm_001','pl_002','DEF_REB',''],
        ['#12 CCC', 'Change', 'In', '','Q1', '10:00', '0-0','', '', '', '','tm_001','pl_003','Change',''],
        ['#13 DDD', 'Change', 'In', '','Q1', '10:00', '0-0', '','', '', '','tm_001','pl_004','Change','In'],
        ['#14 EEE', 'Change', 'In', '','Q1', '10:00', '0-0','', '', '', '','tm_001','pl_005','Change','In'],
        ['#15 FFF', 'Change', 'In', '', 'Q1', '10:00', '0-0','', '', '', '','tm_001','pl_006','Change','In'],
        ['#16 GGG', 'Change', 'In', '', 'Q1', '10:00', '0-0', '','', '', '','tm_001','pl_007','Change','In'],
        ['#17 HHH', 'Change', 'In', '', 'Q1', '10:00', '0-0','', '', '', '','tm_001','pl_008','Change','In'],
        ['#18 III', 'Change', 'In', '', 'Q1', '10:00', '0-0','', '', '', '','tm_001','pl_009','Change','In'],
        ['#19 JJJ', 'Change', 'In', '', 'Q1', '10:00', '0-0','', '', '', '','tm_001','pl_010','Change','In'],
        ['', '', '', '', 'Q1', '10:00', '0-0','', '#20 あああ', 'Change', 'In','tm_002','pl_001','Change','In'],
        ['', '', '', '', 'Q1', '10:00', '0-0','', '#21 いいい', 'Change', 'In','tm_002','pl_002','Change','In'],
        ['', '', '', '', 'Q1', '10:00', '0-0','', '#22 ううう', 'Change', 'In','tm_002','pl_003','Change','In'],
        ['', '', '', '', 'Q1', '10:00', '0-0','', '#23 えええ', 'Change', 'In','tm_002','pl_004','Change','In'],
        ['', '', '', '', 'Q1', '10:00', '0-0','', '#24 おおお', 'Change', 'In','tm_002','pl_005','Change','In'],
        ['', '', '', '', 'Q2', '10:00', '0-0','', '#25 かかか', 'Change', 'Out','tm_002','pl_006','Change','In'],
        ['', '', '', '', 'Q2', '10:00', '0-0','', '#26 ききき', 'DEF_REB', '','tm_002','pl_007','DEF_REB',''],
        ['', '', '', '', 'Q2', '10:00', '0-0','', '#27 くくく', 'Change', 'Out','tm_002','pl_008','Change','In'],
        ['', '', '', '', 'Q2', '10:00', '0-0','', '#28 けけけ', 'Change', 'Out','tm_002','pl_009','Change','In'],
        ['', '', '', '', 'Q2', '10:00', '0-0','', '#29 こここ', 'Change', 'Out','tm_002','pl_010','Change','In'],
        ['#10 AAA', 'Change', 'In', '','Q3', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 BBB', 'Change', 'In', '','Q3', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 CCC', 'Change', 'In', '','Q3', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 DDD', 'Change', 'In', '','Q3', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 EEE', 'Change', 'In', '','Q3', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 FFF', 'Change', 'In', '','Q4', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 GGG', 'Change', 'In', '','Q4', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 HHH', 'Change', 'In', '','Q4', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 III', 'Change', 'In', '','Q4', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
        ['#10 JJJ', 'Change', 'In', '','Q4', '10:00', '0-0','', '', '', '','tm_001','pl_001','Change','In'],
      ],
      // playbyplayDatas: [],

      // プレイバイプレイテーブルの幅
      // flexArr: [120, 100, 100, 20, 60, 60, 60, 20, 120, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      flexArr: [wp(14), wp(11), wp(10), wp(2.5), wp(5), wp(7), wp(7), wp(2.5), wp(14), wp(11), wp(10), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


      // 抽出結果格納用
      filteredPlaybyplayDatas: [],
      resultPlaybyplayDatas: [],

      // 検索テキスト値
      searchText: '',
      // 選択行の色
      selectedBgColor: '#75787b',
      // 選択行のインデックス番号
      selectedIndex: -1,

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

      // 編集項目
      edit_period: '',
      edit_time: '',
      edit_team: '',
      edit_player: '',
      edit_play: '',
      edit_result: '',


      // ドロップダウンの表示・非表示状態制御
      displayed_result: 'block',
      displayed_ft: 'none',

      // ホーム・ビジターを識別するフラグ
      home_visitor: 0, // 0:Home, 1:Visitor
      // 試合情報格納
      game_id: '',
      time: new Date().getTime,

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
    // imgPath = require(img);

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
    if (this.state.selectedIndex === index) {
      this.setState({
        isEditModalVisible: true,
        rowData: rowData,
        edit_period: rowData[4],
        edit_time: rowData[5],
        edit_team: rowData[11],
        edit_player: rowData[12],
        edit_play: rowData[13],
        edit_result: rowData[14]
      })
    } else {
      this.setState({
        selectedBgColor: '#75787b', // 選択行をグレーに変更
        selectedIndex: index,
        rowData: rowData,
      });

    }
  };
  _onPressHandle(){
		this.picker.toggle();
	};
  // 行選択時のイベント
  // _onLongPressRow(rowData, index) {
  //   // if (this.state.selectedIndex === index) {
  //     this.setState({
  //       isFilterModalVisible: true,
  //       rowData: rowData,
  //     })
    // } else {
    //   this.setState({
    //     selectedBgColor: '#75787b', // 選択行をグレーに変更
    //     selectedIndex: index,
    //     rowData: rowData,
    //   });

    // }
  // };

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

  // ホームアイコン押下時
  goHome = () => {
    this.props.closePlayByPlayModal();
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    const searchText = this.state;

    return (
          <SafeAreaView style={{flex:1}}>
            {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
            <Spinner
              visible={this.state.isLoadingVisible}
              textContent={Messages.INFO.I003}
              textStyle={styles.labelText}
              overlayColor={'#rgba(0, 0, 0, 0.3)'}
            />
            {/* ヘッダー */}
            <View style={{flex:2, justifyContent: 'center'}}>
              {/* ゲーム情報 */}
              <View style={[BaseStyles.row, PlayByPlayStyles.gameinfo]}>
                {/* <Text style={[styles.labelText, PlayByPlayStyles.labelText_custo]}> {this.state.date.label} {this.state.event.label} {this.state.stage.label} {this.state.game_card.label}</Text> */}
                <Text style={[styles.labelText, PlayByPlayStyles.labelText]}> 2021/6/15 インターカレッジ 1回戦</Text>
              </View>
            </View>
            {/* コンテンツ */}
            <View style={{flex:9}}>
              {/* 対戦情報*/}
              <View style={{flex:1}}>
                <View style={[BaseStyles.row,{justifyContent:'space-between'}]}>
                  <View style={[PlayByPlayStyles.row_card]}>
                    <Image style={PlayByPlayStyles.image} resizeMode='contain' source={require('../../../assets/resources/aogaku_logo.png')}/>
                    <Text　style={[styles.labelText, PlayByPlayStyles.labelText]}>青山学院</Text>
                  </View>
                  <View  style={[PlayByPlayStyles.row_card]}>
                    <Image  style={PlayByPlayStyles.image} resizeMode='contain' source={require('../../../assets/resources/waseda_logo.png')}/>
                    <Text　style={[styles.labelText, PlayByPlayStyles.labelText]}>早稲田</Text>
                  </View>
                </View>
              </View>
              {/* Play By Play テーブル */}
              <View style={{flex:6}}>
                <View style={[BaseStyles.row, PlayByPlayStyles.base, PlayByPlayStyles.table_area]}>
                  <View style={[styles.column, PlayByPlayStyles.table_area_inner,]}>
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
                            ]}
                            textStyle={[styles.tableHeadText, PlayByPlayStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </Table>

                    {/* テーブルデータ */}
                    <ScrollView showsVerticalScrollIndicator={true} ColorSchemeName={'dark'}>
                      <Table>
                        {
                          this.state.playbyplayDatas.map((rowData, index) => (
                            <Row
                              key={index}
                              data={rowData}
                              onPress={() => this._onSelectedRow(rowData, index)}
                              onLongPress={() => this._onLongPressRow(rowData, index)}
                              flexArr={this.state.flexArr}
                              style={[
                                styles.tableRow,
                                PlayByPlayStyles.tableRow_custom,
                                {backgroundColor: 'rgba(0,0,0,0)'},
                                // ( index%2 ) && {backgroundColor: 'rgba(0,0,0,0)'},
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
            {/* フッター */}
            <View style={{flex:1, flexDirection:'row',justifyContent: 'center', alignItems:'center'}}>
              {/* 登録*/}
              <View>
                <TouchableOpacity style={[BaseStyles.formElement,BaseStyles.button_lg_sk]} onPress={() => this.goHome()}>
                  <Text style={[styles.buttonText]}>終了</Text>
                </TouchableOpacity>
              </View>
            </View>
          {/* 編集モーダルダイアログ */}
            <Modal
              style={PlayByPlayStyles.edit_modal}
              isVisible={this.state.isEditModalVisible}
              animationIn={'fadeIn'}
              animationOut={'fadeOut'}
              animationInTiming={1500}
              animationOutTiming={1000}
            >
              <View style={{flex:1}}/>
              <View style={{flex:18}}>
                {/* ヘッダー */}
                <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Text style={[BaseStyles.headerText]}>タグ情報の修正を行ってください</Text>
                </View>
                {/* コンテンツ */}
                <View style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                  {/* 1段目 */}
                  <View style={[BaseStyles.row,{flex:1}]} justifyContent='space-between' alignItems='center'>
                    {/* ピリオド */}
                    <View style={{flex:1, flexDirection:'column'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>ピリオド</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <RNPickerSelect
                        onValueChange={(value) => this.setState({edit_period:value})}
                        style={pickerSelectStyles}
                        placeholder={{}}
                        itemKey={this.state.rowData[4]}
                        placeholderTextColor={'#ffffff'}
                        Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
                        items={Constants.PERIODS}
                        />
                      </View>
                    </View>
                    {/* 時間 */}
                    <View style={{flex:1, flexDirection:'column'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>時間</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <TouchableOpacity style={[styleTemp.button]} onPress={this._onPressHandle.bind(this)}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[styles.buttonText,styleTemp.labelText_custom,{alignSelf:'left',width:wp(21)}]}> {this.state.edit_time} </Text>
                            <Icon name="chevron-down" size={20} color="#ffffff"/>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* チーム */}
                    <View style={{flex:1, flexDirection:'column'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>チーム</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <RNPickerSelect
                          onValueChange={(value) => this.setState({edit_team:value,edit_player:''})}
                          disabled={false}
                          style={pickerSelectStyles}
                          placeholder={{}}
                          itemKey={this.state.rowData[11]}
                          placeholderTextColor={'#ffffff'}
                          Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
                          items={teams}
                        />
                      </View>
                    </View>
                  </View>
                  {/* 2段目 */}
                  <View style={[BaseStyles.row,{flex:1}]} justifyContent='space-between'  alignItems='center'>
                    {/* 選手 */}
                    <View style={{flex:1, flexDirection:'column'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>選手</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <RNPickerSelect
                        onValueChange={(value) => this.setState({edit_player:value})}
                        disabled={false}
                        style={pickerSelectStyles}
                        placeholder={{}}
                        value={this.state.edit_player}
                        itemKey={this.state.rowData[12]}
                        placeholderTextColor={'#ffffff'}
                        Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
                        items={players[this.state.edit_team]}
                        />
                      </View>
                    </View>
                    {/* プレー */}
                    <View style={{flex:1, flexDirection:'column'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>プレー</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <RNPickerSelect
                          onValueChange={(value) => this.setState({edit_play:value,edit_result:''})}
                          disabled={false}
                          style={pickerSelectStyles}
                          placeholder={{}}
                          value={this.state.edit_play}
                          itemKey={this.state.edit_play}
                          placeholderTextColor={'#ffffff'}
                          Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
                          items={Constants.PLAY_LIST}
                        />
                      </View>
                    </View>
                    {/* リザルト */}
                    <View style={{flex:1, flexDirection:'column'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>リザルト</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <RNPickerSelect
                          onValueChange={(value) => this.setState({edit_result:value})}
                          disabled={false}
                          style={pickerSelectStyles}
                          placeholder={{}}
                          value={this.state.edit_result}
                          itemKey={this.state.edit_result}
                          placeholderTextColor={'#ffffff'}
                          Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
                          items={results[this.state.edit_play]}
                        />
                      </View>
                    </View>
                  </View>
                  {/* 3段目 */}
                  <View visible={true} style={[BaseStyles.row,{flex:1}]} justifyContent='space-between'  alignItems='center'>
                  </View>
                </View>
                {/* ボタン */}
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <View style={[styles.row, {justifyContent:'center'}]}>
                    <TouchableOpacity
                      style={[styles.button_sm, styles.formElement, PlayByPlayStyles.button_edit]}
                      // onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.ADD)}>
                      onPress={() => this.setState({isEditModalVisible:false})}>
                        <Text style={[styles.buttonText]}>削除</Text>
                    </TouchableOpacity>
                    <View paddingHorizontal={wp(5)} />
                    <TouchableOpacity
                      style={[styles.button_sm, styles.formElement, PlayByPlayStyles.button_edit]}
                      // onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.UPDATE)}>
                      onPress={() => this.setState({isEditModalVisible:false})}>
                      <Text style={[styles.buttonText]}>修正</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={[styles.button_sm, styles.formElement, PlayByPlayStyles.button_edit]}
                      // onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.DELETE)}>
                      onPress={() => this.setState({isEditModalVisible:false})}>
                      <Text style={[styles.buttonText]}>追加</Text>
                    </TouchableOpacity> */}
                    {/* <View paddingHorizontal={wp(5)} /> */}
                    {/* <TouchableOpacity
                      style={[styles.button_sm, styles.formElement, styles.buttonColor_silver]}
                        onPress={this._toggleEditModal}>
                      <Text style={[styles.buttonText_black]}>Cancel</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
                <Modal
                  style={styleTemp.modal_date}
                  isVisible={this.state.isTimePickerVisible}
                  >
                    <DateTimePicker
                      // style={{fontSize:RFPercentage(5.0)}}
                      testID="dateTimePicker"
                      value={this.state.date}
                      mode={'time'}
                      display="default"
                      textColor='#ffffff'
                      locale='ja'
                      themeVariant='white'
                      onChange={this._onChange}
                    />
                </Modal>
              </View>
            <View style={{flex:1}}/>

          </Modal>
          {/* フィルターモーダルダイアログ */}
          <Modal
              style={PlayByPlayStyles.edit_modal}
              isVisible={this.state.isFilterModalVisible}
              animationIn={'fadeIn'}
              animationOut={'fadeOut'}
              animationInTiming={1500}
              animationOutTiming={1000}
            >
              <View style={{flex:1}}/>
              <View style={{flex:18}}>
                {/* ヘッダー */}
                <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Text style={[BaseStyles.headerText]}>検索条件を選択して下さい</Text>
                </View>
                {/* コンテンツ */}
                <View style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                  {/* 1段目 */}
                  <View style={[BaseStyles.row,{flex:1}]} justifyContent='space-between' alignItems='center'>
                    {/* ピリオド */}
                    <View style={{flex:2, flexDirection:'column', alignItems:'center'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>P</Text>
                      </View>
                      <View style={PlayByPlayStyles.row_edit}>
                        <WheelPicker
                          style={{width: 150, height: 100}}
                          itemStyle={{color:"#ffffff", fontSize:30}}
                          // onValueChange={(value) => this.setState({team_name:value})}
                          // style={pickerSelectStyles}
                          // placeholder={{label:null ,value:null}}
                          // itemKey={this.state.rowData[4]}
                          // placeholderTextColor={'#ffffff'}
                          Icon={() => <Icon name="chevron-down" size={40} color="#ffffff"/>}
                          // items={Constants.PERIODS}
                        >
                          {Constants.PERIODS.map((item,i) => (
                            <PickerItem label={item.label} value={item.value} key={item.key}/>
                          ))}
                        </WheelPicker>
                      </View>
                    </View>
                    {/* チーム */}
                    <View style={{flex:3, flexDirection:'column', alignItems:'center'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>チーム</Text>
                      </View>
                      <WheelPicker
                          style={{width: 150, height: 100}}
                          itemStyle={{color:"#ffffff", fontSize:30}}
                          onValueChange={(value) => this.setState({team_name:value})}
                          // style={pickerSelectStyles}
                          // placeholder={{label:null ,value:null}}
                          // itemKey={''}
                          // placeholderTextColor={'#ffffff'}
                          // Icon={() => <Icon name="caret-down" size={40} color="#ffffff"/>}
                          // items={Constants.PERIODS}
                        >
                          {["ALL","青山学院","早稲田","筑波","白鴎","明治"].map((value,i) => (
                            <PickerItem label={value}/>
                          ))}
                      </WheelPicker>
                    </View>
                    {/* プレイヤー */}
                    <View style={{flex:3, flexDirection:'column', alignItems:'center'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>選手</Text>
                      </View>
                      <WheelPicker
                          style={{width: 150, height: 100}}
                          itemStyle={{color:"#ffffff", fontSize:30}}
                          onValueChange={(value) => this.setState({team_name:value})}
                          // style={pickerSelectStyles}
                          // placeholder={{label:null ,value:null}}
                          // itemKey={''}
                          // placeholderTextColor={'#ffffff'}
                          // Icon={() => <Icon name="caret-down" size={40} color="#ffffff"/>}
                          // items={Constants.PERIODS}
                        >
                          {["ALL","Player1","Player2","Player3","Player4","Player5"].map((value,i) => (
                            <PickerItem label={value}/>
                          ))}
                      </WheelPicker>
                    </View>
                    {/* プレイ */}
                    <View style={{flex:3, flexDirection:'column', alignItems:'center'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>プレイ</Text>
                      </View>
                      <WheelPicker
                          style={{width: 150, height: 100}}
                          itemStyle={{color:"#ffffff", fontSize:30}}
                          // onValueChange={(value) => this.setState({team_name:value})}
                          // style={pickerSelectStyles}
                          // placeholder={{label:null ,value:null}}
                          // itemKey={''}
                          // placeholderTextColor={'#ffffff'}
                          // Icon={() => <Icon name="caret-down" size={40} color="#ffffff"/>}
                          // items={Constants.PERIODS}
                        >
                          {["ALL","Change","2P","3P","FT","OFF_REB","DEF_REB"].map((value,i) => (
                            <PickerItem label={value}/>
                          ))}
                      </WheelPicker>
                    </View>
                    {/* リザルト */}
                    <View style={{flex:3, flexDirection:'column', alignItems:'center'}}>
                      <View style={PlayByPlayStyles.row_edit}>
                        <Text style={[BaseStyles.headerText]}>リザルト</Text>
                      </View>
                      <WheelPicker
                          style={{width: 150, height: 100}}
                          itemStyle={{color:"#ffffff", fontSize:30}}
                          onValueChange={(value) => this.setState({team_name:value})}
                          // style={pickerSelectStyles}
                          // placeholder={{label:null ,value:null}}
                          // itemKey={''}
                          // placeholderTextColor={'#ffffff'}
                          // Icon={() => <Icon name="caret-down" size={40} color="#ffffff"/>}
                          // items={Constants.PERIODS}
                        >
                          {["ALL","In","Out","Made","Miss"].map((value,i) => (
                            <PickerItem label={value}/>
                          ))}
                      </WheelPicker>
                    </View>
                  </View>
                </View>
                {/* ボタン */}
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <View style={[styles.row, {justifyContent:'center'}]}>
                    <TouchableOpacity
                      style={[styles.button_sm, styles.formElement, PlayByPlayStyles.button_edit]}
                      // onPress={() => this._updatePlayByPlay(Constants.DB_CATEGORY.ADD)}>
                      onPress={() => this.setState({isFilterModalVisible:false})}>
                        <Text style={[styles.buttonText]}>決定</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            <View style={{flex:1}}/>
            <View style={{bottom:-(win.height*0.05),left:-(win.width*0.1), position:'absolute'}}>
              <Picker
                ref={picker => this.picker = picker}
                style={{height: 200,position:'absolute',alignItems:'center'}}
                showDuration={300}
                pickerData={[0,1]}
                pickerCancelBtnText=''
                onValueChange={(value) => this.setState({edit_time:value})}
                selectedValue={this.state.edit_time}
              />
            </View>

          </Modal>
        </SafeAreaView>
    );
  }
}
PlayByPlay.propTypes = propTypes;
// 画面遷移時の再レンダリング対応
export default withNavigation(PlayByPlay);