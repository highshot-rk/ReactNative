/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

import {
  DragContainer,
  Draggable,
  DropZone
} from "react-native-drag-drop-and-swap";

import { DraxProvider, DraxView } from 'react-native-drax';

//import DragDropButton from './DragDropButton';
import DraxButton from './DraxButton';

import Modal from "react-native-modal";
import {CheckBox, Badge} from 'react-native-elements';
// 画面遷移時の再レンダリング対応
import {withNavigation} from "react-navigation";
//テーブル表示
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
// グリッド表示
import {FlatGrid} from 'react-native-super-grid';
// 確認ダイアログ
import {ConfirmDialog} from 'react-native-simple-dialogs';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// レスポンシブデザイン対応
import {wp,hp} from './SubScreen';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
import Canvas from 'react-native-canvas';

// ローカルインポート
import styles from '../../common/CommonStyles';
import GameInfoStyles from './GameInfoStyles';
import LiveTaggingStyles from './LiveTaggingStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import ExcludeDuplicate from '../../util/ExcludeDuplicateArray';
import LiveTaggingButton from "./LiveTaggingButton";
import {LinearGradient} from "expo-linear-gradient";


//バスケットボールコート サイズ 28m x 15m
//461 x 280
const yardHeight = hp(46);
const meterSize = yardHeight/280;
const yardWidth = 460*meterSize;

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const shot_img = '../../../assets/resources/shot_area.png';
const arrow_right = '../../../assets/resources/arrow_right.png';
const arrow_left = '../../../assets/resources/arrow_left.png';
const figures_0 = '../../../assets/resources/figure-0.png';
const figures_1 = '../../../assets/resources/figure-1.png';
const figures_2 = '../../../assets/resources/figure-2.png';
const figures_3 = '../../../assets/resources/figure-3.png';
const figures_4 = '../../../assets/resources/figure-4.png';
const figures_5 = '../../../assets/resources/figure-5.png';
const figures_6 = '../../../assets/resources/figure-6.png';
const figures_7 = '../../../assets/resources/figure-7.png';
const figures_8 = '../../../assets/resources/figure-8.png';
const figures_9 = '../../../assets/resources/figure-9.png';
const figures_coron = '../../../assets/resources/figure-colon.png';
let shotImgPath;
let arrowRightPath;
let arrowLeftPath;
let figures0Path;
let figures1Path;
let figures2Path;
let figures3Path;
let figures4Path;
let figures5Path;
let figures6Path;
let figures7Path;
let figures8Path;
let figures9Path;
let figuresCoronPath;

// ピリオド開始フラグ
var is_period_start = false;
var timestamp = "";
let latest_team;
// ホームチームメンバー一覧
var members_h = {};
// ビジターチームメンバー一覧
var members_v = {};
var game_time = "";
// リクエストパラメーターのリスト
var tag_datas = [];
var player_num = "";
// 座標
var x_coordinate = 0;
var y_coordinate = 0;
var x_coordinate_made = 0; // Made時のX座標
var y_coordinate_made = 0; // Made時のY座標
var x_coordinate_miss = 0; // Miss時のX座標
var y_coordinate_miss = 0; // Miss時のY座標
var arrTimerCnt = new Array();
var timer;
// タイマーの初期値
var minute = 10;
var second = 0;
var result_type_1 = "";
var result_type_2 = "";
var result_type_3 = "";
var running_shot = " ";
var pre_team_name = "";
// TimeOutカウントの初期値
var to_count_v = 2;         // ホーム
var to_count_h = 2;         // ビジター
// TimeOutのフラグ
var is_TOmax = false;
var target_player = "";
var play_type = "";
var player_name = "";

var is_assist = false;
var is_rebound = false;
var is_block = false;
var is_foul = false;
var is_steal = false;
var datas = [];

var is_swipe = false;
var swipe_direction = "";

var input_pos = [];
var foul_count_v = 0;
var foul_count_h = 0;
var foul_count_psnl = 0;
var is_left = false;
var attack_direction = 'Right';
var shots_num = 2;
var btn_ft_num_1 = 1;
var btn_ft_num_2 = 1;
var btn_ft_num_3 = 1;
var memberslist_v = [];
var memberslist_h = [];
var category_type = '';
var sub_category_type = '';
var period = '';
var score_home = 0;
var score_visitor = 0;
var lineup_home = [];
var lineup_visitor = [];
var substitues_home = [];
var substitues_visitor = [];
const TO_2ND_HALF = 3;
const TO_EXTRA    = 1;

class LiveTagging extends Component {
  /*--------------------------------------------------------------------------
   * コンストラクタ
   *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);

    //ドラックアンドドロップ >>>
    this.onHover = this.onHover.bind(this);
    this.onHDrop = this.onHDrop.bind(this);
    this.onVDrop = this.onVDrop.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onReceiveDragDrop = this.onReceiveDragDrop.bind(this);
    //<<<

    this.shots_number_element = (index, shots_num) => (
      <LiveTaggingButton onPress={() => this.ft_btn(index)} text={index} type={index % 2 == 0 ? 3 : 0} width={8}></LiveTaggingButton>

      // <TouchableOpacity style={styles.button_md, styles.formElement, (shots_num === index) ? LiveTaggingStyles.ft_table_btn : LiveTaggingStyles.ft_table_btn_disable} onPress={() => this.ft_btn(index)}>
      //   <Text style={LiveTaggingStyles.btn_text}>{index}</Text>
      // </TouchableOpacity>
    );
    this.ft_col_element = (index, target, num) => (
      <LiveTaggingButton onPress={() => this.btn_ft_col(index, num)} text={index == 1 ? 'Made' : 'Miss'} type={index == 1 ? 3 : 0} width={8}></LiveTaggingButton>
      // <TouchableOpacity style={styles.button_md, styles.formElement, (target === index) ? LiveTaggingStyles.ft_table_btn : LiveTaggingStyles.ft_table_btn_disable} onPress={() => this.btn_ft_col(index, num)}>
      //   <Text style={LiveTaggingStyles.btn_text}>{index == 1 ? 'Made' : 'Miss'}</Text>
      // </TouchableOpacity>
    );

    this.ft_col_text = (index) => (
      <Text style={[LiveTaggingStyles.ft_table_text_right, {marginRight: 20}]}>Shots {index}</Text>
    );

    this.state = {

      //ドラックアンドドロップ >>>
      hoverData: {},
      dropData: {},
      hoverDataIndex: null,

      width: 0,
      height: 0,

      // ローディングスピナー表示フラグ
      isLoadingVisible: false,

      // ユーザー名
      username: '',
      game_id: '',

      // ゲーム情報
      gameList: [],
      // プルダウン項目
      dateList: [],
      eventList: [],
      stageList: [],
      teamList: [],
      // 検索結果
      resultList: [],
      // プルダウン初期値
      date: [],
      event: [],
      event_name: [],
      stage_name: [],
      team_name: [],
      // 絞り込み結果
      filtered_event: [],
      filtered_stage: [],
      filtered_team: [],
      tableHead: ['Time', 'Player', 'Play', 'Result', 'Check', 'Delete'],
      tableDataH: [],//[['06:45','6','Assist','OK',false,'']],
      tableDataV: [],//[['06:45','6','Assist','OK',false,'']],
      figure0: null,
      figure1: null,
      figure2: null,
      figure3: null,
      timeout_figure_h: null,
      timeout_figure_v: null,
      score_figure_h0: null,
      score_figure_v0: null,
      score_figure_h1: null,
      score_figure_v1: null,
      score_figure_h2: null,
      score_figure_v2: null,
      score_figure_h0_visible: false,
      score_figure_v0_visible: false,
      score_figure_h1_visible: true,
      score_figure_v1_visible: true,
      score_figure_h2_visible: false,
      score_figure_v2_visible: false,
      foul_figure_h: null,
      foul_figure_v: null,
      quoter_inner: 'Q1',
      timer_restart: true,
      timer_pause: true,
      timer_clear: true,
      timer_start: false,
      starters_h: [],
      subs_h: [],
      starters_v: [],
      subs_v: [],
      team_home: [],
      team_visitor: [],
      team_id_visitor: '',
      team_id_home: '',
      team_name_visitor: '',
      team_name_home: '',
      touch_key_v: null,
      touch_key_h: null,
      touch_teamkey_v: false,
      touch_teamkey_h: false,
      foul_team_count_h: 0,
      foul_team_count_v: 0,
      btn_cnt_up_m: false,
      btn_cnt_dwn_m: false,
      btn_cnt_up_s: false,
      btn_cnt_dwn_s: false,
      arrow_img: null,
      is_shot2pmodal_visible: false,
      is_shot3pmodal_visible: false,
      is_shot2p3pmodal_visible: false,
      is_tomodal_visible: false,
      is_ftmodal_visible: false,
      is_end_visible: false,
      is_thanks_visible: false,
      is_period_end_visible: false,
      is_game_end_visible: false,
      shots_num: 2,
      btn_ft_num_1: 1,
      btn_ft_num_2: 1,
      btn_ft_num_3: 1,
      score_v: 0,
      score_h: 0,
      quoter_count: 0,
      dialogVisible: false,
      periodDialogVisible: false,
      isOK: false,
      is_edit: false,
      edit_index_h: -1,
      edit_index_v: -1,
      defaultValue: '',
      defaultResultValue: '',
      defaultPlayValue: '',
      selectlist: [],
      playList: [],
      is_play_disable: false,
      is_result_disable: false,
      lbl_msg: '',
      minute: '',
      second: '',
      teamcolor_home: null,
      teamcolor_visitor: null,
      coordinate: {x: -160, y: 106},
      edit_disable: true,
      cancel_disable: true,
      minuteList: [
        {label: '00', value: '00'},
        {label: '01', value: '01'},
        {label: '02', value: '02'},
        {label: '03', value: '03'},
        {label: '04', value: '04'},
        {label: '05', value: '05'},
        {label: '06', value: '06'},
        {label: '07', value: '07'},
        {label: '08', value: '08'},
        {label: '09', value: '09'},
        {label: '10', value: '10'},
      ],
      secondList: [
        {label: '00', value: '00'},
        {label: '01', value: '01'},
        {label: '02', value: '02'},
        {label: '03', value: '03'},
        {label: '04', value: '04'},
        {label: '05', value: '05'},
        {label: '06', value: '06'},
        {label: '07', value: '07'},
        {label: '08', value: '08'},
        {label: '09', value: '09'},
        {label: '10', value: '10'},
        {label: '11', value: '11'},
        {label: '12', value: '12'},
        {label: '13', value: '13'},
        {label: '14', value: '14'},
        {label: '15', value: '15'},
        {label: '16', value: '16'},
        {label: '17', value: '17'},
        {label: '18', value: '18'},
        {label: '19', value: '19'},
        {label: '20', value: '20'},
        {label: '21', value: '21'},
        {label: '22', value: '22'},
        {label: '23', value: '23'},
        {label: '24', value: '24'},
        {label: '25', value: '25'},
        {label: '26', value: '26'},
        {label: '27', value: '27'},
        {label: '28', value: '28'},
        {label: '29', value: '29'},
        {label: '30', value: '30'},
        {label: '31', value: '31'},
        {label: '32', value: '32'},
        {label: '33', value: '33'},
        {label: '34', value: '34'},
        {label: '35', value: '35'},
        {label: '36', value: '36'},
        {label: '37', value: '37'},
        {label: '38', value: '38'},
        {label: '39', value: '39'},
        {label: '40', value: '40'},
        {label: '41', value: '41'},
        {label: '42', value: '42'},
        {label: '43', value: '43'},
        {label: '44', value: '44'},
        {label: '45', value: '45'},
        {label: '46', value: '46'},
        {label: '47', value: '47'},
        {label: '48', value: '48'},
        {label: '49', value: '49'},
        {label: '50', value: '50'},
        {label: '51', value: '51'},
        {label: '52', value: '52'},
        {label: '53', value: '53'},
        {label: '54', value: '54'},
        {label: '55', value: '55'},
        {label: '56', value: '56'},
        {label: '57', value: '57'},
        {label: '58', value: '58'},
        {label: '59', value: '59'},
      ],
      number_of_shots: [
        'Number of shots',
        this.shots_number_element(1, shots_num),
        this.shots_number_element(2, shots_num),
        this.shots_number_element(3, shots_num)
      ],
      ft_col1: [
        this.ft_col_text(1),
        this.ft_col_element(1, btn_ft_num_1, 1),
        this.ft_col_element(2, btn_ft_num_1, 1),
        ''
      ],
      ft_col2: [
        this.ft_col_text(2),
        this.ft_col_element(1, btn_ft_num_2, 2),
        this.ft_col_element(2, btn_ft_num_2, 2),
        ''
      ],
      ft_col3: [
        this.ft_col_text(3),
        this.ft_col_element(1, btn_ft_num_3, 3),
        this.ft_col_element(2, btn_ft_num_3, 3),
        ''
      ],

    };
    this.canvas = React.createRef();
  }

  goPage(page) {

    // 画面遷移パラメータ
    let params = {
      date: this.state.date,
      event: this.state.event,//イベント名 , イベントID
      stage: {label: this.state.game_stage, value: this.state.game_stage},//ステージ名
      game_card: {label: this.state.team_name_home + ' vs ' + this.state.team_name_visitor, value: this.state.team_id_home + '_' + this.state.team_id_visitor},//ホームチーム名 vs ビジターチーム名 ホームチームID_ビジターチームID
      team_home: this.state.team_home,//ホームチーム名, ホームチームID
      team_visitor: this.state.team_visitor,//ビジターチーム名, ビジターチームID
      game_id: this.state.game_id,//ゲームID
    }

    console.log(params)

    const {navigation} = this.props;
    navigation.navigate(page, params);
  }

  /*--------------------------------------------------------------------------
   * 選手のドラックアンドドロップ
   *------------------------------------------------------------------------*/
  onHDrop(data, index, type) {
    if (this.state.hoverData.number == data.number) return
    let starters_h = this.state.starters_h.map((item, i) => {
      if (item.number == data.number) {
        return this.state.hoverData;
      }
      if (item.number == this.state.hoverData.number) {
        return data;
      }
      return item;
    });
    let subs_h = this.state.subs_h.map((item, i) => {
      if (item.number == data.number) {
        return this.state.hoverData;
      }
      if (item.number == this.state.hoverData.number) {
        return data;
      }
      return item;
    });
    this.setState({...this.state, starters_h: starters_h, subs_h: subs_h});
  }

  onVDrop(data, index, type) {
    if (this.state.hoverData.number == data.number) return
    let starters_v = this.state.starters_v.map((item, i) => {
      if (item.number == data.number) {
        return this.state.hoverData;
      }
      if (item.number == this.state.hoverData.number) {
        return data;
      }
      return item;
    });

    let subs_v = this.state.subs_v.map((item, i) => {
      if (item.number == data.number) {
        return this.state.hoverData;
      }
      if (item.number == this.state.hoverData.number) {
        return data;
      }
      return item;
    });
    this.setState({...this.state, starters_v: starters_v, subs_v: subs_v});
  }

  onDelete(e) {
    let data = this.state.starters_h || [];
    let starters_h = data.map((item, i) => {
      if (e.number === item.number) {
        return {number: e.number, foul_count: 0};
      } else {
        return item;
      }
    });
    this.setState({starters_h});
  }

  onHover(hoverData, hoverDataIndex) {
    this.setState({hoverData, hoverDataIndex});
  }

  /*--------------------------------------------------------------------------
   * コンポーネントメソッド
   *------------------------------------------------------------------------*/

  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    shotImgPath = require(shot_img)
    arrowRightPath = require(arrow_right)
    arrowLeftPath = require(arrow_left)
    figures0Path = require(figures_0)
    figures1Path = require(figures_1)
    figures2Path = require(figures_2)
    figures3Path = require(figures_3)
    figures4Path = require(figures_4)
    figures5Path = require(figures_5)
    figures6Path = require(figures_6)
    figures7Path = require(figures_7)
    figures8Path = require(figures_8)
    figures9Path = require(figures_9)
    figuresCoronPath = require(figures_coron)
    this.setState({figure0: figures1Path});
    this.setState({figure1: figures0Path});
    this.setState({figure2: figures0Path});
    this.setState({figure3: figures0Path});
    this.setState({timeout_figure_h: figures2Path});
    this.setState({timeout_figure_v: figures2Path});
    this.setState({score_figure_v0: figures0Path});
    this.setState({score_figure_h0: figures0Path});
    this.setState({score_figure_v1: figures0Path});
    this.setState({score_figure_h1: figures0Path});
    this.setState({score_figure_v2: figures0Path});
    this.setState({score_figure_h2: figures0Path});
    this.setState({foul_figure_h: figures0Path});
    this.setState({foul_figure_v: figures0Path});
    this.setState({arrow_img: arrowRightPath});


    // 画面遷移時の再レンダリング対応
    const game_id = this.props.param_game_id;
    this.setState({game_id: game_id});

    // 初期処理
    this.init();

    // this.focusListener = navigation.addListener("didFocus", () => {
    //   // 初期処理
    //   this.init();
    // });
  }

  /*--------------------------------------------------------------------------
   * イベント処理
   *------------------------------------------------------------------------*/
  _onLayout(event) {
    this.setState({
      width: wp(100),
      height: hp(100),
    });
  };

  handlePress(evt) {
    x_coordinate = evt.nativeEvent.locationX;
    y_coordinate = evt.nativeEvent.locationY;
    const ctx = this.canvas.current.getContext('2d');
    this.canvas.current.width = 1000;  //キャンバスの横幅
    this.canvas.current.height = 1000;
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(192, 80, 77)';       // 図形の枠線色
    ctx.fillStyle = 'red';
    ctx.arc(x_coordinate, y_coordinate, 10, 0, Math.PI * 2, false);  // 円の図形
    ctx.fill();
    ctx.closePath();
    x_coordinate = evt.nativeEvent.locationX-yardWidth/2;
    y_coordinate = evt.nativeEvent.locationY-yardHeight/2;
    let coordinates = {"x": x_coordinate, "y": y_coordinate}
    input_pos.push(coordinates)
    console.log("coord:",coordinates)

  }

  onMemberChange(option, index) {
    this.setState({defaultValue: option.value});
  }

  onResultChange(option, index) {
    console.log("onResultChange:",option)
    this.setState({defaultResultValue: option.label});
  }

  onPlayChange(option, index) {
    this.setState({defaultPlayValue: option.value});
  }

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  _updateCheckbox(index, hv) {
    console.log(`This is row ${index + 1}`);

    if (hv == 'v') {
      //visitor
      var vdata = this.state.tableDataV
      let dataRow = vdata[index]
      if(dataRow[4] == false) dataRow[4] = true
      else dataRow[4] = false
      vdata[index] = dataRow
      this.update_tagging(dataRow)
      this.setState({tableDataV: vdata});
    } else if (hv == 'h') {
      //home
      var hdata = this.state.tableDataH
      let dataRow = hdata[index]
      if(dataRow[4] == false) dataRow[4] = true
      else dataRow[4] = false
      hdata[index] = dataRow
      this.update_tagging(dataRow)
      this.setState({tableDataH: hdata});
    }

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

  _dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, target) {
    if (rowID == target.length - 1) return;
    let key = `spr_${rowID}`;
    return (
      <View
        style={styles.dropdown_separator}
        key={key}
      />
    );
  }

  btn_latest(){
    this.get_tagging().then((response)=>{
      console.log('btn_latest clicked');
    });
  }

  /*--------------------------------------------------------------------------
   * 関数
   *------------------------------------------------------------------------*/
  // 初期処理
  init = async (event) => {
    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async (err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // ローディングスピナー起動
        this.setState({isLoadingVisible: true,});

        // 成功

        // ユーザー名保持
        this.setState({username: cognitoUser.username});

        // Game情報取得
        let param = {
          category: Constants.QUERY_PATTERN.TYPE_0,
          pk: cognitoUser.username,
          sk: this.state.game_id,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param, Constants.SK_TYPE.GAME);


        await this.get_tagging();
      }
    });
  }

  put_info = async() => {

    let game_time = this.getPlayTime()

    let item  = this.state.gameList[0]
    let data = {
      event_name: item.event_name,
      game_start_time: item.game_start_time,
      game_stage: item.game_stage,
      team_id_home: item.team_id_home,
      team_id_visitor: item.team_id_visitor,
      team_name_home: item.team_name_home,
      team_name_visitor: item.team_name_visitor,
      teamcolor_home: this.state.teamcolor_home,
      teamcolor_visitor: this.state.teamcolor_visitor,
      starters_home: item.starters_home,
      starters_visitor: item.starters_visitor,
      subs_home: item.subs_home,
      subs_visitor: item.subs_visitor,
      tagging_data_temp: {
        "game_time": game_time,
        "period": this.state.quoter_inner.substring(1),
        "score_home": this.state.score_h,
        "score_visitor": this.state.score_v,
        "teamfoul_home": foul_count_h,
        "teamfoul_visitor": foul_count_v,
        "timeout_home": to_count_h,
        "timeout_visitor": to_count_v,
        "lineup_home": this.state.starters_v,
        "lineup_visitor": this.state.starters_v,
        "substitues_home": this.state.subs_h,
        "substitues_visitor": this.state.subs_v,
        "attack_direction": attack_direction,
        // 入場時間の制御対応: ピリオド開始フラグTrueの場合は入場記録を行わない
        "is_period_start": is_period_start,
      }
    }

    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async (err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // 成功
        // Game情報取得
        let param = {
          category: Constants.DB_CATEGORY.UPDATE,
          pk: this.state.username,
          sk: this.state.game_id,
          data: data
        };

        console.log('put_info param : ',param);
        // API接続
        RequestApi(
          Constants.REQUEST_METHOD.PUT,
          Constants.API_BASE_URL + Constants.API_NAME.INFO,
          succ.getAccessToken().getJwtToken(),
          param,
        ).then((response) => {
          if (response !== null) {
            console.log('put_info response:', response)
            //Refresh

          } else {
            throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          console.log('put_info error:', error)
          alert( Messages.ERROR.E001);
        });
      }
    });
  }

  refresh_table = ( data) => {

    let dataTableH=[]
    let dataTableV=[]
    for(let i = 0;i<data.length;i++){
      if(data[i][1]==this.state.team_id_home){
        dataTableH.push([data[i][3],data[i][4],data[i][5],data[i][6],data[i][7],'',data[i][2]])
      }
      if(data[i][1]==this.state.team_id_visitor){
        dataTableV.push([data[i][3],data[i][4],data[i][5],data[i][6],data[i][7],'',data[i][2]])
      }
    }
    if (dataTableV.length>0) {
      this.setState({tableDataV: dataTableV});
    }
    if (dataTableH.length>0) {
      this.setState({tableDataH: dataTableH});
    }
  }

  get_tagging = async () => {
    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async (err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // ローディングスピナー起動
        this.setState({isLoadingVisible: true,});

        // 成功
        console.log('get_tagging token : ' + succ.getAccessToken().getJwtToken());

        // Tagging情報取得
        let param = {
          game_id: this.state.game_id,
          period:'0'+this.state.quoter_inner.substring(1)
        };

        // API接続
        RequestApi(
          Constants.REQUEST_METHOD.POST,
          Constants.API_BASE_URL + Constants.API_NAME.TAGGING,
          succ.getAccessToken().getJwtToken(),
          param,
        ).then((response) => {
          if (response !== null) {
            console.log('get_tagging response:', response.data)
            //Refresh
            this.refresh_table( response.data)
          } else {
            throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          console.log('get_tagging error:', error)
          alert( Messages.ERROR.E001);
        });

        this.setState({isLoadingVisible: false,});
      }
    });
  }

  add_tagging = async() => {

    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async (err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // 成功
        console.log('add_tagging ref token : ' + succ.getAccessToken().getJwtToken());

        // Tagging パラメータ
        let params = {
          category: Constants.DB_CATEGORY.ADD,
          pk: this.state.game_id,
          sk: this.getSKTime(),
          datas: tag_datas,
        };

        console.log("add_tagging params:", params)
        // API接続
        RequestApi(
          Constants.REQUEST_METHOD.PUT,
          Constants.API_BASE_URL + Constants.API_NAME.TAGGING,
          succ.getAccessToken().getJwtToken(),
          params,
        ).then((response) => {
          tag_datas=[]
          console.log('add_tagging response===', response.data)
          if (response !== null) {
            // Infoテーブルへ登録
            this.put_info({})

            // 初期化
            //this.init_process();

            tag_datas = [];
            input_pos = [];
            this.setState({touch_key_h: null});
            this.setState({touch_key_v: null});
            this.setState({touch_teamkey_h: null});
            this.setState({touch_teamkey_v: null});

          } else {
            throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          console.log('add_tagging error:', error)
          alert( Messages.ERROR.E001);
        });

      }
    });
  }


  update_tagging = async(data_row) => {

    //data_row = [game_time,play_num,play,result,check,delete]

    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async (err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // 成功
        console.log('update_tagging ref token : ' + succ.getAccessToken().getJwtToken());

        // 登録時のタイムスタンプ取得
        timestamp = this.getCurrentTime();
        // Playタイムを取得Pl
        //データ形式：ピリオド(n)+試合時間(mmss)+yyyymmddhhmmssms
        game_time = this.tendigit(minute).toString() + this.onedigit(minute).toString() + ":" + this.tendigit(second).toString() + this.onedigit(second).toString();
        let game_time2 = data_row[0].replace(":",'');

        //チームネーム
        let team_name = (this.state.edit_index_h >= 0) ? this.state.team_name_home : this.state.team_name_visitor

        let playValue = data_row[2].toString().toLowerCase()
        let main_tag = ''
        let sub_tag = ''
        let ft1 = ''
        let ft2 = ''
        let ft3 = ''
        let idx = (this.state.edit_index_h >= 0) ? 'h': 'v'

        if (playValue == '2p') {
          main_tag = 'Shot'
          sub_tag = Constants.PLAY_TYPE['2p']
        } else if (playValue == '3p') {
          main_tag = 'Shot'
          sub_tag = Constants.PLAY_TYPE['3p']
        } else if (playValue == 'ft_1shot') {
          main_tag = Constants.PLAY_TYPE['FT']
          sub_tag = Constants.PLAY_TYPE['FT']
          ft1 = data_row[3]
        } else if (playValue == 'ft_2shot') {
          main_tag = Constants.PLAY_TYPE['FT']
          sub_tag = Constants.PLAY_TYPE['FT']
          ft2 = data_row[3]
        } else if (playValue == 'ft_3shot') {
          main_tag = Constants.PLAY_TYPE['FT']
          sub_tag = Constants.PLAY_TYPE['FT']
          ft3 = data_row[3]
        } else if (playValue == 'to_foul') {
          main_tag = 'TO'
          sub_tag = 'Foul'
        } else if (playValue == 'to_ob') {
          main_tag = 'TO'
          sub_tag = 'OB'
        } else if (playValue == 'to_steal') {
          main_tag = 'TO'
          sub_tag = 'Steal'
        } else if (playValue == 'to_violation') {
          main_tag = 'TO'
          sub_tag = 'Violation'
        } else if (playValue == 'foul') {
          main_tag = 'Foul'
          sub_tag = 'Foul'
        } else if (playValue == 'end') {
          main_tag = 'End'
          sub_tag = 'End'
        } else {
          console.log("ERROR: update_tagging",playValue)
          //return
          main_tag = playValue
          sub_tag = playValue
        }

        // Tagging パラメータ
        let params = {
          category: Constants.DB_CATEGORY.UPDATE,
          pk: this.state.game_id,
          sk: data_row[6],
          datas: [{
            team_id: (this.state.edit_index_h >= 0 ? this.state.team_id_home : this.state.team_id_visitor),
            team_name: (this.state.edit_index_h >= 0) ? this.state.team_name_home : this.state.team_name_visitor,
            update_item:{
              check_flag: data_row[4]?'checked':'',
              player_num: data_row[1],
              shot_result: data_row[3],
              main_tag: main_tag,//shot ft to
              sub_tag: sub_tag,
            }
          }],
        };

        // API接続
        RequestApi(
          Constants.REQUEST_METHOD.PUT,
          Constants.API_BASE_URL + Constants.API_NAME.TAGGING,
          succ.getAccessToken().getJwtToken(),
          params,
        ).then((response) => {
          if (response !== null) {
            console.log('update_tagging response:', response.data)
            //Refresh

          } else {
            throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          console.log('update_tagging error:', error)
          alert( Messages.ERROR.E001);
        });

      }
    });
  }

  delete_tagging = async (dataRow)=>{

    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
    const refToken = cognitoUser.getSignInUserSession().getRefreshToken();
    cognitoUser.refreshSession(refToken, async (err, succ) => {
      if (!succ) {
        // エラー
        console.log(err);
      } else {
        // 成功
        console.log('delete_tagging ref token : ' + succ.getAccessToken().getJwtToken());

        //データ形式：ピリオド(n)+試合時間(mmss)+yyyymmddhhmmssms
        let param = {
          category: Constants.DB_CATEGORY.DELETE,
          pk: this.state.game_id,
          sk: dataRow[6],
          datas: [{
            team_id: (this.state.edit_index_h>=0 ? this.state.team_id_home:this.state.team_id_visitor),
            team_name: (this.state.edit_index_h >= 0 ? this.state.team_name_home:this.state.team_name_visitor),
          }]
        }
        // API接続
        RequestApi(
          Constants.REQUEST_METHOD.PUT,
          Constants.API_BASE_URL + Constants.API_NAME.TAGGING,
          succ.getAccessToken().getJwtToken(),
          param,
        ).then((response) => {
          if (response !== null) {
            console.log('delete_tagging response:', response)
            //Refresh

          } else {
            throw Error(response.data.errorMessage)
          }
        }).catch((error) => {
          console.log('delete_tagging error:', error)
          alert( Messages.ERROR.E001);
        });

      }
    });
  }

  // プルダウン項目セット
  setArrayList(category, value, obj) {
    let filtered = [];
    let items = [];
    if (category === 'date') {
      filtered = obj.filter(item => item.game_start_time === value);
      filtered.forEach(function (item, index) {
        items.push({
          label: item.event_name,
          value: item.event_id,
        });
      })
      // 重複除外
      items = ExcludeDuplicate(items);
      this.setState({eventList: items});
      this.setState({event_name: items[0]});
      this.setState({filtered_event: filtered});

    } else if (category === 'event') {
      items = [{label: 'ALL', value: 'ALL'}];
      // 絞り込み
      filtered = obj.filter(item => item.event_id === value);
      // プルダウン項目セット
      filtered.forEach(function (item, index) {
        items.push({
          label: item.game_stage,
          value: item.game_stage,
        });
      })

      // 重複除外
      items = ExcludeDuplicate(items);
      this.setState({stageList: items});
      this.setState({stage_name: items[0]});
      this.setState({filtered_stage: filtered});

    } else if (category === 'stage') {
      items = [{label: 'ALL', value: 'ALL'}];
      // 絞り込み
      if (value === 'ALL') {
        filtered = obj;
      } else {
        filtered = obj.filter(item => item.game_stage === value);
      }
      // プルダウン項目セット
      filtered.forEach(function (item, index) {
        items.push({
          label: item.team_name_home,
          value: item.team_id_home,
        });
        items.push({
          label: item.team_name_visitor,
          value: item.team_id_visitor,
        });
      })
      // 重複除外
      items = ExcludeDuplicate(items);
      this.setState({teamList: items});
      this.setState({team_name: items[0]});
      this.setState({filtered_team: filtered});
    }
    return filtered;
  }

  setPlaylist(selectRow) {
    var playList = [];
    var selected_play = selectRow[3];
    // 選択中のPLAY_TYPEに応じてセレクトボックスに設定する値を制御
    if (selected_play == Constants.PLAY_TYPE['2P'] || selected_play == Constants.PLAY_TYPE['3P']) {
      playList = [
        {value: "1", label: Constants.PLAY_TYPE['2P']},
        {value: "2", label: Constants.PLAY_TYPE['3P']},
      ];
      this.setState({playList: playList, is_play_disable: false});
    } else if (selected_play == Constants.PLAY_TYPE['ORB'] || selected_play == Constants.PLAY_TYPE['DRB']) {
      playList = [
        {value: "1", label: Constants.PLAY_TYPE['ORB']},
        {value: "1", label: Constants.PLAY_TYPE['DRB']},
      ];
      this.setState({playList: playList, is_play_disable: false});
    } else if (selected_play == "OFF_REB_FT" || selected_play == "DEF_REB_FT") {
      playList = [
        {value: "1", label: "OFF_REB_FT"},
        {value: "1", label: "DEF_REB_FT"},
      ];
      this.setState({playList: playList, is_play_disable: false});
    } else {
      this.setState({playList: [], is_play_disable: true});
    }
  }

  ft_btn(index) {
    shots_num = index;
    this.setState({
      shots_num: index,
      number_of_shots: [
        'Number of shots',
        this.shots_number_element(1, shots_num),
        this.shots_number_element(2, shots_num),
        this.shots_number_element(3, shots_num)
      ],
      ft_col1: [
        this.ft_col_text(1),
        this.ft_col_element(1, btn_ft_num_1, 1),
        this.ft_col_element(2, btn_ft_num_1, 1),
        ''
      ],
      ft_col2: [
        this.ft_col_text(2),
        this.ft_col_element(1, btn_ft_num_2, 2),
        this.ft_col_element(2, btn_ft_num_2, 2),
        ''
      ],
      ft_col3: [
        this.ft_col_text(3),
        this.ft_col_element(1, btn_ft_num_3, 3),
        this.ft_col_element(2, btn_ft_num_3, 3),
        ''
      ]
    });
  }

  btn_ft_col(index, num) {
    switch (num) {
      case 1:
        btn_ft_num_1 = index;
        this.setState({
          btn_ft_num_1: index,
          ft_col1: [
            this.ft_col_text(1),
            this.ft_col_element(1, btn_ft_num_1, 1),
            this.ft_col_element(2, btn_ft_num_1, 1),
            ''
          ],
        });
        break;
      case 2:
        btn_ft_num_2 = index;
        this.setState({
          btn_ft_num_2: index,
          ft_col2: [
            this.ft_col_text(2),
            this.ft_col_element(1, btn_ft_num_2, 2),
            this.ft_col_element(2, btn_ft_num_2, 2),
            ''
          ]
        });
        break;
      case 3:
        btn_ft_num_3 = index;
        this.setState({
          btn_ft_num_3: index,
          ft_col3: [
            this.ft_col_text(3),
            this.ft_col_element(1, btn_ft_num_3, 3),
            this.ft_col_element(2, btn_ft_num_3, 3),
            ''
          ]
        });
        break;
    }
  }

  btn_ft_ok() {
    // カテゴリ
    category_type = Constants.MAIN_TAG['FT'];
    var idx = null;
    // チームファウル加算
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // Playタイム
    game_time = this.getPlayTime()

    if (this.state.shots_num == 1) {
      // 1Shot
      if (this.state.btn_ft_num_1 == 2) {
        // ShotがMissの場合、
        // リバウンド有無に遷移するため、Reboundフラグを立てる
        is_rebound = true;
        // Last Shotのresultを"Miss"に設定
        result_type_1 = Constants.SHOT_RESULT['MISS'];
        // タイマー再開
        //this.timer_restart();
      } else {
        // ShotがMadeの場合、スコア加算
        this.update_score(idx, 'FT', 'add');
        result_type_1 = Constants.SHOT_RESULT['MADE'];
      }
      // 登録値セット
      var dataRow = [game_time, player_num, Constants.MAIN_TAG['FT_1'], result_type_1, false, 'Del'];
      // FT登録
      this.addTagTable(idx, dataRow);

    } else if (this.state.shots_num == 2) {
      // 2Shot
      // 2Shot目のresultを設定
      if (this.state.btn_ft_num_2 == 2) {
        // Last ShotがMissの場合
        // リバウンド有無に遷移するため、Reboundフラグを立てる
        is_rebound = true;
        // Last Shotのresultを"Miss"に設定
        result_type_2 = Constants.SHOT_RESULT['MISS'];
        // タイマー再開
        //this.timer_restart();
      } else {
        // ShotがMadeの場合、スコア加算
        this.update_score(idx, 'FT', 'add');
        // Last Shotのresultを"Made"に設定
        result_type_2 = Constants.SHOT_RESULT['MADE'];
      }

      // 1Shot目のresultを設定
      if (this.state.btn_ft_num_1 == 2) {
        result_type_1 = Constants.SHOT_RESULT['MISS'];
      } else {
        // ShotがMadeの場合、スコア加算
        this.update_score(idx, 'FT', 'add');
        result_type_1 = Constants.SHOT_RESULT['MADE'];
      }
      // 登録値セット
      var dataRow = [
        [game_time, player_num, Constants.MAIN_TAG['FT_1'], result_type_1, false, 'Del'],
        [game_time, player_num, Constants.MAIN_TAG['FT_2'], result_type_2, false, 'Del'],
      ];
      // FT登録
      for (var i = 0; i < dataRow.length; i++) {
        this.addTagTable(idx, dataRow[i]);
      }

    } else {
      // 3Shot
      // 3Shot目のresultを設定
      if (this.state.btn_ft_num_3 == 2) {
        // Last ShotがMissの場合
        // リバウンド有無に遷移するため、Reboundフラグを立てる
        is_rebound = true;
        // Last Shotのresultを"Miss"に設定
        result_type_3 = Constants.SHOT_RESULT['MISS'];
        // タイマー再開
        //this.timer_restart();
      } else {
        // ShotがMadeの場合、スコア加算
        this.update_score(idx, 'FT', 'add');
        // Last Shotのresultを"Made"に設定
        result_type_3 = Constants.SHOT_RESULT['MADE'];
      }

      // 1Shot目のresultを設定
      if (this.state.btn_ft_num_1 == 2) {
        result_type_1 = Constants.SHOT_RESULT['MISS'];
      } else {
        // ShotがMadeの場合、スコア加算
        this.update_score(idx, 'FT', 'add');
        result_type_1 = Constants.SHOT_RESULT['MADE'];
      }

      // 2Shot目のresultを設定
      if (this.state.btn_ft_num_2 == 2) {
        result_type_2 = Constants.SHOT_RESULT['MISS'];
      } else {
        // ShotがMadeの場合、スコア加算
        this.update_score(idx, 'FT', 'add');
        result_type_2 = Constants.SHOT_RESULT['MADE'];
      }
      // 登録値セット
      var dataRow = [
        [game_time, player_num, Constants.MAIN_TAG['FT_1'], result_type_1, false, 'Del'],
        [game_time, player_num, Constants.MAIN_TAG['FT_2'], result_type_2, false, 'Del'],
        [game_time, player_num, Constants.MAIN_TAG['FT_3'], result_type_3, false, 'Del'],

      ];
      for (var i = 0; i < dataRow.length; i++) {
        this.addTagTable(idx, dataRow[i]);
      }
    }
    // フリースロー座標(固定)
    x_coordinate = 126;
    y_coordinate = 138;
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['FT'], Constants.PLAY_TYPE['FT'], '', '');
    this.add_tagging()

    // メッセージ表示
    if (is_rebound) {
      this.setState({lbl_msg: Messages.INFO.I007 + Messages.INFO.I008});
    }
    // ダイアログを閉じる
    this.setState({ is_ftmodal_visible: !this.state.is_ftmodal_visible });
  }

  update_score(idx, pt, calc_type) {
    if (idx == 'v') {
      // Visitor側のスコア
      let score_v = 0;
      if (calc_type == 'add') {
        if (pt == '2P') {
          // 1ショットにつき2ポイント加算する
          score_v = this.state.score_v;
          score_v = score_v + 2;
          this.setState({
            score_v: score_v,
          });
        } else if (pt == '3P') {
          // 1ショットにつき3ポイント加算する
          score_v = this.state.score_v;
          score_v = score_v + 3;
          this.setState({
            score_v: score_v,
          });
        } else {
          // 1ショットにつき1ポイント加算する
          score_v = this.state.score_v;
          score_v = score_v + 1;
          this.setState({
            score_v: score_v,
          });
        }
      } else {
        if (pt == '2P') {
          // 1ショットにつき2ポイント減算する
          score_v = this.state.score_v;
          score_v = score_v - 2;
          this.setState({
            score_v: score_v,
          });
        } else if (pt == '3P') {
          // 1ショットにつき3ポイント減算する
          score_v = this.state.score_v;
          score_v = score_v - 3;
          this.setState({
            score_v: score_v,
          });
        } else {
          // 1ショットにつき1ポイント減算する
          score_v = this.state.score_v;
          score_v = score_v - 1;
          this.setState({
            score_v: score_v,
          });
        }
      }
      // スコア表示
      this.displayScore(score_v, idx);

    } else {
      // Home側のスコア
      let score_h = 0;
      if (calc_type == 'add') {
        if (pt == '2P') {
          // 1ショットにつき2ポイント加算する
          score_h = this.state.score_h;
          score_h = score_h + 2;
          this.setState({
            score_h: score_h,
          });
        } else if (pt == '3P') {
          // 1ショットにつき3ポイント加算する
          score_h = this.state.score_h;
          score_h = score_h + 3;
          this.setState({
            score_h: score_h,
          });
        } else {
          // 1ショットにつき1ポイント加算する
          score_h = this.state.score_h;
          score_h = score_h + 1;
          this.setState({
            score_h: score_h,
          });
        }
      } else {
        if (pt == '2P') {
          // 1ショットにつき2ポイント減算する
          score_h = this.state.score_h;
          score_h = score_h - 2;
          this.setState({
            score_h: score_h,
          });
        } else if (pt == '3P') {
          // 1ショットにつき3ポイント減算する
          score_h = this.state.score_h;
          score_h = score_h - 3;
          this.setState({
            score_h: score_h,
          });
        } else {
          // 1ショットにつき1ポイント減算する
          score_h = this.state.score_h;
          score_h = score_h - 1;
          this.setState({
            score_h: score_h,
          });
        }
      }
      // スコア表示
      this.displayScore(score_h, idx);
    }

  }

  /**
   * スコアを表示する関数
   */
  displayScore(score_count, idx) {
    if (score_count > 99) {
      // スコアのカウント数が99より大きい場合、100の位を1つ加算し
      // スコアボードに表示する

      var d = this.setPath(this.hundreddigit(score_count));
      if (idx == 'v') {
        this.setState({score_figure_v0_visible: true});
        this.setState({score_figure_v0: d});
      } else {
        this.setState({score_figure_h0_visible: true});
        this.setState({score_figure_h0: d});
      }
    } else {
      if (idx == 'v') {
        this.setState({score_figure_v0_visible: false});
      } else {
        this.setState({score_figure_h0_visible: false});
      }
    }
    if (score_count > 9) {
      // スコアのカウント数が9より大きい場合、10の位を1つ加算し
      // スコアボードに表示する
      var d = this.setPath(this.tendigit(score_count));
      if (idx == 'v') {
        this.setState({score_figure_v1: d});
        this.setState({score_figure_v1_visible: true});
      } else {
        this.setState({score_figure_h1: d});
        this.setState({score_figure_h1_visible: true});
      }
    } else {
      if (idx == 'v') {
        this.setState({score_figure_v1_visible: false});
      } else {
        this.setState({score_figure_h1_visible: false});
      }
    }
    // スコアボードに表示する
    var d = this.setPath(this.onedigit(score_count));
    if (idx == 'v') {
      this.setState({score_figure_v2: d});
      this.setState({score_figure_v2_visible: true});
    } else {
      this.setState({score_figure_h2: d});
      this.setState({score_figure_h2_visible: true});
    }

  }

  compare(a, b) {
    var r = 0;
    if (a.number < b.number) {
      r = -1;
    } else if (a.number > b.number) {
      r = 1;
    }
    return r;
  }

  // API Gateway経由でDynamoDBにリクエストを行う
  requestInfo = async (method, succ, param, sort) => {
    // API接続
    await RequestApi(
      method,
      Constants.API_BASE_URL + Constants.API_NAME.INFO,
      succ.getAccessToken().getJwtToken(),
      param,
    ).then((response) => {
      // ローディングスピナークローズ
      this.setState({isLoadingVisible: false,});
      //console.log("response:", response)
      if (response !== null) {
        if (response.data.Items !== undefined) {

          let i;

          // ゲーム情報セット
          const gameinfo = [];
          response.data.Items.forEach(function (item, index) {

            const date_str = item.game_start_time.slice(0, 4) + '/' + item.game_start_time.slice(4, 6) + '/' + item.game_start_time.slice(6, 8);
            const datetime_str = item.game_start_time.slice(8, 10) + ':' + item.game_start_time.slice(10, 12);
            gameinfo.push({
              id: index.toString(),
              event: {value: item.event_id, label: item.event_name},
              event_id: item.event_id,
              event_name: item.event_name,
              game_start_time: item.game_start_time,
              game_stage: item.game_stage,
              team_id_home: item.team_id_home,
              team_id_visitor: item.team_id_visitor,
              team_name_home: item.team_name_home,
              team_name_visitor: item.team_name_visitor,
              teamcolor_home: item.home_teamcolors,
              teamcolor_visitor: item.visitor_teamcolors,
              starters_home: item.starters_home,
              starters_visitor: item.starters_visitor,
              subs_home: item.subs_home,
              subs_visitor: item.subs_visitor,
            });
            if(item.tagging_data_temp){
              game_time = item.tagging_data_temp.game_time.split(':');
              minute = game_time[0];
              second = game_time[1];
            }else{
              minute = '10';
              second = '00';
            }

            if(item.tagging_data_temp){
              attack_direction = item.tagging_data_temp.attack_direction
              if(attack_direction === 'Right'){
                is_left = true;
              }else{
                is_left = false;
              }
            }

            if(item.tagging_data_temp){
              is_period_start = item.tagging_data_temp.is_period_start;
              lineup_home = item.tagging_data_temp.lineup_home;
              lineup_visitor = item.tagging_data_temp.lineup_visitor;
              substitues_home = item.tagging_data_temp.substitues_home;
              substitues_visitor = item.tagging_data_temp.substitues_visitor;


              period = item.tagging_data_temp.period;
              score_home = item.tagging_data_temp.score_home;
              score_visitor = item.tagging_data_temp.score_visitor;
              foul_count_h = item.tagging_data_temp.teamfoul_home;
           

              foul_count_v = item.tagging_data_temp.teamfoul_visitor;


              to_count_h = item.tagging_data_temp.timeout_home;
            
              to_count_v = item.tagging_data_temp.timeout_visitor;
            }

          })
          this.arrow_right()
          // 分の数字をセットする
          var d0 = this.setPath(this.tendigit(minute));
          this.setState({figure0: d0});
          var d1 = this.setPath(this.onedigit(minute));
          this.setState({figure1: d1});
          // 秒の数字をセットする
          var d2 = this.setPath(this.tendigit(second));
          this.setState({figure2: d2});
          var d3 = this.setPath(this.onedigit(second));
          this.setState({figure3: d3});

          if(minute == 0 && second == 0){
            this.setState({is_period_end_visible: true});
          }

          // スコアボードに表示する
          var d = this.setPath(this.onedigit(foul_count_h));
          this.setState({foul_figure_h: d});
          // スコアボードに表示する
          var d = this.setPath(this.onedigit(foul_count_v));
          this.setState({foul_figure_v: d});
          var d = this.setPath(this.onedigit(to_count_h));
          this.setState({timeout_figure_h: d});
          var d = this.setPath(this.onedigit(to_count_v));
          this.setState({timeout_figure_v: d});

          if(period.indexOf !== undefined){
            if(period.indexOf('Q') === -1){
              period = 'Q' + period
            }
            this.setState({quoter_inner: period})
          }else{
            this.setState({quoter_inner: 'Q1'})
          }
          
          this.setState({score_h: score_home})
          this.setState({score_v: score_visitor})

          this.displayScore(score_home, 'h')
          this.displayScore(score_visitor, 'v')

          this.setState({event: gameinfo[0].event});
          this.setState({event_id: gameinfo[0].event_id});
          this.setState({game_stage: gameinfo[0].game_stage});
          this.setState({team_id_home: gameinfo[0].team_id_home});
          this.setState({team_id_visitor: gameinfo[0].team_id_visitor});
          this.setState({team_name_home: gameinfo[0].team_name_home});
          this.setState({team_name_visitor: gameinfo[0].team_name_visitor});
          this.setState({teamcolor_home: gameinfo[0].teamcolor_home});
          this.setState({teamcolor_visitor: gameinfo[0].teamcolor_visitor});
          this.setState({gameList: gameinfo});

          // スタメン、ベンチの選手リスト取得
          var starters_h = lineup_home;
          var subs_h = substitues_home;
          var starters_v = lineup_visitor;
          var subs_v = substitues_visitor;
          latest_team = gameinfo[0].team_name_home;

          if(starters_h.length == 0 || starters_h === undefined){
            starters_h = gameinfo[0].starters_home;
            
            if(starters_h !== undefined && starters_h.length > 0){
              for (i = 0; i < starters_h.length; i++) {
                starters_h[i].foul_count = 0;
              }
            }else{
              starters_h = []
            }
          }
          if(subs_h.length == 0 || subs_h === undefined){
            subs_h = gameinfo[0].subs_home;
            if(subs_h === undefined || subs_h.length == 0){
              subs_h = []
            }
          }
          if(starters_v.length == 0 || starters_v === undefined){
            starters_v = gameinfo[0].starters_visitor;
            if(starters_v !== undefined && starters_v.length > 0){
              for (i = 0; i < starters_v.length; i++) {
                starters_v[i].foul_count = 0;
              }
            }else{
              starters_v = []
            }
          }
          if(subs_v.length == 0 || subs_v === undefined){
            subs_v = gameinfo[0].subs_visitor;
            if(subs_v === undefined || subs_v.length == 0){
              subs_v = []
            }
          }
          


          // Player番号順に並べ替え
          if(starters_h !== undefined){
            starters_h.sort(this.compare);
          }
          if(subs_h !== undefined){
            subs_h.sort(this.compare);
          }
          if(starters_v !== undefined){
            starters_v.sort(this.compare);
          }
          if(subs_v !== undefined){
            subs_v.sort(this.compare);
          }

          this.setState({starters_h: starters_h});
          this.setState({starters_v: starters_v});
          this.setState({subs_h: subs_h});
          this.setState({subs_v: subs_v});
          // Homeチームのメンバー一覧作成
          members_h = starters_h.concat(subs_h);
          members_v = starters_v.concat(subs_v);
          for (i = 0; i < members_h.length; i++) {

            memberslist_h.push({
              label: members_h[i].number,
              value: members_h[i].number,
            });
          }
          for (i = 0; i < members_v.length; i++) {
            memberslist_v.push({
              label: members_v[i].number,
              value: members_v[i].number,
            });
          }

          // 日付リストセット
          let dateItems = [];
          gameinfo.forEach(function (item, index) {
            const date_str = item.game_start_time.slice(0, 4) + '/' + item.game_start_time.slice(4, 6) + '/' + item.game_start_time.slice(6, 8);
            dateItems.push({
              label: date_str,
              value: item.game_start_time.slice(0, 8),
            });
          })
          // 重複除外
          dateItems = ExcludeDuplicate(dateItems);
          // 日付の降順に並び替え
          dateItems.sort(function (a, b) {
            return Number(b.value) - Number(a.value);
          });
          this.setState({dateList: dateItems});
          this.setState({date: dateItems[0]});

        }
      } else {
        throw Error(response.data.errorMessage)
      }
    }).catch((error) => {
      // ローディングスピナークローズ
      console.log(error)
      this.setState({isLoadingVisible: false,});
      alert(Messages.ERROR.E001);
    });
  }

  /**
   * チームファウルを更新する
   * @param {string} idx          "v" もしくは "h"
   * @param {string} calc_type    "add" もしくは "subtract"
   */
  update_foul(idx, calc_type) {
    if (idx == 'v') {
      // Visitor側のファウル数
      if (calc_type == 'add') {
        // 加算
        if (foul_count_v < 5) {
          foul_count_v++
          // スコアボードに表示する
          var d = this.setPath(this.onedigit(foul_count_v));
          this.setState({foul_figure_v: d});
        }
      } else {
        // 減算
        foul_count_v = foul_count_v - 1;
        var d = this.setPath(this.onedigit(foul_count_v));
        this.setState({foul_figure_v: d});
      }
    } else {
      // Home側のファウル数
      if (calc_type == 'add') {
        // 加算
        if (foul_count_h < 5) {
          foul_count_h++
          // スコアボードに表示する
          var d = this.setPath(this.onedigit(foul_count_h));
          this.setState({foul_figure_h: d});
        }
      } else {
        // 減算
        foul_count_h = foul_count_h - 1;
        var d = this.setPath(this.onedigit(foul_count_h));
        this.setState({foul_figure_h: d});
      }
    }
  }

  /**
   * 個人ファウルを加算する
   * @param {string} target           対象要素
   * @param {string} foul_count_psnl  累積ファウル数(個人)
   */
  add_personalfoul(idx, target) {
    if (target !== "Team") {
      foul_count_psnl = target.foul_count;
      if (foul_count_psnl < 5) {
        foul_count_psnl++;
        // ファウル数セット
        if (idx === 'v') {
          var target_list = this.state.starters_v;
          for (var i = 0; i < target_list.length; i++) {
            if (target_list[i] === target) {
              target_list[i].foul_count = foul_count_psnl;
            }
          }
          this.setState({starters_v: target_list});
        } else {
          var target_list = this.state.starters_h;
          for (var i = 0; i < target_list.length; i++) {
            if (target_list[i] === target) {
              target_list[i].foul_count = foul_count_psnl;
            }
          }
          this.setState({starters_h: target_list});
        }

      } else {
        foul_count_psnl++;
      }
    } else {
      if (idx === 'v') {
        foul_count_psnl = this.state.foul_team_count_v;
        foul_count_psnl++;
        this.setState({foul_team_count_v: foul_count_psnl});

      } else {
        foul_count_psnl = this.state.foul_team_count_h;
        foul_count_psnl++;
        this.setState({foul_team_count_h: foul_count_psnl});

      }
    }
  }

  countUp(t) {
    if ((minute == "") && (second == "")) {
      alert("時刻を設定してください。");
      this.reSet('10', '00');
    } else {
      if (minute == "") {
        minute = 0;
      } else {
        minute = parseInt(minute);
      }

      if (second == "") {
        second = 0;
      } else {
        second = parseInt(second);
      }

      this.tmWrite(minute * 60 + second + t);
    }
  }

  countDown= (t) => {
    //game_timeが00:00かつquoter_innerがQ4以降かつscore_h != score_vの場合
    if(minute==0 && second==0 && parseInt(this.state.quoter_inner.substring(1))>=4 && this.state.score_h!=this.state.score_v){
      this.setState({is_game_end_visible: true});
      
    }
    var min = minute.toString();
    var sec = second.toString();

    if ((min == "") && (sec == "")) {
      alert("時刻を設定してください。");
      this.reSet('10', '00');
    } else {
      if (min == "") {
        min = 10;
      } else {
        min = parseInt(min);
      }

      if (sec == "") {
        sec = 0;
      } else {
        sec = parseInt(sec);
      }

      this.tmWrite(min * 60 + sec - t);
    }
  }

  btn_cnt_up_m() {
    this.cntStop();
    this.countUp(60);
    /* if (this.state.timer_restart) {
      arrTimerCnt.push(
        timer = setInterval(()=>this.countDown(1) , 1000)
      );
    } */
  }

  btn_cnt_dwn_m() {
    this.cntStop();
    this.countDown(60);
    /* if (this.state.timer_restart) {
      arrTimerCnt.push(
        timer = setInterval(()=>this.countDown(1) , 1000)
      );
    } */
  }

  btn_cnt_up_s() {
    this.cntStop();
    this.countUp(1);
    /* if (this.state.timer_restart) {
      arrTimerCnt.push(
        timer = setInterval(()=>this.countDown(1) , 1000)
      );
    } */
  }

  btn_cnt_dwn_s() {
    this.cntStop();
    this.countDown(1);
    /* if (this.state.timer_restart) {
      arrTimerCnt.push(
        timer = setInterval(()=>this.countDown(1) , 1000)
      );
    } */
  }

  btn_foul = async()=> {
    if (this.state.touch_key_h === null && this.state.touch_key_v === null && !this.state.touch_teamkey_h && !this.state.touch_teamkey_v) {
      // Player番号が選択されていない場合、処理を終了する
      this.init_process();
      // メッセージ表示
      this.setState({lbl_msg: Messages.WARN.W010});
      return;
    }
    // タイマー一時停止
    this.timer_pause();
    game_time = this.tendigit(minute).toString() + this.onedigit(minute).toString() + ":" + this.tendigit(second).toString() + this.onedigit(second).toString();

    // カテゴリ
    category_type = Constants.MAIN_TAG['FOUL'];
    var idx = null;
    // チームファウル加算
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    this.update_foul(idx, 'add');
    // 個人ファウル加算
    this.add_personalfoul(idx, target_player);
    // 個人ファウルが5回以下の場合、登録値セット
    if (foul_count_psnl <= 5) {
      // 登録値セット
      var dataRow = [game_time, player_num, Constants.PLAY_TYPE['FOUL'], '', false, 'Del'];
      // Foul登録
      this.addTagTable(idx, dataRow);
      // リクエストパラメーター設定
      this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['FOUL'], Constants.PLAY_TYPE['FOUL'], "", "");
      // Taggingテーブルへ登録
      this.add_tagging()

    }

  }

  select_lineUp(idx, key, rowData) {
    target_player = rowData;
    player_num = rowData.number;
    player_name = this.getPlayerName(idx, player_num);
    timestamp = this.getCurrentTime();
    // メッセージクリア
    this.setState({lbl_msg: ''});
    // スワイプ判定、ランニングショットクリア
    swipe_direction = "";
    running_shot = " ";
    if (idx === 'h') {
      if(this.state.touch_key_h==key){
        this.setState({touch_key_h: null});
        this.setState({touch_key_v: null});
      }else{
        this.setState({touch_key_h: key});
        this.setState({touch_key_v: null});
      }
    } else {
      if(this.state.touch_key_v==key){
        this.setState({touch_key_v: null});
        this.setState({touch_key_h: null});
      }else{
        this.setState({touch_key_v: key});
        this.setState({touch_key_h: null});
      }
    }
    this.setState({touch_teamkey_v: false});
    this.setState({touch_teamkey_h: false});

    //アシストがある場合、
    if(is_assist){
      // Playタイムを取得Pl
      game_time = this.tendigit(minute).toString() + this.onedigit(minute).toString() + ":" + this.tendigit(second).toString() + this.onedigit(second).toString();
      // 登録値セット
      var dataRow = [game_time, player_num, Constants.PLAY_TYPE["AST"], '', false, 'Del'];
      // TagテーブルへAST登録
      this.addTagTable(idx, dataRow)

      // リクエストパラメーター設定
      this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG["SHOT"], Constants.PLAY_TYPE["AST"], '', '');
      this.add_tagging().then(r => {})

      is_assist = false

      //ファウル
      if(is_foul){
        // メッセージ表示
        this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I012});
      }
      return;
    }
    if (is_foul) {
      // チームファウル加算
      this.update_foul(idx, 'add');
      // 個人ファウル加算
      this.add_personalfoul(idx, target_player);
      // 個人ファウルが5回以下の場合、登録値セット
      console.log("foul_count_psnl--:",foul_count_psnl)
      if (foul_count_psnl <= 5) {
        // 登録値セット
        var dataRow = [game_time, player_num, Constants.PLAY_TYPE["FOUL"], '', false, 'Del'];

        // foul登録
        this.addTagTable(idx,dataRow)

        // Made時の座標をコピー
        if(category_type==Constants.SUB_TAG_CATEGORY["MADE_FOUL"]){
          x_coordinate = x_coordinate_made;
          y_coordinate = y_coordinate_made;
        }else if(category_type==Constants.SUB_TAG_CATEGORY["MISS_FOUL"]) {
          x_coordinate = x_coordinate_miss;
          y_coordinate = y_coordinate_miss;
        }
        // リクエストパラメーター設定
        this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG["SHOT"], Constants.PLAY_TYPE["FOUL"], '', '');
        this.add_tagging()

        // Foulフラグを立てる
        is_foul = false;

        // 5ファウルの場合はPlayerを非活性にする
        if (foul_count_psnl == 5) {

        }
      } else {
        // 5ファウルの場合はPlayerを非活性にする
      }
      // メッセージ表示
      this.setState({lbl_msg: ''});

      return
    }
    if (is_block) {
      // 登録値セット
      var dataRow = [game_time, player_num, Constants.PLAY_TYPE["BLK"], '', false, 'Del'];

      // block登録
      this.addTagTable(idx, dataRow);
      // Miss時の座標をコピー
      x_coordinate = x_coordinate_miss;
      y_coordinate = y_coordinate_miss;
      // リクエストパラメーター設定
      this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG["SHOT"], Constants.PLAY_TYPE["BLK"], "", "");
      this.add_tagging()
      // Reboundフラグを立てる
      is_rebound = true;
      // Blockフラグをオフ
      is_block = false;
      // メッセージ表示
      this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I018});
      return
    }

    if(is_rebound){
      // リバウンド設定
      let reb_type =''
      if (pre_team_name == this.getTeamName(idx)) {
        // オフェンスリバウンド
        reb_type = Constants.PLAY_TYPE["ORB"];
      } else {
        // ディフェンスリバウンド
        reb_type = Constants.PLAY_TYPE["DRB"];
      }
      // 登録値セット
      var dataRow = [game_time, player_num, reb_type, '', false, 'Del'];

      // block登録
      this.addTagTable(idx, dataRow);
      // FT結果クリア
      result_type_1 = "", result_type_2 = "", result_type_3 = "";

      // リクエストパラメーター設定
      this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG["SHOT"], reb_type, "", "");
      this.add_tagging()

      is_rebound = false;
      // メッセージ表示
      this.setState({lbl_msg: ''});
      return
    }

    if (is_steal) {
      // 登録値セット
      var dataRow = [game_time, player_num, Constants.PLAY_TYPE["STL"], '', false, 'Del'];

      // block登録
      this.addTagTable(idx, dataRow);
      // リクエストパラメーター設定
      this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG["STL"], Constants.PLAY_TYPE["STL"], "", "");
      this.add_tagging()

      is_steal = false;
      // メッセージ表示
      this.setState({lbl_msg: ''});
      return
    }
  }

  arrow_right() {
    if (is_left) {
      // 右向き矢印
      this.setState({arrow_img: arrowRightPath});
      attack_direction = 'Right';
      is_left = false;
    } else {
      this.setState({arrow_img: arrowLeftPath});
      attack_direction = 'Left';
      is_left = true;
    }
  }

  select_lineUp_team(idx) {
    player_num = 'Team';
    target_player = 'Team';
    player_name = 'Team';
    if (idx === 'h') {
      var status = this.state.touch_teamkey_h;
      this.setState({touch_teamkey_h: !status});
      this.setState({touch_teamkey_v: false});
    } else {
      var status = this.state.touch_teamkey_v;
      this.setState({touch_teamkey_v: !status});
      this.setState({touch_teamkey_h: false});
    }
    this.setState({touch_key_h: null});
    this.setState({touch_key_v: null});
    this.setState({lbl_msg: ''});
  }

  init_process() {
    target_player = "";
    play_type = "";
    player_num = "";
    player_name = "";
    result_type_1 = "";
    result_type_2 = "";
    result_type_3 = "";
    timestamp = "";

    is_assist = false;
    is_rebound = false;
    is_block = false;
    is_foul = false;
    is_steal = false;

    x_coordinate = 0;
    y_coordinate = 0;
    x_coordinate_made = 0;
    y_coordinate_made = 0;
    x_coordinate_miss = 0;
    y_coordinate_miss = 0;

    tag_datas = [];
    datas = [];

    is_swipe = false;
    swipe_direction = "";

    input_pos = [];
    this.setState({touch_key_h: null});
    this.setState({touch_key_v: null});
    this.setState({touch_teamkey_h: null});
    this.setState({touch_teamkey_v: null});

    this.setState({lbl_msg: ''});
  }

  addTagTable(idx, dataRow) {

    console.log('dataRow:', dataRow)

    dataRow[6] = '0'+this.state.quoter_inner.substring(1) + dataRow[0].replace(":","") + this.getCurrentTime()

    if (idx == 'v') {

      var vdata = this.state.tableDataV
      vdata.push(dataRow);
      this.setState({tableDataV: vdata});

    } else {
      var hdata = this.state.tableDataH
      hdata.push(dataRow);
      this.setState({tableDataH: hdata});
    }
  }

  btn_tag_update() {

    let dataRow = [
      this.state.minute + ":" + this.state.second,
      this.state.defaultValue,
      this.state.defaultPlayValue,
      this.state.defaultResultValue,
    ]
    console.log(' btn_tag_update:', dataRow)

    this.update_tagging( dataRow).then()

    if (this.state.edit_index_v > -1) {
      var vdata = this.state.tableDataV
      vdata[this.state.edit_index_v] = [this.state.minute + ":" + this.state.second, this.state.defaultValue, this.state.defaultPlayValue, this.state.defaultResultValue, false, ''];
      this.setState({tableDataV: vdata, is_edit: false});
    } else {
      var hdata = this.state.tableDataH
      hdata[this.state.edit_index_h] = [this.state.minute + ":" + this.state.second, this.state.defaultValue, this.state.defaultPlayValue, this.state.defaultResultValue, false, ''];
      this.setState({tableDataH: hdata, is_edit: false});
    }
  }


  btn_tag_delete = async(index, hv)=> {

    if (hv == 'v') {
      //visitor
      let dataRow = this.state.tableDataV[index]
      console.log("deleteV:", index, dataRow)

      await this.delete_tagging(dataRow)

      //Visitorタグテーブルのレコードを削除する
      let vdata = this.state.tableDataV
      let filtered = vdata.filter((item, i) => {
        return i != index
      });
      console.log("deleteV filter:", filtered)
      this.setState({tableDataV: filtered});

    } else if (hv == 'h') {
      //home
      let dataRow = this.state.tableDataH[index]
      console.log("deleteH:", dataRow)

      await this.delete_tagging(dataRow)

      //Visitorタグテーブルのレコードを削除する
      let vdata = this.state.tableDataV
      let filtered = vdata.filter((item, i) => {
        return i != index
      });
      console.log("deleteV filter:", filtered)
      this.setState({tableDataV: filtered});
    }
  }

  btn_timeout(idx) {
    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // Playタイムを取得
    game_time = this.tendigit(minute).toString() + this.onedigit(minute).toString() + ":" + this.tendigit(second).toString() + this.onedigit(second).toString();

    // 前半(Q1, Q2)はタイムアウト2回
    // 後半(Q3, Q4)はタイムアウト3回
    // 延長はピリオド毎にタイムアウト1回
    if (idx == 'v') {
      // Visitor
      if (to_count_v > 0) {
        // タイムアウト表示
        to_count_v--;
        var d = this.setPath(this.onedigit(to_count_v));
        this.setState({timeout_figure_v: d});
        is_TOmax = false;
      } else {
        is_TOmax = true;
      }
    } else {
      // Home
      if (to_count_h > 0) {
        // タイムアウト表示
        to_count_h--;
        var d = this.setPath(this.onedigit(to_count_h));
        this.setState({timeout_figure_h: d});
        is_TOmax = false;
      } else {
        is_TOmax = true;
      }
    }

    if (is_TOmax) {
      ; //処理しない
    } else {
      // 登録値セット
      var dataRow = [game_time, '', Constants.PLAY_TYPE['TIMEOUT'], '', false, 'Del'];
      // TimeOut登録
      this.addTagTable(idx, dataRow);
      // リクエストパラメーター設定
      this.setReqParams(idx, "", "", Constants.MAIN_TAG['TIMEOUT'], "", "", "");
      this.add_tagging()

      // タイマー一時停止
      this.timer_pause();
    }
  }

  getSKTime() {
    // Playタイムを取得Pl
    let curPlayTime = this.tendigit(minute).toString() + this.onedigit(minute).toString() + this.tendigit(second).toString() + this.onedigit(second).toString();;

    //データ形式：ピリオド(n)+試合時間(mmss)+yyyymmddhhmmssms
    return '0'+this.state.quoter_inner.substring(1) + curPlayTime + this.getCurrentTime()
  }
  getPlayTime() {
    return this.tendigit(minute).toString() + this.onedigit(minute).toString() + ":" + this.tendigit(second).toString() + this.onedigit(second).toString();
  }
  onedigit(i) {
    return ("" + i).slice(-1);
  }

  tendigit(i) {
    var str = "0" + i;
    return str.slice(-2, str.length - 1);
  }

  hundreddigit(i) {
    var str = "00" + i;
    return str.slice(-3, str.length - 2);
  }

  padZero2dig(num) {
    var result;
    if (num < 10) {
      result = "0" + num;
    } else {
      result = "" + num;
    }
    return result;
  }

  padZero3dig(num) {
    var result;
    if (num < 10) {
      result = "00" + num;
    } else if (num < 100) {
      result = "0" + num;
    } else {
      result = "" + num;
    }
    return result;
  }

  getCurrentTime() {
    var now = new Date();
    var result = "" + now.getFullYear() + this.padZero2dig(now.getMonth() + 1)
      + this.padZero2dig(now.getDate()) + this.padZero2dig(now.getHours())
      + this.padZero2dig(now.getMinutes()) + this.padZero2dig(now.getSeconds()) + this.padZero3dig(now.getMilliseconds());
    return result;
  }

  getPlayerName(idx, player_num) {
    var result = "";
    if (player_num == "Team") {
      result = "Team"
    } else if (idx == "h") {
      for (var i = 0; i < members_h.length; i++) {
        if (player_num == members_h[i].number) {
          result = members_h[i].user;
        } else {
          ;
        }
      }
    } else if (idx == "v") {
      for (var j = 0; j < members_v.length; j++) {
        if (player_num == members_v[j].number) {
          result = members_v[j].user;
        } else {
          ;
        }
      }
    } else {
      ;
    }
    return result;
  }

  getTeamName(idx) {
    var result = "";
    if (idx == 'v') {
      result = this.state.gameList.team_name_visitor
    } else {
      result = this.state.gameList.team_name_home
    }
    return result;
  }

  getCoordinate(idx, sub_tag) {
    var result = [];
    if (x_coordinate == 0 && y_coordinate == 0) {
      result = [x_coordinate, y_coordinate];
    } else if (sub_tag == "FT") {
      result = [x_coordinate, y_coordinate]
    } else if (idx == 'h') {
      if (is_left) {
        result = [x_coordinate * (-1), (y_coordinate)]
      } else {
        result = [x_coordinate, y_coordinate]
      }
    } else {
      if (is_left) {
        result = [x_coordinate, y_coordinate]
      } else {
        result = [x_coordinate * (-1), (y_coordinate)]
      }
    }
    return result;
  }

  setReqParamsByGameInfo(){
    // 一時保存用Taggingデータ
    if (second == -1) { second = second + 1; }
    else { second = second; }
    datas = [];
    datas.push({
      "tagging_data_temp": {
        "game_time": this.getPlayTime(),
        "period": this.state.quoter_inner.substring(1),
        "score_home": this.state.score_h,
        "score_visitor": this.state.score_v,
        "teamfoul_home": foul_count_h,
        "teamfoul_visitor": foul_count_v,
        "timeout_home": to_count_h,
        "timeout_visitor": to_count_v,
        "lineup_home": this.state.starters_v,
        "lineup_visitor": this.state.starters_v,
        "substitues_home": this.state.subs_h,
        "substitues_visitor": this.state.subs_v,
        "attack_direction": attack_direction,
        // 入場時間の制御対応: ピリオド開始フラグTrueの場合は入場記録を行わない
        "is_period_start": is_period_start,
      },
    });
  }

  /**
   * リクエストパラメーターを設定する関数
   * @param {String} idx           "v" または "h"
   * @param {String} player_num    Player番号
   * @param {String} player_name   Playerの名前
   * @param {String} main_tag      メインタグ : Shot, FT, Foul, TO, Steal, END, Timeout, Change
   * @param {String} sub_tag       サブタグ : 2P, 3P, FT, Assist, Foul, Block, OFF_REB, DEF_REB, TO, Steal, OB, Violation, Refree Time, Held Ball, TimeOut, In, Out
   * @param {String} shot_result   シュート結果 : Made, Miss, 空白
   * @param {String} check_flag    "checked" または 空白
   */
  setReqParams(idx, player_num, player_name, main_tag, sub_tag, shot_result, check_flag) {
    var conv_coordinate = this.getCoordinate(idx, sub_tag)
    tag_datas.push(
      {
        team_id: (idx=='h')? this.state.team_id_home : this.state.team_id_visitor,
        team_name: (idx=='h') ? this.state.team_name_home : this.state.team_name_visitor,
        "period": this.state.quoter_inner.substring(1),
        "game_time": game_time,
        "player_num": player_num,
        "player_name": player_name,
        "main_tag": main_tag,
        "sub_tag": sub_tag,
        "shot_result": shot_result,
        "coordinate": [Math.floor(x_coordinate), Math.floor(y_coordinate)],
        "conv_coordinate": [Math.floor(conv_coordinate[0]), Math.floor(conv_coordinate[1])],
        "ft1": result_type_1,
        "ft2": result_type_2,
        "ft3": result_type_3,
        // "check_flag": check_flag,
        // "shot_type": running_shot,
      },
    );
    // 前のチーム名設定(OFF_REBかDEF_REBかを判断するため)
    pre_team_name = this.getTeamName(idx);
  }

  saveInOutTime(idx, player_num, in_out) {
    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // Playerの名前を取得
    var player_name = this.getPlayerName(idx, player_num);

    // ゲームタイムセット
    if (second < 0) {
      game_time = "00:00";
    } else {
      game_time = this.getPlayTime()
    }

    tag_datas = [];
    player_num = String(player_num)
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['CHANGE'], in_out, '', '');
    // 入退場時間の保存

    // Startボタン押下前にPlayerボタンを押下した際game_timeがブランクになるため、リセットしない
    // // 保存後、ゲームタイムは常にリセット
    // game_time = "";

    // リクエストパラメータのタグデータクリア
    tag_datas = [];
  }

  reSet(m, s) {
    // 分の数字をセットする
    // 分の数字をセットする
    // 分の数字をセットする
    var d0 = this.setPath(this.tendigit(m));
    this.setState({figure0: d0});
    var d1 = this.setPath(this.onedigit(m));
    this.setState({figure1: d1});
    // 秒の数字をセットする
    var d2 = this.setPath(this.tendigit(s));
    this.setState({figure2: d2});
    var d3 = this.setPath(this.onedigit(s));
    this.setState({figure3: d3});
    minute = m;
    second = s;
    clearInterval(timer);
  }

  tmWrite(int) {
    int = parseInt(int);
    if (int <= 0) {
      // 分数および秒数が0以下となった時、タイマーをクリアする
      this.reSet('00', '00');

      if (this.state.quoter_count > 3 && this.state.score_h != this.state.score_v) {
        // Game Endボタンの表示
        this.setState({is_game_end_visible: true});
        this.setState({is_period_end_visible: false});
      } else {
        // Period Endボタンの表示
        this.setState({is_period_end_visible: true});
        this.setState({is_game_end_visible: false});
      }
    } else {
      this.setState({is_period_end_visible: false});
      this.setState({is_game_end_visible: false});

      //残り分数はintを60で割って切り捨てる
      var min_val = Math.floor(int / 60);
      //残り秒数はintを60で割った余り
      var sec_val = int % 60;
      // 分の数字をセットする
      var d0 = this.setPath(this.tendigit(min_val));
      if(this.state.figure0!=d0) this.setState({figure0: d0});
      var d1 = this.setPath(this.onedigit(min_val));
      if(this.state.figure1!=d1) this.setState({figure1: d1});
      // 秒の数字をセットする
      var d2 = this.setPath(this.tendigit(sec_val));
      if(this.state.figure2!=d2) this.setState({figure2: d2});
      var d3 = this.setPath(this.onedigit(sec_val));
      if(this.state.figure3!=d3) this.setState({figure3: d3});
      //this.setState({figure0: d0,figure1: d1,figure2: d2,figure3: d3});
      minute = min_val;
      second = sec_val;
    }
  }

  setPath(str) {
    let result = figures0Path
    switch (str) {
      case '1':
        result = figures1Path
        break;
      case '2':
        result = figures2Path
        break;
      case '3':
        result = figures3Path
        break;
      case '4':
        result = figures4Path
        break;
      case '5':
        result = figures5Path
        break;
      case '6':
        result = figures6Path
        break;
      case '7':
        result = figures7Path
        break;
      case '8':
        result = figures8Path
        break;
      case '9':
        result = figures9Path
        break;
      case '0':
        result = figures0Path
        break;
    }
    return result;
  }

  btn_next_quater= (isOK) => {
    this.setState({periodDialogVisible: false})
    if (isOK) {
      var quoter_count = parseInt(this.state.quoter_inner.substring(1))
      if (quoter_count == 2) {
        // ピリオドがQ2でPeriod Endボタンが押下された場合、TimeOutを後半のタイムアウト回数にする
        to_count_h = TO_2ND_HALF;
        var d = this.setPath(this.onedigit(to_count_h));
        this.setState({timeout_figure_h: d});
        to_count_v = TO_2ND_HALF;
        var d_v = this.setPath(this.onedigit(to_count_v));
        this.setState({timeout_figure_v: d_v});
        // 攻撃方向
        if (is_left) {
          // 右向き矢印
          this.setState({arrow_img: arrowRightPath});
          attack_direction = 'Right';
          is_left = false;
        } else {
          this.setState({arrow_img: arrowLeftPath});
          attack_direction = 'Left';
          is_left = true;
        }
        // ファウルカウントのリセット
        foul_count_h = 0;       // ホーム
        foul_count_v = 0;       // ビジター
        var d = this.setPath(this.onedigit(foul_count_h));
        this.setState({foul_figure_h: d});
        var d_v = this.setPath(this.onedigit(foul_count_v));
        this.setState({foul_figure_v: d_v});

      } else if (quoter_count >= 4) {
        // ピリオドがQ4以降でPeriod Endボタンが押下された場合、TimeOutを延長戦のタイムアウト回数にする
        to_count_h = TO_EXTRA;
        var d = this.setPath(this.onedigit(to_count_h));
        this.setState({timeout_figure_h: d});
        to_count_v = TO_EXTRA;
        var d_v = this.setPath(this.onedigit(to_count_v));
        this.setState({timeout_figure_v: d_v});

        // 攻撃方向
        if (is_left) {
          // 右向き矢印
          this.setState({arrow_img: arrowRightPath});
          attack_direction = 'Right';
          is_left = false;
        } else {
          this.setState({arrow_img: arrowLeftPath});
          attack_direction = 'Left';
          is_left = true;
        }
        // ファウルカウントはリセットしない
        var d = this.setPath(this.onedigit(foul_count_h));
        this.setState({foul_figure_h: d});
        var d_v = this.setPath(this.onedigit(foul_count_v));
        this.setState({foul_figure_v: d_v});

      } else {
        // ファウルカウントのリセット
        foul_count_h = 0;       // ホーム
        foul_count_v = 0;       // ビジター
        var d = this.setPath(this.onedigit(foul_count_h));
        this.setState({foul_figure_h: d});
        var d_v = this.setPath(this.onedigit(foul_count_v));
        this.setState({foul_figure_v: d_v});
      }

      // ピリオド開始フラグを解除し、tagging_data_tempに保存する
      is_period_start = false;
      this.setReqParamsByGameInfo();
      // GameInfoテーブルへピリオド終了時のスコア情報を保存する
      this.put_info({})
      // 現在のピリオドの退場時間を記録する
      // Home
      var lineup_list_h = this.state.starters_h.length;
      for (var i = 0; i < lineup_list_h; i++) {
        this.saveInOutTime('h', '' + i, 'Out');
      }
      // Visitor
      var lineup_list_v = this.state.starters_v.length;
      for (var i = 0; i < lineup_list_v; i++) {
        this.saveInOutTime('v', '' + i, 'Out');
      }

      // TimeTagを登録する
      /* convertTimeTag({
        "tag_id": tag_id,
        "period": 'Q' + quoter_count,
      }).done(function (response) {
        }).fail(function (response) {
          alert(MSG.E_040)
      }); */

      // ピリオドのカウントアップ
      quoter_count = parseInt(this.state.quoter_inner.substring(1)) + 1
      period = 'Q' + quoter_count.toString();
      this.setState({quoter_inner: period})
      this.timer_clear();
      this.setReqParamsByGameInfo();
      // GameInfoテーブルへ一時データ保存する
      this.put_info({});

      // STARTボタン活性
      this.clear();
      // Play by Play、Members Assign、Back to Homeボタン活性
      /* $('[id^="btn_other_action_"]').prop("disabled", false);
      // Playerボタン活性
      $('[id^="player_"]').prop("disabled", false); */
      // テーブル初期化
      this.setState({tableDataH: []});
      this.setState({tableDataV: []});
      this.setState({is_period_end_visible: false});
    }
  }

  btn_opp_side = (isOK) => {
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    this.setState({dialogVisible: false})
    // ダイアログを開く
    if (isOK) {
      console.log("input_pos:",input_pos)
      // 2P, 3p判定
      if (input_pos.length != 0) {
        var is_2p = this.is2p(idx, input_pos);
        if (is_2p) {
          // 2PのみのShotダイアログ
          this.setState({
            is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
            is_shot2pmodal_visible: true,
            is_shot3pmodal_visible: false,
          });

        } else {
          // 3PのみのShotダイアログ
          this.setState({
            is_shot2p3pmodal_visible: true,
            is_shot3pmodal_visible: true,
          });
        }
      } else {
        // 2P+3P混在のShotダイアログ
        this.setState({
          is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
          is_shot2pmodal_visible: true,
          is_shot3pmodal_visible: true,
        });
      }
    }else{

      this.setState({
        is_shot2p3pmodal_visible: false,
        is_shot2pmodal_visible: false,
        is_shot3pmodal_visible: false,
      });
    }
  }

  hideShotModal = () => {

    // メッセージ表示
    this.setState({lbl_msg: ''});
    this.setState({
      is_shot2p3pmodal_visible: false,
      is_shot2pmodal_visible: false,
      is_shot3pmodal_visible: false,
    });
  }

  toggleShotModal = () => {

    if (!this.state.is_shot2p3pmodal_visible && player_num == '') {
      // Player番号が選択されていない場合、処理を終了する
      this.init_process();
      // メッセージ表示
      this.setState({lbl_msg: Messages.WARN.W010});
      return;
    }
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // 逆サイドからのシュートに対してポップアップを表示
    var opp_shot = false;
    if (x_coordinate != 0 && y_coordinate != 0) {
      if (idx == 'h') {
        if (is_left) {
          if (x_coordinate > 0) {
            opp_shot = true
          }
        } else {
          if (x_coordinate < 0) {
            opp_shot = true
          }
        }
      } else {
        if (is_left) {
          if (x_coordinate < 0) {
            opp_shot = true
          }
        } else {
          if (x_coordinate > 0) {
            opp_shot = true
          }
        }
      }
    }
    
    var isOK = true;
    if (opp_shot) {
      this.setState({dialogVisible: true});
      isOK = false
    }

    // ダイアログを開く
    if (isOK) {
      // 2P, 3p判定
      if (input_pos.length != 0) {
        var is_2p = this.is2p(idx, input_pos);
        if (is_2p) {
          // 2PのみのShotダイアログ
          this.setState({
            is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
            is_shot2pmodal_visible: true,
            is_shot3pmodal_visible: false,
          });

        } else {
          // 3PのみのShotダイアログ
          this.setState({
            is_shot2p3pmodal_visible: true,
            is_shot3pmodal_visible: true,
          });
        }
      } else {
        // 2P+3P混在のShotダイアログ
        this.setState({
          is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
          is_shot2pmodal_visible: true,
          is_shot3pmodal_visible: true,
        });
      }
    }else{

      this.setState({
        is_shot2p3pmodal_visible: false,
        is_shot2pmodal_visible: false,
        is_shot3pmodal_visible: false,
      });
    }

  }

  btn_made(id) {
    // Playタイム
    game_time = this.getPlayTime()

    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // カテゴリ
    category_type = Constants.TAG_CATEGORY['MADE'];
    sub_category_type = Constants.SUB_TAG_CATEGORY['MADE'];
    // 2P or 3P
    if (id == 'btn_3p_made') {
      play_type = Constants.PLAY_TYPE['3P'];
      // ランニングショットクリア
      running_shot = " ";
    } else {
      play_type = Constants.PLAY_TYPE['2P'];
    }
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // スコア加算
    this.update_score(idx, play_type, Constants.DB_CATEGORY.ADD);

    // Playタイムを取得Pl
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, play_type, Constants.SHOT_RESULT['MADE'], false, 'Del'];
    
    // TagテーブルへMade登録
    this.addTagTable(idx, dataRow);

    // ランニングショットの判定
    this.isRunningShot(is_swipe);

    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['SHOT'], play_type, Constants.SHOT_RESULT['MADE'], '');
    // 座標クリア
    x_coordinate = 0, y_coordinate = 0;
    // 入力フォーム非活性
    //disabled_input();
    // Assistフラグを立てる
    is_assist = true;


    // メッセージ表示
    this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I010});
    // 選択済みのPlayerボタンを非活性
    //$(target_player).prop("disabled", true);
    // ダイアログを閉じる
    this.setState({
      is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
    });

  }

  isRunningShot(is_swipe) {
    if (is_swipe) {
      running_shot = 'running_shot';
    } else {
      running_shot = '';
    }
    return running_shot;
  }

  btn_made_foul(id) {
    // タイマー一時停止
    this.timer_pause();
    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // カテゴリ
    category_type = Constants.TAG_CATEGORY['MADE'];
    sub_category_type = Constants.SUB_TAG_CATEGORY['MADE_FOUL'];
    // 2P or 3P
    if (id == 'btn_3p_made-foul') {
      play_type = Constants.PLAY_TYPE['3P'];
      // ランニングショットクリア
      running_shot = " ";
    } else {
      play_type = Constants.PLAY_TYPE['2P'];
    }

    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }

    // スコア加算
    this.update_score(idx, play_type, Constants.DB_CATEGORY.ADD);

    // Playタイムを取得Pl
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, play_type, Constants.SHOT_RESULT['MADE'], true, 'Del'];
    // Made登録
    this.addTagTable(idx, dataRow);

    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['SHOT'], play_type, Constants.SHOT_RESULT['MADE'], '');
    // Foul時の座標にコピーするため、Made時の座標を控える
    x_coordinate_made = x_coordinate;
    y_coordinate_made = y_coordinate;
    // 座標クリア
    x_coordinate = 0, y_coordinate = 0;

    // Assistフラグを立てる
    is_assist = true;
    is_foul = true;
    // メッセージ表示
    this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I010});
    // ダイアログを閉じる
    this.setState({
      is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
    });
  }

  btn_miss(id) {
    // カテゴリ
    category_type = Constants.TAG_CATEGORY['MISS'];
    sub_category_type = Constants.SUB_TAG_CATEGORY['MISS'];
    // 2P or 3P
    if (id == 'btn_3p_miss') {
      play_type = Constants.PLAY_TYPE['3P'];
      // ランニングショットクリア
      running_shot = " ";
    } else {
      play_type = Constants.PLAY_TYPE['2P'];
    }
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }

    // Playタイムを取得Pl
    game_time = this.getPlayTime()

    var dataRow = [game_time, player_num, play_type, Constants.SHOT_RESULT['MISS'], false, 'Del'];

    // Miss登録
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['SHOT'], play_type, Constants.SHOT_RESULT['MISS'], '');
    this.add_tagging()

    // 座標クリア
    x_coordinate = 0, y_coordinate = 0;
    // 入力フォーム非活性
    //disabled_input();
    // Reboundフラグを立てる
    is_rebound = true;
    // メッセージ表示
    this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I011});
    // ダイアログを閉じる
    this.setState({
      is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
    });
  }

  btn_miss_foul(id) {
    // タイマー一時停止
    this.timer_pause();
    // カテゴリ
    category_type = Constants.TAG_CATEGORY['MISS'];
    sub_category_type = Constants.SUB_TAG_CATEGORY['MISS_FOUL'];
    // 2P or 3P
    if (id == 'btn_3p_miss-foul') {
      play_type = Constants.PLAY_TYPE['3P'];
      // ランニングショットクリア
      running_shot = " ";
    } else {
      play_type = Constants.PLAY_TYPE['2P'];
    }
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // Playタイムを取得Pl
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, play_type, Constants.SHOT_RESULT['MISS'], false, 'Del'];

    // Miss登録
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['SHOT'], play_type, Constants.SHOT_RESULT['MISS'], '');
    this.add_tagging()

    // Foul時の座標にコピーするため、Miss時の座標を控える
    x_coordinate_miss = x_coordinate;
    y_coordinate_miss = y_coordinate;
    // 座標クリア
    x_coordinate = 0, y_coordinate = 0;
    // 入力フォーム非活性
    //disabled_input();
    // Foulフラグを立てる
    is_foul = true;
    // メッセージ表示
    this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I012});
    // ダイアログを閉じる
    this.setState({
      is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
    });
  }

  btn_miss_block(id) {
    // カテゴリ
    category_type = Constants.TAG_CATEGORY['MISS'];
    sub_category_type = Constants.SUB_TAG_CATEGORY['MISS_BLOCK'];
    // 2P or 3P
    if (id == 'btn_3p_miss-block') {
      play_type = Constants.PLAY_TYPE['3P'];
      // ランニングショットクリア
      running_shot = " ";
    } else {
      play_type = Constants.PLAY_TYPE['2P'];
    }

    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // Playタイムを取得Pl
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, play_type, Constants.SHOT_RESULT['MISS'], false, 'Del'];

    // Miss_block登録
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['SHOT'], play_type, Constants.SHOT_RESULT['MISS'], '');
    this.add_tagging()

    // Block時の座標にコピーするため、Miss時の座標を控える
    x_coordinate_miss = x_coordinate;
    y_coordinate_miss = y_coordinate;
    // 座標クリア
    x_coordinate = 0, y_coordinate = 0;
    // 入力フォーム非活性
    //disabled_input();
    // Blockフラグを立てる
    is_block = true;
    // メッセージ表示
    this.setState({lbl_msg: Messages.INFO.I009 + Messages.INFO.I013});
    // ダイアログを閉じる
    this.setState({
      is_shot2p3pmodal_visible: !this.state.is_shot2p3pmodal_visible,
    });
  }

  toggleTOModal = () => {

    if (!this.state.is_tomodal_visible && player_num == '') {
      // Player番号が選択されていない場合、処理を終了する
      this.init_process();
      // メッセージ表示
      this.setState({lbl_msg: Messages.WARN.W010});
      return;
    }
    this.setState({
      is_tomodal_visible: !this.state.is_tomodal_visible,
    });
  }

  toggleEditModal = () => {
    console.log(" is_edit:", this.state.is_edit)
    console.log(" edit_index_v:", this.state.edit_index_v)

    if (this.state.edit_index_h < 0 && this.state.edit_index_v < 0) {
      // タグ履歴テーブルのレコードを選択されていない場合、処理を終了する
      this.init_process();
      // メッセージ表示
      this.setState({lbl_msg: Messages.WARN.W010});
      return;
    }
    this.setState({
      is_edit: !this.state.is_edit,
    });
  }

  toggleFTModal = () => {
    if (!this.state.is_ftmodal_visible && player_num == '') {
      // Player番号が選択されていない場合、処理を終了する
      this.init_process();
      // メッセージ表示
      this.setState({lbl_msg: Messages.WARN.W010});
      return;
    }
    this.setState({
      is_ftmodal_visible: !this.state.is_ftmodal_visible,
    });
  }
  toggleEndModal= () => {

    this.setState({
      is_end_visible: !this.state.is_end_visible,
    });
  }
  btn_periodend(){
    this.setState({
      periodDialogVisible: !this.state.periodDialogVisible,
    });

  }
  btn_end_ok(){

    this.setState({
      is_end_visible: !this.state.is_end_visible,
      is_thanks_visible: !this.state.is_thanks_visible,
    });
    setTimeout(()=>{
      this.setState({
        is_thanks_visible: !this.state.is_thanks_visible,
      });
      const {onBackdropPress} = this.props;
      onBackdropPress();
    }, 2000);

  }
  btn_end_cancel(){

    this.setState({
      is_end_visible: !this.state.is_end_visible,
    });
  }
  is2p(idx, input_pos) {

    // ゴール下からフリースローラインまでの距離
    //28m x 15m
    //6.75m <- 3p shot
    const distance_base = 6.75*meterSize; //185 114以内は2ポイントエリア内と定義する

    // ゴール下の座標
    var goal_pos = [
      {x: yardWidth/2-1.575*meterSize, y: 0}
    ];
    // 長方形エリア 座標
    var rectangle = [
      {x: {start_pos: yardWidth/2-5.79*meterSize, end_pos: yardWidth/2}}, // X座標：始点 終点
      {y: {start_pos: -2.4*meterSize, end_pos: 2.4*meterSize}}, // Y座標：始点 終点
    ];
    // コーナーエリア上 座標
    var cornerTop = [
      {x: {start_pos: yardWidth/2-3*meterSize, end_pos: yardWidth/2}}, // X座標：始点 終点
      {y: {start_pos: -yardHeight/2, end_pos: -yardHeight/2+0.9*meterSize}}, // Y座標：始点 終点
    ];
    // コーナーエリア下 座標 (左)
    var cornerBottom = [
      {x: {start_pos: yardWidth/2-3*meterSize, end_pos: yardWidth/2}}, // X座標：始点 終点
      {y: {start_pos: yardHeight/2-0.9*meterSize, end_pos: yardHeight/2}}, // Y座標：始点 終点
    ];

    var temp_value;

    // 攻撃方向：左
    if (is_left) {
      if (idx == 'v') {
        // 座標そのまま
      } else {
        // X座標を左右反転
        goal_pos[0]['x'] = goal_pos[0]['x'] * (-1);

        temp_value = rectangle[0]['x']['start_pos'] * (-1);
        rectangle[0]['x']['start_pos'] = rectangle[0]['x']['end_pos'] * (-1);
        rectangle[0]['x']['end_pos'] = temp_value;

        temp_value = cornerTop[0]['x']['start_pos'] * (-1);
        cornerTop[0]['x']['start_pos'] = cornerTop[0]['x']['end_pos'] * (-1);
        cornerTop[0]['x']['end_pos'] = temp_value;

        temp_value = cornerBottom[0]['x']['start_pos'] * (-1);
        cornerBottom[0]['x']['start_pos'] = cornerBottom[0]['x']['end_pos'] * (-1);
        cornerBottom[0]['x']['end_pos'] = temp_value;
      }
    }
    // 攻撃方向：右
    else {
      if (idx == 'v') {
        // X座標を左右反転
        goal_pos[0]['x'] = goal_pos[0]['x'] * (-1);

        temp_value = rectangle[0]['x']['start_pos'] * (-1);
        rectangle[0]['x']['start_pos'] = rectangle[0]['x']['end_pos'] * (-1);
        rectangle[0]['x']['end_pos'] = temp_value;

        temp_value = cornerTop[0]['x']['start_pos'] * (-1);
        cornerTop[0]['x']['start_pos'] = cornerTop[0]['x']['end_pos'] * (-1);
        cornerTop[0]['x']['end_pos'] = temp_value;

        temp_value = cornerBottom[0]['x']['start_pos'] * (-1);
        cornerBottom[0]['x']['start_pos'] = cornerBottom[0]['x']['end_pos'] * (-1);
        cornerBottom[0]['x']['end_pos'] = temp_value;
      } else {
        // 座標そのまま
      }
    }

    // ２点間の距離を求める
    // 公式：√(x1−x2)^2 + (y1−y2)^2
    var distance = Math.sqrt(
      Math.pow((goal_pos[0]['x'] - input_pos[0]['x']), 2) +
      Math.pow((goal_pos[0]['y'] - input_pos[0]['y']), 2));

    // 長方形エリア 判定
    if (input_pos[0]['x'] >= rectangle[0]['x']['start_pos'] &&
      input_pos[0]['x'] <= rectangle[0]['x']['end_pos'] &&
      input_pos[0]['y'] >= rectangle[1]['y']['start_pos'] &&
      input_pos[0]['y'] <= rectangle[1]['y']['end_pos']) {
      return true;
    } else {
      // コーナーエリア上 判定
      if (input_pos[0]['x'] >= cornerTop[0]['x']['start_pos'] &&
        input_pos[0]['x'] <= cornerTop[0]['x']['end_pos'] &&
        input_pos[0]['y'] > cornerTop[1]['y']['start_pos'] &&
        input_pos[0]['y'] <= cornerTop[1]['y']['end_pos']) {
        return false;
      }
      // コーナーエリア下 判定
      else if (input_pos[0]['x'] >= cornerBottom[0]['x']['start_pos'] &&
        input_pos[0]['x'] <= cornerBottom[0]['x']['end_pos'] &&
        input_pos[0]['y'] >= cornerBottom[1]['y']['start_pos'] &&
        input_pos[0]['y'] < cornerBottom[1]['y']['end_pos']) {
        return false;
      }
      // 半円形エリア 判定
      else if (distance <= distance_base) {
        return true;
      }
      // 上記以外
      else {
        return false;
      }
    }
  }

  timer_pause() {
    // 一時停止
    // clearInterval(timer);
    this.cntStop();
    // 再開ボタン、停止ボタン活性
    // 一時停止ボタン、STARTボタン非活性

    this.setState({timer_restart: false});
    this.setState({timer_clear: false});
    this.setState({timer_start: true});
    this.setState({timer_pause: true});
    //this.setState({cancel_disable:true})
    
  }

  cntStop() {
    if (arrTimerCnt.length > 0) {
      clearInterval(arrTimerCnt.shift());
    }
  }

  clear() {
    // 停止
    // clearInterval(timer);
    this.reSet('10', '00');
    this.cntStop();
    // Input要素を全て無効化
    //$(":input").prop("disabled", true);
    // STARTボタン活性
    this.setState({timer_start: false});
    this.setState({timer_restart: true});
    this.setState({timer_clear: true});
    this.setState({timer_pause: true});
    //this.setState({cancel_disable:true})
    // Playerボタン活性
    //$('[id^="player_"]').prop("disabled", false);
    // Play by Play、Members Assign、Back to Homeボタン活性
    //$('[id^="btn_other_action_"]').prop("disabled", false);
  }

  timer_clear() {
    // 停止
    this.clear();
    // タイマーの初期値:10:00
    minute = 10;
    second = 0;
    // 分の数字をセットする
    var d0 = this.setPath(this.tendigit(minute));
    this.setState({figure0: d0});
    var d1 = this.setPath(this.onedigit(minute));
    this.setState({figure1: d1});
    // 秒の数字をセットする
    var d2 = this.setPath(this.tendigit(second));
    this.setState({figure2: d2});
    var d3 = this.setPath(this.onedigit(second));
    this.setState({figure3: d3});
    // Tagテーブルクリア
    //tagTableVisitor.clear().draw();
    //tagTableHome.clear().draw();
  }

  restart() {
    // 再開
    arrTimerCnt.push(
      timer = setInterval(()=>this.countDown(1) , 1000)
    );
    // 一時停止ボタン活性
    this.setState({timer_pause: false});
    this.setState({cancel_disable:false})
    // 再開ボタン、停止ボタン非活性
    this.setState({timer_restart: true});
    this.setState({timer_clear: true});

    this.setState({btn_cnt_up_m: true});
    this.setState({btn_cnt_up_s: true});
    this.setState({btn_cnt_dwn_m: true});
    this.setState({btn_cnt_dwn_s: true});
  }

  btn_cancel() {
    if (target_player) {
      //stopBlink($(target_player));
      //blinkTimer = null;
    }
    //設定値のリセット
    this.setState({defaultValue:'',defaultPlayValue:'',defaultResultValue:''})

    //sub_category_type == Constants.SUB_TAG_CATEGORY["MADE_FOUL"]
    if (is_assist) {
      // サブカテゴリが"Made_Foul"かつAssistフラグが立っている場合は、
      // Foul登録に遷移させるため、Foulフラグを立てる
      is_foul = true;
      is_assist = false;
      // メッセージ表示
      this.setState({lbl_msg: Messages.INFO.I014 + Messages.INFO.I012});
    } else if (is_block) {
      // カテゴリが"Miss"かつBlockフラグが立っている場合は、
      // Rebound登録に遷移させるため、Reboundフラグを立てる
      is_rebound = true;
      is_block = false;
      // メッセージ表示
      this.setState({lbl_msg: Messages.INFO.I015 + Messages.INFO.I011});
    } else {
      is_foul = false;
      is_rebound = false;
      this.setState({lbl_msg: ''});
      if (tag_datas.length != 0) {

        // データがある場合、キャンセルした時点でのタグ情報を登録する
        this.add_tagging().then(r => {})
      }
    }
  }

  btn_end() {
    // メッセージクリア
    this.setState({lbl_msg: ''});

    // タイマー一時停止
    this.timer_pause();
    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();

    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }

    // Playタイム
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, Constants.MAIN_TAG['END'], '', true, 'Del'];

    // Violation登録
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, '', '', Constants.MAIN_TAG['END'], Constants.MAIN_TAG['END'], '', '');
    // Taggingテーブルへ登録
    this.add_tagging().then(r => {})

  }

  btn_to_ob() {
    // タイマー一時停止
    this.timer_pause();
    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // Playタイム
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, Constants.PLAY_TYPE['TO_OB'], '', true, 'Del'];

    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // OB登録
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['TO'], Constants.PLAY_TYPE['OB'], '', '');
    // Taggingテーブルへ登録
    this.add_tagging()

    // ダイアログを閉じる
    this.setState({is_tomodal_visible: false});
  }

  btn_to_foul() {
    // タイマー一時停止
    this.timer_pause();
    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // Playタイム
    game_time = this.getPlayTime()

    // チームファウル加算
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    this.update_foul(idx, 'add');
    // 個人ファウル加算
    this.add_personalfoul(idx, target_player);
    // 個人ファウルが5回未満の場合、登録値セット
    if (foul_count_psnl <= 5) {
      // 登録値セット
      var dataRow = [game_time, player_num, Constants.PLAY_TYPE['TO_FOUL'], '', true, 'Del'];
      // Foul登録
      this.addTagTable(idx, dataRow);
      // リクエストパラメーター設定
      this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['TO'], Constants.PLAY_TYPE['FOUL'], '', '');
      // Taggingテーブルへ登録
      this.add_tagging()
    }

    // ダイアログを閉じる
    this.setState({ is_tomodal_visible: false });
  }

  table_cell_tap(cellData, index, idx) {
    if (idx == 'v') {
      this.setState({
        edit_index_v: index,
        edit_index_h: -1,
        selectlist: memberslist_v,
        edit_disable: false
      });
    } else {
      this.setState({
        edit_index_h: index,
        edit_index_v: -1,
        selectlist: memberslist_h,
        edit_disable: false
      });
    }
    this.setState({minute: cellData[0].substring(0, 2), second: cellData[0].substring(3, 5), defaultValue: cellData[1], defaultPlayValue: cellData[2], defaultResultValue: cellData[3]});
    this.setPlaylist(cellData);
    this.setResult(cellData);
  }

  setResult(cellData) {
    var resultList = [];
    var selected_play = cellData[2];
    // 選択中のPLAY_TYPEに応じてセレクトボックスに設定する値を制御
    if (selected_play == Constants.PLAY_TYPE['2P'] || selected_play == Constants.PLAY_TYPE['3P'] ||
      selected_play.indexOf(Constants.PLAY_TYPE['FT']) == 0) {
      resultList = [
        {value: "1", label: Constants.SHOT_RESULT['MADE']},
        {value: "2", label: Constants.SHOT_RESULT['MISS']},
      ];
      this.setState({resultList: resultList, is_result_disable: false});
    }
    // 上記以外
    else {
      this.setState({resultList: [], is_result_disable: true});
    }
  }

  btn_to_vio() {
    // タイマー一時停止
    this.timer_pause();

    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // Playタイム
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, Constants.PLAY_TYPE['TO_VIO'], '', false, 'Del'];
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    // Violation登録
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['TO'], Constants.PLAY_TYPE['VIO'], '', '');

    //Taggingテーブルへ登録
    this.add_tagging()


    // ダイアログを閉じる
    this.setState({ is_tomodal_visible: false });
  }

  btn_to_steal() {

    // 登録時のタイムスタンプ取得
    timestamp = this.getCurrentTime();
    // Playタイム
    game_time = this.getPlayTime()

    // 登録値セット
    var dataRow = [game_time, player_num, Constants.PLAY_TYPE['TO_STL'], '', false, 'Del'];
    // Steal登録
    var idx = null;
    if (this.state.touch_key_h !== null || this.state.touch_teamkey_h) {
      idx = 'h';
    } else {
      idx = 'v';
    }
    this.addTagTable(idx, dataRow);
    // リクエストパラメーター設定
    this.setReqParams(idx, player_num, player_name, Constants.MAIN_TAG['TO'], Constants.PLAY_TYPE['STL'], "", "");
    //Taggingテーブルへ登録
    this.add_tagging()
    // 座標クリア
    x_coordinate = 0, y_coordinate = 0;

    // Stealフラグを立てる
    is_steal = true;
    // メッセージ表示
    this.setState({lbl_msg: Messages.INFO.I016 + Messages.INFO.I017});
    // 選択済みのPlayerボタンを非活性
    this.setState({touch_key_h: null});
    this.setState({touch_key_v: null});
    this.setState({touch_teamkey_h: null});
    this.setState({touch_teamkey_v: null});
    // ダイアログを閉じる
    this.setState({ is_tomodal_visible: false });
  }

  timer_restart() {
    if (minute != 0 || second != 0) {
      // 再開
      this.restart();
    }
  }

  timer_start() {
    // 入力フォーム有効化
    // 編集ボタン非活性
    this.setState({edit_disable: false});
    this.setState({cancel_disable:false})

    // STARTボタン、再開ボタン、停止ボタン非活性
    this.setState({timer_restart: true});
    this.setState({timer_clear: true});
    this.setState({timer_start: true});
    this.setState({timer_pause: false});
    this.setState({btn_cnt_up_m: false});
    this.setState({btn_cnt_up_s: false});
    this.setState({btn_cnt_dwn_m: false});
    this.setState({btn_cnt_dwn_s: false});
    // 分の数字をセットする
    var d0 = this.setPath(this.tendigit(minute));
    this.setState({figure0: d0});
    var d1 = this.setPath(this.onedigit(minute));
    this.setState({figure1: d1});
    // 秒の数字をセットする
    var d2 = this.setPath(this.tendigit(second));
    this.setState({figure2: d2});
    var d3 = this.setPath(this.onedigit(second));
    this.setState({figure3: d3});

    if (!is_period_start) {
      // 次のピリオドの入場時間を記録する
      // ただし、ピリオド開始フラグがTrueの場合は記録しない
      // Home
      var lineup_list_h = 4;
      for (var i = 0; i < lineup_list_h; i++) {
        this.saveInOutTime('h', '' + i, 'In');
      }
      // Visitor
      var lineup_list_v = 4;
      for (var i = 0; i < lineup_list_v; i++) {
        this.saveInOutTime('v', '' + i, 'In');
      }

      // ピリオド開始フラグを立て、tagging_data_tempに保存する
      is_period_start = true;

    }

    // Q1かつSTARTボタンを押下した際、GameInfoテーブルへ一時保存を行う
    // 他ピリオドに関してもGameInfoへ一時保存を行うよう修正
    // if (quoter_count == 1) {
    //setReqParamsByGameInfo();

    // GameInfoテーブルへ一時データ保存する
    this.put_info().then(r => {})

    // タイマー実行
    // setTimeout(clock)
    // timer = setInterval(clock, 1000);
    arrTimerCnt.push(
      timer = setInterval(()=>this.countDown(1) , 1000)
    );
  }

  onReceiveDragDrop(event,item,idx){
    console.log('item ::', item);
    console.log('idx::', idx);

    if (event.dragged.payload.number == item.number) return;
    if (event.dragged.payload.team != idx) return;
    delete event.dragged.payload.team
    console.log('payload ::', event.dragged.payload);
    if(idx =='v'){
      let starters_v = this.state.starters_v.map((player, i) => {
        if (player.number == item.number) {
          return event.dragged.payload;
        }
        if (player.number == event.dragged.payload.number) {
          return item;
        }
        return player;
      });

      let subs_v = this.state.subs_v.map((player, i) => {
        if (player.number == item.number) {
          return event.dragged.payload;
        }
        if (player.number == event.dragged.payload.number) {
          return item;
        }
        return player;
      });

      this.setState({starters_v: starters_v, subs_v: subs_v});
    }else{

      let starters_h = this.state.starters_h.map((player, i) => {
        if (player.number == item.number) {
          return event.dragged.payload;
        }
        if (player.number == event.dragged.payload.number) {
          return item;
        }
        return player;
      });

      let subs_h = this.state.subs_h.map((player, i) => {
        if (player.number == item.number) {
          return event.dragged.payload;
        }
        if (player.number == event.dragged.payload.number) {
          return item;
        }
        return player;
      });

      this.setState({starters_h: starters_h, subs_h: subs_h});
    }
  }

  /*--------------------------------------------------------------------------
   * レンダーメソッド
   *------------------------------------------------------------------------*/
  render() {
    const {
      quoter_inner,
      figure0,
      figure1,
      figure2,
      figure3,
      timer_start,
      timer_restart,
      timer_clear,
      timer_pause,
      timeout_figure_h,
      timeout_figure_v,
      score_figure_h0,
      score_figure_v0,
      score_figure_h1,
      score_figure_v1,
      score_figure_h2,
      score_figure_v2,
      foul_figure_h,
      foul_figure_v,
      team_name_home,
      team_name_visitor,
      touch_key_h,
      touch_key_v,
      touch_teamkey_h,
      touch_teamkey_v,
      foul_team_count_h,
      foul_team_count_v,
      btn_cnt_up_m,
      btn_cnt_up_s,
      btn_cnt_dwn_m,
      btn_cnt_dwn_s,
      arrow_img
    } = this.state;

    const delete_button_element = (data, index, cellIndex, hv) => (

      <LiveTaggingButton onPress={() => this.btn_tag_delete(index, hv)} text={"Del"} type={4} width={4} height={3}></LiveTaggingButton>

      // <TouchableOpacity style={[styles.button, styles.formElement, LiveTaggingStyles.table_btn]} onPress={() => this._alertIndex(index)}>
      //     <Text style={LiveTaggingStyles.btn_text}>Del</Text>
      // </TouchableOpacity>
    );

    const check_element = (data, index, cellIndex, hv) => {
      return (
        <CheckBox style={LiveTaggingStyles.table_check} onPress={() => this._updateCheckbox(index, hv)}
                  id={`id_${index}`}
                  center
                  title=''
                  checkedColor='black'
                  checked={data}
        />
      )
    };

    return (
      <DraxProvider>
          <View
            onLayout={this._onLayout.bind(this)}
            style={[{width: this.state.width, height: this.state.height}, styles.container, LiveTaggingStyles.container]}>

            {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
            <Spinner
              visible={this.state.isLoadingVisible}
              textContent={Messages.INFO.I003}
              textStyle={styles.labelText}
              overlayColor={'#rgba(0, 0, 0, 0.3)'}
            />

            {/* ボタン、アイコン */}
            <View style={[styles.row, LiveTaggingStyles.contents_a]}>
              <LinearGradient colors={[this.state.teamcolor_visitor, this.state.teamcolor_visitor, this.state.teamcolor_visitor]} style={[LiveTaggingStyles.area_text, LiveTaggingStyles.away_color]} locations={[0.49, 0.5, 1]}>
                <Text style={[LiveTaggingStyles.team_title, {transform: [{rotate: "-90deg"}]}]}>AWAY</Text>
              </LinearGradient>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.view_area]}>
                <View style={[LiveTaggingStyles.view_area_a]}>
                  <View style={[LiveTaggingStyles.away_color_bottom, {borderColor: this.state.teamcolor_visitor}]}>
                    <Text style={[LiveTaggingStyles.text_view_size,{fontSize: Math.min(16,120/(1+team_name_visitor.length))}]}>{team_name_visitor}</Text>
                  </View>
                </View>
                <View paddingVertical={'1.0%'}/>
                <View style={[LiveTaggingStyles.view_area_b]}>
                  <View style={[LiveTaggingStyles.vertical_columns, LiveTaggingStyles.vertical_columns_bg]}>
                    <Text style={LiveTaggingStyles.text_head}>Fouls</Text>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={foul_figure_v}/>
                  </View>
                  <View paddingHorizontal={'2.5%'}/>
                  <View style={[LiveTaggingStyles.vertical_columns, LiveTaggingStyles.vertical_columns_bg]}>
                    <Text style={LiveTaggingStyles.text_head}>Time Out</Text>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={timeout_figure_v}/>
                  </View>
                </View>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.view_area2]}>
                <View style={[LiveTaggingStyles.view_area_b, LiveTaggingStyles.vertical_columns_bg,{justifyContent: 'center'}]}>
                  {
                    (this.state.score_figure_v0_visible) ?
                      (
                        <View style={[LiveTaggingStyles.vertical_columns_score]}>
                          <Image
                            style={[LiveTaggingStyles.figure_img]}
                            source={score_figure_v0}/>
                        </View>
                      ) : null
                  }
                  {
                    (this.state.score_figure_v1_visible) ?
                      (
                        <View style={[LiveTaggingStyles.vertical_columns_score]}>
                          <Image
                            style={[LiveTaggingStyles.figure_img]}
                            source={score_figure_v1}/>
                        </View>
                      ) : null
                  }
                  {
                    (this.state.score_figure_v2_visible) ?
                      (
                        <View style={[LiveTaggingStyles.vertical_columns_score]}>
                          <Image
                            style={[LiveTaggingStyles.figure_img]}
                            source={score_figure_v2}/>
                        </View>
                      ) : null
                  }
                </View>
                <View paddingVertical={'1.0%'}/>
                <View style={[LiveTaggingStyles.view_area_a, LiveTaggingStyles.view_area_timeout]}>
                  <LiveTaggingButton onPress={() => this.btn_timeout("v")} text={"Time Out"} type={3} width={9}></LiveTaggingButton>
                  {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.btn_timeout("v")}>*/}
                  {/*  <Text style={{color:"#fff",fontSize:20}}>Time Out</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.highlows_area]}>
                <TouchableOpacity style={[LiveTaggingStyles.view_area_bg]} onPress={() => this.btn_cnt_up_m()} disabled={btn_cnt_up_m}>
                  <Icon size={40} style={[LiveTaggingStyles.button_highlow]} name='sort-up'/>
                </TouchableOpacity>
                <TouchableOpacity style={[LiveTaggingStyles.view_area_bg1]} onPress={() => this.btn_cnt_dwn_m()} disabled={btn_cnt_dwn_m}>
                  <Icon size={40} style={[LiveTaggingStyles.button_highlow]} name='sort-down'/>
                </TouchableOpacity>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[styles.column, LiveTaggingStyles.view_area]}>
                <View style={[LiveTaggingStyles.view_area_a]}>
                  <Text style={LiveTaggingStyles.text_view_size}>{quoter_inner}</Text>
                </View>
                <View style={[styles.column, LiveTaggingStyles.view_area_attack]}>
                  <TouchableOpacity activeOpacity={1.0} onPress={() => this.arrow_right()}>
                    <ImageBackground
                      imageStyle={{resizeMode: 'contain'}}
                      style={{flex: 1}}
                      source={arrow_img}>
                    </ImageBackground>
                    <Text style={{fontSize: 10, color: 'white'}}>Attack Direction</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.view_area]}>
                <View style={[LiveTaggingStyles.view_area_b, LiveTaggingStyles.vertical_columns_bg]}>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={figure0}/>
                  </View>
                  <View paddingHorizontal={'2.5%'}/>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={figure1}/>
                  </View>
                  <View paddingHorizontal={'2.5%'}/>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={figuresCoronPath}/>
                  </View>
                  <View paddingHorizontal={'2.5%'}/>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={figure2}/>
                  </View>
                  <View paddingHorizontal={'2.5%'}/>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={figure3}/>
                  </View>
                </View>
                <View paddingVertical={'1.0%'}/>
                <View style={[LiveTaggingStyles.view_area_b,{flexDirection:'column'}]}>
                  <View style={[LiveTaggingStyles.view_area_b]}>
                    <TouchableOpacity style={[LiveTaggingStyles.vertical_columns,(timer_start)?{opacity:0.2}: {opacity:1}]} onPress={() => this.timer_start()} disabled={timer_start}>
                      <Icon style={[styles.icon, LiveTaggingStyles.icon_play_stop]} name='play'/>
                    </TouchableOpacity>
                    <View paddingHorizontal={'2.5%'}/>
                    <View style={[LiveTaggingStyles.vertical_columns]}>
                      <TouchableOpacity style={[LiveTaggingStyles.vertical_columns,(timer_restart)?{opacity:0.2}: {opacity:1}]} onPress={() => this.timer_restart()} disabled={timer_restart}>
                        <Icon style={[styles.icon, LiveTaggingStyles.icon_play_stop]} name='play-circle'/>
                      </TouchableOpacity>
                    </View>
                    <View paddingHorizontal={'2.5%'}/>
                    <TouchableOpacity style={[LiveTaggingStyles.vertical_columns,(timer_pause)?{opacity:0.2}: {opacity:1}]} onPress={() => this.timer_pause()} disabled={timer_pause}>
                      <Icon style={[styles.icon, LiveTaggingStyles.icon_play_stop]} name='pause'/>
                    </TouchableOpacity>
                    <View paddingHorizontal={'2.5%'}/>
                    <TouchableOpacity style={[LiveTaggingStyles.vertical_columns,(timer_clear)?{opacity:0.2}: {opacity:1}]} onPress={() => this.timer_clear()} disabled={timer_clear}>
                      <Icon style={[styles.icon, LiveTaggingStyles.icon_play_stop]} name='stop'/>
                    </TouchableOpacity>
                  </View>
                  {
                  (this.state.is_period_end_visible) ?
                    (<View style={[LiveTaggingStyles.view_area_b,{flexDirection:'column',alignItems:'center'}]}>
                      <LiveTaggingButton onPress={() => this.btn_periodend()} text={"Period End"} type={3} width={9}></LiveTaggingButton>
                    </View>
                    ) : null
                  }
                  {
                  (this.state.is_game_end_visible) ?
                    (<View style={[LiveTaggingStyles.view_area_b,{flexDirection:'column',alignItems:'center'}]}>
                      <LiveTaggingButton onPress={() => this.toggleEndModal()} text={"Game End"} type={3} width={9}></LiveTaggingButton>
                    </View>
                    ) : null
                  }
                </View>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.highlows_area]}>
                <TouchableOpacity style={[LiveTaggingStyles.view_area_bg]} onPress={() => this.btn_cnt_up_s()} disabled={btn_cnt_up_s}>
                  <Icon size={40} style={[LiveTaggingStyles.button_highlow]} name='sort-up'/>
                </TouchableOpacity>
                <TouchableOpacity style={[LiveTaggingStyles.view_area_bg1]} onPress={() => this.btn_cnt_dwn_s()} disabled={btn_cnt_dwn_s}>
                  <Icon size={40} style={[LiveTaggingStyles.button_highlow]} name='sort-down'/>
                </TouchableOpacity>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.view_area2]}>
                <View style={[LiveTaggingStyles.view_area_b, LiveTaggingStyles.vertical_columns_bg,{justifyContent: 'center'}]}>
                  {
                    (this.state.score_figure_h0_visible) ?
                      (
                        <View style={[LiveTaggingStyles.vertical_columns_score]}>
                          <Image
                            style={[LiveTaggingStyles.figure_img]}
                            source={score_figure_h0}/>
                        </View>
                      ) : null
                  }
                  {
                    (this.state.score_figure_h1_visible) ?
                      (
                        <View style={[LiveTaggingStyles.vertical_columns_score]}>
                          <Image
                            style={[LiveTaggingStyles.figure_img]}
                            source={score_figure_h1}/>
                        </View>
                      ) : null
                  }
                  {
                    (this.state.score_figure_h2_visible) ?
                      (
                        <View style={[LiveTaggingStyles.vertical_columns_score]}>
                          <Image
                            style={[LiveTaggingStyles.figure_img]}
                            source={score_figure_h2}/>
                        </View>
                      ) : null
                  }
                </View>
                <View paddingVertical={'1.0%'}/>
                <View style={[LiveTaggingStyles.view_area_a, LiveTaggingStyles.view_area_timeout]}>
                  <LiveTaggingButton onPress={() => this.btn_timeout("h")} text={"Time Out"} type={3} width={9}></LiveTaggingButton>
                  {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.btn_timeout('h')}>*/}
                  {/*  <Text>Time Out</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <View style={[LiveTaggingStyles.view_area]}>
                <View style={[LiveTaggingStyles.view_area_a]}>
                  <View style={[LiveTaggingStyles.home_color_bottom, {borderColor: this.state.teamcolor_home}]}>
                    <Text style={[LiveTaggingStyles.text_view_size,{fontSize: Math.min(16,120/(1+team_name_home.length))}]}>{team_name_home}</Text>
                  </View>
                </View>
                <View paddingVertical={'1.0%'}/>
                <View style={[LiveTaggingStyles.view_area_b]}>
                  <View style={[LiveTaggingStyles.vertical_columns, LiveTaggingStyles.vertical_columns_bg]}>
                    <Text style={LiveTaggingStyles.text_head}>Fouls</Text>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={foul_figure_h}/>
                  </View>
                  <View paddingHorizontal={'2.5%'}/>
                  <View style={[LiveTaggingStyles.vertical_columns, LiveTaggingStyles.vertical_columns_bg]}>
                    <Text style={LiveTaggingStyles.text_head}>Time Out</Text>
                    <Image
                      style={[LiveTaggingStyles.figure_img]}
                      source={timeout_figure_h}/>
                  </View>
                </View>
              </View>
              <View paddingHorizontal={'0.5%'}/>
              <LinearGradient colors={[this.state.teamcolor_home, this.state.teamcolor_home, this.state.teamcolor_home]} style={[LiveTaggingStyles.area_text]} locations={[0.49, 0.5, 1]}>
                <Text style={[LiveTaggingStyles.team_title, {transform: [{rotate: "90deg"}]}]}>HOME</Text>
              </LinearGradient>
            </View>

            <View style={[LiveTaggingStyles.contents_b]}>
              <Text style={[LiveTaggingStyles.lbl_msg]}>{this.state.lbl_msg}</Text>
            </View>
            <View style={[styles.row, LiveTaggingStyles.contents_c]}>

              <View style={[LiveTaggingStyles.area_subs]}>
                <Text style={LiveTaggingStyles.line_text}>Sub</Text>
                <View style={[LiveTaggingStyles.line_contents]}>
                  {
                    this.state.subs_v.map((rowData, index) => (
                      <DraxButton
                        key={index}
                        rowData={rowData}
                        type={0}
                        team={"v"}
                        onReceiveDragDrop={this.onReceiveDragDrop}
                        index={rowData.number}
                        style={[LiveTaggingStyles.no_select_button]}
                      />
                    ))
                  }
                </View>
              </View>
              <View paddingHorizontal={'0.2%'}/>
              <View style={[LiveTaggingStyles.area_lineup]}>
                <Text style={LiveTaggingStyles.line_text}>Line Up</Text>
                <View style={[LiveTaggingStyles.line_contents]}>
                  {
                    this.state.starters_v.map((rowData, index) => (
                      <TouchableOpacity activeOpacity={1} onPress={() => this.select_lineUp('v', index, rowData)}>
                        <DraxButton
                          key={index}
                          color={this.state.teamcolor_visitor}
                          rowData={rowData}
                          type={2}
                          team={"v"}
                          onReceiveDragDrop={this.onReceiveDragDrop}
                          index={rowData.number}
                          selected={(touch_key_v === index && touch_teamkey_v === false) ? true : false}
                          style={[(touch_key_v === index && touch_teamkey_v === false) ? LiveTaggingStyles.select_button : LiveTaggingStyles.no_select_button]}
                          onPress={() => this.select_lineUp('v', index, rowData)}
                        />
                      </TouchableOpacity>
                    ))
                  }
                  <View style={[LiveTaggingStyles.team_btn]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.select_lineUp_team('v')}>
                      <DraxButton
                        nodrag={true}
                        color={this.state.teamcolor_visitor}
                        rowData={{number: "Team", foul_count: foul_team_count_v}}
                        type={1}
                        index={0}
                        selected={(touch_teamkey_v === true) ? true : false}
                        style={[(touch_teamkey_v === true) ? LiveTaggingStyles.select_button : LiveTaggingStyles.no_select_button]}
                        onPress={() => this.select_lineUp_team('v')}
                      />
                    </TouchableOpacity>
                  </View>
                  {/*<View style={[LiveTaggingStyles.team_btn]}>*/}
                  {/*  <TouchableOpacity style={[ touch_teamkey_v === true ? LiveTaggingStyles.select_button : LiveTaggingStyles.no_select_button]} onPress={() => this.select_lineUp_team('v')}>*/}
                  {/*    <LinearGradient colors={['#000080', '#27277a', '#27277a']} style={[ LiveTaggingStyles.button_player,  {borderRadius: 5}]} locations={[0.49, 0.5, 1]}>*/}
                  {/*      <Text style={LiveTaggingStyles.btn_text}>Team</Text>*/}
                  {/*      { foul_team_count_v > 0 ? <Badge value={foul_team_count_v.toString()} status="error" containerStyle={{ position: 'absolute', top: -4, right: -4 }}/> : null }*/}
                  {/*    </LinearGradient>*/}
                  {/*  </TouchableOpacity>*/}
                  {/*</View>*/}
                </View>
              </View>
              <View paddingHorizontal={'0.2%'}/>
              <View style={[LiveTaggingStyles.shot_view_area]}>
                <View style={[LiveTaggingStyles.view_area_c]}>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <LiveTaggingButton disabled={this.state.cancel_disable} onPress={this.toggleShotModal} text={"Shot"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_sm, LiveTaggingStyles.btn_round, LiveTaggingStyles.button_sm_center]} */}
                    {/*                  onPress={this.toggleShotModal}>*/}
                    {/*  <Text>Shot</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <LiveTaggingButton disabled={this.state.cancel_disable} onPress={this.toggleFTModal} text={"FT"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_sm, LiveTaggingStyles.btn_round, LiveTaggingStyles.button_sm_center]} onPress={this.toggleFTModal}>*/}
                    {/*  <Text>FT</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <LiveTaggingButton disabled={this.state.cancel_disable} onPress={() => this.btn_foul()} text={"Foul"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_sm, LiveTaggingStyles.btn_round, LiveTaggingStyles.button_sm_center]} onPress={() => this.btn_foul()}>*/}
                    {/*  <Text>Foul</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <LiveTaggingButton disabled={this.state.cancel_disable} onPress={this.toggleTOModal} text={"TO"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_sm, LiveTaggingStyles.btn_round, LiveTaggingStyles.button_sm_center]} onPress={this.toggleTOModal}>*/}
                    {/*  <Text>TO</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <LiveTaggingButton disabled={this.state.cancel_disable} onPress={() => this.btn_end()} text={"End"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_sm, LiveTaggingStyles.btn_round, LiveTaggingStyles.button_sm_center]} onPress={() => this.btn_end()}>*/}
                    {/*  <Text>End</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                  <View style={[LiveTaggingStyles.vertical_columns]}>
                    <LiveTaggingButton disabled={this.state.cancel_disable} onPress={() => this.btn_cancel()} text={"Cancel"} type={4}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_sm, LiveTaggingStyles.btn_round, LiveTaggingStyles.button_sm_center]} onPress={() => this.btn_cancel()}>*/}
                    {/* <Text>Cancel</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                </View>
                <View style={[LiveTaggingStyles.shot_img]}>
                  <View style={{width: '100%',height: '100%',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{width: yardWidth, height: yardHeight}} activeOpacity={1.0} onPress={(evt) => this.handlePress(evt)}>
                      <ImageBackground
                        imageStyle={{resizeMode: 'contain'}}
                        style={{width: '100%', height: "100%"}}
                        source={shotImgPath}>
                        <Canvas ref={this.canvas} style={{width: '100%', height: "100%"}}/>
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View paddingHorizontal={'0.2%'}/>
              <View style={[LiveTaggingStyles.area_lineup]}>
                <Text style={LiveTaggingStyles.line_text}>Line Up</Text>
                <View style={[LiveTaggingStyles.line_contents]}>
                  {
                    this.state.starters_h.map((rowData, index) => (
                      <TouchableOpacity activeOpacity={1} onPress={() => this.select_lineUp('h', index, rowData)}>
                        <DraxButton
                          key={index}
                          color={this.state.teamcolor_home}
                          rowData={rowData}
                          type={2}
                          team={"h"}
                          onReceiveDragDrop={this.onReceiveDragDrop}
                          index={rowData.number}
                          selected={(touch_key_h === index && touch_teamkey_h === false) ? true : false}
                          style={[(touch_key_h === index && touch_teamkey_h === false) ? LiveTaggingStyles.select_button : LiveTaggingStyles.no_select_button]}
                          onPress={() => this.select_lineUp('h', index, rowData)}
                        />
                      </TouchableOpacity>
                    ))
                  }
                  <View style={[LiveTaggingStyles.team_btn]}>

                    <TouchableOpacity activeOpacity={1} onPress={() => this.select_lineUp_team('h')}>
                      <DraxButton
                        nodrag={true}
                        color={this.state.teamcolor_home}
                        rowData={{number: "Team", foul_count: foul_team_count_h}}
                        type={1}
                        index={0}
                        selected={(touch_teamkey_h === true) ? true : false}
                        style={[(touch_teamkey_h === true) ? LiveTaggingStyles.select_button : LiveTaggingStyles.no_select_button]}
                        onPress={() => this.select_lineUp_team('h')}
                      />
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={[touch_teamkey_h === true ? LiveTaggingStyles.select_button : null]} onPress={() => this.select_lineUp_team('h')}>*/}
                    {/*  <LinearGradient colors={['#ffffff', '#dbdfe2', '#dbdfe2']} style={[ LiveTaggingStyles.button_player,  {borderRadius: 5}]} locations={[0.49, 0.5, 1]}>*/}
                    {/*    <Text style={[LiveTaggingStyles.btn_text,{color:"#000"}]}>Team</Text>*/}
                    {/*    { foul_team_count_h > 0 ? <Badge value={foul_team_count_h.toString()} status="error" containerStyle={{ position: 'absolute', top: -4, right: -4 }}/> : null }*/}
                    {/*  </LinearGradient>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                </View>
              </View>
              <View paddingHorizontal={'0.2%'}/>
              <View style={[LiveTaggingStyles.area_subs]}>
                <Text style={LiveTaggingStyles.line_text}>Sub</Text>
                <View style={[LiveTaggingStyles.line_contents]}>
                  {
                    this.state.subs_h.map((rowData, index) => (
                      <DraxButton
                        key={index}
                        rowData={rowData}
                        type={0}
                        team={"h"}
                        onReceiveDragDrop={this.onReceiveDragDrop}
                        index={rowData.number}
                        style={[LiveTaggingStyles.no_select_button]}
                      />
                    ))
                  }
                </View>
              </View>
            </View>
            <View style={[styles.row, LiveTaggingStyles.contents_d]}>
              <View style={[LiveTaggingStyles.table_area]}>
                <Table borderStyle={{borderColor: 'transparent'}}>
                  <Row data={this.state.tableHead} style={LiveTaggingStyles.table_head} textStyle={LiveTaggingStyles.table_text}/>
                </Table>
                <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    {
                      this.state.tableDataH.map((rowData, index) => (
                        <TableWrapper key={index} style={[LiveTaggingStyles.table_row, (this.state.edit_index_h === index) ? LiveTaggingStyles.table_row_bg : null]}>
                          {
                            rowData.map((cellData, cellIndex) => {
                              if(cellIndex>5) return (<></>)
                              return (
                                <Cell key={cellIndex} data={(cellIndex === 5) ? delete_button_element(cellData, index, cellIndex, 'h') : (cellIndex === 4) ? check_element(cellData, index, cellIndex, 'h') : cellData} textStyle={LiveTaggingStyles.table_text} onPress={() => this.table_cell_tap(rowData, index, 'h')}/>
                              )
                            })
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </ScrollView>
              </View>
              <View paddingHorizontal={'1.0%'}/>
              <View style={[LiveTaggingStyles.view_area]}>
                <View style={[LiveTaggingStyles.bottom_area_a]}>

                  <LiveTaggingButton disabled={this.state.edit_disable} onPress={() => this.toggleEditModal()} text={"Edit"} type={3} width={18}></LiveTaggingButton>

                  {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.toggleEditModal()}>*/}
                  {/*  <Text>Edit</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
                <View style={[LiveTaggingStyles.bottom_area_a]}>
                  <LiveTaggingButton onPress={() => this.goPage(Constants.SCREEN_ID.PLAY_BY_PLAY)} text={"Play by Play"} type={3} width={18}></LiveTaggingButton>
                  {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.goPage()}>*/}
                  {/*  <Text>Play by Play</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
                <View style={[LiveTaggingStyles.bottom_area_a]}>
                  <LiveTaggingButton onPress={() => this.goPage(Constants.SCREEN_ID.GAME_INFO)} text={"Back to GameInfo"} type={3} width={18}></LiveTaggingButton>
                  {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this._alertIndex(index)}>*/}
                  {/*  <Text>Back to GameInfo</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
                <View style={[LiveTaggingStyles.bottom_area_a]}>
                  <LiveTaggingButton onPress={() => this.btn_latest()} text={"Get Latest Datas"} type={3} width={18}></LiveTaggingButton>
                  {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this._alertIndex(index)}>*/}
                  {/*  <Text>Get Latest Datas</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
              </View>
              <View paddingHorizontal={'1.0%'}/>
              <View style={[LiveTaggingStyles.table_area]}>
                <Table borderStyle={{borderColor: 'transparent'}}>
                  <Row data={this.state.tableHead} style={LiveTaggingStyles.table_head} textStyle={LiveTaggingStyles.table_text}/>
                </Table>
                <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    {
                      this.state.tableDataV.map((rowData, index) => (
                        <TableWrapper key={index} style={[LiveTaggingStyles.table_row, (this.state.edit_index_v === index) ? LiveTaggingStyles.table_row_bg : null]}>
                          {
                            rowData.map((cellData, cellIndex) => {
                              if(cellIndex>5) return (<></>)
                              return (
                                <Cell key={cellIndex} data={(cellIndex === 5) ? delete_button_element(cellData, index, cellIndex, 'v') : (cellIndex === 4) ? check_element(cellData, index, cellIndex, 'v') : cellData} textStyle={LiveTaggingStyles.table_text} onPress={() => this.table_cell_tap(rowData, index, 'v')}/>
                              )
                            })
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </ScrollView>
              </View>
            </View>

            <SafeAreaView>
              <Modal
                style={[styles.modal_overview, LiveTaggingStyles.modal_view, (!this.state.is_shot2pmodal_visible || !this.state.is_shot3pmodal_visible) ? LiveTaggingStyles.modal_2p : LiveTaggingStyles.modal_2p3p]}
                isVisible={this.state.is_shot2p3pmodal_visible}
                swipeDirection={['up', 'down', 'left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.hideShotModal}
              >
                <View paddingVertical={'1.0%'}/>
                <View style={LiveTaggingStyles.view_area_to_row}>
                  {(this.state.is_shot2pmodal_visible) ?
                    (<View>
                      <Text style={LiveTaggingStyles.text_head_shot}>2P</Text>
                      <View paddingVertical={'1.0%'}/>
                      <View style={LiveTaggingStyles.view_area_shot}>
                        <View>
                          <LiveTaggingButton onPress={() => this.btn_made('btn_2p_made')} text={"Made"} type={3}></LiveTaggingButton>
                          <LiveTaggingButton onPress={() => this.btn_made_foul('btn_2p_made-foul')} text={"Made/Foul"} type={3}></LiveTaggingButton>

                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, LiveTaggingStyles.buttonColor_blue]} onPress={() => this.btn_made('btn_2p_made')}>*/}
                          {/*  <Text style={styles.buttonText}>Made</Text>*/}
                          {/*</TouchableOpacity>*/}
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, LiveTaggingStyles.buttonColor_blue]} onPress={() => this.btn_made_foul('btn_2p_made-foul')}>*/}
                          {/*  <Text style={styles.buttonText}>Made/Foul</Text>*/}
                          {/*  </TouchableOpacity>*/}
                        </View>
                        <View>
                          <LiveTaggingButton onPress={() => this.btn_miss('btn_2p_miss')} text={"Miss"} type={5}></LiveTaggingButton>
                          <LiveTaggingButton onPress={() => this.btn_miss_foul('btn_2p_miss-foul')} text={"Miss/Foul"} type={5}></LiveTaggingButton>
                          <LiveTaggingButton onPress={() => this.btn_miss_block('btn_2p_miss-block')} text={"Miss/Block"} type={5}></LiveTaggingButton>
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, styles.buttonColor_red]} onPress={() => this.btn_miss('btn_2p_miss')}>*/}
                          {/*  <Text style={styles.buttonText}>Miss</Text>*/}
                          {/*</TouchableOpacity>*/}
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, styles.buttonColor_red]} onPress={() => this.btn_miss_foul('btn_2p_miss-foul')}>*/}
                          {/*  <Text style={styles.buttonText}>Miss/Foul</Text>*/}
                          {/*</TouchableOpacity>*/}
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, styles.buttonColor_red]} onPress={() => this.btn_miss_block('btn_2p_miss-block')}>*/}
                          {/*  <Text style={styles.buttonText}>Miss/Block</Text>*/}
                          {/*</TouchableOpacity>*/}
                        </View>
                      </View>
                    </View>) : null
                  }
                  {
                    (this.state.is_shot2pmodal_visible && this.state.is_shot3pmodal_visible) ?
                      (<View paddingHorizontal={'1.0%'}/>) : null
                  }
                  {(this.state.is_shot3pmodal_visible) ?
                    (<View>
                      <Text style={LiveTaggingStyles.text_head_shot}>3P</Text>
                      <View paddingVertical={'1.0%'}/>
                      <View style={LiveTaggingStyles.view_area_shot}>
                        <View>
                          <LiveTaggingButton onPress={() => this.btn_made('btn_3p_made')} text={"Made"} type={3}></LiveTaggingButton>
                          <LiveTaggingButton onPress={() => this.btn_made_foul('btn_3p_made-foul')} text={"Made/Foul"} type={3}></LiveTaggingButton>
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, LiveTaggingStyles.buttonColor_blue]} onPress={() => this.btn_made('btn_3p_made')}>*/}
                          {/*  <Text style={styles.buttonText}>Made</Text>*/}
                          {/*</TouchableOpacity>*/}
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, LiveTaggingStyles.buttonColor_blue]} onPress={() => this.btn_made_foul('btn_3p_made-foul')}>*/}
                          {/*  <Text style={styles.buttonText}>Made/Foul</Text>*/}
                          {/*  </TouchableOpacity>*/}
                        </View>
                        <View>
                          <LiveTaggingButton onPress={() => this.btn_miss('btn_3p_miss')} text={"Miss"} type={5}></LiveTaggingButton>
                          <LiveTaggingButton onPress={() => this.btn_miss_foul('btn_3p_miss-foul')} text={"Miss/Foul"} type={5}></LiveTaggingButton>
                          <LiveTaggingButton onPress={() => this.btn_miss_block('btn_3p_miss-block')} text={"Miss/Block"} type={5}></LiveTaggingButton>

                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, styles.buttonColor_red]} onPress={() => this.btn_miss('btn_3p_miss')}>*/}
                          {/*  <Text style={styles.buttonText}>Miss</Text>*/}
                          {/*</TouchableOpacity>*/}
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, styles.buttonColor_red]} onPress={() => this.btn_miss_foul('btn_3p_miss-foul')}>*/}
                          {/*  <Text style={styles.buttonText}>Miss/Foul</Text>*/}
                          {/*</TouchableOpacity>*/}
                          {/*<TouchableOpacity style={[styles.button_md, styles.formElement, styles.buttonColor_red]} onPress={() => this.btn_miss_block('btn_3p_miss-block')}>*/}
                          {/*  <Text style={styles.buttonText}>Miss/Block</Text>*/}
                          {/*</TouchableOpacity>*/}
                        </View>
                      </View>
                    </View>) : null
                  }
                </View>
                <View paddingVertical={'1.0%'}/>
              </Modal>
            </SafeAreaView>
            <SafeAreaView>
              <Modal
                style={[styles.modal_overview, LiveTaggingStyles.modal_view]}
                isVisible={this.state.is_tomodal_visible}
                swipeDirection={['up', 'down', 'left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.toggleTOModal}
              >
                <View paddingVertical={'1.0%'}/>
                <View style={LiveTaggingStyles.view_area_to}>
                  <View>
                    <LiveTaggingButton style={{margin: 10}} onPress={() => this.btn_to_ob()} text={"DB"} type={3}></LiveTaggingButton>
                    <LiveTaggingButton style={{margin: 10}} onPress={() => this.btn_to_steal()} text={"Steal"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.btn_to_ob()}>*/}
                    {/*  <Text>DB</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.btn_to_steal()}>*/}
                    {/*  <Text>Steal</Text>*/}
                    {/*  </TouchableOpacity>*/}
                  </View>
                  <View paddingVertical={'1.0%'}/>
                  <View>
                    <LiveTaggingButton style={{margin: 10}} onPress={() => this.btn_to_foul()} text={"Foul"} type={3}></LiveTaggingButton>
                    <LiveTaggingButton style={{margin: 10}} onPress={() => this.btn_to_vio()} text={"Violation"} type={3}></LiveTaggingButton>
                    {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.btn_to_foul()}>*/}
                    {/*  <Text>Foul</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.btn_to_vio()}>*/}
                    {/*  <Text>Violation</Text>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                </View>
                <View paddingVertical={'1.0%'}/>
              </Modal>
            </SafeAreaView>
            <SafeAreaView>
              <Modal
                style={[styles.modal_overview, LiveTaggingStyles.modal_view, LiveTaggingStyles.modal_ft, (this.state.shots_num == 3) ? LiveTaggingStyles.modal_height_3 : (this.state.shots_num == 1) ? LiveTaggingStyles.modal_height_1 : null]}
                isVisible={this.state.is_ftmodal_visible}
                swipeDirection={['up', 'down', 'left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.toggleFTModal}
              >
                <View paddingVertical={'1.0%'}/>
                <Row flexArr={[2, 1, 1, 1]} data={this.state.number_of_shots} style={LiveTaggingStyles.ft_table_head} textStyle={LiveTaggingStyles.ft_table_text_right}/>
                <View paddingVertical={'1.0%'}/>
                <Row flexArr={[2, 1, 1, 1]} data={this.state.ft_col1} style={LiveTaggingStyles.ft_table_head} textStyle={LiveTaggingStyles.ft_table_text}/>
                {
                  this.state.shots_num >= 2 ?
                    (
                      <>
                        <View paddingVertical={'1.0%'}/>
                        <Row flexArr={[2, 1, 1, 1]} data={this.state.ft_col2} style={LiveTaggingStyles.ft_table_head} textStyle={LiveTaggingStyles.ft_table_text}/>
                      </>
                    ) : null
                }
                {
                  this.state.shots_num >= 3 ?
                    (
                      <>
                        <View paddingVertical={'1.0%'}/>
                        <Row flexArr={[2, 1, 1, 1]} data={this.state.ft_col3} style={LiveTaggingStyles.ft_table_head} textStyle={LiveTaggingStyles.ft_table_text}/>
                      </>
                    ) : null
                }
                <View paddingVertical={'1.0%'}/>
                <View>
                  <LiveTaggingButton onPress={() => this.btn_ft_ok()} text={"OK"} type={3} width={20}></LiveTaggingButton>
                </View>
                {/*<TouchableOpacity style={[styles.button_xlg, styles.formElement, LiveTaggingStyles.ft_table_head, LiveTaggingStyles.ft_confirm_btn]} onPress={() => this.btn_ft_ok()}>*/}
                {/*  <Text>OK</Text>*/}
                {/*</TouchableOpacity>*/}
                <View paddingVertical={'1.0%'}/>
              </Modal>
            </SafeAreaView>
            <SafeAreaView>
              <Modal
                style={[styles.modal_overview, LiveTaggingStyles.modal_view, LiveTaggingStyles.modal_edit]}
                isVisible={this.state.is_edit}
                swipeDirection={['left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.toggleEditModal}
              >
                <View paddingVertical={'2.0%'}/>

                <View style={LiveTaggingStyles.view_area_to}>
                  <View style={LiveTaggingStyles.edit_title}>
                    <Text style={[LiveTaggingStyles.ft_table_text]}>Time</Text>
                  </View>
                  <View style={LiveTaggingStyles.edit_cell}>
                    <ModalDropdown
                      ref="dropdown1"
                      style={[styles.dropdown, LiveTaggingStyles.dropdown_datetime]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, LiveTaggingStyles.dropdown_dropdown_datetime,]}
                      defaultValue={this.state.minute}
                      defaultTextStyle={LiveTaggingStyles.defaultTextStyle_custom}
                      options={this.state.minuteList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.minuteList)}
                      onSelect={(option, index) => this.setState({minute: option.label})}
                    />
                    <Text style={[LiveTaggingStyles.labelText_modal_term]}>:</Text>
                    <ModalDropdown
                      ref="dropdown2"
                      style={[styles.dropdown, LiveTaggingStyles.dropdown_datetime]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, LiveTaggingStyles.dropdown_dropdown_datetime,]}
                      defaultValue={this.state.second}
                      defaultTextStyle={LiveTaggingStyles.defaultTextStyle_custom}
                      options={this.state.secondList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.secondList)}
                      onSelect={(option, index) => this.setState({second: option.label})}
                    />
                  </View>
                </View>
                <View paddingVertical={'2.0%'}/>
                <View style={LiveTaggingStyles.view_area_to}>
                  <View style={LiveTaggingStyles.edit_title}>
                    <Text style={[LiveTaggingStyles.ft_table_text]}>Player</Text>
                  </View>
                  <View style={LiveTaggingStyles.edit_cell}>
                    <ModalDropdown
                      ref="dropdown3"
                      style={[styles.dropdown, LiveTaggingStyles.dropdown_custom]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, LiveTaggingStyles.dropdown_dropdown_custom, {height: hp(this.state.selectlist.length * 4.5)}]}
                      defaultValue={this.state.defaultValue}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.selectlist}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.selectlist)}
                      onSelect={(option, index) => this.onMemberChange(option, index)}
                    />
                  </View>
                </View>
                <View paddingVertical={'2.0%'}/>
                <View style={LiveTaggingStyles.view_area_to}>
                  <View style={LiveTaggingStyles.edit_title}>
                    <Text style={[LiveTaggingStyles.ft_table_text]}>Play</Text>
                  </View>
                  <View style={LiveTaggingStyles.edit_cell}>
                    <ModalDropdown
                      ref="dropdown4"
                      disabled={this.state.is_play_disable}
                      style={[styles.dropdown, LiveTaggingStyles.dropdown_custom, (this.state.is_play_disable) ? LiveTaggingStyles.dropdown_dropdown_custom_disable : null]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, LiveTaggingStyles.dropdown_dropdown_custom, {height: hp(this.state.playList.length * 4.5)}]}
                      defaultValue={this.state.defaultPlayValue}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.playList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.playList)}
                      onSelect={(option, index) => this.onPlayChange(option, index)}
                    />
                  </View>
                </View>
                <View paddingVertical={'2.0%'}/>
                <View style={LiveTaggingStyles.view_area_to}>
                  <View style={LiveTaggingStyles.edit_title}>
                    <Text style={[LiveTaggingStyles.ft_table_text]}>Result</Text>
                  </View>
                  <View style={LiveTaggingStyles.edit_cell}>
                    <ModalDropdown
                      ref="dropdown5"
                      disabled={this.state.is_result_disable}
                      style={[styles.dropdown, LiveTaggingStyles.dropdown_custom, (this.state.is_result_disable) ? LiveTaggingStyles.dropdown_dropdown_custom_disable : null]}
                      textStyle={[styles.dropdown_text]}
                      dropdownStyle={[styles.dropdown_dropdown, LiveTaggingStyles.dropdown_dropdown_custom, {height: hp(this.state.resultList.length * 4.5)}]}
                      defaultValue={this.state.defaultResultValue}
                      defaultTextStyle={styles.defaultTextStyle}
                      options={this.state.resultList}
                      renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                      renderRow={this._dropdown_renderRow.bind(this)}
                      renderRowComponent={TouchableHighlight}
                      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.resultList)}
                      onSelect={(option, index) => this.onResultChange(option, index)}
                    />
                  </View>
                </View>
                <View paddingVertical={'2.0%'}/>
                <View style={[LiveTaggingStyles.view_area_to, {alignItems: "flex-end", justifyContent: 'flex-end',}]}>
                  <LiveTaggingButton onPress={() => this.btn_tag_update()} text={"Update"} type={3} width={12}></LiveTaggingButton>
                  <LiveTaggingButton onPress={this.toggleEditModal} text={"Cancel"} type={4} width={12}></LiveTaggingButton>
                </View>
                <View paddingVertical={'2.0%'}/>
              </Modal>
              <View>

              </View>
            </SafeAreaView>
            <ConfirmDialog
              animationType="slide"
              dialogStyle={{left: wp(20), right: wp(20), width: wp(60)}}
              title="登録確認"
              message={Messages.INFO.I006}
              visible={this.state.dialogVisible}
              onTouchOutside={() => this.btn_opp_side(false)}
              positiveButton={{
                title: 'はい',
                onPress: () => this.btn_opp_side(true)
              }}
              negativeButton={{
                title: 'いいえ',
                onPress: () => this.btn_opp_side(false)
              }}
            />
            <ConfirmDialog
              animationType="slide"
              dialogStyle={{left: wp(20), right: wp(20), width: wp(60)}}
              title=""
              message={Messages.INFO.I019}
              visible={this.state.periodDialogVisible}
              onTouchOutside={() => this.btn_next_quater(false)}
              positiveButton={{
                title: 'はい',
                onPress: () => this.btn_next_quater(true)
              }}
              negativeButton={{
                title: 'いいえ',
                onPress: () => this.btn_next_quater(false)
              }}
            />

            <SafeAreaView>
              <Modal
                // style={[LiveTaggingStyles.modal_dialog_end]}
                style={[ LiveTaggingStyles.modal_dialog_end]}
                isVisible={this.state.is_end_visible}
                swipeDirection={['up', 'down', 'left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.toggleEndModal}
              >
                <View style={[LiveTaggingStyles.modal_header]}>
                  <Text style={[LiveTaggingStyles.modal_header_text]}>お疲れ様でした。</Text>
                  <Text style={[LiveTaggingStyles.modal_header_text]}>タグ付けを終了しますか？</Text>
                </View>
                <View style={[LiveTaggingStyles.modal_content]}>
                  <TouchableOpacity style={[LiveTaggingStyles.modal_button]} onPress={() => this.btn_end_cancel()}>
                    <Text style={[LiveTaggingStyles.modal_button_text]} >いいえ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[LiveTaggingStyles.modal_button]} onPress={() => this.btn_end_ok()}>
                    <Text style={[LiveTaggingStyles.modal_button_text]} >はい</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </SafeAreaView>

            <SafeAreaView>
              <Modal
                style={[LiveTaggingStyles.modal_dialog_end]}
                isVisible={this.state.is_thanks_visible}
                swipeDirection={['up', 'down', 'left', 'right']}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={this.toggleEndModal}
              >
                <View style={[LiveTaggingStyles.modal_content]}>
                  <Icon style={[LiveTaggingStyles.modal_header_text,{color:'#73AA49'}]} name='check'/>
                  <Text style={[LiveTaggingStyles.modal_header_text]}>  タグの登録が完了しました。</Text>
                </View>
              </Modal>
            </SafeAreaView>

          </View>
      </DraxProvider>
    );
  }
}

// export default GameInfo;
// 画面遷移時の再レンダリング対応
export default withNavigation(LiveTagging);

