import * as React from 'react';
import { Root } from 'native-base';

import TabBottom from '../BottomTab';
import AppNavigator from '../StackTabs';

const RootApp = () => (
    <Root>
        <AppNavigator TabBottom={TabBottom} />
    </Root>
);

export default RootApp;