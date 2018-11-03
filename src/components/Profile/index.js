import React, { Component } from 'react';
import firebase from 'firebase/app';

class Profile extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    admin.auth().getUser(uid)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });/**/
    return (
      <div>
        Profile
      </div>
    )
  }
}

