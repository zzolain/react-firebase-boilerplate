import React, { Component } from 'react';
import { serverValue, database } from '../../firebase';
import { convertToRaw, EditorState } from 'draft-js';
import { Formik, Form } from 'formik';
import DraftJS from '../_piece/DraftJS/DraftJS';

class WritePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFiles: [],
    }
  }
  _addImageFile = (imageFile) => this.setState({ imageFiles: this.state.imageFiles.concat(imageFile), });
  onSubmit = (values) => {
    const contentState = values.content.getCurrentContent();
    const post = {
      createdAt: serverValue.TIMESTAMP,
      author: 'TEST USER',
      title: values.title,
      likeCount: 0,
      imageFiles: this.state.imageFiles,
      content: JSON.stringify(convertToRaw(contentState))
    };
    const newPostKey = database.ref().child('posts').push().key;
    const updates = {};
    updates['/posts/' + newPostKey] = post;
    database.ref().update(updates, (error) => {
      if (error) {
        return console.log('Error on WritePost', error);
      }
      return this.props.history.push(`/blog/post/${newPostKey}`);
    });
  };
  render() {
    return (
      <div>
        <Formik
          initialValues={{
            title: '',
            content: EditorState.createEmpty(),
          }}
          validate={values => {
            let errors = {};
            if (!values.title) {
              errors.title = '제목을 입력해 주세요.';
            } else if (!values.content.getCurrentContent().hasText()) {
              errors.content = '내용을 입력해 주세요.'
            }
            return errors;
          }}
          onSubmit={this.onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              {console.log('>>>>>>>', values)}
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={values.title}
              />
              {errors.title && touched.title && errors.title}
              <DraftJS
                editorState={values.content}
                editorStateName="content"
                onChange={setFieldValue}
                placeholder="글을 입력해 보세요."
                _addImageFile={this._addImageFile}
              />
              {errors.content && touched.content && errors.content}
              <button type="submit" disabled={errors.title || errors.content}>
                작 성
              </button>
            </Form>
          )}
        </Formik>
      </div>
    )
  };
}

export default WritePost;
