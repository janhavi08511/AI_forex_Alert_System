import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getFCMToken,
  initializeMessaging,
  listenForegroundNotifications,
  requestNotificationPermission,
} from "../firebase/firebaseMessaging";
import { registerDevice } from "../services/deviceService";

export type NotificationTone = "alert" | "triggered" | "system";
export type NotificationTrend = "up" | "down" | "neutral";

export interface AppNotification {
  id: string;
  type: NotificationTone;
  title: string;
  body: string;
  pair?: string;
  price?: number;
  signal?: string;
  confidence?: number;
  trend?: NotificationTrend;
  entry?: number;
  stopLoss?: number;
  target?: number;
  risk?: number;
  alertId?: string;
  createdAt: string;
  read: boolean;
  opened: boolean;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  latestNotification: AppNotification | null;
  unreadCount: number;
  isFCMReady: boolean;
  isFCMEnabled: boolean;
  addNotification: (payload: Partial<AppNotification> & { title: string; body: string }) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  dismissLatestNotification: () => void;
  requestPermissionAndToken: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [latestNotification, setLatestNotification] = useState<AppNotification | null>(null);
  const [isFCMReady, setIsFCMReady] = useState(false);
  const [isFCMEnabled, setIsFCMEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tradealert-notifications");
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AppNotification[];
      if (Array.isArray(parsed)) {
        setNotifications(parsed);
      }
    } catch {
      localStorage.removeItem("tradealert-notifications");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tradealert-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((payload: Partial<AppNotification> & { title: string; body: string }) => {
    const notification: AppNotification = {
      id: payload.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: payload.type ?? "alert",
      title: payload.title,
      body: payload.body,
      pair: payload.pair,
      price: payload.price,
      signal: payload.signal,
      confidence: payload.confidence,
      trend: payload.trend ?? "neutral",
      entry: payload.entry,
      stopLoss: payload.stopLoss,
      target: payload.target,
      risk: payload.risk,
      alertId: payload.alertId,
      createdAt: payload.createdAt ?? new Date().toISOString(),
      read: payload.read ?? false,
      opened: payload.opened ?? false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 25));
    setLatestNotification(notification);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    setLatestNotification((prev) => (prev?.id === id ? null : prev));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLatestNotification(null);
  }, []);

  const dismissLatestNotification = useCallback(() => {
    setLatestNotification(null);
  }, []);

  const requestPermissionAndToken = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const permission = await requestNotificationPermission();
      if (permission === "denied" || permission === "unsupported") {
        setIsFCMReady(false);
        setIsFCMEnabled(false);
        return;
      }

      await initializeMessaging();
      const token = await getFCMToken();
      if (token) {
        localStorage.setItem("fcmToken", token);
        await registerDevice({ token, platform: "WEB" });
        setIsFCMEnabled(true);
        setIsFCMReady(true);
      }
    } catch (error) {
      console.warn("FCM registration failed", error);
      setIsFCMEnabled(false);
      setIsFCMReady(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let unsubscribe: (() => void) = () => undefined;
    const setup = async () => {
      try {
        await requestPermissionAndToken();
        unsubscribe = listenForegroundNotifications((payload) => {
          const title = payload.notification?.title ?? payload.data?.title ?? "TradeAlert AI";
          const body = payload.notification?.body ?? payload.data?.body ?? "You have a new trading notification.";
          const pair = (payload.data?.pair as string | undefined) ?? undefined;
          const alertId = (payload.data?.alertId as string | undefined) ?? undefined;
          const price = payload.data?.price ? Number(payload.data.price) : undefined;
          const confidence = payload.data?.confidence ? Number(payload.data.confidence) : undefined;
          const entry = payload.data?.entry ? Number(payload.data.entry) : undefined;
          const stopLoss = payload.data?.stopLoss ? Number(payload.data.stopLoss) : undefined;
          const target = payload.data?.target ? Number(payload.data.target) : undefined;
          const risk = payload.data?.risk ? Number(payload.data.risk) : undefined;

          addNotification({
            title,
            body,
            pair,
            alertId,
            price,
            confidence,
            signal: payload.data?.signal as string | undefined,
            trend: (payload.data?.trend as NotificationTrend | undefined) ?? "neutral",
            entry,
            stopLoss,
            target,
            risk,
            type: (payload.data?.type as NotificationTone | undefined) ?? "alert",
          });
        });
      } catch (error) {
        console.warn("Unable to initialize foreground messaging", error);
      }
    };

    setup();

    return () => unsubscribe();
  }, [addNotification, isAuthenticated, requestPermissionAndToken]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      latestNotification,
      unreadCount,
      isFCMReady,
      isFCMEnabled,
      addNotification,
      markAsRead,
      removeNotification,
      clearNotifications,
      dismissLatestNotification,
      requestPermissionAndToken,
    }),
    [addNotification, clearNotifications, dismissLatestNotification, isFCMEnabled, isFCMReady, latestNotification, markAsRead, notifications, removeNotification, requestPermissionAndToken, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
