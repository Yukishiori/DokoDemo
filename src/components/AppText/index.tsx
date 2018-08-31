import React, { Component } from 'react';
import { Text, TextStyle } from 'react-native';
interface IProps {
    style?: TextStyle
}
class AppText extends Component<IProps> {
    render() {
        if (this.props.style && this.props.style.fontWeight === 'bold') {
            return <Text style={{ color: '#565656', ...this.props.style, fontFamily: 'Comfortaa-Bold', }}>{this.props.children}</Text>
        }
        return (
            <Text style={{ color: '#565656', ...this.props.style, fontFamily: 'Comfortaa-Regular', }}>{this.props.children}</Text>
        );
    }
}

export default AppText;