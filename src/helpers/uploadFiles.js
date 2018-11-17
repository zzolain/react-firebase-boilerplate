import _ from 'lodash';
import firebase from 'firebase/app';
import { hashCode } from './hashCode';

export const uploadImage = (imageInputRef, temporary, callback) => {
  const fileRef = imageInputRef.current;
  const waitingImageUpload = [];
  if (fileRef.files) {
    _.forEach(fileRef.files, (file, index) => {
      if (index === 1) {
        return false;
      }
      waitingImageUpload.push(new Promise((res, rej) => {
        if (file) {
          const meta = {
            // Optional, used to check on server for file tampering
          };
          if (typeof temporary === 'boolean') {
            meta.temporary = temporary;
          }
          const fileName = hashCode(file.name);
          const storageRef = firebase.storage().ref();
          const imageFileRef = storageRef.child(`images/${fileName}`);
          const uploadTask = imageFileRef.put(file, meta);
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
            console.log('upload Error', error)// Handle unsuccessful uploads
            rej(error);
          }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            const snapshotRef = uploadTask.snapshot.ref;
            const path = snapshotRef.fullPath;
            snapshotRef.getDownloadURL().then((url) => {
            res({ url, path, });
            console.log('File available at', url, path);
            });
          })
        }
      }));
    });
    Promise.all(waitingImageUpload).then((images) => {
      callback(null, images);
    }, (error) => {
      callback(new Error(`Error at file uploading, ${error}`));
    });
  } else {
    // file 이 없다.
    callback(null, []);
  }
};
