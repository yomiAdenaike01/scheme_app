import firebase from "firebase/app";

try {
  firebase.initializeApp({
    apiKey: "AIzaSyAVmzx5Xxx8Izf0Mm6MKsnpWb8HWP5C_90",
    authDomain: "schemestorage-5ed17.firebaseapp.com",
    databaseURL: "https://schemestorage-5ed17.firebaseio.com",
    projectId: "schemestorage-5ed17",
    storageBucket: "schemestorage-5ed17.appspot.com",
    messagingsender: "307099241375",
    appId: "1:307099241375:web:b9578dd71da6cddef8cbaa"
  });
} catch (error) {
  console.warn(error);
}
