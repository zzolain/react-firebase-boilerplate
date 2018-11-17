import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { withUser } from '../../context/withUser';

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
          return console.log('Created New User');
        });
        return true;
      } else {
        // 기존 유저일 경우 해당 user data에 google user profile을 업데이트.
        firebase.database().ref(`users/${uid}`).update({...profile}, (error) => {
          if (error) {
            return console.log('Error on SignIn', error);
          }
          return console.log('Updated Profile.');
        });
        return true;
      }
    },
  },
  // Popup signin flow rather than redirect flow.
  signInFlow: 'redirect',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ]
};

class SignIn extends Component {
  render() {
    const { currentUser } = this.props.userState;
    const isAdmin = currentUser && currentUser.admin;
    const from = (this.props.location.state && this.props.location.state.from) ? this.props.location.state.from : '/';
    if (isAdmin) {
      return <Redirect to={from}/>
    // } else if (!!Object.keys(currentUser).length) {
    //   return <Redirect to={from} />
    } else {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
  }
}

export default withUser(SignIn);
