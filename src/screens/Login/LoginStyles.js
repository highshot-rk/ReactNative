import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    login_title: {
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    login_input: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});