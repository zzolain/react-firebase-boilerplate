import _ from 'lodash';
import * as firebase from 'firebase';
import { storage } from '../firebase';

export const uploadImage = (imageInputRef, temporary, callback) => {
  const fileRef = imageInputRef.current;
  const waitingImageUpload = [];
  if (fileRef.files) {
    _.forEach(fileRef.files, (file, index) => {
      if (index === 10) {
        return false;
      }
      waitingImageUpload.push(new Promise((res, rej) => {
        if (file) {
          const meta = {
            userId: 'TEST USER', // Optional, used to check on server for file tampering
          };
          if (typeof temporary === 'boolean') {
            meta.temporary = temporary;
          }
          const storageRef = storage.ref();
          const imageFileRef = storageRef.child(`images/${file.name}`);
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
            }
          }, (error) => {
            console.log('upload Error', error)// Handle unsuccessful uploads
            rej(error);
          }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              res(downloadURL);
              console.log('File available at', downloadURL);
            });
          })
        }
      }));
    });
    Promise.all(waitingImageUpload).then((downloadURLs) => {
      callback(null, downloadURLs);
    }, (error) => {
      callback(new Error(`Error at file uploading, ${error}`));
    });
  } else {
    // file 이 없다.
    callback(null, []);
  }
};
