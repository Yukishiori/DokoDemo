export interface IProfileState {
  displayName?: string,
  email: string,
  phoneNumber?: string,
  photoURL? : string,
  uid? : string,
  providerId? : string
}

export interface IRetriveDataSuccess {
  result : {
    displayName?: string,
    email: string,
    phoneNumber?: string,
    photoURL? : string,
    uid? : string
  }
}