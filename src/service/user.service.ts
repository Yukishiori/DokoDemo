import firebase from 'firebase';
import { ILoginParams , IUserInfo } from './interface.service';

export default {
  login : async ({ loginType, token, idToken }: ILoginParams): Promise<IUserInfo> => {
    console.log('here');
    let credential: firebase.auth.AuthCredential;
    if (loginType === 'facebook') {
        credential = firebase.auth.FacebookAuthProvider.credential(token);
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const result = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
    console.log('result', result);

    return {
        loginType,
        email: result.user.email,
    };
  }
}