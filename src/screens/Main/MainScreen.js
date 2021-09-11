/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component, useState } from 'react';
import { View, Text, Button, Platform, ImageBackground, Dimensions, Image, StyleSheet, SafeAreaView, LogBox } from 'react-native';
import ActionButton from 'react-native-action-button';
// モーダルダイアログ
import Modal from "react-native-modal";
// アイコン
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';

// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// 背景グラデーション
import { LinearGradient } from "expo-linear-gradient";

// ローカルインポート
import styles from '../../common/BaseStyles';
import CreateTeamPlayerScreen from '../Tagging/CreateTeamPlayerScreen';
import GameSelectionScreen from '../Common/GameInfoSelectionScreen';
import NewGameScreen from '../Tagging/newGameScreen';
import LiveTaggingScreen from '../Tagging/LiveTaggingScreen';
import PlayByPlay from '../PlayByPlay/PlayByPlayScreen_New';
import AssignPlayersScreen from '../Tagging/AssignPlayersScreen';
import StatsViewerScreen from '../StatsViewer/StatsViewerScreen';

import { Asset } from 'expo-asset';
import { NavigationContainer } from '@react-navigation/native';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const imgPath = require('../../../assets/resources/bg_2.png');
// 背景ロゴ
const logoPath = require('../../../assets/resources/logo_white.png');

class MainScreen extends React.Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props)
    this.state = {
      // デバイスの幅・高さ
      width: 0,
      height: 0,

      footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#808080', isActive: false },
      footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#808080', isActive: false },
      footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#808080', isActive: false },
      footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#808080', isActive: false },
      footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#808080', isActive: false },

      item_button_1: [
        { label: 'チーム登録', icon: 'bar-chart', color: '#ffffff'},
        { label: 'タグ付け開始', icon: 'star', color: '#ffffff'},
        { label: 'タグ情報閲覧', icon: 'bar-chart', color: '#ffffff'},
        { label: 'オリジナルタグ作成', icon: 'star', color: '#ffffff'},
      ],
      item_button_2: [
        { label: 'スタッツ表示', icon: 'star', color: '#ffffff'},
        { label: 'ゲーム分析', icon: 'bar-chart', color: '#ffffff'},
        { label: 'パーソナルレポート', icon: 'bar-chart', color: '#ffffff'},
      ],

      // 選択状態の色
      selectedItem_color: '#ffffff',

      // 選択状態のフッターメニュー
      isFooterSelected: false,

      // モーダルの表示・非表示
      isCreateTeamPlayerModalVisible: false,
      isNewGameModalVisible: false,
      isPlayByPlayModalVisible: false,
      isGameInfoSelectionModalVisible: false,
      isLiveTaggingModalVisible: false,
      isAssignPlayersModalVisible: false,
      isStatsViewerModalVisible: false,

      // 画面制御フラグ
      isLiveTagging: false, // LiveTagging表示可否　
      isNewGame: false, // NewGame表示可否
      isPlayByPlay: false, // StatusViewer表示可否
      isStatsViewer: false, // StatusViewer表示可否
      isAssignHome: false, // true: Home用画面を表示、false: Visitor用画面を表示

      // 領域外タップ制御フラグ
      isBackdropPressNewGame: false, // NewGameModalの領域外タップ判定
      isBackdropPressAssignPlayers: false, // AssignPlayersModalの領域外タップ判定

      // 遷移先メニュー制御
      isTransition: 'Tagging', // 遷移先メニュー判定フラグ（Tagging or Viewer or PlaybyPlay）

      // 画面遷移パラメータ
      param_game_id: '', // LiveTaggingに渡すパラメータ
    }
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される前にに呼び出されるメソッド
  componentDidMount = async(event) => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }
/*--------------------------------------------------------------------------
 * イベント
 *------------------------------------------------------------------------*/

  // デバイスの幅・高さ
  _onLayout(event) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    });
  };
  // モーダルの表示・非表示切り替え
  _toggleModal = (item) => {
    if(item === this.state.item_button_1[0].label) {
      this.setState({ isCreateTeamPlayerModalVisible: !this.state.isCreateTeamPlayerModalVisible });
    } else if(item === this.state.item_button_1[1].label) {
      this.setState({ isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible });
    } else {
      // this.setState({ isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible });
    }
  }

  // 子コンポーネントから親コンポーネントへ返却された際の処理
  _updateCreateTeamPlayer = () => {
    this.setState({
      isCreateTeamPlayerModalVisible: !this.state.isCreateTeamPlayerModalVisible,
      // selectedItem_color: '#ffffff',
    });
  }
  _updateGameSelection(_param) {
    if(this.state.isTransition === 'Tagging') {
      this.setState({ 
        param_game_id: _param, // 画面遷移パラメータ
        isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
        isLiveTagging: true, // LiveTaggingを表示する
      });  
    } else if(this.state.isTransition === 'PlayByPlay') {
      this.setState({ 
        param_game_id: _param, // 画面遷移パラメータ
        isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
        isPlayByPlay: true, // PlayByPlayを表示する
      });  
    } else {
      this.setState({ 
        param_game_id: _param, // 画面遷移パラメータ
        isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
        isStatsViewer: true, // StatsViewerを表示する
      });  
    }
  }
  _updateGameSelectionNewGame() {
    this.setState({
      isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
      isNewGame: true,
      isLiveTagging: false,
    });
  }

  // GameInfoSelectionModalの領域外をタップした際に実行するイベント
  _onBackdropPressGameInfo = () => {
    this.setState({
      isNewGame: false,
      isGameInfoSelectionModalVisible: false,
    })  
  }
  // GameInfoSelectionModalが閉じ終わった後に実行するイベント
  _onModalHideGameInfo = () => {
    if(this.state.isLiveTagging === true) {
      // LiveTaggingを表示
      this.setState({
        isNewGameModalVisible: false,
        isLiveTaggingModalVisible: true,
      })
    } else if(this.state.isNewGame === true) {
      // NewGameを表示
      this.setState({
        isNewGameModalVisible: true,
        isLiveTaggingModalVisible: false,
      })
    } else if(this.state.isPlayByPlay === true) {
      // PlayByPlayを表示
      this.setState({
        isPlayByPlayModalVisible: true,
      })
    } else if(this.state.isStatsViewer === true) {
      // StatsViewerを表示
      this.setState({
        isStatsViewerModalVisible: true,
      })
    } else {
      // その他
    }
  }

  // LiveTaggingModalが閉じ終わった後に実行するイベント
  _onModalHideLiveTagging = () => {
      this.setState({
        isLiveTagging: false,
      })
  }
  // NewGameModalの領域外をタップした際に実行するイベント
  _onBackdropPressNewGame = () => {
    this.setState({
      isBackdropPressNewGame: true,
      isNewGameModalVisible: false,
      isNewGame: false, // 制御追加
    })  
  }
  // NewGameModalが閉じ終わった後に実行するイベント
  _onModalHideNewGame = () => {
    if(this.state.isBackdropPressNewGame === false) {
      this.setState({
        isNewGame: false,
        isAssignHome: true, // Home
        isAssignPlayersModalVisible: true, // Homeを開く
      })  
    } else {
      // 閉じて終了  
    }
  }
  // AssignPlayersModalの領域外をタップした際に実行するイベント
  _onBackdropPressAssignPlayers = () => {
    this.setState({
      isBackdropPressAssignPlayers: true,
      isAssignPlayersModalVisible: false,
      isLiveTagging: false,
    })  
  }
  // AssignPlayersModalが閉じ終わった後に実行するイベント
  _onModalHideAssignPlayers = () => {
    if(this.state.isBackdropPressAssignPlayers === false) {
      if(this.state.isAssignHome) {
        this.setState({
          isAssignHome: false, // Visitor
          isAssignPlayersModalVisible: true, // 再度Visitorで開く
        })  
      } else {
        this.setState({
          isAssignPlayersModalVisible: false, // 閉じる
          isLiveTaggingModalVisible: true, // LiveTagging開く
        })  
      }
    } else {
      // 閉じて終了
    }
  }
  // PlayByPlayModalが閉じ終わった後に実行するイベント
  _onModalHidePlayByPlay = () => {
    this.setState({
      isPlayByPlay: false,
    })
  }
  // StatsViewerが閉じ終わった後に実行するイベント
  _onModalHideStatsViewer = () => {
    this.setState({
      isStatsViewer: false,
    })
  }

  // LiveTagging画面を閉じる際のイベント
  _closeLiveTaggingModal = () => {
    // this._onPressFooter(this.state.footer_button_1.label);
    this.setState({ 
      isLiveTaggingModalVisible: false,
      isGameInfoSelectionModalVisible: false,
    });    
  }
  // NewGame画面を閉じる際のイベント
  _closeNewGameModal = () => {
    // this._onPressFooter(this.state.footer_button_1.label);
    this.setState({ 
      isBackdropPressNewGame: false,
      // isBackdropPressAssignPlayers: false,
      isNewGameModalVisible: false,
    });    
  }
  // PlayByPlay画面を閉じる際のイベント
  _closePlayByPlayModal = () => {
    // this._onPressFooter(this.state.footer_button_1.label);
    this.setState({ 
      isPlayByPlayModalVisible: false,
    });    
  }
  // AssignPlayers画面を閉じる際のイベント
  _closeAssignPlayersModal(_param) {
    // this._onPressFooter(this.state.footer_button_1.label);
    this.setState({ 
      isBackdropPressAssignPlayers: false,
      param_game_id: _param, // 画面遷移パラメータ
      isAssignPlayersModalVisible: false,
      isLiveTagging: true, // LiveTaggingを表示する
    });    
  }
  // StatsViewer画面を閉じる際のイベント
  _closeStatsViewerModal = () => {
    // this._onPressFooter(this.state.footer_button_2.label);
    this.setState({ 
      isStatsViewerModalVisible: false,
    });    
  }

  // サブメニューのボタンを押下した際の処理
  _onPressItem = (item) => {
    // ボタン押下による表示画面の振り分け
    if(item === this.state.item_button_1[0].label) {
      // チーム登録画面を表示
      this.setState({ isCreateTeamPlayerModalVisible: !this.state.isCreateTeamPlayerModalVisible });
    } else if(item === this.state.item_button_1[1].label) {
      // ゲーム選択画面(Tagging)を表示
      this.setState({
        isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
        isTransition: 'Tagging',
      });
    } else if(item === this.state.item_button_1[2].label) {
      // ゲーム選択画面(PlayByPlay)を表示
      this.setState({
        isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
        isTransition: 'PlayByPlay',
      });
    } else {
      // その他
    }

    this._onPressFooter(this.state.footer_button_1.label);
  }

  // Viewerサブメニューのボタンを押下した際の処理
  _onPressViewer = (item) => {
    this.setState({ selectedItem_color: '#808080', });

    // ボタン押下による表示画面の振り分け
    if(item === this.state.item_button_2[0].label) {
      // ゲーム選択画面を表示
      this.setState({ 
        isGameInfoSelectionModalVisible: !this.state.isGameInfoSelectionModalVisible,
        isTransition: 'Viewer',
      });
    } else {
      // その他
    }

    this._onPressFooter(this.state.footer_button_2.label);
  }

  // メインメニューのボタンを押下した際の処理
  _onPressFooter = (label) => {
    if (label === this.state.footer_button_1.label) {
      // Tagging
      if(this.state.footer_button_1.color === '#ffffff') {
        this.setState({
          footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#808080', isActive: false },
        });
      } else {
        this.setState({
          footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#ffffff', isActive: true },
        });
      }
      this.setState({
        footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#808080', isActive: true },
        footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#808080', isActive: true },
        footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#808080', isActive: true },
        footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#808080', isActive: true },
      });

    } else if (label === this.state.footer_button_2.label) {
      // Viewer
      if(this.state.footer_button_2.color === '#ffffff') {
        this.setState({
          footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#808080', isActive: false },
        });
      } else {
        this.setState({
          footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#ffffff', isActive: true },
        });
      }
      this.setState({
        footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#808080', isActive: false },
        footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#808080', isActive: false },
        footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#808080', isActive: false },
        footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#808080', isActive: false },
      });

    } else if (label === this.state.footer_button_3.label) {
      // Video Analysis
      if(this.state.footer_button_3.color === '#ffffff') {
        this.setState({
          footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#808080', isActive: false },
        });
      } else {
        this.setState({
          footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#ffffff', isActive: true },
        });
      }
      this.setState({
        footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#808080', isActive: false },
        footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#808080', isActive: false },
        footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#808080', isActive: false },
        footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#808080', isActive: false },
      });

    } else if (label === this.state.footer_button_4.label) {
      // Calendar
      if(this.state.footer_button_4.color === '#ffffff') {
        this.setState({
          footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#808080', isActive: false },
        });
      } else {
        this.setState({
          footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#ffffff', isActive: true },
        });
      }
      this.setState({
        footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#808080', isActive: false },
        footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#808080', isActive: false },
        footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#808080', isActive: false },
        footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#808080', isActive: false },
      });

    } else {
      // Settings
      if(this.state.footer_button_4.color === '#ffffff') {
        this.setState({
          footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#808080', isActive: false },
        });
      } else {
        this.setState({
          footer_button_5: { label: 'Settings', icon: 'settings-outline', color: '#ffffff', isActive: true },
        });
      }
      this.setState({
        footer_button_1: { label: 'Live Tagging', icon: 'pen', color: '#808080', isActive: false },
        footer_button_2: { label: 'Viewer', icon: 'bar-chart', color: '#808080', isActive: false },
        footer_button_3: { label: 'Video Analysis', icon: 'video', color: '#808080', isActive: false },
        footer_button_4: { label: 'Calendar', icon: 'calendar-alt', color: '#808080', isActive: false },
      });
    }
  }

/*--------------------------------------------------------------------------
 * レンダー
 *------------------------------------------------------------------------*/
  render() {

    return (
      <ImageBackground
      source={imgPath}
      onLayout={this._onLayout.bind(this)}
      style={[{width: this.state.width, height: this.state.height}, styles.bgImage,]}>
      <View
          style={styles.bgLogo}>
        <Image
          source={logoPath}/>
      </View>

      {/* チーム登録開始 */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isCreateTeamPlayerModalVisible}
          style={styles.commonModalContainerStyle}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          onBackdropPress={() => {this._updateCreateTeamPlayer() }}
        >
          {/* <ChildModal nav={this} /> */}
          <CreateTeamPlayerScreen updateCreateTeamPlayer={() => { this._updateCreateTeamPlayer() }} />
        </Modal>
      </SafeAreaView>

      {/* タグ付け開始 - 試合選択 */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isGameInfoSelectionModalVisible}
          style={styles.commonModalContainerStyle}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          onBackdropPress={() => {this._onBackdropPressGameInfo() }}
          onModalHide={() => { this._onModalHideGameInfo() }}
        >
          <GameSelectionScreen
            isTransition={ this.state.isTransition } // 画面遷移先判定フラグ
            updateGameSelection={this._updateGameSelection.bind(this)} 
            updateGameSelectionNewGame={() => { this._updateGameSelectionNewGame() }}
            />
        </Modal>
      </SafeAreaView>

      {/* タグ付け開始 - 試合登録 */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isNewGameModalVisible}
          style={styles.commonModalContainerStyle}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          onBackdropPress={() => {this._onBackdropPressNewGame() }}
          onModalHide={() => { this._onModalHideNewGame() }}
        >
          <NewGameScreen closeNewGameModal={() => { this._closeNewGameModal() }}/>
        </Modal>
      </SafeAreaView>

      {/* タグ付け開始 - LiveTagging */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isLiveTaggingModalVisible}
          style={styles.commonModalTaggingViewContainerStyle}
          backdropOpacity={0.5}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          onBackdropPress={() => {this._closeLiveTaggingModal() }}
          onModalHide={() => { this._onModalHideLiveTagging() }}
        >
          <LiveTaggingScreen 
             // game_idを子コンポーネントに渡す
             param_game_id={ this.state.param_game_id }
             onBackdropPress={() => {this._closeLiveTaggingModal() }}
          />
        </Modal>
      </SafeAreaView>

      {/* タグ情報閲覧 - PlayByPlay */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isPlayByPlayModalVisible}
          style={styles.commonModalViewContainerStyle}
          backdropOpacity={0.5}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          // onBackdropPress={() => {this._closePlayByPlayModal() }}
          onModalHide={() => { this._onModalHidePlayByPlay() }}
        >
          <PlayByPlay closePlayByPlayModal={() => { this._closePlayByPlayModal() }}/>
        </Modal>
      </SafeAreaView>

      {/* スタメン登録 */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isAssignPlayersModalVisible}
          style={styles.commonModalContainerStyle}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          // onBackdropPress={() => {this.setState({isAssignPlayersModalVisible: false })}}
          onBackdropPress={() => {this._onBackdropPressAssignPlayers() }}
          onModalHide={() => { this._onModalHideAssignPlayers() }}
        >
          <AssignPlayersScreen
           isAssignHome={ this.state.isAssignHome } // Home/Visitor画面判定フラグ
           updateAssignPlayers={this._closeAssignPlayersModal.bind(this)} 
          />
        </Modal>
      </SafeAreaView>

      {/* スタッツビューワー */}
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.isStatsViewerModalVisible}
          style={styles.commonModalViewContainerStyle}
          backdropOpacity={0.5}
          animationIn={'fadeIn'}
          animationInTiming={500}
          animationOut={'fadeOut'}
          animationOutTiming={500}
          onBackdropPress={() => {this._closeStatsViewerModal() }}
          onModalHide={() => { this._onModalHideStatsViewer() }}
        >
          <StatsViewerScreen 
          />
        </Modal>
      </SafeAreaView>
      
      {/* サブメニューエリア */}
      <View style={styles.container} pointerEvents={"box-none"}>
        {/* Live Tagging */}
        <ActionButton
          active={this.state.footer_button_1.isActive}
          buttonColor={styles.floatingAction_buttonColor.backgroundColor}
          buttonText=""
          position='left'
          offsetX={this.state.width*0.075}
          offsetY={0}
          zIndex={1000}
          spacing={40}
          hideShadow={true}
          autoInactive={true}
          backgroundTappable={true}
          onPress={() => this._onPressFooter(this.state.footer_button_1.label)}>
          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="チーム登録"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_1[0].color}]}
            onPress={() => this._onPressItem(this.state.item_button_1[0].label)}>
            <Ionicon name="bar-chart" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="タグ付け開始"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_1[1].color}]}
            onPress={() => this._onPressItem(this.state.item_button_1[1].label)}>
            <Ionicon name="star" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="タグ情報閲覧"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_1[2].color}]}
            onPress={() => this._onPressItem(this.state.item_button_1[2].label)}>
            <Ionicon name="bar-chart" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="オリジナルタグ作成"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_1[3].color}]}
            onPress={() => this._onPressItem(this.state.item_button_1[3].label)}>
            <Ionicon name="star" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        {/* Viewer */}
        <ActionButton
          active={this.state.footer_button_2.isActive}
          buttonColor={styles.floatingAction_buttonColor.backgroundColor}
          buttonText=""
          position='left'
          offsetX={this.state.width*0.27}
          offsetY={0}
          zIndex={1000}
          spacing={40}
          hideShadow={true}
          autoInactive={true}
          backgroundTappable={true}
          onPress={() => this._onPressFooter(this.state.footer_button_2.label)}>

          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="スタッツ表示"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_2[0].color}]}
            onPress={() => this._onPressViewer(this.state.item_button_2[0].label)}>
            <Ionicon name="star" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="ゲーム分析"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_2[1].color}]}
            onPress={() => this._onPressViewer(this.state.item_button_2[1].label)}>
            <Ionicon name="bar-chart" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={styles.floatingAction_buttonColor.backgroundColor}
            title="パーソナルレポート"
            textContainerStyle={styles.floatingAction_textContainerStyle}
            textStyle={[styles.floatingAction_textStyle, {color: this.state.item_button_2[2].color}]}
            onPress={() => this._onPressViewer(this.state.item_button_2[2].label)}>
            <Ionicon name="bar-chart" style={styles.floatingAction_ButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        {/* フッターメニューエリア */}
        <LinearGradient
          colors={["#000000", "#302833"]}
          start={{x: 1.0, y: 1.0}}
          end={{x: 1, y: 0}}
          style={styles.footerContainerStyle}>

          <View style={[styles.row, { flex: 1}]}>
            <View style={styles.footerItemContainerStyle}>
              <FontAwesome5Icon name={this.state.footer_button_1.icon} size={28} color={this.state.footer_button_1.color} />
              <View paddingVertical={hp(0.5)} />
              <Text style={[
                styles.footerTextStyle, 
                { color: this.state.footer_button_1.color }]}>
                {this.state.footer_button_1.label}
              </Text>
            </View>

            <View style={styles.footerItemContainerStyle}>
              <Ionicon name={this.state.footer_button_2.icon} size={28} color={this.state.footer_button_2.color} />
              <View paddingVertical={hp(0.5)} />
              <Text style={[
                styles.footerTextStyle, 
                { color: this.state.footer_button_2.color }]}>
                {this.state.footer_button_2.label}
              </Text>
            </View>

            <View style={styles.footerItemContainerStyle}>
              <FontAwesome5Icon name={this.state.footer_button_3.icon} size={28} color={this.state.footer_button_3.color} />
              <View paddingVertical={hp(0.5)} />
              <Text style={[
                styles.footerTextStyle, 
                { color: this.state.footer_button_3.color }]}>
                {this.state.footer_button_3.label}
              </Text>
            </View>

            <View style={styles.footerItemContainerStyle}>
              <FontAwesome5Icon name={this.state.footer_button_4.icon} size={28} color={this.state.footer_button_4.color} />
              <View paddingVertical={hp(0.5)} />
              <Text style={[
                styles.footerTextStyle, 
                { color: this.state.footer_button_4.color }]}>
                {this.state.footer_button_4.label}
              </Text>
            </View>

            <View style={styles.footerItemContainerStyle}>
              <Ionicon name={this.state.footer_button_5.icon} size={28} color={this.state.footer_button_5.color} />
              <View paddingVertical={hp(0.5)} />
              <Text style={[
                styles.footerTextStyle, 
                { color: this.state.footer_button_5.color }]}>
                {this.state.footer_button_5.label}
              </Text>
            </View>
          </View>

        </LinearGradient>
      </View>
      </ImageBackground>
    );
  }
}

export default MainScreen;