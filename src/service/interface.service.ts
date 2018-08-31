export interface ICoord {
    latitude: number;
    longitude: number;
}

export interface IPlace { 
    
}

export type LoginType = 'facebook' | 'email';

export interface ISignUpParams {
  email : string;
  password: string;
  fullName: string;
}

export interface ISignUpInputs {
  email : string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface ISignInParams {
  email : string;
  password : string;
}

export interface IUserInfo {
  
}

export interface ILoginParams {
  loginType: LoginType;
  token: string;
  idToken?: string;
}