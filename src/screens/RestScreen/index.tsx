import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
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

interface IProps extends NavigationScreenProps {
    photoURL: string;
    updateCurrentLocation: (coord: ICoord) => void;
    clearChosenPlaces: () => void;
}
class RestScreen extends Component<IProps> {

    componentDidMount() {
        this.props.clearChosenPlaces();
        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                this.props.updateCurrentLocation(position.coords);
            }
        );
    }

    render() {
        return (
            <Layout>
                <Header style={{ padding: 0 }}>
                    <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity>
                                <Icon name="three-bars" style={{ color: 'white' }} type="Octicons" />
                            </TouchableOpacity>
                        </Left>
                        <Right />
                    </LinearGradient>
                </Header>
                <Content>
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
                    {<LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.Content}>
                        <AppText style={styles.FirstText}>I WANT TO</AppText>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 3, alignItems: 'center' }}>
                                <AppText style={styles.Text2}>REST</AppText>
                            </View>
                            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}
                                onPress={() => { this.props.navigation.navigate('Think') }}>
                                <Icon name="arrow-right" type="SimpleLineIcons" style={{ fontSize: 40, color: 'white' }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate(ScreenNames.MainMap)}>
                            <AppText >MAKE A PLAN FOR ME</AppText>
                        </TouchableOpacity>
                    </LinearGradient>}
                    <Image source={{
                        uri: this.props.photoURL || "https://i.imgur.com/oO3jT0b.png"
                    }}
                        style={styles.Circle}
                    />
                </Content>
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