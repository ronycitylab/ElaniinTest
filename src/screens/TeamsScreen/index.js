import React, {useEffect, useState} from 'react';

import { 
    View, BackHandler, Alert,
    SafeAreaView, Animated, Text,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';

import { Picker } from "native-base";

import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

/** Import Global Variables */
import GlobalVars from '../../global/globalVars';

/** Import Componentes Custom */
import StatusBarComponent from '../../components/atoms/StatusBar';
import ButtonComponent from '../../components/atoms/ButtonComponent';
import HeaderHomeComponent from '../../components/molecules/HeaderHome';

import * as firebase from 'firebase';

import Styles from './style';

const styles = Styles;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const TeamsScreen = ({navigation}) => {

    // vars
    const [ teamscurrent, setTeamsCurrent ] = useState([]);
    const [ infoTeams, setInfoteams ] = useState([]);
    const [ mssgnotteam, setMssgnotteam ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ teams, setTeams ] = useState(null);

    useEffect( () => {
        /** Clean */
        // clearAll();
        getTeamsAssociates();
        
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            /** Get teams */
            getTeamsAssociates();

            return () => 1;
        }, [])
    );   

    useEffect(() => {
        if( teamscurrent ) { getTeamsInfo(); }
    }, [teamscurrent]);

    const getTeamsAssociates = async () => {

        // console.log({val});
        try {
            const teamsincurrent = JSON.parse(await AsyncStorage.getItem("currentTeams"));
            // console.log( {teamsincurrent} );
            if( teamsincurrent ){
                setTeamsCurrent( teamsincurrent );
                getTeamsInfo();
                if( teamsincurrent.length ){
                    setMssgnotteam(false);
                }else{
                    setMssgnotteam(true);
                }
            }else{
                setMssgnotteam(true);
            }
        } catch (error) {
            // Error saving data
            // console.error();
            null;
        }
  
    }

    const getTeamsInfo = () => {

        if( !teamscurrent.length ){
            let tempteamsnull = null;
            tempteamsnull = (
    
                <TouchableOpacity
                    style={{ width: '100%', height: 60, borderBottomWidth: 1,
                    borderBottomColor: '#000', justifyContent: 'center', alignItems: 'center',
                    alignContent: 'center' }}
                    onPress={ () => { navigation.navigate( 'Inicio' ); }}
                    >
                    <Text style={{ fontSize: 18, fontFamily: GlobalVars.fontFamily }}> Ir a Home </Text>
                </TouchableOpacity>
            );

            setTeams( tempteamsnull );
            setLoading(false);
        }

        // console.log( {teamscurrent} );
        teamscurrent.map((item, index) => {
  
            // console.log( {item} );
            firebase
            .database()
            .ref('/teams/' + item)
            .once('value', (data) => {
    
                // console.log('-----------------------------------');
                var infoTeam = data.toJSON();
                let arrtmp = infoTeams;
                if( arrtmp.filter(e => e.name === infoTeam.name).length < 1 ){

                    arrtmp.push({
                        id_key: item,
                        name: infoTeam.name,
                        pokedex: infoTeam.pokedex,
                        pokemones: infoTeam.pokemones,
                        regionName: infoTeam.regionName,
                        tokenTeam: infoTeam.tokenTeam,
                        availablePokemons: infoTeam.availablePokemons
                    });
                    // console.log({arrinittemp});

                }else{
                    null;
                }
                // console.log(infoTeam.name);
                setInfoteams(arrtmp);

                    let tempteams = null

                    if( arrtmp.length ){

                        tempteams = arrtmp.map((item, index) => {
                
                            // console.log('-----------------------------------');
                            // console.log( item.id_key );
                            return(
                
                                    <TouchableOpacity
                                        key={index}
                                        style={{ width: '100%', height: 60, borderBottomWidth: 1,
                                        borderBottomColor: '#000', justifyContent: 'center', alignItems: 'center',
                                        alignContent: 'center' }}
                                        onPress={ () => { navigation.navigate( 'Detail', { id_team: item.id_key } ); }}
                                        >
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', fontFamily: GlobalVars.fontFamily }}>{ item.name } | { item.regionName }</Text>
                                    </TouchableOpacity>
                                );
                
                        });
                
                    }

                    setTeams( tempteams );
                    if( arrtmp.length ){ setLoading(false); }
            
            });
  
        });
  
    }

    const questionExit = () => {
        navigation.goBack();
    }    

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.viewHome} >
                <StatusBarComponent />
                <HeaderHomeComponent />

                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.contentContainer} >
                    
                    { mssgnotteam && <Text style={ styles.textnoteam} >No estás en ningún equipo</Text> }

                    { loading && <ActivityIndicator size="large" color="#000" style={{ marginTop: 25 }}/> }

                    { teams }

                    <View style={{ marginTop: 30 }} ></View>
                    <ButtonComponent color="blue" text="Regresar" Action={questionExit} />

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default TeamsScreen;