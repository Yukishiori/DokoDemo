import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { gradient } from '../../styles';
import AppText from '../../components/AppText';
import { Header, Left, Right, Icon, Content, Button } from 'native-base';
import { connect } from 'react-redux';
interface IProps extends NavigationScreenProps {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  changeEmail: any;
  changeFullName: any;
  changePassword: any;
  changeConfirmPassword: any;
  signUp : any;
}
class SignUpScreen extends Component<IProps> {

    signUp = () => {
      this.props.signUp({
        email : this.props.email,
        fullName: this.props.fullName,
        password: this.props.password,
        confirmPassword: this.props.confirmPassword
      })
    }
    render() {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.BackgroundGradient}>
            <View style={styles.LogoContainer}>

            </View>
            <View style={styles.ContentContainer}>
              <AppText style={styles.SignUpText}>Fill Your Information:</AppText>
              <View style={styles.LoginInputContainer}>
                <TextInput 
                  placeholder="Email" 
                  value={this.props.email}
                  autoCapitalize="none" 
                  style={styles.TextInput} 
                  onChangeText={(value) => this.props.changeEmail({email : value})}
                />
              </View>
              <View style={styles.LoginInputContainer}>
                <TextInput 
                  placeholder="Full Name" 
                  value={this.props.fullName}
                  autoCapitalize="none" 
                  style={styles.TextInput} 
                  onChangeText={(value) => this.props.changeFullName({fullName : value})}
                />
              </View>
              <View style={styles.LoginInputContainer}>
                <TextInput 
                  placeholder="Password" 
                  value={this.props.password}
                  autoCapitalize="none" 
                  secureTextEntry={true}
                  style={styles.TextInput} 
                  onChangeText={(value) => this.props.changePassword({password : value})}
                />
              </View>
              <View style={styles.LoginInputContainer}>
                <TextInput 
                  placeholder="Confirm Password"
                  value={this.props.confirmPassword} 
                  autoCapitalize="none" 
                  secureTextEntry={true}
                  style={styles.TextInput} 
                  onChangeText={(value) => this.props.changeConfirmPassword({confirmPassword : value})}
                />
              </View>
              <TouchableOpacity style={styles.LoginTextContainer} onPress={this.signUp}>
                <AppText style={styles.SignUpText}>Sign Up</AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.SignUpContainer}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <AppText>Already have an account? Login now.</AppText>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        );
    }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.signUpPageModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.signUpPageModel,
  };
};


export default connect(mapState, mapDispatch)(SignUpScreen);