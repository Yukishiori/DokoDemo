import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
interface IProps extends NavigationScreenProps {

}
class SignUpScreen extends Component<IProps> {

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <AppText>Sign in</AppText>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}>
                    <Text>Done</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default SignUpScreen;