
// from https://github.com/draft-js-plugins/draft-js-plugins/blob/9eec34318a311a592839ab498ab2d27bd88500a5/docs/client/components/pages/Image/CustomImageEditor/mockUpload.js
import { readFile } from '@mikeljames/draft-js-drag-n-drop-upload-plugin/lib/utils/file';

export default function mockUpload(data, success, failed, progress) {
  function doProgress(percent) {
    progress(percent || 1);
    if (percent === 100) {
      // Start reading the file
      Promise.all(data.files.map(readFile)).then(files => success(files, { retainSrc: true, }));
    } else {
      setTimeout(doProgress, 250, (percent || 0) + 10);
    }
  }

  doProgress();
}