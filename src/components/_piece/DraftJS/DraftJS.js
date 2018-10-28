import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDragNDropUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';
import createInlineToolbarPlugin, { Separator } from '@next-interactive/draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons';
import mockUpload from './mockUpload';
// import VideoAdd from './VideoAdd';
import ImageAdd from './ImageAdd';
import './draftjs.css';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool, } = alignmentPlugin;
const linkPlugin = createLinkPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
    linkPlugin.LinkButton,
  ],
});
const { InlineToolbar, } = inlineToolbarPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const videoPlugin = createVideoPlugin({ decorator, });
const imagePlugin = createImagePlugin({ decorator, });

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage,
});

const plugins = [
  dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  videoPlugin,
  inlineToolbarPlugin,
  linkPlugin,
];

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
};

class DraftJS extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }

  onChange = (editorState) => {
    this.props.onChange(this.props.editorStateName, editorState);
  };

  focus = () => {
    this.editor.current.focus();
  };

  onTab = (e) => {
    const maxDepth = 4;
    this.props.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  };

  handleKeyCommand = (command) => {
    const { editorState, } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  render() {
    const { editorState, placeholder, } = this.props;
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="RichEditor-root">
        <div className={className} onClick={this.focus}>
          <Editor
            placeholder={placeholder}
            plugins={plugins}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            ref={this.editor}
            spellCheck
          />
          <AlignmentTool />
          <InlineToolbar />
        </div>
        <ImageAdd
          modifier={imagePlugin.addImage}
          onChange={this.onChange}
          editorState={editorState}
        />
        {/*<VideoAdd*/}
          {/*editorState={editorState}*/}
          {/*onChange={this.onChange}*/}
          {/*modifier={videoPlugin.addVideo}*/}
        {/*/>*/}
      </div>
    )
  }
}

export default DraftJS;

DraftJS.propTypes = {
  placeholder: PropTypes.string,
};

DraftJS.defaultProps = {
  placeholder: '',
};
