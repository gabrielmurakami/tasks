import firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD_-AlRCpMR7MWIhGVxztUFs3O7o69vYlc",
  authDomain: "tarefas-51ff3.firebaseapp.com",
  projectId: "tarefas-51ff3",
  storageBucket: "tarefas-51ff3.appspot.com",
  messagingSenderId: "720275911414",
  appId: "1:720275911414:web:f3b83674f602088c1d32d7",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
