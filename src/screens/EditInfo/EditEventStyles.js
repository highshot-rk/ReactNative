import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    edit_btn: {
        width: '50%',
        height: 35,
        backgroundColor: '#006a6c'
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: RFPercentage(1.5),
    },
    contents_a: {
        height: '8%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderTopWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        justifyContent: 'space-between',
    },
    // contents_b: {
    //     height: '10%',
    //     backgroundColor: '#f0f6da',
    //     borderColor:'gray',
    //     borderRightWidth: 0.5,
    //     borderLeftWidth: 0.5,
    // },
    contents_c: {
        height: '88%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderBottomWidth: 0.5,
        padding:5
    },
    button_area: {
        width: '90%',
        height: hp(5.5),
    },
    icon_area: {
        height: hp(5.0),
        justifyContent: 'flex-end',
    },
/*--------------------------------------------------------------------------
 * テーブル
 *------------------------------------------------------------------------*/
    tableHead: {
        height: hp(3.5),
    },
    tableHeadText: {
        fontSize: RFPercentage(1.7),
        textAlign: 'center',
        fontWeight:'bold'
    },
    tableText: {
        textAlign: 'center',
        fontSize: RFPercentage(1.7),
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});