import { ViewStyle, Dimensions, ImageStyle, TextStyle, Platform } from "react-native";
import { gradient } from "../../commonStyle";
const { width, height } = Dimensions.get('window');

const CardImage: ImageStyle = {
    width: width * 0.75,
    height: width * 0.75 / 16 * 10,
    borderRadius: 15,
}

const Card: ViewStyle = {
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 15
}

const Title: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.75,
    height: height * 0.09,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    justifyContent: 'center',
    padding: 10,
    borderColor: 'white',
}

const Text: TextStyle = {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 25
}

const TextContainer: ViewStyle = {
  position: 'absolute',
  width: width * 0.75,
  height: width * 0.75 / 40 * 10,
  bottom: 0,
  backgroundColor: 'white',
  borderBottomLeftRadius: 15,
  borderBottomRightRadius: 15,
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: 10,
  overflow: 'hidden'
}

export default {
    Card,
    CardImage,
    Title,
    Text,
    TextContainer
}
