import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// ドロップダウンピッカー
import RNPickerSelect from 'react-native-picker-select';
// アイコン
import Ionicons from 'react-native-vector-icons/Ionicons';
// ローカルインポート
import styles from './CommonStyles';

class PickerSelect extends Component {
  render() {
    const placeholder = {
      label: 'Please Select...',
      value: null,
      color: '#9EA0A4',
    };

    const { 
      title, 
      datas, 
      selected, 
      width,
      fontsize,
    } = this.props;

    return (
      <View style={[styles.column]}>
        <View style={[pickerSelectStyles.dropdown_area]}>
          <Text style={[styles.labelText_black, (title === '') && {display: 'none'}]}>{title}</Text>
        </View>
        <View>
          {/* and value defined */}
          <RNPickerSelect style={[styles.labelText]}
            placeholder={placeholder}
            items={datas}
            onValueChange={value => {
              this.setState({
                fav: value,
              });
            }}
            style={{
              inputIOS: {
                fontFamily: 'Raleway-Regular',
                backgroundColor: '#ffffff',
                width: wp(Number(width)),
                height: hp(4.5),
                fontSize: RFPercentage(Number(fontsize)),
                paddingVertical: 5,
                paddingHorizontal: 10,
                // borderWidth: 1,
                borderColor: '#777777',
                // borderRadius: 4,
                color: 'black',
                paddingRight: 30, // to ensure the text is never behind the icon
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: 7,
                justifyContent: 'center',
                alignItems: 'center',        
              },
              inputAndroid: {
                fontFamily: 'Raleway-Regular',
                backgroundColor: '#ffffff',
                width: wp(Number(width)),
                fontSize: RFPercentage(Number(fontsize)),
                height: hp(4.5),
                fontSize: RFPercentage(1),
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderWidth: 0.5,
                borderColor: 'purple',
                borderRadius: 8,
                color: 'black',
                paddingRight: 30, // to ensure the text is never behind the icon
              },
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 2,
              },
            }}
            value={selected.fav}
            useNativeAndroidPickerStyle={false}
            textInputProps={{ underlineColor: 'yellow' }}
            Icon={() => {
              return <Ionicons name="caret-down" size={18} color="black" />;
            }}
          />
        </View>
      </View>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  dropdown_area: {
    width: 'auto',
    marginTop: 0,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});
  
export default PickerSelect;