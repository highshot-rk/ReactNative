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

class ASTTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialText: [
        {text: styles.rowText},
        {text: styles.rowText_Sub},
      ],
      // 最終的には前画面で選択された試合情報からタイトルを取得する
      title: '2021/8/17 インターカレッジ 1回戦',
      tableHead_3: [['Poss', 'Team Evaluation', 'Points Off', 'Shooting']],
      tableHead_4: [['', 'Off Eff', 'Def Eff', 'Steal', 'Steal%', 'OR', 'OR%', '3P%', '2P%', 'ITP%', 'Mid%', 'eFG%', 'TS%', 'FT%']],
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
    const flexArr_3 = [w*0.0725, w*0.145, w*0.29, w*0.5075];
    const flexArr_4 = [w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725, w*0.0725];
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
                      this.state.tableHead_3.map((rowData, index) => (
                        <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                width={flexArr_3[cellIndex]}
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
                      this.state.tableHead_4.map((rowData, index) => (
                        <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell
                                width={flexArr_4[cellIndex]}
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
                        this.props.screenProps.params.advancedStatsTeam.map((rowData, index) => (
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
                                  width={flexArr_4[cellIndex]}
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

export default ASTTab;
