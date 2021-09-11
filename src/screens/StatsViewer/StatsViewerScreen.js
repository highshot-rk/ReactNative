/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
  Button
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation, createAppContainer } from "react-navigation";
// タブ対応
import { createMaterialTopTabNavigator, useRoute } from "react-navigation-tabs";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// テーブル表示
import { Table, TableWrapper, Row, Rows, Cell } from 'react-native-table-component';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// スイッチボタン
import SwitchButton from 'switch-button-react-native';
// 音声機能
import * as Speech from 'expo-speech';
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
import ScoreTab from './tabs/scoreScreen';
import BoxScoreTab from './tabs/boxScoreScreen';
import ASTTab from './tabs/advancedStatsTeamScreen';
import ASPTab from './tabs/advancedStatsPlayerScreen';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;
const playerinfo = [];

class AppTabNavigation extends React.Component {
  render() {
    const { navigation } = this.props;
    const { routes, index } = this.props.navigation.state;
    const {
      containerStyle,
      tabStyle,
      selectedTabStyle,
      textStyle,
      selectedTextStyle,
    } = styles;
    const naviTitles = [
      "Score",
      "Box Score",
      "Advanced Stats Team",
      "Advanced Stats Player",
    ]
    const params = {
      dummy: 'test'
    }
    return (
      <View style={containerStyle}>
        {routes.map((route, idx) => {
          if (index === idx) {
            return (
              <View key={idx} style={[tabStyle, selectedTabStyle]}>
                <Text style={[textStyle, selectedTextStyle]}>{naviTitles[idx]}</Text>
              </View>
            );
          }
          return (
            <TouchableOpacity
              style={tabStyle}
              key={idx}
              // onPress={() => { navigation.navigate({name:route.routeName, params: params, merge: true}); }}
              onPress={() => { navigation.navigate(route.routeName); }}
            >
              <Text style={textStyle}>{naviTitles[idx]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const RootStack = createMaterialTopTabNavigator(
  {
    Score: {
      screen: ScoreTab,
    },
    BoxScore: {
      screen: BoxScoreTab,
    },
    AdvancedStatsTeam: {
      screen: ASTTab,
    },
    AdvancedStatsPlayer: {
      screen: ASPTab,
    },
  },
  {
    initialRouteName: 'Score',
    tabBarComponent: AppTabNavigation,
  }
);

const AppContainer = createAppContainer(RootStack)

// 親クラス
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

      buttonStyles: [
        {button: styles.button_rp, text: styles.buttonText_black},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
      ],
      // 最終的には前画面で選択された試合情報からタイトルを取得する
      title: '2021/8/17 インターカレッジ 1回戦',

      // チーム名
      teams: ['青山学院', '早稲田'],
      selectedTeam: '',
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

      // ボタン押下時の挙動
      initialState: [
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ],
      buttonStyles: [
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ],
      team: '青山学院',
      period: 'All',
      tableScore: [
        ['', '青山学院', 13, 17, 14, 16, 0, 60, 4, 1],
        ['', '早稲田', 16, 8, 15, 13, 0, 52, 5, 0],
      ],
      boxScore: [
        ['', 'Team', '', 56, 6, 19, 15, 38, 12, 31, 3, 7, 8, 13, 16, 8, 17, 25, 7, 11, 5, 19, '200:00'],
        ['#1', 'Player1', '', 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, '6:10'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 3, 0, 2, 0, 1, 0, 0, 2, 0, 0, 0, 2, 1, 0, 2, '21:23'],
        ['#6', 'Player6', '●', 3, 0, 0, 1, 4, 1, 4, 0, 0, 1, 2, 2, 1, 1, 2, 0, 0, 0, 0, '7:15'],
        ['#7', 'Player7', '●', 14, 0, 3, 6, 8, 4, 6, 2, 2, 2, 4, 1, 1, 4, 5, 0, 3, 1, 2, '2:47'],
        ['#10', 'Player10', '●', 15, 5, 7, 0, 2, 0, 2, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, '20:53'],
        ['#15', 'Player15', '', 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 1, 2, '14:06'],
        ['#17', 'Player17', '', 8, 0, 1, 3, 9, 2, 7, 1, 2, 2, 2, 4, 1, 0, 1, 1, 1, 0, 0, '17:05'],
        ['#20', 'Player20', '', 6, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 4, 5, 0, 3, 0, 2, '7:15'],
        ['#34', 'Player34', '', 3, 0, 2, 1, 3, 1, 3, 0, 0, 1, 2, 1, 2, 1, 3, 2, 1, 0, 3, '20:39'],
        ['#36', 'Player36', '●', 7, 1, 4, 1, 4, 1, 3, 0, 1, 2, 2, 2, 2, 4, 6, 2, 1, 3, 8, '10:27'],
      ],
      advancedStatsTeam: [
        [81.7, 0.69, 0.91, 23.5, 39.5, 38.7, 42.9, 31.6, 42.1, 44.6, 61.5, 22.8, 54.4, 12.3],
      ],
      advancedStatsPlayer: [
        ['#1', 'Player1', '', '0', '0', '-', '0', '0', '0', '-', '2.2', '-', '-', '50', '50', '0', '0'],
        ['#2', 'Player2', '●', '-', '0', '0', '0', '0', '0', '-', '5.6', '-', '66.7', '33.3', '0', '28.6', '28.6'],
        ['#6', 'Player6', '●', '-', '25', '25', '-', '25', '30.7', '50', '5.4', '50', '100', '-', '0', '0', '0'],
        ['#7', 'Player7', '●', '0', '75', '66.7', '100', '54.5', '54.9', '50', '16.5', '36.4', '54.5', '18.2', '27.3', '0', '13.6'],
        ['#10', 'Player10', '●', '71.4', '0', '0', '-', '83.3', '83.3', '-', '10', '-', '22.2', '-', '77.8', '0', '0'],
        ['#15', 'Player15', '', '0', '0', '0', '-', '0', '0', '-', '4.5', '-', '50', '-', '50', '0', '50'],
        ['#17', 'Player17', '', '0', '33.3', '28.6', '50', '30', '36.8', '100', '12.1', '20', '70', '20', '10', '8.4', '0'],
        ['#20', 'Player20', '', '-', '100', '100', '-', '100', '87.2', '0', '6.1', '33.3', '100', '-', '0', '0', '36.8'],
        ['#34', 'Player34', '', '0', '33.3', '33.3', '-', '20', '25.5', '50', '9.9', '40', '60', '-', '40', '18.4', '27.6'],
        ['#36', 'Player36', '●', '25', '25', '33.3', '0', '31.2', '39.4', '100', '18.8', '25', '37.5', '12.5', '50', '10.6', '42.4'],
      ],
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

  _onChangeTeam(period){
    if(period=='All'){
      newText= [
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ]
      setState(newState)
      // 押したボタンに応じて、描画するための元データを変更する処理
    }
  }

  _onClickPeriod(period){
    var newState;
    if(period=='All'){
      newState = [
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ]
      // this.setState({
      //   buttonStyles: newState,
      //   temp_period: 'All',
      // })
      // this.state.buttonStyles = newState
      // 押したボタンに応じて、描画するための元データを変更する処理
    }else if(period=='Q1'){
      newState= [
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ]
      // this.setState({
      //   buttonStyles: newState,
      //   temp_period: 'Q1',
      // })
    }else if(period=='Q2'){
      newState= [
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ]
      // this.setState({
      //   buttonStyles: newState,
      //   temp_period: 'Q2',
      // })
      // this.state.buttonStyles = newState
    }else if(period=='Q3'){
      newState= [
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ]
      // this.setState({
      //   buttonStyles: newState,
      //   temp_period: 'Q3',
      // })
      // this.state.buttonStyles = newState
    }else if(period=='Q4'){
      newState= [
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm, text: styles.buttonText_black},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
      ]
      // this.setState({
      //   buttonStyles: newState,
      //   temp_period: 'Q4',
      // })
    }else if(period=='OT'){
      newState= [
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},
        {button: styles.button_rp_sm_sk, text: styles.buttonText},    
        {button: styles.button_rp_sm, text: styles.buttonText_black},
      ]
      // this.setState({
      //   buttonStyles: newState,
      //   temp_period: 'OT',
      // })
    }
    // 押したボタンに応じて表示するデータをフィルタリングする
    this.filterScore(this.state.team, period, newState)
  }

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
  // _onTeamChange = (option, index) => {
  //   this.setState({
  //     defaultValue: option,
  //     selected_team: option,
  //   });

  //   // ピリオドボタン押下時の処理を実行
  //   this._onChangePeriod(this.state.selected_period, option);
  // }

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

  _onTeamChange = (val) => {
    var team = ''
    if(val ==1){
      // this.setState({
      //   // selectedTeam: this.state.teams[0]
      //   temp_team: this.state.teams[0]
      // })
      team = this.state.teams[0]
    }else {
      // this.setState({
      //   // selectedTeam: this.state.teams[1]
      //   temp_team: this.state.teams[1]
      // })        
      team = this.state.teams[1]
    }
    console.log(this.state.temp_team)
    console.log(this.state.team)
    console.log(this.state.temp_period)
    console.log(this.state.period)
    // new ScoreTab.refreshScoreTab()
    // this.props.navigation.navigate('Button','test')
    this.filterScore(team, this.state.period, this.state.buttonStyles)
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

  speak = (num, speekerNum, rate, pitch) => {
    const speechList = [
      'こんにちは',
      'ボイスアシスタンスを起動します。',
      '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニヤーニヤー泣いてゐた事だけは記憶してゐる。',
      "Oh, say can you see, by the dawn's early light What so proudly we hailed at the twilight's last gleaming? Whose broad stripes and bright stars, through the perilous fight. O'er the ramparts we watchedwere so gallantly streaming?",
      'Activate Voice Assistance',
      'test6'
    ]
    const speekers = [
      'com.apple.ttsbundle.Kyoko-compact',
      'com.apple.ttsbundle.Otoya-premium'
    ]
    const thingToSay = '6番比江島選手のThreeポイント成功率が40%を超えました。';
    // Speech.speak(thingToSay);
  
    // Speech.speak(speechList[num], {language: lang, rate: rate, pitch: pitch, name: Hattori});
    Speech.stop();
    // Speech.speak(speechList[num], {language: lang, rate: rate, pitch: pitch, identifier: "com.apple.ttsbundle.Otoya-compact",});
    Speech.speak(speechList[num], {language: speekerNum, rate: rate, pitch: pitch});
  };
  
  stop = () => {
    Speech.stop();
  };

  // 選択されたピリオドに応じてboxScoreTeamStatsを更新する
  filterScore = (team, period, styleState) => {
    console.log('filterScore')
    // Alert.alert(period)
    // Alert.alert(team)
    // console.log('filterScore')
    const newBoxScoreHome = {
      'All': [
        ['', 'Team', '', 56, 6, 19, 15, 38, 12, 31, 3, 7, 8, 13, 16, 8, 17, 25, 7, 11, 5, 19, '200:00'],
        ['#1', 'Player1', '', 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, '6:10'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 3, 0, 2, 0, 1, 0, 0, 2, 0, 0, 0, 2, 1, 0, 2, '21:23'],
        ['#6', 'Player6', '●', 3, 0, 0, 1, 4, 1, 4, 0, 0, 1, 2, 2, 1, 1, 2, 0, 0, 0, 0, '7:15'],
        ['#7', 'Player7', '●', 14, 0, 3, 6, 8, 4, 6, 2, 2, 2, 4, 1, 1, 4, 5, 0, 3, 1, 2, '2:47'],
        ['#10', 'Player10', '●', 15, 5, 7, 0, 2, 0, 2, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, '20:53'],
        ['#15', 'Player15', '', 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 1, 2, '14:06'],
        ['#17', 'Player17', '', 8, 0, 1, 3, 9, 2, 7, 1, 2, 2, 2, 4, 1, 0, 1, 1, 1, 0, 0, '17:05'],
        ['#20', 'Player20', '', 6, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 4, 5, 0, 3, 0, 2, '7:15'],
        ['#34', 'Player34', '', 3, 0, 2, 1, 3, 1, 3, 0, 0, 1, 2, 1, 2, 1, 3, 2, 1, 0, 3, '20:39'],
        ['#36', 'Player36', '●', 7, 1, 4, 1, 4, 1, 3, 0, 1, 2, 2, 2, 2, 4, 6, 2, 1, 3, 8, '10:27']
      ],
      'Q1': [
        ['', 'Team', '', 17, 2, 7, 3, 9, 2, 7, 1, 2, 5, 8, 5, 4, 2, 6, 2, 5, 0, 5, '50:00'],
        ['#1', 'Player1', '', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '1:06'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, '4:41'],
        ['#6', 'Player6', '●', 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 2, 2, 1, 1, 2, 0, 0, 0, 0, '3:12'],
        ['#7', 'Player7', '●', 4, 0, 2, 2, 2, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1, 0, 2, 0, 1, '7:04'],
        ['#10', 'Player10', '●', 6, 2, 2, 0, 2, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '4:41'],
        ['#15', 'Player15', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '1:30'],
        ['#17', 'Player17', '', 2, 0, 0, 0, 2, 0, 1, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, '5:19'],
        ['#20', 'Player20', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, '7:37'],
        ['#34', 'Player34', '', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 2, 0, 0, 0, 0, '5:19'],
        ['#36', 'Player36', '●', 4, 0, 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 1, 0, 1, 1, 1, 0, 3, '9:31'],
      ],
      'Q2': [
        ['', 'Team', '', 11, 1, 2, 3, 11, 2, 8, 1, 3, 2, 2, 4, 0, 5, 5, 3, 3, 1, 5, '50:00'],
        ['#1', 'Player1', '', 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, '3:19'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, '7:40'],
        ['#6', 'Player6', '●', 2, 0, 0, 1, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4:03'],
        ['#7', 'Player7', '●', 4, 0, 0, 1, 2, 0, 1, 1, 1, 2, 2, 0, 0, 2, 2, 0, 1, 1, 1, '7:49'],
        ['#10', 'Player10', '●', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '3:05'],
        ['#15', 'Player15', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, '3:13'],
        ['#17', 'Player17', '', 2, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, '4:53'],
        ['#20', 'Player20', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '4:55'],
        ['#34', 'Player34', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, '4:22'],
        ['#36', 'Player36', '●', 3, 1, 1, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, '6:41'],
      ],
      'Q3': [
        ['', 'Team', '', 10, 1, 3, 3, 10, 2, 9, 1, 1, 1, 2, 5, 3, 5, 8, 0, 3, 4, 8, '50:00'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '5:18'],
        ['#7', 'Player7', '●', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4:21'],
        ['#10', 'Player10', '●', 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '3:07'],
        ['#15', 'Player15', '', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, '5:39'],
        ['#17', 'Player17', '', 4, 0, 1, 2, 5, 1, 4, 1, 1, 0, 0, 2, 1, 0, 1, 0, 0, 0, 0, '6:53'],
        ['#20', 'Player20', '', 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 3, 4, 0, 2, 0, 2, '10:00'],
        ['#34', 'Player34', '', 1, 0, 0, 0, 2, 0, 2, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 2, '4:42'],
        ['#36', 'Player36', '●', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 3, 0, 0, 3, 3, '10:00'],
      ],
      'Q4': [
        ['', 'Team', '', 18, 2, 7, 6, 8, 6, 7, 0, 1, 0, 1, 2, 1, 5, 6, 2, 0, 0, 1, '50:00'],
        ['#1', 'Player1', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '1:45'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '3:44'],
        ['#7', 'Player7', '●', 6, 0, 1, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, '7:33'],
        ['#10', 'Player10', '●', 6, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, '10:00'],
        ['#15', 'Player15', '', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '3:44'],
        ['#20', 'Player20', '', 4, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, '8:43'],
        ['#34', 'Player34', '', 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, '6:16'],
        ['#36', 'Player36', '●', 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, '8:15'],      ],
    }

    const newBoxScoreVisitor = {
      'All': [
        ['', 'Team', '', 84, 7, 25, 26, 45, 20, 34, 6, 11, 11, 15, 13, 18, 28, 46, 8, 10, 2, 16, '200:00'],
        ['#10', 'Player10', '', 3, 1, 3, 0, 2, 0, 2, 0, 0, 0, 0, 0, 1, 2, 3, 0, 2, 0, 0, '11:43'],
        ['#11', 'Player11', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, '2:41'],
        ['#12', 'Player12', '', 18, 0, 2, 9, 10, 7, 8, 2, 2, 0, 0, 3, 3, 7, 10, 1, 3, 1, 2, '0:24'],
        ['#14', 'Player14', '', 4, 0, 0, 2, 4, 2, 3, 0, 1, 0, 0, 2, 1, 2, 3, 1, 2, 0, 1, '14:29'],
        ['#15', 'Player15', '●', 3, 1, 3, 0, 2, 0, 1, 0, 1, 0, 0, 2, 2, 2, 4, 0, 0, 0, 4, '19:29'],
        ['#16', 'Player16', '', 8, 0, 0, 3, 6, 2, 5, 1, 1, 2, 4, 2, 5, 7, 12, 0, 1, 0, 2, '3:38'],
        ['#21', 'Player21', '', 7, 1, 2, 1, 3, 1, 3, 0, 0, 2, 2, 0, 2, 0, 2, 0, 0, 0, 0, '20:14'],
        ['#23', 'Player23', '', 13, 0, 0, 4, 9, 2, 5, 2, 4, 5, 5, 1, 0, 0, 0, 3, 2, 0, 2, '18:32'],
        ['#24', 'Player24', '', 7, 1, 4, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 2, 3, 0, 0, 0, 0, '14:10'],
        ['#28', 'Player28', '', 12, 3, 4, 1, 3, 0, 1, 1, 2, 1, 3, 0, 1, 1, 2, 1, 0, 0, 1, '16:03'],
        ['#34', 'Player34', '●', 7, 0, 3, 3, 3, 3, 3, 0, 0, 1, 1, 1, 1, 4, 5, 1, 0, 1, 2, '18:12'],
        ['#35', 'Player35', '', 2, 0, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, '10:00'],
        ['#77', 'Player77', '', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '2:25'],    
      ],
      'Q1': [
        ['', 'Team', '', 22, 1, 6, 7, 10, 6, 8, 1, 2, 5, 7, 5, 6, 7, 13, 3, 2, 2, 6, '50:00'],
        ['#12', 'Player12', '', 8, 0, 2, 4, 4, 4, 4, 0, 0, 0, 0, 1, 1, 3, 4, 1, 2, 1, 1, '10:00'],
        ['#14', 'Player14', '', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, '1:44'],
        ['#15', 'Player15', '●', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, '5:25'],
        ['#16', 'Player16', '', 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 2, 0, 0, 0, 1, '8:16'],
        ['#21', 'Player21', '', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0:00'],
        ['#23', 'Player23', '', 4, 0, 0, 1, 2, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 2, 0, 0, 2, '10:00'],
        ['#28', 'Player28', '', 4, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 1, 0, 0, 0, 1, '4:35'],
        ['#34', 'Player34', '●', 5, 0, 1, 2, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 3, 0, 0, 1, 0, '10:00'],
      ],
      'Q2': [
        ['', 'Team', '', 27, 4, 7, 7, 9, 6, 7, 1, 2, 1, 3, 4, 1, 8, 9, 1, 3, 0, 4, '50:00'],
        ['#10', 'Player10', '', 3, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, '6:41'],
        ['#12', 'Player12', '', 4, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 2, 0, 1, 0, 1, '2:44'],
        ['#14', 'Player14', '', 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, '3:19'],
        ['#15', 'Player15', '●', 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, '3:19'],
        ['#16', 'Player16', '', 3, 0, 0, 1, 1, 1, 1, 0, 0, 1, 2, 1, 0, 1, 1, 0, 0, 0, 0, '6:41'],
        ['#21', 'Player21', '', 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '7:16'],
        ['#23', 'Player23', '', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, '4:11'],
        ['#24', 'Player24', '', 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, '4:55'],
        ['#28', 'Player28', '', 8, 2, 2, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, '5:49'],
        ['#34', 'Player34', '●', 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, '5:05'],
      ],
      'Q3': [
        ['', 'Team', '', 20, 1, 4, 6, 18, 3, 12, 3, 6, 5, 5, 2, 8, 6, 14, 2, 4, 0, 3, '50:00'],
        ['#10', 'Player10', '', 0, 0, 1, 0, 2, 0, 2, 0, 0, 0, 0, 0, 1, 1, 2, 0, 1, 0, 0, '5:02'],
        ['#12', 'Player12', '', 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, '4:21'],
        ['#14', 'Player14', '', 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '1:51'],
        ['#15', 'Player15', '●', 3, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, '8:04'],
        ['#16', 'Player16', '', 2, 0, 0, 1, 4, 0, 3, 1, 1, 0, 0, 0, 4, 4, 8, 0, 1, 0, 0, '10:00'],
        ['#21', 'Player21', '', 2, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 0, 1, 0, 1, 0, 0, 0, 0, '5:39'],
        ['#23', 'Player23', '', 9, 0, 0, 3, 6, 2, 4, 1, 2, 3, 3, 0, 0, 0, 0, 0, 2, 0, 0, '4:21'],
        ['#24', 'Player24', '', 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '1:56'],
        ['#28', 'Player28', '', 0, 0, 0, 0, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, '5:39'],
        ['#34', 'Player34', '●', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, '3:07'],
      ],
      'Q4': [
        ['', 'Team', '', 15, 1, 8, 6, 8, 5, 7, 1, 1, 0, 0, 2, 3, 7, 10, 2, 1, 0, 3, '50:00'],
        ['#11', 'Player11', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, '2:41'],
        ['#12', 'Player12', '', 4, 0, 0, 2, 3, 1, 2, 1, 1, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, '7:19'],
        ['#14', 'Player14', '', 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, '7:35'],
        ['#15', 'Player15', '●', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, '2:41'],
        ['#16', 'Player16', '', 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, '2:41'],
        ['#21', 'Player21', '', 2, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, '7:19'],
        ['#24', 'Player24', '', 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, '7:19'],
        ['#35', 'Player35', '', 2, 0, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, '10:00'],
        ['#77', 'Player77', '', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '2:25'],
      ],
    }
    const newAdvancedScoreTeamHome = {
      'All': [
        [81.7, 0.69, 0.91, 23.5, 39.5, 38.7, 42.9, 31.6, 42.1, 44.6, 61.5, 22.8, 54.4, 12.3],
      ],
      'Q1': [
        [24.5, 0.69, 0.88, 19, 33.3, 28.6, 50, 28.6, 37.5, 43.5, 62.5, 50, 43.8, 12.5],
      ],
      'Q2': [
        [18.9, 0.58, 1.27, 15.5, 27.3, 25, 33.3, 50, 34.6, 39.6, 100, 15.4, 61.5, 23.1],
      ],
      'Q3': [
        [21.9, 0.46, 0.74, -10.3, 30, 22.2, 100, 33.3, 34.6, 36, 50, 15.4, 69.2, 7.7],
      ],
      'Q4': [
        [16.4, 1.09, 0.79, 53.7, 75, 85.7, 0, 28.6, 60, 58.3, 0, 6.7, 46.7, 6.7],
      ]
    }

    const newAdvancedScoreTeamVisitor = {
      'All': [
        [92.6, 0.91, 0.69, 76.5, 57.8, 58.8, 54.5, 28, 52.1, 54.8, 73.3, 21.4, 48.6, 15.7],
      ],
      'Q1': [
        [25.1, 0.88, 0.69, 81, 70, 75, 50, 16.7, 53.1, 57.7, 71.4, 43.8, 50, 12.5],
      ],
      'Q2': [
        [21.3, 1.27, 0.58, 84.5, 77.8, 85.7, 50, 57.1, 81.2, 77.9, 33.3, 18.8, 43.8, 12.5],
      ],
      'Q3': [
        [27.2, 0.74, 0.46, 110.3, 33.3, 25, 50, 25, 34.1, 41.3, 100, 22.7, 54.5, 27.3],
      ],
      'Q4': [
        [19, 0.79, 1.09, 46.3, 75, 71.4, 100, 12.5, 46.9, 46.9, '-', '-', 43.8, 6.2],
      ],
    }
    const newAdvancedStatsPlayerHome = {
      'All': [
        ['#1', 'Player1', '', '0', '0', '-', '0', '0', '0', '-', '2.2', '-', '-', '50', '50', '0', '0'],
        ['#2', 'Player2', '●', '-', '0', '0', '0', '0', '0', '-', '5.6', '-', '66.7', '33.3', '0', '28.6', '28.6'],
        ['#6', 'Player6', '●', '-', '25', '25', '-', '25', '30.7', '50', '5.4', '50', '100', '-', '0', '0', '0'],
        ['#7', 'Player7', '●', '0', '75', '66.7', '100', '54.5', '54.9', '50', '16.5', '36.4', '54.5', '18.2', '27.3', '0', '13.6'],
        ['#10', 'Player10', '●', '71.4', '0', '0', '-', '83.3', '83.3', '-', '10', '-', '22.2', '-', '77.8', '0', '0'],
        ['#15', 'Player15', '', '0', '0', '0', '-', '0', '0', '-', '4.5', '-', '50', '-', '50', '0', '50'],
        ['#17', 'Player17', '', '0', '33.3', '28.6', '50', '30', '36.8', '100', '12.1', '20', '70', '20', '10', '8.4', '0'],
        ['#20', 'Player20', '', '-', '100', '100', '-', '100', '87.2', '0', '6.1', '33.3', '100', '-', '0', '0', '36.8'],
        ['#34', 'Player34', '', '0', '33.3', '33.3', '-', '20', '25.5', '50', '9.9', '40', '60', '-', '40', '18.4', '27.6'],
        ['#36', 'Player36', '●', '25', '25', '33.3', '0', '31.2', '39.4', '100', '18.8', '25', '37.5', '12.5', '50', '10.6', '42.4'],
      ],
      'Q1': [
        ['#1', 'Player1', '', '0', '-', '-', '-', '0', '0', '-', '3.5', '-', '-', '-', '100', '0', '0'],
        ['#2', 'Player2', '●', '-', '0', '0', '-', '0', '0', '-', '3.5', '-', '100', '-', '0', '50', '0'],
        ['#6', 'Player6', '●', '-', '0', '0', '-', '0', '26.6', '50', '6.6', '200', '100', '-', '0', '0', '0'],
        ['#7', 'Player7', '●', '0', '100', '100', '100', '50', '41', '0', '20.6', '50', '25', '25', '50', '0', '17'],
        ['#10', 'Player10', '●', '100', '0', '0', '-', '75', '75', '-', '14', '-', '50', '-', '50', '0', '0'],
        ['#15', 'Player15', '', '-', '-', '-', '-', '-', '-', '-', '3.5', '-', '-', '-', '-', '0', '100'],
        ['#17', 'Player17', '', '-', '0', '0', '0', '0', '34.7', '100', '10.1', '100', '50', '50', '0', '0', '0'],
        ['#20', 'Player20', '', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '-', '-'],
        ['#34', 'Player34', '', '0', '-', '-', '-', '0', '0', '-', '3.5', '-', '-', '-', '100', '0', '0'],
        ['#36', 'Player36', '●', '0', '100', '100', '-', '50', '69.4', '100', '20.6', '100', '50', '-', '50', '14.5', '43.6'],
      ],
      'Q2': [
        ['#1', 'Player1', '', '-', '0', '-', '0', '0', '0', '-', '5.3', '-', '-', '100', '0', '0', '0'],
        ['#2', 'Player2', '●', '-', '0', '-', '0', '0', '0', '-', '10.6', '-', '-', '100', '0', '33.3', '33.3'],
        ['#6', 'Player6', '●', '-', '33.3', '33.3', '-', '33.3', '33.3', '-', '15.9', '-', '100', '-', '0', '0', '0'],
        ['#7', 'Player7', '●', '-', '50', '0', '100', '50', '69.4', '100', '20.6', '100', '50', '50', '0', '0', '25.8'],
        ['#10', 'Player10', '●', '0', '-', '-', '-', '0', '0', '-', '5.3', '-', '-', '-', '100', '0', '0'],
        ['#15', 'Player15', '', '-', '-', '-', '-', '-', '-', '-', '5.3', '-', '-', '-', '-', '0', '100'],
        ['#17', 'Player17', '', '-', '50', '50', '-', '50', '50', '-', '10.6', '-', '100', '-', '0', '33.3', '0'],
        ['#20', 'Player20', '', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '-', '-'],
        ['#34', 'Player34', '', '-', '-', '-', '-', '-', '-', '-', '5.3', '-', '-', '-', '-', '50', '50'],
        ['#36', 'Player36', '●', '100', '0', '0', '-', '50', '50', '-', '21.2', '-', '66.7', '-', '33.3', '0', '25'],
      ],
      'Q3': [
        ['#2', 'Player2', '●', '-', '-', '-', '-', '-', '-', '-', '4', '-', '-', '-', '-', '0', '100'],
        ['#7', 'Player7', '●', '-', '0', '0', '-', '0', '0', '-', '4', '-', '100', '-', '0', '0', '0'],
        ['#10', 'Player10', '●', '100', '-', '-', '-', '150', '150', '-', '4', '-', '-', '-', '100', '0', '0'],
        ['#15', 'Player15', '', '-', '0', '0', '-', '0', '0', '-', '4', '-', '100', '-', '0', '0', '0'],
        ['#17', 'Player17', '', '0', '40', '25', '100', '33.3', '33.3', '-', '24.1', '-', '66.7', '16.7', '16.7', '0', '0'],
        ['#20', 'Player20', '', '-', '100', '100', '-', '100', '100', '-', '12.1', '-', '100', '-', '0', '0', '66.7'],
        ['#34', 'Player34', '', '-', '0', '0', '-', '0', '17.4', '50', '19.6', '100', '100', '-', '0', '0', '41'],
        ['#36', 'Player36', '●', '0', '-', '-', '-', '0', '0', '-', '16.1', '-', '-', '-', '100', '0', '75'],
      ],
      'Q4': [
        ['#1', 'Player1', '', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '-', '-'],
        ['#2', 'Player2', '●', '-', '0', '0', '-', '0', '0', '-', '5.7', '-', '100', '-', '0', '0', '0'],
        ['#7', 'Player7', '●', '0', '100', '100', '-', '75', '75', '-', '22.9', '-', '75', '-', '25', '0', '0'],
        ['#10', 'Player10', '●', '66.7', '-', '-', '-', '100', '100', '-', '17.2', '-', '-', '-', '100', '0', '0'],
        ['#15', 'Player15', '', '0', '-', '-', '-', '0', '0', '-', '5.7', '-', '-', '-', '100', '0', '0'],
        ['#20', 'Player20', '', '-', '100', '100', '-', '100', '82', '0', '14', '50', '100', '-', '0', '0', '0'],
        ['#34', 'Player34', '', '0', '100', '100', '-', '50', '50', '-', '11.5', '-', '50', '-', '50', '33.3', '0'],
        ['#36', 'Player36', '●', '0', '0', '-', '0', '0', '0', '-', '17.2', '-', '-', '50', '50', '25', '25'],
      ]
    }

    const newAdvancedStatsPlayerVisitor = {
      'All': [
        ['#10', 'Player10', '', '33.3', '0', '0', '-', '30', '30', '-', '4.5', '-', '40', '-', '60', '0', '0'],
        ['#11', 'Player11', '', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '100', '0'],
        ['#12', 'Player12', '', '0', '90', '87.5', '100', '75', '75', '-', '12.7', '-', '66.7', '16.7', '16.7', '6.7', '13.3'],
        ['#14', 'Player14', '', '-', '50', '66.7', '0', '50', '50', '-', '4.5', '-', '75', '25', '0', '16.7', '16.7'],
        ['#15', 'Player15', '●', '33.3', '0', '0', '0', '30', '30', '-', '8.1', '-', '20', '20', '60', '0', '44.4'],
        ['#16', 'Player16', '', '-', '50', '40', '100', '50', '51.5', '50', '8.8', '66.7', '83.3', '16.7', '0', '0', '20.5'],
        ['#21', 'Player21', '', '50', '33.3', '33.3', '-', '50', '59.5', '100', '5.3', '40', '60', '-', '40', '0', '0'],
        ['#23', 'Player23', '', '-', '44.4', '40', '50', '44.4', '58', '100', '11.9', '55.6', '55.6', '44.4', '0', '18.5', '12.3'],
        ['#24', 'Player24', '', '25', '100', '100', '-', '58.3', '58.3', '-', '5.4', '-', '33.3', '-', '66.7', '0', '0'],
        ['#28', 'Player28', '', '75', '33.3', '0', '50', '78.6', '72.1', '33.3', '8.4', '42.9', '14.3', '28.6', '57.1', '9.7', '9.7'],
        ['#34', 'Player34', '●', '0', '100', '100', '-', '50', '54.3', '100', '7.6', '16.7', '50', '-', '50', '10.6', '21.2'],
        ['#35', 'Player35', '', '0', '100', '100', '-', '25', '25', '-', '3.6', '-', '25', '-', '75', '0', '0'],
        ['#77', 'Player77', '', '0', '-', '-', '-', '0', '0', '-', '0.9', '-', '-', '-', '100', '0', '0'],
      ],
      'Q1': [
        ['#12', 'Player12', '', '0', '100', '100', '-', '66.7', '66.7', '-', '22.5', '-', '66.7', '-', '33.3', '12.5', '12.5'],
        ['#14', 'Player14', '', '-', '0', '0', '-', '0', '0', '-', '3.2', '-', '100', '-', '0', '0', '0'],
        ['#15', 'Player15', '●', '-', '0', '0', '-', '0', '0', '-', '6.4', '-', '100', '-', '0', '0', '50'],
        ['#16', 'Player16', '', '-', '-', '-', '-', '-', '56.8', '50', '6', '-', '-', '-', '-', '0', '53.2'],
        ['#21', 'Player21', '', '0', '-', '-', '-', '0', '0', '-', '3.2', '-', '-', '-', '100', '0', '0'],
        ['#23', 'Player23', '', '-', '50', '-', '50', '50', '69.4', '100', '15.7', '100', '-', '100', '0', '29.1', '29.1'],
        ['#28', 'Player28', '', '50', '-', '-', '-', '75', '69.4', '50', '12.5', '100', '-', '-', '100', '0', '25.8'],
        ['#34', 'Player34', '●', '0', '100', '100', '-', '66.7', '72.7', '100', '11.1', '33.3', '66.7', '-', '33.3', '0', '0'],
      ],
      'Q2': [
        ['#10', 'Player10', '', '50', '-', '-', '-', '75', '75', '-', '9', '-', '-', '-', '100', '0', '0'],
        ['#12', 'Player12', '', '-', '100', '100', '-', '100', '100', '-', '13.4', '-', '100', '-', '0', '0', '33.3'],
        ['#14', 'Player14', '', '-', '100', '100', '-', '100', '100', '-', '9', '-', '100', '-', '0', '0', '50'],
        ['#15', 'Player15', '●', '-', '0', '-', '0', '0', '0', '-', '9', '-', '-', '100', '0', '0', '50'],
        ['#16', 'Player16', '', '-', '100', '100', '-', '100', '79.8', '50', '8.4', '200', '100', '-', '0', '0', '0'],
        ['#21', 'Player21', '', '100', '-', '-', '-', '150', '150', '-', '4.5', '-', '-', '-', '100', '0', '0'],
        ['#23', 'Player23', '', '-', '0', '0', '-', '0', '0', '-', '4.5', '-', '100', '-', '0', '50', '0'],
        ['#24', 'Player24', '', '0', '100', '100', '-', '50', '50', '-', '9', '-', '50', '-', '50', '0', '0'],
        ['#28', 'Player28', '', '100', '100', '-', '100', '133.3', '116.3', '0', '15.4', '33.3', '-', '33.3', '66.7', '0', '0'],
        ['#34', 'Player34', '●', '0', '100', '100', '-', '50', '50', '-', '13.4', '-', '50', '-', '50', '0', '33.3'],
      ],
      'Q3': [
        ['#10', 'Player10', '', '0', '0', '0', '-', '0', '0', '-', '8.5', '-', '66.7', '-', '33.3', '0', '0'],
        ['#12', 'Player12', '', '-', '100', '-', '100', '100', '100', '-', '2.8', '-', '-', '100', '0', '0', '0'],
        ['#14', 'Player14', '', '-', '0', '-', '0', '0', '0', '-', '2.8', '-', '-', '100', '0', '0', '0'],
        ['#15', 'Player15', '●', '50', '-', '-', '-', '75', '75', '-', '11.4', '-', '-', '-', '100', '0', '50'],
        ['#16', 'Player16', '', '-', '25', '0', '100', '25', '25', '-', '11.4', '-', '75', '25', '0', '0', '0'],
        ['#21', 'Player21', '', '-', '0', '0', '-', '0', '53.2', '100', '5.3', '200', '100', '-', '0', '0', '0'],
        ['#23', 'Player23', '', '-', '50', '50', '50', '50', '61.5', '100', '20.8', '50', '66.7', '33.3', '0', '0', '0'],
        ['#24', 'Player24', '', '-', '100', '100', '-', '100', '100', '-', '2.8', '-', '100', '-', '0', '0', '0'],
        ['#28', 'Player28', '', '-', '0', '0', '0', '0', '0', '-', '5.7', '-', '50', '50', '0', '33.3', '0'],
        ['#34', 'Player34', '●', '0', '-', '-', '-', '0', '0', '-', '5.7', '-', '-', '-', '100', '33.3', '33.3'],
      ],
      'Q4': [
        ['#11', 'Player11', '', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '100', '0'],
        ['#12', 'Player12', '', '-', '66.7', '50', '100', '66.7', '66.7', '-', '13.6', '-', '66.7', '33.3', '0', '0', '0'],
        ['#14', 'Player14', '', '-', '100', '100', '-', '100', '100', '-', '4.5', '-', '100', '-', '0', '50', '0'],
        ['#15', 'Player15', '●', '0', '-', '-', '-', '0', '0', '-', '4.5', '-', '-', '-', '100', '0', '0'],
        ['#16', 'Player16', '', '-', '100', '100', '-', '100', '100', '-', '9.1', '-', '100', '-', '0', '0', '50'],
        ['#21', 'Player21', '', '-', '50', '50', '-', '50', '50', '-', '9.1', '-', '100', '-', '0', '0', '0'],
        ['#24', 'Player24', '', '33.3', '-', '-', '-', '50', '50', '-', '13.6', '-', '-', '-', '100', '0', '0'],
        ['#35', 'Player35', '', '0', '100', '100', '-', '25', '25', '-', '18.2', '-', '25', '-', '75', '0', '0'],
        ['#77', 'Player77', '', '0', '-', '-', '-', '0', '0', '-', '4.5', '-', '-', '-', '100', '0', '0'],
      ],
    }

    if(team == '青山学院'){
      this.setState({
        team: team,
        period: period,  
        boxScore: newBoxScoreHome[period],
        advancedStatsTeam: newAdvancedScoreTeamHome[period],
        advancedStatsPlayer: newAdvancedStatsPlayerHome[period],
        buttonStyles: styleState,
      })  
    }else if(team == '早稲田'){
      this.setState({
        team: team,
        period: period,
        boxScore: newBoxScoreVisitor[period],
        advancedStatsTeam: newAdvancedScoreTeamVisitor[period],
        advancedStatsPlayer: newAdvancedStatsPlayerVisitor[period],
        buttonStyles: styleState,
      })  
    }else{

    }
    // this.updateValue()
    // if(this.state.changeFlag == 0){
    //   this._onClickPeriod(this.state.period)
    //   this.setState({
    //     changeFlag: 1
    //   })
    // }else{
    //   this.setState({
    //     changeFlag: 1
    //   })
    // }
    // console.log(this.state.boxScore)
  }
  
  // updateValue = () => {
  //   this.setState({
  //     team: this.state.temp_team,
  //     period: this.state.temp_period,
  //     boxScore: this.state.temp_boxScore
  //   })
  // }

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
    // const teams=['青山学院', '早稲田'] //今後、DBの値に切り替え
    const screenProps = {
      team: this.state.team,
      period: this.state.period,
      tableScore: this.state.tableScore,
      boxScore: this.state.boxScore,
      advancedStatsTeam: this.state.advancedStatsTeam,
      advancedStatsPlayer: this.state.advancedStatsPlayer
    }
    // console.log(this.state.boxScore)

    return (
      // <ImageBackground
      //   source={imgPath}
      //   style={styles.bgImage}
      //   imageStyle={{resizeMode: 'repeat'}}>
      //　使用時はbaccgroundColorは削除する
      <View
        onLayout={this._onLayout.bind(this)}
        style={[{height: this.state.height}, styles.container,]}>

        {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
        <Spinner
          visible={this.state.isLoadingVisible}
          textContent={Messages.INFO.I003}
          textStyle={styles.labelText}
          overlayColor={'#rgba(0, 0, 0, 0.3)'}
        />
        {/* ヘッダー */}
        <View style={{flex:2}}>
          <View style={[styles.switchbutton, styles.row,{flex:1, alignItems: 'center', justifyContent: 'center'}]}>
            <SwitchButton
              onValueChange={(val) => this._onTeamChange(val)}      // this is necessary for this component
              text1 = {this.state.teams[0]}                      // optional: first text in switch button --- default ON
              text2 = {this.state.teams[1]}                       // optional: second text in switch button --- default OFF
              switchWidth = {200}                 // optional: switch width --- default 44
              switchHeight ={54.5}                 // optional: switch height --- default 100
              switchdirection = {styles.switchElement.direction}             // optional: switch button direction ( ltr and rtl ) --- default ltr
              switchBorderRadius = {8}          // optional: switch border radius --- default oval
              // switchSpeedChange = {200}           // optional: button change speed --- default 100
              switchBorderColor = {styles.switchElement.borderColor}       // optional: switch border color --- default #d4d4d4
              switchBackgroundColor = {styles.switchElement.borderColor}      // optional: switch background color --- default #fff
              btnBorderColor = {styles.switchElement.backgroundColor}          // optional: button border color --- default #00a4b9
              btnBackgroundColor = {styles.switchElement.backgroundColor}      // optional: button background color --- default #00bcd4
              // fontSize = {styles.switchElement.fontSize}
              fontSize = {20}
              fontColor = '#ffffff'               // optional: text font color --- default #b1b1b1
              // activeFontColor = '#fff'            // optional: active font color --- default #fff
            />
          </View>
          <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
            <View style={{flex:3}}>
              <Text style={[styles.tabTitle]}>{this.state.title}</Text>
            </View>
            <View style={{flex:5, flexDirection:'row'}}>
              <TouchableOpacity style={[this.state.buttonStyles[0].button, styles.formElement, {flex:1}]} onPress={() => this._onClickPeriod('All')}>
                <Text style={[this.state.buttonStyles[0].text]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[this.state.buttonStyles[1].button, styles.formElement, {flex:1}]} onPress={() => this._onClickPeriod('Q1')}>
                <Text style={[this.state.buttonStyles[1].text]}>Q1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[this.state.buttonStyles[2].button, styles.formElement, {flex:1}]} onPress={() => this._onClickPeriod('Q2')}>
                <Text style={[this.state.buttonStyles[2].text]}>Q2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[this.state.buttonStyles[3].button, styles.formElement, {flex:1}]} onPress={() => this._onClickPeriod('Q3')}>
                <Text style={[this.state.buttonStyles[3].text]}>Q3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[this.state.buttonStyles[4].button, styles.formElement, {flex:1}]} onPress={() => this._onClickPeriod('Q4')}>
                <Text style={[this.state.buttonStyles[4].text]}>Q4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[this.state.buttonStyles[5].button, styles.formElement, {flex:1}]} onPress={() => this._onClickPeriod('OT')}>
                <Text style={[this.state.buttonStyles[5].text]}>OT</Text>
              </TouchableOpacity>
            </View>
            {/* 各種アイコン */}
            <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
              {/* <TouchableOpacity style={{alignItems: "flex-end", flex:1}} onPress={() => _onButtonClicked()}>
                <Icon name="basketball-ball" size={30} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: "flex-end", flex:1}} onPress={() => _onButtonClicked()}>
                <Icon name="star" size={30} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: "flex-end", flex:1}} onPress={() => _onButtonClicked()}>
                <Icon name="chart-bar" size={30} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: "flex-end", flex:1}} onPress={() => _onButtonClicked()}>
                <Icon name="people-arrows" size={30} color="#ffffff" />
              </TouchableOpacity> */}
              <TouchableOpacity style={{alignItems: "flex-end", flex:1}} onPress={() => _onButtonClicked()}>
                <Icon name="redo" size={30} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: "flex-end", flex:1}} onPress={() => this.speak(1, 'ja', 1, 1)}>
                <Icon name="volume-up" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
        {/* コンテンツ */}
        <View style={{flex:9}}>
            {/* screenPropsの中にタブに持ち込みたい数値を格納する */}
            <AppContainer style={{flex:1}} screenProps={{params: screenProps}}></AppContainer>
        </View>
        {/* フッター */}
        <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            {/* <Text style={{color:'#ffffff'}}>ここにフッターを記載する</Text> */}
        </View>
      </View>
      // </ImageBackground>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(StatsViewer);