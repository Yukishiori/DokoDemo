import { ViewStyle, Platform, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
const Container: ViewStyle = {
    marginTop: Platform.OS === 'ios' ? 20 : 0
};

const backgroundColor = 'white'

const gradient = ['#F7A951', '#FB8779'];

export {
    Container,
    backgroundColor,
    gradient,
    width, height
}