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
    // placeService.getAutoComplete(text, this.props.currentLocation, 1500, this.state.sessionToken)
    //   .then(predictions =>
    //     this.setState({
    //       predictions
    //     }))
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  componentDidMount() {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      this.props.chosenPlaces && this.props.chosenPlaces.length > 0
        ? this.props.navigation.navigate(ScreenNames.MainMap)
        : this.props.navigation.goBack();
    });
  }

  search = () => {
    this.setState({
      loading: true
    })
    placeService.getPlaceFromKeyword(this.props.currentLocation, this.state.text).then((res: IPlaceFromGoogle[]) => {
      this.setState(
        {
          searchedLocations: res,
          loading: false
        },
        () => {
          if (this.state.searchedLocations && this.state.searchedLocations.length > 0) {

            this.map.fitToCoordinates(this.state.searchedLocations.map(
              searchedLocation => ({
                latitude: searchedLocation.geometry.location.lat,
                longitude: searchedLocation.geometry.location.lng
              })
            ), {
                edgePadding: { top: 50, right: 30, bottom: 50, left: 30 }
              })
          } else {
            // Toast.show({ text: "Find no place match this keyword", duration: 500 })
          }

        }
      )
    })
  }

  renderMarker = () => {
    return this.state.searchedLocations.map(searchedLocation => {
      return <Marker
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
        }} />
    })
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
      if (viewableItems[0].index > -1) {
        const { lat, lng } = this.state.searchedLocations[viewableItems[0].index].geometry.location;
        this.map.animateToCoordinate({ latitude: lat, longitude: lng });
      }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <Layout>
        <MapView style={styles.MapView}
          ref={map => { this.map = map; }}
          initialRegion={{
            ...this.props.currentLocation,
            latitudeDelta: 0.00070,
            longitudeDelta: 0.0070,
          }}
          customMapStyle={config.mapStyle}
          provider="google"
        >
          {this.renderMarker()}
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
          <TouchableOpacity style={{ marginLeft: '3%' }}
            onPress={() => this.props.chosenPlaces && this.props.chosenPlaces.length > 0
              ? this.props.navigation.navigate(ScreenNames.MainMap)
              : this.props.navigation.goBack()} >
            <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: gradient[1], fontSize: 20 }} />
          </TouchableOpacity>
          <TextInput style={[styles.TextInput, { fontFamily: 'Comfortaa-Regular', color: gradient[1] }]}
            onChangeText={this.onTextChange}
            underlineColorAndroid="rgba(0,0,0,0)"
            onSubmitEditing={this.search}
            placeholder="Where to go..."
            onBlur={() => { this.setState({ blur: true }) }}
            onFocus={() => this.setState({ blur: false })}
          />
          {!this.state.loading
            ? <TouchableOpacity style={{ width: '5%' }}>
              <Icon name="ios-search" style={{ color: gradient[1], fontSize: 15 }} type="Ionicons" />
            </TouchableOpacity>
            : <ActivityIndicator color={gradient[1]} size="small" />}
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