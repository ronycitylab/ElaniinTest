import React, {useEffect, useState} from 'react';

import { 
    View, BackHandler, Alert,
    SafeAreaView, Animated, Text,
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
import AddTeamComponent from '../../components/organisms/AddTeam';
import AddTeamByTokenComponent from '../../components/organisms/AddTeamByToken';
import ModalsSignup from '../../components/organisms/ModalsSignup';

import Styles from './style';

const styles = Styles;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const FirstScreen = ({navigation}) => {

    // exit question
    const [ salirApp, setSalirapp ] = useState(false);

    // vars
    const [ AddTeambyToken, setAddteambytoken ] = useState(false);
    const [ AddTeam, setAddteam ]  = useState(false);

    useEffect( () => {
        /** Clean */
        // clearAll();

        /** Android no return Login */
        const backAction = () => {
            setSalirapp(!salirApp);
            return true;
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            /** Android no return Login */
            const backAction = () => {
                setSalirapp(!salirApp);
                return true;
            };
        
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }, [])
    );

    const CloseApp = (response = false) => {
        if ( response )
            BackHandler.exitApp();
        else
            setSalirapp(!salirApp);
    }   

    const goToTeams = () => {
        navigation.navigate('Teams');
    }

    const setearAddteam = () => {
        setAddteam(!AddTeam);
    }

    const setearAddteamBytoken = () => {
        setAddteambytoken(!AddTeambyToken);
    }

    const questionExit = (res) => {
        CloseApp(res);
    }

    const clearAll = async () => {
        try {
            await AsyncStorage.clear();
        } catch(e) {
            // clear error
            // console.error();
        }
    }

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.viewHome} >
                <StatusBarComponent />
                <HeaderHomeComponent />

                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.contentContainer} >

                    <ButtonComponent color="blue" text="Equipos" Action={goToTeams} />

                    <ButtonComponent color="blue" text="Crear Equipo" Action={setearAddteam} />
                    { AddTeam && <AddTeamComponent /> }

                    <ButtonComponent color="blue" text="Participar en un equipo (Token)" Action={setearAddteamBytoken} />
                    { AddTeambyToken && <AddTeamByTokenComponent /> }

                    <View style={{ width: '100%', height: 20 }} ></View>
                    <ButtonComponent color="blue" text="Salir" Action={questionExit} />
                    { salirApp && <ModalsSignup navigation={navigation} CloseApp={questionExit} isSalirApp /> }

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default FirstScreen;