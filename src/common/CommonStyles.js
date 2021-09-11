/*--------------------------------------------------------------------------
 * 画面共通のスタイル定義
 *------------------------------------------------------------------------*/
import { StyleSheet } from 'react-native';
// レスポンシブデザイン対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
/*--------------------------------------------------------------------------
 * コンテナ
 *------------------------------------------------------------------------*/
    // コンテナ
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
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
/*--------------------------------------------------------------------------
 * 行、列
 *------------------------------------------------------------------------*/
    row: {
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
    },
    column: {
        flexDirection: 'column',
        marginLeft: 5,
        marginRight: 5,
    },
/*--------------------------------------------------------------------------
 * 入力フォーム
 *------------------------------------------------------------------------*/
    input: {
        fontFamily: 'Raleway-Regular',
        color: '#333333',
        fontSize: RFPercentage(2),
        height: hp(4.5),
        width: wp(35),
        backgroundColor: '#fff',
        borderColor: '#777777',
    },
    formElement: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
    dropdown_text: {
        fontFamily: 'Raleway-Regular',
        color: 'black',
        fontSize: RFPercentage(1.8),
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
 * ボタン
 *------------------------------------------------------------------------*/
    // ボタン極小
    button_xsm: {
        width: wp(4.5),
        height: hp(4.5),
        backgroundColor: '#006a6c',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    // ボタン小
    button_sm: {
        width: wp(7),
        height: hp(4.5),
        backgroundColor: '#006a6c',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    // ボタン中
    button_md: {
        width: wp(12.5),
        height: hp(4.5),
        backgroundColor: '#006a6c',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    // ボタン大
    button_lg: {
        width: wp(12),
        height: hp(6),
        backgroundColor: '#006a6c',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    // ボタン特大
    button_xlg: {
        width: wp(10),
        height: hp(9),
        backgroundColor: '#006a6c',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        shadowColor: '#cccccc',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
    },
    // ログインボタン
    login_button: {
        width: wp(35),
        height: hp(7),
        // backgroundColor: '#006a6c',
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
        color: '#000000',
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
 * ラベル
 *------------------------------------------------------------------------*/
    // タイトルテキスト
    title: {
        fontFamily: 'Raleway-Regular',
        color: '#EEEEEE',
        fontSize: RFPercentage(5),
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
/*--------------------------------------------------------------------------
 * テーブル
 *------------------------------------------------------------------------*/
    tableHead: {
        height: hp(4),
        backgroundColor: '#006a6c'
    },
    tableHeadText: {
        fontFamily: 'Raleway-Regular',
        fontSize: RFPercentage(1.5),
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
        backgroundColor: '#FFF1C1'
    },
    tableBorderWidth: {
        borderWidth: 0.5
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
        backgroundColor: '#006a6c',
        borderColor: '#006a6c',
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
        color: '#000000',
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
        color: '#006a6c',
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
/*--------------------------------------------------------------------------
 * モーダル
 *------------------------------------------------------------------------*/
    // カレンダーモーダル
    calendar_modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lavender',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        top: hp(10),
        width: wp(45),
        height: hp(55),
        position:'absolute',
    },
    // カラーモーダル
    color_modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lavender',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 7,
        top: hp(10),
        width: wp(45),
        height: hp(25),
        position:'absolute',
    }, 
    //モーダルの親
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
});