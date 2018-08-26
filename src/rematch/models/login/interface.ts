export interface ILoginPageState {
  username: string,
  token: string,
  error: string
}

export interface IChangUsernameInputPayload {
  username: string;
}