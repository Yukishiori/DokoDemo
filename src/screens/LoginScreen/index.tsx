import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Transition } from 'react-navigation-fluid-transitions';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { gradient } from '../../styles';
import AppText from '../../components/AppText';
import { Header, Left, Right, Icon, Content, Button } from 'native-base';
interface IProps extends NavigationScreenProps {

}
class LoginScreen extends Component<IProps> {

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.BackgroundGradient}>
                <View style={styles.LogoContainer}>

                </View>
                <View style={styles.ContentContainer}>
                  <View style={styles.LoginInputContainer}>
                    <View style={styles.IconContainer}>
                      <Icon name="user" type="FontAwesome" style={styles.Icon}></Icon>
                    </View>
                    <TextInput 
                      placeholder="Email" 
                      autoCapitalize="none" 
                      style={styles.TextInput} 
                    />
                  </View>
                  <View style={styles.LoginInputContainer}>
                    <View style={styles.IconContainer}>
                      <Icon name="lock" type="FontAwesome" style={styles.Icon}></Icon>
                    </View>
                    <TextInput 
                      placeholder="Password" 
                      autoCapitalize="none" 
                      secureTextEntry={true}
                      style={styles.TextInput} 
                    />
                  </View>
                  <TouchableOpacity style={styles.LoginTextContainer}>
                    <AppText style={styles.LoginText}>Login</AppText>
                  </TouchableOpacity>

                  <AppText>or</AppText>
                  <Button iconLeft style={styles.LoginWithFBButton}>
                    <Icon name='facebook' type="Entypo" style={styles.LoginWithFBIcon}/>
                    <AppText style={styles.LoginWithFBText}>Login with Facebook</AppText>
                  </Button>
                </View>
                <View style={styles.SignUpContainer}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                    <AppText>Dont' have an account? Sign up now.</AppText>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
        );
    }
}

export default LoginScreen;