"use client";

import {
  FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Clock3,
  Database,
  Gauge,
  LogOut,
  Mail,
  MessageSquare,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
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
  events: EventRow[];
  leads: LeadRow[];
};

type SessionDetail = { messages: MessageRow[] };

const fmt = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const shortId = (value: string) =>
  value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;

function SectionHead({ index, label, title, meta }: { index: string; label: string; title: string; meta?: string }) {
  return (
    <div className="zc-section-head">
      <span className="zc-section-index">{index}</span>
      <div><span className="zc-kicker">{label}</span><h2>{title}</h2></div>
      {meta && <span className="zc-section-meta">{meta}</span>}
    </div>
  );
}

function Metric({ label, value, icon: Icon, signal = "neutral" }: { label: string; value: string | number; icon: typeof Activity; signal?: "neutral" | "hot" | "good" }) {
  return (
    <div className={`zc-metric zc-metric--${signal}`}>
      <div className="zc-metric-label"><Icon size={14} strokeWidth={1.7} /><span>{label}</span></div>
      <strong>{value}</strong><i aria-hidden="true" />
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`zc-panel ${className}`}>{children}</section>;
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return <>{parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].trim();
      if (!/^https?:\/\//i.test(href) && !href.startsWith("/")) return <span key={index}>{link[1]}</span>;
      return <a key={index} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{link[1]}<ArrowUpRight size={11} aria-hidden="true" /></a>;
    }
    return <span key={index}>{part}</span>;
  })}</>;
}

function MessageContent({ content }: { content: string }) {
  return <div className="zc-message-content">{content.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <span className="zc-message-gap" key={index} />;
    const bullet = trimmed.match(/^(?:[-*•▸›])\s+(.+)$/);
    if (bullet) return <div className="zc-message-bullet" key={index}><i /><p><InlineText text={bullet[1]} /></p></div>;
    return <p key={index}><InlineText text={trimmed} /></p>;
  })}</div>;
}

export default function ControlRoomEditorial() {
  const [data, setData] = useState<ControlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionQuery, setSessionQuery] = useState("");
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<Record<string, SessionDetail>>({});
  const [loadingSession, setLoadingSession] = useState<string | null>(null);
  const sessionDetailsRef = useRef<Record<string, SessionDetail>>({});
  const pendingSessionsRef = useRef(new Map<string, Promise<SessionDetail>>());
  const transcriptRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/zero-control/api/data", { cache: "no-store" });
      if (response.status === 401) { setData(null); setAuthRequired(true); return; }
      if (!response.ok) throw new Error("Failed to load Control Room data.");
      const payload = await response.json() as ControlData;
      setData(payload); setAuthRequired(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally { setLoading(false); }
  }, []);

  const getSessionDetail = useCallback(async (id: string, force = false) => {
    if (!force && sessionDetailsRef.current[id]) return sessionDetailsRef.current[id];
    const pending = pendingSessionsRef.current.get(id);
    if (!force && pending) return pending;

    const request = fetch(`/zero-control/api/session?session=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as SessionDetail & { error?: string };
        if (!response.ok) throw new Error(payload.error || "Failed to load this transcript.");
        return { messages: payload.messages };
      });

    pendingSessionsRef.current.set(id, request);
    try {
      const detail = await request;
      const next = { ...sessionDetailsRef.current, [id]: detail };
      sessionDetailsRef.current = next;
      setSessionDetails(next);
      return detail;
    } finally {
      pendingSessionsRef.current.delete(id);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault(); setSigningIn(true); setError("");
    try {
      const response = await fetch("/zero-control/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Access denied.");
      setPassword(""); await loadData();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Access denied."); }
    finally { setSigningIn(false); }
  }

  async function logout() {
    await fetch("/zero-control/api/logout", { method: "POST" });
    sessionDetailsRef.current = {};
    setSessionDetails({});
    setData(null); setSelectedSession(null); setAuthRequired(true);
  }

  async function selectSession(id: string) {
    setSelectedSession(id);
    setError("");
    if (sessionDetailsRef.current[id]) return;
    setLoadingSession(id);
    try {
      await getSessionDetail(id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load this transcript.");
    } finally {
      setLoadingSession((current) => current === id ? null : current);
    }
  }

  function prefetchSession(id: string) {
    if (sessionDetailsRef.current[id] || pendingSessionsRef.current.has(id)) return;
    void getSessionDetail(id).catch(() => undefined);
  }

  async function refreshData() {
    await loadData();
    if (!selectedSession) return;
    setLoadingSession(selectedSession);
    try {
      await getSessionDetail(selectedSession, true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to refresh this transcript.");
    } finally {
      setLoadingSession((current) => current === selectedSession ? null : current);
    }
  }

  async function deleteSession(id: string) {
    if (!window.confirm("Delete this session and all related messages, events and leads? This cannot be undone.")) return;
    setDeletingSession(id); setError("");
    try {
      const response = await fetch("/zero-control/api/session", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: id }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Failed to delete session.");
      const next = { ...sessionDetailsRef.current };
      delete next[id];
      sessionDetailsRef.current = next;
      setSessionDetails(next);
      setSelectedSession(null); await loadData();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Failed to delete session."); }
    finally { setDeletingSession(null); }
  }

  async function deleteAllSessions() {
    if (!window.confirm("Delete every stored chat, message, event and lead? This cannot be undone.")) return;
    const confirmation = window.prompt("Type DELETE_ALL_CHATS to confirm.");
    if (confirmation !== "DELETE_ALL_CHATS") return;
    setDeletingAll(true); setError("");
    try {
      const response = await fetch("/zero-control/api/session", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteAll: true, confirmation }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Failed to delete all chats.");
      sessionDetailsRef.current = {};
      setSessionDetails({});
      setSelectedSession(null); await loadData();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Failed to delete all chats."); }
    finally { setDeletingAll(false); }
  }

  const providers = useMemo(() => Object.entries(data?.metrics.providerUsage ?? {}).sort((a, b) => b[1] - a[1]), [data]);
  const filteredSessions = useMemo(() => {
    const query = sessionQuery.trim().toLowerCase();
    if (!query) return data?.sessions ?? [];
    return (data?.sessions ?? []).filter((session) => session.session_id.toLowerCase().includes(query) || session.visitor_hash?.toLowerCase().includes(query) || session.referrer?.toLowerCase().includes(query));
  }, [data, sessionQuery]);
  const activeDetail = selectedSession ? sessionDetails[selectedSession] : undefined;
  const activeMessages = activeDetail?.messages ?? [];

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedSession, activeMessages.length]);

  if (authRequired && !data) {
    return <main className="zc-login-shell">
      <div className="zc-login-brand" aria-hidden="true"><span>ZERO</span><strong>OPS</strong><p>Private conversation intelligence</p></div>
      <section className="zc-login-card">
        <div className="zc-login-card-head"><span className="zc-login-icon"><ShieldCheck size={22} /></span><span className="zc-kicker">Authorised personnel only</span><h1>Enter the<br />control layer.</h1><p>Monitor sessions, model traffic and visitor intent from one private surface.</p></div>
        <form onSubmit={handleLogin}>
          <label><span>Admin email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@domain.com" /></label>
          <label><span>Password</span><input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••••" /></label>
          {error && <p className="zc-form-error" role="alert">{error}</p>}
          <button className="zc-primary-action" disabled={signingIn}><span>{signingIn ? "Authenticating" : "Open console"}</span>{signingIn ? <RefreshCw size={15} className="zc-spin" /> : <ArrowUpRight size={15} />}</button>
        </form>
        <div className="zc-login-foot"><i />Encrypted admin session</div>
      </section>
    </main>;
  }

  if (loading && !data) return <main className="zc-loading-shell"><div className="zc-loading-mark"><RefreshCw className="zc-spin" size={21} /></div><span>Synchronising telemetry</span></main>;
  if (!data) return null;

  const selected = selectedSession
    ? data.sessions.find((session) => session.session_id === selectedSession) ?? null
    : null;
  const totalProvider = providers.reduce((sum, [, value]) => sum + value, 0) || 1;
  const activeSessionId = selectedSession;
  const transcriptLoading = Boolean(selectedSession && loadingSession === selectedSession && !activeDetail);

  return <main className="zc-shell"><div className="zc-frame">
    <header className="zc-topbar">
      <div className="zc-brand"><Image src="/mask-circle.png" alt="" width={36} height={36} priority /><div className="zc-brand-wordmark"><strong>ZERO<span>/</span>OPS</strong><span>Conversation intelligence</span></div></div>
      <div className="zc-system-state"><span className="zc-live-dot" /><div><strong>System live</strong><span>Secure observer · {data.admin.email}</span></div></div>
      <nav className="zc-actions" aria-label="Control room actions"><button onClick={() => void refreshData()} disabled={loading || Boolean(loadingSession)}><RefreshCw size={14} className={loading || loadingSession ? "zc-spin" : ""} /><span>Sync</span></button><button onClick={() => void logout()}><LogOut size={14} /><span>Exit</span></button></nav>
    </header>

    <section className="zc-masthead"><div><span className="zc-kicker">Private telemetry surface · Live operations</span><h1>Signal over<br /><em>noise.</em></h1></div><div className="zc-masthead-note"><Radio size={17} /><p>Track who is talking to Zero, what they need, and how the system responds.</p></div></section>
    {error && <div className="zc-alert" role="alert"><AlertTriangle size={16} />{error}</div>}

    <section className="zc-metrics" aria-label="Live performance summary">
      <Metric label="Total sessions" value={data.metrics.sessions} icon={Database} />
      <Metric label="Active today" value={data.metrics.activeToday} icon={Activity} signal="good" />
      <Metric label="Messages today" value={data.metrics.messagesToday} icon={MessageSquare} />
      <Metric label="Mean response" value={data.metrics.avgResponseMs ? `${(data.metrics.avgResponseMs / 1000).toFixed(2)}s` : "—"} icon={Gauge} signal="hot" />
      <Metric label="Recent failures" value={data.metrics.failures} icon={AlertTriangle} signal={data.metrics.failures > 0 ? "hot" : "neutral"} />
      <Metric label="Inbound leads" value={data.metrics.leads} icon={Mail} />
    </section>

    <section className="zc-workspace">
      <Panel className="zc-sessions-panel">
        <SectionHead index="01" label="Channel index" title="Sessions" meta={`${filteredSessions.length}/${data.sessions.length}`} />
        <label className="zc-session-search"><Search size={14} /><input aria-label="Search sessions" value={sessionQuery} onChange={(event) => setSessionQuery(event.target.value)} placeholder="Search visitor or source" /></label>
        <div className="zc-session-list">{filteredSessions.map((session, index) => {
          const active = activeSessionId === session.session_id;
          return <button key={session.session_id} onPointerEnter={() => prefetchSession(session.session_id)} onFocus={() => prefetchSession(session.session_id)} onClick={() => void selectSession(session.session_id)} aria-current={active ? "true" : undefined} className={active ? "is-active" : ""}>
            <span className="zc-session-number">{String(index + 1).padStart(2, "0")}</span><span className="zc-session-copy"><strong>{shortId(session.session_id)}</strong><span>{fmt(session.last_active_at)}</span><small>{session.message_count} msgs{session.visitor_hash ? ` · ${session.visitor_hash.slice(0, 7)}` : ""}</small></span><ChevronRight size={14} />
          </button>;
        })}{!filteredSessions.length && <p className="zc-empty">No matching sessions.</p>}</div>
      </Panel>

      <Panel className="zc-transcript-panel">
        <SectionHead index="02" label="Transcript channel" title={selected ? shortId(selected.session_id) : "No session"} meta={selected ? `${selected.message_count} messages` : undefined} />
        {selected && <div className="zc-transcript-toolbar"><span><Clock3 size={13} />Last signal {fmt(selected.last_active_at)}</span><button type="button" onClick={() => void deleteSession(selected.session_id)} disabled={deletingSession === selected.session_id}><Trash2 size={12} />{deletingSession === selected.session_id ? "Deleting" : "Delete session"}</button></div>}
        <div ref={transcriptRef} className="zc-transcript" aria-busy={transcriptLoading}>
          {!selected && <div className="zc-transcript-state"><MessageSquare size={22} /><strong>Select a session</strong><p>Choose a visitor from the channel index to open its transcript.</p></div>}
          {selected && transcriptLoading && <div className="zc-transcript-state"><RefreshCw size={18} className="zc-spin" /><strong>Opening channel</strong><p>Loading only this conversation.</p></div>}
          {selected && !transcriptLoading && activeMessages.map((message) => <article key={message.id} className={`zc-message zc-message--${message.role}`}><div className="zc-message-meta"><span className="zc-message-avatar">{message.role === "assistant" ? <Bot size={13} /> : <User size={13} />}</span><strong>{message.role === "assistant" ? "ZERO" : "Visitor"}</strong>{message.provider && <span>{message.provider}</span>}{message.latency_ms != null && <span>{message.latency_ms}ms</span>}<time>{fmt(message.created_at)}</time></div><div className="zc-message-body"><MessageContent content={message.content} /></div></article>)}
          {selected && !transcriptLoading && !activeMessages.length && <p className="zc-empty">No messages in this session.</p>}
        </div>
      </Panel>

      <aside className="zc-telemetry-column">
        <Panel><SectionHead index="03A" label="Routing" title="Model traffic" /><div className="zc-provider-list">{providers.map(([provider, count]) => { const percentage = Math.round((count / totalProvider) * 100); return <div className="zc-provider" key={provider}><div><strong>{provider}</strong><span>{count} calls · {percentage}%</span></div><div className="zc-provider-track"><i style={{ width: `${percentage}%` }} /></div></div>; })}{!providers.length && <p className="zc-empty">No provider telemetry.</p>}</div></Panel>
        <Panel><SectionHead index="03B" label="Event stream" title="Latest activity" /><div className="zc-event-list">{data.events.slice(0, 8).map((event) => <div key={event.id} className="zc-event"><i /><div><strong>{event.event_type}</strong><span>{event.provider || "system"} · {fmt(event.created_at)}</span></div>{event.latency_ms != null && <small>{event.latency_ms}ms</small>}</div>)}{!data.events.length && <p className="zc-empty">No recent events.</p>}</div></Panel>
        <Panel><SectionHead index="03C" label="Intent capture" title="Inbound leads" meta={`${data.leads.length}`} /><div className="zc-lead-list">{data.leads.slice(0, 5).map((lead) => <article key={lead.id}><strong>{lead.email}</strong><p>{lead.message}</p></article>)}{!data.leads.length && <p className="zc-empty">No leads captured yet.</p>}</div></Panel>
        <Panel className="zc-danger-panel"><div><span className="zc-kicker">Data controls</span><strong>Destructive actions</strong></div><button onClick={() => void deleteAllSessions()} disabled={deletingAll || !data.sessions.length}><Trash2 size={13} />{deletingAll ? "Deleting all" : "Delete all chats"}</button></Panel>
      </aside>
    </section>

    <footer className="zc-footer"><span>ZERO/OPS · Internal system</span><span><Users size={12} /> {data.metrics.sessions} indexed sessions</span></footer>
  </div></main>;
}
