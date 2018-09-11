import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, Image, AlertAndroid, Alert } from 'react-native';
import AppText from '../AppText';
import styles from './styles'
import placeService from '../../service/place.service';
import { gradient, width } from '../../commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { Icon } from 'native-base';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
import FastImage from 'react-native-fast-image';
interface IProps {
  place: IPlaceFromGoogle;
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

  render() {
    return (
      <View style={styles.Card}>
        {this.props.place.estimatedTime ?
          (<View style={{alignItems: 'flex-end', marginBottom: 20, width: '100%', paddingHorizontal: 50}}>
            <AppText style={{color: 'white', fontSize: 16}}>{`~ ${this.props.place.estimatedTime.text} moving`}</AppText>
          </View>) : <View></View>
        }
        {this.props.place.firstImageUrl
          ? <FastImage
            resizeMode="stretch"
            source={{ uri: this.props.place.firstImageUrl }}
            style={styles.CardImage}
          />
          : <View style={[styles.CardImage, { backgroundColor: 'gray' }]} />}
        <View style={styles.TextContainer}>
          <AppText style={styles.Text}>{this.props.place.name.toUpperCase()}</AppText>
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
