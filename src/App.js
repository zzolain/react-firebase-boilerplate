import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Index from './components/Index';
import About from './components/About';
import Blog from './components/Blog';
import Post from './components/Post';
import WritePost from './components/WritePost';
import SignIn from './components/SignIn';
import { UserProvider } from './context/withUser';
import * as firebase from 'firebase';
import config from './firebase';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);
  }
  render() {
    return (
      <UserProvider>
        <div className="App">
          <Route exact path="/" component={Index} />
          <Route exact path="/about" component={About} />
          <Route exact path="/blog" component={Blog} />
          <Route exact path="/blog/write" component={WritePost} />
          <Route exact path="/blog/post/:id" component={Post} />
          <Route exact path="/login" component={SignIn} />
        </div>
      </UserProvider>
    );
  }
}

export default App;
