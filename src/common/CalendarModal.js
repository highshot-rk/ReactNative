import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// カレンダーピッカー
import CalendarPicker from 'react-native-calendar-picker';
// ローカルインポート
import styles from './CommonStyles';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0, 
      height: 0,
      selectedStartDate: null,
      isModalVisible: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  toggleModal = () => {
    this.setState({ 
      isModalVisible: !this.state.isModalVisible,
      selectedStartDate: this.state.selectedStartDate,
    });
  }

   _onLayout(event) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    });
  };

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }
  render() {
    const { selectedStartDate } = this.state;
    const { text } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.format("YYYY/MM/DD").toString() : '';
    return (
      <View style={CalendarStyles.container}>
        <CalendarPicker
          scaleFactor={375}
          width={wp(40)}
          selectedDayColor='lightgreen'
          onDateChange={this.onDateChange}
        />

        <Text>SELECTED DATE:{ startDate }</Text>

      <TouchableOpacity
        style={[styles.button_md, styles.formElement, styles.buttonColor_silver]}
        onPress={this.props.nav.toggleModal}>
          
        <Text style={[styles.buttonText_black]}>Close</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

const CalendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    top: hp(10),
    width: wp(45),
    height: hp(55),
    position:'absolute',
  },
});

export default Calendar;