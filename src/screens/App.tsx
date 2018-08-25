
import React, { Component } from 'react';
import { StackNavigator, createSwitchNavigator } from 'react-navigation';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import IntroScreen from './IntroScreen';

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
  Intro: IntroScreen
});

const SwitchNavigation = createSwitchNavigator({
  Auth: AuthStack,
  Main: MainStack
});
