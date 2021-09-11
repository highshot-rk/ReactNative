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
  TouchableHighlight,
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// ローカルインポート
import styles from '../../common/CommonStyles';
import SelectionStyles from './SelectionStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import ExcludeDuplicate from '../../util/ExcludeDuplicateArray';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;

class GameSelection extends Component {
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

      // ラベル
      label_date: 'Date',
      label_event: 'Event',
      label_stage: 'Stage',
      label_game: 'Game',

      // ユーザー名
      username: '',
      // ゲーム情報
      gameList: [],
      // プルダウン項目
      dateList: [],
      eventList: [],
      stageList: [],
      gameCardList: [],
      // プルダウン初期値
      date: [],
      event_name: [],
      stage_name: [],
      game_card: [],
      team_home: [],
      team_visitor: [],
      game_id: '',

      // 絞り込み結果
      filtered_event: [],
      filtered_stage: [],
      filtered_game_card: [],
      // 画面遷移パラメータ
      params: null,
      // 画面遷移フラグ
      transition_flag: false, // 遷移時: true, 遷移前 or 遷移後: false
      screen_category: null,
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
      if (payload.state.params !== undefined && payload.state.params.date) {
        const params = {
          date: payload.state.params.date,
          event: payload.state.params.event, 
          stage: payload.state.params.stage, 
          game_card: payload.state.params.game_card,
          team_home: payload.state.params.team_home,
          team_visitor: payload.state.params.team_visitor,
          game_id: payload.state.params.game_id,
        };  
        this.setState({ params: params });
        this.setState({ transition_flag: true });
        this.setState({ screen_category: payload.state.params.screen_category });
      } else {
        const screen_category = payload.state.params ? payload.state.params.screen_category : Constants.SCREEN_CATEGORY.STATS_VIEWER
        this.setState({ screen_category: screen_category });
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

  _onDateChange(option) {
    this.setState({ date: option });
    // イベントリストセット
    const filtered_event = this.setArrayList('date', option.value, this.state.gameList);
    // ステージリストセット
    const filtered_stage = this.setArrayList('event', filtered_event[0].event_id, filtered_event);
    // ゲームカードリストセット
    const filtered_game_card = this.setArrayList('stage', filtered_stage[0].game_stage, filtered_stage);
  }

  _onEventChange(option) {
    this.setState({ event_name: option });
    // ステージリストセット
    const filtered_stage = this.setArrayList('event', option.value, this.state.filtered_event);
    // ゲームカードリストセット
    const filtered_game_card = this.setArrayList('stage', filtered_stage[0].game_stage, filtered_stage);
  }

  _onStageChange(option) {
    this.setState({ stage_name: option });
    // ゲームカードリストセット
    const filtered_game_card = this.setArrayList('stage', option.value, this.state.filtered_stage);
  }

  _onGameCardChange(option) {
    this.setState({ game_card: option });
  }

  _dropdown_renderButtonText(rowData) {
    const {label, value} = rowData;
    return `${label}`;
  }

  _dropdown_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;

    return (
      <View style={[styles.dropdown_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
        <Text style={[styles.dropdown_row_text, SelectionStyles.dropdown_row_text_custom, highlighted && {color: 'blue', fontWeight: 'bold'}]}>
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

  // Displayボタン押下時
  search = () => {
    // game_id抽出
    const filtered = this.state.filtered_game_card.filter(item => 
    ( item.team_id_home === this.state.team_home.value &&
      item.team_id_visitor === this.state.team_visitor.value )
    );

    const { navigation } = this.props;
    if (this.state.screen_category === Constants.SCREEN_CATEGORY.PLAY_BY_PLAY) {
    // PlayByPlay画面にプッシュ遷移
      navigation.navigate(Constants.SCREEN_ID.PLAY_BY_PLAY,
        // 画面遷移パラメータ
        { 
          'date': {
            label: this.state.date.label,
            value: this.state.date.value
          },
          'event': {
            label: this.state.event_name.label,
            value: this.state.event_name.value
          },
          'stage': {
            label: this.state.stage_name.label,
            value: this.state.stage_name.value
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
          'game_id': filtered[0].game_id,
        }
      )
    } else {
      // StatsViewer画面に遷移
      navigation.navigate(Constants.SCREEN_ID.STATS_VIEWER,
        // 画面遷移パラメータ
        { 
          'date': {
            label: this.state.date.label,
            value: this.state.date.value
          },
          'event': {
            label: this.state.event_name.label,
            value: this.state.event_name.value
          },
          'stage': {
            label: this.state.stage_name.label,
            value: this.state.stage_name.value
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
          'game_id': filtered[0].game_id,
        }
      )
    }

  };

/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
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

        // ユーザー名保持
        this.setState({ username: cognitoUser.username }); 

        // Game情報取得
        let param = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.GAME,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param, Constants.SK_TYPE.GAME);

      }
    });
  }

  // プルダウン項目セット
  setArrayList(category, value, obj) {
    let filtered = [];
    let items = [];
    if(category === 'date') {
      filtered = obj.filter(item => item.date === value);
      filtered.forEach(function(item, index) {
        items.push({
          label: item.event_name,
          value: item.event_id,
        });
      })
      // 重複除外
      items = ExcludeDuplicate(items);
      this.setState({ eventList: items });
      if (this.state.params !== null && this.state.transition_flag === true) {
        this.setState({ event_name: this.state.params.event });
      } else {
        this.setState({ event_name: items[0] });
      }
      this.setState({ filtered_event: filtered });

    } else if (category === 'event') {
      // 絞り込み
      filtered = obj.filter(item => item.event_id === value);
      // プルダウン項目セット
      filtered.forEach(function(item, index) {
        items.push({
          label: item.game_stage,
          value: item.game_stage,
        });
      })
      // 重複除外
      items = ExcludeDuplicate(items);
      this.setState({ stageList: items });
      if (this.state.params !== null && this.state.transition_flag === true) {
        this.setState({ stage_name: this.state.params.stage });
      } else {
        this.setState({ stage_name: items[0] });
      }
      this.setState({ filtered_stage: filtered });

    } else if (category === 'stage') {
      // 絞り込み
      filtered = obj.filter(item => item.game_stage === value);

      // プルダウン項目セット
      filtered.forEach(function(item, index) {
        items.push({
          label: item.team_name_home + ' vs ' + item.team_name_visitor,
          value: item.team_id_home + '_' + item.team_id_visitor,
        });
      })
      // 重複除外
      items = ExcludeDuplicate(items);
      this.setState({ gameCardList: items });
      if (this.state.params !== null && this.state.transition_flag === true) {
        this.setState({ game_card: this.state.params.game_card });
        this.setState({ team_home: this.state.params.team_home });
        this.setState({ team_visitor: this.state.params.team_visitor });
      } else {
        this.setState({ game_card: items[0] });
        // 遷移先で使用するため。チーム情報をセット
        this.setState({ team_home: { label: filtered[0].team_name_home, value: filtered[0].team_id_home } });
        this.setState({ team_visitor: { label: filtered[0].team_name_visitor, value: filtered[0].team_id_visitor } });
      }
      this.setState({ filtered_game_card: filtered });
    }
    return filtered;
  }

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
        if (response.data.Items !== undefined) {

          // ゲーム情報セット
          const gameinfo = [];
          response.data.Items.forEach(function(item, index) {
            const date_str = item.game_start_time.slice(0,4) + '/' + item.game_start_time.slice(4,6) + '/' + item.game_start_time.slice(6,8);
            const datetime_str = item.game_start_time.slice(8,10) + ':' + item.game_start_time.slice(10,12);
            gameinfo.push({
              game_id: item.sk,
              date: item.game_start_time.slice(0,8),
              date_str: date_str,
              event_id: item.event_id,
              event_name: item.event_name,
              game_stage: item.game_stage,
              team_id_home: item.team_id_home,
              team_name_home: item.team_name_home,
              team_id_visitor: item.team_id_visitor,
              team_name_visitor: item.team_name_visitor,
              game_start_time: item.game_start_time,
              display_time: date_str + ' ' + datetime_str,
              home_teamcolors: item.home_teamcolors,
              visitor_teamcolors: item.visitor_teamcolors,
            });
          })
          this.setState({ gameList: gameinfo });

          // 日付リストセット
          let dateItems = [];
          gameinfo.forEach(function(item, index) {
            const date_str = item.game_start_time.slice(0,4) + '/' + item.game_start_time.slice(4,6) + '/' + item.game_start_time.slice(6,8);
            dateItems.push({
              label: date_str,
              value: item.game_start_time.slice(0,8),
            });
          })
          // 重複除外
          dateItems = ExcludeDuplicate(dateItems);
          // 日付の降順に並び替え
          dateItems.sort(function(a, b) {
            return Number(b.value) - Number(a.value);
          });

          let date_param;
          if (this.state.params !== null && this.state.transition_flag === true) {
            this.setState({ dateList: dateItems });
            this.setState({ date: this.state.params.date });  
            date_param = this.state.params.date;
          } else {
            this.setState({ dateList: dateItems });
            this.setState({ date: dateItems[0] });  
            date_param = dateItems[0];
          }

          // イベントリストセット
          const filtered_event = this.setArrayList('date', date_param.value, this.state.gameList);

          // ステージリストセット
          let param_event;
          if (this.state.params !== null && this.state.transition_flag === true) {
            param_event = this.state.params.event.value;
          } else {
            param_event = filtered_event[0].event_id;
          }
          const filtered_stage = this.setArrayList('event', param_event, filtered_event);

          // ゲームカードリストセット
          let param_stage;
          if (this.state.params !== null && this.state.transition_flag === true) {
            param_stage = this.state.params.stage.value;
          } else {
            param_stage = filtered_stage[0].game_stage;
          }
          const filtered_game_card = this.setArrayList('stage', param_stage, filtered_stage);
        }

        // 画面遷移フラグ更新
        this.setState({ transition_flag: false });

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
    const { 
      date, 
      event_name, 
      stage_name, 
      game_card, 
      dateList, 
      eventList, 
      stageList, 
      gameCardList } = this.state;

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
          <View style={[styles.row, SelectionStyles.contents_a]}>
            <Text style={[styles.errorText, SelectionStyles.errorText_custom]}>{this.state.errorMessage}</Text>
          </View>

          {/* Date */}
          <View style={[styles.row, SelectionStyles.contents_b]}>
            <Text style={[styles.labelText_black, SelectionStyles.labelText_custom]}>{this.state.label_date}</Text>
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown1"
                style={[styles.dropdown]}
                textStyle={[styles.dropdown_text]}
                dropdownStyle={[styles.dropdown_dropdown, {height: hp(this.state.dateList.length * 4.5)}]}
                defaultValue={date.label}
                defaultTextStyle={[styles.defaultTextStyle, SelectionStyles.defaultTextStyle_custom]}
                options={dateList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.dateList)}
                onSelect={(option, index) => this._onDateChange(option)}
              />
            </View>
          </View>

          {/* Event */}
          <View style={[styles.row, SelectionStyles.contents_b]}>
            <Text style={[styles.labelText_black, SelectionStyles.labelText_custom]}>{this.state.label_event}</Text>
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown1"
                style={[styles.dropdown]}
                textStyle={[styles.dropdown_text]}
                dropdownStyle={[styles.dropdown_dropdown, {height: hp(this.state.eventList.length * 4.5)}]}
                defaultValue={event_name.label}
                defaultTextStyle={[styles.defaultTextStyle, SelectionStyles.defaultTextStyle_custom]}
                options={eventList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.eventList)}
                onSelect={(option, index) => this._onEventChange(option)}
              />
            </View>
          </View>

          {/* Stage */}
          <View style={[styles.row, SelectionStyles.contents_b]}>
            <Text style={[styles.labelText_black, SelectionStyles.labelText_custom]}>{this.state.label_stage}</Text>
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown3"
                style={[styles.dropdown]}
                textStyle={[styles.dropdown_text]}
                dropdownStyle={[styles.dropdown_dropdown, {height: hp(this.state.stageList.length * 4.5)}]}
                defaultValue={stage_name.label}
                defaultTextStyle={[styles.defaultTextStyle, SelectionStyles.defaultTextStyle_custom]}
                options={stageList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.stageList)}
                onSelect={(option, index) => this._onStageChange(option)}
                />
            </View>
          </View>

          {/* Game Card */}
          <View style={[styles.row, SelectionStyles.contents_b]}>
            <Text style={[styles.labelText_black, SelectionStyles.labelText_custom]}>{this.state.label_game}</Text>
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown4"
                style={[styles.dropdown]}
                textStyle={[styles.dropdown_text]}
                dropdownStyle={[styles.dropdown_dropdown, { height: hp(this.state.gameCardList.length * 4.5) }]}
                defaultValue={game_card.label}
                defaultTextStyle={[styles.defaultTextStyle, SelectionStyles.defaultTextStyle_custom]}
                options={gameCardList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.gameCardList)}
                onSelect={(option, index) => this._onGameCardChange(option)}
                />
            </View>
          </View>

          {/* 表示ボタン */}
          <View style={[styles.row, SelectionStyles.contents_c]}>
          <View paddingHorizontal={wp(22.1)} />
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.search()}>
              <Text style={[styles.buttonText]}>Display</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    );
  }
}
// 画面遷移時の再レンダリング対応
export default withNavigation(GameSelection);