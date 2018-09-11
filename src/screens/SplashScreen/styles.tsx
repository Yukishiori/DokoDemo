import { ViewStyle, Dimensions, Platform, ImageStyle, TextStyle } from "react-native";
const { width, height } = Dimensions.get('window');

const BackgroundGradient: ViewStyle = {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
}

const Logo: ImageStyle = {
    width: width / 2,
    height: width / 2,
    backgroundColor: 'rgba(0,0,0,0)'
}

export default {
    BackgroundGradient,
    Logo
}