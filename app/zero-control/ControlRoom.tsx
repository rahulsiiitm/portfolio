"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Clock3,
  Gauge,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Signal,
  TimerReset,
  User,
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
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

function shortId(value: string) {
  return value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;
}

function Metric({ label, value, icon: Icon, accent = false }: { label: string; value: string | number; icon: typeof Activity; accent?: boolean }) {
  return (
    <div className="relative min-w-0 border-l border-white/10 px-4 py-3 first:border-l-0 sm:px-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-600">{label}</span>
        <Icon size={13} className={accent ? "text-red-500" : "text-zinc-700"} />
      </div>
      <div className={`font-mono text-xl font-bold tracking-tight ${accent ? "text-red-500" : "text-zinc-100"}`}>{value}</div>
    </div>
  );
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
      <main className="relative min-h-screen overflow-hidden bg-[#050608] text-white">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute left-0 top-0 h-1 w-full bg-red-600" />
        <div className="relative flex min-h-screen items-center justify-center px-5">
          <div className="w-full max-w-[430px] border border-white/10 bg-[#090b0f]/95 shadow-[0_25px_100px_rgba(0,0,0,.7)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-red-500">Restricted telemetry node</p>
                <h1 className="mt-1 text-2xl font-black tracking-[-0.04em]">ZERO / CONTROL</h1>
              </div>
              <ShieldCheck className="text-red-500" size={22} />
            </div>
            <form onSubmit={handleLogin} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">Admin ID</label>
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-red-500/60" />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">Passcode</label>
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-red-500/60" />
              </div>
              {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
              <button disabled={signingIn} className="group flex w-full items-center justify-between bg-red-600 px-4 py-3 text-sm font-bold uppercase tracking-wider transition hover:bg-red-500 disabled:opacity-50">
                {signingIn ? "Authenticating" : "Enter pit wall"}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (loading && !data) {
    return <main className="flex min-h-screen items-center justify-center bg-[#050608]"><RefreshCw className="animate-spin text-red-500" /></main>;
  }
  if (!data) return null;

  const selected = data.sessions.find((s) => s.session_id === selectedSession) ?? data.sessions[0] ?? null;
  const totalProvider = providerEntries.reduce((sum, [, count]) => sum + count, 0) || 1;

  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100 selection:bg-red-600 selection:text-white">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#050608]/95 backdrop-blur-xl">
        <div className="h-[3px] bg-gradient-to-r from-red-600 via-red-600 to-transparent" />
        <div className="mx-auto flex max-w-[1700px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative flex h-10 w-10 items-center justify-center border border-red-500/40 bg-red-500/10">
              <Gauge size={19} className="text-red-500" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-[#050608]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-black tracking-[-0.05em]">ZERO</h1>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">Control</span>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-zinc-600">Race engineering telemetry · {data.admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-zinc-500 md:flex">
              <Signal size={12} className="text-emerald-400" /> Live telemetry
            </div>
            <button onClick={() => void loadData(selectedSession)} className="flex items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-zinc-400 transition hover:border-white/20 hover:text-white">
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={() => void handleLogout()} className="flex items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-zinc-400 transition hover:border-red-500/40 hover:text-red-400">
              <LogOut size={12} /> Exit
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1700px] px-5 py-5 lg:px-8">
        {error && <div className="mb-4 border-l-2 border-red-500 bg-red-500/[0.06] px-4 py-3 font-mono text-[10px] text-red-300">{error}</div>}

        <section className="mb-5 grid grid-cols-2 overflow-hidden border border-white/10 bg-[#080a0e] md:grid-cols-3 xl:grid-cols-6">
          <Metric label="Sessions" value={data.metrics.sessions} icon={Users} />
          <Metric label="Active today" value={data.metrics.activeToday} icon={Activity} />
          <Metric label="Messages" value={data.metrics.messagesToday} icon={MessageSquare} />
          <Metric label="Avg response" value={data.metrics.avgResponseMs ? `${(data.metrics.avgResponseMs / 1000).toFixed(2)}s` : "—"} icon={Clock3} accent />
          <Metric label="Failures" value={data.metrics.failures} icon={AlertTriangle} accent={data.metrics.failures > 0} />
          <Metric label="Leads" value={data.metrics.leads} icon={Mail} />
        </section>

        <section className="grid min-h-[calc(100vh-210px)] gap-4 xl:grid-cols-[310px_minmax(0,1fr)_330px]">
          <aside className="border border-white/10 bg-[#080a0e]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Session queue</p>
                <p className="mt-0.5 text-xs text-zinc-600">Recent visitors</p>
              </div>
              <span className="font-mono text-xs text-zinc-500">{data.sessions.length.toString().padStart(2, "0")}</span>
            </div>
            <div className="max-h-[calc(100vh-270px)] overflow-y-auto">
              {data.sessions.map((session, index) => {
                const active = (selectedSession ?? data.sessions[0]?.session_id) === session.session_id;
                return (
                  <button key={session.session_id} onClick={() => void selectSession(session.session_id)} className={`group relative w-full border-b border-white/[0.06] px-4 py-4 text-left transition ${active ? "bg-red-500/[0.07]" : "hover:bg-white/[0.025]"}`}>
                    {active && <span className="absolute bottom-0 left-0 top-0 w-[2px] bg-red-500" />}
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-zinc-700">P{String(index + 1).padStart(2, "0")}</span>
                        <code className="text-[11px] text-zinc-300">{shortId(session.session_id)}</code>
                      </div>
                      <ChevronRight size={13} className={active ? "text-red-500" : "text-zinc-700 group-hover:text-zinc-500"} />
                    </div>
                    <div className="flex items-center justify-between font-mono text-[9px] text-zinc-600">
                      <span>{fmt(session.last_active_at)}</span>
                      <span>{session.message_count} MSG</span>
                    </div>
                    {session.visitor_hash && <p className="mt-2 truncate font-mono text-[8px] uppercase tracking-wider text-zinc-800">UID {session.visitor_hash.slice(0, 14)}</p>}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-w-0 flex-col border border-white/10 bg-[#080a0e]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-red-500" />
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Radio transcript</p>
                </div>
                <h2 className="mt-1 text-lg font-bold tracking-tight">{selected ? `Session ${shortId(selected.session_id)}` : "No active session"}</h2>
              </div>
              {selected && (
                <div className="flex gap-5 font-mono text-[9px] uppercase text-zinc-600">
                  <div><span className="block text-zinc-800">Messages</span><strong className="text-zinc-300">{selected.message_count}</strong></div>
                  <div><span className="block text-zinc-800">Last ping</span><strong className="text-zinc-300">{fmt(selected.last_active_at)}</strong></div>
                </div>
              )}
            </div>
            <div className="max-h-[calc(100vh-310px)] flex-1 space-y-4 overflow-y-auto p-5">
              {[...data.messages].reverse().map((message) => (
                <div key={message.id} className={`grid gap-3 ${message.role === "user" ? "grid-cols-[1fr_auto]" : "grid-cols-[auto_1fr]"}`}>
                  {message.role !== "user" && <div className="mt-1 flex h-7 w-7 items-center justify-center border border-red-500/20 bg-red-500/5"><Bot size={13} className="text-red-500" /></div>}
                  <div className={`min-w-0 ${message.role === "user" ? "max-w-[80%] justify-self-end" : "max-w-[88%]"}`}>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-wider text-zinc-700">
                      <span className={message.role === "user" ? "text-zinc-500" : "text-red-500"}>{message.role === "user" ? "Visitor" : "Zero"}</span>
                      {message.provider && <span>{message.provider}</span>}
                      {message.latency_ms != null && <span>{message.latency_ms}ms</span>}
                      <span>{fmt(message.created_at)}</span>
                    </div>
                    <div className={`border px-4 py-3 text-[13px] leading-6 ${message.role === "user" ? "border-red-500/20 bg-red-500/[0.07]" : "border-white/8 bg-[#0b0e13] text-zinc-300"}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  {message.role === "user" && <div className="mt-1 flex h-7 w-7 items-center justify-center border border-white/10"><User size={13} className="text-zinc-500" /></div>}
                </div>
              ))}
              {!data.messages.length && <div className="flex h-48 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-zinc-700">No radio traffic</div>}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="border border-white/10 bg-[#080a0e]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2"><Zap size={13} className="text-red-500" /><span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">Power unit</span></div>
                <span className="font-mono text-[8px] uppercase text-emerald-400">Nominal</span>
              </div>
              <div className="space-y-4 p-4">
                {providerEntries.map(([provider, count]) => {
                  const pct = Math.round((count / totalProvider) * 100);
                  return (
                    <div key={provider}>
                      <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase"><span className="text-zinc-400">{provider}</span><span className="text-zinc-600">{count} / {pct}%</span></div>
                      <div className="h-1 bg-white/[0.05]"><div className="h-full bg-red-500" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
                {!providerEntries.length && <p className="font-mono text-[9px] text-zinc-700">No provider telemetry.</p>}
              </div>
            </section>

            <section className="border border-white/10 bg-[#080a0e]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2"><TimerReset size={13} className="text-red-500" /><span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">Timing tower</span></div>
                <span className="font-mono text-[8px] text-zinc-700">LATEST</span>
              </div>
              <div className="max-h-[290px] overflow-y-auto">
                {data.events.slice(0, 8).map((event) => (
                  <div key={event.id} className="border-b border-white/[0.06] px-4 py-3 last:border-b-0">
                    <div className="flex items-center justify-between gap-3"><code className="text-[9px] text-zinc-400">{event.event_type}</code>{event.latency_ms != null && <span className="font-mono text-[9px] text-red-500">{event.latency_ms}ms</span>}</div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[8px] uppercase text-zinc-700"><span>{event.provider ?? "system"}</span><span>·</span><span>{fmt(event.created_at)}</span></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-white/10 bg-[#080a0e]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2"><Mail size={13} className="text-red-500" /><span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">Inbound leads</span></div>
                <span className="font-mono text-xs text-zinc-500">{data.leads.length}</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto">
                {data.leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="border-b border-white/[0.06] px-4 py-3 last:border-b-0">
                    <p className="truncate text-[11px] font-semibold text-zinc-300">{lead.email}</p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-600">{lead.message}</p>
                  </div>
                ))}
                {!data.leads.length && <p className="px-4 py-5 font-mono text-[9px] uppercase tracking-wider text-zinc-700">No inbound leads</p>}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
