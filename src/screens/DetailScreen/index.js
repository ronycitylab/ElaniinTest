import React, {useEffect, useState} from 'react';

import { 
    View, BackHandler, Alert,
    SafeAreaView, Animated, Text,
    TouchableOpacity, ActivityIndicator,
    Image, TextInput,
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

import * as firebase from 'firebase';

import Styles from './style';

const styles = Styles;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const DetailScreen = ({navigation, route}) => {

    // vars
    const [ itemTeam, setItemteam ] = useState({});
    const [ pokedexDescription, setPokedexDescription ] = useState(null);
    const [ pokemonItem, setPokemonItem ] = useState([]);
    const [ ItemsPokes, setItemsPokes ] = useState(null);
    

    useEffect( () => {
        /** Clean */
        // clearAll();

        
        
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getTeamInfo( route.params.id_team );

            return () => null;
        }, [])
    );   

    const getTeamInfo = (item) => {

        firebase
        .database()
        .ref('/teams/' + item)
        .once('value', (data) => {
    
          // console.log('-----------------------------------');
          var infoTeam = data.toJSON();
          setItemteam({
            id_key: item,
            name: infoTeam.name,
            pokedex: infoTeam.pokedex,
            pokemones: infoTeam.pokemones,
            regionName: infoTeam.regionName,
            tokenTeam: infoTeam.tokenTeam,
            availablePokemons: infoTeam.availablePokemons
          });
          // console.log( infoTeam );
          getPokedexInfo(infoTeam);
          getPokemones(infoTeam.pokemones);
        
        });
    
    }

    const getPokedexInfo = (infoTeam) => {

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
    
                setPokedexDescription( item.description );
    
              }else if( item.language.name == 'en' && !pokedexDescription ){
    
                setPokedexDescription( item.description );
    
              }
    
            });
    
          }).catch((error) => {
            console.log(error);
          });
    
    }

    const getPokemones = (pokemones) => {

        // console.log({pokemones});
        Object.keys(pokemones).map( (key) => {
    
        //   console.log( pokemones[key] );
          fetchingPokemon( pokemones[key].uri );
    
        });
    
    }

    const fetchingPokemon = (pokemonuri) => {
    
        fetch(pokemonuri, {
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
            method: 'GET',
          }).then(response => response.json())
            .then(responseJson => {
    
                // console.log( responseJson );
                //   console.log( responseJson.sprites.front_default );
    
                var obj = {};
                obj.name = responseJson.name;
                obj.image = responseJson.sprites.front_default;

                // console.log( {obj} );
                let arrtmp = pokemonItem;
                if( arrtmp.filter(e => e.name === responseJson.name).length < 1 ){
                    arrtmp.push(obj);
                    setPokemonItem(arrtmp);
                }  
                
                let temppokesrender = null;
                if( arrtmp.length ){
                    temppokesrender = arrtmp.map((item, index) => {

                        let imageCover = item.image;
                        let titles = item.name;
              
                        if( imageCover != '' && imageCover != null && imageCover != undefined ){
              
                        //   console.log( titles );
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
                              <Text style={{ marginHorizontal: 5, fontFamily: GlobalVars.fontFamily }}>{ titles }</Text>
                            </TouchableOpacity>
              
                          );
              
                        }
              
                    });
                }

                setItemsPokes( temppokesrender );
    
            }).catch((error) => {
                //   console.log(error);
                null;
            });
    
    }

    const questionExit = () => {
        navigation.goBack();
    }

    const removeTeam = async () => {
        try {
            const teamsincurrent = JSON.parse(await AsyncStorage.getItem("currentTeams"));
            // console.log( {teamsincurrent} );
            if( teamsincurrent ){
                let arrtmp = teamsincurrent;
                let indexcapture = null;
                arrtmp.map((item, index) => {
                    // console.log( {item} );
                    if( item === route.params.id_team ){ indexcapture = index; }
                });

                // console.log( {indexcapture} );
                if( indexcapture !== null && indexcapture !== undefined ){
                    AsyncStorage.removeItem('currentTeams');
                    arrtmp.splice(indexcapture, 1);
                    AsyncStorage.setItem( 'currentTeams', JSON.stringify(arrtmp) );
                    navigation.navigate('Inicio');
                    // console.log( {arrtmp} );
                }
            }
        } catch (error) {
            // Error saving data
            // console.error();
            null;
        }
    }

    const dropTeam = () => {
        removeTeam();
        firebase
        .database()
        .ref('/teams/' + route.params.id_team)
        .remove();
        navigation.navigate('Inicio');
    }

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.viewHome} >
                <StatusBarComponent />
                <HeaderHomeComponent />

                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.contentContainer} >
                    
                    { !itemTeam && <ActivityIndicator size="large" color="#000" style={{ marginTop: 25 }}/> }

                    { itemTeam.id_key && <Text style={ styles.textStyle } >Equipo #: { itemTeam.id_key }</Text> }
                    <View style={{ width: '100%', height: 2, backgroundColor: GlobalVars.bluePantone, borderRadius: 4 }}></View>
                    { itemTeam.name && <Text style={ styles.textStyle } >Equipo: { itemTeam.name }</Text> }
                    <View style={{ width: '100%', height: 2, backgroundColor: GlobalVars.bluePantone, borderRadius: 4 }}></View>
                    { pokedexDescription && <Text style={ styles.textStyle } >Equipo: { pokedexDescription }</Text> }
                    <View style={{ width: '100%', height: 2, backgroundColor: GlobalVars.bluePantone, borderRadius: 4 }}></View>
                    {
                        ItemsPokes &&
                        <ScrollView
                            horizontal={true}
                            style={{ height: 200 }}
                            contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 5 }}
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={200}
                            decelerationRate="fast" >
                            { ItemsPokes }
                        </ScrollView>
                    }
                    <View style={{ width: '100%', height: 2, backgroundColor: GlobalVars.bluePantone, borderRadius: 4 }}></View>
                    { itemTeam.tokenTeam && <Text style={ styles.textStyle } >Código de equipo (TOKEN) </Text> }
                    { 
                        itemTeam.tokenTeam &&
                        <TextInput
                          style={ [styles.searchInput, { width: '100%', marginTop: 15, }] }
                          underlineColorAndroid='transparent'
                          placeholder='Código de equipo'
                          placeholderTextColor="#48C9B0"
                          value={ itemTeam.tokenTeam }
                          textAlignVertical='center' />
                    }
                    <View style={{ width: '100%', height: 2, backgroundColor: GlobalVars.bluePantone, borderRadius: 4 }}></View>
                    { itemTeam.tokenTeam && <Text style={ styles.textStyle } >
                        Copie el código anterior y compartalo para que otros puedan ingresar a este equipo.
                        </Text> 
                    }

                    <TouchableOpacity
                        style={{ borderRadius: 7, marginTop: 15,
                                width: '100%', height: 40, backgroundColor: '#C0392B', alignContent: 'center',
                                justifyContent: 'center', alignItems: 'center', }}
                        onPress={ () => { removeTeam(); }} >
                    <Text style={{ color: '#FFF', fontFamily: GlobalVars.fontFamily }}>Salir de este equipo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                        style={{ borderRadius: 7, marginTop: 15,
                                width: '100%', height: 40, backgroundColor: '#C0392B', alignContent: 'center',
                                justifyContent: 'center', alignItems: 'center', }}
                        onPress={ () => { dropTeam(); }} >
                    <Text style={{ color: '#FFF', fontFamily: GlobalVars.fontFamily }}>Eliminar este equipo</Text>
                  </TouchableOpacity>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default DetailScreen;