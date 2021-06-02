import * as React from 'react';
import { 
    View, Text,
} from 'react-native';

/** Import Componentes Custom */
import TitleComponent from '../../atoms/Titles';

/** Import Global Variables */
import GlobalVars from '../../../global/globalVars';

/** Import Styles for this Screen */
import Styles from './style';

const styles = Styles;
export default function HeaderHomeComponent(props) {

    const [ printLabel, setPrintlabel ] = React.useState('');

    React.useEffect( () => {
        // console.log(name);
    }, []);

    const setearDayLabel = () => {
        var today = new Date();
        var curHr = today.getHours();
        
        if (curHr < 12) {
            return ( TranslateText(lang, 'buenos dias') );
        } else if (curHr < 18) {
            return ( TranslateText(lang, 'buenas tardes') );
        } else {
            return( TranslateText(lang, 'buenas noches') );
        }
    }

    return (
        <View style={ styles.rootView }>
            <TitleComponent color={GlobalVars.white} title="Elaniin" size={20} />
            <TitleComponent color={GlobalVars.white} title="Bienvenido" size={18} />
        </View>
    );
}