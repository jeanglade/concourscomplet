import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {Home} from '_screens';
import {FeuilleDeConcours} from '_screens';
import {ButtonInfoApp} from '_screens';
import {colors, styleSheet} from '_config';
import {MyButton} from '_components';

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
        headerTitleStyle: {
          fontSize: 20,
        },
        headerTitleAllowFontScaling: true,
        headerTitleAlign: 'left',
        headerTintColor: colors.white,
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: t('common:app_title'),
          headerLeft: () => (
            <View style={[styleSheet.flexRowCenter, {marginStart: 10}]}>
              <Image
                style={styleSheet.icon40}
                source={require('../icons/logo.png')}
              />
            </View>
          ),
          headerRight: () => (
            <View style={[styleSheet.flexRowCenter, {marginRight: 10}]}>
              <ButtonInfoApp />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="FeuilleDeConcours"
        component={FeuilleDeConcours}
        options={() => ({
          header: ({route}) => {
            return (
              <View style={{backgroundColor: colors.ffa_blue_light}}>
                {route.params.header}
              </View>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
