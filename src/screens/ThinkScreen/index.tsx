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
import { connect } from 'react-redux';
import ScreenNames from '../ScreenNames';
import { ICoord } from '../../service/interface.service';
import { DEFAULT_AVATAR } from '../../config/constants';

interface IProps extends NavigationScreenProps {
    photoURL: string;
    updateCurrentLocation: (coord: ICoord) => void;
    clearChosenPlaces: () => void;
}
class ThinkScreen extends Component<IProps> {
    
    toThink = () => {
        this.props.clearChosenPlaces();
        this.props.navigation.navigate(ScreenNames.SearchScreen);
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
                    <Transition appear="horizontal">
                        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.Content}>
                            <AppText style={styles.FirstText}>I want to</AppText>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-start', marginLeft: 5 }} onPress={() => { this.props.navigation.navigate(ScreenNames.RestScreen) }}>
                                    <Icon name="arrow-left" type="SimpleLineIcons" style={{ fontSize: 40, color: 'white' }} />
                                </TouchableOpacity>
                                <View style={{ flex: 3, alignItems: 'center' }}>
                                    <AppText style={styles.Text2}>THINK</AppText>
                                </View>
                                <View style={{ flex: 1 }} />
                            </View>
                            <TouchableOpacity style={styles.Button} onPress={this.toThink}>
                                <AppText >MAKE YOUR OWN PLAN</AppText>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Transition>
                    <Image source={{
                        uri: this.props.photoURL || DEFAULT_AVATAR
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

export default connect(mapState, mapDispatch)(ThinkScreen);