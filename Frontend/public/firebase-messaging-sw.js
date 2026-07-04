importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: self.location.origin.includes('localhost') ? '' : '',
  projectId: '',
  messagingSenderId: '',
  appId: '',
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
    tag: payload.data?.alertId || 'tradealert-notification',
    data: payload.data || {},
  });
});
