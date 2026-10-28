import { createServerFn } from "@tanstack/react-start";

export type SmtpConfig = {
  host: string;
  port: number;
  encryption: "ssl" | "starttls" | "none";
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
};

type SendInput = {
  smtp: SmtpConfig;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(d: unknown): SendInput {
  const x = d as SendInput;
  if (!x?.smtp?.host || !x.smtp.port) throw new Error("SMTP host and port are required");
  if (!EMAIL.test(x.smtp.fromEmail ?? "")) throw new Error("Invalid sender email");
  if (!Array.isArray(x.to) || !x.to.length || !x.to.every((e) => EMAIL.test(e))) throw new Error("Invalid recipients");
  if (typeof x.subject !== "string" || typeof x.html !== "string") throw new Error("Subject and body required");
  if (x.html.length > 500_000) throw new Error("Email too large");
  return x;
}

async function connect(smtp: SmtpConfig) {
  const { WorkerMailer } = await import("worker-mailer");
  return WorkerMailer.connect({
    host: smtp.host,
    port: Number(smtp.port),
    secure: smtp.encryption === "ssl",
    startTls: smtp.encryption === "starttls",
    credentials: smtp.username ? { username: smtp.username, password: smtp.password } : undefined,
    authType: ["plain", "login"],
  });
}

function friendly(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  if (/cloudflare:sockets|ERR_UNSUPPORTED_ESM_URL_SCHEME|Cannot find package/i.test(msg))
    return "SMTP sending only works on the published app (not in the editor preview).";
  return msg;
}

export const sendSmtpEmail = createServerFn({ method: "POST" })
  .inputValidator(check)
  .handler(async ({ data }) => {
    try {
      const mailer = await connect(data.smtp);
      await mailer.send({
        from: { name: data.smtp.fromName, email: data.smtp.fromEmail },
        to: data.to,
        cc: data.cc?.length ? data.cc : undefined,
        bcc: data.bcc?.length ? data.bcc : undefined,
        subject: data.subject,
        html: data.html,
      });
      await mailer.close().catch(() => {});
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: friendly(e) };
    }
  });

export const testSmtpConnection = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const x = d as { smtp: SmtpConfig };
    if (!x?.smtp?.host || !x.smtp.port) throw new Error("SMTP host and port are required");
    return x;
  })
  .handler(async ({ data }) => {
    try {
      const mailer = await connect(data.smtp);
      await mailer.close().catch(() => {});
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: friendly(e) };
    }
  });
