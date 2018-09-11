import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, FlatList } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
import { Transition } from 'react-navigation-fluid-transitions';
import Layout from '../../components/Layout';
import { Header, Left, Right, Icon, Content } from 'native-base';
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import MapView from 'react-native-maps';
import config from '../../../config';
import ScreenNames from '../ScreenNames';
import { connect } from 'react-redux';
import { ICoord } from '../../service/interface.service';
import { DEFAULT_AVATAR } from '../../config/constants';

interface IProps extends NavigationScreenProps {
    photoURL: string;
    updateCurrentLocation: (coord: ICoord) => void;
    clearChosenPlaces: () => void;
    getNearByPlaceUsingCombo: () => void;
    displayName?: string;
}
class RestScreen extends Component<IProps> {
    flatList: FlatList<any> = null;
    componentDidMount() {
        try {
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    this.props.updateCurrentLocation(position.coords);
                }
            );
        } catch (err) {
            console.log(err)
        }
    }


    toThink = () => {
        this.props.clearChosenPlaces();
        this.props.navigation.navigate(ScreenNames.SearchScreen);
    }

    toRest = () => {
        this.props.clearChosenPlaces();
        this.props.getNearByPlaceUsingCombo();
        this.props.navigation.navigate(ScreenNames.MainMap);
    }

    renderItem = ({ item, index }: any) => {
        return index === 0
            ? <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.Content}>
                <AppText style={styles.FirstText}>I WANT TO</AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 3, alignItems: 'center' }}>
                        <AppText style={styles.Text2}>REST</AppText>
                    </View>
                    <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}
                        onPress={() => { this.flatList.scrollToIndex({ index: 1 }) }}>
                        <Icon name="arrow-right" type="SimpleLineIcons" style={{ fontSize: 40, color: 'white' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <TouchableOpacity style={styles.Button} onPress={this.toRest}>
                        <AppText >MAKE A PLAN FOR ME</AppText>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            : <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.Content}>
                <AppText style={styles.FirstText}>I want to</AppText>
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
                    <TouchableOpacity style={styles.Button} onPress={this.toThink}>
                        <AppText >MAKE YOUR OWN PLAN</AppText>
                    </TouchableOpacity>
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