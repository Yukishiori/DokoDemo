import { ViewStyle, Dimensions, ImageStyle, TextStyle } from "react-native";
import { gradient } from "../../commonStyle";
const { width, height } = Dimensions.get('screen');

const CardImage: ImageStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: width * 0.75,
    height: width * 0.75 / 16 * 10,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: 'white'
}

const Card: ViewStyle = {
    flex: 1,
    marginHorizontal: width * 0.03,
    borderRadius: 10,
    overflow: 'hidden'
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
    backgroundColor: 'white'
}

const Text: TextStyle = {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold'
}

const DeleteButton: ViewStyle = {
    height: height * 0.05, 
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 0
}

export default {
    Card,
    CardImage,
    Title,
    Text,
    DeleteButton
}
