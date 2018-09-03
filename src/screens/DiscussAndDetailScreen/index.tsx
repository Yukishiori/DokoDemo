import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { Icon } from 'native-base';
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';

interface IProps extends NavigationScreenProps {
}

interface IState {
    uri: string;
}

class DiscussAndDetailScreen extends Component<IProps, IState> {

    render() {
        return (
            <Transition appear="vertical">
                <LinearGradient style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={gradient}>
                    <TouchableOpacity style={{ flex: 1, position: 'absolute', top: '5%', left: '3%' }} onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-left" type="SimpleLineIcons" style={{ color: 'white', fontSize: 30 }} />
                    </TouchableOpacity>
                </LinearGradient>
            </Transition>
        );
    }
}

export default DiscussAndDetailScreen;