import React, { Component } from 'react';
import { Text, TextStyle } from 'react-native';
interface IProps {
    style?: TextStyle
}
class AppText extends Component<IProps> {
    render() {
        return (
            <Text style={{ color: '#565656', ...this.props.style, fontFamily: 'Comfortaa-Regular', }}>{this.props.children}</Text>
        );
    }
}

export default AppText;