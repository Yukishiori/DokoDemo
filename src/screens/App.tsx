
import React, { Component } from 'react';
import { StackNavigator, createSwitchNavigator, NavigationScreenProps } from 'react-navigation';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import SplashScreen from './SplashScreen';
import RestScreen from './RestScreen';
import ThinkScreen from './ThinkScreen';
import MainMapWithCardScreen from './MainMapWithCardScreen';
import { Provider } from 'react-redux';
import store from '../rematch/store';
import LikeDisLikeScreen from './LikeDislikeScreen';
import bootstrapFirebase from '../bootstrap/bootstrap-firebase';
import DiscussAndDetailScreen from './DiscussAndDetailScreen';
import FinalScreen from './FinalScreen';
// import Discuss


bootstrapFirebase();
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SwitchNavigation />
      </Provider>
    );
  }
}

const AuthStack = FluidNavigator({
  Splash: SplashScreen,
  SignUp: SignUpScreen,
  Login: LoginScreen,
});

const MainStack = FluidNavigator({
  Rest: {
    screen: RestScreen,
  },
  Think: ThinkScreen,
  MainMap: MainMapWithCardScreen,
  LikeDisLikeScreen: LikeDisLikeScreen,
  Discuss: DiscussAndDetailScreen,
  Final: FinalScreen
}, {
    headerMode: 'none',
  });

const SwitchNavigation = createSwitchNavigator(
  {
    Auth: AuthStack, 
    Main: MainStack,
  });
