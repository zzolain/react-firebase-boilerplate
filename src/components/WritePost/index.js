import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { convertToRaw } from 'draft-js';
import { withUser } from '../../context/withUser';
import PostForm from "../_piece/PostForm";
import {hashCode} from "../../helpers/hashCode";

class WritePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFiles: [],
      thumbnailSrc: '',
    };
  }

  onSubmit = (values) => {
    const newPostKey = firebase.database().ref().child('posts').push().key;
    // image Upload
    const meta = {
      // Optional, used to check on server for file tampering
    };
    const file = values.thumbnail;
    const fileName = hashCode(file.name);
    const storageRef = firebase.storage().ref();
    const thumbnailFileRef = storageRef.child(`images/${fileName}`);
    const uploadTask = thumbnailFileRef.put(file, meta);
    uploadTask.on('state_changed', snapshot => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        default :
          break;
      }
    }, (error) => {
      firebase.database().ref().child(`posts/${newPostKey}`).delete();
      console.log('upload Error', error)// Handle unsuccessful uploads
    }, () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      const snapshotRef = uploadTask.snapshot.ref;
      const path = snapshotRef.fullPath;
      snapshotRef.getDownloadURL().then((url) => {
        console.log('File available at', url, path);
        // Create Post
        const contentState = values.content.getCurrentContent();
        const post = {
          _id: newPostKey,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          author: this.props.userState.currentUser.uid,
          title: values.title,
          theme: values.theme,
          likeCount: 0,
          imageFiles: values.imageFiles.concat([{url, path}]),
          thumbnail: { url, path, },
          content: JSON.stringify(convertToRaw(contentState))
        };
        const updates = {};
        updates['/posts/' + newPostKey] = post;
        firebase.database().ref().update(updates, (error) => {
          if (error) {
            return console.log('Error on WritePost', error);
          }
          return this.props.history.push(`/blog/post/${newPostKey}`);
        });
      });
    });
  };
  render() {
    console.log('WritePost >>>>', this.state);
    return (
      <div>
        WritePost
        <PostForm onSubmit={this.onSubmit}/>
      </div>
    )
  };
}



export default withUser(WritePost);
