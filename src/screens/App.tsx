
import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator, createSwitchNavigator, NavigationScreenProps, createDrawerNavigator, createStackNavigator } from 'react-navigation';
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
import { Root } from 'native-base';
// import Discuss

bootstrapFirebase();
export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Root>
          <MenuStack />
        </Root>
      </Provider>
    );
  }
}

const FluidStack = createStackNavigator(
  {
    Splash: SplashScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    Rest: RestScreen,
    Think: ThinkScreen,
    Profile: ProfileScreen,
    MainMap: MainMapWithCardScreen,
    LikeDisLikeScreen: LikeDisLikeScreen,
    Discuss: DiscussAndDetailScreen,
    Search: SearchScreen,
    Final: FinalScreen,
  },
  {
    headerMode: 'none',
  }
)

const MenuStack = createDrawerNavigator(
  {
    FluidStack: FluidStack
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

