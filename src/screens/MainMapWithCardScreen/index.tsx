import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
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
import Layout from '../../components/Layout';
import { Content, Header, Left, Icon, Right, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';

interface IProps extends NavigationScreenProps {
    chosenPlaces: IPlaceFromGoogle[],
    getNearByPlaceUsingCombo: (location: ICoord) => void;
    polylineCoords: ICoord[];
    isBusy: boolean;
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
            <Marker
                coordinate={{
                    longitude: chosenPlace.geometry.location.lng,
                    latitude: chosenPlace.geometry.location.lat
                }} key={index} title={chosenPlace.name}
                pinColor="orange"
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

    renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
        return <PlaceCard
            place={item}
            onPress={() => this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, { chosenPlace: item })}
        />
    }
    onViewableItemsChanged = ({ viewableItems }) => {
        try {
            if (viewableItems[0].index > -1) {
                const { lat, lng } = this.props.chosenPlaces[viewableItems[0].index].geometry.location;
                this.map.animateToCoordinate({ latitude: lat, longitude: lng });
            }
        } catch (err) {
            console.log(err)
        }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }



    render() {
        if (this.props.isBusy) {
            return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={gradient[1]} />
            </View>
        }

        return (
            <Layout>
                <View style={{ position: 'absolute', top: 0, left: 0 }}>
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
                        data={this.props.isBusy ? [] : this.props.chosenPlaces}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        style={{ position: 'absolute', bottom: '5%' }}
                        showsHorizontalScrollIndicator={false}
                        // onViewableItemsChanged={this.onViewableItemsChanged}
                        extraData={this.props}
                    // pagingEnabled
                    />
                </View>
                <TouchableOpacity style={{
                    flex: 1,
                    position: 'absolute',
                    left: '25%',
                    top: '15%',
                }}>
                    {this.props.chosenPlaces.length > 0
                        && <LinearGradient style={styles.ShowSchedule} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                            <AppText style={{ color: 'white', fontSize: 16 }}>Show schedule</AppText>
                        </LinearGradient>}
                </TouchableOpacity>
                <Header style={{ padding: 0 }}>
                    <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
                        <Left style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Button transparent onPress={() => this.props.navigation.goBack()} style={{ justifyContent: 'flex-start' }}>
                                <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 20 }} />
                            </Button>
                        </Left>
                        <View style={{ flex: 1 }} />
                        <Right style={{ flex: 1 }}>
                            <TouchableOpacity style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="ios-add" style={{ color: 'white', fontSize: 45 }} type="Ionicons" />
                            </TouchableOpacity>
                        </Right>
                    </LinearGradient>
                </Header>
            </Layout >
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
