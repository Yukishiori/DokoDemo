import { ViewStyle, Dimensions, Platform, ImageStyle, TextStyle } from "react-native";
const { width, height } = Dimensions.get('window');
const Header: ViewStyle = {
    width,
    flexDirection: 'row',
    position: 'absolute',
    height: height === 812 ? '125%' : '100%',
    marginTop: Platform.OS === 'ios' ? (height === 812 ? 30 : 20) : 0,
    paddingHorizontal: '5%',

};

const MapStyle: ViewStyle = {
    height: height * 0.40,
    width,
    flex: 1
};

const Circle: ImageStyle = {
    height: width * 0.32,
    width: width * 0.32,
    borderRadius: width * 0.16,
    position: 'absolute',
    left: width * 0.34,
    top: 0.30 * height,

};

const Content: ViewStyle = {
    // width,
    height: 0.53 * height,
    alignItems: 'center',
    // flex: 1
}

const FirstText: TextStyle = {
    color: 'white',
    marginTop: '23%',
    fontSize: 30
}

const Text2: TextStyle = {
    marginTop: Platform.OS === 'ios' ? 0 : '-5%',
    fontSize: 60,
    color: 'white'
};

const Button: ViewStyle = {
    marginTop: '5%',
    backgroundColor: 'white',
    width: width * 0.8,
    paddingVertical: height * 0.015,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 4,
};

const Or: ViewStyle = {
    marginTop: height * 0.02
}

export default {
    Header,
    MapStyle,
    Circle,
    Content,
    FirstText,
    Text2,
    Button,
    Or
}