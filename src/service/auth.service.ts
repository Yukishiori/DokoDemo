import firebase from 'firebase';
import { LoginManager, LoginResult, AccessToken } from 'react-native-fbsdk';
import { ISignInParams, ISignUpInputs, ISignUpParams, IUserInfo } from './interface.service';
import userService from './user.service';
import config from '../config';

const validateLoginInput = (input: ISignInParams) => {
  if (!input.email) {
    return {
      status: false,
      message: "Email is required"
    }
  }
  if (!input.password) {
    return {
      status: false,
      message: "Password is required"
    }
  }
  return {
    status: true,
    message: "Validate successfully"
  }
}

const validateSignUpInput = (input: ISignUpInputs) => {
  if (input.password != input.confirmPassword) {
    return {
      status: false,
      message: "Password does not match!"
    }
  };
  if (!input.email) {
    return {
      status: false,
      message: "Email is required"
    }
  }
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(String(input.email).toLowerCase())) {
    return {
      status: false,
      message: 'Email is not valud'
    }
  }
  if (!input.fullName) {
    return {
      status: false,
      message: 'Full name is required'
    }
  }
  if (!input.password) {
    return {
      status: false,
      message: 'Password is required!'
    }
  }
  if (input.password.length < 6) {
    return {
      status: false,
      message: "Password must be at least 6 characters"
    }
  }
  return {
    status: true,
    message: "Validate successfully"
  }
}

const signUpWithEmail = async ({ email, password, fullName }: ISignUpParams) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    firebase.firestore().collection('users').doc(uid).set(
      {
        fullName
      },
      { merge: true }).then(() => {
        return user;
      });
  }).catch((err) => { throw new Error(err.message) });
}

const signInWithEmail = async ({ email, password }: ISignInParams) => {
  await firebase.auth()
    .signInWithEmailAndPassword(email, password);
}

const LoginWithFacebook = async () => {
  const result: LoginResult = await LoginManager.logInWithReadPermissions(config.facebook.permissions);
  console.log('shit', result);
  if (result.isCancelled) {
    return;
  }
  const accessToken: AccessToken = await AccessToken.getCurrentAccessToken();

  const userInfo = await userService.login({ loginType: 'facebook', token: accessToken.accessToken });
  console.log('userInfo', userInfo);
  return userInfo;
}

export default {
  validateSignUpInput,
  validateLoginInput,
  signUpWithEmail,
  signInWithEmail,
  LoginWithFacebook
}