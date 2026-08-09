import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession, supabaseData } from "../../_lib/server";

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

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const selectedSession = request.nextUrl.searchParams.get("session")?.trim() || null;
    const sessionFilter = selectedSession
      ? `&session_id=eq.${encodeURIComponent(selectedSession)}`
      : "";

    const [sessions, messages, events, leads] = await Promise.all([
      supabaseData<SessionRow[]>(
        "zero_sessions?select=session_id,visitor_hash,user_agent,referrer,created_at,last_active_at,message_count&order=last_active_at.desc&limit=75",
        admin.accessToken,
      ),
      supabaseData<MessageRow[]>(
        `zero_messages?select=id,session_id,role,content,provider,model,latency_ms,status,created_at${sessionFilter}&order=created_at.desc&limit=${selectedSession ? 250 : 150}`,
        admin.accessToken,
      ),
      supabaseData<EventRow[]>(
        `zero_events?select=id,session_id,event_type,provider,model,latency_ms,metadata,created_at${sessionFilter}&order=created_at.desc&limit=${selectedSession ? 250 : 200}`,
        admin.accessToken,
      ),
      supabaseData<LeadRow[]>(
        "zero_leads?select=id,session_id,email,message,status,created_at&order=created_at.desc&limit=50",
        admin.accessToken,
      ),
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();

    const responseEvents = events.filter((event) => event.event_type === "response_complete");
    const latencies = responseEvents
      .map((event) => event.latency_ms)
      .filter((value): value is number => typeof value === "number");

    const providerUsage: Record<string, number> = {};
    for (const event of events) {
      if (event.event_type === "provider_selected" && event.provider) {
        providerUsage[event.provider] = (providerUsage[event.provider] ?? 0) + 1;
      }
    }

    const failureTypes = new Set(["provider_failure", "stream_interrupted", "all_providers_unavailable"]);
    const metrics = {
      sessions: sessions.length,
      activeToday: sessions.filter((session) => new Date(session.last_active_at).getTime() >= todayMs).length,
      messagesToday: messages.filter((message) => new Date(message.created_at).getTime() >= todayMs).length,
      avgResponseMs: latencies.length
        ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)
        : null,
      failures: events.filter((event) => failureTypes.has(event.event_type)).length,
      leads: leads.length,
      providerUsage,
    };

    return NextResponse.json({
      admin: { email: admin.user.email ?? "zero_admin" },
      metrics,
      sessions,
      messages,
      events,
      leads,
      selectedSession,
    });
  } catch (error) {
    console.error("[ZERO CONTROL] data request failed", error);
    return NextResponse.json({ error: "Failed to load Control Room data." }, { status: 500 });
  }
}
