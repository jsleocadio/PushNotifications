importScripts("https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
    projectId: 'mensagens-9706f',
    appId: '1:221520484531:web:ce54f890d099e054df78c6',
    storageBucket: 'mensagens-9706f.appspot.com',
    apiKey: 'AIzaSyDOaMwWfqWe3E0ATEkWZp7-D_-BZAJ6kGo',
    authDomain: 'mensagens-9706f.firebaseapp.com',
    messagingSenderId: '221520484531',
    measurementId: 'G-D9VTDZEBCS',
});
const messaging = firebase.messaging();