import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, Image, ViewStyle } from 'react-native';
import AppText from '../AppText';
import styles from './styles';
interface IProps {
    text: string;
    direction: 'right' | 'left';
    style?: ViewStyle;
}

interface IState {
    uri: string;
}

class ReviewCard extends Component<IProps, IState> {

    render() {
        return (
            <View style={[styles.Container, this.props.direction === 'left' ? { marginLeft: '5%', marginRight: '15%' } : { marginLeft: '15%', marginRight: '5%' }, this.props.style]}>
                <AppText style={styles.Text}>"{this.props.text}"</AppText>
            </View>
        );
    }
}

export default ReviewCard;