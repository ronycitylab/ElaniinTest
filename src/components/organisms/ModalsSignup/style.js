import * as React from 'react';

import { 
    StyleSheet,
} from 'react-native';

import GlobalVars from '../../../global/globalVars';

const Styles = StyleSheet.create({ 

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalView: {
        margin: 20,
        backgroundColor: GlobalVars.fondoPrincipal,
        borderRadius: 30,
        padding: 35,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    stretch: {
        width: 100,
        height: 100,
        marginBottom: 15,
        borderRadius: 15,
    }

});

export default Styles;