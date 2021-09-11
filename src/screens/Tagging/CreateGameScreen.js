/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation } from "react-navigation";
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
// カラーピッカー
import { ColorPicker } from 'react-native-status-color-picker';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
// ローカルインポート
import styles from '../../common/CommonStyles';
import CreateCommonStyles from './CreateCommonStyles';
import Constants from '../../common/Constants';
import Messages from '../../common/Messages';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import CheckDateFormat from '../../util/CheckDateFormat';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;

class CreateGame extends Component {
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
      isColorPickerModalVisible: false,
      isConfirmDialogVisible: false,
      // APIパラメータのcategory
      category: Constants.DB_CATEGORY.ADD,

      // OKボタン押下時のスクリーンID
      screenId: Constants.SCREEN_ID.ASSIGN_PLAYER,
      // 画面遷移パラメータ
      screenParams: {},
      // SK
      sk:Constants.SK_TYPE.GAME,
      // ラベル
      label_event: 'Event',
      label_date: 'Date',
      label_datetime: 'Date Time',
      label_stage: 'Stage',
      label_home_team: 'Home Team',
      label_home_color: 'Home Color',
      label_visitor_team: 'Visitor Team',
      label_visitor_color: 'Visitor Color',
      label_button: 'Create Game',

      // 画面入力フォーム
      date: '',
      hour: '09',
      minute: '00',
      event_name: 'Please Select...',
      stage_name: '',
      home_team: 'Please Select...',
      visitor_team: 'Please Select...',
      // Id
      event_id: '',
      team_id_home: '',
      team_id_visitor: '',
      game_id: '',

      // エラーメッセージ
      errorMessage: '',

      // ドロップダウンのリスト値
      eventList: [],
      teamList: [],
      hourList: [
        {label:'00', value: '00'},
        {label:'01', value: '01'},
        {label:'02', value: '02'},
        {label:'03', value: '03'},
        {label:'04', value: '04'},
        {label:'05', value: '05'},
        {label:'06', value: '06'},
        {label:'07', value: '07'},
        {label:'08', value: '08'},
        {label:'09', value: '09'},
        {label:'10', value: '10'},
        {label:'11', value: '11'},
        {label:'12', value: '12'},
        {label:'13', value: '13'},
        {label:'14', value: '14'},
        {label:'15', value: '15'},
        {label:'16', value: '16'},
        {label:'17', value: '17'},
        {label:'18', value: '18'},
        {label:'19', value: '19'},
        {label:'20', value: '20'},
        {label:'21', value: '21'},
        {label:'22', value: '22'},
        {label:'23', value: '23'},
      ],
      minuteList: [
        {label:'00', value: '00'},
        {label:'05', value: '05'},
        {label:'10', value: '10'},
        {label:'15', value: '15'},
        {label:'20', value: '20'},
        {label:'25', value: '25'},
        {label:'30', value: '30'},
        {label:'35', value: '35'},
        {label:'40', value: '40'},
        {label:'45', value: '45'},
        {label:'50', value: '50'},
        {label:'55', value: '55'},
      ],

      // カラーバリエーション
      colors: [
        "#ffffff",  // Wtite
        "#000080",  // Navy
        "#ff0000",  // Red
        "#ffff00",  // Yellow
        "#87ceeb",  // Skyblue
        "#008000",  // Green
      ],
      // デフォルトのカラー
      selectedHomeColor: '#ffffff',
      selectedVisitorColor: '#000080',
      isHomeTeam: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
    // 背景画像取得
    imgPath = require(img);
    const current_date = new Date();
    const str_current_date = current_date.getFullYear()
          + '/' + ('0' + (current_date.getMonth() + 1)).slice(-2)
          + '/' + ('0' + current_date.getDate()).slice(-2);
    this.setState({date:str_current_date});

    // 画面遷移時の再レンダリング対応
    const { navigation } = this.props;
    if  (navigation.state.params) {
      if (navigation.state.params.category) {
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT})
        this.setState({screenParams:[]})
      } else if (navigation.state.params.data) {
        const infoData = navigation.state.params.data;
        this.setState({infoData:infoData});
        this.setState({event_name:infoData.event_name});
        this.setState({stage_name:infoData.game_stage});
        this.setState({home_team:infoData.team_name_home});
        this.setState({visitor_team:infoData.team_name_visitor});
        this.setState({date:infoData.game_start_time.substr(0,10)});
        this.setState({hour:infoData.game_start_time.substr(11,2)});
        this.setState({minute:infoData.game_start_time.substr(14,2)});
        this.setState({event_id:infoData.event_id});
        this.setState({team_id_home:infoData.team_id_home});
        this.setState({team_id_visitor:infoData.team_id_visitor});
        this.setState({game_id:infoData.sk});
        this.setState({label_button:'Edit Game'});
        this.setState({category:Constants.DB_CATEGORY.UPDATE});
        this.setState({sk:infoData.sk});
        this.setState({screenId: Constants.SCREEN_ID.EDIT_EVENT});
        this.setState({selectedHomeColor:infoData.home_teamcolors});
        this.setState({selectedVisitorColor:infoData.visitor_teamcolors});
        this.setState({screenParams:[]});
      } else {
        this.setState({screenParams:{
          'game_id': this.state.game_id,
          'team_name_home': { label: this.state.home_team, value: this.state.team_id_home },
          'team_name_visitor': { label: this.state.visitor_team, value: this.state.team_id_visitor },
          'team_color_home': this.state.selectedHomeColor,
          'team_color_visitor': this.state.selectedVisitorColor,
        }});
      };
    };
    this.focusListener = navigation.addListener("didFocus", () => {
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

  onDateChange(date) {
    this.setState({
      date: date ? date.format("YYYY/MM/DD").toString() : '',
    });
  }

  onSelect(color) {
    if(this.state.isHomeTeam === true) {
      this.setState({
        selectedHomeColor: color,
      });

    } else {
      this.setState({
        selectedVisitorColor: color,
      });

    }
  }

  // カレンダーモーダル起動
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
     });
  }

  // カラーモーダル起動
  toggleColorModal = () => {
    this.setState({
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
      isHomeTeam: true,
    });
  }
  toggleColorModalVisitor = () => {
    this.setState({
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
      isHomeTeam: false,
    });
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

  _dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == this.state.eventList.length - 1) return;
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
    navigation.navigate(Constants.SCREEN_ID.MENU);
  }

  // Create Eventボタン押下時
  createEvent = () => {
    // CreateEvent画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.CREATE_EVENT);
  }

  // Create Teamボタン押下時
  createTeam = () => {
    // CreateTeam画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.CREATE_TEAM);
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

        // Event情報取得
        let param1 = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.EVENT,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param1, Constants.SK_TYPE.EVENT);

        // Team情報取得
        let param2 = {
          category: Constants.QUERY_PATTERN.TYPE_2,
          pk: cognitoUser.username,
          sk: Constants.SK_TYPE.TEAM,
        };
        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.POST, succ, param2, Constants.SK_TYPE.TEAM);

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
          if (type ===  Constants.SK_TYPE.EVENT) {
            this.setState({ eventList: items });
          } else if (type ===  Constants.SK_TYPE.TEAM) {
            this.setState({ teamList: items });
          }
        } else {
          this.setState({ game_id: response.data.sk });
          // PUTの場合は登録処理なので、確認ダイアログオープン
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
  inputCheck(date, hour, minute, event_name, stage_name, home_team, visitor_team) {
    if (date === '') {
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W001 });
      return false;
    } else if (!CheckDateFormat(date)) {
      this.setState({ errorMessage: this.state.label_date + Messages.WARN.W007 });
      return false;
    }
    if(hour === '') {
      this.setState({ errorMessage: this.state.label_datetime + Messages.WARN.W001 });
      return false;
    }
    if(minute === '') {
      this.setState({ errorMessage: this.state.label_datetime + Messages.WARN.W001 });
      return false;
    }
    if (event_name === '') {
      this.setState({ errorMessage: this.state.label_event + Messages.WARN.W001 });
      return false;
    }
    if (stage_name === '') {
      this.setState({ errorMessage: this.state.label_stage + Messages.WARN.W001 });
      return false;
    }
    if (home_team === '') {
      this.setState({ errorMessage: this.state.label_home_team + Messages.WARN.W001 });
      return false;
    }
    if (visitor_team === '') {
      this.setState({ errorMessage: this.state.label_visitor_team + Messages.WARN.W001 });
      return false;
    }
    return true;
  }

  // Create Gameボタン押下時
  createGame = async(event) => {
    const {
      date,
      hour,
      minute,
      event_name,
      stage_name,
      home_team,
      visitor_team,
      event_id,
      team_id_home,
      team_id_visitor,
      selectedHomeColor,
      selectedVisitorColor,
      category,
      sk
    } = this.state;

    // 入力チェック
    if (!this.inputCheck(date, hour, minute, event_name, stage_name, home_team, visitor_team)) { return; }
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

        // 日付のスラッシュ削除 + 時分
        const date_str = date.replace( /\//g , '' ) + hour + minute;

        const param3 = {
          category: category,
          pk: cognitoUser.username,
          sk: sk,
          data: {
            event_id: event_id,
            game_stage: stage_name,
            team_id_home: team_id_home,
            team_id_visitor: team_id_visitor,
            game_start_time: date_str,
            home_teamcolors: selectedHomeColor,
            visitor_teamcolors: selectedVisitorColor,
          },
        };

        // API接続
        this.requestInfo(Constants.REQUEST_METHOD.PUT, succ, param3, Constants.SK_TYPE.GAME);
      }
    });
  }

  // OKボタン押下時
  goToAssign = () => {
    this.setState({ isConfirmDialogVisible: false });
    // AssignMember画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(this.state.screenId,this.state.screenParams);
  }
/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    const state = this.state;
    const selectedColor = this.state.isHomeTeam ? this.state.selectedHomeColor : this.state.selectedVisitorColor;

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

          {/* Date */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_date}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={date => this.setState({ date })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'YYYY/MM/DD'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={state.date}
              value={state.date}
            />
            <TouchableOpacity onPress={this.toggleModal}>
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

          {/* Date Time */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_datetime}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown1"
                style={[styles.dropdown, CreateCommonStyles.dropdown_custom]}
                textStyle={[styles.dropdown_text, CreateCommonStyles.dropdown_text_custom]}
                dropdownStyle={[styles.dropdown_dropdown, CreateCommonStyles.dropdown_dropdown_custom]}
                defaultValue={state.hour}
                defaultTextStyle={CreateCommonStyles.defaultTextStyle_custom}
                options={state.hourList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ hour: option.label })}
              />
            </View>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom_term]}>：</Text>
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown2"
                style={[styles.dropdown, CreateCommonStyles.dropdown_custom]}
                textStyle={[styles.dropdown_text, CreateCommonStyles.dropdown_text_custom]}
                dropdownStyle={[styles.dropdown_dropdown, CreateCommonStyles.dropdown_dropdown_custom]}
                defaultValue={state.minute}
                defaultTextStyle={CreateCommonStyles.defaultTextStyle_custom}
                options={this.state.minuteList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ minute: option.label })}
              />
            </View>
          </View>

          {/* Event */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_event}</Text>
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createEvent()}>
              <Text style={[styles.buttonText]}>Create</Text>
            </TouchableOpacity>
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown3"
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                defaultValue={state.event_name}
                defaultTextStyle={styles.defaultTextStyle}
                options={this.state.eventList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ event_name: option.label, event_id: option.value })}
              />
            </View>
          </View>

          {/* Stage */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_stage}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TextInput
              onChangeText={stage_name => this.setState({ stage_name })}
              style={[styles.input, styles.formElement, CreateCommonStyles.input_custom]}
              autoCapitalize={'none'}
              placeholder={'Enter the Stage'}
              spellCheck={false}
              placeholderTextColor={'#aaa'}
              keyboardType={'default'}
              defaultValue={state.stage_name}
            />
          </View>

          {/* Home */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_home_team}</Text>
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createTeam()}>
              <Text style={[styles.buttonText]}>Create</Text>
            </TouchableOpacity>
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown4"
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                defaultValue={state.home_team}
                defaultTextStyle={styles.defaultTextStyle}
                options={this.state.teamList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ home_team: option.label, team_id_home: option.value })}
              />
            </View>
          </View>

          {/* Home Color */}
          <View style={[styles.row, CreateCommonStyles.contents_c]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_home_color}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TouchableOpacity onPress={this.toggleColorModal}>
              <Icon style={[styles.icon, styles.icon_tshirt, {color: this.state.selectedHomeColor}]} name='tshirt'/>
            </TouchableOpacity>
          </View>

          {/* カラーモーダル */}
          <SafeAreaView>
            <Modal
            isVisible={this.state.isColorPickerModalVisible}
            swipeDirection={['up', 'down', 'left', 'right']}
            animationInTiming={1}
            animationOutTiming={1}
            onBackdropPress={this.toggleColorModal}
            >
              <View style={styles.color_modal}>
                <ColorPicker
                  colors={this.state.colors}
                  // selectedHomeColor={ selectedColor }
                  onSelect={this.onSelect}
                />
                <TouchableOpacity
                  style={[styles.button_md, styles.formElement, styles.buttonColor_silver]}
                    onPress={this.toggleColorModal}>
                  <Text style={[styles.buttonText_black]}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </SafeAreaView>

          {/* Visitor */}
          <View style={[styles.row, CreateCommonStyles.contents_b]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_visitor_team}</Text>
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createTeam()}>
              <Text style={[styles.buttonText]}>Create</Text>
            </TouchableOpacity>
            <View style={styles.cell}>
              <ModalDropdown
                ref="dropdown"
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                defaultValue={state.visitor_team}
                defaultTextStyle={styles.defaultTextStyle}
                options={this.state.teamList}
                renderButtonText={(rowData) => this._dropdown_renderButtonText(rowData)}
                renderRow={this._dropdown_renderRow.bind(this)}
                renderRowComponent={TouchableHighlight}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(option, index) => this.setState({ visitor_team: option.label, team_id_visitor: option.value })}
              />
            </View>
          </View>

          {/* Visitor Color */}
          <View style={[styles.row, CreateCommonStyles.contents_c]}>
            <Text style={[styles.labelText_black, CreateCommonStyles.labelText_custom]}>{this.state.label_visitor_color}</Text>
            <View paddingHorizontal={wp(6.67)} />
            <TouchableOpacity onPress={this.toggleColorModalVisitor}>
              <Icon style={[styles.icon, styles.icon_tshirt, {color: this.state.selectedVisitorColor}]} name='tshirt'/>
            </TouchableOpacity>
          </View>

          {/* 登録ボタン */}
          <View style={[styles.row, CreateCommonStyles.contents_d]}>
          <View paddingHorizontal={wp(28.9)} />
            <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => this.createGame()}>
              <Text style={[styles.buttonText]}>{state.label_button}</Text>
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
              onPress: () => this.goToAssign()
            }}
          />

        </View>
      </ImageBackground>
    );
  }
}

// 画面遷移時の再レンダリング対応
export default withNavigation(CreateGame);