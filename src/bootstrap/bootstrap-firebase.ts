import firebase from 'firebase';
require('firebase/firestore');
require('firebase/auth');
require('firebase/storage');
import config from '../config';
const settings = {
    timestampsInSnapshots: true
};

const bootstrapFirebase = () => {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(config.firebase);
        firebase.firestore().settings(settings);
    }
};

export default bootstrapFirebase;
