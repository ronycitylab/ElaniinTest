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
import * as Google from 'expo-google-app-auth';
import globalVars from '../globalVars';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export default class HomeScreen extends React.Component {

  constructor(props){

    super(props);
    this.state = {
      
      device_IMEI: Constants.deviceId,
      dataFullRegions: [],
      dataRegions: [],

      currentUserLogged: null,

      initCounter: 0,
      incrementCounter: 683,
      loadingRegions: true,

      regionSelected: '_no_',

      dataFullLocations: [],
      dataLocations: [],
      nameRegionSelected: '',

      dataPokemons: [],
      namesPokemosnsAvailable: [],

      AddTeambyToken: false,
      AddTeam: false,
      nameTeamAdd: '',
      pokemonsTeam: [],
      pokemonSeleccionado: '_no_',
      tokenTeambyAdd: '',


    };
  
  }

  componentDidMount(){

    // console.log( globalVars );
    // console.log( firebase.auth().currentUser );
    this.getRegions();
    // console.log('--------------------------------------');
    // console.log( firebase.auth().currentUser );
    // console.log( this.generateTokenTeam(7) );

    this.setState({ currentUserLogged: firebase.auth().currentUser }, () => {

      // console.log( this.state.currentUserLogged );

    });

  }

  logOut = () => {

    firebase.auth().signOut().then(() => {

      this.props.navigation.navigate('Login');

    })
    .catch(error =>{ console.log( error ); });

  }

  getPokemonsAvailable = (dataArr) => {

    // console.log( dataArr );
    this.state.dataPokemons = [];
    dataArr.map((item, index) => {

      this.getLocationsAreas( item.url );

    });

  }

  getLocationsAreas = ( uriLocation ) => {

    fetch( uriLocation , {
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
      .then(responseJson1 => {

        // console.log( '-------------------------------------' );
        // console.log( responseJson1.areas );

        this.setState({
          
          dataAreasToPokes: responseJson1.areas,

        }, () => { 

          this.getAreasLocation( responseJson1.areas, this.state.dataAreasToPokes );

        } );

      }).catch((error) => {
        console.log(error);
      });

  }


  getAreasLocation = ( dataResponse, dataArrAreas ) => {

    // console.log( dataResponse );
    dataResponse.map(( item, index ) => {

      this.getDataPokesEncounters( item.url );

    });

  }


  getDataPokesEncounters = ( uriPokemonEncounters ) => {

    // console.log( '----------------------------------' );
    // console.log( uriPokemonEncounters );
    fetch( uriPokemonEncounters , {
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
      .then(responseJson2 => {

        // console.log( responseJson2.pokemon_encounters );
        responseJson2.pokemon_encounters.map((item, index) => {

          // console.log( item.pokemon );
          
          if( !this.state.namesPokemosnsAvailable.includes( item.pokemon.name ) ){
            
            this.state.dataPokemons.push( item.pokemon );
            this.state.namesPokemosnsAvailable.push( item.pokemon.name );

          }

        });


        this.setState({

        }, () => { 

        } );

      }).catch((error) => {
        console.log(error);
      });

  }

  
  getLocations = () => {

    var url = globalVars.url;

    fetch( this.state.regionSelected , {
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
      .then(responseJson => {

        // console.log( responseJson.pokedexes[0].url );
        // console.log( responseJson.locations.length );


        this.setState({
          dataFullLocations: responseJson.locations,
          dataLocations: responseJson.locations,
          nameRegionSelected: responseJson.name,
          pokedex: responseJson.pokedexes[0].url, 
          // pokedexSelected: responseJson.pokedexes[0]
        }, () => { 

          this.getPokemonsAvailable( this.state.dataLocations );

        } );

      }).catch((error) => {
        console.log(error);
      });

  }
  
  

  getRegions = () => {

    var url = globalVars.url;

    fetch(url + 'region/', {
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
      .then(responseJson => {

        // console.log( responseJson );
        // console.log( responseJson.results.length );

        this.setState({
          dataFullRegions: responseJson.results,
          dataRegions: responseJson.results,
          loadingRegions: false
        });

      }).catch((error) => {
        console.log(error);
      });

  }

  filtro = (textSearch) => {

        const newData = this.state.dataFullRegions.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = textSearch.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        this.setState({ dataRegions: newData });

  };

  seleccionRegion = (urlRegion) => {

    this.setState({ cargandoPokes: true });

    if( urlRegion != '_no_' ){
      
      this.setState({ regionSelected: urlRegion, }, () => {

        this.getLocations();
      
      }); 

    }

    setTimeout( () => {

      this.setState({ cargandoPokes: false });

    }, 10000);

  }

  AddTeam = () => {

    // console.log( this.state.nameTeamAdd, this.state.pokemonsTeam, this.state.nameRegionSelected, this.state.pokedex);
    if( this.state.nameTeamAdd != '' ){

      if( this.state.pokemonsTeam.length >= 3 ){

        let contadorTeams = 0;
        let incrementContadorTeams = 0;
        let arrTeams = [];

        firebase
        .database()
        .ref('/counter/' + 1)
        .once('value', (data) => {

          if( data.toJSON() == null ){

            firebase
            .database()
            .ref('/counter/' + 1)
            .set({
              counter: 0
            }).then( () => {                  

              contadorTeams = 0;

            }).catch((error) => { 
                console.log(error); 
            });

          }else{

            contadorTeams = data.toJSON().counter;
            incrementContadorTeams = contadorTeams + 1;
            // console.log( incrementContadorTeams );

            firebase
            .database()
            .ref('/counter/' + 1)
            .update({
              counter: incrementContadorTeams
            });

            firebase
            .database()
            .ref('/users/' + this.state.currentUserLogged.uid)
            .once('value', (data) => {

              // console.log(data.toJSON().teams_involucrated);

              var recoveredUserData = data.toJSON();

              if( recoveredUserData.teams_involucrated == undefined || recoveredUserData.teams_involucrated == null ){

                arrTeams = [];

              }else{

                var objA = recoveredUserData.teams_involucrated;
                Object.keys(objA).map( (key) => {

                   // console.log( objA[key] );
                   arrTeams.push( objA[key] );

                });
                // console.log(resultArr);

              }

              firebase
              .database()
              .ref('/teams/' + incrementContadorTeams)
              .set({

                  name: this.state.nameTeamAdd,
                  pokemones: this.state.pokemonsTeam,
                  regionName: this.state.nameRegionSelected,
                  pokedex: this.state.pokedex,
                  availablePokemons: this.state.dataPokemons,
                  tokenTeam: this.generateTokenTeam(10),

              }).then( () => {

                  Alert.alert('Eqipo añadido');

              }).catch((error) => { 
                  console.log(error); 
                  Alert.alert('Equipo no añadido');
                });
              
              arrTeams.push( incrementContadorTeams );
              // console.log( arrTeams );

              firebase
              .database()
              .ref('/users/' + this.state.currentUserLogged.uid)
              .update({
                teams_involucrated: arrTeams
              });

            });

          }
        
        });

      }else{

        Alert.alert('Debe ingresar al menos 3 pokémones');

      }

    }else{

      Alert.alert('Falta nombre de equipo');

    }

  }

  addPokemon = () => {

    if( this.state.pokemonSeleccionado != '_no_'){

      if( !this.state.pokemonsTeam.includes(this.state.pokemonSeleccionado) ){

        if( this.state.pokemonsTeam.length < 6 ){

          this.state.pokemonsTeam.push( this.state.pokemonSeleccionado );
          this.setState({ pokemonsTeam: this.state.pokemonsTeam });

        }else{
          Alert.alert( 'Solo se permiten 6 pokémones, elimina 1' );
        }

      }else{
        Alert.alert( 'Pokémon ya esta incluido' );
      }

    }else{

      Alert.alert( 'Elije un pokémon' );

    }

    // console.log( this.state.pokemonsTeam );

  }


  generateTokenTeam(length) {

     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;

  }


  AddTeambyToken = () => {

    // tokenTeambyAdd
    firebase
    .database()
    .ref('/teams/')
    .once('value', (data) => {

      var recoveredUserData = data.toJSON();
      var objA = recoveredUserData;
      var selectedTeamNew = null;
      var arrTeams = [];

      Object.keys(objA).map( (key) => {

         // console.log( objA[key]['tokenTeam'] );
        if( objA[key]['tokenTeam'] == this.state.tokenTeambyAdd ){

          selectedTeamNew = key ;

          firebase
          .database()
          .ref('/users/' + this.state.currentUserLogged.uid)
          .once('value', (data) => {

              var recoveredUserData2 = data.toJSON();

              if( recoveredUserData2.teams_involucrated == undefined || recoveredUserData2.teams_involucrated == null ){

                arrTeams = [];

              }else{

                var objA2 = recoveredUserData2.teams_involucrated;
                Object.keys(objA2).map( (key) => {

                   // console.log( objA[key] );
                   arrTeams.push( objA2[key] );

                });
                // console.log(resultArr);

              }

              arrTeams.push( selectedTeamNew );

              firebase
              .database()
              .ref('/users/' + this.state.currentUserLogged.uid)
              .update({
                teams_involucrated: arrTeams
              });

              Alert.alert('Equipo añadido');

          });

        }

      });


      if( selectedTeamNew == null ){
        Alert.alert('No se encontró el equipo, verifique su token');
      }


    });

  }


  render(){

    var regionsSelect = null;
    var pokemonsSelect = null;
    var pokemonsIncluidos = null;

    if( !this.state.loadingRegions ){

      regionsSelect = this.state.dataRegions.map((item, index) => 

        <Picker.Item key={index} color="#000" label={ item.name } value={ item.url } />

      );
    }

    if( this.state.namesPokemosnsAvailable.length > 0 ){

      pokemonsSelect = this.state.dataPokemons.map((item, index) => 

        <Picker.Item key={index} color="#000" label={ item.name } value={ item.url } />

      );
    }

    if( this.state.pokemonsTeam.length > 0 ){

      pokemonsIncluidos = this.state.pokemonsTeam.map((item, index) => {

        return(
            <TouchableOpacity
                key={ index }
                style={{ backgroundColor: '#E74C3C', alignSelf: 'center',
                justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                width: screenWidth/2, height: 40, borderRadius: 4, marginTop: index > 0 ? 15 : 0 }}
                onPress={ () => { 
                                  this.state.pokemonsTeam.splice(index, 1);  
                                  this.setState({ pokemonsTeam: this.state.pokemonsTeam });
                                }}
                >
              <Text style={{ color: '#FFF', fontFamily: globalVars.fontTitle }}>Pokémon { index + 1 } (x)</Text>
            </TouchableOpacity>
        );

      });
    }

    return(

            <View style={ styles.container }>
              
              <StatusBar backgroundColor={ globalVars.fondoPrincipal } barStyle="light-content" />
              <View style={{ width: '100%', height: screenHeight/8, justifyContent: 'center',
                              alignContent: 'center', alignItems: 'center', backgroundColor: globalVars.fondoPrincipal }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF', fontFamily: globalVars.fontTitle }}>Elaniin Test</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFF', fontFamily: globalVars.fontTitle }}>Inicio</Text>
              </View>

              {
                regionsSelect === null
                ?
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 25 }}/>
                :
                null
              }

              <ScrollView
                style={ styles.scrollStyles }
                contentContainerStyle={{ paddingTop: 25, paddingBottom: 60 }}
              >

                <View style={{ width: '100%', paddingHorizontal: 20, }}>

                  <TouchableOpacity
                    style={{ borderRadius: 7, marginTop: 15,
                              width: '100%', height: 40, backgroundColor: '#48C9B0', alignContent: 'center',
                              justifyContent: 'center', alignItems: 'center', }}
                    onPress={ () => {  this.props.navigation.navigate( 'Teams' ); }}
                    >
                    <Text style={{ color: '#FFF', fontFamily: globalVars.fontTitle }}>Lista de equipos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ borderRadius: 7, marginTop: 10,
                              width: '100%', height: 40, backgroundColor: '#48C9B0', alignContent: 'center',
                              justifyContent: 'center', alignItems: 'center', }}
                    onPress={ () => { this.setState({ AddTeam: !this.state.AddTeam }); }}
                    >
                    <Text style={{ color: '#FFF', fontFamily: globalVars.fontTitle }}>Crear equipo</Text>
                  </TouchableOpacity>

                  <View style={{ width: '100%', display: this.state.AddTeam ? 'flex' : 'none' }}>

                    <View style={ styles.searchContainer }>
                      <AntDesign name="search1" size={24} color="#48C9B0" style={{ paddingRight: 5  }} />
                      <TextInput
                                          style={ styles.searchInput }
                                          underlineColorAndroid='transparent'
                                          placeholder='buscar región'
                                          placeholderTextColor="#48C9B0"
                                          onChangeText={ (text) => this.filtro(text) }
                                          paddingLeft={20}
                                          textAlignVertical='center'
                                      />
                    </View>

                    <View style={{ width: '100%', borderColor: '#48C9B0', borderRadius: 10, borderWidth: 1,
                                    justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                      <Picker style={{ display: (this.state.loadingRegions && this.state.dataRegions.length < 1) ? 'none' : 'flex',
                                        height: 40, width: '100%', alignSelf: 'center', color: '#48C9B0', 
                                        fontWeight: "bold", borderRadius: 10, fontSize: 17, }}
                              itemStyle={{ height: 40, color: '#000', fontWeight: 'bold' }}
                              selectedValue={ this.state.regionSelected }
                              onValueChange={ (itemValue, itemIndex) => { this.seleccionRegion(itemValue); } 
                                            }
                              mode={'dialog'}
                              prompt="Seleccione región"
                              >
                          <Picker.Item color="#000" label="Seleccione región" value='_no_' />
                          { regionsSelect }
                      </Picker>
                    </View>

                    <TextInput
                          style={ [styles.searchInput, { width: '100%', marginTop: 15,
                                    display: this.state.cargandoPokes ? 'none' : 'flex', }] }
                          underlineColorAndroid='transparent'
                          placeholder='Asigna un nombre al equipo'
                          placeholderTextColor="#48C9B0"
                          onChangeText={ (text) => this.setState({ nameTeamAdd: text }) }
                          textAlignVertical='center'
                      />

                    {
                      this.state.cargandoPokes
                      ?
                      <Text style={{ marginTop: 15, alignSelf: 'center', color: '#48C9B0', fontWeight: 'bold', fontFamily: globalVars.fontTitle }}>
                        Cargando Pokémones...
                      </Text>
                      :
                      null
                    }

                    <View style={{ width: '100%', borderColor: '#48C9B0', borderRadius: 10, borderWidth: 1, 
                                    justifyContent: 'center', alignItems: 'center', alignContent: 'center',
                                    marginTop: 15, display: this.state.cargandoPokes ? 'none' : 'flex', }}>
                      <Picker style={{  height: 40, width: '100%', alignSelf: 'center', color: '#48C9B0', 
                                        fontWeight: "bold", borderRadius: 10, fontSize: 17, }}
                              itemStyle={{ height: 40, color: '#000', fontWeight: 'bold' }}
                              selectedValue={ this.state.pokemonSeleccionado }
                              onValueChange={ (itemValue, itemIndex) => { this.setState({ pokemonSeleccionado: itemValue }); } 
                                            }
                              mode={'dialog'}
                              prompt="Seleccione pokémon"
                              >
                          <Picker.Item color="#000" label="Seleccione pokémon" value='_no_' />
                          { pokemonsSelect }
                      </Picker>
                    </View>

                    <TouchableOpacity style={{ alignSelf: 'center', justifyContent: 'center', alignContent: 'center',
                                                alignItems: 'center', marginTop: 15, 
                                                display: this.state.cargandoPokes ? 'none' : 'flex', }}
                                      onPress={ () => { this.addPokemon(); }}
                                      >
                      <AntDesign name="pluscircleo" size={24} color="#48C9B0" />
                    </TouchableOpacity>

                    <View style={{ display: this.state.pokemonsTeam.length > 0 ? 'flex' : 'none', marginTop: 15,
                                    borderWidth: 1, borderColor: '#48C9B0', borderRadius: 4, paddingVertical: 15 }}>
                      { pokemonsIncluidos }
                    </View>

                    <TouchableOpacity
                        style={{ width: '100%', alignSelf: 'center', justifyContent: 'center',
                        alignContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#117864',
                        marginVertical: 15, borderRadius: 4, display: this.state.cargandoPokes ? 'none' : 'flex', }}
                        onPress={ () => { this.AddTeam(); }}
                      >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontFamily: globalVars.fontTitle }}>Añadir equipo</Text>
                    </TouchableOpacity>

                  </View>

                  <TouchableOpacity
                    style={{ borderRadius: 7, marginTop: 15,
                              width: '100%', height: 40, backgroundColor: '#48C9B0', alignContent: 'center',
                              justifyContent: 'center', alignItems: 'center', }}
                    onPress={ () => { this.setState({ AddTeambyToken: !this.state.AddTeambyToken }); }}
                    >
                    <Text style={{ color: '#FFF', fontFamily: globalVars.fontTitle }}>Participar en otro equipo (Token)</Text>
                  </TouchableOpacity>

                  <View style={{ display: this.state.AddTeambyToken ? 'flex' : 'none' }}>

                    <TextInput
                          style={ [styles.searchInput, { width: '100%', marginTop: 15,
                                     }] }
                          underlineColorAndroid='transparent'
                          placeholder='Ingresa el código del equipo'
                          placeholderTextColor="#48C9B0"
                          onChangeText={ (text) => this.setState({ tokenTeambyAdd: text }) }
                          textAlignVertical='center'
                      />

                    <TouchableOpacity
                        style={{ width: '100%', alignSelf: 'center', justifyContent: 'center',
                        alignContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#117864',
                        marginVertical: 15, borderRadius: 4, }}
                        onPress={ () => { this.AddTeambyToken(); }}
                      >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontFamily: globalVars.fontTitle }}>Añadir equipo</Text>
                    </TouchableOpacity>

                  </View>

                </View>
              
              </ScrollView>

              <TouchableOpacity
                style={{ position: 'absolute', borderRadius: 4, 
                          width: 90, height: 30, backgroundColor: '#FF5733', alignContent: 'center',
                          bottom: 10, right: 15, justifyContent: 'center', alignItems: 'center', }}
                onPress={ () => { this.logOut(); }}
                >
                <Text style={{ color: '#FFF', fontFamily: globalVars.fontTitle }}>Salir</Text>
              </TouchableOpacity>
            
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

    searchContainer: {
      width: '100%',
      height: 50,
      marginTop: 10,
      // borderColor: '#000',
      // borderWidth: 1,
      justifyContent: 'flex-start',
      alignContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },

    searchInput: {
      borderColor: '#48C9B0',
      borderWidth: 1,
      width: screenWidth - 70,
      paddingLeft: 20,
      borderRadius: 3,
      textAlign: 'center',
      fontFamily: globalVars.fontTitle
    },

    inputText: {

    }

});
