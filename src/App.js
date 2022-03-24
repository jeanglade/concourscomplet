import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import {QueryClient, QueryClientProvider} from 'react-query';
import {LogBox} from 'react-native';

import './config/IMLocalize';
import Navigations from './navigations';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const queryClient = new QueryClient();

export default class App extends Component {
  render() {
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Navigations />
          </NavigationContainer>
        </QueryClientProvider>
        <FlashMessage position="top" />
      </>
    );
  }
}
