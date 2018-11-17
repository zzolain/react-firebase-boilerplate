import React, { Component } from 'react';
import firebase from 'firebase/app';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
    firebase.database().ref('users').once('value', (snapshot) => {
      const users = snapshot.val();
      this.setState({ users: users ? Object.values(users) : [], isReady: true, });
    })
  }
  render() {
    const { isReady, users } = this.state;
    return isReady
      ? (
        <div>
          {console.log(this.state)}
          About
          {users.map(user => <img src={user.picture} />)}
        </div>
        )
      : 'LOADING...'
  }
}

export default About;
