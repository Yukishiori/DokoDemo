
import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator, createSwitchNavigator, NavigationScreenProps, createDrawerNavigator } from 'react-navigation';
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
import SearchScreen from './SearchScreen';
import FinalScreen from './FinalScreen';
import SideBar from '../components/SideBar';
import ProfileScreen from './ProfileScreen';
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
  // Profile: ProfileScreen,
  Splash: SplashScreen,
  SignUp: SignUpScreen,
  Login: LoginScreen,
});

const MenuStack = createDrawerNavigator(
  {
    Rest: RestScreen,
    Think: ThinkScreen,
    Profile: ProfileScreen,
    MainMap: MainMapWithCardScreen,
    LikeDisLikeScreen: LikeDisLikeScreen,
    Discuss: DiscussAndDetailScreen,
    Search: SearchScreen,
    Final: FinalScreen
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

const SwitchNavigation = createSwitchNavigator(
  {
    Auth: AuthStack,
    Menu: MenuStack,
  });
