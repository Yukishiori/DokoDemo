import { createModel, ModelConfig } from '@rematch/core';
import {
  IProfileState,
  IRetriveDataSuccess,
  IChangeUpdateInput,
  IUpdateProfileUser
} from './interface';
import firebase from 'firebase';
import { Alert } from 'react-native';

const loginPageModel: ModelConfig<IProfileState> = createModel({
  state: {
    displayName: '',
    email: '',
    phoneNumber: null,
    photoURL: "",
    gender: "",
    dob: "",
    uid: null,
    providerId: null,
    updateInputs: {}
  },
  reducers: {
    retriveDataSuccess: (
      state: IProfileState,
      payload: IRetriveDataSuccess
    ): IProfileState => {
      return {
        ...state,
        ...payload.result,
        uid: payload.uid
      }
    },
    changeUpdateInputs: (
      state: IProfileState,
      payload: IChangeUpdateInput
    ): IProfileState => {
      return {
        ...state,
        updateInputs: { ...state.updateInputs, ...payload }
      }
    }
  },
  effects: {
    async createOrUpdateFirebaseUser(
      payload: IRetriveDataSuccess,
      _rootState: any
    ): Promise<void> {
      try {
        firebase.firestore().collection('users').doc(payload.uid).set(
          payload.result,
          { merge: true }).then(() => {
            return payload.result;
          });
      } catch (err) {
        Alert.alert(
          'Something went wrong! Please try again.',
          "",
          [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false }
        )
        console.log(err);
      }
    },
    async updateProfileUser(
      payload: IUpdateProfileUser,
      _rootState: any
    ): Promise<void> {
      try {
        firebase.firestore().collection('users').doc(payload.uid).set(
          payload,
          { merge: true }).then(() => {
            return payload;
          });
        Alert.alert(
          'Update successfully!',
          "",
          [
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false }
        )
      } catch (err) {
        Alert.alert(
          'Something went wrong! Please try again.',
          "",
          [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            { text: 'OK', onPress: () => { } },
          ],
          { cancelable: false }
        )
        console.log(err);
      }
    }
  }
});

export default loginPageModel;
