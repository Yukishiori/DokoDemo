import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, PermissionsAndroid, Platform, ActivityIndicator, Alert, Linking } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
import { Transition } from 'react-navigation-fluid-transitions';
import Layout from '../../components/Layout';
import { Header, Left, Right, Icon, Content, Toast } from 'native-base';
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import MapView from 'react-native-maps';
import config from '../../../config';
import ScreenNames from '../ScreenNames';
import { connect } from 'react-redux';
import { ICoord } from '../../service/interface.service';
import { DEFAULT_AVATAR } from '../../config/constants';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

interface IProps extends NavigationScreenProps {
    photoURL: string;
    updateCurrentLocation: (coord: ICoord) => void;
    clearChosenPlaces: () => void;
    getNearByPlaceUsingCombo: () => void;
    displayName?: string;
    submitSuccess: any;
    storeData: (arg: any) => Promise<void>;
}


class RestScreen extends Component<IProps, any> {
    flatList: FlatList<any> = null;

    state = {
        loading: true
    }

    requestLocation = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Dokodemo need your permission',
                        'message': 'Dokodemo need your permission to get location for better service '
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Toast.show({ text: 'Enjoy dokodemo !!!', textStyle: { fontFamily: 'Comfortaa-Regular' } })
                    LocationServicesDialogBox.checkLocationServicesIsEnabled({
                        message: "<h2>Use Location?</h2> \
                                This app wants to change your device settings:<br/><br/>\
                                Use GPS for location<br/><br/>",
                        ok: "YES",
                        cancel: "NO"
                    }).then((res: any) => {
                        navigator.geolocation.getCurrentPosition(
                            (position: Position) => {
                                this.props.updateCurrentLocation(position.coords);
                                // console.log('wassup')
                                this.setState({
                                    loading: false
                                })
                            },
                            (err) => { this.requestLocation() },
                            { enableHighAccuracy: false, timeout: 1000, maximumAge: 3600000 }
                        );
                    }).catch((error: any) => {
                        Toast.show({
                            text: 'Dokodemo need your permission to get location for better service',
                            textStyle: { fontFamily: 'Comfortaa-Regular', color: '#FFF' },
                            type: 'danger'
                        })
                        console.log(error.message); // error.message => "disabled"
                        this.requestLocation();
                    });

                } else {
                    Toast.show({
                        text: 'Dokodemo need your permission to get location for better service',
                        textStyle: { fontFamily: 'Comfortaa-Regular', color: '#FFF' },
                        type: 'danger'
                    })
                    this.requestLocation();
                }
            } else if (Platform.OS === 'ios') {
                navigator.geolocation.getCurrentPosition(
                    (position: Position) => {
                        this.props.updateCurrentLocation(position.coords);
                        this.setState({
                            loading: false
                        })
                    },
                    (err) => {
                        if (err.code === 2) {

                            Alert.alert(
                                'Dokodemo',
                                'This app need GPS service, please turn on Location Services in settings > Privacy > Location Services and then click OK',
                                [{
                                    text: 'Cancel', onPress: () => { }, style: "cancel"
                                },
                                { text: 'OK', onPress: () => this.requestLocation() }
                                ]
                            )

                        } else {
                            this.requestLocation()
                        }
                        // Linking.openURL('app-settings:');
                        console.log(err)
                    },
                    { enableHighAccuracy: false, timeout: 5000, maximumAge: 3600000 }
                );
            }
        } catch (err) {
            console.log(err)
            this.requestLocation();
        }
    }

    componentDidMount() {
        try {
            this.requestLocation();

        } catch (err) {
            console.log(err)
        }
    }

    toThink = () => {
        this.props.submitSuccess()
        this.props.navigation.navigate(ScreenNames.MainMap);
    }

    toRest = () => {
        this.props.submitSuccess()
        this.props.getNearByPlaceUsingCombo();
        this.props.navigation.navigate(ScreenNames.MainMap);
    }

    renderItem = ({ item, index }: any) => {
        return index === 0
            ? <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.Content}>
                <AppText style={styles.FirstText}>I DON'T WANT TO</AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 3, alignItems: 'center' }}>
                        <AppText style={styles.Text2}>THINK</AppText>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}
                        onPress={() => { this.flatList.scrollToIndex({ index: 1 }) }}>
                        <Icon name="arrow-right" type="SimpleLineIcons" style={{ fontSize: 40, color: 'white' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    {this.state.loading
                        ? <ActivityIndicator color="#FFF" />
                        : <TouchableOpacity style={styles.Button} onPress={this.toRest}>
                            <AppText >MAKE A PLAN FOR ME</AppText>
                        </TouchableOpacity>
                    }

                </View>
            </LinearGradient >
            : <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.Content}>
                <AppText style={styles.FirstText}>I WANT TO</AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flex: 1, alignItems: 'flex-start', marginLeft: 5 }}
                        onPress={() => { this.flatList.scrollToIndex({ index: 0 }) }}>
                        <Icon name="arrow-left" type="SimpleLineIcons" style={{ fontSize: 40, color: 'white' }} />
                    </TouchableOpacity>
                    <View style={{ flex: 3, alignItems: 'center' }}>
                        <AppText style={styles.Text2}>THINK</AppText>
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    {this.state.loading
                        ? <ActivityIndicator color="#FFF" />
                        : <TouchableOpacity style={styles.Button} onPress={this.toThink}>
                            <AppText >MAKE A PLAN FOR ME</AppText>
                        </TouchableOpacity>
                    }
                </View>
            </LinearGradient>
    }



    render() {
        return (
            <Layout>
                <Header style={{ padding: 0 }}>
                    <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                                <Icon name="three-bars" style={{ color: 'white' }} type="Octicons" />
                            </TouchableOpacity>
                        </Left>
                        <Right />
                    </LinearGradient>
                </Header>
                <View style={{ flex: 1 }}>
                    <MapView initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0222,
                        longitudeDelta: 0.0221,
                    }}
                        style={styles.MapStyle}
                        provider="google"
                        customMapStyle={config.mapStyle}
                    />
                    {
                        <FlatList
                            data={[1, 2]}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            pagingEnabled
                            horizontal
                            ref={flatList => { this.flatList = flatList; }}
                            showsHorizontalScrollIndicator={false}
                        />
                    }
                    {/* <View style={styles.User}>
                        <Image source={{
                            uri: this.props.photoURL || DEFAULT_AVATAR
                        }}
                            style={styles.Circle}
                        />
                        <AppText style={{ marginLeft: '5%', color: 'white', fontSize: 18 }}>{this.props.displayName ? this.props.displayName : this.props.email.split('@')[0]}</AppText>

                    </View> */}
                </View>
            </Layout >
        );
    }
}


const mapState = (rootState: any) => {
    return {
        ...rootState.profileModel,
        ...rootState.mapScreenModel
    };
};

const mapDispatch = (rootReducer: any) => {
    return {
        ...rootReducer.profileModel,
        ...rootReducer.mapScreenModel
    };
};

export default connect(mapState, mapDispatch)(RestScreen);