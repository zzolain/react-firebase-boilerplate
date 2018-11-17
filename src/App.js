import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import Index from './components/Index';
import About from './components/About';
import Blog from './components/Blog';
import Post from './components/Post';
import WritePost from './components/WritePost';
import EditPost from "./components/EditPost";
import SignIn from './components/SignIn';
import { UserProvider, UserConsumer } from './context/withUser';
import * as firebase from 'firebase';
import config from './firebase';
import SideMenu from './components/_piece/SideMenu';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);
    firebase.auth()
  }
  render() {
    return firebase.app()
      ? (
          <UserProvider>
            <SideMenu />
            <div className="body">
              <Route exact path="/" component={Index} />
              <Route exact path="/about" component={About} />
              <Route exact path="/blog" component={Blog} />
              <PrivateRoute exact path="/blog/write" component={WritePost} />
              <Route exact path="/blog/post/:id" component={Post} />
              <PrivateRoute exact path="/blog/post/:id/edit" component={EditPost} />
              <Route exact path="/login" component={SignIn} />
            </div>
          </UserProvider>
        )
      : 'LOADING...'
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = firebase.auth();
  return (
    <UserConsumer>
      {store => {
        return auth.X ? (
          <Route
            {...rest}
            render={props => {
              if (store.state.currentUser.admin) {
                return <Component {...props} />
              }
              return (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: props.location}
                  }}
                />
              )
            }}
          />
        )
        : ''
      }}
  </UserConsumer>)
};
export default App;
