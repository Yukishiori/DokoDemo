import { init } from '@rematch/core';
import loginPageModel from './models/login/model';
import signUpPageModel from './models/signUp/model';
import mapScreenModel from './models/map/model';
import profileModel from './models/profile/model';

export const store = init({
    models: {
      loginPageModel,
      signUpPageModel,
      mapScreenModel,
      profileModel
    }
  });

export default store;