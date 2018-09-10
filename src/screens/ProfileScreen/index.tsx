import React from "react";
import { TouchableOpacity, Image, TextInput, View, Text } from 'react-native';
import { Container, Header, Left, Icon, Right, Button } from "native-base";
import AppText from '../../components/AppText';
import { gradient } from '../../commonStyle';
import Layout from '../../components/Layout';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { DEFAULT_AVATAR } from '../../config/constants';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';

class Profile extends React.Component<any,any> {
  state = {
    isDateTimePickerVisible: false
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date: any) => {
    this.props.changeUpdateInputs({dob: date.toDateString()});
    this._hideDateTimePicker();
  };


  render() {
    return (
      <Container>
        <Header style={{ padding: 0 }}>
          <LinearGradient style={styles.Header} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
              <Left style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                      <Icon name="three-bars" style={{ color: 'white' }} type="Octicons" />
                  </TouchableOpacity>
              </Left>
              <Right />
          </LinearGradient>
        </Header>
        <Image source={{uri: this.props.photoURL || DEFAULT_AVATAR}} style={styles.Circle}/>
        <Layout style={styles.InfoContainer}>
          <LinearGradient style={styles.BodyGradient} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
            <View style={styles.InputContainer}>
              <View style={styles.FieldTitleContainer}>
                <AppText style={{fontSize: 18, color: '#333', fontWeight: 'bold'}}>Email</AppText>
              </View>
              <TextInput
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  style={styles.TextInput}
                  onChangeText={(value) => this.props.changeUpdateInputs({ email: value })}
                  defaultValue={this.props.email}
                />
            </View>
            <View style={styles.InputContainer}>
              <View style={styles.FieldTitleContainer}>
                <AppText style={{fontSize: 18, color: '#333', fontWeight: 'bold'}}>Name</AppText>
              </View>
              <TextInput
                  placeholder="Enter your name"
                  autoCapitalize="none"
                  style={styles.TextInput}
                  onChangeText={(value) => this.props.changeUpdateInputs({ displayName: value })}
                  defaultValue={this.props.displayName}
                />
            </View>
            <View style={styles.InputContainer}>
              <View style={styles.FieldTitleContainer}>
                <AppText style={{fontSize: 18, color: '#333', fontWeight: 'bold'}}>Phone</AppText>
              </View>
              <TextInput
                  placeholder="Enter your phone number"
                  autoCapitalize="none"
                  style={styles.TextInput}
                  onChangeText={(value) => this.props.changeUpdateInputs({ phoneNumber: value })}
                  defaultValue={this.props.phoneNumber}
                />
            </View>
            <View style={styles.InputContainer}>
              <View style={styles.FieldTitleContainer}>
                <AppText style={{fontSize: 18, color: '#333', fontWeight: 'bold'}}>Gender</AppText>
              </View>
              <TextInput
                  placeholder="Enter your gender"
                  autoCapitalize="none"
                  style={styles.TextInput}
                  onChangeText={(value) => this.props.changeUpdateInputs({ gender: value })}
                  defaultValue={this.props.gender}
                />
            </View>
            <View style={styles.InputContainer}>
              <View style={styles.FieldTitleContainer}>
                <AppText style={{fontSize: 18, color: '#333', fontWeight: 'bold'}}>DOB</AppText>
              </View>
              <TouchableOpacity style={[styles.TextInput, styles.DatePickerButton]} onPress={this._showDateTimePicker}>
                {this.props.dob || this.props.updateInputs.dob ? 
                  (<Text>{this.props.updateInputs.dob ? this.props.updateInputs.dob : this.props.dob}</Text>)
                  : (<Text style={styles.PlaceholderText}>Choose your date of birth</Text>)}
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
              />
            </View>
            <View>
              <Button block success style={styles.UpdateButton} onPress={() => this.props.updateProfileUser({uid: this.props.uid , ...this.props.updateInputs})}>
                <AppText style={{color: 'white'}}>Update</AppText>
              </Button>
            </View>
          </LinearGradient>
        </Layout>
      </Container>
    );
  }
}

const mapState = (rootState: any) => {
  return {
      ...rootState.profileModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
      ...rootReducer.profileModel
  };
};

export default connect(mapState, mapDispatch)(Profile);