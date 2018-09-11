import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';

import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { gradient } from '../../commonStyle';
import FinalCard from '../../components/FinalCard';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import Modal from 'react-native-modal';
import ScreenNames from '../ScreenNames';
import Layout from '../../components/Layout';
import { Content, Header, Left, Icon, Right, Button, CheckBox } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';
import config from '../../../config';
import ProgressBar from 'react-native-progress/Bar';

interface IProps extends NavigationScreenProps {
  chosenPlaces: any;
  currentLocation: any;
  getEstimatedTime: any;
  polylineCoords: any;
}

interface IState {
  region: {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  },
  isModalVisible: boolean;
  isChecked: boolean;
}

class FinalScreen extends Component<IProps, IState> {
  map: MapView = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      region: {
        ...props.currentLocation,
        latitudeDelta: 0.00070,
        longitudeDelta: 0.0070,
      },
      isModalVisible: false,
      isChecked: false
    };
  }

  renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
    return <FinalCard
      place={item}
    />
  }

  componentDidMount() {
    this.props.getEstimatedTime({ chosenPlaces: this.props.chosenPlaces, currentLocation: this.props.currentLocation });
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

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    return hDisplay + mDisplay;
  }

  renderMarker = () => {
    return this.props.chosenPlaces.map((chosenPlace: any, index: number) =>
      <Marker
        coordinate={{
          longitude: chosenPlace.geometry.location.lng,
          latitude: chosenPlace.geometry.location.lat
        }} key={index} title={chosenPlace.name}
      />
    )
  }

  renderPolyline = () => {
    return this.props.polylineCoords
      && <Polyline
        coordinates={this.props.polylineCoords}
        strokeWidth={6}
        strokeColor={gradient[1]}
      />
  }

  render() { 
    return (
      <Layout style={styles.BigContainer}>
        <Header style={styles.HeaderContainer}>
          <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
            <Left style={{ flex: 1, alignItems: 'flex-start' }}>
              <Button transparent onPress={() => this.props.navigation.goBack()} style={{ justifyContent: 'flex-start' }}>
                <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 20 }} />
              </Button>
            </Left>
            <View style={{ flex: 1 }} />
          </LinearGradient>
        </Header>
        <View>
          <MapView
            ref={map => { this.map = map; }}
            style={styles.Map}
            showsUserLocation={true}
            provider="google"
            customMapStyle={config.mapStyle}
            region={this.state.region}>
            {this.renderMarker()}
            {this.renderPolyline()}
          </MapView>
        </View> 
        <LinearGradient style={styles.BigLinearGradient} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
          <View style={{flex: 1, marginBottom: 30}}>
            <FlatList
              data={this.props.chosenPlaces}
              renderItem={this.renderItem}
              keyExtractor={(_item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.SumsContainer}>
            <View style={{marginHorizontal : 20, marginBottom: 20, marginTop: 5}}>
              <ProgressBar progress={0.5} width={null} height={10} color="rgba(105, 224, 31, 1)"></ProgressBar>
            </View>
            <AppText style={styles.EstimateTime}>Total time : {this.secondsToHms(this.calculateTotalTime(this.props.chosenPlaces))}</AppText>
            <TouchableOpacity style={{marginBottom: 5}}>
              <LinearGradient style={styles.GoButton} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                <View>
                  <AppText style={{ color: 'white' }}>Done</AppText>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Layout >
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
