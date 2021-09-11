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
  SafeAreaView,
  Image,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
  Button,
  Alert,
  StyleSheet,
  } from 'react-native';
import { SearchBar, CheckBox } from 'react-native-elements'
// 画面遷移時の再レンダリング対応
import { withNavigation, createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// テーブル表示
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
import EIcon from 'react-native-vector-icons/Entypo';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// ローディングスピナー
import Spinner from 'react-native-loading-spinner-overlay';
// ドロップダウン
import ModalDropdown from 'react-native-modal-dropdown';
import RNPickerSelect from 'react-native-picker-select';
// スイッチボタン
import SwitchButton from 'switch-button-react-native';
// タイル
import { FlatGrid, SectionGrid } from 'react-native-super-grid';

// ローカルインポート
import Constants from '../../common/Constants';
import styles from '../../common/BaseStyles';
import GetCognitoUser from '../../util/GetCognitoUser';
import RequestApi from '../../util/RequestApi';
import Messages from '../../common/Messages';
import ExportCSV from '../../util/ExportCSV';

// import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { style, textAlign } from 'styled-system';
// import { TabView, SceneMap } from 'react-native-tab-view';


/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// // 背景画像
// const img = '../../../assets/resources/bg.png';
// let imgPath;
// const playerinfo = [];


// const ThirdRoute = () => {
//   const [items, setItems] = React.useState([
//     { name: 'インカレ 1回戦', code: '#1abc9c' , videoicon: 'video', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#2ecc71' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#3498db' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#9b59b6' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#34495e' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#16a085' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#27ae60' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#2980b9' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#8e44ad' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#2c3e50' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#f1c40f' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#e67e22' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#e74c3c' , videoicon: 'video', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#ecf0f1' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#95a5a6' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#f39c12' , videoicon: 'video', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#d35400' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#c0392b' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#bdc3c7' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//     { name: 'インカレ 1回戦', code: '#7f8c8d' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
//   ]);

//   return(
//     <View style={{flex: 1, backgroundColor: "black"}}>
//       <Text style={[styles.labelText]}>カラーピッカー</Text>
//       <FlatGrid
//         itemDimension={320}
//         data={items}
//         style={GridStyles.gridView}
//         // staticDimension={300}
//         // fixed
//         spacing={10}
//         renderItem={({ item }) => (
//           <View style={[GridStyles.itemContainer, { backgroundColor: '#ffffff' }]}>
//             <View style={[styles.row, {flex:1, backgroundColor: '#c0c0c0'}]}>
//               <Icon name="basketball-ball" size={25} color="#000000" style={{marginLeft: 10, marginTop:8, flex:1}}/>
//               <Text style={[GridStyles.titleName, {flex:4}]}>{item.name}</Text>
//               <EIcon name={item.videoicon} size={25} color="#000000" style={{marginRight: -10, marginTop:8, flex:1}}/>
//             </View>
//             <View style={{flex:3}}>
//               <View style={{flex:1}}>
//               </View>
//               <View style={{flex:3}}>
//                 <View style={[styles.row, {flex:1}]}>
//                   <View style={{flex:1}}></View>
//                   <View style={[styles.row, {flex:4}]}>
//                     <Icon style={{flex:2}} name="basketball-ball" size={25} color="#000000"/>
//                     {/* <Image style={{height:50, width:50}} source={require('../../../assets/resources/aogaku_logo.jpeg')}/> */}
//                     <Text style={[GridStyles.itemName, {flex:5, marginTop:3}]}>青山学院大学</Text>
//                     <Text style={[GridStyles.itemName, {flex:2}]}>40</Text>
//                    </View>
//                 </View>
//                 <View style={[styles.row, {flex:1}]}>
//                   <View style={{flex:1}}></View>
//                   <View style={[styles.row, {flex:4}]}>
//                     <Icon style={{flex:2}} name="basketball-ball" size={25} color="#000000"/>
//                     {/* <Image style={{height:30, width:30}} source={require('../../../assets/resources/waseda_logo.png')}/> */}
//                     <Text style={[GridStyles.itemName, {flex:5, marginTop:3}]}>早稲田大学</Text>
//                     <Text style={[GridStyles.itemName, {flex:2}]}>40</Text>
//                   </View>
//                 </View>
//               </View>
//               <View style={{flex:1}}>
//                 <Text style={GridStyles.itemCode}>{item.date}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   )
// };
 
class GameSelection extends Component { 
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      items: [
        { name: 'インカレ 1回戦', code: '#1abc9c' , videoicon: 'video', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 2回戦', code: '#2ecc71' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 3回戦', code: '#3498db' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#9b59b6' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#34495e' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#16a085' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#27ae60' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#2980b9' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#8e44ad' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#2c3e50' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#f1c40f' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#e67e22' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#e74c3c' , videoicon: 'video', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#ecf0f1' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#95a5a6' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#f39c12' , videoicon: 'video', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#d35400' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#c0392b' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#bdc3c7' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
        { name: 'インカレ 1回戦', code: '#7f8c8d' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
      ]
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
  _onButtonClicked(){
    Alert.alert("wow")
  }



/*--------------------------------------------------------------------------
 * 関数
 *------------------------------------------------------------------------*/
state = {
  search: '',
};

updateSearch = (search) => {
  this.setState({ search });
};


/*--------------------------------------------------------------------------
 * レンダーメソッド
 *------------------------------------------------------------------------*/
  render() {
    const { search } = this.state;
    return(
      // <View style={{flex:1, backgroundColor: '#000000'}}>
      <SafeAreaView 
        onLayout={this._onLayout.bind(this)}
        // style={[styles.container]}
        >
        {/* <View style={{flex:1}}> */}
        <View style={[
          GridStyles.title,
          {height:this.state.height * 0.1}
        ]}>
          <Text style={[styles.headerText]}>スタッツを閲覧する試合を選択してください</Text>
        </View>
        <View style={[
          GridStyles.search_bar,
          { height:this.state.height * 0.05}
        ]}>
          <SearchBar
            placeholder="Type Here..."
            // placeholderTextColor='#ffffff'
            onChangeText={this.updateSearch}
            value={search}
            containerStyle={[styles.searchBarContainer]}
            inputContainerStyle={[styles.searchBarInput]}
            inputStyle={[styles.searchBarInputText]}
            searchIcon={[styles.searchBarIcon]}
          />
        </View>
        {/* <View style={{flex:8}}> */}
        <View style={[styles.row, GridStyles.contents]}>
          <FlatGrid
            // itemDimension={320}
            itemDimension={this.state.width/5}
            data={this.state.items}
            style={GridStyles.gridView}
            // staticDimension={300}
            // fixed
            spacing={10}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.transition(item.id)}>
                <View style={[GridStyles.itemContainer, { backgroundColor: '#ffffff' }]}>
                  <View style={[styles.row, {flex:1, backgroundColor: '#c0c0c0'}]}>
                  <Icon name="basketball-ball" size={25} color="#000000" style={{marginLeft: 10, marginTop:8, flex:1}}/>
                  <Text style={[GridStyles.titleName, {flex:4}]}>{item.name}</Text>
                  <EIcon name={item.videoicon} size={25} color="#000000" style={{marginRight: -10, marginTop:8, flex:1}}/>
                  </View>
                  <View style={{flex:3}}>
                  <View style={{flex:1}}>
                  </View>
                  <View style={{flex:3}}>
                    <View style={[styles.row, {flex:1}]}>
                    <View style={{flex:1}}></View>
                    <View style={[styles.row, {flex:4}]}>
                      <Icon style={{flex:2}} name="basketball-ball" size={25} color="#000000"/>
                      {/* <Image style={{height:50, width:50}} source={require('../../../assets/resources/aogaku_logo.jpeg')}/> */}
                      <Text style={[GridStyles.itemName, {flex:5, marginTop:3}]}>青山学院大学</Text>
                      <Text style={[GridStyles.itemName, {flex:2}]}>40</Text>
                    </View>
                    </View>
                    <View style={[styles.row, {flex:1}]}>
                    <View style={{flex:1}}></View>
                    <View style={[styles.row, {flex:4}]}>
                      <Icon style={{flex:2}} name="basketball-ball" size={25} color="#000000"/>
                      {/* <Image style={{height:30, width:30}} source={require('../../../assets/resources/waseda_logo.png')}/> */}
                      <Text style={[GridStyles.itemName, {flex:5, marginTop:3}]}>早稲田大学</Text>
                      <Text style={[GridStyles.itemName, {flex:2}]}>40</Text>
                    </View>
                    </View>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={GridStyles.itemCode}>{item.date}</Text>
                  </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const GridStyles = StyleSheet.create({

  contents: {
    height: '75%',
    backgroundColor: '#000000',
    // borderColor:'gray',
    // borderRightWidth: 0.5,
    // borderLeftWidth: 0.5,
    // borderBottomWidth: 0.5,
},
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 0,
  },
  search_bar: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'flex-end', 
    marginTop: 0,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
  },
  gridView: {
    marginTop: 0,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    // marginTop: 10,
    // flex: 1,
  },
  titleName: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: 'bold'
  },
  itemContainer: {
    // justifyContent: 'flex-end',
    // borderRadius: 5,
    height: 180,
  },
  itemName: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000000',
    marginLeft: 10
  },
});

// // 画面遷移時の再レンダリング対応
export default withNavigation(GameSelection);