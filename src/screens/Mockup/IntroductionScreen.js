import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
// モーダルダイアログ
import Modal from "react-native-modal";
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// ローカルインポート
import Constants from '../../common/Constants';
/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/

const win = Dimensions.get('window');
// 背景画像
const img1 = '../../../assets/resources/analyze.jpeg';
const img2 = '../../../assets/resources/rules.jpg';
const img3 = '../../../assets/resources/basketball.jpeg';
const styles = StyleSheet.create({
  image: {width:win.width/3, height:win.height/3,marginLeft: 'auto',
  marginRight: 'auto', marginTop: 30, marginBottom: 30},
  title: {fontSize: 40,marginLeft: 'auto',marginRight: 'auto', marginTop: 30},
  text:  {fontSize: 30,marginLeft: 'auto',marginRight: 'auto'},
  button_text: {color:"grey"},
  button_style:{width: 60,height: 44,justifyContent: 'center',alignItems: 'center'},
  modal: {
    // backgroundColor: 'rgba(245,245,245,0.8)',
    backgroundColor: 'whitesmoke',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    top: hp(5),
    bottom: hp(5),
    left: wp(5),
    right: wp(5),
    position:'absolute'
  }
});

const slides = [
  {
    key: 'one',
    title: 'ご利用機能',
    text: '本アプリでは、バスケットボール分析機能をご利用いただけます。',
    image: require(img1),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: '注意事項',
    text: '本アプリご利用時には、以下の注意事項を順守してご利用ください',
    image: require(img2),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'ご登録',
    text: '本アプリを初めてご利用のお客様は下記よりご登録をお願い致します',
    image: require(img3),
    backgroundColor: '#22bcb5',
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      // ログインモーダル表示フラグ
      isLoginModalVisible: false,
    }
  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image}/>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  _renderNextButton = () => {
    return (
      <View style={styles.button_style}>
        <Text style={styles.button_text}>Next</Text>
      </View>
    )
  }
  _renderDoneButton = () => {
    return (
      <View style={styles.button_style}>
        <Text style={styles.button_text}>Done</Text>
      </View>
    )
  }
  _onDone = () => {
    // メニュー画面にプッシュ遷移
    const { navigation } = this.props;
    navigation.navigate(Constants.SCREEN_ID.LOG_IN);
  }
  render() {
    return (
      // {/* モーダルダイアログ */}
      <SafeAreaView>
        <Modal
        style={styles.modal}
        isVisible={true}
        swipeDirection={['up', 'down', 'left', 'right']}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={500}
        animationOutTiming={500}
        >
          <AppIntroSlider renderNextButton={this._renderNextButton} renderDoneButton={this._renderDoneButton} renderItem={this._renderItem} data={slides} onDone={this._onDone}/>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default App;
