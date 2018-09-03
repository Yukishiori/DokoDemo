import { ViewStyle, Dimensions, TextStyle } from "react-native";
const { height, width } = Dimensions.get('screen');
const Container: ViewStyle = {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
    marginVertical: height * 0.03,
}
const Text: TextStyle = {
    flexWrap: 'wrap'
}
export default {
    Container,
    Text
}