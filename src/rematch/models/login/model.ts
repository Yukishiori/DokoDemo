import { createModel, ModelConfig } from '@rematch/core';
import {
  ILoginPageState,
  IChangeEmailPayload,
  IChangePasswordPayload,
  ILoginPayload
} from './interface';
import authService from '../../../service/auth.service';

const loginPageModel: ModelConfig<ILoginPageState> = createModel({
  state: {
    email: '',
    password: '',
    token: '',
    error: '',
    isLoading: false
  },
  reducers: {
    starting: (state: ILoginPageState): ILoginPageState => {
      return {
        ...state,
        isLoading: true
      };
    },
    changeEmail: (
      state: ILoginPageState,
      payload: IChangeEmailPayload
    ): ILoginPageState => {
      return {
        ...state,
        email: payload.email,
        error: ""
      };
    },
    changePassword: (
      state: ILoginPageState,
      payload: IChangePasswordPayload
    ): ILoginPageState => {
      return {
        ...state,
        password: payload.password,
        error: ""
      }
    },
    loginSuccess: (
      state: ILoginPageState
    ): ILoginPageState => {
      return {
        ...state,
        error: "",
        isLoading: false
      }
    },
    loginError: (
      state: ILoginPageState,
      payload: string
    ): ILoginPageState => {
      return {
        ...state,
        error: payload,
        isLoading: false
      }
    }
  },
  effects: {
    async login(payload: ILoginPayload, _rootState: any): Promise<boolean> {
      try {
        this.starting();
        const validate = authService.validateLoginInput(payload);
        if(validate.status){
          await authService.signInWithEmail({
            email : payload.email , 
            password : payload.password
          });
          this.loginSuccess();
          return true;
        } else {
          this.loginError(validate.message);
          return false;
        }
      } catch (err) {
        this.loginError(err.message);
        return false;
      }
    },
    async loginWithFacebook(): Promise<void> {
      try {
        await authService.LoginWithFacebook();
        // this.loginSuccess();
      } catch (err) {
        this.loginError(err.message);
      }
    }
  }
});

export default loginPageModel;
