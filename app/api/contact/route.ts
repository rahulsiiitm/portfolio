import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Server-side validation
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Prepare HTML email body
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 8px; overflow: hidden;">
        <div style="background: #dc2626; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #fff;">
            📬 New Portfolio Message
          </h1>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 80px;">From</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; font-weight: 700;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222;">
                <a href="mailto:${formData.email}" style="color: #dc2626; text-decoration: none;">${formData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 0 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
              <td style="padding: 16px 0 0; line-height: 1.7; white-space: pre-wrap;">${formData.message}</td>
            </tr>
          </table>

          <div style="text-align: center; border-top: 1px solid #222; padding-top: 28px;">
            <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">
              They reached out via <strong style="color: #f5f5f5;">rahul.aishtrex.com</strong>. Check out the project showcase below:
            </p>
            <a href="https://rahul.aishtrex.com/projects"
               style="display: inline-block; background: #dc2626; color: #fff; text-decoration: none; padding: 14px 32px; font-weight: 900; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">
              🚀 View My Projects →
            </a>
          </div>
        </div>
        <div style="background: #111; padding: 16px 32px; text-align: center; border-top: 1px solid #1f1f1f;">
          <p style="margin: 0; color: #4b5563; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">
            © 2026 Rahul Sharma // Imphal, IN — Portfolio v2.0.4
          </p>
        </div>
      </div>
    `;

    // Prepare data for Web3Forms
    const payload = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '',
      subject: `New Message from ${formData.name} — Rahul's Portfolio`,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      html: htmlBody,
      replyto: formData.email
    };

    // Submit to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse Web3Forms response. Raw text:', text);
        return NextResponse.json(
          { success: false, message: 'External API Error: Invalid Response' },
          { status: 502 }
        );
      }
    } catch (readError) {
      console.error('Failed to read Web3Forms response:', readError);
      return NextResponse.json(
        { success: false, message: 'External API Error: Cannot Read Response' },
        { status: 502 }
      );
    }

    if (data.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Transmission Successful. We\'ll be in touch.' 
      });
    } else {
      console.error('Web3Forms returned failure:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Connection Failed. Retrying...' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Form submission error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: `Server Error: ${error?.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}