import * as React from 'react';

import { LogBox } from 'react-native';

import { useFonts } from "expo-font";

import AppLoading from 'expo-app-loading';

import * as firebase from 'firebase';

import RootApp from './src/navigation/RootApp';

import GlobalVars from './src/global/globalVars';

const firebaseConfig = GlobalVars.firebaseConfig;
firebase.initializeApp(firebaseConfig);

const App = () => {
    /** Ignore Yellow Box Warning */
    LogBox.ignoreAllLogs();

    let [fontsLoaded] = useFonts({
        "Montserrat": require("./assets/fonts/Montserrat.ttf"),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }
    
    return <RootApp />;
};  

export default App;