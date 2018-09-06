import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, Image } from 'react-native';
import AppText from '../AppText';
import styles from './styles'
import placeService from '../../service/place.service';
import { gradient, width } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { Icon } from 'native-base';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
interface IProps {
    place: IPlaceFromGoogle;
    // photoReference: string;
    onPress: () => void;
    removeChosenPlace?: (item: { placeId: string }) => void;
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

        if (this.props.place.photos && this.props.place.photos[0].photo_reference) {
            placeService.getImageUris([this.props.place.photos[0].photo_reference]).then(res => {
                this.setState({
                    uri: res[0]
                })
            })
        }
    }
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.Card}>
                <Image source={{ uri: this.state.uri }} style={styles.CardImage} />
                <LinearGradient style={styles.Title} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                    <AppText style={styles.Text}>{this.props.place.name.toUpperCase()}</AppText>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        {/* <View style={{ borderRadius: 20, width: width * 0.4 / 5 * this.props.rating, backgroundColor: 'white', height: 3 }}></View> */}
                        <AppText style={{ color: 'white', fontSize: 12 }}>recommended by {this.props.place.rating * 20} % users</AppText>
                    </View>
                </LinearGradient>
                <TouchableOpacity style={styles.DeleteButton}
                    onPress={() => this.props.removeChosenPlace({ placeId: this.props.place.place_id })}>
                    <Icon name="x" type="Feather" style={{ color: "#565656" }} />
                </TouchableOpacity>
            </TouchableOpacity>
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

export default connect(mapState, mapDispatch)(PlaceCard);
