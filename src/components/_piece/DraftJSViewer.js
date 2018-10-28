import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';

class DraftJSViewer extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }
  onChange = () => console.log('DraftJSViewer.onChange()');
  render() {
    console.log('DraftJSViewer>>>>>>', this.props);
    return (
      <Editor
        editorState={this.props.editorState}
        onChange={() => this.onChange()}
        ref={this.editor}
        readOnly
      />
    )
  }
}

export default DraftJSViewer;
