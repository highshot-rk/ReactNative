/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
  Image,
  } from 'react-native';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements'
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// グリッド
import { FlatGrid } from 'react-native-super-grid';
// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/BaseStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';
import { flexDirection } from 'styled-system';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
const propTypes = {
  updateGameSelection: PropTypes.func,
  updateGameSelectionNewGame: PropTypes.func,
};
class GameSelection extends Component { 
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0, // デバイスの幅
      height: 0, // デバイスの高さ
      searchText: '', // サーチバーの検索文字列
      isLoadingVisible: false, // ローディングスピナーの表示・非表示
      resultList: [], // 画面表示結果
      filteredResultList: [],
      items: [], // グリッド表示データ
      emptyArry: [
        {
          "date": "",
          "date_str": "",
          "event_id": "",
          "event_name": "",
          "game": "",
          "game_id": "",
          "game_stage": "",
          "game_start_time": "",
          "home_teamcolors": "",
          "score_home": 0,
          "score_visitor": 0,
          "team_id_home": "",
          "team_id_visitor": "",
          "team_name_home": "",
          "team_name_visitor": "",
          "visitor_teamcolors": "",
        }
      ], // 先頭の空要素（＋ボタン用）
      isTransition: this.props.isTransition,
      headerText: '', // ヘッダーテキスト

    }

  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 初期処理
    this.init();

    // ヘッダーテキスト
    if (this.state.isTransition === 'Tagging') {
      this.setState({ headerText: 'タグ付けを開始する試合を選択してください' });
    } else if (this.state.isTransition === 'PlayByPlay') {
        this.setState({ headerText: 'タグ情報を閲覧する試合を選択してください' });  
    } else {
      this.setState({ headerText: 'スタッツを閲覧する試合を選択してください' });
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

  _onButtonClicked(){
    Alert.alert("wow")
  }

  // state = {
  //   search: '',
  // };  
  updateSearch = (text) => {
    this.setState({searchText: text})
    if (text) {
      const textData = text.toUpperCase();
      let newData = [];
      this.state.filteredResultList.some(function (item) {
        const itemData_1 = item.game ? String(item.game).toUpperCase() : ''.toUpperCase();
        const itemData_2 = item.date_str ? String(item.date_str).toUpperCase() : ''.toUpperCase();
        const itemData_3 = item.team_name_home ? String(item.team_name_home).toUpperCase() : ''.toUpperCase();
        const itemData_4 = item.team_name_visitor ? String(item.team_name_visitor).toUpperCase() : ''.toUpperCase();
        const itemData_5 = item.score_home ? String(item.score_home).toUpperCase() : ''.toUpperCase();
        const itemData_6 = item.score_visitor ? String(item.score_visitor).toUpperCase() : ''.toUpperCase();

        // テキストの文字列が含まれるかどうか
        if (itemData_1.indexOf(textData) > -1 || itemData_2.indexOf(textData) > -1 || 
            itemData_3.indexOf(textData) > -1 || itemData_4.indexOf(textData) > -1 || 
            itemData_5.indexOf(textData) > -1 || itemData_6.indexOf(textData) > -1 ) {
          newData.push(item)
        }
      });
      // 先頭に空要素を追加
      if (this.state.isTransition === 'Tagging') {
        newData.unshift(this.state.emptyArry);
      }
      // 表示データセット
      this.setState({resultList: newData});
    } else {
      // Inserted text is blank
      this.setState({resultList: this.state.filteredResultList});
    }


    // this.setState({ search });
  };
  
  // 新規作成ボタンを押下した際の処理
  _newGame = () => {
    return this.props.updateGameSelectionNewGame();
  }
  // 試合を選択した際の処理
  _selectedGame = (item) => {
    console.log(item.game_id)
    // game_idを親コンポーネントに渡す
    return this.props.updateGameSelection(item.game_id);
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
            // 曜日の算出
            const date = new Date(item.game_start_time.slice(0,4), item.game_start_time.slice(4,6), item.game_start_time.slice(6,8));
            const dayOfWeek = date.getDay() ;	// 曜日(数値)
            const dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek] ;	// 曜日(日本語表記)

            // 日付(yyyy/mm/dd (week)形式)
            const date_str = item.game_start_time.slice(0,4) + '/' + item.game_start_time.slice(4,6) + '/' + item.game_start_time.slice(6,8) + ' (' + dayOfWeekStr + ')';
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
              game: item.event_name + ' ' + item.game_stage,
              // 表示不要
              // display_time: date_str + ' ' + datetime_str,
              home_teamcolors: item.home_teamcolors,
              visitor_teamcolors: item.visitor_teamcolors,
            });
          })
          // game_start_timeの降順に並び替え
          gameinfo.sort(function(a, b) {
            return Number(b.game_start_time) - Number(a.game_start_time);
          });
          // 先頭に空要素を追加
          if (this.state.isTransition === 'Tagging') {
            gameinfo.unshift(this.state.emptyArry);
          }

          const items =  [
            { game: '', code: '' , videoicon: '', date: ''},
            { game: 'インカレ 1回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#1abc9c' , videoicon: 'video', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 2回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#2ecc71' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 3回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#3498db' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 4回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#9b59b6' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 5回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#34495e' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 1回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#16a085' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 2回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#27ae60' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 3回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#2980b9' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 4回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#8e44ad' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 5回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#2c3e50' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 1回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#f1c40f' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 2回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#e67e22' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 3回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#e74c3c' , videoicon: 'video', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 4回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#ecf0f1' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 5回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#95a5a6' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 1回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#f39c12' , videoicon: 'video', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 2回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#d35400' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 3回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#c0392b' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 4回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#bdc3c7' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
            { game: 'インカレ 5回戦', team_name_home: '青山学院', score_home: 40, team_name_visitor: '早稲田', score_visitor: 40, code: '#7f8c8d' , videoicon: 'upload', date_str: '2020/08/18 (Sat)'},
          ]
          this.setState({ resultList: gameinfo });
          this.setState({ filteredResultList: gameinfo });

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
    const { searchText } = this.state;
    return(
      <SafeAreaView 
        onLayout={this._onLayout.bind(this)}
        style={{flex:1, flexDirection: 'row'}}
        >
        
        <View style={{flex:1}}></View>
        <View style={{flex:18}}>

          {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
          <Spinner
            visible={this.state.isLoadingVisible}
            textContent={Messages.INFO.I003}
            textStyle={styles.labelText}
            overlayColor={'#rgba(0, 0, 0, 0.3)'}
          />

          {/* ヘッダー */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View style={[styles.row]}>
              <Text style={[styles.headerText]}>{this.state.headerText}</Text>
            </View>
            <View paddingVertical={this.state.width*0.01} />
          </View>

          {/* コンテンツ */}
          <View style={{flex:4, alignItems:'center', justifyContent: 'center'}}>

            {/* サーチバー */}
            <View style={[
              GridStyles.search_bar,
            ]}>
              <SearchBar
                placeholder="Type Here..."
                placeholderTextColor={'#ffffff'}
                onChangeText={(text) => this.updateSearch(text)}
                onClear={(text) => this.updateSearch('')}
                value={searchText}
                containerStyle={[styles.searchBarContainer]}
                inputContainerStyle={[styles.searchBarInput]}
                inputStyle={[styles.searchBarInputText]}
                searchIcon={[styles.searchBarIcon]}
              />
            </View>

            <View paddingVertical={this.state.width*0.01} />

            {/* グリッドビュー */}
            <View style={[styles.row, GridStyles.contents]}>
              <FlatGrid
                itemDimension={this.state.width/5}
                data={this.state.resultList}
                style={GridStyles.gridView}
                spacing={this.state.width*0.015}
                renderItem={({ item, index }) => (
                  (index === 0 && this.state.isTransition === 'Tagging' ?
                    <TouchableOpacity onPress={() => this._newGame()}>
                      <View style={[GridStyles.itemContainer, { height: this.state.height*0.22 }]}>
                        <View style={[styles.row, {flex: 1, justifyContent:'center', alignItems: 'center'}]}>
                          <FeatherIcon name="plus" size={36} color="#000000"/>
                        </View>
                      </View>
                    </TouchableOpacity>:
                    <TouchableOpacity onPress={() => this._selectedGame(item)}>
                      <View style={[GridStyles.itemContainer, { height: this.state.height*0.22 }]}>
                        <View style={[styles.row, styles.flatGridTitle, {flex:1}]}>
                          <Icon name="basketball-ball" size={25} color="#ffffff" style={{marginLeft: 10, marginTop:10, flex:1}}/>
                          <Text style={[GridStyles.titleName, {flex:4}]}>{item.game}</Text>
                          {/* ビデオアップロードは実装後に表示 */}
                          {/* <EIcon name="video" size={25} color="#000000" style={{marginRight: -10, marginTop:10, flex:1}}/> */}
                        </View>
                        <View style={{flex:3}}>
                          <View style={{flex:1}}></View>
                          <View style={{flex:3}}>
                            <View style={[styles.row, {flex:1}]}>
                              <View paddingHorizontal={this.state.width*0.005} />
                              <View style={[styles.row, {flex:4}]}>
                                {/* <Ionicons style={{flex:2}} name="ios-shirt" size={25} color="#000000"/> */}
                                <Image
                                  style={[
                                    {flex:2, width: this.state.width*0.026, height: this.state.height*0.026}
                                  ]}
                                  resizeMode='contain'
                                  source={require('../../../assets/resources/aogaku_logo.png')}/>
                                <Text style={[GridStyles.itemName, {flex:5, marginTop:3}]}>{item.team_name_home}</Text>
                                <Text style={[GridStyles.itemName, {flex:2}]}>{item.score_home}</Text>
                              </View>
                            </View>
                            <View style={[styles.row, {flex:1}]}>
                              <View paddingHorizontal={this.state.width*0.005} />
                              <View style={[styles.row, {flex:4}]}>
                                {/* <Ionicons style={{flex:2}} name="ios-shirt-outline" size={25} color="#000000"/> */}
                                <Image
                                  style={[
                                    {flex:2, width: this.state.width*0.026, height: this.state.height*0.026}
                                  ]}
                                  resizeMode='contain'
                                  source={require('../../../assets/resources/waseda_logo.png')}/>
                                <Text style={[GridStyles.itemName, {flex:5, marginTop:3}]}>{item.team_name_visitor}</Text>
                                <Text style={[GridStyles.itemName, {flex:2}]}>{item.score_visitor}</Text>
                              </View>
                            </View>
                          </View>

                          <View style={{flex:1}}>
                            <Text style={GridStyles.itemCode}>{item.date_str}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                )}
              />
            </View>
          </View>
          {/* フッター */}
          {/* <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <Text style={{color:'#ffffff'}}>ここにフッターを記載する</Text>
          </View> */}
        </View>
        <View style={{flex:1}}></View>
      </SafeAreaView>
    )
  }
}

const GridStyles = StyleSheet.create({

  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 0,
    // marginLeft: 5,
    // marginRight: 5,
    // marginBottom: 0,
  },
  search_bar: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems:'center', 
    justifyContent: 'flex-end', 
    width: '100%', 
    marginRight: '2%',
  },
  contents: {
    flex: 19,
    alignItems:'flex-start',
    justifyContent: 'center', 
    width: '100%',
    backgroundColor: 'transparent',
  },

  gridView: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  titleName: {
    fontSize: RFPercentage(1),
    fontFamily: 'Raleway-SemiBold',
    marginTop: hp(1.7),
    color: '#ffffff',
  },
  itemContainer: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  itemName: {
    fontSize: RFPercentage(1.5),
    fontFamily: 'Raleway-SemiBold',
    color: '#000000',
    fontWeight: '600',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000000',
    marginLeft: 10
  },
});

GameSelection.propTypes = propTypes;
export default GameSelection;