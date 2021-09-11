import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    // コンテナ
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    // フォーム
    formElement: {
        borderWidth: StyleSheet.hairlineWidth,
        borderWidth: 3,
        borderRadius: 50,
        borderColor: 'white',
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ボタン
    drawer_button_active: {
        width: wp(20),
        height: hp(8),
        // backgroundColor: 'yellowgreen',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        // shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    drawer_button_inactive: {
        width: wp(20),
        height: hp(8),
        // backgroundColor: 'rgba(0,0,0,0.1)',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        // shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    // ボタンテキスト白
    buttonText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.8),
        color: '#ffffff',
    },
    // 編集モーダル
    modal: {
        backgroundColor: 'lavender',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        top: hp(17),
        bottom: hp(17),
        left: wp(10),
        right: wp(10),
        position:'absolute',
    }, 
    modal_inner: {
        alignItems: 'center',
    }, 
});