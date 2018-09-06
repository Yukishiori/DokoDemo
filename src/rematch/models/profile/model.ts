import { createModel, ModelConfig } from '@rematch/core';
import {
  IProfileState,
  IRetriveDataSuccess
} from './interface';

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
    
  }
});

export default loginPageModel;
