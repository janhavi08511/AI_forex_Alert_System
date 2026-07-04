import {
  getMessaging,
  getToken,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";
import { firebaseApp, hasFirebaseConfig } from "./firebase";

let messagingInstance: Messaging | null = null;

async function ensureServiceWorkerRegistration() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const existing = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
  if (existing) {
    return existing;
  }

  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

export async function initializeMessaging() {
  if (!hasFirebaseConfig || typeof window === "undefined") {
    return null;
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }

  await ensureServiceWorkerRegistration();
  return messagingInstance;
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  return Notification.requestPermission();
}

export async function getFCMToken() {
  const messaging = await initializeMessaging();
  if (!messaging || typeof window === "undefined") {
    return null;
  }

  try {
    const registration = await ensureServiceWorkerRegistration();
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY ?? "";

    return await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: registration ?? undefined,
    });
  } catch (error) {
    console.warn("Unable to acquire FCM token", error);
    return null;
  }
}

export function listenForegroundNotifications(
  onMessageReceived: (payload: MessagePayload) => void
) {
  const subscribe = async () => {
    const messaging = await initializeMessaging();
    if (!messaging) {
      return;
    }

    return onMessage(messaging, (payload) => {
      onMessageReceived(payload);
    });
  };

  let unsubscribePromise: Promise<(() => void) | undefined> | undefined;
  unsubscribePromise = subscribe();

  return () => {
    unsubscribePromise?.then((unsubscribe) => unsubscribe?.());
  };
}

export type { MessagePayload };
