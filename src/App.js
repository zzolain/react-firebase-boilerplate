import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Blog from './components/Blog';
import Post from './components/Post';
import WritePost from './components/WritePost';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" render={() => <>path: /</>} />
        <Route exact path="/blog" component={Blog} />
        <Route exact path="/blog/write" component={WritePost} />
        <Route exact path="/blog/post/:id" component={Post} />
      </div>
    );
  }
}

export default App;
