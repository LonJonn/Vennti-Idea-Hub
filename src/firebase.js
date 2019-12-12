"use strict";
exports.__esModule = true;
var app_1 = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyBtZ55AyvZ6Sqf27_I6HLlrUATonK61_go",
    authDomain: "venntifact-idea-hub.firebaseapp.com",
    databaseURL: "https://venntifact-idea-hub.firebaseio.com",
    projectId: "venntifact-idea-hub",
    storageBucket: "",
    messagingSenderId: "487323150202",
    appId: "1:487323150202:web:7c1d176e52ae7b364318c3"
};
var fbApp = app_1["default"].initializeApp(firebaseConfig);
exports.authProviders = {
    google: new app_1["default"].auth.GoogleAuthProvider()
};
exports.auth = fbApp.auth();
exports.db = fbApp.firestore();
