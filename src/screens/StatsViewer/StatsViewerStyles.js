import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    base: {
        width: 'auto',
        // backgroundColor: '#000000',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    info_area: {
        height: '6%',
        paddingLeft: 5,
    },
    score_area: {
        height: '11.3%',
        paddingLeft: 5,
        paddingRight: 5,
    },
    score_area_inner: {
        width: '98.9%',
    },
    button_area: {
        height: '7%',
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 5,
    },
    other_button_area: {
        marginLeft: 0,
        marginRight: 0,
    },
    boxscore_title_area: {
        height: '4.8%',
        paddingLeft: 5,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    teamstats_table_area: {
        // height: '0%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    teamstats_advanced_table_area: {
        height: '22%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    boxscore_pleyer_table_area: {
        height: '37.5%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    advanced_pleyer_table_area: {
        height: '37.5%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    table_area_inner: {
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
        backgroundColor: '#7cbb42',
        borderLeftWidth: 0.5,
    },
    scoreTableText_custom: {
        fontSize: RFPercentage(1.2),
    },
    tableHeadText_custom: {
        fontSize: RFPercentage(0.9),
    },
    tableText_custom: {
        fontSize: RFPercentage(0.9),
        textAlign: 'center',
    },
    tableRow_custom: {
        borderTopWidth: 0,
        borderBottomWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },  
    dropdown_custom: {
        width: wp(10),
        marginLeft: 10,
    },
    dropdown_text_custom: {
        fontSize: RFPercentage(1.0),
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    dropdown_dropdown_custom: {
        width: wp(10),
    },
    dropdown_row_text_custom: {
        fontSize: RFPercentage(1.0),
    },
    defaultTextStyle_custom: {
        color: '#000000',
    },
});