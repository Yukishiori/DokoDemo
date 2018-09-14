import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, DeviceEventEmitter } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';
import { width, height } from '../../commonStyle';
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
import StarRating from 'react-native-star-rating';
import { Transition } from 'react-navigation-fluid-transitions';

interface IProps extends NavigationScreenProps {
  chosenPlaces: any;
  currentLocation: any;
  polylineCoords: any;
  addOrRemoveCheckedPlaces: any;
  checkedPlaces: any;
  ratingModalVisible: boolean;
  toggleRatingModal: (arg?: boolean) => void;
  changeRating: (arg: number) => void;
  rating: number;
  uid: string;
  email: string;
  displayName: string;
  isBusy: boolean;
  submitPlacesAndRating: (arg: any) => void;
  storeData: any;
  startTime: number;
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
  markers: Marker[] = [];
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

  submitRating = async () => {
    await this.props.submitPlacesAndRating({
      user: {
        uid: this.props.uid,
        email: this.props.email,
        name: this.props.displayName
      },
      places: this.props.chosenPlaces.map((val: any) => {
        return {
          placeId: val.place_id,
          placeName: val.name,
          isCompleted: this.props.checkedPlaces.filter((checkedPlace: any) => checkedPlace.placeId === val.place_id).length > 0
        };
      }),
      rating: this.props.rating,
      createTime: Date.now(),
    });
    await this.props.storeData({
      key: 'checked-places',
      value: null
    })
    await this.props.storeData({
      key: 'chosen-places',
      value: null
    })
    await this.props.storeData({
      key: 'start-time',
      value: null
    })
    await this.props.storeData({
      key: 'polylines',
      value: null
    })
    this.props.navigation.navigate(ScreenNames.RestScreen);
  }

  renderItem = ({ item, index }: { item: IPlaceFromGoogle, index: number }) => {
    return <FinalCard
      place={item}
      startTime={this.props.startTime}
      onChecked={this.addOrRemoveCheckedPlaces}
      checkedPlaces={this.props.checkedPlaces}
      onPress={() => {
        this.markers[index + 1].showCallout();
        this.map.animateToCoordinate({
          longitude: item.geometry.location.lng,
          latitude: item.geometry.location.lat
        })
      }
      }
    />
  }

  addOrRemoveCheckedPlaces = async (payload: {
    placeId: string,
    placeName: string,
    endTime: number,
    movingTime: number
  }) => {
    await this.props.addOrRemoveCheckedPlaces(payload);
    await this.props.storeData({
      key: 'checked-places',
      value: this.props.checkedPlaces
    })
  }

  componentDidMount() {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      this.props.navigation.navigate(ScreenNames.MainMap)
    });

  }

  calculateTotalTime = (chosenPlaces: any) => {
    return chosenPlaces.length ? Math.floor((chosenPlaces[chosenPlaces.length - 1].endTime - this.props.startTime)/1000) : 0;
  }

  secondsToHms = (d: number) => {
    d = Number(d);
    var day = Math.floor(d / (3600 * 24));
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var dDisplay = day > 0 ? day + (day == 1 ? " day" : " days") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    if (!day && !h && !m) {
      var sDisplay = Math.floor(d) > 0 ? Math.floor(d) + (Math.floor(d) == 1 ? " second" : " seconds") : "";
      return sDisplay;
    }
    return dDisplay + hDisplay + mDisplay;
  }

  renderMarker = () => {
    const chosenPlaces = [this.props.currentLocation, ...this.props.chosenPlaces];
    return chosenPlaces.map((chosenPlace: any, index: number) =>
      index === 0
        ? <Marker
          ref={marker => { this.markers[index] = marker }}
          coordinate={{
            longitude: chosenPlace.longitude,
            latitude: chosenPlace.latitude
          }} key={index} title='Start'
        />
        : <Marker
          ref={marker => { this.markers[index] = marker }}
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
    const chosenPlaces = [this.props.currentLocation, ...this.props.chosenPlaces];
    return (
      <Layout style={styles.BigContainer}>
        <Header style={styles.HeaderContainer}>
          <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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
        <View style={{ flex: 1 }}>
          <MapView
            ref={map => {
              this.map = map;
            }}
            style={styles.Map}
            showsUserLocation={true}
            provider="google"
            customMapStyle={config.mapStyle}
            onLayout={() => {
              this.map.fitToCoordinates(chosenPlaces.map(
                (chosenPlace: any, index: number) =>
                  index === 0
                    ? ({
                      latitude: chosenPlace.latitude,
                      longitude: chosenPlace.longitude
                    })
                    : ({
                      latitude: chosenPlace.geometry.location.lat,
                      longitude: chosenPlace.geometry.location.lng
                    })
              ), {
                  edgePadding: { top: 50, right: 20, bottom: 20, left: 20 }
                });
            }

            }
          >
            {this.renderMarker()}
            {this.renderPolyline()}
          </MapView>
        </View>
        <LinearGradient style={styles.BigLinearGradient} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
          <View style={{ flex: 2 }}>
            <FlatList
              data={this.props.chosenPlaces}
              renderItem={this.renderItem}
              keyExtractor={(_item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.SumsContainer}>
            <AppText style={styles.EstimateTime}>Total time : {this.secondsToHms(this.calculateTotalTime(this.props.checkedPlaces))}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <View style={{ flex: 2 }}>
                {this.props.chosenPlaces.length > 0 && <ProgressBar progress={this.props.checkedPlaces.length / this.props.chosenPlaces.length} width={null} height={10} color={gradient[1]} />}
              </View>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.toggleRatingModal(true)}>
                <LinearGradient style={styles.GoButton} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                  <AppText style={{ color: 'white' }}>Done</AppText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <Modal
          isVisible={this.props.ratingModalVisible}
          onBackdropPress={() => this.props.toggleRatingModal(false)}
          onSwipe={() => this.props.toggleRatingModal(false)}
          swipeDirection="left"
        >
          <View style={{ backgroundColor: 'white', paddingHorizontal: width * 0.1, borderRadius: 5, paddingVertical: height * 0.03 }}>
            <AppText style={{ fontSize: 16, color: '#f55555', textAlign: 'center', marginBottom: 10 }}>Enjoy your trip? Rate it!</AppText>
            <StarRating
              disabled={false}
              maxStars={5}
              fullStarColor={gradient[0]}
              rating={this.props.rating}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              iconSet={'Ionicons'}
              selectedStar={(rating: number) => this.props.changeRating(rating)}
            />
            <TouchableOpacity style={{ marginBottom: 5, marginTop: height * 0.01 }} onPress={this.submitRating}>
              <LinearGradient style={styles.GoButton} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                <View>
                  <AppText style={{ color: 'white' }}>Submit</AppText>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Modal>
      </Layout >
    );

  }
}

const mapState = (rootState: IRootState) => {
  return {
    ...rootState.mapScreenModel,
    ...rootState.profileModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.mapScreenModel,
    ...rootReducer.profileModel
  };
};

export default connect(mapState, mapDispatch)(FinalScreen);
