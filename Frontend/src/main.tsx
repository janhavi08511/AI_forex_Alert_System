import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { MarketDataProvider } from "./context/MarketDataContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <MarketDataProvider>
      <App />
    </MarketDataProvider>
  </AuthProvider>
);
