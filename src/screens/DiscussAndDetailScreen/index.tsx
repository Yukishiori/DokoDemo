import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
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
import AppText from '../../components/AppText';
import moment from 'moment';

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
    render() {
        return (
            <Transition appear="vertical">
                <LinearGradient style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                    <View style={styles.Header}>
                        <TouchableOpacity style={{ flex: 1, marginLeft: '3%' }} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 30 }} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {this.state.placeDetail
                            && this.state.placeDetail.result.reviews.map((item, index) => {
                                return <ReviewCard key={index} text={item.text} direction={index % 2 === 0 ? 'right' : 'left'} />
                            })
                        }
                        <View style={styles.TotalPanel}>
                            {
                                this.state.placeDetail && <View style={styles.TextInPanel}>
                                    <View>
                                        <AppText style={{ fontSize: 12 }}>Address: </AppText>
                                        <AppText style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.placeDetail.result.vicinity}</AppText>
                                    </View>
                                    <View>
                                        <AppText style={{ fontSize: 12 }}>Contact: </AppText>
                                        <AppText style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.placeDetail.result.formatted_phone_number}</AppText>
                                    </View>
                                </View>
                            }
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <LinearGradient style={styles.GradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient} >
                                    <AppText style={{ color: 'white', fontWeight: 'bold' }}>OKAY</AppText>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
