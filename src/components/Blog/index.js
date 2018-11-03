import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';
import { withUser } from '../../context/withUser';

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      ready: false,
    }
  }
  componentDidMount() {
    firebase.database().ref('posts').on('value', (snapshot) => {
      const data = snapshot.val();
      const posts = [];
      for (let postId in data) {
        posts.push({
          ...data[postId],
          _id: postId,
        })
      }
      this.setState({
        posts,
        ready: true,
      })
    })
  }
  componentWillUnmount() {
    firebase.database().ref('posts').off('value');
  }
  render() {
    const { ready, posts } = this.state;
    return ready
    ? (
        <div>
          {console.log(this.props.userState)}
          <ul>
          {posts.map(post => (
            <li key={post._id}>
              <Link to={`/blog/post/${post._id}`}>
                <p>{post._id}</p>
                <p dangerouslySetInnerHTML={{__html: convertToHTML(convertFromRaw(JSON.parse(post.content)))}} />
              </Link>
            </li>
          ))}
          </ul>
        </div>
      )
    : 'LOADING...';
  }
}

export default withUser(Blog);
