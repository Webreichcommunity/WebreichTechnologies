/* global process */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function getRequestOrigin(request) {
  const forwardedHost = request.headers["x-forwarded-host"];
  const host = forwardedHost || request.headers.host;
  const protocol = request.headers["x-forwarded-proto"] || "https";
  return host ? `${protocol}://${host}` : "https://webreich.in";
}

function getBody(request) {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return {};
    }
  }
  return request.body || {};
}

async function getAttachment(origin) {
  const explicitUrl = process.env.INTERNSHIP_PDF_URL;
  const path = explicitUrl || `${origin}/internship.pdf`;

  try {
    const response = await fetch(path, { method: "HEAD", redirect: "follow" });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.toLowerCase().includes("pdf")) return null;
    return { path, filename: "WebReich-Internship-Program.pdf" };
  } catch {
    return null;
  }
}

function buildEmail({ name, course, track, fee, readinessLabel, applicationId }) {
  const safeName = escapeHtml(name);
  const safeCourse = escapeHtml(course);
  const safeTrack = escapeHtml(track);
  const safeReference = escapeHtml(applicationId);
  const formattedFee = `₹${Number(fee).toLocaleString("en-IN")}`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>WebReich internship application</title>
    <style>
      @media only screen and (max-width: 600px) {
        .email-shell { padding: 16px 8px !important; }
        .email-card { border-radius: 18px !important; }
        .email-pad { padding: 26px 22px !important; }
        .email-title { font-size: 29px !important; }
        .summary-value { max-width: 160px !important; }
      }
    </style>
  </head>
  <body style="margin:0;background:#f5f1e9;color:#1c1917;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">We received your WebReich internship application.</div>
    <table class="email-shell" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e9;padding:28px 12px;">
      <tr><td align="center">
        <table class="email-card" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 50px rgba(28,25,23,.08);">
          <tr>
            <td class="email-pad" style="background:#1c1917;padding:34px 38px;color:#ffffff;border-top:5px solid #f97316;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="62" valign="middle">
                    <img src="cid:webreich-logo" width="52" height="52" alt="WebReich" style="display:block;width:52px;height:52px;object-fit:contain;border:0;" />
                  </td>
                  <td valign="middle">
                    <div style="font-size:16px;font-weight:800;letter-spacing:3px;color:#ffffff;">WEBREICH</div>
                    <div style="margin-top:4px;font-size:11px;letter-spacing:1.5px;color:#fb923c;">INTERNSHIP OPERATIONS</div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;border:1px solid rgba(251,146,60,.45);border-radius:999px;padding:8px 11px;font-size:10px;font-weight:700;letter-spacing:1.2px;color:#fdba74;">RECEIVED</span>
                  </td>
                </tr>
              </table>
              <h1 class="email-title" style="margin:28px 0 0;font-size:34px;line-height:1.15;letter-spacing:-1px;">Application received.</h1>
              <p style="margin:14px 0 0;color:#d6d3d1;font-size:16px;line-height:1.7;">Thanks for taking the first step, ${safeName}. Your profile is now in our review queue.</p>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:34px 38px;">
              <p style="margin:0;font-size:16px;line-height:1.8;color:#57534e;">We’ll review your skills, education, preferred track, and readiness. If your profile matches a current opportunity, the WebReich team will contact you directly.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:26px;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
                <tr><td style="padding:16px 18px;border-bottom:1px solid #e7e5e4;color:#78716c;font-size:13px;">Course</td><td class="summary-value" align="right" style="padding:16px 18px;border-bottom:1px solid #e7e5e4;font-size:14px;font-weight:700;">${safeCourse}</td></tr>
                <tr><td style="padding:16px 18px;border-bottom:1px solid #e7e5e4;color:#78716c;font-size:13px;">Preferred track</td><td class="summary-value" align="right" style="padding:16px 18px;border-bottom:1px solid #e7e5e4;font-size:14px;font-weight:700;">${safeTrack}</td></tr>
                <tr><td style="padding:16px 18px;color:#78716c;font-size:13px;">Readiness</td><td class="summary-value" align="right" style="padding:16px 18px;font-size:14px;font-weight:700;">${escapeHtml(readinessLabel)}</td></tr>
              </table>

              <div style="margin-top:26px;padding:22px;border-radius:16px;background:#fff7ed;border:1px solid #fed7aa;">
                <div style="font-size:12px;font-weight:700;letter-spacing:2px;color:#c2410c;">PROGRAM FEE IF SELECTED</div>
                <div style="margin-top:8px;font-size:30px;font-weight:800;color:#9a3412;">${formattedFee}</div>
                <p style="margin:10px 0 0;color:#7c2d12;font-size:13px;line-height:1.6;">${readinessLabel === "Skilled" ? "Project-ready / skilled student track" : "Foundation training / unskilled student track"}. No payment is required with this application. Instructions are shared only after review and selection.</p>
              </div>

              <div style="margin-top:26px;padding:18px;border-radius:14px;background:#f5f5f4;">
                <div style="font-size:12px;color:#78716c;">Application reference</div>
                <div style="margin-top:6px;font-family:monospace;font-size:13px;color:#292524;word-break:break-all;">${safeReference}</div>
              </div>

              <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#78716c;">Your WebReich internship program PDF is attached to this email for your reference. Questions? Reply to this email and our team will help.</p>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;">
                <tr><td style="border-radius:999px;background:#1c1917;">
                  <a href="https://webreich.in/careers" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Explore WebReich careers</a>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:24px 38px;background:#fafaf9;border-top:1px solid #e7e5e4;color:#78716c;font-size:12px;line-height:1.7;">
              <strong style="color:#292524;">WebReich Technologies</strong><br />
              Akola, Maharashtra, India<br />
              <a href="https://webreich.in" style="color:#ea580c;text-decoration:none;">webreich.in</a> &nbsp;·&nbsp; internships@support.webreich.in
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${name},

We received your WebReich internship application.

Course: ${course}
Preferred track: ${track}
Readiness: ${readinessLabel}
Program fee if selected: ${formattedFee}

No payment is required with this application. Instructions are shared only after review and selection.

Application reference: ${applicationId}

If your profile matches a current opportunity, the WebReich team will contact you directly.

WebReich Technologies
https://webreich.in`;

  return { html, text };
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(503).json({ message: "Email service is not configured." });
  }

  const body = getBody(request);
  if (body.website) return response.status(200).json({ ok: true });

  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
  const course = String(body.course || "").trim().slice(0, 120);
  const track = String(body.track || "").trim().slice(0, 120);
  const applicationId = String(body.applicationId || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  const readiness = body.readiness === "project-ready" ? "project-ready" : body.readiness === "foundation" ? "foundation" : "";

  if (!name || !isEmail(email) || !course || !track || !applicationId || !readiness) {
    return response.status(400).json({ message: "Invalid application details." });
  }

  const fee = readiness === "project-ready" ? 999 : 1499;
  const readinessLabel = readiness === "project-ready" ? "Skilled" : "Learning foundation";
  const origin = getRequestOrigin(request);
  const attachment = await getAttachment(origin);
  if (!attachment) {
    return response.status(503).json({ message: "Internship PDF is not available." });
  }
  const { html, text } = buildEmail({ name, course, track, fee, readinessLabel, applicationId });

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `internship-application/${applicationId}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "WebReich Internships <internships@support.webreich.in>",
        to: [email],
        reply_to: process.env.RESEND_REPLY_TO || "internships@support.webreich.in",
        subject: "We received your WebReich internship application",
        html,
        text,
        attachments: [
          attachment,
          {
            path: `${origin}/logo.png`,
            filename: "webreich-logo.png",
            content_id: "webreich-logo",
            content_type: "image/png",
          },
        ],
        tags: [{ name: "category", value: "internship-application" }],
      }),
    });
    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error("Resend internship confirmation failed", result);
      return response.status(502).json({ message: "Confirmation email could not be sent." });
    }

    return response.status(200).json({
      ok: true,
      emailId: result.id,
      attachmentIncluded: true,
    });
  } catch (error) {
    console.error("Internship confirmation error", error);
    return response.status(502).json({ message: "Confirmation email could not be sent." });
  }
}
