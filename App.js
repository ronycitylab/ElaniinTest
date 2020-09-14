import * as React from 'react';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage, Button, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from "expo-font";

import * as firebase from 'firebase';

import HomeScreen from './Componentes/HomeScreen';
import DetailScreen from './Componentes/DetailScreen';
import LoginScreen from './Componentes/LoginScreen';
import TeamsScreen from './Componentes/TeamsScreen';
import globalVars from './globalVars';

const Stack = createStackNavigator();
console.ignoredYellowBox = ['Warning:'];

const firebaseConfig = globalVars.firebaseConfig;
firebase.initializeApp(firebaseConfig);


export default function App() {

  let [fontsLoaded] = useFonts({
    "Montserrat": require("./Componentes/font/Montserrat.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
          screenOptions={{
             }} >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Teams" component={TeamsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}
