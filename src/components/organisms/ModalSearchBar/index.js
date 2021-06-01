import * as React from 'react';

import { 
  View, Modal, TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { AntDesign } from '@expo/vector-icons'; 

import AsyncStorage from '@react-native-community/async-storage';

/** Import Global vars */
import GlobalVars from '../../../global/globalVars';

import Styles from './style';

const styles = Styles;

const ModalSearchBar = ({ visible = true, searchlabel = "Buscar", ...props }) => {

  const [modalVisible, setModalVisible] = React.useState(visible);

  const Action = () => {
    setModalVisible(!modalVisible);
    if( props.ctrlModal ){
      props.ctrlModal();
    }
  }

  const updateSearch = (search) => {
    if( props.changeTextSearch ){
      props.changeTextSearch(search);
    }
  }

  return(
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          null;
        }}
    >
        <View style={styles.centeredView} >
          <View style={styles.modalView} >

            { /** Close Element */ }
            <TouchableOpacity style={ styles.closeElement } onPress={Action} >
              <AntDesign name="close" size={20} color={GlobalVars.firstColor} />
            </TouchableOpacity>
            {/* Search Bar */}
            <SearchBar
              placeholder={searchlabel}
              value={ props.searchText ? props.searchText : '' }
              onChangeText={(text) => updateSearch(text)}
              underlineColorAndroid="transparent"
              // editable={false}
              lightTheme={true}
              containerStyle={ styles.containerSearch }
              inputContainerStyle={ styles.inputContainerStyle }
              inputStyle={ styles.inputStyle }
              leftIconContainerStyle={ styles.leftIconContainerStyle } /> 
              
          </View>
        </View>
    </Modal>
  );
}

export default ModalSearchBar;