importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDxyqXcx-Uc9O-Pyp0OEQTDtkB9aXBgPls",
  authDomain: "adychat-18084.firebaseapp.com",
  projectId: "adychat-18084",
  messagingSenderId: "620921358718",
  appId: "1:620921358718:web:52aa1a4d489a7510218b2f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png"
  });
});
