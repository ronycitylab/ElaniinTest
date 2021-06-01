import * as React from 'react';

import { Platform, View, TouchableOpacity, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AntDesign } from '@expo/vector-icons'; 

/** Import Main Stack Screens */
import InitialScreen from '../../screens/InitialScreen';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignupScreen';
import CategoriesScreen from '../../screens/CategoriesScreen';
import ProductScreen from '../../screens/ProductScreen';

/** Import Header Stack Component */
import CustomHeaderStack from '../../components/organisms/CustomHeaderStack';

/** Import Theme */
import { MyTheme, Styles } from './style';

/** Import Golbal Vars */
import GlobalVars from '../../global/globalVars';

const Stack = createStackNavigator();
const styles = Styles;

const MainStack = ({TabBottom, redirect}) => {

    return(
        <NavigationContainer theme={MyTheme} >
            <Stack.Navigator initialRouteName={ redirect } >
                <Stack.Screen
                    name="Initial"
                    component={ InitialScreen }
                    options={{ headerShown: false }}
                /> 
                <Stack.Screen
                    name="Login"
                    component={ LoginScreen }
                    options={{
                        headerShown: Platform.OS === 'ios' ? true : false,
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerTintColor: 'transparent',
                        header: ({ scene, previous, navigation }) => (
                            <CustomHeaderStack scene={scene} previous={previous} navigation={navigation} />
                        ),
                    }}
                />
                <Stack.Screen
                    name="Signup"
                    component={ SignupScreen }
                    options={{
                        headerShown: Platform.OS === 'ios' ? true : false,
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerTintColor: 'transparent',
                        header: ({ scene, previous, navigation }) => (
                            <CustomHeaderStack scene={scene} previous={previous} navigation={navigation} />
                        ),
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={ TabBottom }
                    options={{
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerTintColor: 'transparent',
                        header: ({ scene, previous, navigation }) => (
                            <CustomHeaderStack scene={scene} previous={previous} navigation={navigation} />
                        ),
                    }}
                />
                <Stack.Screen
                    name="Categories"
                    component={ CategoriesScreen }
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerTintColor: 'transparent',
                        header: ({ scene, previous, navigation }) => (
                            <CustomHeaderStack scene={scene} previous={previous} navigation={navigation} isCustomTop isCategorie />
                        ),
                    }}
                />
                <Stack.Screen
                    name="Product"
                    component={ ProductScreen }
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerTintColor: 'transparent',
                        header: ({ scene, previous, navigation }) => (
                            <CustomHeaderStack scene={scene} previous={previous} navigation={navigation} isCustomTop />
                        ),
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
    
};

export default MainStack;