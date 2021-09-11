import { CognitoUserPool } from 'amazon-cognito-identity-js';
import React from 'react';
import { Alert } from 'react-native';
import { View, ImageBackground,StyleSheet, Text, Image, Button, Dimensions} from 'react-native';
// テーブル表示
import { Table, TableWrapper, Row, Rows, Cell } from 'react-native-table-component';

import styles from '../../../common/BaseStyles';


class ScoreTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialText: [
        {text: styles.rowText},
        {text: styles.rowText_Sub},
      ],
      // 最終的には前画面で選択された試合情報からタイトルを取得する
      // title: '2021/8/17 インターカレッジ 1回戦',
      // [scoreStyles, setScoreState]: React.useState(initialText);
      team: '',
      tableHeader: [['', '', 'Q1', 'Q2', 'Q3', 'Q4', 'OT', 'Total', 'Foul', 'TO']],
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    const screenProps = this.props.screenProps;
  }

  componentDidMount() {
    // 画面遷移パラメーター
    const { navigation } = this.props;
    // this.focusListener = navigation.addListener("didFocus", (payload) => {
    //   // Alert.alert(payload.state.params.team)
    // });
  }

  render(){
    const w = Dimensions.get('window').width*0.795;
    const h = Dimensions.get('window').height*0.1;
    const flexArr_1 = [w*0.08, w*0.12, w*0.1, w*0.1, w*0.1, w*0.1, w*0.1, w*0.1, w*0.1, w*0.1];
    const elementImageHome = (data, index, cellIndex) => (
      <Image
        style={{height: 30, resizeMode: 'contain', marginLeft: -100}}
        source={require('../../../../assets/resources/aogaku_logo.png')}
      />
    );
    const elementImageVisitor = (data, index, cellIndex) => (
      <Image
        style={{height: 30, resizeMode: 'contain', marginLeft: -220}}
        source={require('../../../../assets/resources/waseda_logo.png')}
      />
    );
    return(
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View style={{flex:3}}>
          {/* スコアボードコンポーネント */}
          <View style={{height: 1, backgroundColor: '#ffffff'}} />
          <Table>
            {
              this.state.tableHeader.map((rowData, index) => (
                <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                  {
                    rowData.map((cellData, cellIndex) => (
                      <Cell
                        width={flexArr_1[cellIndex]}
                        height={80}
                        style={[]}
                        key={cellIndex}
                        data={cellData}
                        textStyle={[styles.tableHeadText_lg]}
                      />
                    ))
                  }
                </TableWrapper>
              ))
            }
          </Table>
          <View style={{height: 1, backgroundColor: '#ffffff'}} />
          <Table>
            {
              this.props.screenProps.params.tableScore.map((rowData, index) => (
                <TableWrapper key={index} style={[{flexDirection: 'row'}]}>
                  {
                    rowData.map((cellData, cellIndex) => (
                      <Cell
                        width={flexArr_1[cellIndex]}
                        height={80}
                        style={[]}
                        key={cellIndex}
                        // data={cellData}
                        data={(cellIndex === 0) ? (index ===0 ? elementImageHome(cellData, index, cellIndex): elementImageVisitor(cellData, index, cellIndex)) : cellData}
                        textStyle={[styles.tableHeadText_lg]}
                      />
                    ))
                  }
                </TableWrapper>
              ))
            }
          </Table>
          <View style={{height: 1, backgroundColor: '#ffffff'}} />
        </View>
        <View style={{flex:3}}></View>
      </View>
    )
  }
};

export default ScoreTab;