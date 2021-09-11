import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    contents_a: {
        height: '6%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderTopWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_b: {
        width: 'auto',
        height: '13%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_c: {
        alignItems: 'flex-start',
    },
    contents_d: {
        width: 'auto',
        backgroundColor: '#f0f6da',
    },
    contents_e: {
        paddingLeft: 5,
        paddingRight: 5,
        height: '73%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_f: {
        paddingLeft: 5,
        paddingRight: 5,
        height: '6%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderBottomWidth: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    labelText_custom: {
        fontSize: RFPercentage(1.8),
        width: wp(16),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    input_custom: {
        fontSize: RFPercentage(1.8),
        width: wp(6),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText_custom: {
        fontSize: RFPercentage(1.8),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    dropdown_custom: {
        width: wp(25.9),
        marginLeft: 10,
        // padding: 0,
    },
    dropdown_dropdown_custom: {
        width: wp(25.9),
    },
});