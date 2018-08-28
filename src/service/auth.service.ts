import firebase from 'firebase';

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
      message : "Password is required"
    }
  }
  return {
    status : true,
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
      message : "Email is required"
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
      message : "Password must be at least 6 characters"
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
  }).catch((err) => {throw new Error(err.message)});
}

const signInWithEmail = async ({ email, password }: ISignInParams) => {
  await firebase.auth()
      .signInWithEmailAndPassword(email, password);
}

export default {
  validateSignUpInput,
  validateLoginInput,
  signUpWithEmail,
  signInWithEmail
}