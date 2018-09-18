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
    // height: height * 0.40,
    width,
    flex: 1
};

const Circle: ImageStyle = {
    height: width * 0.1,
    width: width * 0.1,
    borderRadius: width * 0.05,
};

const Content: ViewStyle = {
    // height: 0.53 * height,
    alignItems: 'center',
    width,
    flex: 1,
}

const FirstText: TextStyle = {
    color: 'white',
    marginTop: '23%',
    fontSize: 30
}

const Text2: TextStyle = {
    marginTop: Platform.OS === 'ios' ? 0 : '-5%',
    fontSize: 55,
    color: 'white'
};

const Button: ViewStyle = {
    // marginTop: '5%',
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
    marginBottom: 5,
};

const Or: ViewStyle = {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10
}

const User: ViewStyle = {
    top: height * 0.5,
    justifyContent: 'center',
    position: 'absolute',
    flexDirection: 'row',
    width
}

export default {
    Header,
    MapStyle,
    Circle,
    Content,
    FirstText,
    Text2,
    Button,
    Or,
    User
}