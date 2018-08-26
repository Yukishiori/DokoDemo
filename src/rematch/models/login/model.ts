import { createModel, ModelConfig } from '@rematch/core';
import {
  ILoginPageState,
  IChangUsernameInputPayload,
} from './interface';

const loginPageModel: ModelConfig<ILoginPageState> = createModel({
  state: {
    username: 'helu',
    token: '',
    error: ''
  },
  reducers: {
    changeUsernameInput: (
      state: ILoginPageState,
      payload: IChangUsernameInputPayload
    ): ILoginPageState => {
      return {
        ...state,
        username: payload.username
      };
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
