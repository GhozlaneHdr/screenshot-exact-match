import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  Bold, Italic, Link2, List, ListOrdered, MousePointerClick, MessageSquareQuote, Table2,
  Monitor, Smartphone, Moon, Sun, Copy, Send, FlaskConical, Settings, X, ChevronDown,
  Loader2, Code2, Eye, Mail, Webhook, Heading1,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TEMPLATES, SENDERS, VARIABLES, SAMPLE_DATA, BUTTON_SNIPPET, CALLOUT_SNIPPET, TABLE_SNIPPET,
  buildEmail, hydrate, EMAIL_RE,
} from "@/lib/email-engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sinova Mail Studio — HTML Email Composer" },
      { name: "description", content: "Draft, preview and send Sinova-branded HTML emails with live desktop and mobile preview." },
      { property: "og:title", content: "Sinova Mail Studio" },
      { property: "og:description", content: "Draft, preview and send Sinova-branded HTML emails." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const commit = () => {
    const parts = draft.split(/[,;\s]+/).filter(Boolean);
    if (!parts.length) return;
    const bad = parts.filter((p) => !EMAIL_RE.test(p));
    if (bad.length) toast.error(`Invalid email: ${bad.join(", ")}`);
    onChange([...value, ...parts.filter((p) => EMAIL_RE.test(p) && !value.includes(p))]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "Tab", " "].includes(e.key) && draft) { e.preventDefault(); commit(); }
    if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
  };
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-card px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/30">
        {value.map((t) => (
          <Badge key={t} variant="secondary" className="gap-1 font-medium">
            {t}
            <button onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}><X className="h-3 w-3" /></button>
          </Badge>
        ))}
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} onBlur={commit}
          placeholder={value.length ? "" : "name@company.com"} className="min-w-32 flex-1 bg-transparent text-sm outline-none" />
      </div>
    </div>
  );
}

function Studio() {
  const [to, setTo] = useState<string[]>(["amine.benali@sinova.com"]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [templateId, setTemplateId] = useState(TEMPLATES[0]!.id);
  const [subject, setSubject] = useState(TEMPLATES[0]!.subject);
  const [body, setBody] = useState(TEMPLATES[0]!.body);
  const [senderId, setSenderId] = useState(SENDERS[0].id);
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [hydrated, setHydrated] = useState(true);
  const [dark, setDark] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [testOpen, setTestOpen] = useState(false);
  const [testAddr, setTestAddr] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const sender = SENDERS.find((s) => s.id === senderId)!;
  const data = useMemo(() => ({ ...SAMPLE_DATA, sender_name: sender.name }), [sender]);

  useEffect(() => {
    if (mode === "visual" && editorRef.current) editorRef.current.innerHTML = body;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey, mode]);

  const html = useMemo(() => {
    const raw = buildEmail({ body, subject, sender, dark });
    return hydrated ? hydrate(raw, data) : raw;
  }, [body, subject, sender, dark, hydrated, data]);
  const finalHtml = useMemo(() => hydrate(buildEmail({ body, subject, sender }), data), [body, subject, sender, data]);

  const pickTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id)!;
    setTemplateId(id); setSubject(t.subject); setBody(t.body); setEditorKey((k) => k + 1);
  };
  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    setBody(editorRef.current?.innerHTML ?? "");
  };
  const insert = (snippet: string) => {
    if (mode === "html") { setBody((b) => b + snippet); return; }
    exec("insertHTML", snippet);
  };
  const addVar = (v: string) => {
    const el = subjectRef.current;
    const pos = el?.selectionStart ?? subject.length;
    setSubject(subject.slice(0, pos) + `{{${v}}}` + subject.slice(pos));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(finalHtml);
    toast.success("Inlined HTML copied to clipboard");
  };
  const validate = () => {
    if (!to.length) { toast.error("Add at least one recipient"); return false; }
    if (!subject.trim()) { toast.error("Subject line is required"); return false; }
    return true;
  };
  const simulateSend = async (label: string) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    toast.success(label, { description: "Demo mode — connect a provider in Settings to deliver for real." });
  };

  const tools = [
    { icon: Heading1, label: "Heading", run: () => exec("formatBlock", "h2") },
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: Link2, label: "Link", run: () => { const u = prompt("Link URL", "https://"); if (u) exec("createLink", u); } },
    { icon: List, label: "Bullet list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: MousePointerClick, label: "Brand button", run: () => insert(BUTTON_SNIPPET) },
    { icon: MessageSquareQuote, label: "Callout", run: () => insert(CALLOUT_SNIPPET) },
    { icon: Table2, label: "Table", run: () => insert(TABLE_SNIPPET) },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center justify-between bg-gradient-navy px-6 py-4 text-navy-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand"><Mail className="h-5 w-5" /></div>
            <div>
              <p className="text-lg font-extrabold tracking-[0.2em]">SINOVA</p>
              <p className="-mt-1 text-xs text-navy-muted">Mail Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-navy-muted/30 px-3 py-1 text-xs text-navy-muted sm:flex">
              <span className="h-2 w-2 rounded-full bg-success" /> Draft saved locally
            </span>
            <Button variant="ghost" size="icon" className="text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground" onClick={() => setSettingsOpen(true)} aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="grid flex-1 gap-6 p-6 pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* LEFT */}
          <section className="space-y-5">
            <div className="space-y-4 rounded-xl border bg-card p-5">
              <h2 className="text-sm font-bold">Email parameters</h2>
              <TagInput label="Recipients" value={to} onChange={setTo} />
              <button onClick={() => setShowCc(!showCc)} className="flex items-center gap-1 text-xs font-semibold text-primary">
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showCc ? "rotate-180" : ""}`} /> CC / BCC
              </button>
              {showCc && (<div className="grid gap-4 sm:grid-cols-2"><TagInput label="CC" value={cc} onChange={setCc} /><TagInput label="BCC" value={bcc} onChange={setBcc} /></div>)}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject line</Label>
                <Input ref={subjectRef} value={subject} onChange={(e) => setSubject(e.target.value)} />
                <div className="flex flex-wrap gap-1.5">
                  {VARIABLES.map((v) => (
                    <button key={v} onClick={() => addVar(v)} className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[11px] text-primary transition hover:bg-primary/10">{`{{${v}}}`}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sender profile</Label>
                <Select value={senderId} onValueChange={setSenderId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SENDERS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} — {s.email}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-3 text-sm font-bold">Template</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => pickTemplate(t.id)}
                    className={`rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 ${templateId === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""}`}>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
                <div className="flex flex-wrap gap-0.5">
                  {tools.map((t) => (
                    <Tooltip key={t.label}>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={t.run} disabled={mode === "html" && !["Brand button", "Callout", "Table"].includes(t.label)}>
                          <t.icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <div className="flex rounded-md bg-muted p-0.5">
                  {(["visual", "html"] as const).map((m) => (
                    <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition ${mode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
                      {m === "visual" ? <Eye className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}{m === "visual" ? "Visual" : "HTML"}
                    </button>
                  ))}
                </div>
              </div>
              {mode === "visual" ? (
                <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={(e) => setBody(e.currentTarget.innerHTML)}
                  className="prose-sm min-h-80 max-w-none p-5 text-sm leading-relaxed outline-none [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5" />
              ) : (
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} className="min-h-80 rounded-none border-0 bg-navy font-mono text-xs leading-relaxed text-navy-foreground focus-visible:ring-0" />
              )}
            </div>
          </section>

          {/* RIGHT */}
          <section className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex rounded-md bg-muted p-0.5">
                  {([["desktop", Monitor], ["mobile", Smartphone]] as const).map(([d, I]) => (
                    <button key={d} onClick={() => setDevice(d)} className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold capitalize transition ${device === d ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}><I className="h-3.5 w-3.5" />{d}</button>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-2">Sample data <Switch checked={hydrated} onCheckedChange={setHydrated} /></label>
                  <label className="flex items-center gap-2">{dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}<Switch checked={dark} onCheckedChange={setDark} /></label>
                </div>
              </div>
              <div className="border-b bg-muted/40 px-4 py-2.5 text-xs">
                <p><span className="text-muted-foreground">From:</span> {sender.name} &lt;{sender.email}&gt;</p>
                <p className="truncate font-semibold">{hydrated ? hydrate(subject, data) : subject}</p>
              </div>
              <div className="flex justify-center bg-muted/60 p-5">
                <iframe title="Email preview" srcDoc={html}
                  className={`h-[680px] rounded-lg border bg-card shadow-float transition-all duration-300 ${device === "desktop" ? "w-full max-w-[640px]" : "w-[375px]"}`} />
              </div>
            </div>
          </section>
        </main>

        <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-2xl border bg-card/95 p-2 shadow-float backdrop-blur">
            <Button variant="ghost" onClick={copy}><Copy className="h-4 w-4" /> Copy HTML</Button>
            <Button variant="outline" onClick={() => setTestOpen(true)}><FlaskConical className="h-4 w-4" /> Send test</Button>
            <Button className="bg-gradient-brand px-5 font-semibold hover:opacity-90" onClick={() => validate() && setConfirmOpen(true)}><Send className="h-4 w-4" /> Send email</Button>
          </div>
        </div>

        <Dialog open={testOpen} onOpenChange={setTestOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Send a test email</DialogTitle><DialogDescription>Preview exactly how recipients will see it.</DialogDescription></DialogHeader>
            <Input placeholder="you@sinova.com" value={testAddr} onChange={(e) => setTestAddr(e.target.value)} />
            <DialogFooter>
              <Button disabled={sending} onClick={async () => {
                if (!EMAIL_RE.test(testAddr)) { toast.error("Enter a valid test address"); return; }
                await simulateSend(`Test sent to ${testAddr}`); setTestOpen(false);
              }}>{sending && <Loader2 className="h-4 w-4 animate-spin" />} Send test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Confirm send</DialogTitle><DialogDescription>Review before dispatching.</DialogDescription></DialogHeader>
            <div className="space-y-1 rounded-lg bg-muted p-4 text-sm">
              <p><span className="text-muted-foreground">To:</span> {to.join(", ")}</p>
              {cc.length > 0 && <p><span className="text-muted-foreground">CC:</span> {cc.join(", ")}</p>}
              {bcc.length > 0 && <p><span className="text-muted-foreground">BCC:</span> {bcc.join(", ")}</p>}
              <p><span className="text-muted-foreground">Subject:</span> {hydrate(subject, data)}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button className="bg-gradient-brand" disabled={sending} onClick={async () => { await simulateSend(`Email sent to ${to.length} recipient(s)`); setConfirmOpen(false); }}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sending ? "Sending…" : "Send now"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Delivery settings</DialogTitle><DialogDescription>Choose how emails are dispatched.</DialogDescription></DialogHeader>
            <Tabs defaultValue="smtp">
              <TabsList className="grid w-full grid-cols-5">
                {["smtp", "resend", "sendgrid", "gmail", "webhook"].map((p) => <TabsTrigger key={p} value={p} className="text-xs capitalize">{p}</TabsTrigger>)}
              </TabsList>
              <TabsContent value="smtp" className="space-y-3 pt-3">
                <div className="grid grid-cols-3 gap-2"><Input className="col-span-2" placeholder="smtp.sinova.com" /><Input placeholder="587" /></div>
                <Input placeholder="Username" /><Input type="password" placeholder="Password" />
              </TabsContent>
              {["resend", "sendgrid"].map((p) => (
                <TabsContent key={p} value={p} className="space-y-3 pt-3"><Input type="password" placeholder={`${p} API key`} /><Input placeholder="Verified sender domain" /></TabsContent>
              ))}
              <TabsContent value="gmail" className="pt-3"><Button variant="outline" className="w-full"><Mail className="h-4 w-4" /> Connect Google account</Button></TabsContent>
              <TabsContent value="webhook" className="space-y-3 pt-3"><Input placeholder="https://api.sinova.com/email/drafts" /><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Webhook className="h-3.5 w-3.5" /> We'll POST subject, recipients and inlined HTML as JSON.</p></TabsContent>
            </Tabs>
            <DialogFooter><Button onClick={() => { setSettingsOpen(false); toast.success("Settings saved"); }}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
