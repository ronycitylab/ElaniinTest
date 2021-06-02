import * as React from 'react';
import { 
    StyleSheet, Platform,
} from 'react-native';
import Constants from 'expo-constants';

import GlobalVars from '../../../global/globalVars';

const Styles = StyleSheet.create({

    rootView: {
        width: '100%',
        height: GlobalVars.windowHeight/6,
        justifyContent: 'center', 
        alignItems: 'center', 
        alignContent: 'center',
        // flex: 1,
        marginBottom: 10,
        paddingHorizontal: 20, 
        paddingTop: Constants.statusBarHeight,
        backgroundColor: GlobalVars.bluePantone,
    },  
    
});

export default Styles;