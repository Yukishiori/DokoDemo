import { ViewStyle, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get('window');
const Map: ViewStyle = {
    width,
    height
};

const Header: ViewStyle = {
    width,
    flexDirection: 'row',
    position: 'absolute',
    height: height === 812 ? '125%' : '100%',
    marginTop: Platform.OS === 'ios' ? (height === 812 ? 30 : 20) : 0,
    paddingHorizontal: '5%',

};

const ShowSchedule: ViewStyle = {
    borderRadius: height * 0.1,
    width: width * 0.5,
    paddingVertical: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
}

export default {
    Map,
    Header,
    ShowSchedule
}