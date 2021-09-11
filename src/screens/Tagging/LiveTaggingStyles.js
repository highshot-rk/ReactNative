import {StyleSheet} from 'react-native';
// レスポンシブ対応
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {wp,hp} from './SubScreen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  container: {
    alignSelf:'center',
    alignContent:'center',
    justifyContent: 'center',
  },
  contents_a: {
    height: '15%',
    paddingTop: 5,
    paddingBottom: 5,
  },
  contents_b: {
    height: '5%',
    justifyContent: 'center',
  },
  contents_c: {
    height: '52%',
  },
  contents_d: {
    paddingTop: 5,
    paddingBottom: 5,
    height: '28%',
  },
  home_area: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff'
  },
  view_area: {
    flex: 3,
  },
  view_area2: {
    flex: 2,
  },
  table_area: {
    flex: 6,
  },
  shot_view_area: {
    flex: 2,
  },
  highlows_area: {
    flex: 1,
    height: '50%',
  },
  view_area_a: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderColor: '#dbdfe2',
    borderWidth: 1,
  },
  home_color_bottom: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 10,
    borderColor: "#47315a"
  },
  away_color_bottom: {
    width: '100%',
    height: '100%',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 10,
    borderColor: "#FFD400"
  },
  home_color: {
    backgroundColor: "#11111100"
  },
  away_color: {
    backgroundColor: "#11111100"
  },
  view_area_bg: {
    borderWidth: 0,
    height: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
  },
  view_area_bg1: {
    borderWidth: 0,
    height: '50%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
  },
  view_area_timeout: {
    backgroundColor: '#0000',
    borderWidth: 0,
  },
  button_highlow: {
    height:40,
    color: '#fff',
  },
  view_area_b: {
    height: '50%',
    flexDirection: 'row',
  },
  view_area_c: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrow_img: {
    height: '100%',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  figure_img: {
    height: 30,
    width: 15,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  area_text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    fontSize: RFPercentage(1.5),
    borderColor: '#dbdfe2',
    borderWidth: 1,
  },
  line_contents: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: 'center',
    fontSize: RFPercentage(10.5),
    // backgroundColor: '#000',
    margin: 5,
    backgroundColor: 'transparent',
  },
  text_view_size: {
    fontWeight: "bold",
    fontSize: 18,
    color: '#fff'
  },
  line_btn: {
    width: 74,
    height: 38,
    backgroundColor: '#7c7878',
    borderRadius: 2
  },
  team_btn: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  line_text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5
  },
  area_img: {
    height: 50,
    width: 50
  },
  bottom_area_a: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vertical_columns: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  vertical_columns_score: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  vertical_columns_bg: {
    backgroundColor: '#000',
    borderColor: '#dbdfe2',
    borderWidth: 1,
  },
  select_button: {
    margin: 2,
    opacity:1
  },
  no_select_button: {
    margin: 2,
    opacity:1,
  },
  text_head: {
    color: '#fff',
    fontSize: 10,
  },
  text_number: {
    color: '#fff',
    fontSize: 30
  },
  button_sm_center: {
    width: wp(8),
    height: hp(4),
    marginHorizontal: 0,
  },
  table_head: {
    height: 40,
    backgroundColor: '#9b9494'
  },
  table_text: {
    textAlign: 'center', alignItems: "center",
    fontSize: 11,
  },
  table_row: {
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: '#c9c8c8'
  },
  table_btn: {
    width: 48,
    height: 18,
    backgroundColor: '#7c7878',
    borderRadius: 2
  },
  table_check: {
    width: 58,
    height: 58,
  },
  btn_text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff'
  },
  modal_view: {
    backgroundColor: '#add8e6',
    left: '20%',
    right: '20%',
    top: '35%',
    bottom: '35%',
  },
  modal_ft: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: '29%',
    bottom: '28%',
  },
  modal_edit: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: '24%',
    bottom: '24%',
  },
  labelText_modal_term: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
  modal_2p: {
    justifyContent: 'center',
    alignItems: 'center',
    left: '25%',
    right: '25%',
    top: '28%',
    bottom: '28%',
  },
  modal_2p3p: {
    // justifyContent: 'center',
    alignItems: 'center',
    left: '15%',
    right: '15%',
    top: '25%',
    bottom: '25%',
  },
  modal_height_1: {
    top: '32%',
    bottom: '32%',
  },
  modal_height_3: {
    top: '26%',
    bottom: '23%',
  },
  shot_row: {
    flexDirection: 'row',
    width: '60%',
    height: '35%',
  },
  shot_row2: {
    flexDirection: 'row',
    width: '60%',
    height: '30%',
  },
  shot_columns: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  view_area_to: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  view_area_shot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderColor: '#1a6ea0',
    borderWidth: 4
  },
  view_area_to_row: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ft_table_head: {
    height: 50,
    backgroundColor: '#add8e6',
  },
  ft_table_text_right: {
    textAlign: 'right',
    color: '#000',
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20
  },
  ft_table_text: {
    textAlign: 'center',
    color: '#000',
    fontSize: 18,
    fontWeight: "bold",
  },
  ft_table_btn: {
    backgroundColor: '#49a9d4',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    width: wp(12),
    height: 50,
  },
  ft_table_btn_disable: {
    backgroundColor: '#b7b7bb',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    width: wp(12),
    height: 50,
  },
  ft_confirm_btn: {
    backgroundColor: '#49a9d4',
    height: 50,
    width: wp(24),
  },
  text_head_shot: {
    fontSize: 20,
    textAlignVertical: 'bottom'
  },
  buttonColor_blue: {
    backgroundColor: '#49a9d4',
  },
  table_row_bg: {
    backgroundColor: '#0881e4'
  },
  dropdown_custom: {
    width: wp(25.9),
    marginLeft: 10,
    // padding: 0,
  },
  dropdown_dropdown_custom: {
    width: wp(25.9),
  },
  dropdown_datetime: {
    width: wp(6),
  },
  dropdown_dropdown_datetime: {
    width: wp(6),
  },
  dropdown_dropdown_custom_disable: {
    backgroundColor: '#000',
    opacity: 0.2
  },
  defaultTextStyle_custom: {
    color: '#000000',
  },
  shot_img: {
    flex: 8,
  },
  btn_round: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  view_area_attack: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5
  },
  button_xsm: {
    width: wp(4.5),
    height: hp(4),
    backgroundColor: '#006a6c',
    marginTop: 0,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    marginVertical: 0,
    padding: 0,
    shadowColor: '#cccccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  team_title: {
    width: wp(7),
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    textShadowOffset: {
      width: 0,
      height: 0
    },
    textShadowColor: '#000',
    textShadowRadius: 4,
    color: '#fff'
  },
  button_player: {
    width: wp(6),
    height: hp(4),
    justifyContent: 'center',
  },
  area_subs: {
    flex: 0.6,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#000',
    borderColor: '#808080',
    borderWidth: 3,
    flexWrap: 'wrap'
  },
  area_lineup: {
    flex: 0.3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#000',
    borderColor: '#808080',
    borderWidth: 3,
    flexWrap: 'wrap',
    width: "100%"
  },
  lbl_msg: {
    color: '#fff',
    textAlign: "center",
    fontSize: 16
  },
  edit_title: {
    flex: 1,
    alignItems: 'flex-end',
  },
  edit_cell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dragging: {
    opacity: 0.3,
  },
  hoverDragging: {
    opacity: 0.7,
  },
  dragDropButton: {
    opacity: 1,
  },
  receiveButton:{
    borderColor: '#fff',
    borderWidth: 2,
    opacity: 0.5,
  },
  // 再生・ストップアイコン
  icon_play_stop: {
    fontSize: RFPercentage(2),
  },
  //モーダルの親
  modal_dialog_end: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
    top: '25%',
    bottom: '25%',
    left: '25%',
    right: '25%',
    position:'absolute',
    zIndex: 2000,
  },
  modal_header_text:{
    fontSize: 30,
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modal_header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal_button_text: {
    color: 'white',
    fontSize: 20,
    padding: 10,
  },
  modal_button: {
    flexDirection: 'row',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    margin: 40,
  },
  bgImage:{
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position:'absolute',
  }
})