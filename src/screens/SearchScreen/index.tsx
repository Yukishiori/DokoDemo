import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator, FlatList, DeviceEventEmitter } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
import { Transition } from 'react-navigation-fluid-transitions';
import Layout from '../../components/Layout';
import { Header, Left, Right, Icon, Content, Button, Footer, Toast } from 'native-base';
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import MapView, { Marker } from 'react-native-maps';
import config from '../../../config';
import ScreenNames from '../ScreenNames';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { ICoord } from '../../service/interface.service';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import placeService from '../../service/place.service';
import PlaceCard from '../../components/PlaceCard';
import moment from 'moment';
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
interface IProps extends NavigationScreenProps {
  photoURL: string;
  currentLocation: ICoord;
  chosenPlaces: IPlaceFromGoogle[],
}

interface IState {
  text: string;
  searchedLocations: IPlaceFromGoogle[],
  loading: boolean,
  sessionToken: number,
  predictions: string[];
  blur: boolean;
}



const itemVisiblePercentThreshold = {
  itemVisiblePercentThreshold: 50
}

class SearchScreen extends Component<IProps, IState> {
  map: MapView = null;
  markers: Marker[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      text: "",
      searchedLocations: [],
      loading: false,
      sessionToken: moment().unix(),
      predictions: [],
      blur: true
    }
  }

  onTextChange = (text: string) => {
    this.setState({
      text
    });
    placeService.getAutoComplete(text, this.props.currentLocation, 1500, this.state.sessionToken)
      .then(predictions =>
        this.setState({
          predictions
        }))
      .catch(err => {
        console.log(err)
      })
  }

  componentDidMount() {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      this.goBack()
    });
  }

  goBack = () => {
    // if (!this.state.blur) {
    //   this.setState({ blur: true })
    // } else {
    this.props.chosenPlaces && this.props.chosenPlaces.length > 0
      ? this.props.navigation.navigate(ScreenNames.MainMap)
      : this.props.navigation.goBack()
    // }
  }

  renderPrediction = ({ item }: { item: string }) =>
    <TouchableOpacity onPress={() => {
      this.setState({
        text: item
      }, () => {
        this.search()
      })
    }}>
      <View style={styles.PredictionCard}>
        <AppText>{item}</AppText>
      </View>
    </TouchableOpacity>


  search = () => {
    this.setState({
      loading: true,
      blur: true
    })
    placeService.getPlaceFromKeyword(
      this.props.chosenPlaces.length > 0
        ? {
          latitude: this.props.chosenPlaces[this.props.chosenPlaces.length - 1].geometry.location.lat,
          longitude: this.props.chosenPlaces[this.props.chosenPlaces.length - 1].geometry.location.lng
        } : this.props.currentLocation, this.props.chosenPlaces.length ? this.props.chosenPlaces.length : 0, this.state.text).then((res: IPlaceFromGoogle[]) => {
          this.setState(
            {
              searchedLocations: res,
              loading: false
            },
            () => {
              if (this.state.searchedLocations && this.state.searchedLocations.length > 0) {
                this.map.fitToCoordinates([{
                  geometry: {
                    location: {
                      lat: this.props.currentLocation.latitude,
                      lng: this.props.currentLocation.longitude
                    }
                  }
                }, ...this.state.searchedLocations, ...this.props.chosenPlaces].map(
                  searchedLocation => ({
                    latitude: searchedLocation.geometry.location.lat,
                    longitude: searchedLocation.geometry.location.lng
                  })
                ), {
                    edgePadding: { top: 50, right: 30, bottom: 50, left: 30 }
                  })
              } else {
                Toast.show({
                  text: "Find nothing match this place",
                  buttonText: "Okay",
                  duration: 3000,
                  type: "danger",
                  textStyle: { fontFamily: 'Comfortaa-Bold' }
                })
              }
            }
          )
        })
  }

  renderMarker = () => {
    if (this.state.searchedLocations && this.state.searchedLocations.length > 0) {
      return this.state.searchedLocations.map((searchedLocation, index) => {
        return <Marker
          ref={marker => { this.markers[index] = marker }}
          key={searchedLocation.place_id}
          title={searchedLocation.name}
          onPress={() => this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, {
            chosenPlace: searchedLocation,
            fromSearch: true
          })
          }
          coordinate={{
            latitude: searchedLocation.geometry.location.lat,
            longitude: searchedLocation.geometry.location.lng
          }}
          pinColor="gold"
        />
      })
    }
  }

  renderChosenPlaceMarker = () => {
    return [
      {
        place_id: 'user',
        name: 'Start',
        geometry: {
          location: {
            lat: this.props.currentLocation.latitude,
            lng: this.props.currentLocation.longitude
          }
        }
      }
      , ...this.props.chosenPlaces].map((chosenPlace, index) =>
        <Marker
          key={chosenPlace.place_id}
          title={chosenPlace.name}
          coordinate={{
            latitude: chosenPlace.geometry.location.lat,
            longitude: chosenPlace.geometry.location.lng
          }} />

      )
  }

  renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
    return <PlaceCard
      cannotDelete
      place={item}
      onPress={() => this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, {
        chosenPlace: item,
        fromSearch: true
      })}
    />
  }

  onViewableItemsChanged = ({ viewableItems, changed }: any) => {
    try {
      this.markers[0].showCallout();
      if (viewableItems[0].index > -1) {
        const { lat, lng } = this.state.searchedLocations[viewableItems[0].index].geometry.location;
        this.map.animateToCoordinate({ latitude: lat, longitude: lng });
        this.markers[viewableItems[0].index].showCallout()
      }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const chosenPlaces: any[] = [this.props.currentLocation, ...this.props.chosenPlaces];
    return (
      <Layout>
        <MapView style={styles.MapView}
          ref={map => { this.map = map; }}
          onLayout={() => {
            chosenPlaces.length > 1
              ? this.map.fitToCoordinates(chosenPlaces.map(
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
                })
              : this.map.animateToRegion({
                latitude: chosenPlaces[0].latitude,
                longitude: chosenPlaces[0].longitude,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045
              })
          }}
          customMapStyle={config.mapStyle}
          provider="google"
        >
          {this.renderMarker()}
          {this.renderChosenPlaceMarker()}
        </MapView>
        <FlatList
          data={this.state.searchedLocations}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={{ position: 'absolute', bottom: '5%' }}
          showsHorizontalScrollIndicator={false}
          extraData={this.props}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={itemVisiblePercentThreshold}
        />
        <View style={styles.Header} >
          <View style={[styles.SearchBar, (this.state.predictions.length > 0 && !this.state.blur) ? { borderBottomColor: gradient[1], borderBottomWidth: 1.5 } : null]}>
            <TouchableOpacity style={{ marginLeft: '3%' }}
              onPress={() => { this.goBack() }} >
              <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: gradient[1], fontSize: 20 }} />
            </TouchableOpacity>
            <TextInput style={[styles.TextInput, { fontFamily: 'Comfortaa-Regular', color: gradient[1] }]}
              onChangeText={this.onTextChange}
              underlineColorAndroid="rgba(0,0,0,0)"
              onSubmitEditing={this.search}
              placeholder="Where to go..."
              // onBlur={() => { this.setState({ blur: true }) }}
              value={this.state.text}
              onFocus={() => this.setState({ blur: false })}
            />
            {!this.state.loading
              ? <TouchableOpacity style={{ width: '5%' }}>
                <Icon name="ios-search" style={{ color: gradient[1], fontSize: 15 }} type="Ionicons" />
              </TouchableOpacity>
              : <ActivityIndicator color={gradient[1]} size="small" />}
          </View>
          {!this.state.blur
            && <FlatList
              data={this.state.predictions}
              renderItem={this.renderPrediction}
              keyExtractor={(item, index) => index.toString()} />
          }
        </View>

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
    ...rootReducer.mapScreenModel,
  };
};

export default connect(mapState, mapDispatch)(SearchScreen);