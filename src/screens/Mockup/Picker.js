/*--------------------------------------------------------------------------
 * インポート
 *------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { View, Button,　SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/*--------------------------------------------------------------------------
 * グローバル変数
 *------------------------------------------------------------------------*/
class Picker extends Component {
/*--------------------------------------------------------------------------
 * コンストラクタ
 *------------------------------------------------------------------------*/
  constructor(props) {
    super(props)
    this.state = {

      show: false,
      date: new Date(1598051730000),
      mode: 'date',
  
    }
  }
/*--------------------------------------------------------------------------
 * コンポーネントメソッド
 *------------------------------------------------------------------------*/
  // コンポーネントがマウント(配置)される前にに呼び出されるメソッド
  componentDidMount = async(event) => {
  }
/*--------------------------------------------------------------------------
 * イベント
 *------------------------------------------------------------------------*/
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({ show: true });
    this.setState({ date: currentDate });
  };

  showMode = (currentMode) => {
    this.setState({ show: true });
    this.setState({ mode: currentMode });
  };

  showDatepicker() {
    this.showMode('date');
  };

  showTimepicker() {
    this.showMode('time');
  };

/*--------------------------------------------------------------------------
 * レンダー
 *------------------------------------------------------------------------*/
  render() {
  
    return (

      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        <View
          style={{
            flex: 1,
          }}
          >
          <Button onPress={() => this.showDatepicker()} title="Show date picker!" />
        </View>
        <View
          style={{
            flex: 1,
          }}
          >
        
          <Button onPress={() => this.showTimepicker()} title="Show time picker!" />
        </View>
        {this.state.show && (
          <DateTimePicker
            style={{
              flex: 1,
            }}
            testID="dateTimePicker"
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={() => this.onChange()}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default Picker;