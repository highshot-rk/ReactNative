import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    login_title: {
        color: '#000000',
        fontSize: RFPercentage(3),
        fontWeight: 'bold',
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
    // モーダル
    login_modal: {
        // backgroundColor: 'rgba(245,245,245,0.8)',
        backgroundColor: 'whitesmoke',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        top: hp(15),
        bottom: hp(35),
        left: wp(15),
        right: wp(15),
        position:'absolute',
    }, 
    login_modal_inner: {
        alignItems: 'center',
    }, 
});