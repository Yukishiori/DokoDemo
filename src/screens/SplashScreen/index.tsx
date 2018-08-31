import React, { Component } from 'react';
import {
  Text, Image, Dimensions,
  View, StyleSheet
} from 'react-native';
import firebase from 'firebase';
import { NavigationScreenProps } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';
import { gradient } from '../../commonStyle';
import styles from './styles';
import ScreenNames from '../ScreenNames';

interface IProps extends NavigationScreenProps {
  changeEmail: any;
  login: any;
  changePassword: any;
  email: string;
  password: string;
}

class SplashScreen extends Component<IProps> {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(res => {
      console.log(res);
      res !== null
      ? setTimeout(() => this.props.navigation.navigate(ScreenNames.RestScreen), 500)
      : setTimeout(() => this.props.navigation.navigate(ScreenNames.RestScreen), 500)
    })
  };

  render() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.BackgroundGradient}>
          <AppText style={{fontSize: 30}}>Dokodemo</AppText>
        </LinearGradient>
      </View>
    );
  }
}

export default SplashScreen;