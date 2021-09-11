import { StyleSheet } from 'react-native';
// レスポンシブ対応
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";

export default StyleSheet.create({
    menu_row: {
        flexDirection: 'row', 
        justifyContent: 'flex-end',
    },
    menu_column: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'flex-start',
    },
    menu_row_height: {
        height: hp(15),
    },
    menu_row_padding: {
        padding: 10,
    },
    menu_accordion: {
        width: RFPercentage(20),
        flexDirection: 'column', 
        backgroundColor: 'rgba(255,255,255,0.0)',
    },
    menu_accordion_labelText: {
        fontSize: RFPercentage(1.5),
    },
    menu_accordion_icon: {
        fontSize: RFPercentage(2),
    },
    menu_title: {
        fontSize: RFPercentage(4),
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        marginBottom: 'auto',
    },    
    menu_gridView: {
        marginTop: 'auto',
        marginLeft: wp(15),
        marginRight: wp(15),
        marginBottom: 'auto',
    },
    menu_gridItem_container: {
        justifyContent: 'flex-end',
        borderRadius: 10,
        padding: 10,
        height: hp(20),
        backgroundColor: 'rgba(245,245,245,0.8)',
    },
    menu_gridItem_name: {
        fontSize: RFPercentage(1.8),
        color: '#001e43',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        marginBottom: 'auto',
    },
    menu_gridItem_icon: {
        fontSize: RFPercentage(4),
        color: '#001e43',
        marginLeft: 'auto',
        marginRight: 5,
        marginTop: 'auto',
        marginBottom: 5,
    },    
});