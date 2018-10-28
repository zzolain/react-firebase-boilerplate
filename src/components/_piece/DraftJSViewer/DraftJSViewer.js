import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool, } = alignmentPlugin;
const linkPlugin = createLinkPlugin();

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
);

const videoPlugin = createVideoPlugin({ decorator, });
const imagePlugin = createImagePlugin({ decorator, });

const plugins = [
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  videoPlugin,
  linkPlugin,
];

class DraftJSViewer extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }
  onChange = () => console.log('DraftJSViewer.onChange()');
  render() {
    // console.log('DraftJSViewer>>>>>>', this.props);
    return (
      <>
        <Editor
          editorState={this.props.editorState}
          onChange={() => this.onChange()}
          ref={this.editor}
          plugins={plugins}
          readOnly
        />
        <AlignmentTool />
      </>
    )
  }
}

export default DraftJSViewer;
