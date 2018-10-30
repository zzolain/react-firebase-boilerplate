import React, { Component } from 'react';
import { database } from '../../firebase';
import { Link } from 'react-router-dom';
import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      ready: false,
    }
  }
  componentDidMount() {
    database.ref('posts').on('value', (snapshot) => {
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
    database.ref('posts').off('value');
  }
  render() {
    const { ready, posts } = this.state;
    console.log('Blog >>>>>>', this.state);
    return ready
    ? (
        <div>
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

export default Blog;
