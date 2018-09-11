import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, DeviceEventEmitter } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { Icon } from 'native-base';
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { IPlaceDetailFromGoogle, IPlaceDetailResult, IComment } from '../../rematch/models/map/interface';
import ReviewCard from '../../components/ReviewCard';
import styles from './styles';
import placeService from '../../service/place.service';
import firebase from 'firebase';
import moment from 'moment';
import ScreenNames from '../ScreenNames';
interface IProps extends NavigationScreenProps {

}

interface IState {
    text: string;
    comments: IComment[];
}

class DiscussAndDetailScreen extends Component<IProps, IState> {
    scrollView: ScrollView = null;
    constructor(props: any) {
        super(props);
        this.state = {
            text: "",
            comments: []
        }
    }

    componentDidMount() {
        const { placeDetail, chosenPlace } = this.props.navigation.state.params as { placeDetail: IPlaceDetailResult, chosenPlace: any };
        placeService.getComment(placeDetail.place_id)
            .then(comments => {
                this.setState({
                    comments
                })
            }).catch(err => console.log(err))
        DeviceEventEmitter.removeAllListeners('hardwareBackPress');
        DeviceEventEmitter.addListener('hardwareBackPress', () => {
            this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, { chosenPlace, fromSearch: this.props.navigation.state.params.fromSearch })
        });
    }

    renderComments = () => {
        const { placeDetail } = this.props.navigation.state.params as { placeDetail: IPlaceDetailResult };
        const comments = [...placeDetail.reviews.filter(review => review.text), ...this.state.comments.filter(comment => comment.text)]
        return comments.map((item, index) => {
            return <ReviewCard key={index} text={item.text} direction={index % 2 === 0 ? 'right' : 'left'} />
        })
    }

    addComment = () => {
        if (this.state.text) {
            const { placeDetail } = this.props.navigation.state.params as { placeDetail: IPlaceDetailResult };
            firebase.firestore().collection('comments').add({
                createTime: moment().unix(),
                placeId: placeDetail.place_id,
                text: this.state.text,
                user: {
                    id: firebase.auth().currentUser.uid,
                    name: ''
                }
            }).then(res => {
                this.setState({
                    comments: [
                        ...this.state.comments,
                        {
                            createTime: moment().unix(),
                            placeId: placeDetail.place_id,
                            text: this.state.text,
                            user: {
                                id: firebase.auth().currentUser.uid,
                                name: ''
                            }
                        }
                    ],
                    text: '',
                }, () => { setInterval(() => { if (this.scrollView) this.scrollView.scrollToEnd() }, 500) })
            }).catch(err => console.log(err));
        }
    }

    render() {
        const { chosenPlace } = this.props.navigation.state.params as { placeDetail: IPlaceDetailResult, chosenPlace: any };
        return (
            <LinearGradient style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                <View style={styles.Header}>
                    <TouchableOpacity style={{ flex: 1, marginLeft: '3%' }} onPress={() =>
                        this.props.navigation.navigate(ScreenNames.LikeDisLikeScreen, { chosenPlace, fromSearch: this.props.navigation.state.params.fromSearch })
                    }>
                        <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 30 }} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    ref={scrollView => { this.scrollView = scrollView; }}
                >
                    {this.renderComments()}
                </ScrollView>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
                    behavior="padding">
                    <View style={styles.CommentBar}>
                        <TextInput
                            underlineColorAndroid="rgba(0,0,0,0)"
                            style={[styles.TextInput, { fontFamily: 'Comfortaa-Regular' }]} placeholder="And what do you think ?"
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            onSubmitEditing={this.addComment}
                        />
                        <TouchableOpacity style={styles.Send} onPress={this.addComment}>
                            <Icon name="send" type="MaterialIcons" style={{ color: 'black' }} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
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
