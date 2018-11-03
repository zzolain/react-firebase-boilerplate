import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

// Configure FirebaseUI.
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      const { isNewUser, profile } = authResult.additionalUserInfo;
      const { uid } = authResult.user;
      // 신규 유저일 경우 user DB에 firebase Auth uid와 같은 id의 user Data를 생성.
      if (isNewUser) {
        firebase.database().ref().child(`users/${uid}`).set({
          ...profile,
          uid,
        }, (error) => {
          if (error) {
            return console.log('Error on SignUp', error);
          }
          return console.log(`Created New User, ${uid}`);
        });
      } else {
        // 기존 유저일 경우 해당 user data에 google user profile을 업데이트.
        firebase.database().ref(`users/${uid}`).update({...profile}, (error) => {
          if (error) {
            return console.log('Error on SignIn', error);
          }
          return console.log('Profile Updated.');
        });
      }
    },
  },
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ]
};

class SignIn extends React.Component {
  render() {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </div>
    );
  }
}

export default SignIn;
