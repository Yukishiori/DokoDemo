import { ViewStyle, Dimensions, Platform, ImageStyle, TextStyle } from "react-native";
const { width, height } = Dimensions.get('window');

const BackgroundGradient: ViewStyle = {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
}

const LoginText: TextStyle = {
  fontSize: 22
}

const LogoContainer: ViewStyle = {
  flex: Platform.OS === 'ios' ? 1 : 1/3,
  alignItems: 'center',
  justifyContent: 'center'
}

const ContentContainer: ViewStyle = {
  flex : 1,
  alignItems: 'center',
  paddingTop: 20,
  paddingHorizontal: 50,
  width: '100%'
}

const Icon: TextStyle = {
  fontSize: 18,
  color: '#565656'
}

const LoginTextContainer: ViewStyle = {
  marginTop: 5,
  marginBottom: 10,
  flexDirection: 'row'
}

const TextInput = { 
  paddingLeft: Platform.OS === 'ios' ? 30 : 5, 
  marginLeft: Platform.OS === 'ios' ? 0 : 25,
  color: '#565656', 
  marginBottom: Platform.OS === 'ios' ? 0 : 5,
  fontFamily: 'Comfortaa-Regular'
}

const IconContainer: ViewStyle = {
  position: 'absolute', 
  top: Platform.OS === 'ios' ? 7 : 13, 
  left: 15
}

const LoginInputContainer: ViewStyle = {
  width: '100%',
  marginVertical: 10,
  height: Platform.OS === 'ios' ? 35 : 45,
  paddingHorizontal : 10,
  paddingVertical : Platform.OS === 'ios' ? 10 : 0,
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
    LoginText,
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