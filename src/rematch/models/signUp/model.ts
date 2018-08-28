import { createModel, ModelConfig } from '@rematch/core';
import {
  ISignUpPageState,
  IChangeEmailPayload,
  IChangePasswordPayload,
  IChangeFullNamePayload,
  IChangeConfirmPasswordPayload,
  IToggleLoadingPayload,
  ISignUpPayload
} from './interface';
import authService from '../../../service/auth.service';

const loginPageModel: ModelConfig<ISignUpPageState> = createModel({
  state: {
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    error: '',
    message : '',
    isLoading: false
  },
  reducers: {
    starting: (state: ISignUpPageState): ISignUpPageState => {
      return {
        ...state,
        isLoading: true
      };
    },
    changeEmail: (
      state: ISignUpPageState,
      payload: IChangeEmailPayload
    ): ISignUpPageState => {
      return {
        ...state,
        email: payload.email
      };
    },
    changePassword: (
      state: ISignUpPageState,
      payload: IChangePasswordPayload
    ): ISignUpPageState => {
      return {
        ...state,
        password: payload.password
      }
    },
    changeFullName: (
      state: ISignUpPageState,
      payload: IChangeFullNamePayload
    ): ISignUpPageState => {
      return {
        ...state,
        fullName: payload.fullName
      }
    },
    changeConfirmPassword: (
      state: ISignUpPageState,
      payload: IChangeConfirmPasswordPayload
    ): ISignUpPageState => {
      return {
        ...state,
        confirmPassword: payload.confirmPassword
      }
    },
    toggleLoading : (
      state: ISignUpPageState,
      payload: IToggleLoadingPayload
    ): ISignUpPageState => {
      return {
        ...state,
        isLoading: payload.isLoading
      }
    },
    signUpSuccess: (
      state: ISignUpPageState,
      payload: string
    ): ISignUpPageState => {
      return {
        ...state,
        message: payload,
        isLoading: false
      }
    },
    signUpError: (
      state: ISignUpPageState,
      payload: string
    ): ISignUpPageState => {
      return {
        ...state,
        error: payload
      }
    }
  },
  effects: {
    async signUp(payload: ISignUpPayload, _rootState: any): Promise<void> {
      try {
        // console.log('rootState', _rootState);
        this.starting();
        const validate = authService.validateSignUpInput(payload);
        if(validate){
          await authService.signUpWithEmail({
            email : payload.email , 
            password : payload.password, 
            fullName : payload.fullName
          });
          
        } else {
          this.signUpError(validate);
        }
      } catch (err) {
        this.signUpError(err.message);
      }
    },
  }
});

export default loginPageModel;
