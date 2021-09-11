/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { 
  StyleSheet, 
  View,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
 } from 'react-native';
 import PropTypes from 'prop-types';
 // レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// モーダルダイアログ
import Modal from "react-native-modal";
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// FontAwesome5アイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// グリッド表示
import { FlatGrid } from 'react-native-super-grid';
// カラーピッカー
import { ColorPicker } from 'react-native-color-picker'
// 完了ダイアログ
import { ConfirmDialog } from 'react-native-simple-dialogs';
// アイコン
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// ローカルインポート
import BaseStyles from '../../common/BaseStyles';
import Messages from '../../common/Messages';
import { TouchableHighlightBase } from 'react-native';
import { styles } from 'styled-system';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
const propTypes = {
  updateAssignPlayers: PropTypes.func,
};
const items_home = [
  { number: '#15', name: '竹井昭人 １号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText , 
  },
  { number: '#16', name: '竹井昭人 ２号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#17', name: '竹井昭人 ３号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#18', name: '竹井昭人 ４号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#19', name: '竹井昭人 ５号',
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#20', name: '竹井昭人 ６号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '竹井昭人 ７号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
},
  { number: '#21', name: '竹井昭人 ８号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '竹井昭人 ９号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '竹井昭人 １０号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
]
const items_visitor = [
  { number: '#15', name: '赤石朗 １号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText , 
  },
  { number: '#16', name: '赤石朗 ２号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#17', name: '赤石朗 ３号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#18', name: '赤石朗 ４号', 
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#19', name: '赤石朗 ５号',
    starters_btn: BaseStyles.button_sm, starters_txt: BaseStyles.buttonText_black,
    subs_btn: BaseStyles.button_sm_sk, subs_txt: BaseStyles.buttonText 
  },
  { number: '#20', name: '赤石朗 ６号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '赤石朗 ７号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '赤石朗 ８号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '赤石朗 ９号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
  { number: '#21', name: '赤石朗 １０号', 
    starters_btn: BaseStyles.button_sm_sk, starters_txt: BaseStyles.buttonText,
    subs_btn: BaseStyles.button_sm, subs_txt: BaseStyles.buttonText_black
  },
]
class AssignPlayers extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = { 
      width: 0, // デバイスの幅
      height: 0, // デバイスの高さ      
      isLoadingVisible: false, // ローディングスピナー表示フラグ
      isMessageDialogVisible: false, // 完了メッセージダイアログ
      isColorPickerModalVisible: false, // カラーモーダル表示・非表示
      isAssignHome: this.props.isAssignHome, // Home・Visitor表示判定フラグ
      team_name: '', // チーム名
      team_color: '',
      selectedColor: '#ffffff', // カラーモーダルで選択した色
      items: items_home, // 表示データ
      // 活性・非活性のボタンスタイル定義
      buttonStyles: [
        {button: BaseStyles.button_sm, text: BaseStyles.buttonText_black},
        {button: BaseStyles.button_sm_sk, text: BaseStyles.buttonText},
      ],
    };
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentDidMount() {

    // チーム名テキスト
    if (this.state.isAssignHome) {
      this.setState({ team_name: '青山学院', items: items_home, selectedColor: 'lightgreen' });
    } else {
      this.setState({ team_name: '早稲田', items: items_visitor, selectedColor: 'skyblue' });
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

  _switch(index, type) {
    
    if(type === 0) {
      // スタメンボタン押下時
      if (this.state.items[index].starters_btn.backgroundColor === '#ffffff' ) {
        if (this.state.items[index].subs_btn.backgroundColor === '#ffffff' ) {
          // スタメンボタン活性 かつ ベンチボタン活性の場合
          // スタメンボタンのみ非活性にする
          this.state.items[index].starters_btn = BaseStyles.button_sm_sk;
          this.state.items[index].starters_txt = BaseStyles.buttonText;
        } else {
          // スタメンボタン活性 かつ ベンチボタン非活性の場合
          // スタメンボタンのみ非活性にする
          this.state.items[index].starters_btn = BaseStyles.button_sm_sk;
          this.state.items[index].starters_txt = BaseStyles.buttonText;
        }
      } else {
        if (this.state.items[index].subs_btn.backgroundColor === '#ffffff' ) {
          // スタメンボタン非活性 かつ ベンチボタン活性の場合
          // スタメンボタンを活性、ベンチボタンを非活性にする
          this.state.items[index].starters_btn = BaseStyles.button_sm;
          this.state.items[index].starters_txt = BaseStyles.buttonText_black;
          this.state.items[index].subs_btn = BaseStyles.button_sm_sk;
          this.state.items[index].subs_txt = BaseStyles.buttonText;      
        } else {
          // スタメンボタン非活性 かつ ベンチボタン非活性の場合
          // スタメンボタンのみ活性にする
          this.state.items[index].starters_btn = BaseStyles.button_sm;
          this.state.items[index].starters_txt = BaseStyles.buttonText_black;
        }
      }
    } else {
      // ベンチボタン押下時
      if (this.state.items[index].subs_btn.backgroundColor === '#ffffff' ) {
        if (this.state.items[index].starters_btn.backgroundColor === '#ffffff' ) {
          // ベンチボタン活性 かつ スタメンボタン活性の場合
          // ベンチボタンのみ非活性にする
          this.state.items[index].subs_btn = BaseStyles.button_sm_sk;
          this.state.items[index].subs_txt = BaseStyles.buttonText;
        } else {
          // ベンチボタン活性 かつ スタメンボタン非活性の場合
          // ベンチボタンのみ非活性にする
          this.state.items[index].subs_btn = BaseStyles.button_sm_sk;
          this.state.items[index].subs_txt = BaseStyles.buttonText;
        }
      } else {
        if (this.state.items[index].starters_btn.backgroundColor === '#ffffff' ) {
          // ベンチボタン非活性 かつ スタメンボタン活性の場合
          // ベンチボタンを活性、スタメンボタンを非活性にする
          this.state.items[index].subs_btn = BaseStyles.button_sm;
          this.state.items[index].subs_txt = BaseStyles.buttonText_black;
          this.state.items[index].starters_btn = BaseStyles.button_sm_sk;
          this.state.items[index].starters_txt = BaseStyles.buttonText;      
        } else {
          // ベンチボタン非活性 かつ スタメンボタン非活性の場合
          // ベンチボタンのみ活性にする
          this.state.items[index].subs_btn = BaseStyles.button_sm;
          this.state.items[index].subs_txt = BaseStyles.buttonText_black;
        }
      }
    }

    // 変更を反映
    this.setState({
      items: this.state.items,
    });  
  }

  // カラーモーダル起動
  toggleColorModal = () => {
    this.setState({
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
    });
  }
  // 次へボタン押下時のイベント
  _next() {
    return this.props.updateAssignPlayers();
  }
  // 登録ボタン押下時のイベント
  _assign() {
    // ローディングスピナー起動
    this.setState({ isLoadingVisible: true })
    setTimeout(()=>{
      // 1秒後にローディングスピナーを終了し、メッセージダイアログ起動
      this.setState({ isLoadingVisible: false })
      this.setState({ isMessageDialogVisible: true });
      setTimeout(()=>{
            // 2秒後にメッセージダイアログを終了し、画面を閉じる
        this.setState({ isMessageDialogVisible: false });
        const game_id = 'gm_1626139799278011';
        return this.props.updateAssignPlayers(game_id);
      }, 2000)    
    }, 1000);
  }
/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    return (
      <SafeAreaView
        onLayout={this._onLayout.bind(this)}
        style={{flex:1, flexDirection: 'row'}}>

        <View style={{flex:1}}></View>
        <View style={{flex:18}}>

          {/* visibleがtrueだと画面が暗くなってインジケータが出る */}
          <Spinner
            visible={this.state.isLoadingVisible}
            textContent={Messages.INFO.I003}
            textStyle={BaseStyles.labelText}
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
                // width: '100%', 
                backgroundColor:"transparent", 
                paddingTop: this.state.height*0.12, 
                paddingBottom: this.state.height*0.12,
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


          {/* ヘッダー */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View style={[BaseStyles.row]}>
              <Text style={[BaseStyles.headerText]}>スタメン、ベンチ入りの選手を選択してください</Text>
            </View>
          </View>

          {/* コンテンツ */}
          <View style={{flex:4, alignItems:'center', justifyContent: 'center'}}>
            {/* チーム */}
            <View style={[AssignPlayersStyles.teamContainer]}>
              <Text style={AssignPlayersStyles.itemText}>{this.state.team_name}</Text>
              <View paddingHorizontal={this.state.width*0.01} />
              <TouchableOpacity style={[BaseStyles.formElement]} onPress={this.toggleColorModal}>
                <Icon
                style={[
                  AssignPlayersStyles.icon_tshirt,
                  {
                    color: this.state.selectedColor,
                  }
                ]}
                name='tshirt'/>
              </TouchableOpacity>
            </View>

            {/* カラーピッカー */}
            <SafeAreaView>
              <Modal
                isVisible={this.state.isColorPickerModalVisible}
                animationIn={'fadeIn'}
                animationOut={'fadeOut'}
                animationInTiming={1000}
                animationOutTiming={800}
                onBackdropPress={this.toggleColorModal}
                style={{
                  top: this.state.height * 0.1,
                  bottom: this.state.height * 0.1,
                  left: this.state.width * 0.1,
                  right: this.state.width * 0.1,
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
            
            <View paddingVertical={this.state.width*0.01} />

            {/* メンバーリスト */}
            <FlatGrid
              itemDimension={this.state.width}
              spacing={10}
              data={this.state.items}
              style={[AssignPlayersStyles.gridView]}
              renderItem={({ item, section, index }) => (
                <View style={[AssignPlayersStyles.itemContainer, ]}>
                  <Text style={AssignPlayersStyles.itemNumber}>{item.number}</Text>
                  <Text style={AssignPlayersStyles.itemName}>{item.name}</Text>
                  <TouchableOpacity style={[BaseStyles.formElement, item.starters_btn]} onPress={() => this._switch(index, 0)}>
                    <Text
                      // style={[this.state.buttonStyles[0].text]}>スタメン
                      style={[item.starters_txt]}>スタメン
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[BaseStyles.formElement,item.subs_btn]} onPress={() => this._switch(index, 1)}>
                    <Text style={[item.subs_txt]}>ベンチ</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* フッター */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View alignItems='center'>
            {(this.state.isAssignHome ?
              // 次へボタン
              <TouchableOpacity style={[BaseStyles.formElement,BaseStyles.button_lg_sk]} onPress={() => this._next()}>
                <Text style={[BaseStyles.buttonText]}>次へ</Text>
              </TouchableOpacity>
              :
              // 登録へボタン
              <TouchableOpacity style={[BaseStyles.formElement,BaseStyles.button_lg_sk]} onPress={() => this._assign()}>
                <Text style={[BaseStyles.buttonText]}>登録</Text>
              </TouchableOpacity>
            )}
            </View>
          </View>

        </View>
        <View style={{flex:1}}></View>

      </ SafeAreaView>
    );
  }
}

const AssignPlayersStyles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    textAlign: 'center',
    fontFamily: 'Raleway-SemiBold',
    fontSize: RFPercentage(1.5),
    color: '#ffffff',
  },
  icon_tshirt: {
    fontSize: RFPercentage(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {
    width: '50%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNumber: {
    textAlign: 'center',
    fontFamily: 'Raleway-SemiBold',
    fontSize: RFPercentage(1.5),
    color: '#ffffff',
  },
  itemName: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Raleway-SemiBold',
    fontSize: RFPercentage(1.5),
    color: '#ffffff',
  },
});

export default AssignPlayers;