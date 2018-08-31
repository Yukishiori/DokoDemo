import { ViewStyle, Dimensions, Platform, ImageStyle, TextStyle } from "react-native";
import { gradient } from "../../commonStyle";
const { width, height } = Dimensions.get('screen');
const Container: ViewStyle = {
    width,
    height,
}

const Image: ImageStyle = {
    position: 'absolute',
    height: width * 0.8 / 16 * 10,
    width: width * 0.8,
    borderRadius: 20,
    top: - height * 0.175,
    shadowColor: '#000',
}

const Solid: ViewStyle = {
    width,
    height: height * 0.65,
    alignItems: 'center',
}

const Map: ViewStyle = {
    width,
    height: height * 0.35
}

const Cover: ViewStyle = {
    width,
    height: height * 0.4,
    opacity: 0.3,
    backgroundColor: gradient[0],
    position: 'absolute',
    top: 0
}

const Title: TextStyle = {
    marginTop: height * 0.12,
    color: 'white',
    fontSize: 20
}

const Panel: ViewStyle = {
    height: width * 0.8 / 16 * 10,
    width: width * 0.8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: height * 0.05,
}

export default {
    Container,
    Solid,
    Image,
    Map,
    Cover,
    Title,
    Panel
}