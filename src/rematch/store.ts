import { init } from '@rematch/core';
import loginPageModel from './models/login/model';
import signUpPageModel from './models/signUp/model';

export const store = init({
    models: {
      loginPageModel,
      signUpPageModel
    }
  });

export default store;