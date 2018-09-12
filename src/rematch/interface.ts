import { ILoginPageState } from "./models/login/interface";
import { IMapScreenState } from "./models/map/interface";
import { IProfileState } from "./models/profile/interface";
import { ISignUpPageState } from "./models/signUp/interface";

export interface IRootState {
    loginPageModel: ILoginPageState,
    mapScreenModel: IMapScreenState,
    profileModel: IProfileState,
    signUpModel: ISignUpPageState
}