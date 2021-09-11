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
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {RFPercentage} from "react-native-responsive-fontsize";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Picker from 'react-native-picker-js';

// import DatePicker from 'react-native-datepicker';
// import Picker from 'react-native-picker';
// モーダルダイアログ
import Modal from "react-native-modal";
// グリッド表示
import { FlatGrid } from 'react-native-super-grid';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// 確認ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// カラーピッカー
import { ColorPicker } from 'react-native-color-picker'
// import { ColorPicker } from 'react-native-status-color-picker';
// Prop
import PropTypes from 'prop-types';
// ローカルインポート
import styles from '../../common/CommonStyles';
import CreateCommonStyles from './CreateCommonStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import ToHalfWidth from '../../util/ToHalfWidth';
import BaseStyles from '../../common/BaseStyles';
import { flexDirection } from 'styled-system';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/

const win = Dimensions.get('window');
const propTypes = {
  closeNewGameModal: PropTypes.func
}

const numbers = Constants.NUMBERS;
const teams = [
  { label: '青山学院', value: '青山学院' },
  { label: '早稲田', value: '早稲田' },
  { label: '明治', value: '明治' },
  { label: '筑波', value: '筑波' },
  { label: '法政', value: '法政' },
  { label: '東海', value: '東海' },
  { label: '白鴎', value: '白鴎' },
];
const events = [
  { label: 'インターカレッジ', value: 'インターカレッジ' },
  { label: '春季リーグ', value: '春季リーグ' },
  { label: '練習試合', value: '練習試合' },
  { label: '秋季リーグ', value: '秋季リーグ' },
  { label: '新人戦', value: '新人戦' },
]
const pickerSelectStyles_team = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: win.width*0.35,
    margin: 5,
    padding: 15,
    borderRadius: 7,
    justifyContent:'center',
    backgroundColor: '#75787b',
    color: '#ffffff',
  },
  iconContainer: {
    top: 17,
    right: 15,
  },
});
const pickerSelectStyles_round = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: wp(7),
    margin: 5,
    paddingHorizontal: 25,
    borderRadius: 7,
    backgroundColor: '#75787b',
    color: '#ffffff',
  },
  iconContainer: {
    top: 19,
    right: 15,
  },
});
const styleTemp = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:'center',
    width:'85%',
    marginLeft: win.width*0.01,
    marginRight: win.width*0.01,
  },
  text_area: {
    width: win.width*0.12,
    alignItems:'center'
  },
  button: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    // fontSize: RFPercentage(2),
    fontSize: RFPercentage(2),
    height: hp(4.5),
    width: win.width*0.35,
    margin: 5,
    paddingLeft: 5,
    borderRadius: 7,
    marginBottom: 10,
    borderRadius: 7,
    backgroundColor: '#75787b',
    borderColor: '#777777',
  },
  input: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    // fontSize: RFPercentage(2),
    fontSize: RFPercentage(1.5),
    height: hp(4.5),
    width: win.width*0.35,
    margin: 5,
    paddingLeft: 5,
    borderRadius: 7,
    backgroundColor: '#75787b',
    borderColor: '#777777',
  },
  calenderBox: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    // fontSize: RFPercentage(2),
    fontSize: RFPercentage(2),
    height: hp(4.5),
    width: win.width*0.35,
    alignItems:'flex-start',
    margin: 5,
    paddingLeft: 5,
    borderRadius: 7,
    backgroundColor: '#75787b',
    borderColor: '#777777',
  },
  // 入力フォーム小
  input_sm: {
    fontFamily: 'Raleway-Regular',
    color: '#ffffff',
    // fontSize: RFPercentage(2),
    fontSize: RFPercentage(2),
    width: win.width*0.23,
    height: hp(4.5),
    margin: 5,
    paddingLeft: 5,
    borderRadius: 7,
    backgroundColor: '#75787b',
    borderColor: '#75787b',
    borderWidth: 0.5,
  },
  labelText_custom: {
    fontSize: RFPercentage(1.5),
    width: wp(16),
    margin: 5,
    padding: 5,
    justifyContent:'center'
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
  modal_date: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    // borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    top: hp(20),
    bottom: hp(20),
    left: wp(20),
    right: wp(20),
    position:'absolute'
  },
gridView: {
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
},
});

class newGameScreen extends Component {
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
      // ダイアログ表示フラグ
      isMessageDialogVisible: false,
      isColorPickerModalVisible_home: false,
      isColorPickerModalVisible_visitor: false,
      isDialogVisible : true,
      isDatePickerVisible: false,
      isEventPickerVisible: false,
      // APIパラメータのcategory
      category: Constants.DB_CATEGORY.ADD,
      // OKボタン押下時のスクリーンID
      screenId: null,
      // SK
      sk:Constants.SK_TYPE.PLAYER,
      // ドロップダウンのリスト値
      eventList: [''],
      // ドロップダウン選択値
      defaultValue_team: [],
      // 画面遷移パラメーター
      params: null,
      // 画面入力フォーム
      event_name: {label:'',value:'',key:''},
      // 日付
      date: new Date(),
      // エラーメッセージ
      errorMessage: '',
      selectedColor_home: '#ffffff',
      selectedColor_visitor: 'red',
      selectedEvent: '',
      // demoデータ
      demodata: [
        {num:'1', name:'Player1'},
        {num:'2', name:'Player2'},
        {num:'3', name:'Player3'},
        {num:'4', name:'Player4'},
        {num:'5', name:'Player5'},
      ],
      demoevent: [
        { label: '練習試合', value: '練習試合', key: 'tm001'},
        { label: '春季リーグ', value: '春季リーグ', key: 'tm002'},
        { label: '総理大臣杯', value: '総理大臣杯', key: 'tm003'},
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
    this._createEventList();

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
  _createEventList() {
    let eventData = this.state.demoevent;
    eventData.unshift({label:'',value:'',key:''});
    let eventList = [];
    eventData.map((item) => {
      eventList.push(item.label);
    })
    this.setState({eventList:eventList})
  };
  _selectedEvent(value) {
    const selectedItem = this.state.demoevent.find((item) => item.value === value[0]);
    this.setState({event_name:selectedItem, selectedEvent:value})
  };
  _onConfirm = (date) => {
    if (date === undefined) {
      this.setState({
        isDatePickerVisible:false
      })
    } else {
      this.setState({
        date: date,
        isDatePickerVisible:false
      })
    }
  }
  _changeText = (text,index,flg) => {
    let playerlist = this.state.demodata;
    if (flg=='num'){
      playerlist[index] = {'num':text}
    } else {
      playerlist[index] = {'name':text}
    }
    this.setState({demodata:playerlist})
  }
  _onPressPlus() {
    let player_list = this.state.demodata
    player_list.push({"num":'','name':''})
    this.setState({demodata:player_list})
  }
  _onPressDelete(index) {
    let player_list = this.state.demodata
    player_list.splice(index,1)
    this.setState({demodata:player_list})
  }
  _onChange = (selectedDate) => {
    this.setState({ date: selectedDate });
  };

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

  // OKボタン押下時
  goToScreen = () => {
    this.setState({ isConfirmDialogVisible: false });
    if (this.state.screenId) {
      // AssignMember画面にプッシュ遷移
      const { navigation } = this.props;
      navigation.navigate(this.state.screenId)
    } else {
      // 画面入力フォーム
      this.setState({player_name: ''})
      this.setState({main_number: ''})
      this.setState({sub_number: ''})
      this.setState({position: 'Please select...'})
    };
  }
  // ホームアイコン押下時
  goHome = () => {
    this.setState({isMessageDialogVisible:true})
    setTimeout(()=>{
      this.setState({
        isMessageDialogVisible:false
      },
      this.props.closeNewGameModal()
      )
    }, 2000)
  }
  // カラーモーダル起動
  toggleColorModal_home = () => {
    this.setState({
      isColorPickerModalVisible_home: !this.state.isColorPickerModalVisible_home,
    });
  }
  // カラーモーダル起動
  toggleColorModal_visitor = () => {
    this.setState({
      isColorPickerModalVisible_visitor: !this.state.isColorPickerModalVisible_visitor,
    });
  }

/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    return (
      <SafeAreaView style={{flex:1, flexDirection:'row'}}>
        {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
        <Spinner
          visible={this.state.isLoadingVisible}
          textContent={Messages.INFO.I003}
          textStyle={styles.labelText}
          overlayColor={'#rgba(0, 0, 0, 0.3)'}
        />

        {/* Error Message */}
        {/* <View style={[styles.row]}>
          <Text style={[styles.errorText, CreateCommonStyles.errorText_custom]}>{this.state.errorMessage}</Text>
        </View> */}

        <View style={{flex:1}}/>
        <View style={{flex:18}}>
          {/* ヘッダー */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={[BaseStyles.headerText]}>試合情報を入力してください</Text>
            </View>
          </View>

          <View style={{flex:4, alignItems:'center'}}>
            {/* Event Name */}
            <View style={[styleTemp.row]}>
              <Text style={[BaseStyles.labelText, styleTemp.text_area]}>大会名</Text>
              <View paddingHorizontal={win.width*0.01} />
              <TextInput
                onChangeText={event_name => this.setState({ event_name })}
                style={[styleTemp.input]}
                autoCapitalize={'none'}
                placeholder={'Enter the Event'}
                spellCheck={false}
                placeholderTextColor={'#ffffff'}
                keyboardType={'default'}
                defaultValue={this.state.event_name}
                value={this.state.event_name.value}
                theme={{colors:{text:'#ffffff'}}}
                right={
                  <TextInput.Icon name="chevron-down" color='white' onPress={this._onPressHandle.bind(this)}/>
                }
              />
            </View>
            {/* Date */}
            <View style={[styleTemp.row]}>
              <Text style={[BaseStyles.labelText,styleTemp.text_area]}>日付</Text>
              <View paddingHorizontal={win.width*0.01}  />
              <TouchableOpacity style={[styleTemp.button]} onPress={() => this.setState({isDatePickerVisible:true})}>
              {/* <TouchableOpacity style={[styleTemp.button]} onPress={this.setState({isDatePickerVisible:true})}> */}
                <Text style={[styles.buttonText,styleTemp.labelText_custom,{alignSelf:'left'}]}> {this.state.date.getFullYear()}年{this.state.date.getMonth()+1}月{this.state.date.getDate()}日 </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                // value={this.state.date}
                isVisible={this.state.isDatePickerVisible}
                mode={'date'}
                date={this.state.date}
                // textColor='#ffffff'
                // customCancelButtonIOS={{disabled:true}}
                // onChange={(date) => this._onChange(date)}
                locale={'ja'}
                onCancel={(date) => this._onConfirm(date)}
                onConfirm={(date) => this._onConfirm(date)}
              />
            </View>
            {/* round */}
            <View style={[styleTemp.row]}>
              <Text style={[BaseStyles.labelText,styleTemp.text_area]}>ラウンド</Text>
              <View paddingHorizontal={win.width*0.01}/>
              <View style={{width:win.width*0.03}}>
                <Text style={[BaseStyles.labelText, styleTemp.labelText_custom]}>第</Text>
              </View>
              <RNPickerSelect
                itemKey={1}
                placeholderTextColor={'#ffffff'}
                onValueChange={(value) => console.log(value)}
                style={pickerSelectStyles_round}
                items={numbers}
                Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
              />
              <Text style={[BaseStyles.labelText, styleTemp.labelText_custom]}>回戦</Text>
            </View>

            {/* ホームチーム */}
            <View style={[styleTemp.row]}>
              <Text style={[BaseStyles.labelText,styleTemp.text_area]}>ホームチーム</Text>
              <View paddingHorizontal={win.width*0.01}/>
              <RNPickerSelect
                placeholderTextColor={'#ffffff'}
                onValueChange={(value) => console.log(value)}
                style={pickerSelectStyles_team}
                items={teams}
                Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
              />
              <TouchableOpacity style={[styles.formElement]} onPress={this.toggleColorModal_home}>
                <Icon
                style={[
                  styles.icon,
                  styleTemp.icon_tshirt,
                  {
                    color: this.state.selectedColor_home,
                  }
                ]}
                name='tshirt'/>
              </TouchableOpacity>
              <SafeAreaView>
                <Modal
                  isVisible={this.state.isColorPickerModalVisible_home}
                  // swipeDirection={['up', 'down', 'left', 'right']}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  animationInTiming={1000}
                  animationOutTiming={800}
                  onBackdropPress={this.toggleColorModal_home}
                  style={{
                    top: win.height * 0.1,
                    bottom: win.height * 0.1,
                    left: win.width * 0.1,
                    right: win.width * 0.1,
                    position:'absolute'
                  }}
                >
                  <ColorPicker
                    onColorSelected={color => this.setState({selectedColor_home:color,isColorPickerModalVisible_home:false})}
                    style={{flex:1/2}}
                    hideSliders={true}
                  />
                </Modal>
              </SafeAreaView>
            </View>

            {/* ビジターチーム */}
            <View style={[styleTemp.row]}>
              <Text style={[BaseStyles.labelText,styleTemp.text_area]}>ビジターチーム</Text>
              <View paddingHorizontal={win.width*0.01}/>
              <RNPickerSelect
                placeholderTextColor={'#ffffff'}
                onValueChange={(value) => console.log(value)}
                style={pickerSelectStyles_team}
                items={teams}
                textInputProps={{placeholder: 'aaa',keyboardType:'default'}}
                Icon={() => <Icon name="chevron-down" size={20} color="#ffffff"/>}
              />
              <TouchableOpacity style={[styles.formElement]} onPress={this.toggleColorModal_visitor}>
                <Icon
                style={[
                  styles.icon,
                  styleTemp.icon_tshirt,
                  {
                    color: this.state.selectedColor_visitor,
                  }
                ]}
                name='tshirt'/>
              </TouchableOpacity>
              <SafeAreaView>
                <Modal
                  isVisible={this.state.isColorPickerModalVisible_visitor}
                  // swipeDirection={['up', 'down', 'left', 'right']}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  animationInTiming={1000}
                  animationOutTiming={800}
                  onBackdropPress={this.toggleColorModal_visitor}
                  style={{
                    top: win.height * 0.1,
                    bottom: win.height * 0.1,
                    left: win.width * 0.1,
                    right: win.width * 0.1,
                    position:'absolute'
                  }}
                >
                  <ColorPicker
                    onColorSelected={color2 => this.setState({selectedColor_visitor:color2,isColorPickerModalVisible_visitor:false})}
                    style={{flex:1/2}}
                    hideSliders={true}
                  />
                </Modal>
              </SafeAreaView>
            </View>
          </View>
          {/* フッター*/}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View alignItems='center'>
              <TouchableOpacity style={[BaseStyles.formElement,BaseStyles.button_lg_sk]} onPress={() => this.goHome()}>
                <Text style={[styles.buttonText]}>決定</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <Modal
          style={styleTemp.modal_date}
          isVisible={this.state.isDatePickerVisible}
          onBackdropPress={() => {this.setState({ isDatePickerVisible: false })}}
          >
            <DateTimePicker
              // style={{fontSize:RFPercentage(5.0)}}
              testID="dateTimePicker"
              value={this.state.date}
              mode={'date'}
              display="spinner"
              textColor='#ffffff'
              locale='ja'
              themeVariant='white'
              onChange={this._onChange}
            />
          </Modal> */}
        </View>
          {/* <Picker/> */}
        <View style={{flex:1}}/>
        <View style={{bottom:-(win.height*0.05),left:-(win.width*0.1), position:'absolute'}}>
          <Picker
            ref={picker => this.picker = picker}
            style={{height: 200,position:'absolute',alignItems:'center'}}
            showDuration={310}
            showMask={true}
            pickerData={this.state.eventList}
            pickerCancelBtnText=''
            // onValueChange={(value) => this._selectedEvent(value)}
            selectedValue={this.state.selectedEvent}
          />
        </View>
      </SafeAreaView>
    );
  }
}
newGameScreen.propTypes = propTypes;
// 画面遷移時の再レンダリング対応
export default withNavigation(newGameScreen);