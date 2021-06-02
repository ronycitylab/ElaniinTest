import * as React from 'react';
import { View } from 'react-native';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FirstScreen from '../../screens/FirstScreen';
import TeamsScreen from '../../screens/TeamsScreen';
import DetailScreen from '../../screens/DetailScreen';

import GlobalStyles from '../../global/globalVars';
import Styles from './style';

const styles = Styles;

const Tab = createBottomTabNavigator();
function TabBottom() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          inactiveTintColor: '#EEEEEE',
          activeTintColor: GlobalStyles.bluePantone,
          showLabel: false,
        }}       
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, focused }) =>
            screenOptions(route, color, focused),
        })}
        barStyle={{ backgroundColor: '#000' }}
      >

        <Tab.Screen name="Inicio" component={FirstScreen} />
        <Tab.Screen name="Teams" component={TeamsScreen} />

      </Tab.Navigator>
    );
}

function screenOptions(route, color, focused) {

    let iconName, type;
    switch (route.name) {
        case 'Inicio':
            iconName = 'home-variant-outline';
            type = 'materialcomm';
            break;
        case 'Teams':
            iconName = 'heart-outline';
            type = 'materialcomm';
            break;
        case 'Detail':
            iconName = 'menu';
            type = 'feather';
            break;
        default:
            null;
            break;
    }
    
    if( type === 'materialcomm' ){

      if(focused){
        return (
          <View style={styles.viewOptions} >
              <View style={styles.viewContent} >
                  <MaterialCommunityIcons name={iconName} size={28} color={ GlobalStyles.bluePantone } />
              </View>
          </View>
        )
      }else{
        return <MaterialCommunityIcons name={iconName} size={24} color={ GlobalStyles.grisIntermediate } />
      }

    }

    if( type === 'feather' ){

      if(focused){
        return (
          <View style={styles.viewOptions} >
              <View style={styles.viewContent}>
                  <Feather name={iconName} size={28} color={ GlobalStyles.firstColor } />
              </View>
          </View>
        )
      }else{
        return <Feather name={iconName} size={24} color={ GlobalStyles.grisIntermediate } />
      }

    }
  
}

export default TabBottom;