import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from './styles';

import { connect } from 'react-redux';
import { IRootState } from '../../rematch/interface';
import { gradient } from '../../commonStyle';
import FinalCard from '../../components/FinalCard';
import { IPlaceFromGoogle } from '../../rematch/models/map/interface';
// import Modal from 'react-native-modal';
import ScreenNames from '../ScreenNames';
import Layout from '../../components/Layout';
import { Content, Header, Left, Icon, Right, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../components/AppText';

interface IProps extends NavigationScreenProps {
  chosenPlaces: any;
}

interface IState {

}

class FinalScreen extends Component<IProps, IState> {
  map: MapView = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.00070,
        longitudeDelta: 0.0070,
      },
      isModalVisible: false,
    };
  }

  renderItem = ({ item }: { item: IPlaceFromGoogle, index: number }) => {
    return <FinalCard
      place={item}
    />
  }

  render() {
    console.log('props', this.props);
    return (
      <ScrollView contentContainerStyle={styles.BigContainer}>
        <LinearGradient style={styles.BigLinearGradient} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
          <View>
            <View>
              <FlatList
                data={this.props.chosenPlaces}
                renderItem={this.renderItem}
                keyExtractor={(_item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.SumsContainer}>
              <AppText style={styles.EstimateTime}>Estimate time : 1h30</AppText>
              <TouchableOpacity>
                <LinearGradient style={styles.GoButton} colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                  <View>
                    <AppText style={{color: 'white'}}>Let's go</AppText>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView >
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

export default connect(mapState, mapDispatch)(FinalScreen);
