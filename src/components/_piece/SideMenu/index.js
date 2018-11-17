import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import { withUser } from '../../../context/withUser';

const SideMenu = (props) => {
  const { currentUser, isReady } = props.userState;
  const signOut = () => firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log('Signed Out');
  }).catch((error) => {
    // An error happened.
    console.log('Error on SignOut() >>>', error)
  });
  return (
    <nav>
      <ul>
        {isReady
          ? (!!Object.keys(currentUser).length
              ? <li onClick={signOut}>LOG OUT</li>
              : <li><Link to="/login">LOG IN</Link></li>
            )
          : 'LOADING...'
        }
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/blog">BLOG</Link></li>
      </ul>
    </nav>
  )
};

export default withUser(SideMenu);
