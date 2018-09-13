import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, Image, ScrollView, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { gradient } from '../../commonStyle';
import { IPlaceFromGoogle, IPhoto, IPlaceDetailFromGoogle, IPlaceDetailResult, ICombinePlaceDetail } from '../../rematch/models/map/interface';
import styles from './styles';
import { Icon, Header, Left, Button, Right, Content } from 'native-base';
import MapView from 'react-native-maps';
import config from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import placeService from '../../service/place.service';
import AppText from '../../components/AppText';
import { Transition } from 'react-navigation-fluid-transitions';
import ScreenNames from '../ScreenNames';
import Layout from '../../components/Layout';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { phonecall } from 'react-native-communications';
import firebase from 'firebase';
interface IProps extends NavigationScreenProps {

    addToChosenPlaces: (place: IPlaceFromGoogle) => void;
}


interface IState {
    placeDetail: ICombinePlaceDetail;
    isFavorite: boolean;
}
class LikeDisLikeScreen extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            placeDetail: null,
            isFavorite: false
        }
    }

    componentDidMount(): any {
        const { chosenPlace }: { chosenPlace: IPlaceFromGoogle } = this.props.navigation.state.params as any;

        DeviceEventEmitter.removeAllListeners('hardwareBackPress');
        DeviceEventEmitter.addListener('hardwareBackPress', () => {
            this.props.navigation.navigate(this.props.navigation.state.params.fromSearch ? ScreenNames.SearchScreen : ScreenNames.MainMap)
        });
        placeService.getPlaceDetail(chosenPlace.place_id)
            .then(placeDetail => {
                this.setState({
                    placeDetail,
                    isFavorite: placeDetail.favoriteBy[firebase.auth().currentUser.uid] ? true : false
                })
            })
            .catch(err => {
                console.log(err)
            })

    }


    onFavorite = () => {
        this.setState({
            isFavorite: !this.state.isFavorite
        }, () => {
            firebase.firestore().collection('places').doc(this.state.placeDetail.place_id).set({
                favoriteBy: {
                    [firebase.auth().currentUser.uid]: this.state.isFavorite
                }
            }, { merge: true })
        });

    }

    render() {
        const { chosenPlace }: { chosenPlace: IPlaceFromGoogle, fromSearch: boolean } = this.props.navigation.state.params as any;

        if (!this.state.placeDetail) {
            return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={gradient[1]} />
            </View>
        }

        return (
            <Layout>
                <Header style={{ padding: 0 }}>
                    <View style={styles.Header} >
                        <Left style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Button transparent onPress={() => this.props.navigation.navigate(this.props.navigation.state.params.fromSearch ? ScreenNames.SearchScreen : ScreenNames.MainMap)} style={{ justifyContent: 'flex-start' }}>
                                <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 20 }} />
                            </Button>
                        </Left>
                        <View style={{ flex: 1 }} />
                        <Right style={{ flex: 1 }} />
                    </View>
                </Header>
                <LinearGradient style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                    <ScrollView>
                        <View style={styles.Container}>
                            {chosenPlace.firstImageUrl && <FastImage style={styles.Image} source={{ uri: chosenPlace.firstImageUrl }} />}
                            <AppText style={styles.Title}>{chosenPlace.name}</AppText>
                            <View style={styles.TotalPanel}>
                                <View style={styles.TextInPanel}>
                                    <View style={styles.Rec}>
                                        <AppText style={{ color: gradient[0], fontWeight: 'bold', fontSize: 20 }}>Recommended by</AppText>
                                        <AppText style={{ color: gradient[1], fontWeight: 'bold', fontSize: 24 }}> {chosenPlace.rating * 20} %</AppText>
                                    </View>
                                    <LinearGradient style={styles.Bar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient} />
                                    <View style={styles.IconText}>
                                        <Icon name="location" type="Entypo" style={{ fontSize: 18 }} />
                                        <AppText style={styles.SmallText}>Address: </AppText>
                                    </View>
                                    <AppText style={styles.BigText}>{this.state.placeDetail.formatted_address}</AppText>
                                    <View style={styles.IconText}>
                                        <Icon name="address-book" type="FontAwesome" style={{ fontSize: 18 }} />
                                        <AppText style={styles.SmallText}>Contact: </AppText>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <TouchableOpacity
                                            onPress={() => phonecall(this.state.placeDetail.formatted_phone_number, true)}
                                        >
                                            <AppText style={styles.BigText}>{this.state.placeDetail.formatted_phone_number}</AppText>
                                        </TouchableOpacity>
                                        <View style={styles.Action}>
                                            <TouchableOpacity style={styles.Star} onPress={this.onFavorite}>
                                                <Icon name="star" type="FontAwesome" style={{ fontSize: 18, color: this.state.isFavorite ? gradient[0] : 'white' }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.Star} onPress={() => this.props.navigation.navigate(ScreenNames.Discuss, { placeDetail: this.state.placeDetail, chosenPlace, fromSearch: this.props.navigation.state.params.fromSearch })} >
                                                <Icon name="comment" type="Foundation" style={{ fontSize: 18, color: 'white' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {
                                this.props.navigation.state.params.fromSearch
                                && <TouchableOpacity style={styles.AddButton} onPress={() => {
                                    this.props.addToChosenPlaces(chosenPlace);
                                    this.props.navigation.navigate(ScreenNames.MainMap);
                                }}>
                                    <AppText style={{ fontSize: 18, color: gradient[0] }}>ADD TO SCHEDULE</AppText>
                                </TouchableOpacity>
                            }
                        </View>
                    </ScrollView>
                </LinearGradient>
            </Layout >
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

export default connect(mapState, mapDispatch)(LikeDisLikeScreen);