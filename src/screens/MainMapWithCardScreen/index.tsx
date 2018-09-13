import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';
import config from '../../../config';

import { connect } from 'react-redux';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import { IRootState } from '../../rematch/interface';
import { ICoord } from '../../service/interface.service';
import { gradient } from '../../commonStyle';
import PlaceCard from '../../components/PlaceCard';
import ScreenNames from '../ScreenNames';
import Layout from '../../components/Layout';
import { Header, Left, Icon, Right, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'

interface IProps extends NavigationScreenProps {
    chosenPlaces: IPlaceFromGoogle[],
    polylineCoords: ICoord[];
    isBusy: boolean;
    currentLocation: ICoord;
    getDirection: () => void;
    getEstimatedTime: any;
    storeData: (arg: any) => void;
    checkedPlaces: any;
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


const itemVisiblePercentThreshold = {
    itemVisiblePercentThreshold: 50
}
class MainMapWithCardScreen extends Component<IProps, IState> {
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
        };
    }

    componentDidMount() {
        DeviceEventEmitter.removeAllListeners('hardwareBackPress');
        DeviceEventEmitter.addListener('hardwareBackPress', () => {
            this.props.navigation.navigate(ScreenNames.RestScreen);
        });
    }

    renderMarker = () => {
        return this.props.chosenPlaces.map((chosenPlace, index) =>
            <Marker
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

    renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
        return item
            ? <PlaceCard
                place={item}
                onPress={() => this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, { chosenPlace: item })}
            />
            : <TouchableOpacity style={styles.Add}
                onPress={() => this.props.navigation.navigate(ScreenNames.SearchScreen)}>
                <Icon name="image" type="EvilIcons" style={{ fontSize: 80, color: 'black' }} />
                <AppText style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>ADD PLACE</AppText>
            </TouchableOpacity>
    }
    onViewableItemsChanged = ({ viewableItems, changed }: any) => {
        try {
            if (viewableItems[0].index > -1) {
                const { lat, lng } = this.props.chosenPlaces[viewableItems[0].index].geometry.location;
                this.map.animateToCoordinate({ latitude: lat, longitude: lng });
                this.markers[viewableItems[0].index].showCallout()
            }
        } catch (err) {
            console.log(err)
        }
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
                        data={[...this.props.chosenPlaces, null]}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        style={{ position: 'absolute', bottom: '5%' }}
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={this.onViewableItemsChanged}
                        extraData={this.props}
                        viewabilityConfig={itemVisiblePercentThreshold}
                    // pagingEnabled
                    />
                </View>
                {this.props.chosenPlaces.length > 0
                    &&
                    <TouchableOpacity
                        onPress={() => {
                            this.props.getEstimatedTime({ chosenPlaces: this.props.chosenPlaces, currentLocation: this.props.currentLocation });
                            this.props.getDirection();
                            this.props.storeData({
                                key: 'chosen-places',
                                value: this.props.chosenPlaces
                            });
                            this.props.storeData({
                                key: 'checked-places',
                                value: this.props.checkedPlaces
                            });
                            this.props.navigation.navigate(ScreenNames.FinalScreen);
                        }}
                        style={{
                            flex: 1,
                            position: 'absolute',
                            left: '25%',
                            top: '13%',
                        }}>
                        <LinearGradient style={styles.ShowSchedule} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                            <AppText style={{ color: 'white', fontSize: 16 }}>Show schedule</AppText>
                        </LinearGradient>
                    </TouchableOpacity>
                }
                <Header style={{ padding: 0 }}>
                    <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
                        <Left style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Button transparent onPress={() =>
                                this.props.navigation.navigate(ScreenNames.RestScreen)
                            } style={{ justifyContent: 'flex-start' }}>
                                <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 20 }} />
                            </Button>
                        </Left>
                        <View style={{ flex: 1 }} />
                        <Right style={{ flex: 1 }}>
                        </Right>
                    </LinearGradient>
                </Header>
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

export default connect(mapState, mapDispatch)(MainMapWithCardScreen);
