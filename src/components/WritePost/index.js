import React, { Component } from 'react';
import { serverValue, database } from '../../firebase';
import { convertToRaw, EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Formik, Form } from 'formik';
import DraftJS from '../_piece/DraftJS/DraftJS';

class WritePost extends Component {
  constructor(props) {
    super(props);
  }
  onChange = editorState => this.setState({ editorState, });
  onSubmit = (values) => {
    const contentState = values.content.getCurrentContent();
    const common = {
      createdAt: serverValue.TIMESTAMP,
      author: 'TEST USER',
      title: values.title,
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
