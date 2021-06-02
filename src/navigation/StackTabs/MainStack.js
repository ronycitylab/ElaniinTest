import * as React from 'react';

import { Platform, View, TouchableOpacity, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AntDesign } from '@expo/vector-icons'; 

/** Import Main Stack Screens */

/** Import Header Stack Component */
import CustomHeaderStack from '../../components/organisms/CustomHeaderStack';

import DetailScreen from '../../screens/DetailScreen';

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
                    name="Detail"
                    component={ DetailScreen }
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
            </Stack.Navigator>
        </NavigationContainer>
    );
    
};

export default MainStack;