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
    fontSize: 20,
    marginHorizontal: width * 0.05,
    textAlign: 'center'
}

const Panel: ViewStyle = {
    height: width * 0.8 / 16 * 9,
    width: width * 0.8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: height * 0.05,
    justifyContent: 'center'
}

const Button: ViewStyle = {
    paddingVertical: height * 0.01,
    // paddingHorizontal: width * 0.03,
    alignItems: 'center',
    width: width * 0.3,
    borderRadius: 20
}

const ButtonContainer: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.02
}

const Bar: ViewStyle = {
    marginHorizontal: '5%',
    height: 6,
    borderRadius: 20,
    marginTop: '2%'
}

const Rec: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: height * 0.02
}
const MoreInfo: ViewStyle = {
    // flex: 1,
    position: 'absolute',
    top: height * 0.52,
    alignItems: 'center',
    // // height: height * 0.1,
    // justifyContent: 'flex-end',
    // marginBottom: 20,
    // backgroundColor: 'blue',
}

export default {
    Container,
    Solid,
    Image,
    Map,
    Cover,
    Title,
    Panel,
    Button,
    ButtonContainer,
    Bar,
    Rec,
    MoreInfo
}