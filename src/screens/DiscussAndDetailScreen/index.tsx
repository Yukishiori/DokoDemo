import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { Icon } from 'native-base';
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { IPlaceDetailFromGoogle } from '../../rematch/models/map/interface';
import ReviewCard from '../../components/ReviewCard';
import styles from './styles';

interface IProps extends NavigationScreenProps {

}

interface IState {
    text: string;
}

class DiscussAndDetailScreen extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            text: ""
        }
    }


    render() {
        const { placeDetail } = this.props.navigation.state.params as { placeDetail: IPlaceDetailFromGoogle };
        return (
            <Transition appear="vertical">
                <LinearGradient style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                    <View style={styles.Header}>
                        <TouchableOpacity style={{ flex: 1, marginLeft: '3%' }} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 30 }} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {placeDetail.result.reviews.map((item, index) => {
                            return <ReviewCard key={index} text={item.text} direction={index % 2 === 0 ? 'right' : 'left'} />
                        })}
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
                            />
                            <TouchableOpacity style={styles.Send}>
                                <Icon name="send" type="MaterialIcons" style={{ color: 'black' }} />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
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
