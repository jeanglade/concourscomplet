import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ToastProvider} from 'react-native-toast-notifications';

import './app/assets/IMLocalize';
import StackNav from './app/screens/StackNav.js';

export default class App extends Component {
  render() {
    return (
      //<View></View>
      <ToastProvider>
        <NavigationContainer>
          <StackNav />
        </NavigationContainer>
      </ToastProvider>
    );
  }
}
