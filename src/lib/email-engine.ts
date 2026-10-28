export const VARIABLES = ["name", "ticket_id", "company", "date", "sender_name"] as const;

export const SAMPLE_DATA: Record<string, string> = {
  name: "Amine Benali",
  ticket_id: "INC-20481",
  company: "Sinova Technologies",
  date: "28 Oct 2026",
  sender_name: "Sinova IT Support",
};

export const SENDERS = [
  { id: "it", name: "Sinova IT Support", title: "IT Service Desk", email: "it-support@sinova.com" },
  { id: "pm", name: "Product Manager", title: "Product Management Office", email: "product@sinova.com" },
  { id: "admin", name: "Administration", title: "Corporate Administration", email: "admin@sinova.com" },
];

const btn = (label: string, href = "#") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td align="center" bgcolor="#0057D9" style="border-radius:8px;"><a href="${href}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;">${label}</a></td></tr></table>`;

export const BUTTON_SNIPPET = btn("Call to action");
export const CALLOUT_SNIPPET = `<div style="margin:20px 0;padding:16px 20px;background:#EFF6FF;border-left:4px solid #0057D9;border-radius:6px;color:#0B192C;">Important: add your highlighted note here.</div>`;
export const TABLE_SNIPPET = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;"><tr><th style="text-align:left;padding:10px;border-bottom:2px solid #0057D9;color:#0B192C;">Item</th><th style="text-align:left;padding:10px;border-bottom:2px solid #0057D9;color:#0B192C;">Status</th></tr><tr><td style="padding:10px;border-bottom:1px solid #E2E8F0;">Row 1</td><td style="padding:10px;border-bottom:1px solid #E2E8F0;">Done</td></tr></table>`;

export const TEMPLATES = [
  {
    id: "escalation",
    name: "Ticket Escalation",
    desc: "IT incident escalation notice",
    subject: "[Escalated] Ticket {{ticket_id}} requires attention",
    body: `<h1>Ticket escalation notice</h1><p>Hello {{name}},</p><p>Ticket <strong>{{ticket_id}}</strong> has been escalated to Level 2 support due to its business impact on {{company}}.</p>${CALLOUT_SNIPPET.replace("Important: add your highlighted note here.", "Priority: <strong>High</strong> — Target resolution within 4 business hours.")}<p>Our engineers are actively investigating. You will receive updates as progress is made.</p>${btn("View ticket")}`,
  },
  {
    id: "system",
    name: "System Update",
    desc: "Hierarchy correction & changes",
    subject: "System update & hierarchy correction — {{date}}",
    body: `<h1>System update</h1><p>Dear {{name}},</p><p>As of {{date}}, the following updates have been applied to the {{company}} directory:</p><ul><li>Reporting lines corrected for the Operations division</li><li>Access roles synchronized with HR records</li><li>Legacy approval groups retired</li></ul>${TABLE_SNIPPET}<p>No action is required unless your details are incorrect.</p>`,
  },
  {
    id: "announcement",
    name: "Executive Summary",
    desc: "Professional announcement",
    subject: "Executive summary: Q4 priorities at {{company}}",
    body: `<h1>Executive summary</h1><p>Hello {{name}},</p><p>Here are the key highlights for this quarter at {{company}}.</p><h2>Highlights</h2><ul><li>Revenue up 18% year over year</li><li>Three new regional partnerships</li><li>Launch of the Sinova Cloud platform</li></ul>${btn("Read full report")}`,
  },
  {
    id: "welcome",
    name: "Client Onboarding",
    desc: "Welcome a new client",
    subject: "Welcome to Sinova, {{name}}",
    body: `<h1>Welcome aboard, {{name}}!</h1><p>We're delighted to partner with {{company}}. Your dedicated account team is ready to help you get started.</p><h2>Next steps</h2><ol><li>Activate your client portal</li><li>Schedule your kickoff call</li><li>Meet your success manager</li></ol>${btn("Activate portal")}`,
  },
];

export function hydrate(text: string, data: Record<string, string>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => data[k] ?? m);
}

const INLINE: Record<string, string> = {
  h1: "margin:0 0 16px;font-size:26px;line-height:1.3;font-weight:800;color:#0B192C;",
  h2: "margin:24px 0 12px;font-size:19px;line-height:1.4;font-weight:700;color:#0B192C;",
  p: "margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;",
  ul: "margin:0 0 16px;padding-left:22px;color:#334155;font-size:15px;line-height:1.7;",
  ol: "margin:0 0 16px;padding-left:22px;color:#334155;font-size:15px;line-height:1.7;",
  li: "margin:0 0 6px;",
  a: "color:#0057D9;text-decoration:underline;",
  blockquote: "margin:16px 0;padding:12px 16px;border-left:4px solid #00C2FF;color:#475569;",
};

/** Inline CSS for elements without an explicit style attribute. */
export function inlineStyles(html: string) {
  return html.replace(/<(h1|h2|p|ul|ol|li|a|blockquote)(\s[^>]*)?>/gi, (m, tag: string, attrs = "") => {
    if (/style\s*=/.test(attrs)) return m;
    return `<${tag}${attrs} style="${INLINE[tag.toLowerCase()]}">`;
  });
}

export function buildEmail(opts: {
  body: string;
  subject: string;
  sender: (typeof SENDERS)[number];
  dark?: boolean;
}) {
  const { sender, dark } = opts;
  let body = inlineStyles(opts.body);
  const bg = dark ? "#03071E" : "#F8FAFC";
  const card = dark ? "#0B192C" : "#FFFFFF";
  if (dark) {
    body = body
      .replace(/color:#0B192C/g, "color:#F8FAFC")
      .replace(/color:#334155/g, "color:#CBD5E1")
      .replace(/background:#EFF6FF/g, "background:#10264A");
  }
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${opts.subject}</title></head>
<body style="margin:0;padding:0;background:${bg};-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${bg};"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${card};border-radius:14px;overflow:hidden;font-family:Inter,Segoe UI,Arial,sans-serif;">
<tr><td style="background:#03071E;padding:22px 32px;"><span style="font-size:20px;font-weight:800;letter-spacing:3px;color:#FFFFFF;">SINOVA</span><span style="font-size:12px;color:#00C2FF;margin-left:10px;">a Samsung partner</span></td></tr>
<tr><td style="height:4px;background:#0057D9;background-image:linear-gradient(90deg,#0057D9,#00C2FF);font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:36px 32px 12px;">${body}</td></tr>
<tr><td style="padding:8px 32px 28px;"><p style="margin:0;font-size:14px;line-height:1.6;color:${dark ? "#CBD5E1" : "#334155"};">Best regards,<br><strong style="color:${dark ? "#F8FAFC" : "#0B192C"};">${sender.name}</strong><br><span style="color:#64748B;">${sender.title} · ${sender.email}</span></p></td></tr>
<tr><td style="background:#0B192C;padding:24px 32px;font-size:12px;line-height:1.6;color:#94A3B8;">
<p style="margin:0 0 10px;"><a href="#" style="color:#00C2FF;text-decoration:none;margin-right:14px;">LinkedIn</a><a href="#" style="color:#00C2FF;text-decoration:none;margin-right:14px;">X</a><a href="#" style="color:#00C2FF;text-decoration:none;">YouTube</a></p>
<p style="margin:0 0 8px;">Sinova Technologies · 12 Rue Didouche Mourad, Algiers, Algeria</p>
<p style="margin:0;color:#64748B;">CONFIDENTIALITY NOTICE: This email and any attachments are confidential and intended solely for the named recipient. If you received it in error, please notify the sender and delete it.</p>
</td></tr></table></td></tr></table></body></html>`;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
