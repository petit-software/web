import { NextResponse } from "next/server";
import crypto from "node:crypto";

interface SignupBody {
  email?: string;
  tags?: string[];
  source?: string;
}

interface MailchimpError {
  title?: string;
  detail?: string;
  status?: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: SignupBody;
  try {
    body = (await req.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error("[email-signup] Mailchimp env vars missing");
    return NextResponse.json({ error: "Signup is not configured yet." }, { status: 503 });
  }

  const subscriberHash = crypto.createHash("md5").update(email).digest("hex");
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  const payload = {
    email_address: email,
    status_if_new: "subscribed",
    tags: body.tags ?? [],
    merge_fields: body.source ? { SOURCE: body.source } : undefined,
  };

  const mcRes = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!mcRes.ok) {
    const err = (await mcRes.json().catch(() => ({}))) as MailchimpError;
    console.error("[email-signup] Mailchimp error", err);
    const message =
      err.title === "Member Exists"
        ? "You're already on the list."
        : err.detail ?? "We couldn't sign you up. Please try again.";
    return NextResponse.json({ error: message }, { status: mcRes.status });
  }

  return NextResponse.json({ ok: true });
}
