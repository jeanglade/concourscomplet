import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import {QueryClient, QueryClientProvider} from 'react-query';
import {LogBox} from 'react-native';

import './config/IMLocalize';
import Navigation from './navigation';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'Warning: Each child in a list should have a unique "key" prop.',
  'RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks',
  //https://github.com/react-native-netinfo/react-native-netinfo/issues/486
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
]);

const queryClient = new QueryClient();

export default class App extends Component {
  render() {
    console.log('App');
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </QueryClientProvider>
        <FlashMessage position="top" />
      </>
    );
  }
}
