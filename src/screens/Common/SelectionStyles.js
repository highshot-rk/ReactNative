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
        height: '6%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    contents_c: {
        height: '68%',
        backgroundColor: '#f0f6da',
        borderColor:'gray',
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderBottomWidth: 0.5,
        alignItems: 'flex-start',
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
    defaultTextStyle_custom: {
        color: '#000000',
    },
});