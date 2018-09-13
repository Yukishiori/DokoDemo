import { ViewStyle, TextStyle, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get('window');
const Map: ViewStyle = {
  width: width,
  // height: height / 4,
  flex: 1
};

const Header: ViewStyle = {
  width,
  flexDirection: 'row',
  position: 'absolute',
  height: height === 812 ? '125%' : '100%',
  marginTop: Platform.OS === 'ios' ? (height === 812 ? 30 : 20) : 0,
  paddingHorizontal: '5%',

};

const BigContainer: ViewStyle = {
  minHeight: '100%',
  marginTop: Platform.OS === 'ios' ? 20 : 0,
  marginBottom: 20
}

const BigScrollViewContainer: ViewStyle = {
  flex: 1,
  paddingBottom: 60
}

const BigLinearGradient: ViewStyle = {
  // height: height / 4 * 3,
  // marginBottom: 30,
  // padding: 0
  flex: 1,
  justifyContent: 'space-between'
}

const ShowSchedule: ViewStyle = {
  borderRadius: height * 0.1,
  width: width * 0.5,
  paddingVertical: height * 0.02,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2
}

const SumsContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: width * 0.05,
  width: width * 0.9,
  borderRadius: 15,
  backgroundColor: 'white',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignSelf: 'center',
  paddingVertical: height * 0.02,
  marginTop: height * 0.02,
  marginBottom: height * 0.05
}

const GoButton: ViewStyle = {
  marginLeft: width * 0.05,
  borderRadius: 15,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
}

const EstimateTime: TextStyle = {
  alignSelf: 'center',
  fontWeight: 'bold',
  color: 'black',
  fontSize: 16,
}

const EstimateNumber: TextStyle = {
  alignSelf: 'center',
  fontWeight: 'bold'
}

const HeaderContainer: ViewStyle = {
  padding: 0,
  marginTop: Platform.OS === 'ios' ? -20 : 0
}

export default {
  Map,
  Header,
  ShowSchedule,
  BigContainer,
  BigLinearGradient,
  SumsContainer,
  GoButton,
  EstimateTime,
  BigScrollViewContainer,
  EstimateNumber,
  HeaderContainer,
}