import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';
import config from '../../../config';

import { connect } from 'react-redux';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import { IRootState } from '../../rematch/interface';
import { ICoord, IPlace } from '../../service/interface.service';
import { gradient } from '../../commonStyle';
import PlaceCard from '../../components/PlaceCard';
import Modal from 'react-native-modal';
import ScreenNames from '../ScreenNames';

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
    isModalVisible: boolean;
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
            isModalVisible: false,
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
        return this.props.polylineCoords
            && <Polyline
                coordinates={this.props.polylineCoords}
                strokeWidth={6}
                strokeColor={gradient[1]}
            />
    }

    renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
        console.log(item);
        return <PlaceCard
            name={item.name}
            rating={item.rating}
            onPress={() => this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, { chosenPlace: item })}
            photoReference={item.photos ? item.photos[0].photo_reference : null}
        />
    }
    // onViewableItemsChanged = ({ viewableItems }) => {
    //     try {
    //         if (viewableItems[0].index > -1) {
    //             const { lat, lng } = this.props.chosenPlaces[viewableItems[0].index].geometry.location;
    //             this.map.animateToCoordinate({ latitude: lat, longitude: lng });
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
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
                    {this.renderPolyline()}
                </MapView>
                <FlatList
                    data={this.props.chosenPlaces}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    style={{ position: 'absolute', top: '65%' }}
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                />
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
