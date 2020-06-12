import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init goes here
const config = {
    apiKey: "AIzaSyDeKJaYkaAS6r0zuslJ7ue2XAnyVcG0syU",
    authDomain: "next-task-ae81c.firebaseapp.com",
    databaseURL: "https://next-task-ae81c.firebaseio.com",
    projectId: "next-task-ae81c",
    storageBucket: "next-task-ae81c.appspot.com",
    messagingSenderId: "195010962209",
    appId: "1:195010962209:web:c35ff212b7f47456029460"
};
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const authObject = firebase.auth

// date issue fix according to firebase
const settings = {}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const feedbackCollection = db.collection('feedback')

export {
    db,
    auth,
    authObject,
    usersCollection,
    feedbackCollection
}