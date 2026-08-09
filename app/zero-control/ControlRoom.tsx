"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Clock3,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
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

const RED = "#D62E37";

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

function SlashMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-3 w-12 ${className}`}
      style={{
        background: RED,
        clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)",
      }}
    />
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: typeof Activity;
  accent?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#101115] px-5 py-4 transition hover:border-white/[0.16]">
      <div
        className="absolute right-[-26px] top-[-26px] h-20 w-20 opacity-10 transition group-hover:opacity-20"
        style={{
          background: RED,
          transform: "rotate(18deg)",
          borderRadius: "18px",
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-[-0.04em] ${accent ? "text-[#D62E37]" : "text-white"}`}>
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/[0.08] bg-white/[0.03]">
          <Icon size={15} className={accent ? "text-[#D62E37]" : "text-zinc-500"} />
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ eyebrow, title, side }: { eyebrow: string; title: string; side?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4">
      <div className="flex items-center gap-3">
        <SlashMark className="w-7" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#D62E37]">{eyebrow}</p>
          <h2 className="mt-0.5 text-sm font-semibold text-zinc-100">{title}</h2>
        </div>
      </div>
      {side}
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-5 text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="absolute left-[8%] top-[12%] opacity-[0.08]"><SlashMark className="h-20 w-72" /></div>
        <div className="absolute bottom-[8%] right-[10%] opacity-[0.05]"><SlashMark className="h-28 w-96" /></div>

        <div className="relative w-full max-w-[460px] overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#101115]/95 p-2 shadow-[0_30px_120px_rgba(0,0,0,.6)]">
          <div className="rounded-[23px] border border-white/[0.06] bg-[#0b0c0f] p-7 sm:p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <SlashMark />
                  <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-zinc-500">Private access</span>
                </div>
                <h1 className="text-3xl font-semibold tracking-[-0.05em]">ZERO Control</h1>
                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">Private observability for the portfolio assistant.</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#D62E37]/30 bg-[#D62E37]/10">
                <ShieldCheck size={20} className="text-[#D62E37]" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Admin email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[16px] border border-white/[0.09] bg-white/[0.025] px-4 py-3.5 text-sm outline-none transition focus:border-[#D62E37]/60 focus:bg-white/[0.04]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[16px] border border-white/[0.09] bg-white/[0.025] px-4 py-3.5 text-sm outline-none transition focus:border-[#D62E37]/60 focus:bg-white/[0.04]"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                disabled={signingIn}
                className="group mt-2 flex w-full items-center justify-between rounded-[17px] bg-[#D62E37] px-4 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                <span>{signingIn ? "Authenticating…" : "Enter Control Room"}</span>
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (loading && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090b]">
        <RefreshCw className="animate-spin text-[#D62E37]" size={22} />
      </main>
    );
  }

  if (!data) return null;

  const selected = data.sessions.find((s) => s.session_id === selectedSession) ?? data.sessions[0] ?? null;
  const totalProvider = providerEntries.reduce((sum, [, count]) => sum + count, 0) || 1;

  return (
    <main className="min-h-screen bg-[#08090b] text-zinc-100 selection:bg-[#D62E37] selection:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-8%] top-[18%] opacity-[0.035]"><SlashMark className="h-48 w-[560px]" /></div>
        <div className="absolute bottom-[4%] left-[-10%] opacity-[0.03]"><SlashMark className="h-40 w-[520px]" /></div>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#08090b]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <SlashMark className="w-10" />
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-semibold tracking-[-0.05em]">ZERO</h1>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D62E37]">Control</span>
              </div>
              <p className="mt-0.5 text-[10px] text-zinc-600">Private observability · {data.admin.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void loadData(selectedSession)}
              className="flex items-center gap-2 rounded-[15px] border border-white/[0.09] bg-white/[0.025] px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition hover:border-white/[0.16] hover:text-white"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 rounded-[15px] border border-white/[0.09] bg-white/[0.025] px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition hover:border-[#D62E37]/30 hover:text-[#D62E37]"
            >
              <LogOut size={13} /> Exit
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-[1680px] px-5 py-6 lg:px-8">
        {error && <div className="mb-5 rounded-[16px] border border-[#D62E37]/20 bg-[#D62E37]/[0.07] px-4 py-3 text-xs text-red-300">{error}</div>}

        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Sessions" value={data.metrics.sessions} icon={Users} />
          <MetricCard label="Active today" value={data.metrics.activeToday} icon={Activity} />
          <MetricCard label="Messages" value={data.metrics.messagesToday} icon={MessageSquare} />
          <MetricCard label="Avg response" value={data.metrics.avgResponseMs ? `${(data.metrics.avgResponseMs / 1000).toFixed(2)}s` : "—"} icon={Clock3} accent />
          <MetricCard label="Failures" value={data.metrics.failures} icon={AlertTriangle} accent={data.metrics.failures > 0} />
          <MetricCard label="Leads" value={data.metrics.leads} icon={Mail} />
        </section>

        <section className="grid min-h-[calc(100vh-210px)] gap-4 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          <aside className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#101115]">
            <PanelHeader eyebrow="Sessions" title="Recent visitors" side={<span className="text-xs text-zinc-600">{data.sessions.length}</span>} />
            <div className="max-h-[calc(100vh-275px)] overflow-y-auto">
              {data.sessions.map((session, index) => {
                const active = (selectedSession ?? data.sessions[0]?.session_id) === session.session_id;
                return (
                  <button
                    key={session.session_id}
                    onClick={() => void selectSession(session.session_id)}
                    className={`group relative w-full border-b border-white/[0.055] px-4 py-4 text-left transition ${active ? "bg-[#D62E37]/[0.07]" : "hover:bg-white/[0.025]"}`}
                  >
                    {active && <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-[#D62E37]" />}
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-[9px] font-semibold text-zinc-700">{String(index + 1).padStart(2, "0")}</span>
                        <code className="truncate text-[11px] text-zinc-300">{shortId(session.session_id)}</code>
                      </div>
                      <ChevronRight size={13} className={active ? "text-[#D62E37]" : "text-zinc-700 group-hover:text-zinc-500"} />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-600">
                      <span>{fmt(session.last_active_at)}</span>
                      <span>{session.message_count} msg</span>
                    </div>
                  </button>
                );
              })}
              {!data.sessions.length && <p className="p-5 text-xs text-zinc-600">No sessions recorded yet.</p>}
            </div>
          </aside>

          <section className="flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#101115]">
            <PanelHeader
              eyebrow="Conversation"
              title={selected ? `Session ${shortId(selected.session_id)}` : "No active session"}
              side={selected ? <span className="text-[10px] text-zinc-600">{selected.message_count} messages</span> : undefined}
            />

            <div className="max-h-[calc(100vh-300px)] flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
              {[...data.messages].reverse().map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role !== "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] border border-[#D62E37]/20 bg-[#D62E37]/[0.08]">
                      <Bot size={14} className="text-[#D62E37]" />
                    </div>
                  )}

                  <div className={`min-w-0 ${message.role === "user" ? "max-w-[82%]" : "max-w-[88%]"}`}>
                    <div className={`mb-1.5 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-zinc-700 ${message.role === "user" ? "justify-end" : ""}`}>
                      <span className={message.role === "assistant" ? "text-[#D62E37]" : "text-zinc-500"}>{message.role === "user" ? "Visitor" : "Zero"}</span>
                      {message.provider && <span>{message.provider}</span>}
                      {message.latency_ms != null && <span>{message.latency_ms}ms</span>}
                      <span>{fmt(message.created_at)}</span>
                    </div>
                    <div className={`rounded-[20px] border px-4 py-3.5 text-[13px] leading-6 ${message.role === "user" ? "rounded-tr-[7px] border-[#D62E37]/20 bg-[#D62E37]/[0.08]" : "rounded-tl-[7px] border-white/[0.08] bg-[#0b0c0f] text-zinc-300"}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] border border-white/[0.09] bg-white/[0.025]">
                      <User size={14} className="text-zinc-500" />
                    </div>
                  )}
                </div>
              ))}
              {!data.messages.length && <div className="flex h-48 items-center justify-center text-xs text-zinc-700">No conversation data.</div>}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#101115]">
              <PanelHeader eyebrow="Providers" title="Model usage" side={<Zap size={14} className="text-[#D62E37]" />} />
              <div className="space-y-4 p-5">
                {providerEntries.map(([provider, count]) => {
                  const pct = Math.round((count / totalProvider) * 100);
                  return (
                    <div key={provider}>
                      <div className="mb-2 flex items-center justify-between text-[10px]">
                        <span className="font-medium text-zinc-300">{provider}</span>
                        <span className="text-zinc-600">{count} · {pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div className="h-full rounded-full bg-[#D62E37]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {!providerEntries.length && <p className="text-xs text-zinc-600">No provider selections yet.</p>}
              </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#101115]">
              <PanelHeader eyebrow="Events" title="Latest activity" />
              <div className="max-h-[280px] overflow-y-auto">
                {data.events.slice(0, 8).map((event) => (
                  <div key={event.id} className="border-b border-white/[0.055] px-5 py-3.5 last:border-b-0">
                    <div className="flex items-center justify-between gap-3">
                      <code className={`text-[10px] ${event.event_type.includes("failure") || event.event_type.includes("interrupted") ? "text-red-400" : "text-zinc-400"}`}>{event.event_type}</code>
                      {event.latency_ms != null && <span className="text-[9px] text-[#D62E37]">{event.latency_ms}ms</span>}
                    </div>
                    <p className="mt-1 text-[9px] text-zinc-700">{event.provider ?? "system"} · {fmt(event.created_at)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#101115]">
              <PanelHeader eyebrow="Leads" title="Inbound contacts" side={<span className="text-xs text-zinc-600">{data.leads.length}</span>} />
              <div className="max-h-[210px] overflow-y-auto">
                {data.leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="border-b border-white/[0.055] px-5 py-3.5 last:border-b-0">
                    <p className="truncate text-[11px] font-medium text-zinc-300">{lead.email}</p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-600">{lead.message}</p>
                  </div>
                ))}
                {!data.leads.length && <p className="px-5 py-5 text-xs text-zinc-600">No leads captured yet.</p>}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
