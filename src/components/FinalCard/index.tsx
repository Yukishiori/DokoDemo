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
import moment from "moment";

interface IProps {
  place: IPlaceFromGoogle;
  onChecked: (arg: any) => void;
  checkedPlaces: any;
  onPress: any,
  startTime: number;
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
      placeName: this.props.place.name,
      endTime: Date.now(),
      movingTime: this.props.place.estimatedTime
    })
    this.props.onPress();
  }

  secondsToHms = (d: number) => {
    d = Number(d);
    var day = Math.floor(d / (3600 * 24));
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var dDisplay = day > 0 ? day + (day == 1 ? " day" : " days") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    if (!day && !h && !m) {
      var sDisplay = Math.floor(d) > 0 ? Math.floor(d) + (Math.floor(d) == 1 ? " second" : " seconds") : "";
      return sDisplay;
    }
    return dDisplay + hDisplay + mDisplay;
  }

  render() {
    const checkedPlace = this.props.checkedPlaces.filter((val: any) => val.placeId === this.props.place.place_id);
    return (
      <View >
        <View style={{ alignItems: 'flex-start', paddingVertical: height * 0.01, marginVertical: height * 0.01, width: '100%', paddingHorizontal: 30 }}>
          {this.props.place.estimatedTime ? <AppText style={{ color: 'white', fontSize: 16 }}>{`${this.secondsToHms(this.props.place.estimatedTime.value)} moving`}</AppText> : <View></View>}
        </View>
        <TouchableOpacity style={styles.TextContainer} onPress={this.props.onPress}>
          <CheckBox checked={!!this.props.checkedPlaces.filter((val: any) => val.placeId === this.props.place.place_id).length} onPress={this.handlePress} color={gradient[1]}></CheckBox>
          <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
            <AppText style={styles.Text}>{this.props.place.name}</AppText>
          </View>
          <View style={{ paddingHorizontal: 10, minWidth: 70 }}>
            {checkedPlace.length ? <AppText>{moment(checkedPlace[0].endTime).format('hh:mm')}</AppText> : <View></View>}
          </View>
        </TouchableOpacity>
      </View >
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
