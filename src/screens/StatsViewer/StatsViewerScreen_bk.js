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
  TouchableHighlight,
  Button
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// テーブル表示
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/BaseStyles';
import StatsViewerStyles from './StatsViewerStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';
import GetBoxScorePlayer from '../../util/getBoxScorePlayer';
import GetBoxScoreTeam from '../../util/getBoxScoreTeam';
import GetTeamVal from '../../util/getTeamVal';
import GetAdvancedStatsTeam from '../../util/getAdvancedStatsTeam';
import GetAdvancedStatsPlayer from '../../util/getAdvancedStatsPlayer';
import ExportCSV from '../../util/ExportCSV';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;
const playerinfo = [];

class StatsViewer extends Component {
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
      screen_category: Constants.SCREEN_CATEGORY.STATS_VIEWER,
      // ローディングスピナー表示フラグ
      isLoadingVisible: false,
      // スコアテーブルヘッダー
      scoreTableHead: [
        ['Team', 'Q1', 'Q2', 'Q3', 'Q4', 'OT', '合計', 'Foul', 'TO'],
      ],
      // スコアテーブルデータ
      scoreDatas: [],
      // スコアテーブルラベル（チーム名）
      team_home: [],
      team_visitor: [],

      // スタッツデータ
      statsinfo: [],
      statsinfo_home: [],
      statsinfo_visitor: [],

      // コネクションID
      connection_id: '',
      
      // テーブルヘッダー
      tableHead_1: [
        [
          '',
          '3P',
          '2P',
          'ITP',
          'Mid',
          'FT',
          '',
          'REB',
          '',
          '',
          '',
          '',
          '',
        ],
      ],
      // テーブルヘッダー
      tableHead_2: [
        [
          'PTS',
          'M',
          'A',
          'M',
          'A',
          'M',
          'A',
          'M',
          'A',
          'M',
          'A',
          'F',
          'DR',
          'OR',
          'TOT',
          'AS',
          'ST',
          'BS',
          'TO',
          'MIN',
        ],
      ],
      // アドバンスドチームスタッツヘッダー
      advancedTableHead_top1: [
        [
          '',
          'Team Evaluation',
          'Points Off',
          'Shooting',
        ],
      ],
      advancedTableHead_bottom1: [
        [
          'Offensive Characteristics',
          'Rebound',
        ],
      ],
      advancedTableHead_top2: [
        [
          'Poss',
          'Off.Eff',
          'Def.Eff',
          'Steal',
          'Steal%',
          'OR',
          'OR%',
          '3P%',
          '2P%',
          'ITP%',
          'Mid%',
          'eFG%',
          'TS%',
          'FT%',
        ],
      ],
      advancedTableHead_bottom2: [
        [
          'PIE',
          'FT/FG',
          'ITP/FG',
          'Mid/FG',
          '3P/FG',
          'Ast%',
          'TO%',
          'DR%',
          'OR%',
          'RB%',
        ],
      ],
      // ボックススコアチームスタッツデータ
      boxscoreTeamStats: [],
      boxscoreTeamStats_home: [],
      boxscoreTeamStats_visitor: [],
      // boxscoreTeamStats: [
      //   ['90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      // ],

      // アドバンスドチームスタッツデータ
      advancedTeamStats_top: [],
      advancedTeamStats_top_home: [],
      advancedTeamStats_top_visitor: [],
      // advancedTeamStats_top: [
      //   ['91.4', '0.98', '0.93', '23', '64.9', '35', '48.5', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9'],
      // ],
      advancedTeamStats_bottom: [],
      advancedTeamStats_bottom_home: [],
      advancedTeamStats_bottom_visitor: [],
      // advancedTeamStats_bottom: [
      //   ['57.1', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '41.9', '64.9', '48.5'],
      // ],

      // ボックススコアプレイヤーテーブルヘッダー(上段)
      boxscorePlayerHead_1: [
        [
          '',
          '',
          '',
          '',
          '3P',
          '2P',
          'ITP',
          'Mid',
          'FT',
          '',
          'REB',
          '',
          '',
          '',
          '',
          '',
        ],
      ],
      // ボックススコアプレイヤーテーブルヘッダー(下段)
      boxscorePlayerHead_2: [
        [
          'No',
          'Player',
          'S',
          'PTS',
          'M',
          'A',
          'M',
          'A',
          'M',
          'A',
          'M',
          'A',
          'M',
          'A',
          'F',
          'DR',
          'OR',
          'TOT',
          'AS',
          'ST',
          'BS',
          'TO',
          'MIN',
        ],
      ],
      // ボックススコアプレイヤースタッツデータ
      boxscorePlayerStats: [],
      boxscorePlayerStats_home: [],
      boxscorePlayerStats_visitor: [],
      // boxscorePlayerStats: [
      //   ['10', 'プレイヤーAAA', '＊', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['11', 'プレイヤーBBB', '＊', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['12', 'プレイヤーCCC', '＊', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['13', 'プレイヤーDDD', '＊', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['14', 'プレイヤーEEE', '＊', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['15', 'プレイヤーFFF', '', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['16', 'プレイヤーGGG', '', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['17', 'プレイヤーHHH', '', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['18', 'プレイヤーIII', '', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['19', 'プレイヤーJJJ', '', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      //   ['', 'チーム合計', '', '90', '5', '17', '23', '49', '15', '28', '8', '21', '29', '35', '15', '24', '18', '42', '10', '6', '7', '10', '40:00'],
      // ],

      // アドバンスドプレイヤーテーブルヘッダー
      advancedPlayerHead_1: [
        [
          '',
          '',
          '',
          'Shooting',
          'Offensive Characteristics',
          'Evaluation',
          '',
        ],
      ],
      advancedPlayerHead_2: [
        [
          'No',
          'Player',
          'S',
          '3P%',
          '2P%',
          'ITP%',
          'Mid%',
          'eFG%',
          'TS%',
          'FT%',
          'USG',
          'FT/\nFG',
          'ITP/\nFG',
          'Mid/\nFG',
          '3P/\nFG',
          'Ast%',
          'TO%',
          'EFF',
          'PIE',
          'MIN',
        ],
      ],
      // アドバンスドプレイヤースタッツデータ
      advancedPlayerStats: [],
      advancedPlayerStats_home: [],
      advancedPlayerStats_visitor: [],
      // advancedPlayerStats: [
      //   ['', 'チーム合計', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['', '平均', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['20', 'PlayerZZZ', '＊', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['21', 'PlayerYYY', '＊', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['22', 'PlayerXXX', '＊', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['23', 'PlayerWWW', '＊', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['24', 'PlayerVVV', '＊', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['25', 'PlayerUUU', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['26', 'PlayerTTT', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['27', 'PlayerSSS', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['28', 'PlayerRRR', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      //   ['29', 'PlayerQQQ', '', '29.4', '46.9', '53.6', '38.1', '46.2', '56.3', '82.9', '12.5', '53.1', '42.4', '31.8', '25.8', '35.7', '3.8', '5.3', '5.3', '13:35'],
      // ],

      // Starters（ホーム）リスト
      starterListHome: [],
      // Starters（ビジター）リスト
      starterListVisitor: [],
      // Subs（ホーム）リスト
      subListHome: [],
      // Subs（ビジター）リスト
      subListVisitor: [],

      // ゲーム情報ラベル
      date:  [],
      event: [],
      stage: [],
      game_card: [],
      game_id: '',

      // タイトルラベル（チーム名）
      selected_team: [],

      // ピリオドボタン名称
      period_all: { label: 'ALL' },
      period_q1: { label: 'Q1', color: '#c0c0c0' },
      period_q2: { label: 'Q2', color: '#c0c0c0' },
      period_q3: { label: 'Q3', color: '#c0c0c0' },
      period_q4: { label: 'Q4', color: '#c0c0c0' },
      period_ot: { label: 'OT', color: '#c0c0c0' },
      selected_period: { label: 'ALL', color: '#006a6c' },

      // チームドロップダウン選択値
      defaultValue: [],
      // チームドロップダウンリスト
      teamList: [],

      // BoxScore、Advanced切り替えボタン
      switch_buttom: { label: 'Advanced', value: 0 },
      // スタッツタイトル
      label_statstitle: 'Box Score',
      // テーブル表示/非表示切り替えフラグ
      isDisplayBoxscore: 'block',
      isDisplayAdvanced: 'none',
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

        let teamlist = [];
        teamlist.push(payload.state.params.team_home);
        teamlist.push(payload.state.params.team_visitor);
    
        this.setState({
          date: payload.state.params.date,
          event: payload.state.params.event,
          stage: payload.state.params.stage,
          game_card: payload.state.params.game_card,
          team_home: payload.state.params.team_home,
          team_visitor: payload.state.params.team_visitor,
          game_id: payload.state.params.game_id,
          teamList: teamlist,
          defaultValue: payload.state.params.team_home,
          selected_team: payload.state.params.team_home,
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

  // ピリオド押下時のイベント処理
  _onChangePeriod(period, selected_team) {
    
    let datas_home = [], datas_visitor = [];
    datas_home = this.state.statsinfo_home;
    datas_visitor = this.state.statsinfo_visitor;

    let statsinfo_home = [], statsinfo_visitor = [];
    if (period.label === 'ALL') {
      statsinfo_home = datas_home;
      statsinfo_visitor = datas_visitor;

      this.setState({
        selected_period: { label: 'ALL', color: '#006a6c' },
        period_all: { label: 'ALL', color: '#006a6c' },
        period_q1: { label: 'Q1', color: '#c0c0c0' },
        period_q2: { label: 'Q2', color: '#c0c0c0' },
        period_q3: { label: 'Q3', color: '#c0c0c0' },
        period_q4: { label: 'Q4', color: '#c0c0c0' },
        period_ot: { label: 'OT', color: '#c0c0c0' },
      });
    } else if (period.label === 'Q1') {
      const q1 = this.state.period_q1.label;
      statsinfo_home = datas_home.filter(function(obj) { return obj.period === q1 });
      statsinfo_visitor = datas_visitor.filter(function(obj) { return obj.period === q1 });
            
      this.setState({
        selected_period: { label: 'Q1', color: '#006a6c' },
        period_q1: { label: 'Q1', color: '#006a6c' },
        period_all: { label: 'ALL', color: '#c0c0c0' },
        period_q2: { label: 'Q2', color: '#c0c0c0' },
        period_q3: { label: 'Q3', color: '#c0c0c0' },
        period_q4: { label: 'Q4', color: '#c0c0c0' },
        period_ot: { label: 'OT', color: '#c0c0c0' },
      });
    } else if(period.label === 'Q2') {
      const q2 = this.state.period_q2.label;
      statsinfo_home = datas_home.filter(function(obj) { return obj.period === q2 });
      statsinfo_visitor = datas_visitor.filter(function(obj) { return obj.period === q2 });
      
      this.setState({
        selected_period: { label: 'Q2', color: '#006a6c' },
        period_q2: { label: 'Q2', color: '#006a6c' },
        period_all: { label: 'ALL', color: '#c0c0c0' },
        period_q1: { label: 'Q1', color: '#c0c0c0' },
        period_q3: { label: 'Q3', color: '#c0c0c0' },
        period_q4: { label: 'Q4', color: '#c0c0c0' },
        period_ot: { label: 'OT', color: '#c0c0c0' },
      });

    } else if(period.label === 'Q3') {
      const q3 = this.state.period_q3.label;
      statsinfo_home = datas_home.filter(function(obj) { return obj.period === q3 });
      statsinfo_visitor = datas_visitor.filter(function(obj) { return obj.period === q3 });
      
      this.setState({
        selected_period: { label: 'Q3', color: '#006a6c' },
        period_q3: { label: 'Q3', color: '#006a6c' },
        period_all: { label: 'ALL', color: '#c0c0c0' },
        period_q1: { label: 'Q1', color: '#c0c0c0' },
        period_q2: { label: 'Q2', color: '#c0c0c0' },
        period_q4: { label: 'Q4', color: '#c0c0c0' },
        period_ot: { label: 'OT', color: '#c0c0c0' },
      });
    } else if(period.label === 'Q4') {
      const q4 = this.state.period_q4.label;
      statsinfo_home = datas_home.filter(function(obj) { return obj.period === q4 });
      statsinfo_visitor = datas_visitor.filter(function(obj) { return obj.period === q4 });

      this.setState({
        selected_period: { label: 'Q4', color: '#006a6c' },
        period_q4: { label: 'Q4', color: '#006a6c' },
        period_all: { label: 'ALL', color: '#c0c0c0' },
        period_q1: { label: 'Q1', color: '#c0c0c0' },
        period_q2: { label: 'Q2', color: '#c0c0c0' },
        period_q3: { label: 'Q3', color: '#c0c0c0' },
        period_ot: { label: 'OT', color: '#c0c0c0' },
      });
    } else {
      const ot = this.state.period_ot.label;
      statsinfo_home = datas_home.filter(function(obj) { return obj.period === ot });
      statsinfo_visitor = datas_visitor.filter(function(obj) { return obj.period === ot });

      this.setState({
        selected_period: { label: 'OT', color: '#006a6c' },
        period_ot: { label: 'OT', color: '#006a6c' },
        period_all: { label: 'ALL', color: '#c0c0c0' },
        period_q1: { label: 'Q1', color: '#c0c0c0' },
        period_q2: { label: 'Q2', color: '#c0c0c0' },
        period_q3: { label: 'Q3', color: '#c0c0c0' },
        period_q4: { label: 'Q4', color: '#c0c0c0' },
      });
    }

    // ボックススコアチームスタッツ
    const boxscoreTeamStats_home = GetBoxScoreTeam(statsinfo_home, this.state.connection_id);
    const boxscoreTeamStats_visitor = GetBoxScoreTeam(statsinfo_visitor, this.state.connection_id);
    // TeamVal
    const teamVal = GetTeamVal(boxscoreTeamStats_home, boxscoreTeamStats_visitor);

    if (this.state.teamList[0].value === selected_team.value) {
      // Home
      // ボックススコアプレイヤースタッツ
      const boxscorePlayerStats = GetBoxScorePlayer(statsinfo_home, this.state.connection_id, this.state.starterListHome, this.state.subListHome, playerinfo);
      // アドバンスドスタッツチーム
      const advancedTeamStats = GetAdvancedStatsTeam(boxscoreTeamStats_home[0], teamVal[0]);
      // アドバンスドスタッツプレイヤー
      const advancedPlayerStats = GetAdvancedStatsPlayer(boxscorePlayerStats, teamVal[0]);
      // 計算結果を格納
      this.setState({
        boxscoreTeamStats: [boxscoreTeamStats_home[0]],
        boxscorePlayerStats: boxscorePlayerStats,
        advancedTeamStats_top: [advancedTeamStats.slice(0, 14)],
        advancedTeamStats_bottom: [advancedTeamStats.slice(14, 24)],
        advancedPlayerStats: advancedPlayerStats,
      });
    } else {
      // Visitor
      // ボックススコアプレイヤースタッツ
      const boxscorePlayerStats = GetBoxScorePlayer(statsinfo_visitor, this.state.connection_id, this.state.starterListVisitor, this.state.subListVisitor, playerinfo);
      // アドバンスドスタッツチーム
      const advancedTeamStats = GetAdvancedStatsTeam(boxscoreTeamStats_visitor[0], teamVal[1]);
      // アドバンスドスタッツプレイヤー
      const advancedPlayerStats = GetAdvancedStatsPlayer(boxscorePlayerStats, teamVal[1]);
      // 計算結果を格納
      this.setState({
        boxscoreTeamStats: [boxscoreTeamStats_visitor[0]],
        boxscorePlayerStats: boxscorePlayerStats,
        advancedTeamStats_top: [advancedTeamStats.slice(0, 14)],
        advancedTeamStats_bottom: [advancedTeamStats.slice(14, 24)],
        advancedPlayerStats: advancedPlayerStats,
      });
    }
  }

  // チーム変更時のイベント処理
  _onTeamChange = (option, index) => {
    this.setState({
      defaultValue: option,
      selected_team: option,
    });

    // ピリオドボタン押下時の処理を実行
    this._onChangePeriod(this.state.selected_period, option);
  }

  _dropdown_renderButtonText(rowData) {
    const {label, value} = rowData;
    return `${label}`;
  }

  _dropdown_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;

    return (
      <View style={[styles.dropdown_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
        <Text style={[styles.dropdown_row_text, , StatsViewerStyles.dropdown_row_text_custom, highlighted && {color: 'blue', fontWeight: 'bold'}]}>
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

  // BoxScore、Advanced切り替えボタン押下時
  _switch = () => {
    if(this.state.switch_buttom.value === 0) {
      this.setState({
        isDisplayBoxscore: 'none' ,
        isDisplayAdvanced: 'block',
        label_statstitle: 'Advanced',
        switch_buttom: { label: 'BoxScore', value: 1 },
      });
    } else {
      this.setState({
        isDisplayBoxscore: 'block' ,
        isDisplayAdvanced: 'none',
        label_statstitle: 'BoxScore',
        switch_buttom: { label: 'Advanced', value: 0 },
      });
    }
  }

  // CSV出力ボタン押下時のイベント
  _export = () => {
    let header_team = '', header_player = '';
    let csvDatas_team = [], csvDatas_player = [];
    let prefix_team = '', prefix_player = '';

    if (this.state.switch_buttom.value === 0 ) {
      // Boxscore
      // CSVヘッダー
      header_team = Constants.BSS_HEADER.TEAM;
      header_player = Constants.BSS_HEADER.PLAYER;

      // CSVデータ
      csvDatas_team = this.state.boxscoreTeamStats;
      csvDatas_player = this.state.boxscorePlayerStats;

      // ファイル名 接頭辞
      prefix_team = Constants.BSS_PREFIX.TEAM;
      prefix_player = Constants.BSS_PREFIX.PLAYER;

    } else {
      // Advanced
      // CSVヘッダー
      header_team = Constants.AS_HEADER.TEAM;
      header_player = Constants.AS_HEADER.PLAYER;
      // CSVデータ
      csvDatas_team = this.state.advancedTeamStats_top;
      const csvDatas_bottom = this.state.advancedTeamStats_bottom;
      for(let i = 0; i < csvDatas_team.length; i++) {
        csvDatas_team[i].push(csvDatas_bottom[i]);
      }
      csvDatas_player = this.state.advancedPlayerStats;

      // ファイル名 接頭辞
      prefix_team = Constants.AS_PREFIX.TEAM;
      prefix_player = Constants.AS_PREFIX.PLAYER;

    }

    // ピリオド項目を先頭に追加
    for(let i = 0; i < csvDatas_team.length; i++) {
      csvDatas_team[i].unshift(this.state.selected_period.label);
    }
    // ピリオド項目を先頭に追加
    for(let i = 0; i < csvDatas_player.length; i++) {
      csvDatas_player[i].unshift(this.state.selected_period.label);
    }

    // ファイル名
    const str = '(' + this.state.selected_team.label + ')' + '_' + 
    this.state.date.value + '_' + this.state.event.label + '_' + this.state.stage.label;
    const filename_team = prefix_team + str;
    const filename_player = prefix_player + str;
    // CSV出力
    ExportCSV(header_team, header_player, csvDatas_team, csvDatas_player, filename_team, filename_player);

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

  // ホームアイコン押下時
  _gohome = () => {
    // メニュー画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.MENU, { 'user_id': this.state.username });
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

        // プレイヤー情報取得
        const param3 = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: this.state.cognitoUser.username,
          sk: Constants.SK_TYPE.PLAYER,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ.getAccessToken().getJwtToken(), param3, Constants.SK_TYPE.PLAYER, Constants.API_NAME.INFO);

        // Stats情報取得
        const param2 = {
          game_id: this.state.game_id,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ.getAccessToken().getJwtToken(), param2, null, Constants.API_NAME.STATS_VIEWER);

        // Game情報取得
        const param1 = {
          category: Constants.QUERY_PATTERN.TYPE_0,
          pk: cognitoUser.username,
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
                starters_home : item.starters_home ? item.starters_home : 0,
                starters_visitor : item.starters_visitor ? item.starters_visitor : 0,
                subs_home : item.subs_home ? item.subs_home : 0,
                subs_visitor : item.subs_visitor ? item.subs_visitor : 0,
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
            this.setState({ scoreDatas: datas });

            // Starters, Subsデータ格納
            this.setState({ starterListHome : scoreinfo[0].starters_home})
            this.setState({ starterListVisitor : scoreinfo[0].starters_visitor})
            this.setState({ subListHome : scoreinfo[0].subs_home})
            this.setState({ subListVisitor : scoreinfo[0].subs_visitor})

          } else if(type === Constants.SK_TYPE.PLAYER) {
              // プレイヤー情報取得
              response.data.Items.forEach(function(item, index) {
                playerinfo.push({
                  player_id: item.sk,
                  player_name: item.info_name,
                });
              })

          } else {
            if(response.data.length === 0) {
              console.log("該当のデータが存在しません");
              // ローディングスピナークローズ
              this.setState({ isLoadingVisible: false, });
              return;
            }

            // スタッツ情報取得
            const statsinfo = [];
            response.data[0].forEach(function(item, index) {
              statsinfo.push({
                game_id: item.game_id,
                timestamp: item.timestamp,
                add_time: item.add_time,
                add_user: item.add_user,
                check_flag: item.check_flag,
                connection_id: item.connection_id,
                coordinate: item.coordinate,
                conv_coordinate: item.conv_coordinate,
                ft1: item.ft1,
                ft2: item.ft2,
                ft3: item.ft3,
                game_time: item.game_time,
                main_tag: item.main_tag,
                sub_tag: item.sub_tag,
                period: item.period,
                player_id: item.player_id,
                player_name: item.player_name,
                player_num: item.player_num,
                point: item.point,
                shot_area: item.shot_area,
                shot_result: item.shot_result,
                team_id: item.team_id,
                team_name: item.team_name,
                update_time: item.update_time,
                update_user: item.update_user,
                insert_num: item.insert_num,
                start_type: item.start_type,
              });
            })
            const home_id = this.state.teamList[0].value;
            const visitor_id = this.state.teamList[1].value;
            const statsinfo_home = statsinfo.filter(function(obj) { return obj.team_id === home_id });
            const statsinfo_visitor = statsinfo.filter(function(obj) { return obj.team_id === visitor_id });

            const connection_id = response.data[1];
            const starters_home = this.state.starterListHome;
            const starters_visitor = this.state.starterListVisitor;
            const subs_home = this.state.subListHome;
            const subs_visitor = this.state.subListVisitor;

            // ボックススコアチームスタッツ
            const boxscoreTeamStats_home = GetBoxScoreTeam(statsinfo_home, connection_id);
            const boxscoreTeamStats_visitor = GetBoxScoreTeam(statsinfo_visitor, connection_id);
            // ボックススコアプレイヤースタッツ
            const boxscorePlayerStats_home = GetBoxScorePlayer(statsinfo_home, connection_id, starters_home, subs_home, playerinfo);
            const boxscorePlayerStats_visitor = GetBoxScorePlayer(statsinfo_visitor, connection_id, starters_visitor, subs_visitor, playerinfo);
            // TeamVal
            const teamVal = GetTeamVal(boxscoreTeamStats_home, boxscoreTeamStats_visitor)
            // アドバンスドスタッツチーム
            const advancedTeamStats_home = GetAdvancedStatsTeam(boxscoreTeamStats_home[0], teamVal[0]);
            const advancedTeamStats_visitor = GetAdvancedStatsTeam(boxscoreTeamStats_visitor[0], teamVal[1]);
            // アドバンスドスタッツプレイヤー
            const advancedPlayerStats_home = GetAdvancedStatsPlayer(boxscorePlayerStats_home, teamVal[0]);
            const advancedPlayerStats_visitor = GetAdvancedStatsPlayer(boxscorePlayerStats_visitor, teamVal[1]);

            // 計算結果を格納
            this.setState({
              statsinfo: statsinfo,
              statsinfo_home: statsinfo_home,
              statsinfo_visitor: statsinfo_visitor,
              connection_id: connection_id,
              boxscoreTeamStats: [boxscoreTeamStats_home[0]],
              boxscoreTeamStats_home: [boxscoreTeamStats_home[0]],
              boxscoreTeamStats_visitor: [boxscoreTeamStats_visitor[0]],
              boxscorePlayerStats: boxscorePlayerStats_home,
              boxscorePlayerStats_home: boxscorePlayerStats_home,
              boxscorePlayerStats_visitor: boxscorePlayerStats_visitor,
              advancedTeamStats_top: [advancedTeamStats_home.slice(0, 14)],
              advancedTeamStats_top_home: [advancedTeamStats_home.slice(0, 14)],
              advancedTeamStats_top_visitor: [advancedTeamStats_visitor.slice(0, 14)],
              advancedTeamStats_bottom: [advancedTeamStats_home.slice(14, 24)],
              advancedTeamStats_bottom_home: [advancedTeamStats_home.slice(14, 24)],
              advancedTeamStats_bottom_visitor: [advancedTeamStats_visitor.slice(14, 24)],
              advancedPlayerStats: advancedPlayerStats_home,
              advancedPlayerStats_home: advancedPlayerStats_home,
              advancedPlayerStats_visitor: advancedPlayerStats_visitor,
            });
          }

          // ローディングスピナークローズ
          this.setState({ isLoadingVisible: false, });

        } else {
          // PUT処理なし
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
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    const w = this.state.width;
    // テーブルの幅
    const flexScoreArr = [w*0.274, w*0.087, w*0.087, w*0.087, w*0.087, w*0.087, w*0.087, w*0.087, w*0.087];
    const flexArr_1 = [w*0.050, w*0.090, w*0.090, w*0.090, w*0.090, w*0.090, w*0.045, w*0.150, w*0.045, w*0.045, w*0.045, w*0.045, w*0.090];
    const flexArr_2 = [w*0.050, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.050, w*0.050, w*0.050, w*0.045, w*0.045, w*0.045, w*0.045, w*0.090];
    const flexArr_3 = [w*0.035, w*0.115, w*0.030, w*0.045, w*0.070, w*0.070, w*0.070, w*0.070, w*0.070, w*0.035, w*0.135, w*0.040, w*0.040, w*0.040, w*0.040, w*0.060];
    const flexArr_4 = [w*0.035, w*0.115, w*0.030, w*0.045, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.035, w*0.045, w*0.045, w*0.045, w*0.040, w*0.040, w*0.040, w*0.040, w*0.060];
    const flexArr_5 = [w*0.050, w*0.160, w*0.320, w*0.434];
    const flexArr_6 = [w*0.050, w*0.080, w*0.080, w*0.080, w*0.080, w*0.080, w*0.080, w*0.062, w*0.062, w*0.062, w*0.062, w*0.062, w*0.062, w*0.062];
    const flexArr_7 = [w*0.530, w*0.186]
    const flexArr_8 = [w*0.050, w*0.080, w*0.080, w*0.080, w*0.080, w*0.080, w*0.080, w*0.062, w*0.062, w*0.062];
    const flexArr_9 = [w*0.035, w*0.115, w*0.040, w*0.321, w*0.315, w*0.080, w*0.060];
    const flexArr_10 = [w*0.035, w*0.115, w*0.040, w*0.045, w*0.045, w*0.045, w*0.048, w*0.048, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.045, w*0.040, w*0.040, w*0.060];

    return (
      // <ImageBackground
      //   source={imgPath}
      //   style={styles.bgImage}
      //   imageStyle={{resizeMode: 'repeat'}}>
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
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.info_area]}>
          <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>Date : {this.state.date.label}</Text>
          <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>Event : {this.state.event.label}</Text>
          <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>Stage : {this.state.stage.label}</Text>
          <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>Game : {this.state.game_card.label}</Text>
        </View>

        {/* スコアテーブル */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.score_area]}>
          <View style={[styles.column, StatsViewerStyles.score_area_inner]}>
            <View style={[{flex: 1}]}>
              {/* テーブルヘッダー */}
              <Table>
                {
                  this.state.scoreTableHead.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexScoreArr[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderTopWidth: 0.5, borderLeftWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.scoreTableText_custom]}
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
                      {flexDirection: 'row'},
                      ]}
                    >
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexScoreArr[cellIndex]}
                            style={[
                              {borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                              index%2 ? {backgroundColor: '#F7F6E7'} : {backgroundColor: '#FFF1C1'}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableText, StatsViewerStyles.scoreTableText_custom]}
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
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.button_area]}>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._onChangePeriod(this.state.period_all, this.state.selected_team)}>
            <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>{this.state.period_all.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._onChangePeriod(this.state.period_q1, this.state.selected_team)}>
            <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>{this.state.period_q1.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._onChangePeriod(this.state.period_q2, this.state.selected_team)}>
            <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>{this.state.period_q2.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._onChangePeriod(this.state.period_q3, this.state.selected_team)}>
            <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>{this.state.period_q3.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._onChangePeriod(this.state.period_q4, this.state.selected_team)}>
            <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>{this.state.period_q4.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._onChangePeriod(this.state.period_ot, this.state.selected_team)}>
            <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>{this.state.period_ot.label}</Text>
          </TouchableOpacity>

          {/* 余白 */}
          {/* <View paddingHorizontal={w*0.028}/> */}

          <View>
            <View style={[styles.row, StatsViewerStyles.other_button_area]}>
              {/* チームドロップダウン */}
              <View style={styles.cell}>
                <ModalDropdown 
                  ref="dropdown1"
                  style={[styles.dropdown, StatsViewerStyles.dropdown_custom]}
                  textStyle={[styles.dropdown_text, StatsViewerStyles.dropdown_text_custom]}
                  dropdownStyle={[styles.dropdown_dropdown, StatsViewerStyles.dropdown_dropdown_custom, {height: hp(this.state.teamList.length * 4.5)}]}
                  defaultValue={this.state.defaultValue.label}
                  defaultTextStyle={[styles.defaultTextStyle, StatsViewerStyles.defaultTextStyle_custom]}
                  options={this.state.teamList}
                  renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                  renderRow={this._dropdown_renderRow.bind(this)}
                  renderRowComponent={TouchableHighlight}
                  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                  onSelect={(option, index) => this._onTeamChange(option, index)}
                />
              </View>

              {/* データ表示切り替えボタン */}
              <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this._switch()}>
                <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>
                {this.state.switch_buttom.label}
                </Text>
              </TouchableOpacity>
              {/* データ更新ボタン */}
              <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this.init()}>
                <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>
                  <Icon style={[styles.icon_sync]} name='sync-alt'/>
                </Text>
              </TouchableOpacity>
              {/* 選択画面へ遷移するボタン */}
              <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._gameSelection()}>
                <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>
                  <MCIcon style={[styles.icon_sync]} name='form-select'/>
                </Text>
              </TouchableOpacity>
              {/* メニュー画面に戻るボタン */}
              <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._gohome()}>
                <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>
                <Icon style={[styles.icon_sync]} name='home'/>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* タイトル */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.boxscore_title_area]}>
            <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>{this.state.label_statstitle} 【 {this.state.selected_team.label} 】</Text>
            {/* CSV出力ボタン */}
            <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => this._export()}>
              <Text style={[styles.buttonText, StatsViewerStyles.buttonText_custom]}>
                <Icon style={[styles.icon_sync]} name='file-export'/>
              </Text>
            </TouchableOpacity>
        </View>
        {/* チームスタッツタイトル */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.boxscore_title_area]}>
          <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>Team Stats</Text>
        </View>

        {/* ボックススコアチームスタッツ */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.teamstats_table_area, {display: this.state.isDisplayBoxscore,}]}>
          <View style={[styles.column, StatsViewerStyles.table_area_inner,]}>
            <View style={[{flex: 1}]}>
              {/* テーブルヘッダー */}
              <Table>
                {
                  this.state.tableHead_1.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_1[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderTopWidth: 0.5, borderRightWidth: 0.5},
                              ( cellIndex !== 0 && cellIndex !== 6 && cellIndex !== 8 && cellIndex !== 9 &&
                                cellIndex !== 10 && cellIndex !== 11 && cellIndex !== 12
                              ) ? {borderBottomWidth: 0.5} : {borderBottomWidth: 0},
                              ( cellIndex === 0) ? {borderLeftWidth: 0.5} : {borderLeftWidth: 0}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
                </Table>
                <Table>
                {
                  this.state.tableHead_2.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_2[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderRightWidth: 0.5, borderBottomWidth: 0.5},
                            ( cellIndex === 0) ? {borderLeftWidth: 0.5} : {borderLeftWidth: 0}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
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
                  this.state.boxscoreTeamStats.map((rowData, index) => (
                    <TableWrapper
                    key={index}
                    style={[
                      {flexDirection: 'row'},
                      styles.tableRow,
                      index%2 && {backgroundColor: '#F7F6E7'}
                      ]}
                    >
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_2[cellIndex]}
                            style={[
                              {borderRightWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === 0) ? {borderLeftWidth: 0.5} : {borderLeftWidth: 0}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableText, StatsViewerStyles.tableText_custom]}
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

        {/* アドバンスドチームスタッツ */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.teamstats_advanced_table_area, {display: this.state.isDisplayAdvanced,}]}>
          <View style={[styles.column, StatsViewerStyles.table_area_inner,]}>
            {/* アドバンスドスタッツテーブル上段 */}
            <View style={[{flex: 1}]}>
              {/* テーブルヘッダー */}
              <Table>
                {
                  this.state.advancedTableHead_top1.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_5[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                              ( cellIndex !== 0 ) ? {borderBottomWidth: 0.5} : {borderBottomWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
                </Table>
                <Table>
                {
                  this.state.advancedTableHead_top2.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_6[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
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
                  this.state.advancedTeamStats_top.map((rowData, index) => (
                    <TableWrapper
                    key={index}
                    style={[
                      {flexDirection: 'row'},
                      styles.tableRow,
                      index%2 && {backgroundColor: '#F7F6E7'}
                      ]}
                    >
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_6[cellIndex]}
                            style={[{borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableText, StatsViewerStyles.tableText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
              </Table>
            </View>

            {/* アドバンスドスタッツテーブル下段 */}
            <View style={[{flex: 1}]}>
              {/* テーブルヘッダー */}
              <Table>
                {
                  this.state.advancedTableHead_bottom1.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_7[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderTopWidth: 0.5, borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
                </Table>
                <Table>
                {
                  this.state.advancedTableHead_bottom2.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_8[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
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
                  this.state.advancedTeamStats_bottom.map((rowData, index) => (
                    <TableWrapper
                    key={index}
                    style={[
                      {flexDirection: 'row'},
                      ]}
                    >
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_8[cellIndex]}
                            style={[
                              {borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                              index%2 ? {backgroundColor: '#F7F6E7'} : {backgroundColor: '#FFF1C1'}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableText, StatsViewerStyles.tableText_custom]}
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

        {/* プレイヤースタッツタイトル */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.boxscore_title_area]}>
          <Text style={[styles.labelText, StatsViewerStyles.labelText_custom]}>Player Stats</Text>
        </View>
        {/* ボックススコアプレイヤースタッツ */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.boxscore_pleyer_table_area, {display: this.state.isDisplayBoxscore,}]}>
          <View style={[styles.column, StatsViewerStyles.table_area_inner,]}>
            <View style={[{flex: 1}]}>
              {/* テーブルヘッダー */}
              <Table>
                {
                  this.state.boxscorePlayerHead_1.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_3[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderTopWidth: 0.5, borderRightWidth: 0.5},
                              ( cellIndex !== 0 && cellIndex !== 1 && cellIndex !== 2 && cellIndex !== 3 &&
                                cellIndex !== 9 && cellIndex !== 11 && cellIndex !== 12 && cellIndex !== 13 &&
                                cellIndex !== 14 && cellIndex !== 15
                                ) ? {borderBottomWidth: 0.5} : {borderBottomWidth: 0},
                              ( cellIndex === 0) ? {borderLeftWidth: 0.5} : {borderLeftWidth: 0}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
                </Table>
                <Table>
                {
                  this.state.boxscorePlayerHead_2.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_4[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderRightWidth: 0.5, borderBottomWidth: 0.5},
                            ( cellIndex === 0) ? {borderLeftWidth: 0.5} : {borderLeftWidth: 0}
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
              </Table>

              {/* テーブルデータ */}
              <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                <Table>
                  {
                    this.state.boxscorePlayerStats.map((rowData, index) => (
                      <TableWrapper
                      key={index}
                      style={[
                        {flexDirection: 'row'},
                        styles.tableRow,
                        index%2 && {backgroundColor: '#F7F6E7'}
                        ]}
                      >
                        {
                          rowData.map((cellData, cellIndex) => (
                            <Cell
                              width={flexArr_4[cellIndex]}
                              style={[
                                {borderRightWidth: 0.5, borderBottomWidth: 0.5},
                                ( cellIndex === 0) ? {borderLeftWidth: 0.5} : {borderLeftWidth: 0}
                              ]}
                              key={cellIndex}
                              data={cellData}
                              textStyle={[styles.tableText, StatsViewerStyles.tableText_custom]}
                            />
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
        </View>

        {/* アドバンスドプレイヤースタッツ */}
        <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.advanced_pleyer_table_area, {display: this.state.isDisplayAdvanced,}]}>
          <View style={[styles.column, StatsViewerStyles.table_area_inner,]}>
            <View style={[{flex: 1}]}>
              {/* テーブルヘッダー */}
              <Table>
                {
                  this.state.advancedPlayerHead_1.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_9[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderTopWidth: 0.5, borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                              ( cellIndex !== 0 && cellIndex !== 1 && cellIndex !== 2 && cellIndex !== 6 ) ? {borderBottomWidth: 0.5} : {borderBottomWidth: 0},                          ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
                </Table>
                <Table>
                {
                  this.state.advancedPlayerHead_2.map((rowData, index) => (
                    <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                            width={flexArr_10[cellIndex]}
                            style={[{backgroundColor: '#006a6c', borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                              ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                            ]}
                            key={cellIndex}
                            data={cellData}
                            textStyle={[styles.tableHeadText, StatsViewerStyles.tableHeadText_custom]}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
              </Table>

              {/* テーブルデータ */}
              <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop: -1}]}>
                <Table>
                  {
                    this.state.advancedPlayerStats.map((rowData, index) => (
                      <TableWrapper
                      key={index}
                      style={[
                        {flexDirection: 'row'},
                        styles.tableRow,
                        index%2 && {backgroundColor: '#F7F6E7'}
                        ]}
                      >
                        {
                          rowData.map((cellData, cellIndex) => (
                            <Cell
                              width={flexArr_10[cellIndex]}
                              style={[{borderLeftWidth: 0.5, borderBottomWidth: 0.5},
                                ( cellIndex === rowData.length - 1 ) ? {borderRightWidth: 0.5} : {borderRightWidth: 0},
                              ]}
                              key={cellIndex}
                              data={cellData}
                              textStyle={[styles.tableText, StatsViewerStyles.tableText_custom]}
                            />
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
        </View>
      </View>
      // </ImageBackground>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(StatsViewer);