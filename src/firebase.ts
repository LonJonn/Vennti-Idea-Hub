import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBtZ55AyvZ6Sqf27_I6HLlrUATonK61_go",
	authDomain: "venntifact-idea-hub.firebaseapp.com",
	databaseURL: "https://venntifact-idea-hub.firebaseio.com",
	projectId: "venntifact-idea-hub",
	storageBucket: "",
	messagingSenderId: "487323150202",
	appId: "1:487323150202:web:7c1d176e52ae7b364318c3"
};

const fbApp = firebase.initializeApp(firebaseConfig);

export const authProviders = {
	google: new firebase.auth.GoogleAuthProvider()
};

export const auth = fbApp.auth();
export const db = fbApp.firestore();
