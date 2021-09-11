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
// グリッド表示
import { FlatGrid } from 'react-native-super-grid';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// ローカルインポート
import styles from '../../common/CommonStyles';
import GameInfoStyles from './GameInfoStyles';
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

class GameInfo extends Component {
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
      // ユーザー名
      username: '',
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
      event_name: [],
      stage_name: [],
      team_name: [],
      // 絞り込み結果
      filtered_event: [],
      filtered_stage: [],
      filtered_team: [],
      // 画面遷移パラメータ
      params: null,
      // 画面遷移フラグ
      transition_flag: false, // 遷移時: true, 遷移前 or 遷移後: false
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
        const params = {
          date: payload.state.params.date,
          event: payload.state.params.event, 
          stage: payload.state.params.stage, 
          team: payload.state.params.team, 
        };
        this.setState({ params: params });
        this.setState({ transition_flag: true });
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

  onDateChange(option) {
    this.setState({ date: option });
    // イベントリストセット
    const filtered_event = this.setArrayList('date', option.value, this.state.gameList);
    // ステージリストセット
    const filtered_stage = this.setArrayList('event', filtered_event[0].event_id, filtered_event);
    // チームリストセット
    this.setArrayList('stage', 'ALL', filtered_stage);
    // 検索結果セット
    this.setResultList(
      this.state.gameList,
      option.value,
      filtered_event[0].event_id,
      'ALL',
      'ALL',
    );
  }

  onEventChange(option) {
    this.setState({ event_name: option });
    // ステージリストセット
    const filtered_stage = this.setArrayList('event', option.value, this.state.filtered_event);
    // チームリストセット
    this.setArrayList('stage', 'ALL', filtered_stage);
    // 検索結果セット
    this.setResultList(
      this.state.gameList,
      this.state.date.value,
      option.value,
      'ALL',
      'ALL',
    );
  }

  onStageChange(option) {
    this.setState({ stage_name: option });
    // チームリストセット
    this.setArrayList('stage', option.value, this.state.filtered_stage);

    // 検索結果セット
    this.setResultList(
      this.state.gameList,
      this.state.date.value,
      this.state.event_name.value,
      option.value,
      'ALL',
      );
  }

  onTeamChange(option) {
    this.setState({ team_name: option });
    // 検索結果セット
    this.setResultList(
      this.state.gameList,
      this.state.date.value,
      this.state.event_name.value,
      this.state.stage_name.value,
      option.value, 
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
        <Text style={[styles.dropdown_row_text, GameInfoStyles.dropdown_row_text_custom, highlighted && {color: 'blue', fontWeight: 'bold'}]}>
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

  // ホームアイコン押下時
  gohome = () => {
    // メニュー画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.MENU, { 'user_id': this.state.username });
  }

  // New Gameボタン押下時
  creategame = () => {
    // CreateGame画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.CREATE_GAME);
  }

  // Searchボタン押下時
  search = () => {
    // 検索結果表示
    this.setResultList(
      this.state.gameList,
      this.state.date.value,
      this.state.event_name.value,
      this.state.stage_name.value,
      this.state.team_name.value,
    );
  }

  // Assign Playersボタン押下時
  assignPlayers = (item) => {
    // CreateGame画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.ASSIGN_PLAYER, 
      // 画面遷移パラメータ
      { 
        'game_id': item.game_id,
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
        'team': {
          label: this.state.team_name.label, value: this.state.team_name.value
        },
        'team_name_home': {
          label: item.team_name_home,
          value: item.team_id_home
        },
        'team_name_visitor': {
          label: item.team_name_visitor,
          value: item.team_id_visitor
        },
        'team_color_home': item.home_teamcolors,
        'team_color_visitor': item.visitor_teamcolors,
      });
  }

  // LiveTaggingボタン押下時
  LiveTagging = (item) => {
    // CreateGame画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.LIVE_TAGGING, 
      // 画面遷移パラメータ
      {
        event_id: item.event_id,
        event_name: item.event_name,
        event_date: item.date,
        'game_id': item.game_id,
        'game_stage': item.game_stage,
        'team_name_home': { label: item.team_name_home, value: item.team_id_home },
        'team_name_visitor': { label: item.team_name_visitor, value: item.team_id_visitor },
      });
  }

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
      items = [{ label: 'ALL', value: 'ALL' }];
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
      items = [{ label: 'ALL', value: 'ALL' }];
      // 絞り込み
      if(value === 'ALL') {
        filtered = obj;
      } else {
        filtered = obj.filter(item => item.game_stage === value);
      }
      // プルダウン項目セット
      filtered.forEach(function(item, index) {
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
      this.setState({ teamList: items });
      if (this.state.params !== null && this.state.transition_flag === true) {
        this.setState({ team_name: this.state.params.team });
      } else {
        this.setState({ team_name: items[0] });
      }
      this.setState({ filtered_team: filtered });
    }
    return filtered;
  }

  // 検索結果セット
  setResultList(obj, date_value, event_id, game_stage, team_id) {
    let filtered_result = [];
    if ( game_stage === 'ALL') {
      if ( team_id === 'ALL' ) {
        // 絞り込み
        filtered_result = obj.filter(item => {
          // 検索条件
          if(item.date === date_value
            && item.event_id === event_id
          ) { return true; } 
        });  
      } else {
        // 絞り込み
        filtered_result = obj.filter(item => {
          // 検索条件
          if(item.date === date_value
            && item.event_id === event_id
            && ( item.team_id_home === team_id || item.team_id_visitor === team_id )
          ) { return true; } 
        });
      }
    } else {
      if ( team_id === 'ALL' ) {
        // 絞り込み
        filtered_result = obj.filter(item => {
          // 検索条件
          if(item.date === date_value
            && item.event_id === event_id
            && item.game_stage === game_stage
          ) { return true; } 
        }); 
      } else {
        filtered_result = obj.filter(item => {
          // 検索条件
          if(item.date === date_value
            && item.event_id === event_id
            && item.game_stage === game_stage
            && ( item.team_id_home === team_id || item.team_id_visitor === team_id )
            ) { return true; } 
        });
      }
    }

    // 検索結果セット
    this.setState({ resultList: filtered_result });  
    
    return filtered_result;
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
              // tagging_data_tempが存在する場合、登録済みのスコアを表示する
              score_home: item.tagging_data_temp ? item.tagging_data_temp.score_home : '0',
              score_visitor: item.tagging_data_temp ? item.tagging_data_temp.score_visitor : '0',
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

          // チームリストセット
          let param_stage;
          if (this.state.params !== null && this.state.transition_flag === true) {
            param_stage = this.state.params.stage.value;
          } else {
            param_stage = filtered_stage[0].game_stage;
          }
          this.setArrayList('stage', param_stage, filtered_stage);

          // 検索結果セット
          let param_team;
          if (this.state.params !== null && this.state.transition_flag === true) {
            param_stage = this.state.params.stage.value;
            param_team = this.state.params.team.value;
          } else {
            param_stage = 'ALL';
            param_team = 'ALL';
          }
          this.setResultList(
            gameinfo,
            date_param.value,
            param_event,
            param_stage,
            param_team,
          );
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
      team_name, 
      dateList, 
      eventList, 
      stageList, 
      teamList } = this.state;

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

          {/* ボタン、アイコン */}
          <View style={[styles.row, GameInfoStyles.contents_a]}>
            <View style={[GameInfoStyles.button_area]}>
              <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.creategame()}>
                <Text style={[styles.buttonText]}>New Game</Text>
              </TouchableOpacity>    
            </View>
            <View paddingHorizontal={'37.5%'} />
            <View style={[GameInfoStyles.icon_area]}>
              <TouchableOpacity onPress={() => this.gohome()}>
                <Icon style={[styles.icon_home]} name='home'/>
              </TouchableOpacity>   
            </View>
          </View>

          {/* ドロップダウン タイトル */}
          <View style={[styles.row, GameInfoStyles.contents_b]}>
            <Text style={[styles.labelText_black, GameInfoStyles.labelText_custom]}>Date</Text>
            <Text style={[styles.labelText_black, GameInfoStyles.labelText_custom]}>Event</Text>
            <Text style={[styles.labelText_black, GameInfoStyles.labelText_custom]}>Stage</Text>
            <Text style={[styles.labelText_black, GameInfoStyles.labelText_custom]}>Team</Text>
          </View>

          {/* ドロップダウン */}
          <View style={[styles.row, GameInfoStyles.contents_c]}>
            {/* Date */}
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown1"
                style={[styles.dropdown, GameInfoStyles.dropdown_custom]}
                textStyle={[styles.dropdown_text, GameInfoStyles.dropdown_text_custom]}
                dropdownStyle={[styles.dropdown_dropdown, GameInfoStyles.dropdown_dropdown_custom, {height: hp(this.state.dateList.length * 3.8)}]}
                defaultValue={date.label}
                defaultTextStyle={[styles.defaultTextStyle, GameInfoStyles.defaultTextStyle_custom]}
                options={dateList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.dateList)}
                onSelect={(option, index) => this.onDateChange(option)}
              />
            </View>

            {/* Event */}
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown2"
                style={[styles.dropdown, GameInfoStyles.dropdown_custom]}
                textStyle={[styles.dropdown_text, GameInfoStyles.dropdown_text_custom]}
                dropdownStyle={[styles.dropdown_dropdown, GameInfoStyles.dropdown_dropdown_custom, {height: hp(this.state.eventList.length * 3.8)}]}
                defaultValue={event_name.label}
                defaultTextStyle={[styles.defaultTextStyle, GameInfoStyles.defaultTextStyle_custom]}
                options={eventList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.eventList)}
                onSelect={(option, index) => this.onEventChange(option)}
              />
            </View>

            {/* Stage */}
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown3"
                style={[styles.dropdown, GameInfoStyles.dropdown_custom]}
                textStyle={[styles.dropdown_text, GameInfoStyles.dropdown_text_custom]}
                dropdownStyle={[styles.dropdown_dropdown, GameInfoStyles.dropdown_dropdown_custom, {height: hp(this.state.stageList.length * 3.8)}]}
                defaultValue={stage_name.label}
                defaultTextStyle={[styles.defaultTextStyle, GameInfoStyles.defaultTextStyle_custom]}
                options={stageList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.stageList)}
                onSelect={(option, index) => this.onStageChange(option)}
                />
            </View>

            {/* Team */}
            <View style={styles.cell}>
              <ModalDropdown 
                ref="dropdown4"
                style={[styles.dropdown, GameInfoStyles.dropdown_custom]}
                textStyle={[styles.dropdown_text, GameInfoStyles.dropdown_text_custom]}
                dropdownStyle={[styles.dropdown_dropdown, GameInfoStyles.dropdown_dropdown_custom, { height: hp(this.state.teamList.length * 3.8) }]}
                defaultValue={team_name.label}
                defaultTextStyle={[styles.defaultTextStyle, GameInfoStyles.defaultTextStyle_custom]}
                options={teamList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.dateList)}
                onSelect={(option, index) => this.onTeamChange(option)}
                />
            </View>

            {/* 検索ボタン */}
            <View>
              <View style={[GameInfoStyles.button_custom]}>
                <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.search()}>
                  <Text style={[styles.buttonText]}>Search</Text>
                </TouchableOpacity>    
              </View>
            </View>

          </View>

          {/* 対戦カード */}
          <View style={[styles.row, GameInfoStyles.contents_d]}>
            <FlatGrid
              itemDimension={this.state.width}
              data={this.state.resultList}
              style={GameInfoStyles.gridView}
              renderItem={({ item, index }) => (
                <View style={[GameInfoStyles.gridItem]}>
                  <View style={[styles.row]}>
                    <View style={[styles.column, GameInfoStyles.gridItem_contents]}>
                      <Text style={[styles.labelText_black, GameInfoStyles.gridItem_titles]}>{item.team_name_home}</Text>
                      <View paddingVertical={hp(1.2)} />
                      <Text style={[styles.labelText_black, GameInfoStyles.gridItem_items]}>{item.score_home}</Text>
                    </View>
                    <View style={[styles.column, GameInfoStyles.gridItem_contents]}>
                      <Text style={[styles.labelText_black, GameInfoStyles.gridItem_titles]}>{item.display_time} Tip-off</Text>
                      <View paddingVertical={hp(1.2)} />
                      <Text style={[styles.labelText_black, GameInfoStyles.gridItem_items]}>{item.game_stage}</Text>
                    </View>
                    <View style={[styles.column, GameInfoStyles.gridItem_contents]}>
                      <Text style={[styles.labelText_black, GameInfoStyles.gridItem_titles]}>{item.team_name_visitor}</Text>
                      <View paddingVertical={hp(1.2)} />
                      <Text style={[styles.labelText_black, GameInfoStyles.gridItem_items]}>{item.score_visitor}</Text>
                    </View>
                    <View style={[styles.column, GameInfoStyles.gridItem_buttons]}>
                      <TouchableOpacity style={[styles.button_xlg, styles.formElement]} onPress={() => this.assignPlayers(item)}>
                        <Text style={[styles.buttonText]}>Assign{"\n"} Players</Text>
                      </TouchableOpacity>    
                    </View>
                    <View style={[styles.column, GameInfoStyles.gridItem_buttons]}>
                      <TouchableOpacity style={[styles.button_xlg, styles.formElement]} onPress={(event) => this.LiveTagging(item)}>
                        <Text style={[styles.buttonText]}>  Live{"\n"}Tagging</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
// 画面遷移時の再レンダリング対応
export default withNavigation(GameInfo);