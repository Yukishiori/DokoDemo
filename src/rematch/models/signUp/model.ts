import { createModel, ModelConfig } from '@rematch/core';
import firebase from 'firebase';
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
        email: payload.email,
        error: ""
      };
    },
    changePassword: (
      state: ISignUpPageState,
      payload: IChangePasswordPayload
    ): ISignUpPageState => {
      return {
        ...state,
        password: payload.password,
        error: ""
      }
    },
    changeFullName: (
      state: ISignUpPageState,
      payload: IChangeFullNamePayload
    ): ISignUpPageState => {
      return {
        ...state,
        fullName: payload.fullName,
        error: ""
      }
    },
    changeConfirmPassword: (
      state: ISignUpPageState,
      payload: IChangeConfirmPasswordPayload
    ): ISignUpPageState => {
      return {
        ...state,
        confirmPassword: payload.confirmPassword,
        error: ""
      }
    },
    signUpSuccess: (
      state: ISignUpPageState,
      payload: string
    ): ISignUpPageState => {
      return {
        ...state,
        message: payload,
        error: "",
        isLoading: false
      }
    },
    signUpError: (
      state: ISignUpPageState,
      payload: string
    ): ISignUpPageState => {
      return {
        ...state,
        error: payload,
        isLoading: false
      }
    }
  },
  effects: {
    async signUp(payload: ISignUpPayload, _rootState: any): Promise<boolean> {
      try {
        this.starting();
        const validate = authService.validateSignUpInput(payload);
        if(validate.status){
          const result = await authService.signUpWithEmail({
            email : payload.email , 
            password : payload.password, 
            fullName : payload.fullName
          });
          if (result) {
            this.signUpSuccess("Sign up successfully!");
            return true;
          }
        } else {
          this.signUpError(validate.message);
          return false;
        }
      } catch (err) {
        this.signUpError(err.message);
        return false;
      }
    },
  }
});

export default loginPageModel;
