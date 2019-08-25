// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import genericAvatar from '../images/generic_avatar.png';

const firebaseConfig = {
  apiKey: 'AIzaSyAyjDb8jBItsebqOOMkg7L38kGflG7q1_g',
  authDomain: 'library-a497e.firebaseapp.com',
  databaseURL: 'https://library-a497e.firebaseio.com',
  projectId: 'library-a497e',
  storageBucket: '',
  messagingSenderId: '374810652101',
  appId: '1:374810652101:web:a8bfc77027eec019',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

// FirebaseUI config.
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  privacyPolicyUrl() {
    window.location.assign('<your-privacy-policy-url>');
  },
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

const initApp = function initApp() {
  firebase.auth().onAuthStateChanged(
    (user) => {
      document.getElementById('loader').style.display = 'none';
      if (user) {
        // User is signed in.
        const { displayName } = user;
        const { photoURL } = user;
        user.getIdToken().then(() => {
          document.getElementById('sign-out').hidden = false;
          document.getElementById('sign-out').onclick = () => {
            firebase.auth().signOut();
          };
          document.querySelector('.container').style.display = 'block';
          document.getElementById('firebaseui-auth-container').hidden = true;
          document.getElementById('sign-in').hidden = false;
          document.querySelector('.welcome-msg').textContent = displayName;

          if (photoURL) {
            document.querySelector('.user-img').src = photoURL;
          } else {
            document.querySelector('.user-img').src = genericAvatar;
          }
        });
      } else {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('firebaseui-auth-container').hidden = false;
        document.getElementById('sign-out').hidden = true;
        document.getElementById('sign-in').hidden = true;
      }
    },
    (error) => {
      console.log(error);
    },
  );
};

window.addEventListener('load', () => {
  initApp();
});

const auth = firebase.auth();

export { firestore, auth };
