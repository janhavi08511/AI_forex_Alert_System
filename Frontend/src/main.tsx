import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { MarketDataProvider } from "./context/MarketDataContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <MarketDataProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </MarketDataProvider>
  </AuthProvider>
);
