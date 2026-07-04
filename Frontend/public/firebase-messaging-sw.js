importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAxoYfBZ9C5geBtAyqW629dpzNyglIePjw',
  authDomain: 'tradeai-12883.firebaseapp.com',
  projectId: 'tradeai-12883',
  storageBucket: 'tradeai-12883.appspot.com',
  messagingSenderId: '1012345678901',
  appId: '1:1012345678901:web:1234567890abcdef',
  measurementId: 'G-1234567890',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'TradeAlert AI';
  const body = payload.notification?.body || 'You have a new alert';

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: (payload.data && payload.data.alertId) || 'tradealert-notification',
    data: payload.data || {},
  });
});
