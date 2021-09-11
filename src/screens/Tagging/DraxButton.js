import React, {Component,useState,useEffect} from "react";
import {Text, View, Animated} from "react-native";
import {Badge} from "react-native-elements";

import {LinearGradient} from 'expo-linear-gradient';
import {wp,hp} from './SubScreen';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import LiveTaggingStyles from "./LiveTaggingStyles";
import {DraxView} from "react-native-drax";
import {DropZone} from "react-native-drag-drop-and-swap";

//Drag helper
export default class DraxButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      color: ['#b7b7bb', '#9fa1a3', '#9fa1a3', '#000080', '#27277a', '#27277a', '#ffffff', '#dbdfe2', '#dbdfe2'],
      borderColor: ['#FFFFFF', '#9fa1a3', '#F08000'],
      outlineColor: '#E66F6F',
      opacity: new Animated.Value(1),
      dir: true,
    };
  }

  render() {
    const item = this.props.rowData;
    let color = this.state.color[3 * this.props.type + 1]
    let color2 = this.state.color[3 * this.props.type]
    if (this.props.color) {
      color = this.props.color
      let r = parseInt(parseInt(color.substring(1, 3), 16) * 0.9)
      let g = parseInt(parseInt(color.substring(3, 5), 16) * 0.9)
      let b = parseInt(parseInt(color.substring(5, 7), 16) * 0.9)
      color2 = 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    let fadeInAndOut = Animated.sequence([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    if (this.props.selected) {
      Animated.loop(fadeInAndOut).start();
    }else{
      this.state.opacity.setValue(1)
      this.state.opacity.stopAnimation()
    }
    if (this.props.nodrag) {
      return (
        <Animated.View                 // Special animatable View
          style={{
            ...this.props.style,
            opacity: this.state.opacity,         // Bind opacity to animated value
          }}
        >
          <LinearGradient
            locations={[0.49, 0.5, 1]}
            colors={[color2, color, color]}
            style={{
              width: wp(6),
              height: hp(5),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              borderColor: this.props.selected?'#E66EE6':'#fff',
              borderWidth: 1,
              shadowColor: "black",
              shadowOffset: {width: 0, height: 20},
              shadowOpacity: 0.5,
              shadowRadius: 20,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 11,
                alignItems: "center",
                justifyContent: "center",
                fontWeight: (this.props.selected)?"bold":"normal",
                textShadowOffset: {
                  width: 0,
                  height: 0
                },
                textShadowColor: '#000',
                textShadowRadius: 4
              }}
            >
              {item.number}
            </Text>
            {
              (item.foul_count > 0 ?
                <Badge value={item.foul_count.toString()} status="error"
                       containerStyle={{position: 'absolute', top: -4, right: -4}}/> : null)
            }
          </LinearGradient>
        </Animated.View>
      );
    }
    return (
      <DraxView
        draggingStyle={LiveTaggingStyles.dragging}
        dragReleasedStyle={LiveTaggingStyles.dragging}
        hoverDraggingStyle={LiveTaggingStyles.hoverDragging}
        dragPayload={{...item,team:this.props.team}}
        longPressDelay={150}

        style={[LiveTaggingStyles.dragDropButton,this.props.style,{borderColor:color}]}
        receivingStyle={LiveTaggingStyles.receiveButton}
        renderContent={({ viewState }) => {
          const receivingDrag = viewState && viewState.receivingDrag;
          const payload = receivingDrag && receivingDrag.payload;

          return (
            <Animated.View                 // Special animatable View
              style={{
                ...this.props.style,
                opacity: this.state.opacity,         // Bind opacity to animated value
              }}
            >
              <LinearGradient
                locations={[0.49, 0.5, 1]}
                colors={[color2, color, color]}
                style={{
                  width: wp(6),
                  height: hp(5),
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  borderColor: this.props.selected?'#E66EE6':'#fff',
                  borderWidth: 1,
                  shadowColor: "black",
                  shadowOffset: {width: 0, height: 20},
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 11,
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: (this.props.selected)?"bold":"normal",
                    textShadowOffset: {
                      width: 0,
                      height: 0
                    },
                    textShadowColor: '#000',
                    textShadowRadius: 4
                  }}
                >
                  {item.number}
                </Text>
                {
                  (item.foul_count > 0 ?
                    <Badge value={item.foul_count.toString()} status="error"
                           containerStyle={{position: 'absolute', top: -4, right: -4}}/> : null)
                }
              </LinearGradient>
            </Animated.View>
          );
        }}
        onReceiveDragDrop={(e) => this.props.onReceiveDragDrop(e,item,this.props.team)}
      />
    );
  }
}
