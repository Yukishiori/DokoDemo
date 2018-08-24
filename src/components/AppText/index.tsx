import React, { Component } from 'react';
import { Text, TextStyle } from 'react-native';
interface IProps {
    styles?: TextStyle
}
class AppText extends Component<IProps> {
    render() {
        return (
            <Text style={[this.props.styles ? this.props.styles : {}, { fontFamily: 'Comfortaa-Regular' }]}>{this.props.children}</Text>
        );
    }
}

export default AppText;