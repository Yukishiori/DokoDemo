import React from "react";
import ScreenNames from '../../screens/ScreenNames';
import { Container, Content, Text, List, ListItem, Left, Icon, Body, Right, Button } from "native-base";
import { gradient } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import AppText from "../AppText";
import firebase from 'firebase';

const routes = [{
  name: "Profile",
  route: "Profile",
  icon: "user"
}];
export default class SideBar extends React.Component<any, any> {

  logOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate(ScreenNames.SplashScreen);
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <LinearGradient style={{ height: 120, width: '100%', alignItems: 'center', justifyContent: 'center' }} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}  >
            <AppText style={{ color: 'white', fontSize: 20 }}>Dokodemo</AppText>
          </LinearGradient>
          <ListItem
            button
            icon
            onPress={() => this.props.navigation.navigate(ScreenNames.RestScreen)}>
            <Left>
              <Button style={{ backgroundColor: "white", shadowColor: 'white', shadowOpacity: 0 }} onPress={() => this.props.navigation.navigate(ScreenNames.RestScreen)}>
                <Icon name="home" type="FontAwesome" style={{ color: gradient[0] }}></Icon>
              </Button>
            </Left>
            <Body>
              <AppText>Home</AppText>
            </Body>
          </ListItem>
          <ListItem
            button
            icon
            onPress={() => this.props.navigation.navigate(ScreenNames.ProfileScreen)}>
            <Left>
              <Button style={{ backgroundColor: "white", shadowColor: 'white', shadowOpacity: 0 }} onPress={() => this.props.navigation.navigate(ScreenNames.ProfileScreen)}>
                <Icon name="user" type="FontAwesome" style={{ color: gradient[0] }}></Icon>
              </Button>
            </Left>
            <Body>
              <AppText>Profile</AppText>
            </Body>
          </ListItem>
          <ListItem
            button
            icon
            onPress={() => this.logOut()}
          >
            <Left>
              <Button style={{ backgroundColor: "white", shadowColor: 'white', shadowOpacity: 0 }} onPress={() => this.logOut()}>
                <Icon name="power-off" type="FontAwesome" style={{ color: gradient[0] }}></Icon>
              </Button>
            </Left>
            <Body>
              <AppText>Log out</AppText>
            </Body>

          </ListItem>
        </Content>
      </Container>
    );
  }
}
