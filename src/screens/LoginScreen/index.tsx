import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import AppText from '../../components/AppText';
interface IProps extends NavigationScreenProps {

}
class LoginScreen extends Component<IProps> {

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <AppText>Login</AppText>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Text>to Sign up</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default LoginScreen;