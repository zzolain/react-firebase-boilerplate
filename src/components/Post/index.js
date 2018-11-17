import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import DraftJS from '../_piece/DraftJS/DraftJS';
import DraftJSViewer from '../_piece/DraftJSViewer/DraftJSViewer';
import PermissionChecker from "../../helpers/permission";
import PostForm from "../_piece/PostForm";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      post: {},
      author: {},
    }
  }
  componentDidMount() {
    firebase.database().ref(`posts/${this.props.match.params.id}`).once('value', (snapshot) => {
      const post = snapshot.val();
      console.log('post Data', post);
      firebase.database().ref(`posts/${this.props.match.params.id}`).update({ count: ++post.count, });
      const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(post.content)));
      firebase.database().ref(`users/${post.author}`).once('value', (snapshot) => {
        const author = snapshot.val();
        this.setState({
          post: {
            ...post,
            content: editorState,
          },
          author,
          ready: true,
        })
      })
    })
  }

  _deletePost = () => {
    const { imageFiles } = this.state.post;
    firebase.database().ref(`posts/${this.props.match.params.id}`).remove()
      .then(imageFiles && imageFiles.map(image => firebase.storage().ref(`${image.path}`).delete()))
      .then(this.props.history.push('/blog/'));
  };
  _navigateToBlog = () => this.props.history.push('/blog');
  _navigateToEditPost = () => this.props.history.push(`${this.props.location.pathname}/edit`);
  render() {
    const { ready, post, author } = this.state;
    return ready
    ? (
      <div>
        <button onClick={this._navigateToBlog}>목록보기</button>
        <div>
          <PermissionChecker>
            <button onClick={this._navigateToEditPost}>수 정</button>
            <button onClick={this._deletePost}>삭 제</button>
          </PermissionChecker>
        </div>
        <div>
          <p>작성자: {author.name}</p>
          <p>조회수: {post.count}</p>
        </div>
        <div>
          <img style={{ width: '400px', height: '200px', }} src={post.thumbnail.url} />
          <DraftJSViewer editorState={post.content}/>
        </div>
      </div>
      )
    : 'LOADING...';
  }
}

export default Post;
