import { useState, useEffect } from "react";
import { XAUUSDCard } from "./components/charts/XAUUSDCard";
import { AlertModal } from "../components/alerts/AlertModal";
import { useAuth } from "../context/AuthContext";
import { useMarketData } from "../context/MarketDataContext";
import { LivePriceCard } from "../components/market/LivePriceCard";
import { register } from "../services/authService";
import { playAlarm, stopAlarm } from "../utils/alarmManager";
import { TradingChart } from "../components/charts/TradingChart";
import { CreateAlertForm } from "../components/alerts/CreateAlertForm";
import { AlertTable, type AlertRow } from "../components/alerts/AlertTable";
import { AiTradeAssistant } from "../features/ai/AiTradeAssistant";
import {
  LayoutDashboard, TrendingUp, Bell, BellRing, User, Settings,
  LogOut, Search, X, ChevronUp, ChevronDown, Plus, Edit2,
  Trash2, Pause, Play, Download, Filter, CheckCheck, AlertTriangle,
  Eye, EyeOff, Mail, Phone, Globe, Shield, Volume2, Send,
  BarChart2, Activity, Zap, Clock, ArrowUpRight, ArrowDownRight,
  RefreshCw, ChevronRight, Check, Info, Lock, Wifi, WifiOff,
  Target
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "login" | "register" | "forgot" | "dashboard" | "market" | "alerts" | "triggered" | "notifications" | "profile" | "settings" | "charts";

interface User {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  avatar: string;
}

interface ForexPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  trend: "up" | "down";
}

interface Alert {
  id: string;
  pair: string;
  targetPrice: number;
  condition: "above" | "below" | "touch";
  notifyMethod: "sound" | "email" | "telegram";
  status: "active" | "paused" | "triggered";
  createdAt: string;
}

interface TriggeredAlert {
  id: string;
  pair: string;
  targetPrice: number;
  triggeredPrice: number;
  condition: string;
  triggeredAt: string;
  status: "success" | "missed";
}

interface Notification {
  id: string;
  type: "alert" | "triggered" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ALERTS: Alert[] = [];
const INITIAL_NOTIFICATIONS: Notification[] = [];

const MOCK_USER: User = {
  name: "Marcus Chen",
  email: "marcus.chen@traderalert.io",
  phone: "+1 (415) 555-0192",
  timezone: "America/New_York",
  avatar: "MC",
};



// ─── Utility Components ───────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(price: number, decimals = 5) {
  return price.toFixed(decimals);
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "danger" | "warning" | "muted" }) {
  const styles = {
    default: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    danger: "bg-red-500/15 text-red-400 border-red-500/20",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    muted: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border", styles[variant])}>
      {children}
    </span>
  );
}

function StatCard({ icon, label, value, sub, trend, color = "blue" }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; trend?: "up" | "down"; color?: "blue" | "green" | "red" | "amber";
}) {
  const colors = {
    blue: "from-blue-600/20 to-blue-500/5 border-blue-500/20",
    green: "from-emerald-600/20 to-emerald-500/5 border-emerald-500/20",
    red: "from-red-600/20 to-red-500/5 border-red-500/20",
    amber: "from-amber-600/20 to-amber-500/5 border-amber-500/20",
  };
  const iconColors = {
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-emerald-400 bg-emerald-500/10",
    red: "text-red-400 bg-red-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };
  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20", colors[color])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white font-mono">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconColors[color])}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={cn("flex items-center gap-1 mt-3 text-xs font-medium", trend === "up" ? "text-emerald-400" : "text-red-400")}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend === "up" ? "+12.5% this week" : "-3.2% this week"}</span>
        </div>
      )}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-slate-700/50 rounded", className)} />;
}

function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error" | "warning"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = { success: "bg-emerald-500", error: "bg-red-500", warning: "bg-amber-500" };
  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl transition-all", styles[type])}>
      <Check className="w-4 h-4" />
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────

function LoginPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await login(email, password);
      onNavigate("dashboard");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0d1a3a] to-[#0B1120] items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 20%, #10B981 0%, transparent 40%)" }} />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>TradeAlert AI</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Never miss a price move again.
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Set precise forex alerts, get notified instantly, and trade with confidence — powered by real-time market data.
          </p>
          <div className="space-y-4">
            {[
              { icon: <Target className="w-4 h-4 text-blue-400" />, text: "Precision price alerts on 50+ forex pairs" },
              { icon: <Zap className="w-4 h-4 text-emerald-400" />, text: "Real-time WebSocket price feeds" },
              { icon: <Bell className="w-4 h-4 text-amber-400" />, text: "Multi-channel notifications — sound, email, Telegram" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>
          {/* Chart decoration */}
          <div className="mt-12 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-mono">EUR/USD</span>
              <Badge variant="success">LIVE</Badge>
            </div>
            <div className="text-2xl font-bold text-white font-mono mb-1">1.08432</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+0.00234 (0.22%)</span>
            </div>
            <svg viewBox="0 0 200 60" className="w-full mt-3" fill="none">
              <polyline points="0,45 20,42 40,38 60,40 80,32 100,28 120,30 140,22 160,18 180,15 200,12" stroke="#2563EB" strokeWidth="2" fill="none" />
              <polyline points="0,45 20,42 40,38 60,40 80,32 100,28 120,30 140,22 160,18 180,15 200,12 200,60 0,60" fill="url(#grad)" opacity="0.2" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>TradeAlert AI</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Welcome back</h2>
          <p className="text-slate-400 mb-8">Sign in to your trading dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="trader@example.com"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRemember(!remember)}
                  className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer", remember ? "bg-blue-600 border-blue-600" : "border-slate-600")}
                >
                  {remember && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
              <button type="button" onClick={() => onNavigate("forgot")} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Signing in...</> : "Sign In to Dashboard"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            {"Don't have an account? "}
            <button onClick={() => onNavigate("register")} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Create account
            </button>
          </p>

          <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-500 text-center">Demo credentials: any email + any password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("Marcus");
  const [lastName, setLastName] = useState("Chen");
  const [email, setEmail] = useState("marcus@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        setError("Please fill in all required fields.");
        return;
      }
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
      });
      setSuccess("Account created successfully. You can now sign in.");
      setTimeout(() => onNavigate("login"), 1000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>TradeAlert AI</span>
        </div>
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all", s <= step ? "bg-blue-500" : "bg-slate-700")} />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
          {step === 1 ? "Create your account" : "Trading preferences"}
        </h2>
        <p className="text-slate-400 mb-8">{step === 1 ? "Start trading smarter today" : "Set up your alert defaults"}</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}
          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Notification Method</label>
                <select className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                  <option>Sound</option>
                  <option>Email</option>
                  <option>Telegram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                <select className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Tokyo (JST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Telegram Chat ID (optional)</label>
                <input type="text" placeholder="@username or chat ID" className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Creating account...</> : step === 1 ? "Continue" : "Create Account"}
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <button onClick={() => onNavigate("login")} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</button>
        </p>
      </div>
    </div>
  );
}

function ForgotPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>TradeAlert AI</span>
        </div>
        {sent ? (
          <div>
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Check your inbox</h2>
            <p className="text-slate-400 mb-8">We sent a password reset link to your email address.</p>
            <button onClick={() => onNavigate("login")} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              ← Back to login
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Reset password</h2>
            <p className="text-slate-400 mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input type="email" placeholder="trader@example.com" className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Sending...</> : "Send Reset Link"}
              </button>
            </form>
            <button onClick={() => onNavigate("login")} className="text-slate-400 hover:text-white mt-6 block mx-auto transition-colors text-sm">
              ← Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "market", label: "Market Watch", icon: TrendingUp },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "triggered", label: "Triggered Alerts", icon: BellRing },
  { id: "notifications", label: "Notifications", icon: Activity },
  { id: "charts", label: "Charts", icon: BarChart2 },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function Sidebar({ current, onNavigate, collapsed, onToggle, notifCount }: {
  current: Page; onNavigate: (p: Page) => void; collapsed: boolean; onToggle: () => void; notifCount: number;
}) {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-[#0d1526] border-r border-slate-800/60 flex flex-col transition-all duration-300 z-40",
      collapsed ? "w-[64px]" : "w-[220px]"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="font-bold text-white text-base" style={{ fontFamily: "Outfit, sans-serif" }}>TradeAlert AI</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <div className="relative flex-shrink-0">
                <Icon className="w-4 h-4" />
                {item.id === "notifications" && notifCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                    {notifCount}
                  </div>
                )}
              </div>
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-800/60">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><X className="w-4 h-4" />{!collapsed && <span>Collapse</span>}</>}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ onNavigate, user, notifCount, sidebarCollapsed }: {
  onNavigate: (p: Page) => void; user: User; notifCount: number; sidebarCollapsed: boolean;
}) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConnected] = useState(true);
  const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <header className={cn(
      "fixed top-0 right-0 h-14 bg-[#0d1526]/90 backdrop-blur border-b border-slate-800/60 flex items-center justify-between px-5 z-30 transition-all",
      sidebarCollapsed ? "left-[64px]" : "left-[220px]"
    )}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pairs, alerts..."
            className="bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-48 transition-all focus:w-64"
          />
        </div>
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium", isConnected ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10")}>
          {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isConnected ? "LIVE" : "OFFLINE"}
        </div>
        <span className="text-xs text-slate-500 font-mono">{time} EST</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("notifications")}
          className="relative w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <Bell className="w-4 h-4" />
          {notifCount > 0 && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/60 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
              {user.avatar}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Trader Pro</p>
            </div>
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a2235] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-50">
              {[
                { label: "Profile", icon: User, page: "profile" as Page },
                { label: "Settings", icon: Settings, page: "settings" as Page },
              ].map(item => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/40 hover:text-white transition-all"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-slate-700/40" />
              <button
                onClick={() => onNavigate("login")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardOverview({ onNavigate, alerts, notifications }: { onNavigate: (p: Page) => void; alerts: Alert[]; notifications: Notification[] }) {
  const { marketData } = useMarketData();
  const prices = Object.values(marketData);
  const loading = prices.length === 0;

  const activeAlerts = alerts.filter((a) => a.status === "active").length;
  const triggeredCount = alerts.filter((a) => a.status === "triggered").length;
  const pairCount = prices.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <StatCard icon={<Bell className="w-5 h-5" />} label="Active Alerts" value={String(activeAlerts)} sub="Monitoring now" trend="up" color="blue" />
            <StatCard icon={<BellRing className="w-5 h-5" />} label="Triggered Today" value={String(triggeredCount)} sub="Last 24h" color="green" />
            <StatCard icon={<Activity className="w-5 h-5" />} label="Market Status" value="OPEN" sub="London + NY sessions" color="amber" />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Pairs Tracked" value={String(pairCount)} sub="Live market pairs" trend="up" color="blue" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Live prices */}
        <div className="xl:col-span-2 bg-[#111827] border border-slate-800/60 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white text-sm">Live Forex Prices</span>
            </div>
            <button onClick={() => onNavigate("market")} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-800/40">
            {loading
              ? Array(4).fill(0).map((_, i) => <div key={i} className="px-5 py-4"><Skeleton className="h-10" /></div>)
              : prices.slice(0, 5).map((snapshot) => (
                <div key={snapshot.pair} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold", snapshot.percentageChange >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>
                      {snapshot.pair.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{snapshot.pair}</p>
                      <p className="text-xs text-slate-400">Vol: Live</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-white text-sm">{snapshot.price.toFixed(snapshot.pair === "XAUUSD" || snapshot.pair === "BTCUSD" ? 2 : 5)}</p>
                    <p className={cn("text-xs flex items-center justify-end gap-0.5 font-mono", snapshot.percentageChange >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {snapshot.percentageChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {snapshot.percentageChange >= 0 ? "+" : ""}{snapshot.percentageChange.toFixed(2)}%
                    </p>
                  </div>
                  <button onClick={() => onNavigate("alerts")} className="opacity-0 group-hover:opacity-100 ml-4 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-xs hover:bg-blue-600/30 transition-all">
                    + Alert
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
            <span className="font-semibold text-white text-sm">Recent Activity</span>
            <button onClick={() => onNavigate("notifications")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-800/40 overflow-y-auto max-h-72">
            {notifications.slice(0, 5).map(n => (
              <div key={n.id} className={cn("px-5 py-3.5 hover:bg-slate-800/20 transition-colors", !n.read && "border-l-2 border-blue-500")}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0",
                    n.type === "triggered" ? "bg-emerald-500/15 text-emerald-400" :
                    n.type === "alert" ? "bg-blue-500/15 text-blue-400" :
                    "bg-slate-500/15 text-slate-400"
                  )}>
                    {n.type === "triggered" ? <BellRing className="w-3.5 h-3.5" /> : n.type === "alert" ? <Bell className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{n.message}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert stats mini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Alert Performance</h3>
          <div className="space-y-3">
            {[
              { label: "Success Rate", value: 87, color: "bg-emerald-500" },
              { label: "Accuracy (1hr)", value: 73, color: "bg-blue-500" },
              { label: "Response Time", value: 95, color: "bg-amber-500" },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{m.label}</span>
                  <span className="text-xs font-mono font-semibold text-white">{m.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", m.color)} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Active Alerts by Pair</h3>
          <div className="space-y-2.5">
            {["EUR/USD", "GBP/USD", "USD/JPY"].map((pair, i) => {
              const count = [2, 1, 1][i];
              return (
                <div key={pair} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300 w-16">{pair}</span>
                  <div className="flex-1 h-5 bg-slate-800 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-600/60 rounded-md flex items-center px-2" style={{ width: `${(count / 3) * 100}%` }}>
                      <span className="text-[10px] text-white font-mono">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Market Watch ─────────────────────────────────────────────────────────────

function MarketWatch({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { marketData, selectedPair, setSelectedPair } = useMarketData();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"pair" | "price" | "change">("pair");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<"all" | "up" | "down">("all");

  const liveRows = Object.values(marketData).map((snapshot) => ({
    pair: snapshot.pair,
    price: snapshot.price,
    changePercent: snapshot.percentageChange,
    high: snapshot.price * 1.001,
    low: snapshot.price * 0.999,
    volume: "Live",
    trend: snapshot.percentageChange >= 0 ? "up" : "down",
  }));

  const sorted = [...liveRows]
    .filter((p) => p.pair.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (filter === "all" ? true : p.trend === filter))
    .sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortBy === "pair") return mult * a.pair.localeCompare(b.pair);
      if (sortBy === "price") return mult * (a.price - b.price);
      return mult * (a.changePercent - b.changePercent);
    });

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Market Watch</h2>
          <p className="text-sm text-slate-400">Real-time forex pair prices</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Object.values(marketData)
          .slice(0, 4)
          .map((snapshot) => (
            <LivePriceCard
              key={snapshot.pair}
              snapshot={snapshot}
              isSelected={selectedPair === snapshot.pair}
              onClick={() => setSelectedPair(snapshot.pair)}
            />
          ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pairs..." className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-slate-700/50">
          {(["all", "up", "down"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-2 text-xs font-medium transition-all capitalize", filter === f ? "bg-blue-600 text-white" : "bg-slate-800/60 text-slate-400 hover:text-white")}>
              {f === "all" ? "All" : f === "up" ? "↑ Gainers" : "↓ Losers"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 px-5 py-3 border-b border-slate-800/60 text-xs font-medium text-slate-400 uppercase tracking-wider">
          {[["Pair", "pair"], ["Price", "price"], ["Change", "change"], ["High", null], ["Low", null], ["Volume", null], ["Action", null]].map(([label, col]) => (
            <button
              key={label}
              onClick={col ? () => toggleSort(col as typeof sortBy) : undefined}
              className={cn("text-left flex items-center gap-1 transition-colors", col ? "hover:text-white cursor-pointer" : "cursor-default")}
            >
              {label}
              {col && sortBy === col && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
          ))}
        </div>
        <div className="divide-y divide-slate-800/30">
          {sorted.map(p => (
            <div key={p.pair} className="grid grid-cols-7 px-5 py-4 hover:bg-slate-800/20 transition-colors items-center">
              <div className="flex items-center gap-2.5">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0", p.trend === "up" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>
                  {p.pair.slice(0, 2)}
                </div>
                <span className="font-semibold text-white text-sm">{p.pair}</span>
              </div>
              <span className="font-mono font-semibold text-white text-sm">{p.price.toFixed(5)}</span>
              <div className={cn("flex items-center gap-1 text-sm font-mono font-medium", p.trend === "up" ? "text-emerald-400" : "text-red-400")}>
                {p.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {p.changePercent > 0 ? "+" : ""}{p.changePercent.toFixed(2)}%
              </div>
              <span className="font-mono text-slate-300 text-sm">{p.high.toFixed(5)}</span>
              <span className="font-mono text-slate-300 text-sm">{p.low.toFixed(5)}</span>
              <span className="text-slate-400 text-sm">{p.volume}</span>
              <button onClick={() => onNavigate("alerts")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 text-xs font-medium transition-all w-fit">
                <Plus className="w-3 h-3" /> Alert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Alert Management ─────────────────────────────────────────────────────────

function AlertsPage({ alerts, setAlerts, onToast, onCreate }: {
  alerts: Alert[];
  setAlerts: (a: Alert[]) => void;
  onToast: (m: string, t?: "success" | "error") => void;
  onCreate?: (alert: Alert) => void;
}) {
  const { marketData } = useMarketData();
  const availablePairs = Object.values(marketData).map((snapshot) =>
    snapshot.pair === "XAUUSD" ? "XAUUSD" : snapshot.pair.replace(/USD$/, "/USD")
  );
  const [pair, setPair] = useState(availablePairs[0] ?? "EUR/USD");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below" | "touch">("above");
  const [method, setMethod] = useState<"sound" | "email" | "telegram">("sound");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const handleQuickAlert = (condition: "above" | "below" | "touch", alertPrice: number) => {
    setPair("XAUUSD");
    setPrice(String(alertPrice));
    setCondition(condition);
    setMethod("sound");
    setEditId(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    if (editId) {
      setAlerts(alerts.map(a => a.id === editId ? { ...a, pair, targetPrice: parseFloat(price), condition, notifyMethod: method } : a));
      setEditId(null);
      onToast("Alert updated successfully");
    } else {
      const newAlert: Alert = {
        id: Date.now().toString(),
        pair, targetPrice: parseFloat(price), condition, notifyMethod: method,
        status: "active", createdAt: new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setAlerts([newAlert, ...alerts]);
      onToast("Alert created successfully");
    }
    setPrice("");
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    setDeleteId(null);
    onToast("Alert deleted", "error");
  };

  const toggleStatus = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a));
    onToast("Alert status updated");
  };

  const startEdit = (alert: Alert) => {
    setEditId(alert.id);
    setPair(alert.pair);
    setPrice(String(alert.targetPrice));
    setCondition(alert.condition);
    setMethod(alert.notifyMethod);
  };

  const statusBadge = (status: Alert["status"]) => {
    const map = { active: "success", paused: "muted", triggered: "warning" } as const;
    return <Badge variant={map[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const alertRows: AlertRow[] = alerts.map((alert) => ({
    id: alert.id,
    pair: alert.pair,
    targetPrice: alert.targetPrice,
    currentPrice: marketData[alert.pair.replace(/\//g, "")] ? marketData[alert.pair.replace(/\//g, "")].price : alert.targetPrice,
    condition: alert.condition.toUpperCase() as "ABOVE" | "BELOW" | "TOUCH",
    status: alert.status.toUpperCase() as "ACTIVE" | "TRIGGERED" | "PAUSED",
    createdAt: alert.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Alert Management</h2>
        <p className="text-sm text-slate-400">Create and manage price alerts</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">Alert Builder</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Create a precise price alert</h3>
                <p className="mt-1 text-sm text-slate-400">Monitor your favorite pairs and get notified the moment your target is reached.</p>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Live
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Quick setup</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
                    <span>Choose a symbol</span>
                    <span className="font-mono text-white">{pair}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
                    <span>Price target</span>
                    <span className="font-mono text-white">{price || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
                    <span>Condition</span>
                    <span className="font-mono capitalize text-white">{condition}</span>
                  </div>
                </div>
              </div>
              <XAUUSDCard onQuickAlert={handleQuickAlert} />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">Create or update an alert</h3>
                <p className="text-sm text-slate-400">A single form handles both creating and editing alerts.</p>
              </div>
              <div className="rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300">
                {editId ? "Editing" : "Ready"}
              </div>
            </div>
            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Currency Pair</label>
                  <select value={pair} onChange={e => setPair(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                    {availablePairs.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Target Price</label>
                  <input type="number" step="0.00001" value={price} onChange={e => setPrice(e.target.value)} placeholder="1.08500" className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Condition</label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-700/60">
                    {(["above", "below", "touch"] as const).map(c => (
                      <button key={c} type="button" onClick={() => setCondition(c)} className={cn("flex-1 py-2.5 text-xs font-medium capitalize transition-all", condition === c ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Notify Via</label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-700/60">
                    {([['sound', Volume2], ['email', Mail], ['telegram', Send]] as const).map(([m, Icon]) => (
                      <button key={m} type="button" onClick={() => setMethod(m)} className={cn("flex-1 py-2.5 flex items-center justify-center transition-all", method === m ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
                  {editId ? <><Edit2 className="w-4 h-4" />Update Alert</> : <><Plus className="w-4 h-4" />Create Alert</>}
                </button>
                <button type="button" onClick={() => { setPrice(""); setPair(availablePairs[0] ?? "EUR/USD"); setCondition("above"); setMethod("sound"); setEditId(null); }} className="px-5 py-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-all">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Overview</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Alert health</h3>
              </div>
              <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                {alerts.filter((alert) => alert.status === "active").length} active
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/70 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Managed alerts</p>
                <p className="mt-1 text-2xl font-semibold text-white">{alerts.length}</p>
              </div>
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/70 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Triggered</p>
                <p className="mt-1 text-2xl font-semibold text-white">{alerts.filter((alert) => alert.status === "triggered").length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Bell className="h-4 w-4 text-blue-400" />
              Tips
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Use touch alerts when you want a precise price hit.</li>
              <li>• Keep the price target clear before saving.</li>
              <li>• Use snooze or dismiss after an alert is triggered.</li>
            </ul>
          </div>
        </div>
      </div>

      <AlertTable
        alerts={alertRows}
        onPause={(id) => {
          setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a)));
          onToast("Alert status updated");
        }}
        onResume={(id) => {
          setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: "active" } : a)));
          onToast("Alert resumed");
        }}
        onDelete={(id) => {
          setAlerts(alerts.filter((a) => a.id !== id));
          onToast("Alert deleted", "error");
        }}
      />

      {/* Form */}
      {false && (
      <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-blue-400" />
          </div>
          {editId ? "Edit Alert" : "Create New Alert"}
        </h3>
        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Currency Pair</label>
              <select value={pair} onChange={e => setPair(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                {availablePairs.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Target Price</label>
              <input type="number" step="0.00001" value={price} onChange={e => setPrice(e.target.value)} placeholder="1.08500" className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Condition</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-700/60">
                {(["above", "below", "touch"] as const).map(c => (
                  <button key={c} type="button" onClick={() => setCondition(c)} className={cn("flex-1 py-2.5 text-xs font-medium capitalize transition-all", condition === c ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Notify Via</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-700/60">
                {([["sound", Volume2], ["email", Mail], ["telegram", Send]] as const).map(([m, Icon]) => (
                  <button key={m} type="button" onClick={() => setMethod(m)} className={cn("flex-1 py-2.5 flex items-center justify-center transition-all", method === m ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
              {editId ? <><Edit2 className="w-4 h-4" />Update Alert</> : <><Plus className="w-4 h-4" />Create Alert</>}
            </button>
            <button type="button" onClick={() => { setPrice(""); setPair("EUR/USD"); setCondition("above"); setMethod("sound"); setEditId(null); }} className="px-5 py-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-all">
              Reset
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Table */}
      <div className="bg-[#111827] border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <span className="font-semibold text-white text-sm">Active Alerts ({alerts.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/40">
                {["Pair", "Target Price", "Condition", "Notify", "Status", "Created", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {alerts.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-semibold text-white text-sm">{a.pair}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-white text-sm">{a.targetPrice.toFixed(5)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={a.condition === "above" ? "success" : a.condition === "below" ? "danger" : "warning"}>
                      {a.condition}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      {a.notifyMethod === "sound" && <Volume2 className="w-3.5 h-3.5" />}
                      {a.notifyMethod === "email" && <Mail className="w-3.5 h-3.5" />}
                      {a.notifyMethod === "telegram" && <Send className="w-3.5 h-3.5" />}
                      <span className="text-xs capitalize">{a.notifyMethod}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{statusBadge(a.status)}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">{a.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-500/15 text-slate-400 hover:text-blue-400 transition-all" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleStatus(a.id)} className="p-1.5 rounded-lg hover:bg-amber-500/15 text-slate-400 hover:text-amber-400 transition-all" title={a.status === "active" ? "Pause" : "Resume"}>
                        {a.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-all" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500 text-sm">No alerts yet. Create one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a2235] border border-slate-700/60 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Delete Alert?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Triggered Alerts ─────────────────────────────────────────────────────────

function TriggeredAlertsPage({ triggeredAlerts }: { triggeredAlerts: TriggeredAlert[] }) {
  const [filter, setFilter] = useState<"all" | "success" | "missed">("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const filtered = triggeredAlerts.filter((t) => (filter === "all" ? true : t.status === filter));
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCSV = () => {
    const rows = [["Pair", "Target Price", "Triggered Price", "Condition", "Triggered At", "Status"], ...filtered.map((t) => [t.pair, t.targetPrice, t.triggeredPrice, t.condition, t.triggeredAt, t.status])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triggered-alerts.csv";
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Triggered Alerts</h2>
          <p className="text-sm text-slate-400">History of all triggered price alerts</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="flex rounded-lg overflow-hidden border border-slate-700/50">
          {(["all", "success", "missed"] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={cn("px-4 py-2 text-xs font-medium capitalize transition-all", filter === f ? "bg-blue-600 text-white" : "bg-slate-800/60 text-slate-400 hover:text-white")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/40">
                {["Pair", "Target Price", "Triggered Price", "Condition", "Triggered At", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {paginated.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-4 font-mono font-semibold text-white text-sm">{t.pair}</td>
                  <td className="px-5 py-4 font-mono text-white text-sm">{t.targetPrice.toFixed(5)}</td>
                  <td className="px-5 py-4 font-mono text-white text-sm">{t.triggeredPrice.toFixed(5)}</td>
                  <td className="px-5 py-4"><Badge variant={t.condition === "above" ? "success" : t.condition === "below" ? "danger" : "warning"}>{t.condition}</Badge></td>
                  <td className="px-5 py-4 text-xs text-slate-400 font-mono">{t.triggeredAt}</td>
                  <td className="px-5 py-4">
                    <Badge variant={t.status === "success" ? "success" : "danger"}>
                      {t.status === "success" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-800/40 flex items-center justify-between">
          <span className="text-xs text-slate-400">{filtered.length} results</span>
          <div className="flex items-center gap-2">
            {Array.from({ length: total }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={cn("w-7 h-7 rounded-lg text-xs font-medium transition-all", p === page ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

function NotificationsPage({ notifications, setNotifications }: { notifications: Notification[]; setNotifications: (n: Notification[]) => void }) {
  const markAll = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markOne = (id: string) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteOne = (id: string) => setNotifications(notifications.filter(n => n.id !== id));
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Notification Center</h2>
          <p className="text-sm text-slate-400">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={cn(
            "flex items-start gap-4 p-4 rounded-xl border transition-all",
            !n.read ? "bg-[#111827] border-blue-500/20 border-l-2 border-l-blue-500" : "bg-[#111827] border-slate-800/40"
          )}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
              n.type === "triggered" ? "bg-emerald-500/15 text-emerald-400" :
              n.type === "alert" ? "bg-blue-500/15 text-blue-400" :
              "bg-slate-500/15 text-slate-400"
            )}>
              {n.type === "triggered" ? <BellRing className="w-5 h-5" /> : n.type === "alert" ? <Bell className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white text-sm">{n.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{n.message}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.read && (
                    <button onClick={() => markOne(n.id)} className="p-1.5 rounded-lg hover:bg-blue-500/15 text-slate-400 hover:text-blue-400 transition-all" title="Mark read">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => deleteOne(n.id)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-all" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{n.time}
                </span>
                <Badge variant={n.type === "triggered" ? "success" : n.type === "alert" ? "default" : "muted"}>{n.type}</Badge>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function ChartsPage() {
  const { marketData } = useMarketData();
  const availablePrices = Object.values(marketData).map((snapshot) => ({
    pair: snapshot.pair === "XAUUSD" ? "XAUUSD" : snapshot.pair.replace(/USD$/, "/USD"),
    price: snapshot.price,
    change: snapshot.change,
    changePercent: snapshot.percentageChange,
    high: snapshot.price * 1.001,
    low: snapshot.price * 0.999,
    volume: "Live",
    trend: snapshot.percentageChange >= 0 ? "up" : "down",
  }));

  const [selectedPair, setSelectedPair] = useState(availablePrices[0]?.pair ?? "EUR/USD");
  const [timeframe, setTimeframe] = useState("1H");
  const [chartType, setChartType] = useState<"line" | "area">("area");
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (availablePrices.length && !availablePrices.some((p) => p.pair === selectedPair)) {
      setSelectedPair(availablePrices[0].pair);
    }
  }, [availablePrices, selectedPair]);

  useEffect(() => {
    setData([]);
  }, [selectedPair]);

  useEffect(() => {
    const symbol = selectedPair.replace(/\//g, "");
    const snapshot = marketData[symbol];
    if (!snapshot) return;

    setData((prev) => {
      const next = [...prev, { time: snapshot.lastUpdated, price: snapshot.price }];
      const maxLength = timeframe === "1H" ? 20 : timeframe === "4H" ? 40 : timeframe === "1D" ? 60 : timeframe === "1W" ? 100 : 120;
      return next.slice(-maxLength);
    });
  }, [marketData, selectedPair, timeframe]);

  const currentPair = availablePrices.find((p) => p.pair === selectedPair) || availablePrices[0] || {
    pair: "EUR/USD",
    price: 1.0,
    change: 0,
    changePercent: 0,
    high: 1,
    low: 1,
    volume: "Live",
    trend: "up",
  };

  const chartPoints = data.length > 0 ? data : [{ time: new Date().toISOString(), price: currentPair.price }];
  const chartDomain = useMemo(() => {
    const prices = chartPoints.map((p) => p.price);
    const min = Math.min(...prices) * 0.995;
    const max = Math.max(...prices) * 1.005;
    return [min, max];
  }, [chartPoints]);

  const displayHigh = Math.max(currentPair.high, ...chartPoints.map((p) => p.price));
  const displayLow = Math.min(currentPair.low, ...chartPoints.map((p) => p.price));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Price Charts</h2>
          <p className="text-sm text-slate-400">Professional trading chart view</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3 space-y-5">
          <TradingChart symbol={selectedPair.replace(/\//g, "")} />
          <AiTradeAssistant />
          <div className="bg-[#111827] border border-slate-800/60 rounded-xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)} className="bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none font-mono font-semibold">
                  {availablePrices.map((p) => (
                    <option key={p.pair} value={p.pair}>{p.pair}</option>
                  ))}
                </select>
                <div className={cn("text-lg font-bold font-mono", currentPair.trend === "up" ? "text-emerald-400" : "text-red-400")}>
                  {currentPair.price.toFixed(5)}
                </div>
                <div className={cn("flex items-center gap-1 text-sm", currentPair.trend === "up" ? "text-emerald-400" : "text-red-400")}>
                  {currentPair.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {currentPair.changePercent > 0 ? "+" : ""}{currentPair.changePercent.toFixed(2)}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg overflow-hidden border border-slate-700/50">
                  {(["area", "line"] as const).map((t) => (
                    <button key={t} onClick={() => setChartType(t)} className={cn("px-3 py-1.5 text-xs capitalize transition-all", chartType === t ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex rounded-lg overflow-hidden border border-slate-700/50">
                  {(["1H", "4H", "1D", "1W", "1M"] as const).map((tf) => (
                    <button key={tf} onClick={() => setTimeframe(tf)} className={cn("px-3 py-1.5 text-xs font-mono transition-all", timeframe === tf ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={chartPoints}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={chartDomain} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => Number(v).toFixed(4)} width={70} />
                    <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "8px", color: "#F1F5F9" }} labelStyle={{ color: "#94A3B8" }} />
                    <Area type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
                  </AreaChart>
                ) : (
                  <LineChart data={chartPoints}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={chartDomain} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => Number(v).toFixed(4)} width={70} />
                    <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "8px", color: "#F1F5F9" }} labelStyle={{ color: "#94A3B8" }} />
                    <Line type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Price Info</h3>
            <div className="space-y-3">
              {[
                { label: "Open", value: displayLow.toFixed(5) },
                { label: "High", value: displayHigh.toFixed(5) },
                { label: "Low", value: displayLow.toFixed(5) },
                { label: "Close", value: currentPair.price.toFixed(5) },
                { label: "Volume", value: currentPair.volume },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <span className="text-xs font-mono font-medium text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Quick Pairs</h3>
            <div className="space-y-2">
              {availablePrices.slice(0, 4).map((p) => (
                <button key={p.pair} onClick={() => setSelectedPair(p.pair)} className={cn("w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-left", selectedPair === p.pair ? "bg-blue-600/15 border border-blue-500/20" : "hover:bg-slate-800/60")}>
                  <span className="text-xs font-mono font-semibold text-white">{p.pair}</span>
                  <span className={cn("text-xs font-mono", p.trend === "up" ? "text-emerald-400" : "text-red-400")}>
                    {p.changePercent > 0 ? "+" : ""}{p.changePercent.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function ProfilePage({ user, onToast }: { user: User; onToast: (m: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [tz, setTz] = useState(user.timezone);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Profile</h2>
        <p className="text-sm text-slate-400">Manage your account details</p>
      </div>

      {/* Avatar */}
      <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-slate-400">{user.email}</p>
            <Badge variant="success" >Trader Pro</Badge>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Personal Details</h3>
          <button onClick={() => setEditing(!editing)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", editing ? "bg-slate-700 text-slate-300" : "bg-blue-600/15 text-blue-400 hover:bg-blue-600/25")}>
            {editing ? <><X className="w-4 h-4" />Cancel</> : <><Edit2 className="w-4 h-4" />Edit</>}
          </button>
        </div>
        <div className="space-y-4">
          {[
            { label: "Full Name", value: name, setter: setName, icon: <User className="w-4 h-4" /> },
            { label: "Email", value: user.email, setter: null as null, icon: <Mail className="w-4 h-4" /> },
            { label: "Phone", value: phone, setter: setPhone, icon: <Phone className="w-4 h-4" /> },
            { label: "Timezone", value: tz, setter: setTz, icon: <Globe className="w-4 h-4" /> },
          ].map(field => (
            <div key={field.label} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">{field.icon}</div>
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">{field.label}</label>
                {editing && field.setter ? (
                  <input value={field.value} onChange={e => field.setter!(e.target.value)} className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                ) : (
                  <p className="text-sm text-white">{field.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {editing && (
          <button onClick={() => { setEditing(false); onToast("Profile updated successfully"); }} className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all">
            <Check className="w-4 h-4" /> Save Changes
          </button>
        )}
      </div>

      {/* Change password */}
      <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" /> Change Password
        </h3>
        <div className="space-y-4">
          {["Current Password", "New Password", "Confirm Password"].map(label => (
            <div key={label}>
              <label className="block text-xs text-slate-400 mb-2">{label}</label>
              <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
            </div>
          ))}
          <button onClick={() => onToast("Password changed successfully")} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function SettingsPage({ onToast }: { onToast: (m: string) => void }) {
  const [notifications, setNotifications] = useState({ sound: true, email: true, telegram: false });
  const [security, setSecurity] = useState({ twofa: false, sessionTimeout: "30" });

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={cn("relative w-11 h-6 rounded-full transition-all duration-200 flex items-center", value ? "bg-blue-600" : "bg-slate-600")}>
      <div className={cn("w-4 h-4 bg-white rounded-full absolute transition-all duration-200 shadow", value ? "translate-x-6" : "translate-x-1")} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Settings</h2>
        <p className="text-sm text-slate-400">Configure your trading preferences</p>
      </div>

      {[
        {
          title: "Notifications", icon: <Bell className="w-4 h-4 text-blue-400" />,
          items: [
            { label: "Sound Alerts", sub: "Play audio when alert triggers", value: notifications.sound, toggle: () => setNotifications(n => ({ ...n, sound: !n.sound })) },
            { label: "Email Notifications", sub: "Receive alerts via email", value: notifications.email, toggle: () => setNotifications(n => ({ ...n, email: !n.email })) },
            { label: "Telegram Bot", sub: "Send to Telegram channel", value: notifications.telegram, toggle: () => setNotifications(n => ({ ...n, telegram: !n.telegram })) },
          ]
        },
        {
          title: "Security", icon: <Shield className="w-4 h-4 text-blue-400" />,
          items: [
            { label: "Two-Factor Authentication", sub: "Secure your account with 2FA", value: security.twofa, toggle: () => setSecurity(s => ({ ...s, twofa: !s.twofa })) },
          ]
        }
      ].map(section => (
        <div key={section.title} className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">{section.icon}{section.title}</h3>
          <div className="space-y-4">
            {section.items.map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                </div>
                <Toggle value={item.value} onChange={item.toggle} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" /> Display & Language
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2">Language</label>
            <select className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Arabic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">Session Timeout</label>
            <select value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))} className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
        <button onClick={() => onToast("Settings saved")} className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all">
          <Check className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Wrapper ────────────────────────────────────────────────────────

function Dashboard({ initialPage, onLogout }: { initialPage: Page; onLogout: () => void }) {
  const { marketData } = useMarketData();
  const [page, setPage] = useState<Page>(initialPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
  const [triggeredAlert, setTriggeredAlert] = useState<{ pair: string; price: number } | null>(null);
  const user = MOCK_USER;

  const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => setToast({ msg, type });
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const wsUrl = backendUrl.replace(/^http/, "ws") + "/ws/prices";
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string);
        if (payload.type !== "ALERT_TRIGGERED") return;

        setAlerts((prev) => prev.map((alert) =>
          alert.id === payload.alertId ? { ...alert, status: "triggered" } : alert
        ));
        setTriggeredAlert({ pair: payload.pair, price: payload.targetPrice });
        playAlarm();
      } catch {
        // Ignore malformed websocket payloads.
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const activeTriggered = alerts.find((alert) => alert.status === "triggered");
    if (activeTriggered) {
      setTriggeredAlert({ pair: activeTriggered.pair, price: activeTriggered.targetPrice });
      playAlarm();
    } else {
      setTriggeredAlert(null);
      stopAlarm();
    }
  }, [alerts]);

  useEffect(() => {
    if (!Object.keys(marketData).length) return;

    let changed = false;
    const newTriggered: Alert[] = [];

    const nextAlerts = alerts.map((alert) => {
      if (alert.status !== "active") return alert;

      const symbol = alert.pair.replace(/\//g, "");
      const snapshot = marketData[symbol];
      if (!snapshot) return alert;

      const price = snapshot.price;
      const target = alert.targetPrice;
      const pointSize = alert.pair.includes("XAU") || alert.pair.includes("GOLD") ? 1 : Math.max(0.0001, Math.abs(target) * 0.0001);
      const shouldTrigger =
        alert.condition === "above"
          ? price >= target + pointSize
          : alert.condition === "below"
            ? price <= target - pointSize
            : Math.abs(price - target) <= 0.000001;

      if (!shouldTrigger) return alert;
      changed = true;
      const triggeredAlert = { ...alert, status: "triggered" };
      newTriggered.push(triggeredAlert);
      return triggeredAlert;
    });

    if (!changed) return;

    setAlerts(nextAlerts);
    setNotifications((prev) => [
      ...newTriggered.map((alert) => ({
        id: `${alert.id}-${Date.now()}`,
        type: "triggered" as const,
        title: `Alert triggered: ${alert.pair}`,
        message: `${alert.pair} reached ${alert.targetPrice.toFixed(5)}`,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      })),
      ...prev,
    ]);
  }, [marketData, alerts]);

  const navigateTo = (p: Page) => {
    if (p === "login") { onLogout(); return; }
    setPage(p);
  };

  const triggeredAlerts = alerts
    .filter((alert) => alert.status === "triggered")
    .map((alert) => ({
      id: alert.id,
      pair: alert.pair,
      targetPrice: alert.targetPrice,
      triggeredPrice: alert.targetPrice,
      condition: alert.condition,
      triggeredAt: alert.createdAt,
      status: "success" as const,
    }));

  const contentMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardOverview onNavigate={navigateTo} alerts={alerts} notifications={notifications} />,
    market: <MarketWatch onNavigate={navigateTo} />,
    alerts: <AlertsPage alerts={alerts} setAlerts={setAlerts} onToast={showToast} onCreate={(alert) => setAlerts((prev) => [alert, ...prev])} />,
    triggered: <TriggeredAlertsPage triggeredAlerts={triggeredAlerts} />,
    notifications: <NotificationsPage notifications={notifications} setNotifications={setNotifications} />,
    charts: <ChartsPage />,
    profile: <ProfilePage user={user} onToast={showToast} />,
    settings: <SettingsPage onToast={showToast} />,
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar current={page} onNavigate={navigateTo} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} notifCount={unreadCount} />
      <Topbar onNavigate={navigateTo} user={user} notifCount={unreadCount} sidebarCollapsed={sidebarCollapsed} />
      <main className={cn("flex-1 pt-14 transition-all duration-300 min-h-screen", sidebarCollapsed ? "ml-[64px]" : "ml-[220px]")}>
        <div className="max-w-7xl mx-auto px-5 py-6">
          {contentMap[page] ?? contentMap.dashboard}
        </div>
      </main>
      {triggeredAlert && (
        <AlertModal
          pair={triggeredAlert.pair}
          price={triggeredAlert.price}
          onDismiss={() => {
            setTriggeredAlert(null);
            stopAlarm();
          }}
          onSnooze={() => {
            setTriggeredAlert(null);
            stopAlarm();
          }}
        />
      )}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { logout } = useAuth();
  const [page, setPage] = useState<Page>("login");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.setProperty("font-family", "Inter, sans-serif");
  }, []);

  if (page === "login") return <LoginPage onNavigate={setPage} />;
  if (page === "register") return <RegisterPage onNavigate={setPage} />;
  if (page === "forgot") return <ForgotPage onNavigate={setPage} />;
  return <Dashboard initialPage={page} onLogout={() => { logout(); setPage("login"); }} />;
}
