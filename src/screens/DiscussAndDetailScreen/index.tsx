import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { Icon } from 'native-base';
import { gradient, height } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import placeService from '../../service/place.service';
import { IPlaceFromGoogle, IPlaceDetailFromGoogle, Review } from '../../rematch/models/map/interface';
import ReviewCard from '../../components/ReviewCard';
import styles from './styles';
import Layout from '../../components/Layout';

interface IProps extends NavigationScreenProps {

}

interface IState {
    placeDetail: IPlaceDetailFromGoogle;
}


class DiscussAndDetailScreen extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            placeDetail: null
        }
    }

    componentDidMount(): any {
        const { chosenPlace }: { chosenPlace: IPlaceFromGoogle } = this.props.navigation.state.params as any;
        placeService.getPlaceDetail(chosenPlace.place_id)
            .then(placeDetail => {
                this.setState({
                    placeDetail
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderItem = ({ item, index }: { item: Review, index: number }) => {
        return <ReviewCard text={item.text} direction={index % 2 === 0 ? 'right' : 'left'} />
    }

    render() {
        console.log(this.state.placeDetail ? this.state.placeDetail.result.reviews : '');
        return (
            <Transition appear="vertical">
                <LinearGradient style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 30 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.FlatList}>
                        {this.state.placeDetail
                            && <FlatList
                                data={this.state.placeDetail.result.reviews}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        }
                    </View>
                </LinearGradient>
            </Transition>
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

export default connect(mapState, mapDispatch)(DiscussAndDetailScreen);
