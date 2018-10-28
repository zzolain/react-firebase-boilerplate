/* global document */
// https://github.com/draft-js-plugins/draft-js-plugins/blob/1da9943359a7e3dd9076daef2b4bea9de0e34eae/docs/client/components/pages/Image/AddImageEditor/ImageAdd/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storage } from '../../../firebase';
import { uploadImage } from '../../../helpers/uploadFiles';


class ImageAdd extends Component {
  constructor(props) {
    super(props);
    this.imageInputRef = React.createRef();
    this.state = {
      open: false,
    };
  }


  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick = () => {
    this.preventNextClose = true;
  };

  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  uploadImageOnBrowser = () => {
    const {
      editorState, onChange, modifier, addImageId,
    } = this.props;
    uploadImage(this.imageInputRef, true, (imageUploadError, imageFileIds) => {
      if (imageUploadError) {
        console.error(imageUploadError);
        return;
      }
      console.table(imageFileIds);
      // storage.call('provideImgSrc',
      //   imageFileIds,
      //   (error, imageFromServer) => {
      //     if (error) {
      //       console.error(error);
      //       return;
      //     }
      //     onChange(modifier(editorState, imageFromServer[0], { id: imageFileIds[0], }));
      //     addImageId(imageFileIds[0]);
      //   }
      // );
    });
  };

  render() {
    // const popoverClassName = this.state.open ?
    //   styles.addImagePopover :
    //   styles.addImageClosedPopover;
    // const buttonClassName = this.state.open ?
    //   styles.addImagePressedButton :
    //   styles.addImageButton;

    return (
      <div className={"styles.addImage"}>
        <button
          className={"buttonClassName"}
          onMouseUp={this.openPopover}
          type="button"
        >
          <svg className={"styles.icon_image"}>
            <use xlinkHref="/icon/image.svg#icon-image" />
          </svg>
        </button>
        <div
          className={"popoverClassName"}
          onClick={this.onPopoverClick}
          onKeyPress={this.onPopoverClick}
        >
          <input
            type="file"
            accept="image/*;capture=camera"
            ref={this.imageInputRef}
            onChange={this.uploadImageOnBrowser}
          />
        </div>
      </div>
    );
  }
}

ImageAdd.propTypes = {
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  modifier: PropTypes.func.isRequired,
};


export default ImageAdd;
