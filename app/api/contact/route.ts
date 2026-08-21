import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; message?: string; botcheck?: string };
    if (body.botcheck) return NextResponse.json({ success: true });

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    if (!name || name.length > 100 || !EMAIL_PATTERN.test(email) || email.length > 254 || !message || message.length > 5000) {
      return NextResponse.json({ success: false, message: "Please check the form fields." }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) return NextResponse.json({ success: false, message: "Contact service is not configured." }, { status: 503 });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New portfolio message from ${name}`,
        name,
        email,
        message,
        replyto: email,
        html: `<h2>New Portfolio Message</h2><p><strong>From:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p>${safeMessage}</p><p><a href="https://rahul.aishtrex.com/#projects">View portfolio projects</a></p>`,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    const result = await response.json() as { success?: boolean; message?: string };
    return NextResponse.json(result, { status: response.ok && result.success ? 200 : 502 });
  } catch {
    return NextResponse.json({ success: false, message: "Contact service is temporarily unavailable." }, { status: 502 });
  }
}
