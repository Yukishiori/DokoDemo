import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, Image, AlertAndroid, Alert } from 'react-native';
import AppText from '../AppText';
import styles from './styles'
import placeService from '../../service/place.service';
import { gradient, width, height } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { Icon, CheckBox } from 'native-base';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import FastImage from 'react-native-fast-image';
interface IProps {
  place: IPlaceFromGoogle;
  onChecked: (arg: any) => void;
  checkedPlaces: any;
  onPress: any
}

interface IState {
  uri: string;
}

class FinalCard extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      uri: ''
    };
  }

  handlePress = () => {
    this.props.onChecked({
      placeId: this.props.place.place_id,
      placeName: this.props.place.name
    })
    this.props.onPress();
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={{ alignItems: 'flex-start', paddingVertical: height * 0.01, marginVertical: height * 0.01, width: '100%', paddingHorizontal: 30 }}>
          {this.props.place.estimatedTime ? <AppText style={{ color: 'white', fontSize: 16 }}>{`${this.props.place.estimatedTime.text} moving`}</AppText> : <View></View>}
        </View>
        <View style={styles.TextContainer}>
          <CheckBox checked={!!this.props.checkedPlaces.filter((val: any) => val.placeId === this.props.place.place_id).length} onPress={this.handlePress} color={gradient[1]}></CheckBox>
          <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
            <AppText style={styles.Text}>{this.props.place.name}</AppText>
          </View>
          <View style={{ paddingHorizontal: 10, minWidth: 70 }}>
            {this.props.checkedPlaces.filter((val: any) => val.placeId === this.props.place.place_id).length ? <AppText>1h40m</AppText> : <View></View>}
          </View>
        </View>
      </TouchableOpacity >
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
