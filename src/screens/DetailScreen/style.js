import * as React from 'react';
import { 
    StyleSheet
} from 'react-native';

import Constants from 'expo-constants';

import GlobalVars from '../../global/globalVars';

const Styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    viewHome: {
        backgroundColor: GlobalVars.fondoPrincipal,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // paddingTop: Constants.statusBarHeight,
        paddingBottom: 0,
        // paddingHorizontal: 20,
    },

    scrollView: {
        backgroundColor: 'transparent',
        width: '100%',
    },

    contentContainer: {
        // paddingTop: Constants.statusBarHeight,
        paddingBottom: 30, //TODO
        paddingHorizontal: 20,
        justifyContent: 'center', 
        alignItems: 'center', 
        alignContent: 'center',
    },

    textnoteam: {
        fontFamily: GlobalVars.fontFamily,
        fontSize: 20,
        color: GlobalVars.bluePantone,
        textAlign: 'center',
        marginTop: 30,
    },

    textStyle: {
        color: GlobalVars.bluePantone,
        fontSize: 20,
        fontFamily: GlobalVars.fontFamily,
        marginVertical: 20,
    },

    viewItem: {
        width: GlobalVars.windowWidth/2.46,
        height: '100%',
        marginLeft: 10,
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            padding: 10,
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 1,
    },
  
    imgItem: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2
    },

    searchInput: {
        borderColor: GlobalVars.bluePantone,
        borderWidth: 1,
        width: GlobalVars.windowWidth - 70,
        paddingLeft: 20,
        borderRadius: 3,
        textAlign: 'center',
        height: 35,
        fontFamily: GlobalVars.fontFamily,
        marginBottom: 30,
    }

});

export default Styles;