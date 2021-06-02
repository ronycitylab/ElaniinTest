import * as React from 'react';

import { StyleSheet, Text, View, ScrollView, Dimensions, Button,
            TouchableOpacity, ActivityIndicator, Alert, Platform, TextInput,
            FlatList, Image, Picker, RefreshControl, AsyncStorage, StatusBar, } from 'react-native';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Ionicons, FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';

import * as firebase from 'firebase';
import globalVars from '../globalVars';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export default class HomeScreen extends React.Component {

  constructor(props){
  	super(props);
  	this.state = {

  		currentUserLogged: null,
  		Teams: [],
  		itemTeam: [],

  	};
  }

  componentDidMount(){

  	this.setState({ currentUserLogged: firebase.auth().currentUser }, () => {

      // console.log( this.state.currentUserLogged );
      this.getTeamsAssociates();

    });

  }

  getTeamsAssociates = () => {

  	firebase
	.database()
	.ref('/users/' + this.state.currentUserLogged.uid)
	.once('value', (data) => {

		var userData = data.toJSON();
		// console.log( userData );
		var objA = userData.teams_involucrated;
		if( objA != undefined ){
			
			Object.keys(objA).map( (key) => {

	           this.state.Teams.push( objA[key] );

	        });

	        this.setState({ Teams: this.state.Teams }, () => {

	        	// console.log( this.state.Teams );
	        	this.getTeamsInfo();
	        
	        });

		}

	});

  }

  getTeamsInfo = () => {

  	this.state.Teams.map((item, index) => {

  		// console.log( item );
  		firebase
        .database()
        .ref('/teams/' + item)
        .once('value', (data) => {

        	// console.log('-----------------------------------');
        	var infoTeam = data.toJSON();
        	infoTeam.itemV = item;
        	this.state.itemTeam.push( infoTeam );
        	this.setState({ itemTeam: this.state.itemTeam }, () => { /*console.log( this.state.itemTeam );*/ });
        	// console.log( infoTeam );
        
        });

  	});

  }

  render(){

  	var teams = null;

  	if( this.state.Teams.length > 0 ){

  		teams = this.state.itemTeam.map((item, index) => {

  			// console.log('-----------------------------------');
     //    	console.log( item.itemV );
        	return(

	  			<TouchableOpacity
	  				key={index}
	  				style={{ width: '100%', height: 60, borderBottomWidth: 1,
	  				borderBottomColor: '#000', justifyContent: 'center', alignItems: 'center',
	  				alignContent: 'center' }}
	  				onPress={ () => { this.props.navigation.navigate( 'Detail', { id_team: item.itemV } ); }}
	  				>
	  				<Text style={{ fontSize: 18, fontWeight: 'bold', fontFamily: globalVars.fontTitle }}>{ item.name } / { item.regionName }</Text>
	  			</TouchableOpacity>
	  		);

	  	});

  	}else{

			teams = (

	  			<TouchableOpacity
	  				style={{ width: '100%', height: 60, borderBottomWidth: 1,
	  				borderBottomColor: '#000', justifyContent: 'center', alignItems: 'center',
	  				alignContent: 'center' }}
	  				onPress={ () => { this.props.navigation.navigate( 'Home' ); }}
	  				>
	  				<Text style={{ fontSize: 18, fontWeight: 'bold', fontFamily: globalVars.fontTitle }}> Aún no hay equipos disponibles</Text>
	  			</TouchableOpacity>
	  		);

  	}

  	return(

  		<View style={ styles.container }>
              
            <StatusBar backgroundColor={ globalVars.fondoPrincipal } barStyle="light-content" />
            <View style={{ width: '100%', height: screenHeight/8, justifyContent: 'center',
                          alignContent: 'center', alignItems: 'center', backgroundColor: globalVars.fondoPrincipal }}>
	            <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF', fontFamily: globalVars.fontTitle }}>Elaniin Test</Text>
	            <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFF', fontFamily: globalVars.fontTitle }}>Teams</Text>
            </View>

            {
                teams === null
                ?
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 25 }}/>
                :
                null
              }

            <ScrollView
            	style={{ width: '100%', }}
            	contentContainerStyle={{ paddingTop: 25, paddingBottom: 60, paddingHorizontal: 20}}
            	>
            	{ teams }
            </ScrollView>


        </View>

  	);

  }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0, 68, 140, 1.0)',
        backgroundColor: '#FFF',
    },

    scrollStyles: {
      width: '100%',
    },

});
