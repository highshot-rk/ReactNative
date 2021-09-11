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

import styles from '../../../common/BaseStyles';
import StatsViewerStyles from '../StatsViewerStyles';

class ASPTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialText: [
        {text: styles.rowText},
        {text: styles.rowText_Sub},
      ],
      // 最終的には前画面で選択された試合情報からタイトルを取得する
      title: '2021/8/17 インターカレッジ 1回戦',
      tableHead_5: [['', 'Shooting', 'Offensive Characteristics']],
      tableHead_6: [['No', 'Player', 'S', '3P%', '2P%', 'ITP%', 'Mid%', 'eFG%', 'TS%', 'FT%', 'USG', 'FT/FG', 'ITP/FG', 'Mid/FG', '3P/FG', 'Ast%', 'TO%']],
      user_id: '',
      team: '',
    }
  }
    
  componentDidMount() {
    // 画面遷移パラメーター
    const { navigation } = this.props;
    // this.focusListener = navigation.addListener("didFocus", (payload) => {
    //   // Alert.alert(payload.state.params.team)
    //   this.state.team = payload.state.params.team
    // });
  }

  render(){
    const w = Dimensions.get('window').width*0.795;
    const flexArr_5 = [w*0.1764, w*0.4118, w*0.4118];
    const flexArr_6 = [w*0.0428, w*0.0728, w*0.0408, w*0.0588, w*0.0588, w*0.0588, w*0.0588, w*0.0588, w*0.0588, w*0.0588, w*0.0588, w*0.0588, w*0.0688, w*0.0688, w*0.0588, w*0.0588, w*0.0588];
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
                      this.state.tableHead_5.map((rowData, index) => (
                        <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                width={flexArr_5[cellIndex]}
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
                      this.state.tableHead_6.map((rowData, index) => (
                        <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                width={flexArr_6[cellIndex]}
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
                        this.props.screenProps.params.advancedStatsPlayer.map((rowData, index) => (
                          <TableWrapper
                          key={index}
                          style={[
                            {flexDirection: 'row'},
                            styles.tableRow,
                            ]}
                          >
                            {
                              rowData.map((cellData, cellIndex) => (
                                <Cell
                                  width={flexArr_6[cellIndex]}
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

export default ASPTab;
