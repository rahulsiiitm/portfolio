"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Clock3,
  Database,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

type SessionRow = {
  session_id: string;
  visitor_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
  last_active_at: string;
  message_count: number;
};

type MessageRow = {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  provider: string | null;
  model: string | null;
  latency_ms: number | null;
  status: string;
  created_at: string;
};

type EventRow = {
  id: string;
  session_id: string | null;
  event_type: string;
  provider: string | null;
  model: string | null;
  latency_ms: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

type LeadRow = {
  id: string;
  session_id: string | null;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

type ControlData = {
  admin: { email: string };
  metrics: {
    sessions: number;
    activeToday: number;
    messagesToday: number;
    avgResponseMs: number | null;
    failures: number;
    leads: number;
    providerUsage: Record<string, number>;
  };
  sessions: SessionRow[];
  messages: MessageRow[];
  events: EventRow[];
  leads: LeadRow[];
  selectedSession: string | null;
};

const fmt = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function shortId(value: string) {
  return value.length > 14 ? `${value.slice(0, 7)}…${value.slice(-5)}` : value;
}

export default function ControlRoom() {
  const [data, setData] = useState<ControlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const loadData = useCallback(async (session?: string | null) => {
    setLoading(true);
    setError("");
    try {
      const query = session ? `?session=${encodeURIComponent(session)}` : "";
      const response = await fetch(`/zero-control/api/data${query}`, { cache: "no-store" });
      if (response.status === 401) {
        setData(null);
        setAuthRequired(true);
        return;
      }
      if (!response.ok) throw new Error("Failed to load Control Room data.");
      const payload = (await response.json()) as ControlData;
      setData(payload);
      setAuthRequired(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setSigningIn(true);
    setError("");
    try {
      const response = await fetch("/zero-control/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Access denied.");
      setPassword("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Access denied.");
    } finally {
      setSigningIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/zero-control/api/logout", { method: "POST" });
    setData(null);
    setSelectedSession(null);
    setAuthRequired(true);
  }

  async function selectSession(sessionId: string) {
    setSelectedSession(sessionId);
    await loadData(sessionId);
  }

  const providerEntries = useMemo(
    () => Object.entries(data?.metrics.providerUsage ?? {}).sort((a, b) => b[1] - a[1]),
    [data],
  );

  if (authRequired && !data) {
    return (
      <main className="min-h-screen bg-[#07090d] text-zinc-100 flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#0d1016] p-7 shadow-[0_0_60px_rgba(220,38,38,0.08)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-center justify-center">
              <ShieldCheck className="text-red-500" size={21} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-red-500 font-bold">Restricted node</p>
              <h1 className="text-2xl font-semibold tracking-tight">ZERO Control</h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Admin email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-red-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-red-500/50"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              disabled={signingIn}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold hover:bg-red-500 disabled:opacity-50 transition-colors"
            >
              {signingIn ? "Authenticating…" : "Enter Control Room"}
            </button>
          </form>
          <p className="mt-6 text-[10px] leading-relaxed text-zinc-600">
            Access requires a Supabase account carrying the server-controlled <code>zero_admin</code> role.
          </p>
        </div>
      </main>
    );
  }

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-[#07090d] text-zinc-300 flex items-center justify-center">
        <RefreshCw className="animate-spin text-red-500" size={22} />
      </main>
    );
  }

  if (!data) return null;

  const cards = [
    { label: "Tracked sessions", value: data.metrics.sessions, icon: Users },
    { label: "Active today", value: data.metrics.activeToday, icon: Activity },
    { label: "Messages today", value: data.metrics.messagesToday, icon: MessageSquare },
    { label: "Avg response", value: data.metrics.avgResponseMs ? `${data.metrics.avgResponseMs} ms` : "—", icon: Clock3 },
    { label: "Failures", value: data.metrics.failures, icon: AlertTriangle },
    { label: "Leads", value: data.metrics.leads, icon: Mail },
  ];

  return (
    <main className="min-h-screen bg-[#07090d] text-zinc-100 px-4 py-5 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-center">
              <Database size={19} className="text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">ZERO Control</h1>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-500">Private observability console · {data.admin.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void loadData(selectedSession)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:border-white/20 flex items-center gap-2"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => void handleLogout()}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-red-400 hover:border-red-500/30 flex items-center gap-2"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </header>

        {error && <div className="my-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">{error}</div>}

        <section className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-3 xl:grid-cols-6">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-[#0c0f14] p-4">
              <div className="flex items-center justify-between text-zinc-600">
                <span className="text-[10px] uppercase tracking-wider">{label}</span>
                <Icon size={14} />
              </div>
              <div className="mt-3 text-xl font-semibold text-zinc-100">{value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_1.7fr_0.9fr]">
          <div className="rounded-2xl border border-white/8 bg-[#0c0f14] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">Recent sessions</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">Select one to inspect the transcript</p>
              </div>
              {selectedSession && (
                <button
                  onClick={() => { setSelectedSession(null); void loadData(); }}
                  className="text-[10px] text-red-400 hover:text-red-300"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="max-h-[650px] overflow-y-auto">
              {data.sessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => void selectSession(session.session_id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors ${selectedSession === session.session_id ? "bg-red-500/[0.07] border-l-2 border-l-red-500" : ""}`}
                >
                  <div className="flex justify-between gap-3">
                    <code className="text-[11px] text-zinc-300">{shortId(session.session_id)}</code>
                    <span className="text-[10px] text-zinc-600">{session.message_count} msg</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">{fmt(session.last_active_at)}</p>
                  {session.visitor_hash && <p className="text-[9px] text-zinc-700 mt-1 font-mono">visitor {session.visitor_hash.slice(0, 10)}</p>}
                </button>
              ))}
              {!data.sessions.length && <p className="p-5 text-xs text-zinc-600">No sessions recorded yet.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#0c0f14] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/8">
              <p className="text-xs font-semibold">{selectedSession ? `Conversation · ${shortId(selectedSession)}` : "Recent messages"}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Persistent telemetry, not Redis chat memory</p>
            </div>
            <div className="max-h-[650px] overflow-y-auto px-4 py-4 space-y-3">
              {[...data.messages].reverse().map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-3.5 py-3 ${message.role === "user" ? "bg-red-600/15 border border-red-500/20" : "bg-white/[0.04] border border-white/8"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {message.role === "assistant" ? <Bot size={11} className="text-red-500" /> : <Users size={11} className="text-zinc-500" />}
                      <span className="text-[9px] uppercase tracking-wider text-zinc-600">{message.role}</span>
                      {message.provider && <span className="text-[9px] text-zinc-700">· {message.provider}</span>}
                      {message.latency_ms != null && <span className="text-[9px] text-zinc-700">· {message.latency_ms}ms</span>}
                    </div>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-300">{message.content}</p>
                    <p className="text-[9px] text-zinc-700 mt-2">{fmt(message.created_at)}</p>
                  </div>
                </div>
              ))}
              {!data.messages.length && <p className="text-xs text-zinc-600">No messages in this view.</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-[#0c0f14] p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-red-500" />
                <p className="text-xs font-semibold">Provider usage</p>
              </div>
              <div className="space-y-3">
                {providerEntries.map(([provider, count]) => {
                  const total = providerEntries.reduce((sum, [, value]) => sum + value, 0) || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={provider}>
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-zinc-400">{provider}</span>
                        <span className="text-zinc-600">{count} · {pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-red-600" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {!providerEntries.length && <p className="text-[10px] text-zinc-600">No provider selections yet.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0c0f14] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-xs font-semibold">Event stream</p>
              </div>
              <div className="max-h-[310px] overflow-y-auto">
                {data.events.slice(0, 35).map((event) => (
                  <div key={event.id} className="px-4 py-2.5 border-b border-white/[0.05]">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono ${event.event_type.includes("failure") || event.event_type.includes("interrupted") ? "text-red-400" : "text-zinc-400"}`}>
                        {event.event_type}
                      </span>
                      {event.latency_ms != null && <span className="text-[9px] text-zinc-700">{event.latency_ms}ms</span>}
                    </div>
                    <p className="text-[9px] text-zinc-700 mt-1">{event.provider || "system"} · {fmt(event.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0c0f14] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <p className="text-xs font-semibold">Leads</p>
                <span className="text-[10px] text-zinc-600">{data.leads.length}</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto">
                {data.leads.map((lead) => (
                  <div key={lead.id} className="px-4 py-3 border-b border-white/[0.05]">
                    <p className="text-[10px] text-red-400 truncate">{lead.email}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{lead.message}</p>
                  </div>
                ))}
                {!data.leads.length && <p className="p-4 text-[10px] text-zinc-600">No leads captured yet.</p>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
