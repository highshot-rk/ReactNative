import { StyleSheet,Dimensions } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
import { alignItems } from 'styled-system';

const win = Dimensions.get('window');

export default StyleSheet.create({
    row_card: {
        flexDirection: 'row',
        // marginLeft: win.width*0.03,
        // marginRight: win.width*0.03,
        alignItems:'center',
        width: win.width * 0.25,
        // height:win.height * 0.1,
        // borderBottomColor: '#ffffff',
        // borderBottomWidth: 0.5,
        justifyContent:'center'
    },
    row_edit: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 10,
        // width: win.width * 0.2,
        // height:win.height * 0.1,
        justifyContent:'center'
    },
    // ボタン大 非活性
    button_lg_sk: {
        width: 150,
        height: 60,
        marginTop: win.height*0.03,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ffffff'
        // backgroundColor:'Transparent'
    },
    gameinfo: {
        height:win.height * 0.1
    },
    gameinfo_text: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.8),
        width: wp(16),
        justifyContent:'center',
        alignItems:'flex-start',
    },
    image: {
        width: win.width*0.07,
        height: win.height*0.07
    },
    input: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(2),
        height: hp(4.5),
        width: win.width*0.35,
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#777777',
    },
      // 入力フォーム小
      input_sm: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(2),
        width: win.width*0.23,
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
      },
      headerText: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        fontSize: RFPercentage(3),
        alignSelf: 'center',
      },
      labelText: {
        fontSize: RFPercentage(1.8),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent:'center'
    },
    modal: {
        top: win.height * 0.01,
        bottom: win.height * 0.01,
        left: win.width * 0.01,
        right: win.width * 0.01,
        position:'absolute'
    },
    base: {
        // width: 'auto',
        // backgroundColor:s '#f0f6da',
        borderColor:'#ffffff',
        // borderRightWidth: 0.5,
        // borderLeftWidth: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    info_area: {
        height: '6%',
    },
    button_area: {
        height: '7%',
        paddingTop: 10,
        paddingBottom: 5,
    },
    other_button_area: {
        marginLeft: 0,
        marginRight: 0,
    },
    table_area: {
        height: '95%',
        justifyContent: 'center',
        // paddingTop: '3%',
        // paddingBottom: '3%',
        // borderColor:'#ffffff',
        // borderBottomWidth: 0.5,
    },
    table_area_inner: {
        width: '100%',
    },
    button_edit: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(2),
        height: hp(4.5),
        width: win.width*0.1,
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        marginBottom: 10,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#777777',
    },
    labelText_custom: {
        fontSize: RFPercentage(1.4),
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText_custom: {
        fontSize: RFPercentage(1.2),
    },
    tableHead_custom: {
        borderTopWidth: 0.5,
        backgroundColor: 'rgba(0,0,0,0)rgba(0,0,0,0)',
        borderBottomWidth: 0.5,
        borderColor:'#ffffff',
        textAlign: 'center',
    },
    tableHeadText_custom: {
        fontSize: RFPercentage(1.5),
        color:'#ffffff',
        textAlign: 'center',
    },
    tableText_custom: {
        fontSize: RFPercentage(1.5),
        color: '#ffffff',
        textAlign: 'center',
    },
    tableRow_custom: {
        // borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        // borderLeftWidth: 0.5,
        // borderRightWidth: 0.5,
        borderColor:'#ffffff',
        height:40
    },

    labelText_modal: {
        fontSize: RFPercentage(1.8),
        width: wp(10),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    labelText_modal_term: {
        fontSize: RFPercentage(1.8),
        width: wp(3),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    dropdown_period: {
        width: wp(6),
    },
    dropdown_datetime: {
        width: wp(6),
    },
    dropdown_team: {
        width: wp(24),
    },
    dropdown_event: {
        width: wp(30),
    },
    dropdown_ft: {
        width: wp(9.5),
    },
    dropdown_text_custom: {
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
    },
    dropdown_dropdown_period: {
        width: wp(6),
    },
    dropdown_dropdown_datetime: {
        width: wp(6),
    },
    dropdown_dropdown_team: {
        width: wp(24),
    },
    dropdown_dropdown_event: {
        width: wp(30),
    },
    dropdown_dropdown_ft: {
        width: wp(9.5),
    },
    defaultTextStyle_custom: {
        color: '#000000',
    },
    // 編集モーダル
    edit_modal: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        top: hp(5),
        bottom: hp(5),
        left: wp(5),
        right: wp(5),
        position:'absolute',
    },
    edit_modal_inner: {
        alignItems: 'center',
    },
});