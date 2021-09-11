/*--------------------------------------------------------------------------
 * 画面共通のスタイル定義
 *------------------------------------------------------------------------*/
import { StyleSheet } from 'react-native';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
import {
    Input,
    Button,
    IconButton,
    Text,
    VStack,
    Heading,
    Icon,
    Center,
} from "native-base";
import RNPickerSelect from 'react-native-picker-select';

export default StyleSheet.create({
/*--------------------------------------------------------------------------
 * コンテナ
 *------------------------------------------------------------------------*/
    // コンテナ ⇦各ページの最初のViewにのみ使用する
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        // marginTop: 30,
        // marginBottom: 30,
        // marginHorizontal: 30,
        // 最終的にはBackGround Colorは削除
        //  backgroundColor: "#000000"
    },
    // 背景画像
    bgImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    // 改行
    lineBreak: {
        fontSize: RFPercentage(5),
    },
   // 背景ロゴ
   bgLogo: {
    position: 'absolute',
    top: '5%',
    right: '5%',
},
/*--------------------------------------------------------------------------
* メイン フッターメニュー
*------------------------------------------------------------------------*/　
footerContainerStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(8),
    borderTopColor: '#333631',
    borderTopWidth: wp(0.2),
},
footerItemContainerStyle: {
    width: '20%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
},
footerTextStyle: {
    fontSize: RFPercentage(1),
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
},
/*--------------------------------------------------------------------------
 * 行、列
 *------------------------------------------------------------------------*/
    row: {
        flexDirection: 'row',
        // marginLeft: 5,
        // marginRight: 5,
    },
    column: {
        flexDirection: 'column',
        // marginLeft: 5,
        // marginRight: 5,
    },
/*--------------------------------------------------------------------------
 * タブ関連
 *------------------------------------------------------------------------*/
    containerStyle: {
        paddingTop: 30,
        borderBottomWidth: 3,
        borderBottomColor: '#75787b',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#000000',
    },
    tabStyle: {
        flex: 1,
        marginRight: 1,
        marginLeft: 1,
        height: 40,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#53565A',
    },
    selectedTabStyle: {
        backgroundColor: '#75787b',
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: RFPercentage(1.4),
        paddingTop: 14,
        color: '#ffffff',
    },
    selectedTextStyle: {
        color: '#ffffff',
        fontSize: RFPercentage(1.4),
    },

/*--------------------------------------------------------------------------
 * 入力フォーム
 *------------------------------------------------------------------------*/

    input: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        height: hp(4.5),
        width: wp(35),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#777777',
    },
    // 入力フォーム極小
    input_xsm: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(4.5),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
    },
    // 入力フォーム極小 非活性
    input_xsm_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(4.5),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 0.5,
    },
    // 入力フォーム小
    input_sm: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(7),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
    },
    // 入力フォーム小 非活性
    input_sm_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(7),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 0.5,
    },
    // 入力フォーム中
    input_md: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(12.5),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
    },
    // 入力フォーム中 非活性
    input_md_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(12.5),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 0.5,
    },
    // 入力フォーム大
    input_lg: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(12),
        height: hp(6),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
    },
    // 入力フォーム大 非活性
    input_lg_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(12),
        height: hp(6),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 0.5,
    },
    // 入力フォーム極大
    input_xlg: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(10),
        height: hp(9),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
    },
    // 入力フォーム極大 非活性
    input_xlg_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        width: wp(10),
        height: hp(9),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 0.5,
    },
    // 入力フォームレスポンシブ
    input_rp: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderWidth: 0.5,
    },
    // 入力フォームレスポンシブ 非活性
    input_rp_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(2),
        fontSize: RFPercentage(1.5),
        height: hp(4.5),
        margin: 5,
        paddingLeft: 5,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 0.5,
    },


    formElement: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        // marginHorizontal: 20,
        // marginBottom: 10,
        // paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputPHColor: {
        color: "#c0c0c0"
    },
/*--------------------------------------------------------------------------
 * ドロップダウン
 *------------------------------------------------------------------------*/
    cell: {
        flex: 0,
    },
    dropdown: {
        alignSelf: 'flex-start',
        width: wp(40),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウン極小
    dropdown_xsm: {
        alignSelf: 'flex-start',
        width: wp(4.5),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウン極小 非活性
    dropdown_xsm_sk: {
        alignSelf: 'flex-start',
        width: wp(4.5),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
    },
    // ドロップダウン小
    dropdown_sm: {
        alignSelf: 'flex-start',
        width: wp(7),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウン小 非活性
    dropdown_sm_sk: {
        alignSelf: 'flex-start',
        width: wp(7),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
    },
    // ドロップダウン中
    dropdown_md: {
        alignSelf: 'flex-start',
        width: wp(12.5),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウン中 非活性
    dropdown_md_sk: {
        alignSelf: 'flex-start',
        width: wp(12.5),
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
    },
    // ドロップダウン大
    dropdown_lg: {
        alignSelf: 'flex-start',
        width: wp(12),
        height: hp(6),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウン大 非活性
    dropdown_lg_sk: {
        alignSelf: 'flex-start',
        width: wp(12),
        height: hp(6),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
    },
    // ドロップダウン極大
    dropdown_xlg: {
        alignSelf: 'flex-start',
        width: wp(10),
        height: hp(9),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウン極大 非活性
    dropdown_xlg_sk: {
        alignSelf: 'flex-start',
        width: wp(10),
        height: hp(9),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
    },
    // ドロップダウンレスポンシブ
    dropdown_rp: {
        alignSelf: 'flex-start',
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    // ドロップダウンレスポンシブ 非活性
    dropdown_rp_sk: {
        alignSelf: 'flex-start',
        height: hp(4.5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        backgroundColor: '#000000',
        borderColor: '#ffffff',
    },

    dropdown_text: {
        fontFamily: 'Raleway-Regular',
        color: 'black',
        // fontSize: RFPercentage(1.8),
        fontSize: RFPercentage(1.5),
        textAlign: 'left',
        textAlignVertical: 'center',
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
    },
    dropdown_text_sk: {
        fontFamily: 'Raleway-Regular',
        color: '#ffffff',
        // fontSize: RFPercentage(1.8),
        fontSize: RFPercentage(1.5),
        textAlign: 'left',
        textAlignVertical: 'center',
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
    },
    dropdown_dropdown: {
        width: wp(40),
        height: hp(40),
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 3,
    },
    dropdown_row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontFamily: 'Raleway-Regular',
        marginHorizontal: 4,
        fontSize: RFPercentage(1.8),
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
    },
    dropdown_separator: {
        height: 1,
        backgroundColor: 'lemonchiffon',
    },
    defaultTextStyle: {
        color: '#aaaaaa',
    },
/*--------------------------------------------------------------------------
 * サーチバー
 *------------------------------------------------------------------------*/
    searchBarContainer: {
        width: wp(30),
        backgroundColor: '#000000'
    },

    searchBarInput: {
        backgroundColor: '#c0c0c0',
        height: hp(4.5),
        borderRadius: 7,
        backgroundColor: '#75787b',
        borderColor: '#75787b',
        borderWidth: 0.5,
    },

    searchBarInputText: {
        color: '#ffffff',
        fontSize: RFPercentage(1.5),
    },

    searchBarIcon: {
        color: '#ffffff'
    },

/*--------------------------------------------------------------------------
 * ボタン
 *------------------------------------------------------------------------*/
    // 非活性は末尾 "_sk"
    // ボタン極小
    button_xsm: {
        width: wp(4.5),
        height: hp(4.5),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタン極小 非活性
    button_xsm_sk: {
        width: wp(4.5),
        height: hp(4.5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタン小
    button_sm: {
        width: wp(7),
        height: hp(4.5),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタン小 非活性
    button_sm_sk: {
        width: wp(7),
        height: hp(4.5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタン中
    button_md: {
        width: wp(12.5),
        height: hp(4.5),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタン中 非活性
    button_md_sk: {
        width: wp(12.5),
        height: hp(4.5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタン大
    button_lg: {
        width: wp(12),
        height: hp(6),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタン大 非活性
    button_lg_sk: {
        width: wp(12),
        height: hp(6),
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタン特大
    button_xlg: {
        width: wp(10),
        height: hp(9),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // marginTop: 10,
        // marginLeft: 10,
        // marginRight: 10,
        // marginBottom: 10,
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタン特大 非活性
    button_xlg_sk: {
        width: wp(10),
        height: hp(9),
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタンレスポンシブ
    button_rp: {
        height: hp(4.5),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタンレスポンシブ 非活性
    button_rp_sk: {
        height: hp(4.5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        // opacity:0,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタンレスポンシブ
    button_rp_sm: {
        height: hp(3.5),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタンレスポンシブ 非活性
    button_rp_sm_sk: {
        height: hp(3.5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        // opacity:0,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ボタンレスポンシブ
    button_rp_lg: {
        height: hp(6),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタンレスポンシブ 非活性
    button_rp_lg_sk: {
        height: hp(6),
        backgroundColor: 'rgba(0,0,0,0.5)',
        // opacity:0,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        borderWidth: 3,
    },
    // ボタンレスポンシブ
    button_rp_xlg: {
        height: hp(9),
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
        // shadowColor: '#cccccc',
        // shadowOffset: {
        // width: 0,
        // height: 2,
        // },
        // shadowRadius: 0,
        // shadowOpacity: 1,
    },
    // ボタンレスポンシブ 非活性
    button_rp_xlg_sk: {
        height: hp(9),
        backgroundColor: 'rgba(0,0,0,0.5)',
        // opacity:0,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        borderColor: "#ffffff",
    },
    // ログインボタン
    login_button: {
        width: wp(35),
        height: hp(7),
        // backgroundColor: '#7cbb42',
        backgroundColor: 'lightgray',
        borderColor: '#777777',
        shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,

        marginLeft: 'auto',
        marginRight: 'auto',
    },
    // ログインボタンテキスト
    login_buttonText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(2),
        color: '#ffffff',
    },

    // ボタンテキスト白
    buttonText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.5),
        color: '#ffffff',
    },
    // ボタンテキスト黒
    buttonText_black: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.5),
        color: '#000000',
    },
    // ボタン色_シルバー
    buttonColor_silver: {
        backgroundColor: '#c0c0c0',
    },
    // ボタン色_赤
    buttonColor_red: {
        backgroundColor: 'red',
    },
/*--------------------------------------------------------------------------
 * スイッチボタン
 *------------------------------------------------------------------------*/
    switchbutton: {
        margin:5,
        marginTop: 10,
    },

    switchElement: {
        width: 200,
        height: 36.5,
        direction: 'ltr',
        borderRadius: 8,
        // speed: 200,
        borderColor: '#53565A',
        backgroundColor: '#75787b',
        // color: '#ffffff',
        fontSize: RFPercentage(1.2)

    },

/*--------------------------------------------------------------------------
 * ラベル
 *------------------------------------------------------------------------*/
    // タイトルテキスト
    title: {
        fontFamily: 'Raleway-Regular',
        color: '#EEEEEE',
        fontSize: RFPercentage(5),
    },
    // ラベルテキスト白
    tabTitle: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: RFPercentage(1.5),
        color: '#ffffff',
    },
    // ラベルテキスト白
    labelText: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: RFPercentage(1.5),
        color: '#ffffff',
    },
    // ラベルテキスト黒
    labelText_black: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: RFPercentage(1.5),
        color: '#000000',
    },
    // エラーメッセージ
    errorText: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: RFPercentage(1.5),
        width: 'auto',
        color: 'red',
    },
    // ヘッダー
    headerText:{
        fontFamily: 'Raleway-SemiBold',
        fontSize: RFPercentage(3),
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 10
    },
/*--------------------------------------------------------------------------
 * テーブル
 *------------------------------------------------------------------------*/
    tableHead: {
        height: hp(4),
        // backgroundColor: '#7cbb42'
    },
    tableHeadText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.3),
        color: '#FFFFFF',
        margin: 6,
        textAlign: 'center',
    },
    tableText: {
        fontFamily: 'Raleway-Regular',
        margin: 6,
        fontSize: RFPercentage(1.5)
    },
    tableRow: {
        flexDirection: 'row',
        // backgroundColor: '#FFF1C1'
    },
    tableBorderWidth: {
        borderWidth: 0.5
    },
    // テーブル内テキスト小
    tableHeadText_sm: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.1),
        color: '#FFFFFF',
        margin: 6,
        textAlign: 'center',
    },
    tableText_sm: {
        fontFamily: 'Raleway-Regular',
        margin: 6,
        fontSize: RFPercentage(1.1)
    },
    // テーブル内テキスト大
    tableHeadText_lg: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(2),
        color: '#FFFFFF',
        margin: 6,
        textAlign: 'center',
    },
    tableText_lg: {
        fontFamily: 'Raleway-Regular',
        margin: 6,
        fontSize: RFPercentage(2)
    },

    headerText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.8),
        color: '#FFFFFF',
        textAlign: 'center',
        flex:1,
        fontWeight: 'bold'
    },
    rowText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.8),
        color: '#FFFFFF',
        textAlign: 'center',
        flex:1,
        fontWeight: 'bold'
    },

    rowText_Sub: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.8),
        color: '#c0c0c0',
        textAlign: 'center',
        flex:1,
        fontWeight: 'bold'
    },
/*--------------------------------------------------------------------------
 * サムネイル画像
 *------------------------------------------------------------------------*/
    thumbnail: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },

/*--------------------------------------------------------------------------
 * チェックボックス
 *------------------------------------------------------------------------*/
    checkbox: {
      width: wp(4.5),
      height: hp(4.5)
    },

    checkbox_container: {
        backgroundColor: "black",
        borderColor: '#000000',
        width: wp(12),
        height: hp(6),
    },

    checkbox_container_xsm: {
        backgroundColor: "black",
        borderColor: '#ffffff',
        width: wp(1.5),
        height: hp(6),
    },

    checkbox_text: {
        fontFamily: 'Raleway-Regular',
        color:"#ffffff",
        fontSize: RFPercentage(1.5)
    },

/*--------------------------------------------------------------------------
 * 検索ボックス
 *------------------------------------------------------------------------*/
    searchBarContainerStyle: {
        width: wp(20.7),
        height: hp(4.5),
        justifyContent: 'center',
        backgroundColor: '#f0f6da',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 0,
        marginRight: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchBarInputContainerStyle: {
        height: hp(4.5),
        backgroundColor: '#7cbb42',
        borderColor: '#7cbb42',
        borderWidth: 0.5,
        borderRadius: 7,
    },
    searchBarInputStyle: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.2),
        backgroundColor: '#FFFFFF',
        padding: 5,
    },
    searchBarLeftIconContainerStyle: {
        width: wp(2),
    },
    searchBarlRightIconContainerStyle: {
        width: wp(3),
        padding: 10,
    },
/*--------------------------------------------------------------------------
 * フォントアイコン
 *------------------------------------------------------------------------*/
    // アイコン
    icon: {
        fontSize: RFPercentage(2.5),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    // ホームアイコン
    icon_home: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(3.5),
        color: '#ffffff',
        width: wp(10),
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    // 同期アイコン
    icon_sync: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.8),
        color: '#ffffff',
        width: wp(10),
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    // カレンダーアイコン
    icon_calendar: {
        fontSize: RFPercentage(1.8),
        color: '#7cbb42',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    // 再生・ストップアイコン
    icon_play_stop: {
        fontSize: RFPercentage(2),
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    // Tシャツアイコン
    icon_tshirt: {
        fontSize: RFPercentage(5),
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
      // ゴミ箱アイコン
  icon_trash: {
    fontSize: RFPercentage(2.5),
    color: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
/*--------------------------------------------------------------------------
 * モーダル
 *------------------------------------------------------------------------*/
    // 共通のモーダル
    commonModalContainerStyle: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        // 暫定的に枠線はなしとする
        // borderWidth: StyleSheet.hairlineWidth,
        // borderRadius: 10,
        // borderColor: '#808080',
        top: '5%',
        bottom: '5%',
        left: '5%',
        right: '5%',
        position:'absolute',
    },
    commonModalViewContainerStyle: {
        backgroundColor: 'transparent',
        top: '5%',
        bottom: '5%',
        left: '5%',
        right: '5%',
        position:'absolute',
    },
    commonModalTaggingViewContainerStyle: {
        backgroundColor: 'transparent',
        // 開発中は暫定的に枠線をつける
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: '#808080',
        top: '5%',
        bottom: '2%',
        left: '0%',
        right: '0%',
        position:'absolute',
    },
    //モーダルの親（LiveTagging）
    modal_overview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        top: '25%',
        bottom: '25%',
        left: '25%',
        right: '25%',
        position:'absolute',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
    },
    modal_date: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        // borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        top: hp(20),
        bottom: hp(20),
        left: wp(20),
        right: wp(20),
        position:'absolute'
      },
/*--------------------------------------------------------------------------
 * プログレスダイアログ
 *------------------------------------------------------------------------*/
    activity_indicator: {
        height: wp(15),
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
/*--------------------------------------------------------------------------
 * フローティングアクションメニュー
 *------------------------------------------------------------------------*/
    // ボタンカラー
    floatingAction_buttonColor: {
        backgroundColor: 'transparent',
    },
    // テキストコンテナスタイル
    floatingAction_textContainerStyle: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        height: 'auto'
    },
    // テキストスタイル
    floatingAction_textStyle: {
        fontSize: RFPercentage(1.5),
        fontFamily: 'Raleway-Regular'
    },
    // ボタンアイコンスタイル
    floatingAction_ButtonIcon: {
        fontSize: 28,
        height: 32,
        color: '#ffffff',
      },
/*--------------------------------------------------------------------------
 * フラットグリッド
 *------------------------------------------------------------------------*/
flatGridTitle: {
    backgroundColor: '#75787b',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10, 
  }
});
