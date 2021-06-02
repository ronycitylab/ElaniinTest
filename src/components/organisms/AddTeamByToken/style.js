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

    searchInput: {
        borderColor: GlobalVars.bluePantone,
        borderWidth: 1,
        width: GlobalVars.windowWidth - 70,
        paddingLeft: 20,
        borderRadius: 3,
        textAlign: 'center',
        fontFamily: GlobalVars.fontFamily
    },

    ctrlAdd: {
        width: '100%', 
        alignSelf: 'center', 
        justifyContent: 'center',
        alignContent: 'center', 
        alignItems: 'center', 
        height: 40, 
        backgroundColor: '#117864',
        marginVertical: 15, 
        borderRadius: 4,
    },

    loadingText: {
        // marginTop: 15, 
        alignSelf: 'center', 
        color: GlobalVars.white, 
        fontFamily: GlobalVars.fontFamily,
    },
    

});

export default Styles;