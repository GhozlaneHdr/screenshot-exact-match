export const VARIABLES = ["name", "company", "date", "week", "region", "sender_name"] as const;

export const SAMPLE_DATA: Record<string, string> = {
  name: "Équipe Commerciale",
  company: "SAMSUNG SINOVA",
  date: "28 Oct 2026",
  week: "S44",
  region: "Alger Centre",
  sender_name: "Ghozlane Hadri",
};

export type Brand = {
  logoText: string;
  logoUrl: string;
  tagline: string;
  headerBg: string;
  primary: string;
  accent: string;
  textColor: string;
  headingColor: string;
  font: string;
  footerBg: string;
  footerText: string;
  footerAddress: string;
  footerNotice: string;
  buttonRadius: number;
};

export const DEFAULT_BRAND: Brand = {
  logoText: "SAMSUNG SINOVA",
  logoUrl: "",
  tagline: "Performance Commerciale",
  headerBg: "#03071E",
  primary: "#1428A0",
  accent: "#00C2FF",
  textColor: "#334155",
  headingColor: "#0B192C",
  font: "Arial, Helvetica, sans-serif",
  footerBg: "#0B192C",
  footerText: "#94A3B8",
  footerAddress: "SAMSUNG SINOVA · Algérie",
  footerNotice: "CONFIDENTIEL : Ce message et ses pièces jointes sont destinés exclusivement à leurs destinataires.",
  buttonRadius: 8,
};

export const FONTS = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Segoe UI", value: "'Segoe UI', Tahoma, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
  { label: "Courier", value: "'Courier New', monospace" },
];

export const DEFAULT_SIGNATURE = `<p style="margin:0;font-size:14px;line-height:1.6;">Cordialement,<br><strong>Ghozlane Hadri</strong><br>Chargée de la performance Commerciale<br>SAMSUNG SINOVA</p>`;

export const btn = (label: string, href = "#", color = "#1428A0", radius = 8) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td align="center" bgcolor="${color}" style="border-radius:${radius}px;"><a href="${href}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:${radius}px;">${label}</a></td></tr></table>`;

export const CALLOUT_SNIPPET = `<div style="margin:20px 0;padding:16px 20px;background:#EFF6FF;border-left:4px solid #1428A0;border-radius:6px;color:#0B192C;">Important : ajoutez votre note ici.</div>`;

const kpiTable = (rows: [string, string, string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;font-size:14px;"><tr>${["Indicateur", "Objectif", "Réalisé", "Taux"].map((h) => `<th style="text-align:left;padding:10px;border-bottom:2px solid #1428A0;color:#0B192C;">${h}</th>`).join("")}</tr>${rows
    .map((r) => `<tr>${r.map((c) => `<td style="padding:10px;border-bottom:1px solid #E2E8F0;">${c}</td>`).join("")}</tr>`)
    .join("")}</table>`;

export const TABLE_SNIPPET = kpiTable([["Indicateur", "100", "90", "90%"]]);

export const TEMPLATES = [
  {
    id: "weekly",
    name: "Weekly Sales Report",
    desc: "Rapport hebdomadaire des ventes",
    subject: "Rapport des ventes — Semaine {{week}}",
    body: `<h1>Rapport hebdomadaire des ventes</h1><p>Bonjour {{name}},</p><p>Veuillez trouver ci-dessous la synthèse des performances commerciales de la semaine {{week}} pour la région {{region}}.</p>${kpiTable([
      ["Chiffre d'affaires", "45 M DA", "48,2 M DA", "107%"],
      ["Unités vendues", "3 200", "3 015", "94%"],
      ["Sell-out smartphones", "1 800", "1 912", "106%"],
      ["Points de vente actifs", "120", "114", "95%"],
    ])}<h2>Points clés</h2><ul><li>Forte progression de la gamme Galaxy S</li><li>Retard sur l'électroménager à rattraper</li><li>Promotion de fin de mois à lancer</li></ul>${btn("Voir le tableau de bord")}`,
  },
  {
    id: "kpi",
    name: "KPI Alert",
    desc: "Alerte sur un indicateur",
    subject: "⚠ Alerte KPI — {{region}} sous l'objectif",
    body: `<h1>Alerte KPI</h1><p>Bonjour {{name}},</p><p>Un indicateur clé est passé sous le seuil d'alerte au {{date}}.</p><div style="margin:20px 0;padding:16px 20px;background:#FEF2F2;border-left:4px solid #DC2626;border-radius:6px;color:#0B192C;"><strong>Taux de conversion — {{region}} : 68 %</strong><br>Seuil d'alerte : 80 % · Écart : -12 pts</div><h2>Actions recommandées</h2><ol><li>Analyser les causes avec les superviseurs terrain</li><li>Renforcer l'animation en point de vente</li><li>Point de suivi sous 48 h</li></ol>${btn("Analyser l'indicateur", "#", "#DC2626")}`,
  },
  {
    id: "exec",
    name: "Executive Performance Summary",
    desc: "Synthèse pour la direction",
    subject: "Synthèse de performance — {{company}} — {{date}}",
    body: `<h1>Synthèse de performance</h1><p>Madame, Monsieur,</p><p>Voici la synthèse exécutive des performances commerciales de {{company}} à date du {{date}}.</p>${kpiTable([
      ["CA cumulé", "520 M DA", "541 M DA", "104%"],
      ["Part de marché", "32%", "33,5%", "+1,5 pt"],
      ["Marge brute", "18%", "17,4%", "97%"],
    ])}<h2>Faits marquants</h2><ul><li>Dépassement de l'objectif de chiffre d'affaires</li><li>Gain de part de marché sur le segment premium</li><li>Pression sur la marge à surveiller</li></ul><p>Je reste à votre disposition pour toute précision.</p>${btn("Télécharger le rapport complet")}`,
  },
  {
    id: "blank",
    name: "Email vierge",
    desc: "Partir de zéro",
    subject: "",
    body: `<p>Bonjour {{name}},</p><p></p>`,
  },
];

export function hydrate(text: string, data: Record<string, string>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => data[k] ?? m);
}

function inline(b: Brand): Record<string, string> {
  return {
    h1: `margin:0 0 16px;font-size:26px;line-height:1.3;font-weight:800;color:${b.headingColor};`,
    h2: `margin:24px 0 12px;font-size:19px;line-height:1.4;font-weight:700;color:${b.headingColor};`,
    h3: `margin:20px 0 10px;font-size:16px;font-weight:700;color:${b.headingColor};`,
    p: `margin:0 0 16px;font-size:15px;line-height:1.7;color:${b.textColor};`,
    ul: `margin:0 0 16px;padding-left:22px;color:${b.textColor};font-size:15px;line-height:1.7;`,
    ol: `margin:0 0 16px;padding-left:22px;color:${b.textColor};font-size:15px;line-height:1.7;`,
    li: "margin:0 0 6px;",
    a: `color:${b.primary};text-decoration:underline;`,
    blockquote: `margin:16px 0;padding:12px 16px;border-left:4px solid ${b.accent};color:#475569;`,
  };
}

export function inlineStyles(html: string, b: Brand = DEFAULT_BRAND) {
  const map = inline(b);
  return html.replace(/<(h1|h2|h3|p|ul|ol|li|a|blockquote)(\s[^>]*)?>/gi, (m, tag: string, attrs = "") => {
    if (/style\s*=/.test(attrs)) return m;
    return `<${tag}${attrs} style="${map[tag.toLowerCase()]}">`;
  });
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildEmail(opts: { body: string; subject: string; signature: string; brand: Brand; dark?: boolean }) {
  const { brand: b, dark } = opts;
  let body = inlineStyles(opts.body, b).replace(/bgcolor="#1428A0"/g, `bgcolor="${b.primary}"`);
  const sig = inlineStyles(opts.signature, b);
  const bg = dark ? "#03071E" : "#F1F5F9";
  const card = dark ? "#0B192C" : "#FFFFFF";
  if (dark) body = body.replaceAll(`color:${b.headingColor}`, "color:#F8FAFC").replaceAll(`color:${b.textColor}`, "color:#CBD5E1");
  const logo = b.logoUrl
    ? `<img src="${esc(b.logoUrl)}" alt="${esc(b.logoText)}" height="36" style="display:inline-block;height:36px;border:0;vertical-align:middle;">`
    : `<span style="font-size:20px;font-weight:800;letter-spacing:3px;color:#FFFFFF;">${esc(b.logoText)}</span>`;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(opts.subject)}</title></head>
<body style="margin:0;padding:0;background:${bg};-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${bg};"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${card};border-radius:14px;overflow:hidden;font-family:${b.font};">
<tr><td style="background:${b.headerBg};padding:22px 32px;">${logo}<span style="font-size:12px;color:${b.accent};margin-left:12px;vertical-align:middle;">${esc(b.tagline)}</span></td></tr>
<tr><td style="height:4px;background:${b.primary};background-image:linear-gradient(90deg,${b.primary},${b.accent});font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:36px 32px 12px;color:${b.textColor};">${body}</td></tr>
<tr><td style="padding:8px 32px 28px;color:${dark ? "#CBD5E1" : b.textColor};border-top:1px solid ${dark ? "#1E293B" : "#E2E8F0"};">${sig}</td></tr>
<tr><td style="background:${b.footerBg};padding:24px 32px;font-size:12px;line-height:1.6;color:${b.footerText};">
<p style="margin:0 0 8px;">${esc(b.footerAddress)}</p>
<p style="margin:0;opacity:.8;">${esc(b.footerNotice)}</p>
</td></tr></table></td></tr></table></body></html>`;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
