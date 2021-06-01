import * as React from 'react';
import { 
    StyleSheet
} from 'react-native';
import Constants from 'expo-constants';

import GlobalVars from '../../../global/globalVars';

const Styles = StyleSheet.create({

    rootView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: 40,
        height: 25,
        // borderColor: 'black',
        // borderWidth: 1,
        position: 'absolute',
        top: Constants.statusBarHeight+ 5,
        right: 5,
        borderRadius: 10,
        backgroundColor: 'transparent'
    },
    
    button: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 10,
        backgroundColor: 'transparent',
    },

    texto: {
        fontSize: 13,
        textAlign: 'justify',
        fontFamily: GlobalVars.fontFamily,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: GlobalVars.bluePantone,
    },

});

export default Styles;