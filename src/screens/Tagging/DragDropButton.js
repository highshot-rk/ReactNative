import React, {Component} from "react";
import {Text, View, Animated} from "react-native";
import {Badge} from "react-native-elements";
import {Draggable, DropZone} from "react-native-drag-drop-and-swap";
import {LinearGradient} from 'expo-linear-gradient';
import {wp,hp} from './SubScreen';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

class DragInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: ['#b7b7bb', '#9fa1a3', '#9fa1a3', '#000080', '#27277a', '#27277a', '#ffffff', '#dbdfe2', '#dbdfe2'],
      borderColor: ['#FFFFFF', '#9fa1a3', '#F08000'],
      outlineColor: '#E66F6F',
      opacity: new Animated.Value(1),
      dir: true,
      blink: this.props.blink
    };
    this.doBlink = this.doBlink.bind(this)
  }

  doBlink() {

    if (this.props.blink) {
      if (!this.state.dir) {
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start(({finished}) => {
          this.setState({dir: !this.state.dir})
        });

      } else {
        Animated.timing(this.state.opacity, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true
        }).start(({finished}) => {
          this.setState({dir: !this.state.dir})
        });

      }
    } else {
      if(this.state.opacity!=new Animated.Value(1)){
        this.setState({opacity: new Animated.Value(1)})
      }
    }
  }

  componentDidMount() {
  

    this.interval = setInterval(this.doBlink, 500)
    
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval)
  }

  render() {
    let color = this.state.color[3 * this.props.type + 1]
    let color2 = this.state.color[3 * this.props.type]
    if (this.props.color) {
      color = this.props.color
      let r = parseInt(parseInt(color.substring(1, 3), 16) * 0.9)
      let g = parseInt(parseInt(color.substring(3, 5), 16) * 0.9)
      let b = parseInt(parseInt(color.substring(5, 7), 16) * 0.9)
      color2 = 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    if (this.props.dragOver && !this.props.dragging) {

      return (
        <LinearGradient
          locations={[0.49, 0.5, 1]}
          colors={[color2, color, color]}
          style={{
            width: wp(5),
            height: hp(4),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            borderWidth: 5,
            borderColor: this.state.borderColor[this.props.type],
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: "bold",
              textShadowOffset: {
                width: 0,
                height: 0
              },
              textShadowColor: '#000',
              textShadowRadius: 4
            }}
          >
            {" "}
            {this.props.rowData.number}{" "}
          </Text>
          {this.props.type != 0 &&
          (this.props.rowData.foul_count > 0 ?
            <Badge value={this.props.rowData.foul_count.toString()} status="error"
                   containerStyle={{position: 'absolute', top: -4, right: -4}}/> : null)
          }
        </LinearGradient>
      );
    }
    let shadows = {
      shadowColor: "black",
      shadowOffset: {width: 0, height: 20},
      shadowOpacity: 0.5,
      shadowRadius: 20,
    };
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
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={[
            {
              width: wp(6),
              height: hp(4),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              // borderColor: this.props.blink?'#E66EE6':null,
              // borderWidth: this.props.blink? 5:0,
            },
            this.props.dragging ? shadows : null
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: 'center',
              color: '#fff',
              textShadowOffset: {
                width: 0,
                height: 0
              },
              textShadowColor: '#000',
              textShadowRadius: 4
            }}
          >
            {" "}
            {this.props.rowData.number}{" "}
          </Text>
          {this.props.type != 0 &&
          (this.props.rowData.foul_count > 0 ?
            <Badge badgeStyle={{width: 20, height: 21, borderRadius: 30}} textStyle={{fontSize: 18}}
                   value={this.props.rowData.foul_count.toString()} status="error"
                   containerStyle={{position: 'absolute', top: -0, right: 0}}/> : null)
          }
        </LinearGradient>
      </Animated.View>
    );
  }
}

//Drag helper
export default class DragDropButton extends React.Component {

  render() {
    if (this.props.nodrag) {
      return (
        <Draggable style={[this.props.style, {marginBottom: 5}]}
                   onPress={this.props.onPress}>
          <DragInner
            color={this.props.color}
            rowData={this.props.rowData}
            index={this.props.index}
            type={this.props.type}
            blink={this.props.blink}
          />
        </Draggable>
      );
    }
    return (
      // dragOn={"onPressIn"}
      <Draggable dragOn={"onPressIn"} data={this.props.rowData} style={[this.props.style, {marginBottom: 5}]}

                 onPress={this.props.onPress}>
        <DropZone
          onDrop={e => this.props.onDrop(e, this.props.index, this.props.type)}
          onEnter={e =>
            this.props.onHover(this.props.rowData, this.props.type)
          }
        >
          <DragInner
            color={this.props.color}
            rowData={this.props.rowData}
            index={this.props.index}
            type={this.props.type}
            blink={this.props.blink}
          />
        </DropZone>
      </Draggable>
    );
  }
}
