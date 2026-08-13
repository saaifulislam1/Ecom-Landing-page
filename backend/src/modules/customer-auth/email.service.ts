import { Resend } from "resend";
import { env } from "../../config/env.js";

let resend: Resend | null = null;

function getResend() {
  if (!env.RESEND_API_KEY) return null;
  resend ??= new Resend(env.RESEND_API_KEY);
  return resend;
}

export async function sendCustomerVerificationEmail(to: string, name: string, verificationUrl: string) {
  const client = getResend();
  if (!client) {
    if (env.NODE_ENV !== "production") {
      console.log(`Customer verification email skipped. Verification link for ${to}: ${verificationUrl}`);
    }
    return;
  }

  const { error } = await client.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: "Verify your PlugCommerce account",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h1 style="font-size: 22px;">Verify your email</h1>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Confirm your email address to finish setting up your customer account.</p>
        <p><a href="${verificationUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 6px; text-decoration: none;">Verify email</a></p>
        <p>If the button does not work, open this link:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", "\"": "&quot;" }[char]!));
}
