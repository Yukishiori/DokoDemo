export interface ILoginPageState {
  email: string,
  password: string,
  token: string,
  error: string
}

export interface IChangeEmailPayload {
  email: string;
}

export interface IChangePasswordPayload {
  password: string;
}