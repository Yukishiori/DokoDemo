import { ViewStyle, Dimensions, ImageStyle, TextStyle } from "react-native";
import { gradient } from "../../commonStyle";
const { width, height } = Dimensions.get('screen');

const CardImage: ImageStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: width * 0.80,
    height: width * 0.8 / 16 * 10,
    borderRadius: 20
}

const Card: ViewStyle = {
    flex: 1,
    marginHorizontal: width * 0.1,
    borderRadius: 20,
    overflow: 'hidden'
}

const Title: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.86,
    height: height * 0.09,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    justifyContent: 'center',
    padding: 10
}

const Text: TextStyle = {
    fontSize: 16,
    color: 'white'
}

export default {
    Card,
    CardImage,
    Title,
    Text
}
