import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import HomeScreen from '../HomeScreen';
import CompetitionSheetScreen from '../CompetitionSheetScreen';
import LogoHeaderBar from './LogoHeaderBar';
import InfoApp from './InfoApp';
import R from '../../assets/R';

const Stack = createStackNavigator();

function StackNav() {
  const [t] = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: R.colors.ffa_blue_light,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('common:app_title'),
          headerLeft: () => <LogoHeaderBar />,
          headerRight: () => <InfoApp />,
        }}
      />
      <Stack.Screen
        name="CompetitionSheet"
        component={CompetitionSheetScreen}
        options={{
          title: t('common:competition_sheet'),
        }}
      />
    </Stack.Navigator>
  );
}

export default StackNav;
