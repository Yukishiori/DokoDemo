import { createModel, ModelConfig } from '@rematch/core';
import {
  ILoginPageState,
  IChangeEmailPayload,
  IChangePasswordPayload
} from './interface';

const loginPageModel: ModelConfig<ILoginPageState> = createModel({
  state: {
    email: '',
    password: '',
    token: '',
    error: ''
  },
  reducers: {
    changeEmail: (
      state: ILoginPageState,
      payload: IChangeEmailPayload
    ): ILoginPageState => {
      return {
        ...state,
        email: payload.email
      };
    },
    changePassword: (
      state: ILoginPageState,
      payload: IChangePasswordPayload
    ): ILoginPageState => {
      return {
        ...state,
        password: payload.password
      }
    },
    loginSuccess: (
      state: ILoginPageState,
      payload: string
    ): ILoginPageState => {
      return {
        ...state,
        token: payload
      }
    },
    loginError: (
      state: ILoginPageState,
      payload: string
    ): ILoginPageState => {
      return {
        ...state,
        error: payload
      }
    }
  },
  effects: {
    async login(): Promise<void> {
      try {
        // const result = await loginService().login()
        const result = 'Hello'; 
        this.loginSuccess({ classes: result });
      } catch (err) {
        this.loginError({error: err.message});
      }
    },
  }
});

export default loginPageModel;
