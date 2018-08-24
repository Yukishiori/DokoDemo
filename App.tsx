/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import config from './config';

import firebase from 'firebase';
import AppText from './src/components/AppText';
firebase.initializeApp(config.firebaseConfig);

type Props = {};
export default class App extends Component<Props> {
  render() {
    console.log(firebase);
    return (
      <View style={styles.container}>
        <MapView style={{ width: 100, height: 100 }}
          provider='google'
        />
        <AppText>Yasuo</AppText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
