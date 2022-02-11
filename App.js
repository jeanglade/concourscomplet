import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import './app/assets/IMLocalize';
import StackNav from './app/screens/navbar/StackNav.js';

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    );
  }
}
