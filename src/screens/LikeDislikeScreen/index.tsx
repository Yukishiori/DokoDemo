import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, Image } from 'react-native';
import { gradient } from '../../commonStyle';
import { IPlaceFromGoogle, IPhoto } from '../../rematch/models/map/interface';
import styles from './styles';
import { Icon } from 'native-base';
import MapView from 'react-native-maps';
import config from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import placeService from '../../service/place.service';
import AppText from '../../components/AppText';
import { Transition } from 'react-navigation-fluid-transitions';

interface IProps extends NavigationScreenProps {
}

interface IState {
    uri: string;
}

class LikeDisLikeScreen extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            uri: ''
        };
        placeService.getImageUris(this.props.navigation.state.params.chosenPlace.photos.map(
            (photo: IPhoto) => photo.photo_reference))
            .then((res: string[]) => this.setState({
                uri: res[0]
            }))
    }
    render() {
        const { chosenPlace } = this.props.navigation.state.params;
        return (
            <Transition appear="vertical">
                <View style={styles.Container}>
                    {/* <View style={}>
                </View> */}
                    <MapView
                        initialRegion={{
                            latitude: 38.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        style={styles.Map}
                        customMapStyle={config.mapStyle}
                        provider="google"
                    />
                    <View style={styles.Cover} />

                    <TouchableOpacity style={{ flex: 1, position: 'absolute', top: '5%', left: '3%' }} onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 30 }} />
                    </TouchableOpacity>
                    <LinearGradient style={styles.Solid} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                        <Image source={{ uri: this.state.uri }} style={styles.Image} />
                        <AppText style={styles.Title}>{chosenPlace.name}</AppText>
                    </LinearGradient>
                </View>
            </Transition>
        );
    }
}

export default LikeDisLikeScreen;