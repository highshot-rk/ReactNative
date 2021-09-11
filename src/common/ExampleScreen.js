import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
// モーダルダイアログ
import Modal from "react-native-modal";

// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ColorPicker } from 'react-native-status-color-picker';
// ローカルインポート
import styles from './CommonStyles';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      width: 0,
      height: 0,
      colors: [
        "#ffffff",  // Wtite
        "#000080",  // Navy
        "#ff0000",  // Rea
        "#ffff00",  // Yellow
        "#87ceeb",  // Skyblue
        "#008000",  // Green
  
        // "#F44336", 
        // "#E91E63", 
        // "#9C27B0", 
        // "#673AB7", 
        // "#3F51B5", 
        // "#2196F3", 
        // "#03A9F4", 
        // "#00BCD4", 
        // "#009688", 
        // "#4CAF50", 
        // "#8BC34A", 
        // "#CDDC39", 
        // "#FFEB3B", 
        // "#FFC107", 
        // "#FF9800", 
        // "#FF5722", 
        // "#795548", 
        // "#9E9E9E", 
        // "#607D8B",
      ],
      selectedColor: '#ffffff',
      isColorPickerModalVisible: false,      
    };
  }

  _onLayout(event) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    });
  };

  onSelect = color => this.setState({ selectedColor: color });

  // カレンダーモーダル起動
  toggleColorModal = () => {
    this.setState({ 
      isColorPickerModalVisible: !this.state.isColorPickerModalVisible,
    });
  }
  
  render() {
    return (
      <View
      onLayout={this._onLayout.bind(this)}
      style={[{width: this.state.width, height: this.state.height}, styles.container,]}>

        <TouchableOpacity onPress={this.toggleColorModal}>
          <Icon 
          style={[
            styles.icon, 
            styles.icon_tshirt, 
            {
              color: this.state.selectedColor,
            }
          ]} 
          name='tshirt'/>
        </TouchableOpacity>

        {/* モーダル */}
        <SafeAreaView>
          <Modal
          isVisible={this.state.isColorPickerModalVisible}
          swipeDirection={['up', 'down', 'left', 'right']}
          >
            <View style={styles.color_modal}>
              <View style={[{
                // width: 500,
                // heigth: 200,
                // borderColor: 'gray',
                // borderWidth: 0.5,
              }]}>
                <ColorPicker
                  colors={this.state.colors}
                  selectedColor={this.state.selectedColor}
                  onSelect={this.onSelect}
                />
                </View>
              <TouchableOpacity
                style={[styles.button_md, styles.formElement, styles.buttonColor_silver]}
                  onPress={this.toggleColorModal}>                  
                <Text style={[styles.buttonText_black]}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </SafeAreaView>
        

      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });