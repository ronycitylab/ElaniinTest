import React, {useEffect, useState} from 'react';

import { 
    View, Text, TextInput, TouchableOpacity, Alert,
} from 'react-native';

import * as firebase from 'firebase';

import { Picker } from "native-base";

import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-community/async-storage';

/** Import Global Variables */
import GlobalVars from '../../../global/globalVars';

/** Import Componentes Custom */

import Styles from './style';

const styles = Styles;

const AddTeamComponent = () => {

    // vars
    const [ loadingRegions, setLoadingregions ] = useState(true);
    const [ dataFullRegions, setDatafullregions ] = useState([]);
    const [ dataRegions, setDataregions ] = useState([]);

    const [ dataPokemons, setDatapokemons ] = useState([]);
    const [ namesPokemosnsAvailable, setNamespokemonsavailable ] =  useState([]);

    const [ pokemonsTeam, setPokemonsteam ] =  useState([]);

    const [ regionSelected, setRegionselected ] = useState('_no_');
    const [ cargandoPokes, setCargandoPokes ] = useState(false);

    const [ dataFullLocations, setDatafullloc ] = useState([]);
    const [ dataLocations, setDatalocations ] = useState([]);
    const [ nameRegionSelected, setNameregionselected ] = useState('');
    const [ pokedex, setPokedex ] = useState(null);

    const [ dataAreasToPokes, setDataAreasTopokes ] = useState([]);

    const [ nameTeamAdd, setNameTeam ] = useState('');
    const [ pokemonSeleccionado, setPokemonseleccionado ] = useState('_no_');

    const [ pokemonsIncluidos, setPokemonsIncludes ] = useState(null);

    useEffect(() => {
        /** get regions */
        getRegions();
    }, []);

    useEffect(() => {
        /** get locations */
        getLocations();
    }, [regionSelected]);

    const getRegions = () => {

        var url = GlobalVars.url;
    
        fetch(url + 'region/', {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        .then(response => response.json())
        .then(responseJson => {

            // console.log( responseJson );
            // console.log( responseJson.results.length );
            setDatafullregions(responseJson.results);
            setDataregions(responseJson.results);
            setLoadingregions(false);

        }).catch((error) => {
            // console.log(error);
            null;
        });
    
    }

    const filtro = (textSearch) => {

        const newData = dataFullRegions.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = textSearch.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setDataregions(newData);

    }

    const seleccionRegion = (urlRegion) => {

        setCargandoPokes(true);
    
        if( urlRegion !== '_no_' ){
            setRegionselected(urlRegion);    
        }
    
        setTimeout( () => {
    
          setCargandoPokes(false);
    
        }, 10000);
    
    }

    const getLocations = () => {
    
        fetch( regionSelected , {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        .then(response => response.json())
        .then(responseJson => {
    
            // console.log( responseJson.pokedexes[0].url );
            // console.log( responseJson.locations.length );
    
            setDatafullloc(responseJson.locations);
            setDatalocations(responseJson.locations);
            setNameregionselected(responseJson.name);
            setPokedex(responseJson.pokedexes[0].url);
            getPokemonsAvailable( responseJson.locations );
    
        }).catch((error) => {
            null;
            // console.log(error);
        });
    
    }

    const getPokemonsAvailable = (dataArr) => {

        // console.log( dataArr );
        dataArr.map((item, index) => {
    
          getLocationsAreas( item.url );
    
        });
    
    }

    const getLocationsAreas = ( uriLocation ) => {

        fetch( uriLocation , {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        .then(response => response.json())
        .then(responseJson1 => {
    
            // console.log( '-------------------------------------' );
            // console.log( responseJson1.areas );
    
            setDataAreasTopokes(responseJson1.areas);
            getAreasLocation( responseJson1.areas );
    
        }).catch((error) => {
            null;
            // console.log(error);
        });
    
    }

    const getAreasLocation = ( dataResponse ) => {

        // console.log( dataResponse );
        dataResponse.map(( item, index ) => {
    
          getDataPokesEncounters( item.url );
    
        });
    
    }

    const getDataPokesEncounters = ( uriPokemonEncounters ) => {

        // console.log( '----------------------------------' );
        // console.log( uriPokemonEncounters );
        fetch( uriPokemonEncounters , {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        .then(response => response.json())
        .then(responseJson2 => {
    
            // console.log( responseJson2.pokemon_encounters );
            let datatmp = namesPokemosnsAvailable;
            responseJson2.pokemon_encounters.map((item, index) => {
    
                //   console.log( item.pokemon );
              
                if( !namesPokemosnsAvailable.includes( item.pokemon.name ) ){
                    
                    datatmp.push( item.pokemon );
        
                }
    
            });

            // console.log( datatmp );
            setDatapokemons(datatmp);
            setNamespokemonsavailable(datatmp);
    
        }).catch((error) => {
            null;
            // console.log(error);
        });
    
    }

    const addPokemon = () => {
        
        if( pokemonSeleccionado && pokemonSeleccionado !== '_no_'){
    
          if( pokemonsTeam.filter(e => e.name === pokemonSeleccionado.name).length < 1 ){

            if( pokemonsTeam.length < 6 ){
                
                let arrtmp =  pokemonsTeam;            
                arrtmp.push( pokemonSeleccionado );

                let newrenderpokes = arrtmp.map((item, index) => {
  
                    return(
                        <TouchableOpacity
                              key={ index }
                              style={{ backgroundColor: '#E74C3C', alignSelf: 'center',
                              justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                              width: GlobalVars.windowWidth/2, height: 40, borderRadius: 4, marginTop: index > 0 ? 15 : 0 }}
                              onPress={ () => { dropPokemon(index); } }
                            >
                          <Text style={{ color: '#FFF', fontFamily: GlobalVars.fontFamily }}>Pokémon { index + 1 }: {item.name} (x)</Text>
                        </TouchableOpacity>
                    );
            
                });

                setPokemonsIncludes( newrenderpokes );
                setPokemonsteam( arrtmp );
                // console.log(pokemonsTeam);
    
            }else{
              alert( 'Solo se permiten 6 pokémones, elimina 1' );
            }
    
          }else{
            alert( 'Pokémon ya esta incluido' );
          }
    
        }else{
    
          alert( 'Elije un pokémon' );
    
        }
    
    }

    const dropPokemon = (index) => {
        let arrtemp = pokemonsTeam;
        arrtemp.splice(index, 1);  
        setPokemonsteam(arrtemp);
    }

    const generateTokenTeam = (length) => {

        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
   
    }

    const AddTeam = () => {

        if( nameTeamAdd != '' ){
    
          if( pokemonsTeam.length >= 3 ){

            let contadorTeams = 0;
            let incrementContadorTeams = 0;
    
            firebase
            .database()
            .ref('/counter/' + 1)
            .once('value', (data) => {

                //   console.log( data.toJSON() );
    
              if( data.toJSON() == null ){
    
                firebase
                .database()
                .ref('/counter/' + 1)
                .set({
                  counter: 1
                }).then( () => {                  
    
                  contadorTeams = 1;
                  firebase
                    .database()
                    .ref('/teams/' + 1)
                    .set({

                        name: nameTeamAdd,
                        pokemones: pokemonsTeam,
                        regionName: nameRegionSelected,
                        pokedex: pokedex,
                        availablePokemons: dataPokemons,
                        tokenTeam: generateTokenTeam(6),

                    }).then( () => {

                        Alert.alert('Equipo añadido');
                        setearTeams(contadorTeams);

                    }).catch((error) => { 
                        console.log(error); 
                        Alert.alert('Equipo no añadido');
                    });
    
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
                .ref('/teams/' + incrementContadorTeams)
                .set({

                    name: nameTeamAdd,
                    pokemones: pokemonsTeam,
                    regionName: nameRegionSelected,
                    pokedex: pokedex,
                    availablePokemons: dataPokemons,
                    tokenTeam: generateTokenTeam(6),

                }).then( () => {

                    Alert.alert('Eqipo añadido');
                    setearTeams(incrementContadorTeams);

                }).catch((error) => { 
                    console.log(error); 
                    Alert.alert('Equipo no añadido');
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

    const setearTeams = async (val) => {
        // console.log({val});
        try {
            const teamsincurrent = JSON.parse(await AsyncStorage.getItem("currentTeams"));
            // console.log( {teamsincurrent} );
            if( teamsincurrent ){
                AsyncStorage.removeItem('currentTeams');
                let newsteams = teamsincurrent;
                if( !newsteams.includes(val) ) { 
                    newsteams.push(val); 
                    AsyncStorage.setItem( 'currentTeams', JSON.stringify(newsteams) );
                }else{
                    Alert.alert('Ya está en este equipo');
                }
            }else{
                let newsteams = [val]; 
                AsyncStorage.setItem( 'currentTeams', JSON.stringify(newsteams) );
            }
        } catch (error) {
            // Error saving data
            // console.error();
            null;
        }
    }

    var regionsSelect = null;
    var pokemonsSelect = null;

    if( !loadingRegions ){
      regionsSelect = dataRegions.map((item, index) => 

        <Picker.Item key={index} color="#000" label={ item.name } value={ item.url } />

      );
    }

    if( namesPokemosnsAvailable.length > 0 ){

        pokemonsSelect = dataPokemons.map((item, index) => 
  
          <Picker.Item key={index} color="#000" label={ item.name } value={ {name: item.name, uri: item.url} } />
  
        );
    }

    return(
        <View style={styles.container} >
            <View style={ styles.searchContainer }>
                <AntDesign name="search1" size={24} color={GlobalVars.bluePantone} style={{ paddingRight: 5  }} />
                <TextInput
                    style={ styles.searchInput }
                    underlineColorAndroid='transparent'
                    placeholder='buscar región'
                    placeholderTextColor={GlobalVars.bluePantone}
                    onChangeText={ (text) => filtro(text) }
                    paddingLeft={20}
                    textAlignVertical='center'
                />
            </View>

            <View style={styles.selectregion} >
                <Picker style={ styles.pickerstyle }
                        itemStyle={{ height: 40, color: '#000', fontWeight: 'bold' }}
                        selectedValue={ regionSelected }
                        onValueChange={ (itemValue, itemIndex) => { seleccionRegion(itemValue); } }
                        mode={'dialog'}
                        prompt="Seleccione región"
                        >
                    <Picker.Item color="#000" label="Seleccione región" value='_no_' />
                    { regionsSelect }
                </Picker>
            </View>

            <View style={styles.inputitem} >
                <TextInput
                    style={ [styles.searchInput, { width: '100%', display: dataPokemons.length === 0 || cargandoPokes ? 'none' : 'flex', }] }
                    underlineColorAndroid='transparent'
                    placeholder='Asigna un nombre al equipo'
                    placeholderTextColor={GlobalVars.bluePantone}
                    onChangeText={ (text) => setNameTeam(text) }
                    textAlignVertical='center'
                />
            </View>

            {
                cargandoPokes
                ?
                <Text style={ styles.loadingText } >
                    Cargando Pokémones...
                </Text>
                :
                null
            }

            <View style={[ styles.selectregion, { display: dataPokemons.length === 0 || cargandoPokes ? 'none' : 'flex', } ]} >
                <Picker style={ styles.pickerstyle }
                        itemStyle={{ height: 40, color: '#000', fontWeight: 'bold' }}
                        selectedValue={ pokemonSeleccionado }
                        onValueChange={ (itemValue, itemIndex) => { setPokemonseleccionado (itemValue); } }
                        mode={'dialog'}
                        prompt="Seleccione pokémon"
                        >
                    <Picker.Item color="#000" label="Seleccione pokémon" value='_no_' />
                    { pokemonsSelect }
                </Picker>
            </View>

            <TouchableOpacity style={[ styles.plusView, { display: dataPokemons.length === 0 || cargandoPokes ? 'none' : 'flex', } ]}
                                onPress={ () => { addPokemon(); }} >
                <AntDesign name="pluscircleo" size={24} color={GlobalVars.bluePantone} />
            </TouchableOpacity>

            <View style={[ styles.pokesincludes, { display: pokemonsTeam.length ? 'flex' : 'none', } ]} >
                { pokemonsIncluidos }
            </View>

            <TouchableOpacity
                style={{ width: '100%', alignSelf: 'center', justifyContent: 'center',
                            alignContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#117864',
                            marginVertical: 15, borderRadius: 4, display: cargandoPokes ? 'none' : 'flex', }}
                onPress={ () => { AddTeam(); }}
                >
                <Text style={{ color: '#FFF', fontFamily: GlobalVars.fontFamily }}>Añadir equipo</Text>
            </TouchableOpacity>

        </View>

    );
}

export default AddTeamComponent;