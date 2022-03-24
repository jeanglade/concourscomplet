import React from 'react';
import {View, Image, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {Home, CompetitionSheet} from '_screens';
import {ButtonInfoApp, DropdownLanguage} from '_components';
import {colors} from '_config';

const Stack = createStackNavigator();

function AppNavigator() {
  const [t] = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.ffa_blue_light,
        },
        headerTintColor: colors.white,
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: t('common:app_title'),
          headerLeft: () => (
            <View
              style={{
                justifyContent: 'center',
                marginStart: 10,
              }}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                }}
                source={require('../icons/logo.png')}
              />
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ButtonInfoApp />
              <DropdownLanguage />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="CompetitionSheet"
        component={CompetitionSheet}
        options={{
          title: t('common:competition_sheet'),
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
