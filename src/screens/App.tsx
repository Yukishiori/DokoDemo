
import React, { Component } from 'react';
import { StackNavigator, createSwitchNavigator, NavigationScreenProps } from 'react-navigation';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import RestScreen from './RestScreen';
import ThinkScreen from './ThinkScreen';
import MainMapWithCardScreen from './MainMapWithCardScreen';
export default class App extends Component {
  render() {
    return (
      <SwitchNavigation />
    );
  }
}

const AuthStack = FluidNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen
});

const MainStack = FluidNavigator({
  Rest: {
    screen: RestScreen,
  },
  Think: ThinkScreen,
  MainMap: MainMapWithCardScreen
}, {
    headerMode: 'none',
  });

const SwitchNavigation = createSwitchNavigator(
  {
    Main: MainStack,
    Auth: AuthStack,
  });
