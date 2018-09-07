import { ViewStyle, Dimensions, Platform, ImageStyle, TextStyle } from "react-native";
import { gradient } from "../../commonStyle";
const { width, height } = Dimensions.get('screen');
const Container: ViewStyle = {
    alignItems: 'center'
}

const Image: ImageStyle = {
    height: width * 0.8 / 16 * 10,
    width: width * 0.8,
    borderRadius: 20,
    marginTop: height * 0.05
}

const Title: TextStyle = {
    marginTop: height * 0.05,
    color: 'white',
    fontSize: 20,
    marginHorizontal: width * 0.1,
    textAlign: 'center'
}

const ScrollView: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width
}

const Header: ViewStyle = {
    width,
    flexDirection: 'row',
    position: 'absolute',
    height: height === 812 ? '125%' : '100%',
    marginTop: Platform.OS === 'ios' ? (height === 812 ? 30 : 20) : 0,
    paddingHorizontal: '5%',
    backgroundColor: gradient[1],
};

const TotalPanel: ViewStyle = {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingVertical: height * 0.025,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.05,
    width: width * 0.8
}

const TextInPanel: ViewStyle = {
    marginHorizontal: width * 0.05,
}

const SmallText: TextStyle = {
    marginLeft: '5%',
    fontSize: 12,
    marginVertical: Platform.OS === 'ios' ? 4 : 0
}

const BigText: TextStyle = {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: Platform.OS === 'ios' ? 7 : 3
}

const Bar: ViewStyle = {
    height: 7,
    borderRadius: 20,
    marginBottom: height * 0.03,
    marginTop: height * 0.01
}

const IconText: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
}

const Rec: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 7 : 0,
    alignItems: 'flex-end'
}

const Star: ViewStyle = {
    borderRadius: 5,
    backgroundColor: 'gray',
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.05
}

const Action: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-end',
}

const AddButton: ViewStyle = {
    borderRadius: 20,
    width: width * 0.7,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: height * 0.05
}

export default {
    Rec,
    Container,
    Image,
    Map,
    Title,
    ScrollView,
    Header,
    TotalPanel,
    TextInPanel,
    BigText,
    SmallText,
    Bar,
    IconText,
    Star,
    Action,
    AddButton
}