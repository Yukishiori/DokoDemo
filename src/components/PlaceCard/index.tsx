import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, Image } from 'react-native';
import AppText from '../AppText';
import styles from './styles'
import placeService from '../../service/place.service';
import { gradient, width } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
interface IProps {
    name: string;
    rating: number;
    photo_reference: string;
    onPress: () => void;
}

interface IState {
    uri: string;
}

class PlaceCard extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            uri: ''
        };
        placeService.getImageUris([this.props.photo_reference]).then(res => {
            this.setState({
                uri: res[0]
            })
        })
    }
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.Card}>
                <Image source={{ uri: this.state.uri }} style={styles.CardImage} />
                <LinearGradient style={styles.Title} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                    <AppText style={styles.Text}>{this.props.name}</AppText>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        {/* <View style={{ borderRadius: 20, width: width * 0.4 / 5 * this.props.rating, backgroundColor: 'white', height: 3 }}></View> */}
                        <AppText style={{ color: 'white', fontSize: 12 }}>recommended by {this.props.rating * 20} % users</AppText>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}

export default PlaceCard;