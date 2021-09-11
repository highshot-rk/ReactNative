/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView } from 'react-native';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// モーダルダイアログ
import Modal from "react-native-modal";
// 確認ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// カレンダーピッカー
import CalendarPicker from 'react-native-calendar-picker';
// ローカルインポート
import styles from '../../common/CommonStyles';
import CreateCommonStyles from './CreateCommonStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import ToHalfWidth from '../../util/ToHalfWidth';
import CheckDateFormat from '../../util/CheckDateFormat';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;

class CreateEvent extends Component {
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
      // ダイアログ表示フラグ
      isModalVisible: false,
      isConfirmDialogVisible: false,
      // APIパラメータのcategory
      category: Constants.DB_CATEGORY.ADD,

      isStartDate: false,

      // OKボタン押下時のスクリーンID
      screenId: Constants.SCREEN_ID.CREATE_GAME,
      // SK
      sk:Constants.SK_TYPE.EVENT,
      // ラベル
      label_event_name: 'Event Name',
      label_date: 'Date',
      label_short_name: 'Short Name',
      label_initial: 'Initial',
      label_button: 'Create Event',
      // 画面入力フォーム
      event_name: '',
      date_from: '',
      date_to: '',
      short_name: '',
      initial: '',
      // エラーメッセージ
      errorMessage: '',

      // Edit画面遷移時の初期パラメータ
      infoData: null,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.inputCheck = this.inputCheck.bind(this);
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);
    // Edit画面からの遷移時処理
    const { navigation } = this.props;
    if (navigation.state.params) {
      if (navigation.state.params.category) {
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT})
      }
      else if (navigation.state.params.data) {
        const infoData = navigation.state.params.data;
        this.setState({infoData:infoData});
        this.setState({event_name:infoData.info_name});
        this.setState({short_name:infoData.short_name});
        this.setState({initial:infoData.initial});
        this.setState({date_from:infoData.event_start_date});
        this.setState({date_to:infoData.end_date});
        this.setState({sk:infoData.sk});
        this.setState({label_button:'Edit Event'});
        this.setState({category:Constants.DB_CATEGORY.UPDATE});
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT})
      }
    }
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

  // カレンダーモーダル起動
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      isStartDate: true,

     });
  }
  toggleModalEndDate = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      isStartDate: false,
     });
  }

  // カレンダー日付変更時
  onDateChange(date) {
    if(this.state.isStartDate === true) {
      this.setState({
        date_from: date ? date.format("YYYY/MM/DD").toString() : '',
      });
    } else {
      this.setState({
        date_to: date ? date.format("YYYY/MM/DD").toString() : '',
      });
    }
  }

  // Create Eventボタン押下時
  createEvent = async(event) => {
    const {
      event_name,
      date_from,
      date_to,
      short_name,
      initial,
      category,
      sk
    } = this.state;

    // 入力チェック
    if (!this.inputCheck(event_name, date_from, date_to, short_name, initial)) { return; }
    this.setState({ errorMessage: '' });

    // Cognitoユーザー取得
    const cognitoUser = await GetCognitoUser();
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

        // 日付のスラッシュ削除
        const startDate = date_from.replace( /\//g , '' );
        const endDate = date_to.replace( /\//g , '' );

        const param = {
          category: category,
          pk: cognitoUser.username,
          sk: sk,
          data: {
            info_name: event_name,
            event_start_date: startDate,
            end_date: endDate,
            short_name: short_name,
            initial: initial,
          },
        };

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

  // OKボタン押下時
  backToGame = () => {
    this.setState({ isConfirmDialogVisible: false });
    // CreateGame画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(this.state.screenId);
  }
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
  // 入力チェック
  inputCheck(event_name, date_from, date_to, short_name, initial) {
    if (event_name === '') {
      this.setState({ errorMessage: this.state.label_event_name + Messages.WARN.W001 });
      return false;
    }

    // 日付のスラッシュ削除
    const date_from_str = date_from.replace( /\//g , '' );
    const date_to_str = date_to.replace( /\//g , '' );
    if (date_from === '') {
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W001 });
      return false;
    } else if (!CheckDateFormat(date_from)) {
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W007 });
      return false;
    }
    if (date_to === '') {
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W001 });
      return false;
    } else if (!CheckDateFormat(date_to)) {
      // 日付形式チェック
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W007 });
      return false;
    } else if ( Number(date_from_str) > Number(date_to_str) ) {
      // 日付逆転チェック
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W008 });
      return false;
    }
    if (short_name === '') {
      this.setState({ errorMessage: this.state.label_short_name + Messages.WARN.W001 });
      return false;
    } else {
      if (short_name.length > 10) {
        this.setState({ errorMessage: this.state.label_short_name + Messages.WARN.W002 });
        return false;
      }
    }
    if (initial === '') {
      this.setState({ errorMessage: this.state.label_initial + Messages.WARN.W001 });
      return false;
    } else {
      // 全角 -> 半角
      let chkVal = ToHalfWidth(initial);
      // 小文字 -> 大文字
      chkVal = chkVal.toUpperCase();
      // 正規表現(英字3文字)
      let reg = new RegExp(/^([a-zA-Z]{3})$/);
      if(!reg.test(chkVal)) {
        this.setState({ errorMessage: this.state.label_initial + Messages.WARN.W003 });
        return false;
      }
    }
    return true;
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    // Get it from props
    const { isFocused } = this.props;

    const { date_from } = this.state;
    const { date_to } = this.state;

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
          <View style={[styles.row, CreateCommonStyles.contents_a]}>
            <Text style={[styles.errorText, CreateCommonStyles.errorText_custom]}>{this.state.errorMessage}</Text>
          </View>

          {/* Event Name */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_event_name}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={event_name => this.setState({ event_name })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Event'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.event_name}
            />
          </View>

          {/* Date From, To */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_date}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={date_from => this.setState({ date_from })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom_date]}
              autoCapitalize={'none'}
              placeholder={'YYYY/MM/DD'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.date_from}
              value={date_from}
            />
            <TouchableOpacity onPress={this.toggleModal}>
              <Icon style={[styles.icon, styles.icon_calendar]} name='calendar-alt'/>
            </TouchableOpacity>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom_term]}>〜</Text>
            <TextInput
              onChangeText={date_to => this.setState({ date_to })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom_date]}
              autoCapitalize={'none'}
              placeholder={'YYYY/MM/DD'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.date_to}
              value={date_to}
            />
            <TouchableOpacity onPress={this.toggleModalEndDate}>
              <Icon style={[styles.icon, styles.icon_calendar]} name='calendar-alt'/>
            </TouchableOpacity>

            {/* カレンダーモーダル */}
            <SafeAreaView>
              <Modal
              isVisible={this.state.isModalVisible}
              swipeDirection={['up', 'down', 'left', 'right']}
              animationInTiming={1}
              animationOutTiming={1}
              onBackdropPress={this.toggleModal}
            >
                <View style={styles.calendar_modal}>
                  <CalendarPicker
                    scaleFactor={375}
                    width={wp(40)}
                    selectedDayColor='lightgreen'
                    onDateChange={this.onDateChange}
                  />

                  <TouchableOpacity
                    style={[styles.button_md, styles.formElement, styles.buttonColor_silver]}
                      onPress={this.toggleModal}>

                    <Text style={[styles.buttonText_black]}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </SafeAreaView>
          </View>


          {/* Short Name */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_short_name}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={short_name => this.setState({ short_name })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Short Name'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.short_name}
            />
          </View>

          {/* Initial */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_initial}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={initial => this.setState({ initial })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Initial'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={this.state.initial}
            />
          </View>

          {/* 登録ボタン */}
          <View style={[styles.row, CreateCommonStyles.contents_e]}>
          <View paddingHorizontal={wp(28.9)} />
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createEvent()}>
              <Text style={[styles.buttonText]}>{this.state.label_button}</Text>
            </TouchableOpacity>
          </View>

          {/* 確認ダイアログ */}
          <ConfirmDialog
            title=""
            message={Messages.INFO.I002}
            visible={this.state.isConfirmDialogVisible}
            onTouchOutside={() => this.setState({ isConfirmDialogVisible: false })}
            positiveButton={{
              title: 'OK',
              onPress: () => this.backToGame()
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

export default CreateEvent;
