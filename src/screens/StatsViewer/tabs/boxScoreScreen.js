import React from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
  Button
} from 'react-native';
// テーブル表示
import { Table, TableWrapper, Row, Rows, Cell } from 'react-native-table-component';
// Awesomeアイコン
import Icon from 'react-native-vector-icons/FontAwesome5';
// 音声機能
import * as Speech from 'expo-speech';

import styles from '../../../common/BaseStyles';
import StatsViewerStyles from '../StatsViewerStyles';

class BoxScoreTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialText: [
        {text: styles.rowText},
        {text: styles.rowText_Sub},
      ],
      // 最終的には前画面で選択された試合情報からタイトルを取得する
      title: '2021/8/17 インターカレッジ 1回戦',
      tableHead_1: [['', '3P', '2P', 'ITP', 'Mid', 'FT', 'REB', 'OTHER']],
      tableHead_2: [['', '', 'S', 'PTS', 'M', 'A', 'M', 'A', 'M', 'A', 'M', 'A', 'M', 'A', 'F', 'DR', 'OR', 'TOT', 'AS', 'ST', 'BS', 'TO', 'MIN']],
      boxscoreTeamStats: [
        ['', 'Team', '', 56, 6, 19, 15, 38, 12, 31, 3, 7, 8, 13, 16, 8, 17, 25, 7, 11, 5, 19, '200:00'],
        ['#1', 'Player1', '', 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, '6:10'],
        ['#2', 'Player2', '●', 0, 0, 0, 0, 3, 0, 2, 0, 1, 0, 0, 2, 0, 0, 0, 2, 1, 0, 2, '21:23'],
        ['#6', 'Player6', '●', 3, 0, 0, 1, 4, 1, 4, 0, 0, 1, 2, 2, 1, 1, 2, 0, 0, 0, 0, '7:15'],
        ['#7', 'Player7', '●', 14, 0, 3, 6, 8, 4, 6, 2, 2, 2, 4, 1, 1, 4, 5, 0, 3, 1, 2, '2:47'],
        ['#10', 'Player10', '●', 15, 5, 7, 0, 2, 0, 2, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, '20:53'],
        ['#15', 'Player15', '', 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 1, 2, '14:06'],
        ['#17', 'Player17', '', 8, 0, 1, 3, 9, 2, 7, 1, 2, 2, 2, 4, 1, 0, 1, 1, 1, 0, 0, '17:05'],
        ['#20', 'Player20', '', 6, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 4, 5, 0, 3, 0, 2, '7:15'],
        ['#34', 'Player34', '', 3, 0, 2, 1, 3, 1, 3, 0, 0, 1, 2, 1, 2, 1, 3, 2, 1, 0, 3, '20:39'],
        ['#36', 'Player36', '●', 7, 1, 4, 1, 4, 1, 3, 0, 1, 2, 2, 2, 2, 4, 6, 2, 1, 3, 8, '10:27']
      ],
      // [scoreStyles, setScoreState]: React.useState(initialText);
      initialState: [
        {button: styles.button_rp, text: styles.buttonText_black},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
      ],
      user_id: '',
      team: '',
      buttonStyles: [
        {button: styles.button_rp, text: styles.buttonText_black},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
        {button: styles.button_rp_sk, text: styles.buttonText},
      ],
      speechList: [
        '6番が得点しました。',
        '12番が3連続で得点しています。',
        '21番のシュート成功率が50%を超えました。',
      ],
      count: 0,
    }
  }

  speak = (num, speekerNum, rate, pitch) => {
    // const speechList = [
    //   'こんにちは',
    //   'ボイスアシスタンスを起動します。',
    // ]
    const speekers = [
      'com.apple.ttsbundle.Kyoko-compact',
      'com.apple.ttsbundle.Otoya-premium'
    ]
    const thingToSay = '6番比江島選手のThreeポイント成功率が40%を超えました。';
    // Speech.speak(thingToSay);
  
    // Speech.speak(speechList[num], {language: lang, rate: rate, pitch: pitch, name: Hattori});
    Speech.stop();
    // Speech.speak(speechList[num], {language: lang, rate: rate, pitch: pitch, identifier: "com.apple.ttsbundle.Otoya-compact",});
    Speech.speak(this.state.speechList[this.state.count], {language: speekerNum, rate: rate, pitch: pitch});
    if(this.state.count < 2){
      this.setState({
        count: this.state.count + num
      })  
    }else {
      this.setState({
        count: 0
      })  
    }
  };
  
  stop = () => {
    Speech.stop();
  };

  //現状使い所なし
  componentDidUpdate(prevProps, prevState) {
    const screenProps = this.props.screenProps.params;
    // console.log(screenProps)
    // console.log(prevProps)
    // this.filterScore(screenProps.period, screenProps.team)
    // this.updateScoreTab(screenProps.team)
    // 親から取得した値（screenProps）を用いて子のstateに対してsetStateを使うと無限レンダリングエラー出て死にます
    // https://stackoverflow.com/questions/54388200/componentdidupdate-usage-and-maximum-update-depth-exceeded
  }

  componentDidMount() {
    // 画面遷移パラメーター
    const { navigation, screenProps } = this.props;
    console.log('screenProps initial')
    // console.log(screenProps)
    // this.focusListener = navigation.addListener("didFocus", (payload) => {
    //   // Alert.alert(payload.state.params.team)
    //   this.state.team = payload.state.params.team
    // });
  }

  render(){
    const w = Dimensions.get('window').width*0.795;
    const flexArr_1 = [w*0.24, w*0.08, w*0.08, w*0.08, w*0.08, w*0.12, w*0.08, w*0.24];
    const flexArr_2 = [w*0.04, w*0.10, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.04, w*0.044, w*0.04, w*0.04, w*0.04, w*0.04, w*0.06];
    return(
      <View style={{flex: 1}}>
        <View style={{flex:1}}>
          {/* スコアボードコンポーネント */}
          <View style={{flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            {/* ボックススコアチームスタッツ */}
            <View style={[styles.row, StatsViewerStyles.base, StatsViewerStyles.teamstats_table_area]}>
              <View style={[styles.column, StatsViewerStyles.table_area_inner]}>
                <View style={{height: 1, backgroundColor: '#ffffff'}} />
                <View style={{height:'20%'}}>
                  {/* テーブルヘッダー */}
                  <Table>
                    {
                      this.state.tableHead_1.map((rowData, index) => (
                        <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                width={flexArr_1[cellIndex]}
                                style={[]}
                                key={cellIndex}
                                data={cellData}
                                textStyle={[styles.tableHeadText_sm]}
                              />
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                  <Table>
                    {
                      this.state.tableHead_2.map((rowData, index) => (
                        <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                width={flexArr_2[cellIndex]}
                                style={[]}
                                key={cellIndex}
                                data={cellData}
                                textStyle={[styles.tableHeadText_sm]}
                              />
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </View>
                <View style={{height: 1, backgroundColor: '#ffffff'}} />
                <View style={{height:'80%'}}>
                  {/* テーブルデータ */}
                  <ScrollView>
                    <Table>
                      {
                        // this.state.boxscoreTeamStats.map((rowData, index) => (
                        this.props.screenProps.params.boxScore.map((rowData, index) => (
                          <Row
                            key={index}
                            data={rowData}
                            widthArr={flexArr_2}
                            // onPress={() => this._onSelectedRow(rowData, index)}
                            flexArr={this.state.flexArr}
                            style={[
                              styles.tableRow,
                              {backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0.5, borderBottomColor: '#ffffff'},
                            ]}
                            textStyle={[styles.tableHeadText_sm]}
                          />
                        ))
                      }
                    </Table>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )  
  }
};

export default BoxScoreTab;
