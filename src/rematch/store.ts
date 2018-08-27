import { init } from '@rematch/core';
import loginPageModel from './models/login/model';
import mapScreenModel from './models/map/model';
export const store = init({
  models: {
    loginPageModel,
    mapScreenModel
  }
});

export default store;