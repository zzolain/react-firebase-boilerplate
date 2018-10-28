React + Firebase boilerPlate

required to create `/src/firebase.js` file.

```
import * as fb from 'firebase';

const config = {
  apiKey: your apiKey,
  authDomain: your authDomain,
  databaseURL: your databaseURL,
  projectId: your projectId,
  storageBucket: your storageBucket,
  messagingSenderId: your messagingSenderId
};
fb.initializeApp(config);

export const database = fb.database();
```

