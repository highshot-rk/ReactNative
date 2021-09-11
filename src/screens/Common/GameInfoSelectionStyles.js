import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    contents_a: {
        height: '7%',
        backgroundColor: '#000000',
        borderColor:'gray',
        borderTopWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_b: {
        height: '3%',
        backgroundColor: '#000000',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_c: {
        height: '6%',
        backgroundColor: '#000000',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_d: {
        height: '80%',
        backgroundColor: '#000000',
        // borderColor:'gray',
        // borderRightWidth: 0.5,
        // borderLeftWidth: 0.5,
        // borderBottomWidth: 0.5,
    },
    button_custom: {
        width: wp(12),
        height: hp(4.5),
    },
    icon_custom: {
        height: hp(4.5),
        justifyContent: 'flex-end',
    },
    gridView: {
        marginTop: 0,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        // marginLeft: 'auto',
        // marginRight: 'auto',
        // marginBottom: 'auto',
    },
    gridItem: {
        justifyContent: 'center',
        // backgroundColor: '#a3d6cc',
        backgroundColor: 'whitesmoke',
        // borderRadius: 10,
        padding: 0,
        // height: hp(15),
        // borderRadius: 5,
        // borderWidth: 0.5,
    },
    gridItem_contents: {
        color: '#001e43',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    gridItem_buttons: {
        width: wp(10.5),
    },
    gridItem_titles: {
        fontSize: RFPercentage(1.8),
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    gridItem_items: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.5),
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    labelText_custom: {
        width: wp(14),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 0,
        paddingBottom: 0,
    },
    dropdown_custom: {
        width: wp(14),
        marginLeft: 5,
        marginRight: 5,
        padding: 0,
    },
    dropdown_text_custom: {
        fontSize: RFPercentage(1.2),
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    dropdown_dropdown_custom: {
        width: wp(14),
        // height: hp(20),
    },
    dropdown_row_text_custom: {
        fontSize: RFPercentage(1.2),
    },
    defaultTextStyle_custom: {
        color: '#000000',
    },
});