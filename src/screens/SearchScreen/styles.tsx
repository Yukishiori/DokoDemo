import { ViewStyle, Dimensions, Platform } from "react-native";
import { gradient } from "../../commonStyle";
const { width, height } = Dimensions.get('window');
const MapView: ViewStyle = {
  height,
  width,
  position: 'absolute',
  top: 0,
  left: 0
}

const Panel: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}


const Header: ViewStyle = {
  width: width * 0.9,
  flexDirection: 'row',
  position: 'absolute',
  height: height * 0.07,
  top: Platform.OS === 'ios' ? (height === 812 ? 60 : 50) : 30,
  left: '5%',
  borderRadius: 10,
  borderWidth: 3,
  borderColor: gradient[1],
  backgroundColor: 'white',
  // justifyContent: 'center',
  alignItems: 'center'
};

const SearchPanel: ViewStyle = {
  borderRadius: 20,
  backgroundColor: 'white',
  width: width * 0.9,
  height: height * 0.1,
  alignItems: 'center',
  marginTop: height * 0.05
};

const TextInput: ViewStyle = {
  height: height * 0.05,
  width: width * 0.7,
  marginLeft: width * 0.03,
}


const Bar: ViewStyle = {
  height: 7,
  marginBottom: height * 0.03,
  width: width * 0.8,
}

const SearchBar: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between', alignItems: 'center',
}

const PredictionCard: ViewStyle = {
  width: width * 0.8,
  marginLeft: width * 0.1,
  justifyContent: 'center',
  paddingVertical: height * 0.01,
  backgroundColor: 'white',
  paddingHorizontal: width * 0.05,
  borderWidth: 1,
  borderColor: 'gray'
}

const PredictionList: ViewStyle = {
  position: 'absolute',
  top: height * 0.13,

}

export default {
  MapView,
  Panel,
  Header,
  SearchPanel,
  TextInput,
  Bar,
  SearchBar,
  PredictionCard,
  PredictionList
}