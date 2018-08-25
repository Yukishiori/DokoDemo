import { ViewStyle, Platform, Dimensions } from 'react-native';
import { backgroundColor } from '../../styles';

const Container: ViewStyle = {
    backgroundColor,
    height: Dimensions.get('window').height
};

export default {
    Container,
};
