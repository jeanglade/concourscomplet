import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {Home, CompetitionSheet} from '_screens';
import {ButtonInfoApp} from '_components';
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
            <View style={styles.headerLeft}>
              <Image
                style={styles.icon}
                source={require('../icons/logo.png')}
              />
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <ButtonInfoApp />
              {/* <DropdownLanguage /> */}
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

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerLeft: {
    justifyContent: 'center',
    marginStart: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default AppNavigator;
