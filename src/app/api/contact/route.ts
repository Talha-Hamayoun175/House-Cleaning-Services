import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validations/contact";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`contact:${ip}`);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a few minutes before trying again.",
        },
        {
          status: 429,
          headers: rateLimit.retryAfterSeconds
            ? { "Retry-After": String(rateLimit.retryAfterSeconds) }
            : undefined,
        },
      );
    }

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the form and try again.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (parsed.data.website?.trim()) {
      return NextResponse.json({ success: true });
    }

    const submittedAt = new Date();
    const { website: _honeypot, ...contactData } = parsed.data;

    await sendContactEmail({
      ...contactData,
      submittedAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const smtpError = error as { code?: string; response?: string };
    if (smtpError.code === "EAUTH") {
      console.error(
        "Contact form SMTP authentication failed. Check SMTP_USER/SMTP_PASS in .env.local and restart the dev server.",
      );
    } else {
      console.error("Contact form submission failed:", error);
    }

    return NextResponse.json(
      {
        error:
          "We could not send your message right now. Please try again or contact us directly by email or WhatsApp.",
      },
      { status: 500 },
    );
  }
}
