import { ViewStyle, Dimensions, Platform, ImageStyle, TextStyle } from "react-native";
const { width, height } = Dimensions.get('window');

const BackgroundGradient: ViewStyle = {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
}

const SignUpText: TextStyle = {
  fontSize: 22,
  marginVertical: 15
}

const LogoContainer: ViewStyle = {
  flex: 1/3
}

const ContentContainer: ViewStyle = {
  flex : 1,
  alignItems: 'center',
  paddingTop: 20,
  paddingHorizontal: 50,
  width: '100%'
}

const Icon: TextStyle = {
  fontSize: 21,
  color: '#565656'
}

const LoginTextContainer: ViewStyle = {
  marginTop: 5,
  marginBottom: 10,
  flexDirection: 'row'
}

const TextInput = { 
  paddingLeft: 5,
  color: '#565656', 
  fontFamily: 'Comfortaa-Regular'
}

const IconContainer: ViewStyle = {
  position: 'absolute', 
  top: 7, 
  left: 15
}

const LoginInputContainer: ViewStyle = {
  width: '100%',
  marginVertical: 10,
  height: 35,
  padding : 10,
  borderRadius: 20,
  backgroundColor: 'rgba(255,255,255,0.6)'
  
}

const LoginWithFBText: TextStyle = {
  color: '#eee',
  fontSize: 17,
  flex: 1,
  textAlign: 'center'
}

const LoginWithFBIcon: TextStyle = {
  fontSize: 20
}

const LoginWithFBButton: ViewStyle = {
  backgroundColor: '#4267b2',
  marginVertical: 10
}

const SignUpContainer: ViewStyle = {
  marginBottom: 20
}

export default {
    BackgroundGradient,
    SignUpText,
    LogoContainer,
    ContentContainer,
    Icon,
    IconContainer,
    TextInput,
    LoginInputContainer,
    LoginTextContainer,
    LoginWithFBText,
    LoginWithFBIcon,
    LoginWithFBButton,
    SignUpContainer
}