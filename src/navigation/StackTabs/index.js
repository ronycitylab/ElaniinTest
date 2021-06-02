import React, {useState, useEffect} from 'react';

import MainStack from './MainStack';
import LoadStack from './LoadStack';

import GlobalStyles from '../../global/globalVars';

const AppNavigator = ({TabBottom}) => {

    const [ redirect, setRedirect ]= useState('Home');

    return <MainStack TabBottom={TabBottom} redirect={redirect} />;
    
};

export default AppNavigator;