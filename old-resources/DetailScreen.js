import * as React from 'react';

import { StyleSheet, Text, View, ScrollView, Dimensions, Button,
            TouchableOpacity, ActivityIndicator, Alert, Linking, WebView,
            FlatList, Image, Picker, RefreshControl, AsyncStorage, StatusBar, TextInput } from 'react-native';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';

import * as firebase from 'firebase';
import globalVars from '../globalVars';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export default class DetailScreen extends React.Component {

  constructor(props){

    super(props);
    this.state = {

      device_IMEI: Constants.deviceId,
      itemTeam: null,
      pokedexDescription: null,
      pokemonItem: [],
      currentUserLogged: null,

    };

  }

  componentDidMount(){

    this.getTeamInfo( this.props.route.params.id_team );
    this.setState({ currentUserLogged: firebase.auth().currentUser }, () => {

      // console.log( this.state.currentUserLogged );

    });

  }

  getTeamInfo = (item) => {

    firebase
    .database()
    .ref('/teams/' + item)
    .once('value', (data) => {

      // console.log('-----------------------------------');
      var infoTeam = data.toJSON();
      infoTeam.itemV = item;
      this.setState({ itemTeam: infoTeam }, () => { /*console.log( this.state.itemTeam );*/ });
      // console.log( infoTeam );
      this.getPokedexInfo(infoTeam);
      this.getPokemones(infoTeam.pokemones);
    
    });

  }

  getPokedexInfo = (infoTeam) => {

    fetch(infoTeam.pokedex, {
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
      .then(responseJson => {

        // console.log( responseJson.descriptions );
        // console.log( responseJson.results.length );

        responseJson.descriptions.map((item, index) => {

          if( item.language.name == 'es' ){

            this.setState({
              pokedexDescription: item.description,
            });

          }else if( item.language.name == 'en' && this.state.pokedexDescription == null ){

            this.setState({
              pokedexDescription: item.description,
            });

          }

        });

      }).catch((error) => {
        console.log(error);
      });

  }

  getPokemones = (pokemones) => {

    // console.log(pokemones);
    Object.keys(pokemones).map( (key) => {

      // console.log( pokemones[key] );
      this.fetchingPokemon( pokemones[key] );

    });

  }

  fetchingPokemon = (pokemonuri) => {
    
    fetch(pokemonuri, {
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(response => response.json())
        .then(responseJson => {

          // console.log( responseJson.sprites.front_default );
          // console.log( responseJson.results.length );

          var obj = {};
          obj.name = responseJson.name;
          obj.image = responseJson.sprites.front_default;
          this.state.pokemonItem.push(obj);
          this.setState({
            pokemonItem: this.state.pokemonItem,
          });

        }).catch((error) => {
          console.log(error);
        });

  }


  removeTeam = () => {

    firebase
    .database()
    .ref('/users/' + this.state.currentUserLogged.uid)
    .once('value', (data) => {

      var recoveredUserData = data.toJSON();
      let arrTeams = [];

      var objA = recoveredUserData.teams_involucrated;
      Object.keys(objA).map( (key) => {

         // console.log( objA[key] );
         if( objA[key] != this.props.route.params.id_team ){

          arrTeams.push( objA[key] );

         }

      });

      // console.log( arrTeams );

      firebase
      .database()
      .ref('/users/' + this.state.currentUserLogged.uid)
      .update({
        teams_involucrated: arrTeams
      });

      firebase
      .database()
      .ref('/teams/' + this.props.route.params.id_team)
      .remove();

    });

    this.props.navigation.navigate( 'Home' );

  }


  render(){

    console.log( this.state.itemTeam );

    var ItemsPokes = null;

    if( this.state.pokemonItem.length > 1 ){

      ItemsPokes = this.state.pokemonItem.map((item, index) => {

          let imageCover = item.image;
          let titles = item.name;

          if( imageCover != '' && imageCover != null && imageCover != undefined ){

            // console.log( titles );
            return(
              
              <TouchableOpacity 
                style={ styles.viewItem }
                onPress={ () => {  }}
                key={index}
                >
                <Image
                    style={ styles.imgItem }
                    source={{
                        uri: imageCover
                    }} />
                <Text style={{ marginHorizontal: 5, fontFamily: globalVars.fontTitle }}>{ titles }</Text>
              </TouchableOpacity>

            );

          }else{ return null; }

      });

    }else{

      ItemsPokes = null;
    
    }

    return(

            <View style={ styles.container }>
              
                <StatusBar backgroundColor={ globalVars.fondoPrincipal } barStyle="light-content" />
                <View style={{ width: '100%', height: screenHeight/8, justifyContent: 'center',
                              alignContent: 'center', alignItems: 'center', backgroundColor: globalVars.fondoPrincipal }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF', fontFamily: globalVars.fontTitle }}>Elaniin Test</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFF', fontFamily: globalVars.fontTitle }}>Información de equipo</Text>
                </View>

                {
                    this.state.itemTeam === null
                    ?
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 25 }}/>
                    :
                    null
                }

                <ScrollView
                  style={ styles.scrollStyles }
                  contentContainerStyle={{ paddingTop: 25, paddingBottom: 60, paddingHorizontal: 20,
                                            justifyContent: 'center', alignItems: 'center', alignContent: 'center',}}
                  >

                  {
                    this.state.itemTeam != null
                    ?
                    <Text style={ styles.textStyle }>
                      Equipo #: { this.state.itemTeam.itemV }
                    </Text>
                    :
                    null
                  }
                  {
                    this.state.itemTeam != null
                    ?
                    <View style={{ borderBottomWidth: 0.6, borderBottomColor: '#000', height: 1, width: '100%', marginTop: 5 }}>
                    </View>
                    :
                    null
                  }
                  {
                    this.state.itemTeam != null
                    ?
                    <Text style={ styles.textStyle }>
                      Equipo: { this.state.itemTeam.name }
                    </Text>
                    :
                    null
                  }
                  {
                    this.state.itemTeam != null
                    ?
                    <View style={{ borderBottomWidth: 0.6, borderBottomColor: '#000', height: 1, width: '100%', marginTop: 5 }}>
                    </View>
                    :
                    null
                  }
                  {
                    this.state.pokedexDescription != null
                    ?
                    <Text style={ styles.textStyle }>
                      Pokédex: { this.state.pokedexDescription }
                    </Text>
                    :
                    null
                  }
                  {
                    this.state.pokedexDescription != null
                    ?
                    <View style={{ borderBottomWidth: 0.6, borderBottomColor: '#000', height: 1, width: '100%', marginTop: 5, marginBottom: 20 }}>
                    </View>
                    :
                    null
                  }
                  {
                    this.state.pokemonItem.length > 0
                    ?
                    <ScrollView
                      horizontal={true}
                      style={{ height: 200 }}
                      contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 5 }}
                      showsHorizontalScrollIndicator={false}
                      scrollEventThrottle={200}
                      decelerationRate="fast"
                    >
                       { ItemsPokes }
                    </ScrollView>
                    :
                    null
                  }
                  {
                    this.state.itemTeam != null
                    ?
                    <Text style={ styles.textStyle }>
                      Código de equipo
                    </Text>
                    :
                    null
                  }
                  {
                    this.state.itemTeam != null
                    ?
                    <TextInput
                          style={ [styles.searchInput, { width: '100%', marginTop: 15, }] }
                          underlineColorAndroid='transparent'
                          placeholder='Código de equipo'
                          placeholderTextColor="#48C9B0"
                          value={ this.state.itemTeam.tokenTeam }
                          textAlignVertical='center'
                      />
                    :
                    null
                  }
                  {
                    this.state.itemTeam != null
                    ?
                    <Text style={ [styles.textStyle, { fontSize: 14 }] }>
                      Copie el código anterior y compartalo para que otros puedan ingresar a este equipo.
                    </Text>
                    :
                    null
                  }

                  <TouchableOpacity
                    style={{ borderRadius: 7, marginTop: 15,
                              width: '100%', height: 40, backgroundColor: '#C0392B', alignContent: 'center',
                              justifyContent: 'center', alignItems: 'center', }}
                    onPress={ () => { this.removeTeam(); }}
                    >
                    <Text style={{ color: '#FFF', fontFamily: globalVars.fontTitle }}>Eliminar equipo</Text>
                  </TouchableOpacity>

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

    textStyle: {
      // fontWeight: 'bold',
      fontSize: 20,
      marginTop: 25,
      fontFamily: globalVars.fontTitle,
      color: '#48C9B0'
    },

    viewItem: {
      width: screenWidth/2.46,
      height: '100%',
      marginLeft: 10,
      justifyContent: 'flex-start',
      alignContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      shadowColor: "#000",
      shadowOffset: {
          padding: 10,
          width: 0,
          height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 1,
    },

    imgItem: {
      width: '100%',
      height: '70%',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2
    },

    searchInput: {
      borderColor: '#48C9B0',
      borderWidth: 1,
      width: screenWidth - 70,
      paddingLeft: 20,
      borderRadius: 3,
      textAlign: 'center',
      height: 35,
      fontFamily: globalVars.fontTitle,

    },

});