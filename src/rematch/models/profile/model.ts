import { createModel, ModelConfig } from '@rematch/core';
import {
  IProfileState,
  IRetriveDataSuccess
} from './interface';
import firebase from 'firebase';

const loginPageModel: ModelConfig<IProfileState> = createModel({
  state: {
    displayName: '',
    email: '',
    phoneNumber: null,
    photoURL : "",
    uid: null,
    providerId: null
  },
  reducers: {
    retriveDataSuccess: (
      state: IProfileState,
      payload: IRetriveDataSuccess
    ): IProfileState => {
      return {
        ...state,
        ...payload.result
      }
    }
  },
  effects: {
    async createOrUpdateFirebaseUser (
      payload: IRetriveDataSuccess,
      _rootState: any
    ): Promise<void> {
      try {
        firebase.firestore().collection('users').doc(payload.result.uid).set(
          {
            email : payload.result.email,
            displayName : payload.result.displayName,
            photoURL: payload.result.photoURL || '',
            phoneNumber: payload.result.phoneNumber || '',
          },
          { merge: true }).then(() => {
            return payload.result;
          });
      } catch (err) {
        console.log(err);
      }
    }
  }
});

export default loginPageModel;
