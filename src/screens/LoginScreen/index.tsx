import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Transition } from 'react-navigation-fluid-transitions';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { gradient } from '../../commonStyle';
import AppText from '../../components/AppText';
import { Header, Left, Right, Icon, Content, Button } from 'native-base';
import { connect } from 'react-redux';
interface IProps extends NavigationScreenProps {
  changeEmail: any;
  login: any;
  changePassword: any;
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  loginWithFacebook: any;
}
class LoginScreen extends Component<IProps> {
  static navigationOptions = {
    header: null,
  };

  login = async () => {
    const result = await this.props.login({
      email: this.props.email,
      password: this.props.password
    })
    if (result) {
      this.props.navigation.navigate('Main');
    }
  }


  render() {
    return (

      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.BackgroundGradient}>
          <View style={styles.LogoContainer}>
            <AppText style={{ fontSize: 30 }}>Dokodemo</AppText>
          </View>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
            behavior="padding"
            style={styles.ContentContainer}
          >
            <View style={styles.LoginInputContainer}>
              <View style={styles.IconContainer}>
                <Icon name="user" type="FontAwesome" style={styles.Icon}></Icon>
              </View>

              <TextInput
                placeholder="Email"
                autoCapitalize="none"
                style={styles.TextInput}
                onChangeText={(value) => this.props.changeEmail({ email: value })}
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
                onChangeText={(value) => this.props.changePassword({ password: value })}
              />
            </View>
            <View>
              <AppText style={{ color: "red" }}>{this.props.error}</AppText>
            </View>
            <TouchableOpacity style={styles.LoginTextContainer} onPress={this.login}>
              <AppText style={styles.LoginText}>Login</AppText>
              {this.props.isLoading && <ActivityIndicator size="small" style={{ marginLeft: 10 }}></ActivityIndicator>}
            </TouchableOpacity>

            <AppText>or</AppText>
            <Button iconLeft style={styles.LoginWithFBButton} onPress={this.props.loginWithFacebook}>
              <Icon name='facebook' type="Entypo" style={styles.LoginWithFBIcon} />
              <AppText style={styles.LoginWithFBText}>Login with Facebook</AppText>
            </Button>
          </KeyboardAvoidingView>

          <View style={styles.SignUpContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <AppText style={{ textDecorationLine: 'underline', fontSize: 16 }}>Dont' have an account? Sign up now.</AppText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.loginPageModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.loginPageModel,
  };
};

export default connect(mapState, mapDispatch)(LoginScreen);