import firebase from "firebase";
import uuid from "uuid";

export default {
  methods: {
    upload({ ref, content }) {
      let { folder, file } = ref;
      const storage = firebase.storage().ref();
      let storageRefID = uuid();

      return new Promise((resolve, reject) => {
        if (content) {
          let storageTask = storage
            .child(`${folder}/${file ? file : storageRefID}`)
            .putString(content, "data_url");

          storageTask.on(
            "state_changed",
            snapshot => {},
            error => {
              reject(error);
            },
            () => {
              storageTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                resolve({ url: downloadURL, ref: storageRefID });
              });
            }
          );
        } else {
          reject("Error no content found");
        }
      });
    }
  }
};
