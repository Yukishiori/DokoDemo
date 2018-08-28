import firebase from 'firebase';
// import * as Joi from 'joi';

interface ISignUpParams {
  email : string;
  password: string;
  fullName: string;
}

interface ISignUpInputs {
  email : string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

interface ISignInParams {
  email : string;
  password : string;
}

const validateSignUpInput = (input: ISignUpInputs) => {
  if (input.password != input.confirmPassword) {
    return "Password does not match!"
  };
  // const validationRules = {
  //   email: Joi.string().email().required(),
  //   password: Joi.string().required(),
  //   fullName: Joi.string().required(),
  // }
  // const { error } = Joi.validate(input, validationRules, {
  //   allowUnknown: true,
  // });

  // if (error) {
  //   return error.details[0].message;
  // } else {
  //   return true;
  // }
  return true;
}
  
const signUpWithEmail = async ({ email, password, fullName }: ISignUpParams) => {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  const user = firebase.auth().currentUser;
  user.updateProfile({
      displayName: fullName,
      photoURL: user.photoURL,
  });
  const uid = user.uid;
  firebase.firestore().collection('users').doc(uid).set(
      {
        fullName
      },
      { merge: true });
}

const signInWithEmail = async ({ email, password }: ISignInParams) => {
  await firebase.auth()
      .signInWithEmailAndPassword(email, password);
}

export default {
  validateSignUpInput,
  signUpWithEmail,
  signInWithEmail
}