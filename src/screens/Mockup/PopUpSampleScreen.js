/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
// 画面遷移時の再レンダリング対応
import { withNavigation, createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";

class PopUp extends Component { 
/*--------------------------------------------------------------------------
  * コンストラクタ
  *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
  }
/*--------------------------------------------------------------------------
  * イベント処理
  *------------------------------------------------------------------------*/
  _onButtonClicked(){
    Alert.alert("wow")
  }



/*--------------------------------------------------------------------------
  * 関数
  *------------------------------------------------------------------------*/



/*--------------------------------------------------------------------------
  * レンダーメソッド
  *------------------------------------------------------------------------*/
  render() {
    return(
      <View style={{flex:1, flexDirection: 'row', backgroundColor:'#000000'}}>
        <View style={{flex:1}}></View>
        <View style={{flex:18}}>
          {/* ヘッダー */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center', borderColor: '#ffffff', borderWidth: 1}}>
            <Text style={{color:'#ffffff'}}>ここにヘッダーを記載する</Text>
          </View>
          {/* コンテンツ */}
          <View style={{flex:4, alignItems:'center', justifyContent: 'center', borderColor: '#ffffff', borderWidth: 1}}>
            <Text style={{color:'#ffffff'}}>ここにコンテンツを記載する</Text>
          </View>
          {/* フッター */}
          <View style={{flex:1, alignItems:'center', justifyContent: 'center', borderColor: '#ffffff', borderWidth: 1}}>
            <Text style={{color:'#ffffff'}}>ここにフッターを記載する</Text>
          </View>
        </View>
        <View style={{flex:1}}></View>
      </View>
    )
  }
}

// // 画面遷移時の再レンダリング対応
export default withNavigation(PopUp);