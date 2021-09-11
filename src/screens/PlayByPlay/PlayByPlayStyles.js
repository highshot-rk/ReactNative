import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    base: {
        width: 'auto',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    info_area: {
        height: '6%',
    },
    score_area: {
        height: '11.3%',
    },
    score_area_inner: {
        width: '98.9%',
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
        height: '73.6%',
        justifyContent: 'center',
    },
    table_area_inner: {
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
    },

    labelText_custom: {
        fontSize: RFPercentage(1.2),
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText_custom: {
        fontSize: RFPercentage(1.2),
    },
    tableHead_custom: {
        backgroundColor: '#006a6c',
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    tableHeadText_custom: {
        fontSize: RFPercentage(1.0),
    },
    tableText_custom: {
        fontSize: RFPercentage(1.0),
        textAlign: 'center',
    },
    tableRow_custom: {
        borderTopWidth: 0,
        borderBottomWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
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
        backgroundColor: 'lavender',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        top: hp(17),
        bottom: hp(17),
        left: wp(10),
        right: wp(10),
        position:'absolute',
    }, 
    edit_modal_inner: {
        alignItems: 'center',
    }, 
});