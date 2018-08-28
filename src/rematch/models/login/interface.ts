export interface ILoginPageState {
  email: string,
  password: string,
  token: string,
  error: string,
  isLoading: boolean
}

export interface IChangeEmailPayload {
  email: string;
}

export interface IChangePasswordPayload {
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}