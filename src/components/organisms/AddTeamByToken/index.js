import React, {useEffect, useState} from 'react';

import { 
    View, Text, TextInput, TouchableOpacity, Alert,
} from 'react-native';

import * as firebase from 'firebase';

import { Picker } from "native-base";

import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-community/async-storage';

/** Import Global Variables */
import GlobalVars from '../../../global/globalVars';

/** Import Componentes Custom */

import Styles from './style';

const styles = Styles;

const AddTeamByTokenComponent = () => {

    // vars
    const [ tokenTeambyAdd, setTokenTeambyAdd ] = useState('');

    useEffect(() => {
        
    }, []);


    const AddTeambyToken = () => {

        // tokenTeambyAdd
        firebase
        .database()
        .ref('/teams/')
        .once('value', (data) => {
    
          var recoveredData = data.toJSON();
          var objA = recoveredData;
          var selectedTeamNew = null;
    
          Object.keys(objA).map( (key) => {
    
            // console.log( objA[key]['tokenTeam'] );
            if( objA[key]['tokenTeam'] == tokenTeambyAdd ){
    
                selectedTeamNew = key ;
                //   console.log( {selectedTeamNew}, {tokenTeambyAdd} );              
                setearTeams(selectedTeamNew);
                Alert.alert('Se unió al equipo');
            }
    
          });
    
    
          if( selectedTeamNew == null ){
            Alert.alert('No se encontró el equipo, verifique su token');
          }
    
    
        });
    
    }

    const setearTeams = async (val) => {
        // console.log({val});
        try {
            const teamsincurrent = JSON.parse(await AsyncStorage.getItem("currentTeams"));
            // console.log( {teamsincurrent} );
            if( teamsincurrent ){
                AsyncStorage.removeItem('currentTeams');
                let newsteams = teamsincurrent;
                if( !newsteams.includes(val) ) { 
                    newsteams.push(val); 
                    AsyncStorage.setItem( 'currentTeams', JSON.stringify(newsteams) );
                }else{
                    Alert.alert('Ya está en este equipo');
                }
            }else{
                let newsteams = [val]; 
                AsyncStorage.setItem( 'currentTeams', JSON.stringify(newsteams) );
            }
        } catch (error) {
            // Error saving data
            // console.error();
            null;
        }
    }


    return(
        <View style={styles.container} >
            <TextInput
                style={ [styles.searchInput, { width: '100%', marginTop: 15,}] }
                underlineColorAndroid='transparent'
                placeholder='Ingresa el código del equipo'
                placeholderTextColor="#48C9B0"
                onChangeText={ (text) => setTokenTeambyAdd(text) }
                textAlignVertical='center'
            />

            <TouchableOpacity
                style={ styles.ctrlAdd }
                onPress={ () => { AddTeambyToken(); }}
                >
                <Text style={ styles.loadingText }>Añadir equipo</Text>
            </TouchableOpacity>
        </View>

    );
}

export default AddTeamByTokenComponent;