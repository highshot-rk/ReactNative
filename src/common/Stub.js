import React, { Component }　from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// ローカルインポート
import styles from './CommonStyles';
import Constants from './Constants';

class Stub extends Component {

  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {
  }

  submit_1 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // GameInfoScreen
    navigation.navigate(Constants.SCREEN_ID.GAME_INFO);
  }
  submit_2 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreateGameScreen
    navigation.navigate(Constants.SCREEN_ID.CREATE_GAME);
  }
  submit_3 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreateEventScreen
    navigation.navigate(Constants.SCREEN_ID.CREATE_EVENT);
  }
  submit_4 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreateTeamScreen
    navigation.navigate(Constants.SCREEN_ID.CREATE_TEAM);
  }
  submit_5 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // CreatePlayerScreen
    navigation.navigate(Constants.SCREEN_ID.CREATE_PLAYER);
  }
  submit_6 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // AssignPlayersScreen
    navigation.navigate(Constants.SCREEN_ID.ASSIGN_PLAYER);
  }
  submit_7 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // EditInfoScreen
    navigation.navigate(Constants.SCREEN_ID.EDIT_INFO);
  }
  submit_8 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // EditEventScreen
    navigation.navigate(Constants.SCREEN_ID.EDIT_EVENT);
  }
  submit_9 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // GameSelectionScreen
    navigation.navigate(Constants.SCREEN_ID.GAME_SELECTION);
  }
  submit_10 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // PlayByPlayScreen
    navigation.navigate(Constants.SCREEN_ID.PLAY_BY_PLAY);
  }
  submit_11 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // PlayByPlayScreen
    navigation.navigate(Constants.SCREEN_ID.CREATE_TEAMPLAYER);
  }
  submit_12 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // PlayByPlayScreen
    navigation.navigate(Constants.SCREEN_ID.NEW_GAME);
  }
  submit_13 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // ExampleScreen
    navigation.navigate('StatsViewer');
  }

  submit_95 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // Main
    navigation.navigate('Main');
  }
  submit_96 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // Intro
    navigation.navigate('IntroMockup');
  }
  submit_97 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // LoginMockup
    navigation.navigate('Login');
  }
  submit_98 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // APITestScreen
    navigation.navigate('APITest');
  }
  submit_99 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // ExampleScreen
    navigation.navigate('Example');
  }

  submit_100 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // DesignSample
    navigation.navigate('Design');
  }

  submit_101 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // DesignSample(View)
    navigation.navigate('DesignView');
  }
  submit_102 = async(event) => {
    // 画面遷移
    const { navigation } = this.props;
    // DesignSample(Popup)
    navigation.navigate('DesignPopup');
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_97()}>
          <Text style={styles.buttonText_black}>旧・ログイン画面へ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_95()}>
          <Text style={styles.buttonText_black}>メイン画面へ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_1()}>
          <Text style={styles.buttonText_black}>Go GameInfoScreen</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_7()}>
          <Text style={styles.buttonText_black}>Go EditInfoScreen</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_96()}>
          <Text style={styles.buttonText_black}>ログイン　イントロ画面へ</Text>
        </TouchableOpacity> */}
{/*
        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_10()}>
          <Text style={styles.buttonText_black}>Go PlayBYPlay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_12()}>
          <Text style={styles.buttonText_black}>New Game</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_99()}>
          <Text style={styles.buttonText_black}>Date Picker Sample</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_11()}>
          <Text style={styles.buttonText_black}>Go StatsViewer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_100()}>
          <Text style={styles.buttonText_black}>Go DesignSample</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_101()}>
          <Text style={styles.buttonText_black}>Go ViewDesignSample</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_102()}>
          <Text style={styles.buttonText_black}>Go PopupDesignSample</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_9()}>
          <Text style={styles.buttonText_black}>Go GameSelection</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.login_button, styles.formElement, {marginLeft: 'auto', marginRight: 'auto'}]} onPress={() => this.submit_13()}>
          <Text style={styles.buttonText_black}>Go StatsViewer</Text>
        </TouchableOpacity>

      </View>

    );
  }
}

export default Stub;
