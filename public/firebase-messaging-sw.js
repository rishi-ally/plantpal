

importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyCpTgK8vLLQC5ln1ZL_s2cCwP1KDuXGrR8",
  authDomain: "plantpal-5600a.firebaseapp.com",
  projectId:"plantpal-5600a",
  storageBucket: "plantpal-5600a.firebasestorage.app",
  messagingSenderId:"283937242103",
  appId: "1:283937242103:web:569ef6eab196f34c308cf2",
  measurementId:"G-K11YTRYQWT",
});

const messaging = firebase.messaging();

self.addEventListener('push', event => {
 

  if (event.data) {
    const payload = event.data.json();
    console.log('[SW] Push payload:', payload);

    const title = payload.notification?.title || 'No title';
    const options = {
      body: payload.notification?.body || 'No body',
     
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } else {
    console.log('[SW] Push event had no data.');
  }
});
