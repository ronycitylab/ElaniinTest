import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const GlobalVars = {

	/** Tracking & Register Config */
    firebaseConfig: {

		apiKey: "AIzaSyALvDDhkzU28lHE8aA85HNAzkYFNQe7ZII",
		authDomain: "elaniintest-724db.firebaseapp.com",
		databaseURL: "https://elaniintest-724db-default-rtdb.firebaseio.com",
		projectId: "elaniintest-724db",
		storageBucket: "elaniintest-724db.appspot.com",
		messagingSenderId: "938309370737",
		appId: "1:938309370737:web:c69748c116f4a0a45aacd0",
		measurementId: "G-0PH8RWZ122"
	    
	},


	/** API PATH **/
	url: "https://pokeapi.co/api/v2/",


	/** Fonts generals fields */
	fontFamily: 'Montserrat',


	/** View Configurations */
	fondoPrincipal: '#FFF',
	white: '#FFF',
	black: '#000',
	googleColor: '#DC1327',
	facebookColor: '#003B8B',
	firstColor: '#BA0E18',
	grisColor: '#3C3C3C',
	grisOscuro: '#BABABA',
	grisIntermediate: '#717171',
	grisPlane: 'rgba(117, 117, 117, 0.2)', 
	grisText: 'rgba(60, 60, 60, 1)',
	bluePantone: 'rgba(0, 32, 91, 1)',
	azulOscuro: '#3F3D56',


	/** ViewPort Dimensions */
	windowWidth: windowWidth,
	windowHeight: windowHeight,

};

export default GlobalVars;