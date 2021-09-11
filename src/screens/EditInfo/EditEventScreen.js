/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, ScrollView } from 'react-native';
// グリッド表示
import { SearchBar } from 'react-native-elements';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// 確認ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// テーブル
import { Table, Row, Rows, Col, Cols, Cell, TableWrapper} from 'react-native-table-component';
// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/CommonStyles';
import EditEventStyles from './EditEventStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/

// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;
class EditEvent extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      // 確認ダイアログ表示フラグ
      isConfirmDialogVisible: false,
      // ローディングスピナー表示フラグ
      isLoadingVisible: false,
      // Congnito User情報
      cognitoUser: null,
      // delete時のsk情報
      sk: "",
      // deleteするtableDataのindex情報
      index: "",
      // 画面を制御するID情報
      id: "",
      // 画面遷移パラメータ
      screenParams:[],
      // テーブルのヘッダ表示
      tableHead: {
        EVENT:['Name', 'ShortName', 'Initial', 'StartDate', 'EndDate','Delete'],
        GAME: ['EventName', 'Stage','StartTime','Home','Visitor','Delete'],
        TEAM: ['Name', 'ShortName','Initial','Delete'],
        PLAYER: ['Name', 'Team','MainNumber','SubNumber','Position','Delete']
      },
      // テーブルのキー項目
      headerKey: {
        EVENT:['info_name','short_name','initial','event_start_date','end_date','sk'],
        GAME:['event_name','game_stage','game_start_time','team_name_home','team_name_visitor','sk'],
        TEAM:['info_name','short_name','initial','sk'],
        PLAYER:['info_name','team_name','main_number','sub_number','main_position','sk']
      },
      tableData: [],
      resulttableData: [],
      idName:{
        EVENT: 'Event',
        GAME: 'Game',
        TEAM: 'Team',
        PLAYER: 'Player'
      },
      buttonIndex: {
        EVENT: 5,
        GAME: 5,
        TEAM: 3,
        PLAYER: 5
      },
      infoList: [],
      searchText: '',
      width: 0,
      height: 0,
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
    const id = navigation.state.params.id;
    this.setState({id:id})
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
  // ホームアイコン押下時
  gohome = () => {
    // メニュー画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.MENU);
  }

  // New Gameボタン押下時
  createInfo = () => {
    // CreateGame画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID['CREATE_'+this.state.id],{"category":"create"});
  }

  _deleteItem() {
    cognitoUser = this.state.cognitoUser
    this.setState({cognitoUser:cognitoUser})
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

        // INFO情報取得
        let param = {
          category: Constants.DB_CATEGORY.DELETE,
          pk: cognitoUser.username,
          sk: this.state.sk,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.PUT, succ, param);
      }
    })
  }

  _EditScreen(index) {
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID['CREATE_'+this.state.id],{"data":this.state.screenParams[index]});
  }

  _searchFilterFunction = (text) => {
    this.setState({searchText: text})
    if (text) {
      const textData = text.toUpperCase();
      let newData = []
        this.state.tableData.forEach(function (items) {
          items.some(function (item) {
            const itemData = item ? item.toUpperCase() : ''.toUpperCase();
            // テキストの文字列が含まれるかどうか
            if (itemData.indexOf(textData) > -1) {
              newData.push(items)
              return true;
            }
          });
        });
        this.setState({resulttableData: newData});
    } else {
      // Inserted text is blank
      this.setState({resulttableData: this.state.tableData});
    }
  };

/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  // 初期処理
  init = async(event) => {
    // Cognitoユーザー取得
    cognitoUser = await GetCognitoUser();
    this.setState({cognitoUser:cognitoUser})
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

        // INFO情報取得
        let param = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE[this.state.id],
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param);
      }
    });
  }
  // API Gateway経由でDynamoDBにリクエストを行う
  requestInfo = async(method, succ, param) => {
    const state = this.state;
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

        if(method === Constants.REQUEST_METHOD.POST) {
          let tableData_list = []
          let screenParams_list = []
          // Info情報取得
          response.data.Items.forEach(function(val, index) {
            let temp_items = [];
            state.headerKey[state.id].forEach(function(key, i) {
              if (key == 'event_start_date' || key == 'end_date') {
                const temp_date = val[key].substr(0,4) + '/' + val[key].substr(4,2) + '/' + val[key].substr(6,2)
                temp_items.push(temp_date)
                val[key] = temp_date
              } else if (key == 'game_start_time') {
                const temp_date = val[key].substr(0,4) + '/' + val[key].substr(4,2) + '/' + val[key].substr(6,2) + ' ' + val[key].substr(8,2) + ':' + val[key].substr(10,2)
                temp_items.push(temp_date)
                val[key] = temp_date
              }
              else {
                temp_items.push(response.data.Items[index][key])
              }
            })
            tableData_list.push(temp_items)
            screenParams_list.push(val)
          })
          console.log(tableData_list)
          this.setState({tableData:tableData_list})
          this.setState({resulttableData:tableData_list})
          this.setState({screenParams:screenParams_list})
        } else {
          // PUTの場合はDelete処理なので、tableDataから該当indexのデータを削除
          this.state.tableData.splice(this.state.index, 1)
          this.setState({ isConfirmDialogVisible: false })
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
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this.setState({ isConfirmDialogVisible: true, sk: data, index: index})}>
        <View style={EditEventStyles.edit_btn} >
          <Text style={EditEventStyles.btnText}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
    const searchText = this.state;
    return (
      <ImageBackground
        source={imgPath}
        style={styles.bgImage}
        imageStyle={{resizeMode: 'repeat'}}>
        <View
          onLayout={this._onLayout.bind(this)}
          style={[{width: this.state.width, height: this.state.height}, styles.container,]}>

          {/* ボタン、アイコン */}
          <View style={[styles.row, EditEventStyles.contents_a]}>
              {/* Create New Eventボタン */}
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createInfo()}>
              <Text style={[styles.buttonText]}>Create New {state.idName[state.id]}</Text>
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
            {/* Homeアイコン */}
            <View style={EditEventStyles.icon_area}>
              <TouchableOpacity  onPress={() => this.gohome()} >
                <Icon style={[styles.icon_home]} name='home'/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.row, EditEventStyles.contents_c]}>
            <View style={styles.container}>
              <Table borderStyle={{borderWidth:0.5}}>
                <Row data={state.tableHead[state.id]} style={[styles.tableHead, EditEventStyles.tableHead]} textStyle={[styles.tableHeadText, EditEventStyles.tableHeadText]}/>
              </Table>
              <ScrollView showsVerticalScrollIndicator={false} style={[{marginTop:-1}]}>
                <Table borderStyle={styles.tableBorderWidth}>
                  {
                    state.resulttableData.map((rowData, index) => (
                      <TableWrapper key={index} style={styles.tableRow}>
                        {
                          rowData.map((cellData, cellIndex) => (
                            <Cell
                              onPress={() => this._EditScreen(index)}
                              key={cellIndex}
                              data={cellIndex === state.buttonIndex[state.id] ? element(cellData, index) :cellData}
                              textStyle={[styles.tableText,EditEventStyles.tableText]}/>
                          ))
                        }
                      </TableWrapper>
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
          </View>
          {/* 確認ダイアログ */}
          <ConfirmDialog
            title=""
            message={Messages.INFO.I004}
            visible={this.state.isConfirmDialogVisible}
            onTouchOutside={() => this.setState({ isConfirmDialogVisible: false })}
            positiveButton={{
              title: 'OK',
              onPress: () => this._deleteItem()
            }}
            negativeButton={{
              title: 'Cancel',
              onPress: () => this.setState({ isConfirmDialogVisible: false })
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

export default EditEvent;