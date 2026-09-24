import { Resend } from 'resend';
import type { SanitizedContactData } from './types.js';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY secret environment variable is missing.');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sends portfolio inquiry email to manojkc1@gmail.com via Resend.
 */
export async function sendContactEmail(data: SanitizedContactData): Promise<void> {
  const resend = getResendClient();

  const recipientEmail = 'manojkc1@gmail.com';
  const senderEmail = 'portfolio@manojkc1.com.np';
  const subject = `New portfolio message from ${data.name}`;

  const submissionDate = new Date().toUTCString();

  const plainText = `
You received a new inquiry from your portfolio contact form.

Name: ${data.name}
Email: ${data.email}
Date: ${submissionDate}

Message:
----------------------------------------
${data.message}
----------------------------------------

Reply directly to this email to respond to ${data.name} (${data.email}).
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .header { background: #4f46e5; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0f172a; font-weight: 600; }
    .message-box { background: #f1f5f9; border-radius: 8px; padding: 16px; font-size: 14px; white-space: pre-wrap; word-break: break-word; color: #334155; border-left: 4px solid #4f46e5; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
      <p>Submitted via manojkc1.com.np</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${escapeHtml(data.name)} &lt;<a href="mailto:${escapeHtml(data.email)}" style="color: #4f46e5; text-decoration: none;">${escapeHtml(data.email)}</a>&gt;</div>
      </div>
      <div class="field">
        <div class="label">Date (UTC)</div>
        <div class="value">${submissionDate}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${escapeHtml(data.message)}</div>
      </div>
    </div>
    <div class="footer">
      Hit "Reply" in your email client to respond directly to ${escapeHtml(data.email)}.
    </div>
  </div>
</body>
</html>
`.trim();

  const result = await resend.emails.send({
    from: `Manoj Portfolio <${senderEmail}>`,
    to: [recipientEmail],
    replyTo: data.email,
    subject,
    text: plainText,
    html: htmlBody,
  });

  if (result.error) {
    throw new Error(`Resend delivery failed: ${result.error.message}`);
  }
}
