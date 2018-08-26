import { init } from '@rematch/core';
import loginPageModel from './models/login/model';

export const store = init({
    models: {
      loginPageModel
    }
  });

export default store;