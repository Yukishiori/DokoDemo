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

const ImageContainer: ViewStyle = {
  flex : Platform.OS === 'ios' ?  1/4: 1/5,
  margin: 0,
  zIndex: 2
}

const Circle: ImageStyle = {
  height: width * 0.32,
  width: width * 0.32,
  zIndex: 2,
  borderRadius: width * 0.16,
  position: 'absolute',
  left: width * 0.34,
  top: Platform.OS === 'ios' ? width * 0.25 : width * 0.2
};

const InfoContainer: ViewStyle = {
  marginTop: Platform.OS === 'ios' ? width * 0.25 : width * 0.2,
  flex: 1,
  margin: 0
}

const BodyGradient: ViewStyle = {
  width,
  height: height === 812 ? '125%' : '100%',
  position: "absolute",
  paddingTop: 0.2 * width,
  alignItems: 'center'
}

const TextInput = {
  backgroundColor: 'white',
  padding: 10,
  flex: 1,
  marginHorizontal: 10,
  height: 40,
  borderRadius: 5
}

const InputContainer: ViewStyle = {
  width: '100%',
  marginVertical: 10,
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center'
}

const FieldTitleContainer: ViewStyle = {
  minWidth: 70
}

const DatePickerButton: ViewStyle = {
  justifyContent: 'center'
}

const PlaceholderText: TextStyle = {
  color: '#bbb'
}

const UpdateButton: ViewStyle = {
  marginTop: 10,
  width: 80,
  paddingHorizontal: 5,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center'
}

export default {
    Header,
    Circle,
    ImageContainer,
    InfoContainer,
    BodyGradient,
    TextInput,
    InputContainer,
    FieldTitleContainer,
    DatePickerButton,
    PlaceholderText,
    UpdateButton
}