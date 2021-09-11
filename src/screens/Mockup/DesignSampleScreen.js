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
import { CheckBox } from 'react-native-elements'
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
import { style } from 'styled-system';
// import { TabView, SceneMap } from 'react-native-tab-view';


/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
// 背景画像
const img = '../../../assets/resources/bg.png';
let imgPath;
const playerinfo = [];

function _onButtonClicked(){
    Alert.alert("wow")
}

function _onValueChange(){
}

const checkboxes = [
  { id: 1, title: 'Fever' },
  { id: 2, title: 'Headache' }
]
const FirstRoute = () => {
  const [checked, setCheck] = useState(false);
  const [checked2, setCheck2] = useState(false);

  return(
    <View style={{flex: 1, backgroundColor: "black"}}>
    {/* ボタン系 */}
    <View style={{flex: 1}}>
      <Text style={[styles.labelText]}>ボタンA(ボタン内の文字はサイズを示す)</Text>
      <View style={{flex:1}}>
        <View style={[styles.row]}>
          <TouchableOpacity style={[styles.button_rp, styles.formElement, {flex:1}]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>responsive_md</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_rp_lg, styles.formElement, {flex:1}]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>responsive_lg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_rp_xlg, styles.formElement, {flex:1}]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>responsive_xlg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>xsm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_sm, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>sm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_md, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>md</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_lg, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>lg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xlg, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText_black]}>xlg</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.labelText]}>ボタンB(ボタン内の文字はサイズを示す)</Text>
      <View style={{flex:1}}>
        <View style={[styles.row]}>
          <TouchableOpacity style={[styles.button_rp_sk, styles.formElement, {flex:1}]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>responsive_md</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_rp_lg_sk, styles.formElement, {flex:1}]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>responsive_lg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_rp_xlg_sk, styles.formElement, {flex:1}]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>responsive_xlg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xsm_sk, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>xsm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_sm_sk, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>sm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_md_sk, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>md</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_lg_sk, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>lg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_xlg_sk, styles.formElement]} onPress={() => _onButtonClicked()}>
            <Text style={[styles.buttonText]}>xlg</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={{flex:1}}>
      <Text style={[styles.labelText]}>セレクトボックス</Text>
      <View style={[styles.row]}>
        <View style={{flex:1}}>
          <RNPickerSelect
            placeholder={{ label: 'Please select...', value: '' , color: 'black'}}
            onValueChange={(value) => console.log(value)}
            style={pickerSelectStyles_rp}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            Icon={() => <Icon name="caret-down" size={40} color="#ffffff" />}
          />
        </View>
        <RNPickerSelect
            placeholder={{ label: 'Please select...', value: '' , color: 'black'}}
            onValueChange={(value) => console.log(value)}
            style={pickerSelectStyles_xsm}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            Icon={() => <Icon name="caret-down" size={20} color="#ffffff" />}
        />
        <RNPickerSelect
            placeholder={{ label: 'Please select...', value: '' , color: 'black'}}
            onValueChange={(value) => console.log(value)}
            style={pickerSelectStyles_sm}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            Icon={() => <Icon name="caret-down" size={25} color="#ffffff" />}
        />
        <RNPickerSelect
            placeholder={{ label: 'Please select...', value: '' , color: 'black'}}
            onValueChange={(value) => console.log(value)}
            style={pickerSelectStyles_md}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            Icon={() => <Icon name="caret-down" size={25} color="#ffffff" />}
        />
        <RNPickerSelect
            placeholder={{ label: 'Please select...', value: '' , color: 'black'}}
            onValueChange={(value) => console.log(value)}
            style={pickerSelectStyles_lg}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            Icon={() => <Icon name="caret-down" size={30} color="#ffffff" />}
        />
        <RNPickerSelect
            placeholder={{ label: 'Please select...', value: '' , color: 'black'}}
            onValueChange={(value) => console.log(value)}
            style={pickerSelectStyles_xlg}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            Icon={() => <Icon name="caret-down" size={30} color="#ffffff" />}
        />
      </View>
      <View style={{flex: 1, backgroundColor: "black"}}>
        <View style={[styles.row, {flex:1}]}>
          <View style={{flex:1}}>
            <Text style={[styles.labelText]}>チェックボックス(左：テキストあり、右：テキストなし)</Text>
            <View style={[styles.row]}>
              {/* テキスト付きのチェックボックス */}
              <CheckBox containerStyle={[styles.checkbox_container]} textStyle={[styles.checkbox_text]} checkedColor="#7cbb42" title='Click Here' checked={checked} onPress={() => setCheck(!checked)}/>
              {/* テキストなしのチェックボックス */}
              <CheckBox center containerStyle={[styles.checkbox_container_xsm]} textStyle={[styles.checkbox_text]} checkedColor="#7cbb42" checked={checked2} onPress={() => setCheck2(!checked2)}/>
            </View>
          </View>
          {/* スイッチボタン */}
          <View style={{flex:1}}>
            <Text style={[styles.labelText]}>スイッチボタン</Text>
            <View style={[styles.switchbutton, styles.row]}>
              <SwitchButton
                onValueChange={(val) => console.log(val)}      // this is necessary for this component
                text1 = 'A'                        // optional: first text in switch button --- default ON
                text2 = 'B'                       // optional: second text in switch button --- default OFF
                switchWidth = {200}                 // optional: switch width --- default 44
                switchHeight ={36.5}                 // optional: switch height --- default 100
                switchdirection = {styles.switchElement.direction}             // optional: switch button direction ( ltr and rtl ) --- default ltr
                switchBorderRadius = {8}          // optional: switch border radius --- default oval
                // switchSpeedChange = {200}           // optional: button change speed --- default 100
                switchBorderColor = {styles.switchElement.borderColor}       // optional: switch border color --- default #d4d4d4
                switchBackgroundColor = {styles.switchElement.borderColor}      // optional: switch background color --- default #fff
                btnBorderColor = {styles.switchElement.backgroundColor}          // optional: button border color --- default #00a4b9
                btnBackgroundColor = {styles.switchElement.backgroundColor}      // optional: button background color --- default #00bcd4
                // fontColor = '#ffffff'               // optional: text font color --- default #b1b1b1
                // activeFontColor = '#fff'            // optional: active font color --- default #fff
              />
            </View>
          </View>
        </View>
      </View>
    </View>

    {/* 入力フォーム系 */}
    <View style={{flex: 1}}>
      <Text style={[styles.labelText]}>入力フォームA</Text>
      <View style={[styles.row]}>
        {/* <TextInput style={[styles.input_rp, {flex:1}]} placeholder="responsive..." placeholderTextColor="#000000" onChangeText={(text) => setState({text})}></TextInput> */}
        <TextInput style={[styles.input_rp, {flex:1}]} placeholder="responsive..." placeholderTextColor={styles.inputPHColor.color} ></TextInput>
        <TextInput style={[styles.input_xsm]} placeholder="xsm..." placeholderTextColor={styles.inputPHColor.color}></TextInput>
        <TextInput style={[styles.input_sm]} placeholder="sm..." placeholderTextColor={styles.inputPHColor.color}></TextInput>
        <TextInput style={[styles.input_md]} placeholder="md..." placeholderTextColor={styles.inputPHColor.color}></TextInput>
        <TextInput style={[styles.input_lg]} placeholder="lg..." placeholderTextColor={styles.inputPHColor.color}></TextInput>
        <TextInput style={[styles.input_xlg]} placeholder="xlg..." placeholderTextColor={styles.inputPHColor.color}></TextInput>
      </View>
      {/* 入力フォームBは現状不要 */}
      {/* <Text style={[styles.labelText]}>入力フォームB</Text>
      <View style={[styles.row]}>
        <TextInput style={[styles.input_rp_sk, {flex:1}]} placeholder="responsive..." placeholderTextColor="#ffffff"></TextInput>
        <TextInput style={[styles.input_xsm_sk]} placeholder="xsm..." placeholderTextColor="#ffffff"></TextInput>
        <TextInput style={[styles.input_sm_sk]} placeholder="sm..." placeholderTextColor="#ffffff"></TextInput>
        <TextInput style={[styles.input_md_sk]} placeholder="md..." placeholderTextColor="#ffffff"></TextInput>
        <TextInput style={[styles.input_lg_sk]} placeholder="lg..." placeholderTextColor="#ffffff"></TextInput>
        <TextInput style={[styles.input_xlg_sk]} placeholder="xlg..." placeholderTextColor="#ffffff"></TextInput>
      </View> */}
    </View>
    {/* <View style={{flex: 1}}>
      <Text style={[styles.labelText]}>セレクトボックス</Text>
      <View style={[styles.row]}>
        <ModalDropdown style={[styles.dropdown_rp, {flex:1}]} textStyle={[styles.dropdown_text]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_xsm]} textStyle={[styles.dropdown_text]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_sm]} textStyle={[styles.dropdown_text]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_md]} textStyle={[styles.dropdown_text]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_lg]} textStyle={[styles.dropdown_text]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_xlg]} textStyle={[styles.dropdown_text]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
      </View>
      <Text style={[styles.labelText]}>セレクトボックス 非活性</Text>
      <View style={[styles.row]}>
        <ModalDropdown style={[styles.dropdown_rp_sk, {flex:1}]} textStyle={[styles.dropdown_text_sk]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_xsm_sk]} textStyle={[styles.dropdown_text_sk]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_sm_sk]} textStyle={[styles.dropdown_text_sk]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_md_sk]} textStyle={[styles.dropdown_text_sk]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_lg_sk]} textStyle={[styles.dropdown_text_sk]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
        <ModalDropdown style={[styles.dropdown_xlg_sk]} textStyle={[styles.dropdown_text_sk]} dropdownStyle={[styles.dropdown_dropdown, {height: hp(9)}]} defaultTextStyle={[styles.defaultTextStyle]} options={['option 1', 'option 2']}/>
      </View>
    </View> */}
  </View>
  )
};

const pickerSelectStyles_rp = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    height: hp(4.5),
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icons
  },
  iconContainer: {
    top: 2,
    right: 20,
  },
});

const pickerSelectStyles_xsm = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    width: wp(4.5),
    height: hp(4.5),
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
});

const pickerSelectStyles_sm = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    width: wp(7),
    height: hp(4.5),
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
});

const pickerSelectStyles_md = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    width: wp(12.5),
    height: hp(4.5),
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
});

const pickerSelectStyles_lg = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    width: wp(12),
    height: hp(6),
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
});

const pickerSelectStyles_xlg = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    width: wp(10),
    height: hp(9),
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#75787b',
    color: '#ffffff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 25,
    right: 10,
  },
});

const SecondRoute = () => {
  return(
    <View style={{flex: 1, backgroundColor: "black"}}>
      <Text style={[styles.labelText]}>グラフ、テーブル</Text>
      <View style={[styles.row, {flex:1}]}>
        <View style={{flex:1, borderColor: '#ffffff', borderWidth: 1}}>
          <ScrollView directionalLockEnabled={false} horizontal={true} vertical={true}>
            <View style={{flex:1}}>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーー白枠内をスワイプすると枠内が横スクロールーーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
              <Text style={[styles.labelText]}>　　　　　</Text>
            </View>
          </ScrollView>
        </View>
        <View style={{flex:1, borderColor: '#ffffff', borderWidth: 1}}>
          <ScrollView>
            <View style={{flex:1}}>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>白枠内をスワイプすると枠内が縦スクロール</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
              <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーー</Text>
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={[styles.row, {flex:1}]}>
        <View style={{flex:1, borderColor: '#ffffff', borderWidth: 1}}>
          <ScrollView>
            <View>
              <ScrollView horizontal={true}>
                <View style={{flex:1}}>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーー白枠内をスワイプすると枠内が縦横スクロールーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                  <Text style={[styles.labelText]}>ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー</Text>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        <View style={{flex:1, borderColor: '#ffffff', borderWidth: 1}}>
          <Text style={[styles.labelText]}>白枠内をスワイプするとタブ全体がスクロール</Text>
        </View>
      </View>
    </View>
  )
};

const ThirdRoute = () => {
  const [items, setItems] = React.useState([
    { name: 'インカレ 1回戦', code: '#1abc9c' , videoicon: 'video', date: '2020/08/18 (Sat)'},
    { name: 'インカレ 1回戦', code: '#2ecc71' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
    { name: 'インカレ 1回戦', code: '#3498db' , videoicon: 'upload', date: '2020/08/18 (Sat)'},
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
  ]);

  return(
    <View style={{flex: 1, backgroundColor: "black"}}>
      <Text style={[styles.labelText]}>カラーピッカー</Text>
      <FlatGrid
        itemDimension={320}
        data={items}
        style={tyleStyles.gridView}
        // staticDimension={300}
        // fixed
        spacing={10}
        renderItem={({ item }) => (
          <View style={[tyleStyles.itemContainer, { backgroundColor: '#ffffff' }]}>
            <View style={[styles.row, {flex:1, backgroundColor: '#c0c0c0'}]}>
              <Icon name="basketball-ball" size={25} color="#000000" style={{marginLeft: 10, marginTop:8, flex:1}}/>
              <Text style={[tyleStyles.titleName, {flex:4}]}>{item.name}</Text>
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
                    <Text style={[tyleStyles.itemName, {flex:5, marginTop:3}]}>青山学院大学</Text>
                    <Text style={[tyleStyles.itemName, {flex:2}]}>40</Text>
                   </View>
                </View>
                <View style={[styles.row, {flex:1}]}>
                  <View style={{flex:1}}></View>
                  <View style={[styles.row, {flex:4}]}>
                    <Icon style={{flex:2}} name="basketball-ball" size={25} color="#000000"/>
                    {/* <Image style={{height:30, width:30}} source={require('../../../assets/resources/waseda_logo.png')}/> */}
                    <Text style={[tyleStyles.itemName, {flex:5, marginTop:3}]}>早稲田大学</Text>
                    <Text style={[tyleStyles.itemName, {flex:2}]}>40</Text>
                  </View>
                </View>
              </View>
              <View style={{flex:1}}>
                <Text style={tyleStyles.itemCode}>{item.date}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
};

const tyleStyles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
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

const FourthRoute = () => (
  <View style={{flex: 1, backgroundColor: "black"}}>
    <Text style={[styles.labelText]}>その他</Text>
  </View>
);

class AppTabNavigation extends React.Component {
  render() {
    const { navigation } = this.props;
    const { routes, index } = this.props.navigation.state;
    const {
      containerStyle,
      tabStyle,
      selectedTabStyle,
      textStyle,
      selectedTextStyle,
    } = styles;
    const naviTitles = [
      "Button, Forms",
      "Graph, Table",
      "ColorPicker",
      "XXX",
    ]
    return (
      <View style={containerStyle}>
        {routes.map((route, idx) => {
          if (index === idx) {
            return (
              <View key={idx} style={[tabStyle, selectedTabStyle]}>
                <Text style={[textStyle, selectedTextStyle]}>{naviTitles[idx]}</Text>
              </View>
            );
          }
          return (
            <TouchableOpacity
              style={tabStyle}
              key={idx}
              onPress={() => { navigation.navigate(route.routeName); }}
            >
              <Text style={textStyle}>{naviTitles[idx]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const RootStack = createMaterialTopTabNavigator(
  {
    Button: {
      screen: FirstRoute,
    },
    Graph: {
      screen: SecondRoute,
    },
    Color: {
      screen: ThirdRoute,
    },
    Other: {
      screen: FourthRoute,
    },
  },
  {
    initialRouteName: 'Button',
    tabBarComponent: AppTabNavigation
  }
);

const AppContainer = createAppContainer(RootStack)



class Design extends Component { 
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
      <AppContainer />
      // <View style={styles.container}>
      //   <View style={{flex: 1, flexDirection: 'row'}}>
      //     <TabView 
      //       navigationState={{index: this.state.index, routes: this.state.routes }}
      //       renderScene={renderScene}
      //       // onIndexChange={{index: this.state.setIndex}}
      //       onIndexChange={index => this.setState({ index })}
      //       initialLayout={initialLayout}
      //       renderTabBar={props => <TabBar {...props} 
      //         activeColor={'#ffffff'}
      //         inactiveColor={"#000000"} 
      //         style={{backgroundColor: '#75787b'}
      //       }/>} // <-- add this line/>
      //     />
      //   </View>
      // </View>
    )
  }
}


// /*--------------------------------------------------------------------------
//  * デザインメモ
// 　　・基本要素
// 　　　・余白（全体、機能間、オブジェクト間（＝大中小））
// 　　　・色（通常、非活性、強調）
// 　　　・文字（大中小）
// 　　・コンポーネント
// 　　　・テキスト
// 　　　・ボタン（活性、非活性、グループ、選択式）
// 　　　・おしゃれラジオボタン
// 　　　・画像型ボタン
// 　　　・タブ
// 　　　・テーブル
// 　　　・セレクトボックス
// 　　　・入力フォーム
// 　　　・
//  *------------------------------------------------------------------------*/


// // 画面遷移時の再レンダリング対応
export default withNavigation(Design);