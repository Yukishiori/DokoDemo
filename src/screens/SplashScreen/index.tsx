import React, { Component } from 'react';
import {
  Text, Image, Dimensions,
  View, StyleSheet
} from 'react-native';
import firebase from 'firebase';
import { Alert } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';
import { gradient } from '../../commonStyle';
import styles from './styles';
import ScreenNames from '../ScreenNames';
import { connect } from 'react-redux';
import { ICoord } from '../../service/interface.service';

interface IProps extends NavigationScreenProps {
  changeEmail: any;
  login: any;
  changePassword: any;
  email: string;
  password: string;
  retriveDataSuccess: any;
  createOrUpdateFirebaseUser: any;
  getData: (arg: string) => Promise<any>;
  persistChosenPlaces: (arg: any) => void;
  persistCheckedPlaces: (arg: any) => void;
  updateCurrentLocation: (coord: ICoord) => void;
}

class SplashScreen extends Component<IProps> {
  componentDidMount() {
    // firebase.auth().signOut();

    // this.props.getData('checked-places');

    firebase.auth().onAuthStateChanged(res => {
      if (res) {
        if (res.providerData && res.providerData.length) {
          this.props.createOrUpdateFirebaseUser({
            result: {
              email: res.providerData[0].email,
              displayName: res.providerData[0].displayName,
              photoURL: res.providerData[0].photoURL
            }, uid: res.uid
          });
        }
        firebase.firestore().collection('users').doc(res.uid).get().then((doc) => {
          if (doc.exists) {
            this.props.retriveDataSuccess({ result: doc.data(), uid: res.uid });
          } else {
            Alert.alert(
              'Cannot fetch data, please log out and try again!',
              "",
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false }
            )
          }

          // Get data from AsyncStorage
          this.props.getData('chosen-places').then((chosenPlaces) => {
            if (chosenPlaces) {
              this.props.getData('checked-places').then((checkedPlaces) => {
                if (checkedPlaces) {
                  this.props.persistChosenPlaces(chosenPlaces);
                  this.props.persistCheckedPlaces(checkedPlaces);
                  navigator.geolocation.getCurrentPosition(
                    (position: Position) => {
                      this.props.updateCurrentLocation(position.coords);
                      this.props.navigation.navigate(ScreenNames.FinalScreen);
                    }
                  );
                } else {
                  setTimeout(() => this.props.navigation.navigate(ScreenNames.RestScreen), 500)
                }
              })
            } else {
              setTimeout(() => this.props.navigation.navigate(ScreenNames.RestScreen), 500)
            }
          }).catch((_err) => {
            console.log(_err);
            setTimeout(() => this.props.navigation.navigate(ScreenNames.RestScreen), 500)
          });
        })
      } else {
        setTimeout(() => this.props.navigation.navigate(ScreenNames.LoginScreen), 500)
      }
    })
  };

  render() {
    return (
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View style={styles.BackgroundGradient}>
          <Image source={require('../../../assets/images/appLogo.png')} style={styles.Logo} />
          <AppText style={{ fontSize: 30, color: 'white', marginTop: '5%' }}>Dokodemo</AppText>
        </View>
      </LinearGradient>
    );
  }
}


const mapState = (rootState: any) => {
  return {
    ...rootState.profileModel,
    ...rootState.mapScreenModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.profileModel,
    ...rootReducer.mapScreenModel
  };
};

export default connect(mapState, mapDispatch)(SplashScreen);