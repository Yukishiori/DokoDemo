import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, Image, AlertAndroid, Alert } from 'react-native';
import AppText from '../AppText';
import styles from './styles'
import placeService from '../../service/place.service';
import { gradient, width } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { Icon, CheckBox } from 'native-base';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import FastImage from 'react-native-fast-image';
interface IProps {
  place: IPlaceFromGoogle;
}

interface IState {
  uri: string;
  checked: boolean;
}

class FinalCard extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      uri: '',
      checked: false
    };
  }

  handlePress = () => {
    this.setState({checked: !this.state.checked})
  }

  render() {
    return (
      <View>
        {this.props.place.estimatedTime ?
          (<View style={{alignItems: 'flex-start', marginVertical: 10, width: '100%', paddingHorizontal: 30}}>
            <AppText style={{color: 'white', fontSize: 16}}>{`${this.props.place.estimatedTime.text} moving`}</AppText>
          </View>) : <View></View>
        }
        <View style={styles.TextContainer}>
          <CheckBox checked={this.state.checked} onPress={this.handlePress} color="green"></CheckBox>
          <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
            <AppText style={styles.Text}>{this.props.place.name}</AppText>
          </View>
          <View style={{paddingHorizontal: 10, minWidth: 60}}>
            {this.state.checked ? <AppText>1h40m</AppText> : <View></View>}
          </View>
        </View>
      </View>
    );
  }
}


const mapState = (rootState: IRootState) => {
  return {
    ...rootState.mapScreenModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.mapScreenModel
  };
};

export default connect(mapState, mapDispatch)(FinalCard);
