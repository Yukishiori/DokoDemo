import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../AppText';
import styles from './styles'
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { Icon } from 'native-base';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import FastImage from 'react-native-fast-image';
interface IProps {
    cannotDelete?: boolean;
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

    }

    deleteItem = () => {
        // Alert.alert(

        // )
        this.props.removeChosenPlace({ placeId: this.props.place.place_id });
    }
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.Card}>
                {this.props.place.firstImageUrl
                    ? <FastImage
                        source={{ uri: this.props.place.firstImageUrl }}
                        style={styles.CardImage}
                    />
                    : <FastImage style={styles.CardImage} source={require('../../../assets/images/default.png')} />
                }
                <LinearGradient style={styles.Title} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                    <AppText style={styles.Text}>{this.props.place.name.toUpperCase()}</AppText>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        {/* <View style={{ borderRadius: 20, width: width * 0.4 / 5 * this.props.rating, backgroundColor: 'white', height: 3 }}></View> */}
                        <AppText style={{ color: 'white', fontSize: 12 }}>recommended by {this.props.place.rating * 20} % users</AppText>
                    </View>
                </LinearGradient>
                {!this.props.cannotDelete && < TouchableOpacity style={styles.DeleteButton}
                    onPress={this.deleteItem}>
                    <Icon name="x" type="Feather" style={{ color: "#565656" }} />
                </TouchableOpacity>}
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
