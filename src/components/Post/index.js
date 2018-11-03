import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import DraftJS from '../_piece/DraftJS/DraftJS';
import DraftJSViewer from '../_piece/DraftJSViewer/DraftJSViewer';

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
  _addImageFile = (imageFile) => {
    const { post } = this.state;
    this.setState({
      post: {
        ...post,
        imageFiles: post.imageFiles ? post.imageFiles.concat(imageFile) : [ imageFile, ],
      },
    });
  };
  onChange = (editorStateName, editorState) => {
    const post = {
      ...this.state.post,
      content: editorState,
    };
    this.setState({ post, })
  };
  _deletePost = () => {
    const { imageFiles, } = this.state.post;
    firebase.database().ref(`posts/${this.props.match.params.id}`).remove()
      .then(imageFiles && imageFiles.map(image => firebase.storage().ref(`${image.path}`).delete()))
      .then(this.props.history.push('/blog/'));
  };
  _updatePost = () => {
    const contentState = this.state.post.content.getCurrentContent();
    const rawState = JSON.stringify(convertToRaw(contentState));
    const post = {
      ...this.state.post,
      content: rawState,
    };
    const updates = {};
    updates[`posts/${this.props.match.params.id}`] = post;
    firebase.database().ref().update(updates, (error) => {
      if (error) {
        return console.log('Error on Post._updatePost()', error);
      }
      return this.setState({ editMode: false, })
    })
  };
  _setModeToEdit = () => this.setState({ editMode: true, });
  render() {
    const { ready, post, editMode, author } = this.state;
    console.log('Post State>>>>>', this.state);
    return ready
    ? (
      <div>
        <Link to="/blog"><button>목록보기</button></Link>
        <div>
          <button onClick={this._setModeToEdit}>수 정</button>
          <button onClick={this._deletePost}>삭 제</button>
        </div>
        <div>
          작성자 >>>>>> {author.name}
        </div>
        {editMode
          ? (
            <>
              <DraftJS editorState={post.content} onChange={this.onChange} _addImageFile={this._addImageFile}/>
              <button onClick={this._updatePost}>저 장</button>
            </>
          )
          : <DraftJSViewer editorState={post.content}/>
        }
      </div>
      )
    : 'LOADING...';
  }
}

export default Post;
