
import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator, NavigationScreenProps } from 'react-navigation';
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

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    SignUp: SignUpScreen,
}, {
        headerMode: 'none',
    });

const MainStack = FluidNavigator({
    Rest: {
        screen: RestScreen,
    },
    Think: ThinkScreen,
    MainMap: MainMapWithCardScreen,
    LikeDisLikeScreen: LikeDisLikeScreen,
    Discuss: DiscussAndDetailScreen,
    Search: SearchScreen,
    Final: FinalScreen
}, {
        headerMode: 'none',
    });

const SwitchNavigation = createSwitchNavigator(
    {
        Splash: SplashScreen,
        Auth: AuthStack,
        Main: MainStack,
    });
