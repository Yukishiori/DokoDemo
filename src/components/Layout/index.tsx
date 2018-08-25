import { Container, Content } from 'native-base';
import * as React from 'react';
import styles from './styles';
import { StatusBar, ViewStyle, Platform } from 'react-native';

export interface IProps {
    style?: ViewStyle;
}
export interface IState { }
class Layout extends React.Component<IProps, IState> {
    render(): React.ReactNode {
        return (
            <Container style={{ ...this.props.style, ...styles.Container }}>
                {Platform.OS === 'android' && <StatusBar barStyle="light-content" hidden />}
                {this.props.children}
            </Container>
        );
    }
}

export default Layout;
