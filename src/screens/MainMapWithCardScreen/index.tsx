import React, { Component } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles';
import config from '../../../config';
import placeService from '../../service/place.service';
import { ICoord } from '../../service/interface.service';

import { connect } from 'react-redux';
interface IProps extends NavigationScreenProps {
  login : any;
  username: string;
}

interface IState {
    region: {
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number,
    },
    choosenPlaces: ICoord[]
}




class MainMapWithCardScreen extends Component<IProps, IState> {
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
            choosenPlaces: []
        };

        navigator.geolocation.getCurrentPosition(
            (position: Position) => {

                console.log(position);
                this.setState({
                    region: {
                        ...this.state.region,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                }, () => {
                    placeService.betterFetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.region.latitude},${this.state.region.longitude}&radius=1500&opennow=true&keyword=coffee&key=${config.apiKey}`)
                        .then(res => this.populateMap(res.results))
                        .catch(error => console.log(error));
                });
            }
        );
    }

    populateMap = (resArray: any[]) => {
        const choosenPlaces: ICoord[] = [];
        resArray.forEach(res => {
            choosenPlaces.push({
                latitude: res.geometry.location.lat,
                longitude: res.geometry.location.lng
            })
        });
        console.log(choosenPlaces, resArray);
        this.setState({
            choosenPlaces
        }, () => setTimeout(() => {
            this.map.fitToCoordinates(this.state.choosenPlaces);
        }, 300)
        )
    }
    renderMarker = () => {
        return this.state.choosenPlaces.map(choosenPlace =>
            <Marker coordinate={choosenPlace} />
        )
    }

    render() {
        return (
            <View>
                <MapView
                    ref={map => { this.map = map; }}
                    style={styles.Map}
                    showsUserLocation={true}
                    provider="google"
                    customMapStyle={config.mapStyle}
                    region={this.state.region}>
                    {this.renderMarker()}
                </MapView>
            </View >
        );
    }
}

// Rematch for testing, will move to login screen later
const mapState = (rootState: any) => {
  return {
    ...rootState.loginPageModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.loginPageModel,
  };
};

export default connect(mapState, mapDispatch)(MainMapWithCardScreen);