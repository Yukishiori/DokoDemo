import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
interface IProps extends NavigationScreenProps {

}
class IntroScreen extends Component<IProps> {

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <AppText>Wassup</AppText>
            </View>
        );
    }
}

export default IntroScreen;