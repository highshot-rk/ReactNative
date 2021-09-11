/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {RFPercentage} from "react-native-responsive-fontsize";
import Picker from 'react-native-picker-js';

// import {Picker} from '@react-native-picker/picker';
// モーダルダイアログ
import Modal from "react-native-modal";
// グリッド表示
import { FlatGrid } from 'react-native-super-grid';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// 完了ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// カラーピッカー
import { ColorPicker } from 'react-native-color-picker'
// ローカルインポート
import styles from '../../common/CommonStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import ToHalfWidth from '../../util/ToHalfWidth';
import BaseStyles from '../../common/BaseStyles';
import { width } from 'styled-system';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
const propTypes = {
  updateCreateTeamPlayer: PropTypes.func,
};

const win = Dimensions.get('window');

const numbers = Constants.NUMBERS;

// let imgPath;
const pickerSelectStyles_rp = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: win.width*0.1,
    paddingHorizontal: 20,
    borderColor: '#000000',
    borderRadius: 7,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icons
  },
  iconContainer: {
    top: 17,
    right: 15,
  },
});
const styleTemp = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginLeft: win.width*0.01,
    marginRight: win.width*0.01,
    alignItems:'center',
    width: '85%',
  },
  row_input: {
    height: hp(4.5),
    width: wp(35),
    margin: 5,
    marginLeft:16,
    borderRadius: 7,
    backgroundColor: '#75787b',
    borderColor: '#777777',
},
  input: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: wp(35),
    borderRadius: 7,
    backgroundColor: '#75787b',
},
  // 入力フォーム小
  input_sm: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    // fontSize: RFPercentage(2),
    fontSize: RFPercentage(1.5),
    width: win.width*0.24,
    height: hp(4.5),
    margin: 5,
    marginTop:0,
    // paddingLeft: 5,
    borderRadius: 7,
    backgroundColor: '#75787b',
    // borderColor: '#75787b',
    // borderWidth: 0.5,
  },
  text_area: {
    width: win.width*0.1
  },
  icon_tshirt: {
    fontSize: RFPercentage(2.5),
    color: 'rgba(255,255,255,0.8)',
    marginTop:10
  },
  modal: {
    // backgroundColor: 'rgba(245,245,245,0.8)',
    // backgroundColor: 'whitesmoke',
    // borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    top: hp(5),
    bottom: hp(5),
    left: wp(10),
    right: wp(10),
    position:'absolute'
  },
gridView: {
    paddingTop: 0,
    flex:1
},
});

class CreatePlayer extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      width: win.width,
      // Cognito User
      cognitoUser: null,
      // ローディングスピナー表示フラグ
      isLoadingVisible: false,
      isMessageDialogVisible: false, // 完了メッセージダイアログ
      // ダイアログ表示フラグ
      isConfirmDialogVisible: false,
      isColorPickerModalVisible: false,
      isDialogVisible : true,
      refreshFlatGrid:false,
      // APIパラメータのcategory
      category: Constants.DB_CATEGORY.ADD,
      // SK
      sk:Constants.SK_TYPE.PLAYER,
      // ラベル
      label_player_name: 'Player Name (JA)',
      label_team_name: 'Team Name',
      label_main_number: 'Main Number',
      label_sub_number: 'Sub Number',
      label_position: 'Position',
      label_button: 'Create Player',
      // ドロップダウンのリスト値
      teamList: [''],
      // ドロップダウン選択値
      defaultValue_team: [],
      // 画面遷移パラメーター
      params: null,
      // 画面入力フォーム
      player_name: '',
      team_name: {label:'',value:'',key:''},
      main_number: '',
      sub_number: '',
      // エラーメッセージ
      errorMessage: '',
      selectedColor: '#ffffff',
      selectedTeam: '',
      // demoデータ
      // demodata: [
      //   {num:'1', name:'Player1', key:1},
      //   {num:'2', name:'Player2', key:2},
      //   {num:'3', name:'Player3', key:3},
      //   {num:'4', name:'Player4', key:4},
      //   {num:'5', name:'Player5', key:5},
      //   {num:'', name:'', key:null},
      // ],
      demodata: {
        '':[
          {num:'1', name:'Player1', key:1},
          {num:'2', name:'Player2', key:2},
          {num:'3', name:'Player3', key:3},
          {num:'4', name:'Player4', key:4},
          {num:'5', name:'Player5', key:5},
          {num:'', name:'', key: null},
        ],
        'tm_001':[
          {num:'1', name:'AAA', key:1},
          {num:'2', name:'BBB', key:2},
          {num:'3', name:'CCC', key:3},
          {num:'4', name:'DDD', key:4},
          {num:'5', name:'EEE', key:5},
          {num:'6', name:'FFF', key:6},
          {num:'7', name:'GGG', key:7},
        ],
        'tm_002':[
          {num:'1', name:'aaa', key:1},
          {num:'2', name:'bbb', key:2},
          {num:'3', name:'ccc', key:3},
          {num:'4', name:'ddd', key:4},
          {num:'5', name:'eee', key:5},
          {num:'6', name:'fff', key:6},
          {num:'7', name:'ggg', key:7},
        ],
        'tm_001':[
          {num:'1', name:'あああ', key:1},
          {num:'2', name:'いいい', key:2},
          {num:'3', name:'ううう', key:3},
          {num:'4', name:'えええ', key:4},
          {num:'5', name:'おおお', key:5},
          {num:'6', name:'かかか', key:6},
          {num:'7', name:'ききき', key:7},
        ]
      },
      demoteam: [
        { label: '青山学院', value: '青山学院', key: 'tm_001'},
        { label: '早稲田', value: '早稲田', key: 'tm_002'},
        { label: '明治', value: '明治', key: 'tm_003'},
      ]
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // // 背景画像取得
    // imgPath = require(img);
    this._createTeamList();

    // 画面遷移時の再レンダリング対応
    const { navigation } = this.props;
    if  (navigation.state.params) {
      // 画面遷移パラメーター
      if (navigation.state.params.selectedTeam) {
        this.setState({ defaultValue_team: navigation.state.params.selectedTeam });
        this.setState({ team_name: navigation.state.params.selectedTeam });
        this.setState({ teamList: navigation.state.params.team });
      } else if (navigation.state.params.data) {
        const infoData = navigation.state.params.data;
        this.setState({infoData:infoData});
        this.setState({player_name:infoData.info_name});
        this.setState({main_number:infoData.main_number});
        this.setState({sub_number:infoData.sub_number});
        this.setState({position:infoData.main_position});
        this.setState({date_to:infoData.end_date});
        this.setState({sk:infoData.sk});
        this.setState({team_name:{label:infoData.team_name ,value:infoData.main_team}});
        this.setState({defaultValue_team:{label:infoData.team_name ,value:infoData.main_team}});
        this.setState({label_button:'Edit Player'});
        this.setState({category:Constants.DB_CATEGORY.UPDATE});
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT});
        // 初期処理
        this.init();
      }
    };
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
      height: Dimensions.get('window').height,
    });
  };
	_onPressHandle() {
		this.picker.toggle();
	};
  _createTeamList() {
    let teamData = this.state.demoteam;
    teamData.unshift({label:'',value:'',key:''});
    let teamList = [];
    teamData.map((item) => {
      teamList.push(item.label);
    })
    this.setState({teamList:teamList})
  };
  _selectedTeam(value) {
    const selectedItem = this.state.demoteam.find((item) => item.value === value[0]);
    this.setState({team_name:selectedItem, selectedTeam:value, refreshFlatGrid:!this.state.refreshFlatGrid})
  };

  _changeText = (text,index,flg) => {
    let playerlist = this.state.demodata[this.state.team_name.key];
    if (flg=='num'){
      playerlist[index] = {'num':text}
    } else {
      playerlist[index] = {'name':text}
    }
    this.setState({demodata:playerlist})
  }
  _onPressPlus() {
    let player_list = this.state.demodata[this.state.team_name.key]
    player_list.push({"num":'','name':''})
    this.setState({demodata:player_list})
  }
  _onPressDelete(index) {
    let data = this.state.demodata;
    let player_list = data[this.state.team_name.key]
    player_list.splice(index,1)
    data[this.state.team_name.key] = player_list
    this.setState({demodata:data, refreshFlatGrid:!this.state.refreshFlatGrid})
  }

  // Create Playerボタン押下時
  createPlayer = async(event) => {
    const {
      player_name,
      team_name,
      main_number,
      sub_number,
      position,
      category,
      sk
    } = this.state;

    // 入力チェック
    if (!this.inputCheck(player_name, team_name.label, main_number, sub_number, position)) { return; }
    this.setState({ errorMessage: '' });

    // Cognitoユーザー取得
    if (this.state.cognitoUser) {
      cognitoUser = this.state.cognitoUser;
    } else {
      cognitoUser = await GetCognitoUser();
    }
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

        const param = {
          category: category,
          pk: cognitoUser.username,
          sk: sk,
          data: {
            info_name: player_name,
            main_team: team_name.value,
            main_number: ToHalfWidth(main_number),
            sub_number: ToHalfWidth(sub_number),
            main_position: position,
          },
        };

      //   // API接続
      //   this.requestInfo(Constants.REQUEST_METHOD.PUT, succ, param);
      // }
        // API接続
        await RequestApi(
          Constants.REQUEST_METHOD.PUT,
          Constants.API_BASE_URL + 'info',
          succ.getAccessToken().getJwtToken(),
          param,
        ).then((response) => {
          // ローディングスピナークローズ
          this.setState({ isLoadingVisible: false, });
          if(response !== null) {
            // 確認ダイアログオープン
            this.setState({
              isConfirmDialogVisible: true,
            });

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
    });
  }
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  // 初期処理
  init = async(event) => {
    // Cognitoユーザー取得
    cognitoUser = await GetCognitoUser();
    this.setState({cognitoUser: cognitoUser})
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

        // Team情報取得
        let param = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.TEAM,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param);
      }
    });
  }
  // API Gateway経由でDynamoDBにリクエストを行う
  requestInfo = async(method, succ, param) => {
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
        const items = [];
        if(method === Constants.REQUEST_METHOD.POST) {
          // イベントリスト、チームリストセット
          response.data.Items.forEach(function(name, index) {
            const label = response.data.Items[index].info_name;
            const value = response.data.Items[index].sk;
            items.push({
              label: label,
              value: value,
            });
          })
          this.setState({ teamList: items });
        } else {
          // 確認ダイアログオープン
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

  // 入力チェック
  inputCheck(player_name, team_name, main_number, sub_number, position) {
    if (player_name === '') {
      this.setState({ errorMessage: this.state.label_player_name + Messages.WARN.W001 });
      return false;
    }
    if(team_name === '') {
      this.setState({ errorMessage: this.state.label_team_name + Messages.WARN.W001 });
      return false;
    }
    if(main_number === '') {
      this.setState({ errorMessage: this.state.label_main_number + Messages.WARN.W001 });
      return false;
    } else {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(main_number);
      // 正規表現(半角数字1~3桁)
      let reg = new RegExp(/^([0-9]{1,3})$/);
      if (!reg.test(chkVal)) {
        this.setState({ errorMessage: this.state.label_main_number + Messages.WARN.W009 });
        return false;
      }
    }
    if (sub_number === '') {
      // サブの背番号は任意項目のため、エラーとしない
    } else {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(sub_number);
      // 正規表現(半角数字1~3桁)
      let reg = new RegExp(/^([0-9]{1,3})$/);
      if (!reg.test(chkVal)) {
        this.setState({ errorMessage: this.state.label_sub_number + Messages.WARN.W009 });
        return false;
      }
    }
    if (position === '') {
      this.setState({ errorMessage: this.state.label_position + Messages.WARN.W001 });
      return false;
    }
    return true;
  }

  // ホームアイコン押下時
  goHome = () => {
    // ローディングスピナー起動
    this.setState({ isLoadingVisible: true })
    setTimeout(()=>{
      // 1秒後にローディングスピナーを終了し、メッセージダイアログ起動
      this.setState({ isLoadingVisible: false })
      this.setState({ isMessageDialogVisible: true });
      setTimeout(()=>{
            // 2秒後にメッセージダイアログを終了し、画面を閉じる
        this.setState({ isMessageDialogVisible: false });
        return this.props.updateCreateTeamPlayer();
      }, 2000)
    }, 1000);
  }
  // カラーモーダル起動
  toggleColorModal = () => {
    this.setState({
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
    });
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    return (
      <View style={{flex:1, flexDirection:'row'}}>
        {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
        <Spinner
          visible={this.state.isLoadingVisible}
          textContent={Messages.INFO.I003}
          textStyle={styles.labelText}
          overlayColor={'#rgba(0, 0, 0, 0.3)'}
        />
        {/* 完了メッセージダイアログ */}
        <ConfirmDialog
          visible={this.state.isMessageDialogVisible}
          title=""
          onTouchOutside={() => this.setState({isMessageDialogVisible: false})}
          animationType={'fade'}
          contentStyle={[
            {
              flex: 1,
              width: '100%',
              backgroundColor:"transparent",
              paddingTop: win.height*0.12,
              paddingBottom: win.height*0.12,
            }
          ]}
          overlayStyle={{ backgroundColor:"rgba(0,0,0,0.7)"}}
          dialogStyle={[
            {
              flex: 1,
              backgroundColor: 'transparent'
            }
          ]}
          >
          <View style={[BaseStyles.row], { backgroundColor: 'transparent'}}>
            <Text style={[BaseStyles.title, {textAlign: 'center', color: '#ffffff', fontSize: RFPercentage(2)}]}>
              <Icon style={{textAlign: 'center'}} name="check" size={RFPercentage(2)} color="#7cbb42"/>　登録が完了しました
            </Text>
          </View>
        </ConfirmDialog>
        {/* Error Message */}
        {/* <View style={[styles.row]}>
          <Text style={[styles.errorText, CreateCommonStyles.errorText_custom]}>{this.state.errorMessage}</Text>
        </View> */}
        {/* Text */}
        {/* <View alignItems='center' style={[{marginBottom:40}]}> */}
        <View style={{flex:1}}/>
        <View style={{flex:18}}>
          {/* ヘッダー */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={[BaseStyles.headerText]}>登録したいチームの情報を入力してください</Text>
            </View>
          </View>

          <View alignItems='center' justifyContent='center' style={{flex:4}}>
            {/* Team Name */}
            <View style={[styleTemp.row, {flex:1}]} alignItems='center'>
              <Text style={[BaseStyles.labelText, styleTemp.text_area]}>チーム名</Text>
              <View paddingHorizontal={win.width*0.01}/>
              <View style={[styleTemp.row_input]} >
                <TextInput
                  onChangeText={team_name => this.setState({ team_name })}
                  style={[styleTemp.input]}
                  autoCapitalize={'none'}
                  placeholder={'Enter the Team'}
                  spellCheck={false}
                  placeholderTextColor={'#ffffff'}
                  keyboardType={'default'}
                  defaultValue={this.state.team_name.value}
                  value={this.state.team_name.value}
                  theme={{colors:{text:'#ffffff'}}}
                  right={
                    <TextInput.Icon name="chevron-down" color='white' onPress={this._onPressHandle.bind(this)}/>
                  }
                />
              </View>
              <TouchableOpacity style={[styles.formElement]} onPress={this.toggleColorModal}>
                <Icon
                style={[
                  styleTemp.icon_tshirt,
                  {
                    color: this.state.selectedColor,
                  }
                ]}
                name='tshirt'/>
              </TouchableOpacity>
              <SafeAreaView>
                <Modal
                  isVisible={this.state.isColorPickerModalVisible}
                  // swipeDirection={['up', 'down', 'left', 'right']}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  animationInTiming={1000}
                  animationOutTiming={800}
                  onBackdropPress={this.toggleColorModal}
                  style={{
                    top: win.height * 0.1,
                    bottom: win.height * 0.1,
                    left: win.width * 0.1,
                    right: win.width * 0.1,
                    position:'absolute'
                  }}
                >
                  <ColorPicker
                    onColorSelected={color => this.setState({selectedColor:color,isColorPickerModalVisible:false})}
                    style={{flex:1/2}}
                    hideSliders={true}
                  />
                </Modal>
              </SafeAreaView>
            </View>
            {/* 選手情報 */}
            <View style={[styleTemp.row,{alignItems:'flex-start', flex:5}]}>
              <Text style={[BaseStyles.labelText,styleTemp.text_area,{marginTop:15}]}>選手名</Text>
              <View paddingHorizontal={win.width*0.01} />
              <FlatGrid
                itemDimension={this.state.width}
                // data={this.state.demodata}
                data={this.state.demodata[this.state.team_name.key]}
                extraData={this.state.refreshFlatGrid}
                style={styleTemp.gridView}
                renderItem={({ item, rowIndex}) => (
                  <View style={[styles.row,{alignItems:'center'}]}>
                    <RNPickerSelect
                      // itemKey={item.key}
                      placeholderTextColor={'#ffffff'}
                      placeholder={{value:null}}
                      onValueChange={(value) => console.log(value)}
                      value={item.num}
                      style={pickerSelectStyles_rp}
                      items={numbers}
                      Icon={() => <Icon name="chevron-down" size={14} color="#ffffff"/>}
                    />
                    <View paddingHorizontal={5}/>
                    <TextInput
                      // onChangeText={text => _changeText(text,index,'name')}
                      style={[styleTemp.input_sm]}
                      keyboardType='default'
                      autoCapitalize={'none'}
                      placeholder={'選手名'}
                      spellCheck={false}
                      placeholderTextColor={'#ffffff'}
                      keyboardType={'default'}
                      // defaultValue={item.name}
                      value={item.name}
                      theme={{colors:{text:'#ffffff'}}}
                    />
                    <TouchableOpacity style={[styles.formElement,{alignItems:'center'}]} onPress={()=> this._onPressDelete(rowIndex)}>
                    <Icon
                      style={BaseStyles.icon_trash}
                      name='trash'/>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* プラスボタン*/}
            <View style={[styles.row,{flex:1}]}>
              <View paddingHorizontal={wp(16)}/>
              <TouchableOpacity onPress={() => this._onPressPlus()}>
                <FeatherIcon name="plus-circle" size={40} color="#ffffff"/>
              </TouchableOpacity>
            </View>
          </View>
          {/* 登録*/}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <TouchableOpacity style={[BaseStyles.formElement,BaseStyles.button_lg_sk]} onPress={() => this.goHome()}>
              <Text style={[styles.buttonText]}>決定</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex:1}}>
        </View>
        <View style={{bottom:-(win.height*0.05),left:-(win.width*0.1), position:'absolute'}}>
          <Picker
            ref={picker => this.picker = picker}
            style={{height: 200,position:'absolute',alignItems:'center'}}
            showDuration={300}
            pickerData={this.state.teamList}
            pickerCancelBtnText=''
            onPickerDone={(value) => this._selectedTeam(value)}
            selectedValue={this.state.selectedTeam}
          />
        </View>
      </View>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(CreatePlayer);