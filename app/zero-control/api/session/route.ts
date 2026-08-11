import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession, supabaseDelete } from "../../_lib/server";

type DeleteSessionBody = {
  sessionId?: string;
};

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as DeleteSessionBody;
    const sessionId = body.sessionId?.trim();
    if (!sessionId || sessionId.length > 128 || !/^[a-zA-Z0-9-]+$/.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID." }, { status: 400 });
    }

    const filter = `session_id=eq.${encodeURIComponent(sessionId)}`;
    await Promise.all([
      supabaseDelete(`zero_messages?${filter}`, admin.accessToken),
      supabaseDelete(`zero_events?${filter}`, admin.accessToken),
      supabaseDelete(`zero_leads?${filter}`, admin.accessToken),
    ]);
    await supabaseDelete(`zero_sessions?${filter}`, admin.accessToken);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ZERO CONTROL] session deletion failed", error);
    return NextResponse.json({ error: "Failed to delete the selected session." }, { status: 500 });
  }
}
