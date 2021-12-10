import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAa9YACFwWSWt4tJVeWwBXx-0i0LreL70Q',
  authDomain: 'nemo-mega.firebaseapp.com',
  projectId: 'nemo-mega',
  storageBucket: 'nemo-mega.appspot.com',
  messagingSenderId: '563076820236',
  appId: '1:563076820236:web:23e55aa37073d5ec6bad29',
  measurementId: 'G-T9RDWNYG8M',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// https://firebase.google.com/docs/storage/web/start
export const storage = getStorage(app);
// https://firebase.google.com/docs/firestore/quickstart#web-version-9_1
export const db = getFirestore();
// https://firebase.google.com/docs/auth/web/start
export const auth = getAuth();

export const logOut = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    window.location.reload()
  }).catch((error) => {
    // An error happened.
  });
}