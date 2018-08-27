import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';
import config from '../../../config';

import { connect } from 'react-redux';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import { IRootState } from '../../rematch/interface';
import { ICoord } from '../../service/interface.service';
import { checkPropTypes } from 'prop-types';
interface IProps extends NavigationScreenProps {
    chosenPlaces: IPlaceFromGoogle[],
    getNearByPlaceUsingCombo: (location: ICoord) => void;
    polylineCoords: ICoord[];
}

interface IState {
    region: {
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number,
    },
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
        };

        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                this.setState({
                    region: {
                        ...this.state.region,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                }, () => this.props.getNearByPlaceUsingCombo(this.state.region));
            }
        );
    }

    renderMarker = () => {
        return this.props.chosenPlaces.map((chosenPlace, index) =>
            <Marker coordinate={{
                longitude: chosenPlace.geometry.location.lng,
                latitude: chosenPlace.geometry.location.lat
            }} key={index} title={chosenPlace.name} />
        )
    }

    renderPolyline = () => {
        return this.props.polylineCoords && <Polyline coordinates={this.props.polylineCoords} strokeWidth={3} />
    }

    render() {
        console.log(this.props);
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
                    {this.renderPolyline()}
                </MapView>
            </View >
        );
    }
}

// Rematch for testing, will move to login screen later
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

export default connect(mapState, mapDispatch)(MainMapWithCardScreen);