import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {wp,hp} from './SubScreen';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export default class LiveTaggingButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      color: ['#b7b7bb', '#9fa1a3', '#9fa1a3'
        , '#000080', '#27277a', '#27277a'
        , '#ffffff', '#dbdfe2', '#dbdfe2'
        , '#000', '#000', '#000'
        , '#7c7878', '#5c5a5a', '#5c5a5a'
        , '#d44949', '#d84141', '#d84141'
      ],//type=3 006a6c  49a9d4 419cd8
      textColor: ['#FFFFFF', '#000', '#888', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
    };
  }

  render() {
    let style = [this.props.style, {alignItems: "center"}]
    if(this.props.disabled){
      style = [this.props.style, {alignItems: "center", opacity:0.2}]
    }
    return (
      <TouchableOpacity style={style} disabled={this.props.disabled} onPress={this.props.onPress}>
        <LinearGradient
          locations={[0.49, 0.5, 1]}
          colors={[this.state.color[3 * this.props.type], this.state.color[3 * this.props.type + 1], this.state.color[3 * this.props.type + 2]]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={[
            {
              width: wp(this.props.width ? this.props.width : 8),
              height: hp(this.props.height ? this.props.height : 4),
              margin: 5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              borderColor:'#fff',
              borderWidth:1,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              textAlign: 'center',
              fontFamily: 'Raleway-SemiBold',
              color: this.state.textColor[this.props.type],
            }}
          >
            {" "}{this.props.text}{" "}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}
