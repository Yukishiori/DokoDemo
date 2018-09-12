import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, DeviceEventEmitter } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';

import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { gradient } from '../../commonStyle';
import FinalCard from '../../components/FinalCard';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
// import Modal from 'react-native-modal';
import ScreenNames from '../ScreenNames';
import Layout from '../../components/Layout';
import { Content, Header, Left, Icon, Right, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';

interface IProps extends NavigationScreenProps {
  chosenPlaces: any;
  currentLocation: any;
  getEstimatedTime: any;
}

interface IState {

}

class FinalScreen extends Component<IProps, IState> {
  map: MapView = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.00070,
        longitudeDelta: 0.0070,
      },
      isModalVisible: false
    };
  }

  renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
    return <FinalCard
      place={item}
    />
  }

  componentDidMount() {
    this.props.getEstimatedTime({ chosenPlaces: this.props.chosenPlaces, currentLocation: this.props.currentLocation });
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      this.props.navigation.navigate(ScreenNames.MainMap)
    });
  }

  calculateTotalTime = (chosenPlaces: any) => {
    return chosenPlaces.reduce((sums: number, val: any) => {
      return sums += val.estimatedTime ? val.estimatedTime.value : 0
    }, 0);
  }

  secondsToHms = (d: number) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    return hDisplay + mDisplay;
  }

  render() {
    return (
      <Layout>
        <View style={styles.BigContainer}>
          <Header style={styles.HeaderContainer}>
            <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
              <Left style={{ flex: 1, alignItems: 'flex-start' }}>
                <Button transparent onPress={() =>
                  this.props.navigation.navigate(ScreenNames.MainMap)
                } style={{ justifyContent: 'flex-start' }}>
                  <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 20 }} />
                </Button>
              </Left>
              <View style={{ flex: 1 }} />
            </LinearGradient>
          </Header>
          <ScrollView contentContainerStyle={styles.BigScrollViewContainer}>
            <LinearGradient style={styles.BigLinearGradient} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
              <View>
                <View>
                  <FlatList
                    data={this.props.chosenPlaces}
                    renderItem={this.renderItem}
                    keyExtractor={(_item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View style={styles.SumsContainer}>
                  <AppText style={styles.EstimateTime}>Total estimate moving time : </AppText>
                  <AppText style={styles.EstimateNumber}>{this.secondsToHms(this.calculateTotalTime(this.props.chosenPlaces))}</AppText>
                  <TouchableOpacity>
                    <LinearGradient style={styles.GoButton} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                      <View>
                        <AppText style={{ color: 'white' }}>Let's go</AppText>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ScrollView >
        </View >
      </Layout>
    );

  }
}

const mapState = (rootState: IRootState) => {
  return {
    ...rootState.mapScreenModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.mapScreenModel
  };
};

export default connect(mapState, mapDispatch)(FinalScreen);
