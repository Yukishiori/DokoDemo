export interface IProfileState {
  displayName?: string,
  email: string,
  phoneNumber?: string,
  dob?: string,
  gender?: string,
  photoURL? : string,
  uid? : string,
  providerId? : string,
  updateInputs : any
}

export interface IRetriveDataSuccess {
  result : {
    displayName?: string,
    email: string,
    phoneNumber?: string,
    photoURL? : string,
    uid? : string,
    gender?: string,
    dob?: string
  },
  uid: string
}

export interface IChangeUpdateInput {
  email?: string,
  phoneNumber?: string,
  displayName?: string,
  dob?: string,
  gender?: string
}

export interface IUpdateProfileUser {
  uid: string,
  email?: string,
  phoneNumber?: string,
  displayName?: string,
  dob?: string,
  gender?: string
}