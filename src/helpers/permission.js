import React, { Component } from 'react';
import { withUser } from '../context/withUser';

class PermissionChecker extends Component {
  render() {
    console.log('Permission >>>>', this.props)
    const { currentUser } = this.props.userState;
    if (currentUser && currentUser.admin) {
       return this.props.children;
    }
    return '';
  }
};

export default withUser(PermissionChecker);
