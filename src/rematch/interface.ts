import { ILoginPageState } from "./models/login/interface";
import { IMapScreenState } from "./models/map/interface";

export interface IRootState {
    loginPageModel: ILoginPageState,
    mapScreenModel: IMapScreenState
}