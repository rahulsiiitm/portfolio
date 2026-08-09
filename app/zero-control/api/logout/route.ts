import { NextResponse } from "next/server";

import { clearAdminSession } from "../../_lib/server";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
