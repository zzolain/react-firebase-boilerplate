import React, { Component } from 'react';
import { database } from '../../firebase';
import { convertToRaw, EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Formik, Form, Field } from 'formik';
import DraftJS from '../_piece/DraftJS';

class WritePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      editorState: EditorState.createEmpty(),
    }
  }
  onChange = editorState => this.setState({ editorState, });
  onSubmit = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const common = {
      createdAt: new Date(),
      author: 'TEST USER',
      title: 'TEST TITLE',
      likeCount: 0,
    };
    const rawState = JSON.stringify(convertToRaw(contentState));
    const contentHTML = convertToHTML(contentState);
    const postData = {
       ...common,
       content: rawState,
    };
    const postPreview = {
      ...common,
      content: contentHTML,
    };
    const newPostKey = database.ref().child('posts').push().key;
    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/posts-preview/' + newPostKey] = postPreview;
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
          onSubmit={values => console.table(values)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            handleBlur,
            handleSubmit,
            isSubmitting,
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
              />
              {errors.content && touched.content && errors.content}
              <button type="submit" disabled={errors.title || errors.content}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <button
          onClick={this.onSubmit}
        >
          작성
        </button>
      </div>
    )
  };
}

export default WritePost;
