import * as React from 'react';
import { 
    StyleSheet
} from 'react-native';

import Constants from 'expo-constants';

import GlobalVars from '../../../global/globalVars';

const Styles = StyleSheet.create({

    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },

    searchContainer: {
        width: '100%',
        height: 50,
        marginTop: 10,
        // borderColor: '#000',
        // borderWidth: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },

    searchInput: {
        borderColor: GlobalVars.bluePantone,
        borderWidth: 1,
        width: GlobalVars.windowWidth - 70,
        paddingLeft: 20,
        borderRadius: 3,
        textAlign: 'center',
        fontFamily: GlobalVars.fontFamily
    },

    selectregion: {
        width: '100%', 
        borderColor: GlobalVars.bluePantone, 
        borderRadius: 10, 
        borderWidth: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        alignContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },

    pickerstyle: {
        height: 40, 
        width: '100%', 
        alignSelf: 'center', 
        color: '#48C9B0',                         
        fontWeight: "bold", 
        borderRadius: 10, 
        fontSize: 17,
    },

    inputitem: {
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignContent: 'center',
        marginBottom: 20
    },

    loadingText: {
        // marginTop: 15, 
        alignSelf: 'center', 
        color: '#48C9B0', 
        fontWeight: 'bold', 
        fontFamily: GlobalVars.fontFamily,
    },

    plusView: {
        alignSelf: 'center', 
        justifyContent: 'center', 
        alignContent: 'center',
        alignItems: 'center', 
        marginTop: 15, 
    },

    pokesincludes: {
        width: '100%',
        marginTop: 15,
        borderWidth: 1, 
        borderColor: GlobalVars.bluePantone, 
        borderRadius: 4, paddingVertical: 15
    }

});

export default Styles;