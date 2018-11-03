import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';
import { withUser } from '../../context/withUser';
import PermissionChecker from "../../helpers/permission";

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isAuthorReady: false,
      isPostReady: false,
    }
  }
  componentDidMount() {
    firebase.database().ref('users').once('value', (snapshot) => {
      this.setState({
        authors: snapshot.val(),
        isAuthorReady: true,
      })
    });
    firebase.database().ref('posts').on('value', (snapshot) => {
      const data = snapshot.val();
      const posts = data ? Object.values(snapshot.val()) : [];
      this.setState({
        posts,
        isPostReady: true,
      })
    });
  }
  componentWillUnmount() {
    firebase.database().ref('posts').off('value');
  }
  render() {
    console.log('blog>>>>', this.state);
    const { authors, posts, isAuthorReady, isPostReady } = this.state;
    const ready = isAuthorReady && isPostReady;
    return ready
    ? (
        <div>
          <PermissionChecker>
            <Link to="/blog/write"><button>글쓰기</button></Link>
          </PermissionChecker>
          <ul>
          {posts.map(post => (
            <li key={post._id}>
              <span>Title: {post.title}</span>
              <Link to={`/blog/post/${post._id}`}>
                <p dangerouslySetInnerHTML={{__html: convertToHTML(convertFromRaw(JSON.parse(post.content)))}} />
              </Link>
              <p>{authors[post.author].name}</p>
            </li>
          ))}
          </ul>
        </div>
      )
    : 'LOADING...';
  }
}

export default withUser(Blog);
