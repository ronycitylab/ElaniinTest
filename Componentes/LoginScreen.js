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

export default class LoginScreen extends React.Component {

  constructor(){

    super();
    this.state = {
      
      device_IMEI: Constants.deviceId,
      dataFull: [],
      data: [],

    };
  
  }

  componentDidMount(){

    // console.log( globalVars.androidClientId );
    this.checkLogged();
    // console.log( firebase.auth().currentUser );

  }

  checkLogged = () => {
    firebase.auth().onAuthStateChanged( (user) => {

        if(user){

          this.navigateToNextScreen('Home');

        }

    });
  }

  navigateToNextScreen = (screen) => {

    this.props.navigation.navigate( screen );

  }

  signInWithGoogleAsync = async () => {
    
    try {

      const result = await Google.logInAsync({

        // behavior: 'web',
        androidClientId: globalVars.androidClientId,
        scopes: ['profile', 'email'],

      });
      // console.log( result );

      if (result.type === 'success') {

        this.onSignIn(result);
        return result.accessToken;

      }else {

        return { cancelled: true };

      }

    }catch (e) {

      return { error: true };

    }

  }


  crashlyticsFuntion = async (userI) => {

    crashlytics().log('User signed in.');
    await Promise.all([
      crashlytics().setUserId(userI.user.uid),
      crashlytics().setAttributes({
        role: 'user',
        email: userI.user.email,
        username: userI.additionalUserInfo.profile.given_name + userI.additionalUserInfo.profile.family_name
      }),
    ]);

  }


  onSignIn = (googleUser) => {

    var initTeam = [];

    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged( (firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential)
        .then( (result) => {

          // console.log('result', result);

          this.crashlyticsFuntion(result);

          console.log(' Usuario Signed in ');
          if( result.additionalUserInfo.isNewUser ){
            firebase
            .database()
            .ref('/users/' + result.user.uid)
            .set({
                gmail: result.user.email,
                profilePicture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
                created_at: Date.now(),
                last_logged_in: Date.now(),
                teams_involucrated: null, 
            }).then( () => {

                

            }).catch((error) => { 
                console.log(error); 
              });

          }else{

            firebase
            .database()
            .ref('/users/' + result.user.uid)
            .update({
              last_logged_in: Date.now()
            });
          }
          

        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          console.log( error );
        });

      } else {
        console.log('User already signed-in Firebase.');
      }
    });

  }

  
  isUserEqual = (googleUser, firebaseUser) => {
    
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;

  }


  render(){

    return(

            <View style={ styles.container }>
              
              <StatusBar backgroundColor={ globalVars.fondoPrincipal } barStyle="light-content" />
              <View style={{ width: '100%', height: screenHeight/7, justifyContent: 'center',
                              alignContent: 'center', alignItems: 'center', backgroundColor: globalVars.fondoPrincipal }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF' }}>Elaniin Test</Text>
                <Text style={{ fontSize: 16, color: '#FFF', fontWeight: '400', marginTop: 10 }}>Rony Santos</Text>
              </View>
              
              <View style={{ height: screenHeight - 150, justifyContent: 'center', alignContent: 'center',
                              alignItems: 'center', width: '100%', paddingHorizontal: 10 }}>

                <TouchableOpacity
                    style={ styles.buttonG }
                    onPress={ () => { this.signInWithGoogleAsync() }}
                    >
                  <Text style={ styles.textButton }>Iniciar con Google</Text>
                </TouchableOpacity>

                <View style={{ width: '100%', height: 20 }}></View>

                <TouchableOpacity
                    style={ styles.buttonF }
                    onPress={ () => { }}
                    >
                  <Text style={ styles.textButton }>Iniciar con Facebook</Text>
                </TouchableOpacity>

              </View>
            
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
        backgroundColor: '#FFF'
    },

    buttonG: {
      width: '85%',
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      borderRadius: 25,
      backgroundColor: '#C0392B',
    }, 

    buttonF: {
      width: '85%',
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      borderRadius: 25,
      backgroundColor: '#0033CC'
    },

    textButton: {
      color: '#FFF',
      fontWeight: '500',
      fontSize: 18
    }

});
