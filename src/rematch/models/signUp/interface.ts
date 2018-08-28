export interface ISignUpPageState {
  email: string,
  fullName: string,
  password: string,
  confirmPassword: string,
  error: string,
  message: string,
  isLoading: boolean
}

export interface IChangeEmailPayload {
  email: string;
}

export interface IChangePasswordPayload {
  password: string;
}

export interface IChangeFullNamePayload {
  fullName: string;
}

export interface IChangeConfirmPasswordPayload {
  confirmPassword: string;
}

export interface IToggleLoadingPayload {
  isLoading: boolean;
}

export interface ISignUpPayload {
  email : string;
  password: string;
  fullName: string;
  confirmPassword : string;
}