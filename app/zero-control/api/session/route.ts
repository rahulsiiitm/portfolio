import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession, supabaseData } from "../../_lib/server";

type DeleteSessionBody = {
  sessionId?: string;
  sessionIds?: string[];
  deleteAll?: boolean;
  confirmation?: string;
};

const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = request.nextUrl.searchParams.get("session")?.trim() ?? "";
    if (!SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ error: "Session ID is invalid." }, { status: 400 });
    }

    const messages = await supabaseData<MessageRow[]>(
      `zero_messages?select=id,session_id,role,content,provider,model,latency_ms,status,created_at&session_id=eq.${encodeURIComponent(sessionId)}&order=created_at.asc&limit=250`,
      admin.accessToken,
    );

    return NextResponse.json({ sessionId, messages });
  } catch (error) {
    console.error("[ZERO CONTROL] transcript request failed", error);
    return NextResponse.json({ error: "Failed to load this transcript." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as DeleteSessionBody;
    const requestedIds = body.sessionIds ?? (body.sessionId ? [body.sessionId] : []);
    const sessionIds = [...new Set(requestedIds.map((value) => value.trim()))];
    if (sessionIds.length > 100 || sessionIds.some((value) => !SESSION_ID_PATTERN.test(value))) {
      return NextResponse.json({ error: "One or more session IDs are invalid." }, { status: 400 });
    }
    if (body.deleteAll) {
      if (sessionIds.length || body.confirmation !== "DELETE_ALL_CHATS") {
        return NextResponse.json({ error: "Deleting all chats requires explicit confirmation." }, { status: 400 });
      }
    } else if (!sessionIds.length) {
      return NextResponse.json({ error: "Select at least one chat." }, { status: 400 });
    }

    const configuredUrl = process.env.ZERO_BACKEND_API_URL ?? process.env.NEXT_PUBLIC_CHAT_API_URL;
    const adminKey = process.env.ZERO_BACKEND_ADMIN_KEY;
    if (!configuredUrl || !adminKey) {
      return NextResponse.json({ error: "Backend deletion API is not configured." }, { status: 503 });
    }
    const baseUrl = configuredUrl.replace(/\/api\/chat\/?$/, "").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/api/admin/chats`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify({
        session_ids: sessionIds,
        delete_all: Boolean(body.deleteAll),
        confirmation: body.confirmation,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { detail?: string };
      return NextResponse.json(
        { error: payload.detail || "Backend chat deletion failed." },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ZERO CONTROL] session deletion failed", error);
    return NextResponse.json({ error: "Failed to delete the selected session." }, { status: 500 });
  }
}
