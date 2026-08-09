import { NextResponse } from "next/server";

import { signInAdmin } from "../../_lib/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const result = await signInAdmin(email, password);
    if (!result.ok) {
      const message = result.status === 403 ? "This account is not authorized." : "Invalid credentials.";
      return NextResponse.json({ error: message }, { status: result.status });
    }

    return NextResponse.json({ ok: true, email: result.user?.email ?? email });
  } catch (error) {
    console.error("[ZERO CONTROL] login failed", error);
    return NextResponse.json({ error: "Control Room is not configured correctly." }, { status: 500 });
  }
}
