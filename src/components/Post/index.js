import React, { Component } from 'react';
import { database } from '../../firebase';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import DraftJS from '../_piece/DraftJS';
import DraftJSViewer from '../_piece/DraftJSViewer';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      post: {},
      editMode: false
    }
  }
  componentDidMount() {
    database.ref(`posts/${this.props.match.params.id}`).once('value', (snapshot) => {
      const data = snapshot.val();
      const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
      this.setState({
        post: {
          ...data,
          content: editorState,
        },
        ready: true,
      })
    })
  }
  onChange = (editorState) => this.setState({
    post: {
      ...this.state.post,
      content: editorState,
    },
  });
  _deletePost = () => {
    database.ref(`posts/${this.props.match.params.id}`).remove()
      .then(database.ref(`posts-preview/${this.props.match.params.id}`).remove())
      .then(this.props.history.push('/blog/'));
  };
  _updatePost = () => {
    const contentState = this.state.post.content.getCurrentContent();
    const rawState = JSON.stringify(convertToRaw(contentState));
    const contentHTML = convertToHTML(contentState);
    const postData = {
      ...this.state.post,
      content: rawState,
    };
    const postPreview = {
      ...this.state.post,
      content: contentHTML,
    };
    const updates = {};
    updates[`posts/${this.props.match.params.id}`] = postData;
    updates[`posts-preview/${this.props.match.params.id}`] = postPreview;
    database.ref().update(updates, (error) => {
      if (error) {
        return console.log('Error on Post._updatePost()', error);
      }
      return this.setState({ editMode: false, })
    })
  };
  _setModeToEdit = () => this.setState({ editMode: true, });
  render() {
    const { ready, post, editMode } = this.state;
    console.log('Post >>>>>', this.props);
    console.log('Post State>>>>>', this.state);
    return ready
    ? (
      <div>
        <div>
          <button onClick={this._setModeToEdit}>수 정</button>
          <button onClick={this._deletePost}>삭 제</button>
        </div>
        {editMode
          ? (
            <>
              <DraftJS editorState={post.content} onChange={this.onChange} />
              <button onClick={this._updatePost}>저 장</button>
            </>
          )
          : <DraftJSViewer editorState={post.content}/>
        }
      </div>
      )
    : '';
  }
}

export default Post;
