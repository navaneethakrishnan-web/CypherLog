import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Radio,
  Activity,
  Building2,
  Search,
  ChevronRight,
  CheckCircle2,
  X,
  Link2,
  Lock,
  ShieldOff,
  BellRing,
  Download,
  PlayCircle,
  Check,
  Brain,
  Blocks,
  Database,
  Star,
  Sparkles,
  Loader2,
  Sun,
  Moon,
  CheckSquare,
  Square,
  ArrowUpDown,
  BookOpen,
  Users,
  FileDown,
  UserCog,
  ListFilter,
  MessageSquare,
  ThumbsDown,
  TrendingUp,
  Fingerprint,
  Wifi,
  Monitor,
  Globe,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------------------------------------------------
   BRANCHES — 8 locations, kept simple on purpose
--------------------------------------------------------- */

const BRANCHES = [
  { id: "DEL", name: "Delhi", status: "critical", logsMin: 940, baseline: 320, lastSyncMin: 1, x: 40, y: 18, trend: [22, 30, 41, 58, 74, 91] },
  { id: "MUM", name: "Mumbai", status: "critical", logsMin: 610, baseline: 280, lastSyncMin: 0, x: 24, y: 56, trend: [18, 24, 33, 47, 65, 88] },
  { id: "PUN", name: "Pune", status: "normal", logsMin: 260, baseline: 240, lastSyncMin: 2, x: 29, y: 63, trend: [20, 19, 22, 21, 23, 20] },
  { id: "HYD", name: "Hyderabad", status: "normal", logsMin: 340, baseline: 310, lastSyncMin: 3, x: 41, y: 66, trend: [24, 26, 25, 27, 26, 28] },
  { id: "CHN", name: "Chennai", status: "warning", logsMin: 410, baseline: 260, lastSyncMin: 6, x: 47, y: 89, trend: [21, 25, 30, 38, 44, 52] },
  { id: "CBE", name: "Coimbatore", status: "normal", logsMin: 190, baseline: 180, lastSyncMin: 4, x: 37, y: 95, trend: [17, 18, 16, 19, 18, 19] },
  { id: "BLR", name: "Bangalore", status: "warning", logsMin: 380, baseline: 250, lastSyncMin: 1, x: 37, y: 81, trend: [20, 23, 29, 34, 41, 48] },
  { id: "KOL", name: "Kolkata", status: "normal", logsMin: 300, baseline: 290, lastSyncMin: 18, x: 61, y: 47, trend: [22, 21, 23, 22, 24, 23] },
];

const INDIA_PATH = "M38,4 C48,2 58,4 64,10 L74,14 L80,20 L76,26 L84,30 L80,38 L72,42 L74,52 L66,58 L68,68 L58,76 L54,90 L48,108 L44,116 L40,104 L34,88 L28,74 L22,62 L16,50 L14,38 L20,30 L14,22 L22,16 L30,10 Z";

const HUB = { x: 44, y: 58 };

const LEDGER = { block: "0x4a7f…c391", verifiedSecAgo: 12, nodes: 8 };
function shortHash() {
  const chars = "abcdef0123456789";
  let s = "0x";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s + "…" + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
}
function shortCid() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "Qm";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s + "…" + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
}

const STATUS_LABEL = { normal: "Normal", warning: "Needs attention", critical: "Urgent" };
const STATUS_COLOR = { critical: "var(--red)", warning: "var(--amber)", normal: "var(--accent2)" };

const LOG_SOURCES = ["Firewall", "Login system", "Remote access", "Employee device", "Web proxy", "Email gateway"];
const LOG_TEMPLATES = [
  (b) => `${b} — repeated failed login attempts`,
  (b) => `${b} — device connected to an unrecognized address`,
  (b) => `${b} — traffic matches a known attack pattern`,
  (b) => `${b} — admin access granted outside normal hours`,
  (b) => `${b} — routine check-in, nothing unusual`,
  (b) => `${b} — USB device connected to a company computer`,
  (b) => `${b} — security certificate didn't match what was expected`,
];

const ROLES = {
  analyst: { label: "Analyst", name: "R. Sharma", canAct: true },
  admin: { label: "Admin", name: "K. Verma (Admin)", canAct: true },
  auditor: { label: "Read-only Auditor", name: "Auditor view", canAct: false },
};

const EXPERTS = ["Mumbai Cyber Cell", "Delhi Security Ops", "Bangalore Cyber Cell", "Pune Cyber Cell", "Chennai Security Ops", "Unassigned"];

const THREAT_TAXONOMY = {
  "INC-014": { category: "Credential Compromise", mitre: "TA0006 · Credential Access", playbook: "SOP-014 · Account Compromise Response" },
  "INC-015": { category: "Credential Compromise", mitre: "TA0004 · Privilege Escalation", playbook: "SOP-014 · Account Compromise Response" },
  "INC-016": { category: "Data Exfiltration", mitre: "TA0010 · Exfiltration", playbook: "SOP-021 · Outbound Data Anomaly" },
  "INC-017": { category: "Routine Maintenance", mitre: "—", playbook: "SOP-000 · No action required" },
};

// Mock internal account/device records — pulled from this org's own directory & log store,
// not an external lookup. Real deployment would hit an internal directory/EDR API here.
const FORENSIC_DB = {
  "INC-014": {
    account: "r.iyer@crpf-mumbai.local",
    sourceIp: "192.168.14.208",
    device: "MUM-WKS-0417 · Windows 11",
    mac: "3C:97:0E:9F:2B:11",
    network: "Mumbai HQ · internal VLAN 14",
    priorLogins: [
      { where: "Mumbai HQ, VLAN 14", when: "Yesterday, 09:02" },
      { where: "Mumbai HQ, VLAN 14", when: "2 days ago, 08:55" },
      { where: "Unrecognized device on same VLAN", when: "Today, 10:01" },
    ],
  },
  "INC-015": {
    account: "s.kulkarni@crpf-bangalore.local",
    sourceIp: "10.4.22.117",
    device: "BLR-WKS-0093 · Windows 10",
    mac: "88:66:5A:12:9C:04",
    network: "Bangalore Branch · internal VLAN 6",
    priorLogins: [
      { where: "Bangalore Branch, VLAN 6", when: "Today, 09:40" },
      { where: "Bangalore Branch, VLAN 6", when: "Yesterday, 09:18" },
    ],
  },
  "INC-016": {
    account: "svc-backup-delhi (service account)",
    sourceIp: "10.1.9.44",
    device: "DEL-SRV-0021 · Linux backup host",
    mac: "AC:1F:6B:33:E0:7D",
    network: "Delhi HQ · internal VLAN 1",
    priorLogins: [
      { where: "Delhi HQ, VLAN 1", when: "Every night, 02:00 (scheduled)" },
    ],
  },
  "INC-017": {
    account: "svc-maintenance (service account)",
    sourceIp: "10.9.1.5",
    device: "CHN-SRV-0004 · Linux",
    mac: "F0:9F:C2:88:1A:6E",
    network: "Chennai Branch · internal VLAN 2",
    priorLogins: [{ where: "Chennai Branch, VLAN 2", when: "Weekly, scheduled maintenance window" }],
  },
};

function timeNow() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}
function formatCountdown(ms) {
  if (ms <= 0) return "Overdue";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function makeLogLine(seed) {
  const b = BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
  const source = LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)];
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const roll = Math.random();
  const severity = roll > 0.88 ? "critical" : roll > 0.65 ? "warning" : "normal";
  return { id: seed + "-" + Date.now() + Math.random(), time: timeNow(), source, severity, branch: b.name, text: template(b.name) };
}

/* ---------------------------------------------------------
   ISSUES — already grouped, plain-language stories
--------------------------------------------------------- */

const INCIDENTS = [
  {
    id: "INC-014",
    title: "Possible account compromise",
    branch: "Mumbai",
    ticket: "SX-2024-0692",
    assignedTo: "Mumbai Cyber Cell",
    severity: "high",
    confidence: 91,
    age: "4 min",
    plain: "Someone failed to log in five times, then got in, gave themselves admin access, and opened a sensitive file — all within five minutes.",
    chain: ["Failed login × 5", "Login succeeded", "Got admin access", "Opened a sensitive file"],
    reasons: [
      { text: "Five login attempts failed in a row", evidence: "10:01–10:03 · Login system · Mumbai", weight: 14 },
      { text: "Right after that, a login succeeded", evidence: "10:04 · Login system · Mumbai", weight: 8 },
      { text: "This happened outside normal working hours", evidence: "10:04 · Mumbai", weight: 6 },
      { text: "The account was given admin access immediately after", evidence: "10:05 · Login system · Mumbai", weight: 29 },
      { text: "A sensitive file was opened right after that", evidence: "10:06 · Employee device · Mumbai", weight: 34 },
    ],
    slaLeftMin: 12,
    steps: [
      { step: "Confirm this is really the account holder", why: "The login pattern doesn't match their usual behaviour." },
      { step: "Check the device that was used", why: "It was given admin access it doesn't normally have." },
      { step: "Review exactly which file was opened", why: "It happened right after the suspicious login." },
    ],
    crossMatch: "Bangalore",
    crossMatchSimilarity: 88,
    rawCount: 6,
    recommended: "isolate",
  },
  {
    id: "INC-015",
    title: "Same pattern seen at another branch",
    branch: "Bangalore",
    ticket: "SX-2024-0693",
    assignedTo: "Bangalore Cyber Cell",
    severity: "medium",
    confidence: 74,
    age: "19 min",
    plain: "This branch just showed the same pattern as the Mumbai issue above — failed logins, then a success, then admin access.",
    chain: ["Failed login × 3", "Login succeeded", "Got admin access"],
    reasons: [
      { text: "Three login attempts failed in a row", evidence: "10:22–10:23 · Login system · Bangalore", weight: 20 },
      { text: "Right after that, a login succeeded", evidence: "10:24 · Login system · Bangalore", weight: 16 },
      { text: "The account was given admin access immediately after", evidence: "10:25 · Login system · Bangalore", weight: 38 },
    ],
    slaLeftMin: 41,
    steps: [
      { step: "Confirm this is really the account holder", why: "Same warning signs as the Mumbai issue." },
      { step: "Compare the timing with the Mumbai issue", why: "Worth checking if these are connected." },
    ],
    crossMatch: "Mumbai",
    crossMatchSimilarity: 88,
    rawCount: 3,
    recommended: "notify",
  },
  {
    id: "INC-016",
    title: "Unusual outbound data spike",
    branch: "Delhi",
    ticket: "SX-2024-0687",
    assignedTo: "Delhi Security Ops",
    severity: "medium",
    confidence: 58,
    age: "41 min",
    plain: "One device is sending six times more data than usual, and it's going to an address the system doesn't recognise.",
    chain: ["Data volume jumped", "Sent to an unrecognised address"],
    reasons: [
      { text: "Outgoing data is 6x higher than usual for this device", evidence: "09:40–10:10 · Firewall · Delhi", weight: 33 },
      { text: "The receiving address isn't on the approved list", evidence: "09:41 · Firewall · Delhi", weight: 25 },
    ],
    slaLeftMin: 79,
    steps: [
      { step: "Find out where the data is going", why: "The address isn't recognised yet." },
      { step: "Identify which device sent it", why: "Tells us if this was automatic or someone at the keyboard." },
    ],
    crossMatch: null,
    crossMatchSimilarity: null,
    rawCount: 2,
    recommended: "investigate",
  },
  {
    id: "INC-017",
    title: "Routine certificate renewal — no action needed",
    branch: "Chennai",
    ticket: "SX-2024-0654",
    assignedTo: "Auto-resolved",
    severity: "info",
    confidence: 99,
    age: "1 hr",
    plain: "A scheduled security certificate renewal ran and finished normally. This is expected and doesn't need review.",
    chain: ["Scheduled update started", "Certificate renewed", "Service restarted with no errors"],
    reasons: [{ text: "This matches the planned maintenance schedule", evidence: "09:00 · Chennai", weight: 99 }],
    steps: [{ step: "No action needed", why: "This was an expected, scheduled event." }],
    crossMatch: null,
    crossMatchSimilarity: null,
    rawCount: 3,
    slaLeftMin: null,
  },
];

const ACTIONS = [
  { key: "lock", label: "Lock account", doneLabel: "Account locked", icon: Lock },
  { key: "isolate", label: "Isolate device", doneLabel: "Device isolated", icon: ShieldOff },
  { key: "notify", label: "Notify team", doneLabel: "Team notified", icon: BellRing },
  { key: "export", label: "Export evidence", doneLabel: "Evidence exported", icon: Download },
  { key: "investigate", label: "Start investigation", doneLabel: "Investigation started", icon: PlayCircle },
];

const SEVERITY_LABEL = { high: "Urgent", medium: "Needs review", info: "Info only" };
const SEVERITY_COLOR = { high: "var(--red)", medium: "var(--amber)", info: "var(--accent2)" };

const TREND = [
  { day: "Mon", high: 1, medium: 3, info: 8 },
  { day: "Tue", high: 0, medium: 2, info: 7 },
  { day: "Wed", high: 2, medium: 4, info: 9 },
  { day: "Thu", high: 1, medium: 2, info: 6 },
  { day: "Fri", high: 3, medium: 5, info: 10 },
  { day: "Sat", high: 1, medium: 2, info: 5 },
  { day: "Sun", high: 1, medium: 2, info: 4 },
];

const TOTAL_LOGS = "2.4M";
const BEHAVIOR_PATTERNS = 142;
const CRITICAL_OPEN = 3;
const RESOLVED_TODAY = 18;

const CATEGORIES = [
  { label: "Unauthorized access attempts", pct: 34 },
  { label: "Malware detected", pct: 22 },
  { label: "Repeated failed logins", pct: 18 },
  { label: "Policy violation", pct: 15 },
  { label: "Possible data leak", pct: 11 },
];

const HEATMAP = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  count: Math.floor(Math.pow(Math.random(), 2) * 7),
}));

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [clock, setClock] = useState(timeNow());
  const [nowMs, setNowMs] = useState(Date.now());
  const [feed, setFeed] = useState(() => Array.from({ length: 8 }, (_, i) => makeLogLine(i)));
  const feedRef = useRef(null);
  const [openIncident, setOpenIncident] = useState(null);
  const [activeTab, setActiveTab] = useState("chain");
  const [evidenceOpen, setEvidenceOpen] = useState(null);
  const [actionsTaken, setActionsTaken] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const verifyTimer = useRef(null);
  const [aiState, setAiState] = useState({}); // { [incidentId]: { loading, error, data } }
  const [briefing, setBriefing] = useState({ loading: false, error: null, data: null });
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showLedger, setShowLedger] = useState(false);
  const [cid] = useState(() => shortCid());
  const [slaDeadlines] = useState(() => {
    const map = {};
    INCIDENTS.forEach((i) => {
      if (i.slaLeftMin != null) map[i.id] = Date.now() + i.slaLeftMin * 60000;
    });
    return map;
  });
  const [ledgerBlocks] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      height: 148291 - i,
      hash: shortHash(),
      txs: Math.floor(Math.random() * 40) + 5,
      time: i === 0 ? `${LEDGER.verifiedSecAgo}s ago` : `${(i + 1) * 47}s ago`,
    }))
  );
  const [role, setRole] = useState("analyst");
  const [assignments, setAssignments] = useState({});
  const [notes, setNotes] = useState({});
  const [noteDraft, setNoteDraft] = useState("");
  const [dismissed, setDismissed] = useState({});
  const [verifyResult, setVerifyResult] = useState({});
  const [infoState, setInfoState] = useState({}); // { [incId]: { loading, data } }
  const [showExplorer, setShowExplorer] = useState(false);
  const [explorerBranch, setExplorerBranch] = useState("all");
  const [explorerSeverity, setExplorerSeverity] = useState("all");
  const [explorerQuery, setExplorerQuery] = useState("");
  const [allLogs, setAllLogs] = useState(() => Array.from({ length: 8 }, (_, i) => makeLogLine(i)));
  const [compareA, setCompareA] = useState("Mumbai");
  const [compareB, setCompareB] = useState("Bangalore");

  useEffect(() => {
    const t = setInterval(() => {
      setClock(timeNow());
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenIncident(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      const line = makeLogLine(Date.now());
      setFeed((prev) => [...prev, line].slice(-50));
      setAllLogs((prev) => [...prev, line].slice(-300));
    }, 1700);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [feed]);
  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(verifyTimer.current); }, []);

  const openInc = (inc) => {
    setOpenIncident(inc);
    setActiveTab("chain");
    setEvidenceOpen(null);
  };
  const closeInc = () => setOpenIncident(null);
  const toggleAction = (inc, actionDef) => {
    if (!ROLES[role].canAct) {
      clearTimeout(toastTimer.current);
      setToast({ id: Date.now(), phase: "done", text: `Read-only auditor view — switch role to take action.` });
      toastTimer.current = setTimeout(() => setToast(null), 2600);
      return;
    }
    const key = inc.id + ":" + actionDef.key;
    const willBeDone = !actionsTaken[key]?.done;
    setActionsTaken((prev) => ({ ...prev, [key]: willBeDone ? { done: true, at: timeNow(), by: ROLES[role].name } : { done: false } }));
    if (willBeDone) {
      clearTimeout(toastTimer.current);
      clearTimeout(verifyTimer.current);
      setToast({ id: Date.now(), phase: "verifying", text: `Verifying with ${LEDGER.nodes} network nodes…` });
      verifyTimer.current = setTimeout(() => {
        setToast({ id: Date.now(), phase: "done", text: `${actionDef.doneLabel} for ${inc.branch} · logged to ledger ${shortHash()}` });
        toastTimer.current = setTimeout(() => setToast(null), 3200);
      }, 850);
    }
  };

  const verifyOnChain = (inc) => {
    setVerifyResult((prev) => ({ ...prev, [inc.id]: { hash: shortHash(), block: 148291 - Math.floor(Math.random() * 4), at: timeNow() } }));
  };

  const fetchInfo = (inc) => {
    setInfoState((prev) => ({ ...prev, [inc.id]: { loading: true, data: prev[inc.id]?.data || null } }));
    setTimeout(() => {
      setInfoState((prev) => ({ ...prev, [inc.id]: { loading: false, data: FORENSIC_DB[inc.id] || null } }));
    }, 700);
  };

  const addNote = (inc) => {
    if (!noteDraft.trim()) return;
    setNotes((prev) => ({ ...prev, [inc.id]: [...(prev[inc.id] || []), { text: noteDraft.trim(), by: ROLES[role].name, at: timeNow() }] }));
    setNoteDraft("");
  };

  const toggleDismiss = (inc) => {
    const nowDismissed = !dismissed[inc.id];
    setDismissed((prev) => ({ ...prev, [inc.id]: nowDismissed }));
    clearTimeout(toastTimer.current);
    setToast({
      id: Date.now(),
      phase: "done",
      text: nowDismissed
        ? `Marked as not an issue — future scoring for ${inc.branch} will factor this in.`
        : `Restored to the open issues list.`,
    });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const exportComplianceReport = (inc) => {
    const doneActions = ACTIONS.filter((a) => actionsTaken[inc.id + ":" + a.key]?.done);
    const tax = THREAT_TAXONOMY[inc.id];
    const lines = [
      `COMPLIANCE REPORT — ${inc.ticket}`,
      `Generated ${new Date().toLocaleString("en-IN")}`,
      "=".repeat(50),
      ``,
      `Branch: ${inc.branch}`,
      `Issue: ${inc.title}`,
      `Threat category: ${tax ? tax.category : "Unclassified"}${tax ? " (" + tax.mitre + ")" : ""}`,
      `Assigned to: ${assignments[inc.id] || inc.assignedTo}`,
      `ML risk score: ${inc.confidence}%`,
      ``,
      `SUMMARY`,
      inc.plain,
      ``,
      `EVIDENCE`,
      ...inc.reasons.map((r) => `- ${r.text} (${r.evidence})`),
      ``,
      `ACTIONS TAKEN (chain of custody)`,
      ...(doneActions.length
        ? doneActions.map((a) => {
            const rec = actionsTaken[inc.id + ":" + a.key];
            return `- ${a.doneLabel} · by ${rec.by || "—"} · ${rec.at} · ledger hash ${shortHash()}`;
          })
        : ["- No actions taken yet"]),
      ``,
      `NOTES`,
      ...((notes[inc.id] || []).length ? notes[inc.id].map((n) => `- ${n.at} · ${n.by}: ${n.text}`) : ["- No notes"]),
      ``,
      `Evidence bundle IPFS CID: ${cid}`,
      `This report is generated from a tamper-evident, blockchain-anchored log store.`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inc.ticket}-compliance-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const analyzeWithAI = async (inc) => {
    setAiState((prev) => ({ ...prev, [inc.id]: { loading: true, error: null, data: prev[inc.id]?.data || null } }));

    const actionList = ACTIONS.map((a) => `"${a.key}" (${a.label})`).join(", ");
    const prompt = `You are a SOC analyst assistant reviewing a flagged security issue at a branch office. Here is the evidence gathered so far:

Title: ${inc.title}
Branch: ${inc.branch}
Current ML risk score: ${inc.confidence}%
Behavior chain (in order): ${inc.chain.join(" -> ")}
Why it was flagged:
${inc.reasons.map((r) => `- ${r.text} (${r.evidence})`).join("\n")}
${inc.crossMatch ? `A similar pattern (${inc.crossMatchSimilarity}% similarity) was also seen at: ${inc.crossMatch}` : "No similar pattern was found at other branches."}

Based only on this evidence, respond with ONLY a raw JSON object (no markdown fences, no extra text) with exactly these fields:
{
  "summary": "2-3 plain-English sentences on what likely happened and why it matters, written for a non-technical branch manager",
  "risk_assessment": "one short sentence on how urgent/confident this looks",
  "false_positive_likelihood": "a short phrase like 'low', 'moderate', or 'roughly 20%' on how likely this is a false alarm",
  "recommended_action": one of ${actionList} — pick the single best first move,
  "reasoning": "1-2 sentences on why that action should happen first"
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || [])
        .map((block) => (block.type === "text" ? block.text : ""))
        .filter(Boolean)
        .join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiState((prev) => ({ ...prev, [inc.id]: { loading: false, error: null, data: parsed } }));
    } catch (err) {
      setAiState((prev) => ({ ...prev, [inc.id]: { loading: false, error: "Couldn't get an AI read on this — try again.", data: prev[inc.id]?.data || null } }));
    }
  };

  const generateBriefing = async () => {
    setBriefing((prev) => ({ loading: true, error: null, data: prev.data }));
    const prompt = `You are a SOC lead giving a 60-second spoken briefing to a manager who just walked in. Here are today's open issues:
${INCIDENTS.map((i) => `- [${i.severity}] ${i.branch}: ${i.title} — ${i.plain} (risk ${i.confidence}%)`).join("\n")}

Write a short, plain-English briefing in 3-4 sentences covering what needs attention first and anything connected across branches. Plain flowing prose only — no markdown, no bullet points, no JSON.`;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || [])
        .map((block) => (block.type === "text" ? block.text : ""))
        .filter(Boolean)
        .join("\n")
        .trim();
      setBriefing({ loading: false, error: null, data: text });
    } catch (err) {
      setBriefing((prev) => ({ loading: false, error: "Couldn't generate the briefing — try again.", data: prev.data }));
    }
  };

  const highCount = INCIDENTS.filter((i) => i.severity === "high").length;
  const rawTotal = INCIDENTS.reduce((s, i) => s + i.rawCount, 0);

  const filteredIncidents = INCIDENTS.filter((i) => severityFilter === "all" ? !dismissed[i.id] : severityFilter === "dismissed" ? dismissed[i.id] : i.severity === severityFilter && !dismissed[i.id])
    .filter((i) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return i.branch.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.plain.toLowerCase().includes(q);
    })
    .sort((a, b) => (sortBy === "risk" ? b.confidence - a.confidence : 0));

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const bulkNotify = () => {
    if (!ROLES[role].canAct) {
      setToast({ id: Date.now(), phase: "done", text: `Read-only auditor view — switch role to take action.` });
      toastTimer.current = setTimeout(() => setToast(null), 2600);
      return;
    }
    const targets = INCIDENTS.filter((i) => selectedIds.includes(i.id));
    setActionsTaken((prev) => {
      const next = { ...prev };
      targets.forEach((inc) => {
        next[inc.id + ":notify"] = { done: true, at: timeNow(), by: ROLES[role].name };
      });
      return next;
    });
    clearTimeout(toastTimer.current);
    clearTimeout(verifyTimer.current);
    setToast({ id: Date.now(), phase: "done", text: `Notified team for ${targets.length} issue${targets.length === 1 ? "" : "s"} · logged to ledger ${shortHash()}` });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
    setSelectedIds([]);
  };

  return (
    <div className={"sx" + (theme === "light" ? " light" : "")}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .sx {
          --bg: #0A0E16;
          --glass: rgba(255,255,255,0.045);
          --glass-hover: rgba(255,255,255,0.07);
          --border: rgba(255,255,255,0.09);
          --text: #EDEFF7; --muted: #8A93AC;
          --accent: #7C5CFF; --accent2: #4FD8E8;
          --amber: #F5A94E; --red: #FF6B81;
          background:
            radial-gradient(ellipse 900px 500px at 8% -5%, rgba(124,92,255,0.16), transparent 60%),
            radial-gradient(ellipse 700px 500px at 100% 10%, rgba(79,216,232,0.10), transparent 55%),
            var(--bg);
          color: var(--text); font-family: 'Inter', sans-serif;
          min-height: 100vh; padding: 22px; box-sizing: border-box; position: relative;
        }
        .sx * { box-sizing: border-box; }
        .sx ::-webkit-scrollbar { width: 6px; height: 6px; }
        .sx ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .display { font-family: 'Manrope', sans-serif; }

        .topbar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: linear-gradient(135deg, var(--accent), var(--accent2)); }
        .brand-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
        .brand-sub { font-size: 11.5px; color: var(--muted); margin-top: 1px; }
        .topbar-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .search-box { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 9px; padding: 8px 12px; background: var(--glass); width: 220px; }
        .search-box input { background: transparent; border: none; outline: none; color: var(--text); font-size: 12px; width: 100%; font-family: 'Inter', sans-serif; }
        .search-box input::placeholder { color: var(--muted); }
        .clock { font-size: 13px; color: var(--muted); }

        .legend { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; font-size: 12px; color: var(--muted); }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

        .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 18px; }
        .kpi-card { background: var(--glass); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; transition: background 0.15s, border-color 0.15s; }
        .kpi-card:hover { background: var(--glass-hover); }
        .kpi-label { font-size: 10.5px; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 9px; font-weight: 500; }
        .kpi-value { font-size: 26px; font-weight: 800; font-family: 'Manrope', sans-serif; }
        .kpi-delta { font-size: 11.5px; color: var(--accent2); margin-top: 5px; }

        .grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; margin-bottom: 14px; }
        .panel { background: var(--glass); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; }
        .panel-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 4px; }
        .panel-title { font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; }
        .panel-note { font-size: 11.5px; color: var(--muted); margin-bottom: 12px; line-height: 1.5; }

        .radar-wrap { position: relative; width: 100%; height: 230px; }
        .radar-svg { width: 100%; height: 100%; }
        .flow-line { stroke-dasharray: 3 4; animation: flow 1.4s linear infinite; }
        @keyframes flow { to { stroke-dashoffset: -14; } }
        .hub-ring { animation: hubpulse 2.6s ease-out infinite; transform-origin: center; }
        @keyframes hubpulse { 0%{r:6;opacity:0.7} 100%{r:22;opacity:0} }
        .node-name { font-family: 'JetBrains Mono', monospace; font-size: 6px; fill: var(--muted); }
        .pin-pulse { animation: pinpulse 1.8s ease-out infinite; transform-origin: center; }
        @keyframes pinpulse { 0%{ r:2.6; opacity:0.9 } 100%{ r:7; opacity:0 } }
        .map-zoom { position: absolute; top: 8px; right: 8px; display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; background: var(--glass); }
        .map-zoom button { width: 24px; height: 22px; background: none; border: none; border-bottom: 1px solid var(--border); color: var(--muted); font-size: 13px; cursor: pointer; line-height: 1; }
        .map-zoom button:last-child { border-bottom: none; }
        .map-zoom button:hover { color: var(--text); background: var(--glass-hover); }

        .feed-label { font-size: 11px; color: var(--muted); margin: 10px 0 6px; border-top: 1px solid var(--border); padding-top: 12px; font-weight: 500; }
        .feed { flex: 1; overflow-y: auto; font-size: 11.5px; line-height: 1.9; max-height: 110px; }
        .feed-line { display: flex; gap: 8px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .feed-time { color: #4A5470; flex-shrink: 0; }
        .feed-tag { flex-shrink: 0; padding: 0 6px; border-radius: 4px; font-size: 10px; }
        .feed-tag.critical { background: rgba(255,107,129,0.14); color: var(--red); }
        .feed-tag.warning { background: rgba(245,169,78,0.14); color: var(--amber); }
        .feed-tag.normal { background: rgba(79,216,232,0.12); color: var(--accent2); }

        .inc-list { display: flex; flex-direction: column; gap: 9px; overflow-y: auto; }
        .inc-item { border: 1px solid var(--border); border-left: 3px solid var(--border); border-radius: 12px; padding: 13px 15px; cursor: pointer; transition: border-color 0.15s, background 0.15s; background: rgba(255,255,255,0.015); }
        .inc-item:hover { background: var(--glass-hover); }
        .inc-item.high { border-left-color: var(--red); }
        .inc-item.medium { border-left-color: var(--amber); }
        .inc-item.info { border-left-color: var(--accent2); }
        .inc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .inc-branch { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); }
        .inc-age { font-size: 10px; color: var(--muted); }
        .inc-title { font-size: 13.5px; font-weight: 600; margin-bottom: 4px; }
        .inc-plain { font-size: 11.5px; color: var(--muted); line-height: 1.5; margin-bottom: 9px; }
        .inc-bottom { display: flex; justify-content: space-between; align-items: center; }
        .inc-raw { font-size: 10.5px; color: var(--muted); }
        .cross-tag { display: flex; align-items: center; gap: 4px; font-size: 10.5px; color: var(--amber); margin-top: 8px; }
        .sev-badge { font-size: 10px; padding: 3px 9px; border-radius: 20px; font-weight: 600; }

        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cat-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 12px; }
        .cat-label { width: 200px; color: var(--muted); flex-shrink: 0; }
        .cat-bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .cat-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 3px; }
        .cat-pct { width: 32px; text-align: right; font-family: 'JetBrains Mono', monospace; }

        table.branches { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        table.branches th { text-align: left; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; padding: 0 8px 10px 8px; border-bottom: 1px solid var(--border); }
        table.branches td { padding: 11px 8px; border-bottom: 1px solid var(--border); }
        table.branches tr:last-child td { border-bottom: none; }
        table.branches tr:hover td { background: rgba(255,255,255,0.02); }

        .heatmap-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; margin-top: 8px; }
        .heat-cell { width: 100%; aspect-ratio: 1; border-radius: 3px; cursor: pointer; }
        .heatmap-legend { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 10px; color: var(--muted); }
        .heatmap-legend .heat-cell { width: 12px; height: 12px; flex-shrink: 0; cursor: default; }

        .compare-selects { display: flex; align-items: center; gap: 10px; margin: 10px 0 14px; font-size: 12px; color: var(--muted); }
        .compare-selects select { background: var(--glass); border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; color: var(--text); font-size: 12px; font-family: 'Inter', sans-serif; flex: 1; }
        .compare-selects select option { background: #0D1220; color: #EDEFF7; }
        .u-status { display: flex; align-items: center; gap: 7px; }
        .u-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        .footer-note { margin-top: 16px; font-size: 11px; color: #4A5470; text-align: center; }

        .overlay { position: fixed; inset: 0; background: rgba(4,6,10,0.65); backdrop-filter: blur(2px); z-index: 50; display: flex; justify-content: flex-end; }
        .drawer { width: 440px; max-width: 92vw; height: 100%; background: #0D1220; border-left: 1px solid var(--border); overflow-y: auto; padding: 24px; animation: slidein 0.22s ease-out; }
        @keyframes slidein { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .drawer-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .drawer-close { cursor: pointer; color: var(--muted); }
        .drawer-ticket { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--muted); margin-top: 2px; }
        .drawer-title { font-size: 18px; font-weight: 700; margin-top: 8px; font-family: 'Manrope', sans-serif; }
        .drawer-plain { font-size: 12.5px; color: var(--muted); line-height: 1.6; margin-top: 8px; }
        .drawer-assign { font-size: 11.5px; color: var(--accent2); margin-top: 8px; }

        .dismissed-tag { font-size: 10px; font-weight: 700; color: var(--muted); background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 20px; margin-left: 8px; vertical-align: middle; }

        .tax-row { display: flex; gap: 6px; margin-top: 9px; flex-wrap: wrap; }
        .tax-chip { display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; color: var(--accent); background: rgba(124,92,255,0.12); padding: 3px 9px; border-radius: 20px; }
        .tax-chip.ghost { color: var(--muted); background: rgba(255,255,255,0.05); font-weight: 500; }

        .assign-row { display: flex; align-items: center; gap: 9px; margin-top: 12px; font-size: 11.5px; color: var(--muted); }
        .assign-row select { background: var(--glass); border: 1px solid var(--border); border-radius: 7px; padding: 5px 8px; color: var(--text); font-size: 11.5px; font-family: 'Inter', sans-serif; flex: 1; }
        .assign-row select option { background: #0D1220; color: #EDEFF7; }
        .assign-row select:disabled { opacity: 0.5; cursor: not-allowed; }

        .playbook-row { font-size: 11px; color: var(--muted); margin-top: 9px; display: flex; align-items: center; gap: 6px; }

        .drawer-toolbar { display: flex; gap: 7px; margin-top: 14px; flex-wrap: wrap; }
        .tool-btn { display: flex; align-items: center; gap: 5px; background: var(--glass); border: 1px solid var(--border); border-radius: 7px; padding: 6px 10px; font-size: 10.5px; color: var(--muted); cursor: pointer; font-family: 'Inter', sans-serif; }
        .tool-btn:hover { color: var(--text); border-color: rgba(124,92,255,0.4); }
        .tool-btn.active { color: var(--red); border-color: rgba(255,107,129,0.4); background: rgba(255,107,129,0.08); }

        .verify-result { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: var(--accent2); margin-top: 9px; font-family: 'JetBrains Mono', monospace; word-break: break-all; }

        .conf-row { display: flex; align-items: center; justify-content: space-between; margin: 16px 0 4px; font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .conf-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; margin-bottom: 18px; }
        .conf-fill { height: 100%; border-radius: 3px; }

        .tab-bar { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
        .tab-btn { background: none; border: none; padding: 9px 4px; margin-right: 14px; font-size: 12.5px; font-weight: 600; color: var(--muted); cursor: pointer; position: relative; font-family: 'Inter', sans-serif; }
        .tab-btn.active { color: var(--accent2); }
        .tab-btn.active::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; }

        .section-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 6px 0 9px; font-weight: 600; }

        .chainviz { display: flex; flex-direction: column; margin: 8px 0 4px; }
        .cnode { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; background: rgba(255,255,255,0.03); }
        .cline { width: 1px; height: 16px; background: var(--border); margin-left: 18px; }

        .why-list { display: flex; flex-direction: column; gap: 6px; }
        .why-item { font-size: 12.5px; color: var(--muted); display: flex; gap: 8px; padding: 9px 11px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; }
        .why-item:hover { border-color: var(--border); background: rgba(255,255,255,0.03); }
        .why-ev { margin: 4px 0 4px 22px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #59647F; }

        .steps-block { margin-top: 20px; }
        .steps-block .step { display: flex; gap: 10px; padding: 11px 0; border-top: 1px solid var(--border); }
        .steps-block .step:first-child { border-top: none; }
        .step-num { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--accent2); flex-shrink: 0; width: 20px; }
        .step-title { font-size: 13px; font-weight: 600; }
        .step-why { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

        .cross-empty { font-size: 12.5px; color: var(--muted); line-height: 1.6; padding: 16px 0; }
        .cross-card { border: 1px solid var(--border); border-radius: 12px; padding: 16px; background: rgba(255,255,255,0.025); }
        .cross-card-note { font-size: 11.5px; color: var(--muted); line-height: 1.5; margin-bottom: 14px; }
        .cross-compare { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; }
        .cross-node { text-align: center; }
        .cross-node .name { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); margin-bottom: 4px; }
        .cross-node .label { font-size: 13px; font-weight: 600; }
        .cross-sim { text-align: center; }
        .cross-sim .pct { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: var(--accent2); }
        .cross-sim .lbl { font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }
        .cross-hint { font-size: 11px; color: var(--muted); margin-top: 14px; line-height: 1.5; }

        .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 16px 10px; border: 1px solid var(--border); border-radius: 12px; background: rgba(255,255,255,0.025); cursor: pointer; transition: border-color 0.15s, background 0.15s; color: var(--text); font-size: 11.5px; font-weight: 600; font-family: 'Inter', sans-serif; }
        .action-btn:hover { border-color: rgba(124,92,255,0.4); background: rgba(124,92,255,0.06); }
        .action-btn.done { border-color: rgba(62,213,152,0.5); background: rgba(62,213,152,0.08); color: var(--accent-green, #3ED598); }
        .action-btn .a-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); }
        .action-btn.done .a-icon { background: rgba(62,213,152,0.15); }
        .action-btn.recommended { border-color: rgba(255,107,129,0.55); background: rgba(255,107,129,0.06); position: relative; }
        .action-btn.recommended .a-icon { background: rgba(255,107,129,0.15); }
        .a-rec { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 3px; background: var(--red); color: #0A0E16; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; white-space: nowrap; }
        .ledger-note { margin-top: 16px; font-size: 11px; color: var(--muted); line-height: 1.6; padding-top: 14px; border-top: 1px solid var(--border); }

        .get-info-btn { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: rgba(79,216,232,0.05); border: 1px solid rgba(79,216,232,0.25); border-radius: 10px; padding: 11px 14px; cursor: pointer; font-family: 'Inter', sans-serif; }
        .get-info-btn:hover { background: rgba(79,216,232,0.09); }
        .get-info-btn:disabled { cursor: default; opacity: 0.8; }
        .get-info-btn .a-icon { background: rgba(79,216,232,0.14); color: var(--accent2); flex-shrink: 0; }
        .get-info-title { font-size: 12.5px; font-weight: 700; color: var(--text); }
        .get-info-sub { font-size: 10.5px; color: var(--muted); margin-top: 2px; }

        .info-panel { margin-top: 10px; border: 1px solid var(--border); border-radius: 10px; padding: 13px 14px; background: rgba(255,255,255,0.02); }
        .info-source-note { font-size: 10px; color: var(--muted); font-style: italic; margin-bottom: 10px; }
        .info-row { display: flex; align-items: center; gap: 9px; font-size: 11.5px; color: var(--muted); padding: 6px 0; border-top: 1px solid var(--border); }
        .info-row:first-of-type { border-top: none; }
        .info-row span { width: 78px; flex-shrink: 0; }
        .info-row strong { color: var(--text); font-weight: 600; font-size: 11.5px; word-break: break-all; }
        .info-logins-label { font-size: 10.5px; color: var(--muted); margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.04em; }
        .info-login-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text); padding: 6px 0; }
        .info-login-row .tl-time { margin-left: auto; }

        .toast { position: fixed; bottom: 22px; right: 22px; z-index: 60; background: #101728; border: 1px solid rgba(62,213,152,0.4); border-left: 3px solid #3ED598; border-radius: 10px; padding: 12px 16px; font-size: 12.5px; display: flex; align-items: center; gap: 9px; max-width: 340px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); animation: toastin 0.2s ease-out; }
        @keyframes toastin { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .trust-strip { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; font-size: 11.5px; color: var(--muted); background: var(--glass); border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; margin-bottom: 16px; }
        .trust-item { display: flex; align-items: center; gap: 7px; }
        .trust-sep { width: 1px; height: 14px; background: var(--border); }

        .ai-risk { display: flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 20px; background: rgba(124,92,255,0.12); color: var(--accent); }

        .ai-box { margin-top: 16px; border: 1px solid rgba(124,92,255,0.28); border-radius: 12px; padding: 14px 15px; background: linear-gradient(135deg, rgba(124,92,255,0.07), rgba(79,216,232,0.04)); }
        .ai-box-head { display: flex; align-items: center; justify-content: space-between; }
        .ai-box-title { font-size: 12.5px; font-weight: 700; display: flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; }
        .ai-run-btn { display: flex; align-items: center; gap: 6px; background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 6px 12px; font-size: 11.5px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 0.15s; }
        .ai-run-btn:hover { opacity: 0.85; }
        .ai-run-btn:disabled { opacity: 0.6; cursor: default; }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ai-empty { font-size: 11.5px; color: var(--muted); line-height: 1.5; margin-top: 10px; }
        .ai-error { font-size: 11.5px; color: var(--red); margin-top: 10px; }
        .ai-summary { font-size: 12.5px; color: var(--text); line-height: 1.6; margin-top: 11px; }
        .ai-risk-line { font-size: 11.5px; color: var(--accent2); margin-top: 9px; display: flex; align-items: center; }
        .ai-suggest { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); margin-top: 11px; padding-top: 11px; border-top: 1px solid rgba(124,92,255,0.2); }
        .ai-suggest strong { color: var(--text); font-size: 12.5px; }
        .ai-reasoning { font-size: 11.5px; color: var(--muted); line-height: 1.5; margin-top: 5px; }
        .ai-tag-note { font-size: 11px; color: var(--accent); margin-bottom: 10px; display: flex; align-items: center; }

        .theme-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--glass); color: var(--text); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s; }
        .theme-btn:hover { background: var(--glass-hover); }

        .explorer-btn { display: flex; align-items: center; gap: 6px; background: var(--glass); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; font-size: 11.5px; color: var(--text); cursor: pointer; font-family: 'Inter', sans-serif; }
        .explorer-btn:hover { background: var(--glass-hover); }

        .role-select { display: flex; align-items: center; gap: 6px; border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; background: var(--glass); }
        .role-select select { background: transparent; border: none; outline: none; color: var(--text); font-size: 11.5px; font-family: 'Inter', sans-serif; cursor: pointer; }
        .role-select select option { background: #0D1220; color: #EDEFF7; }

        .role-note { font-size: 10.5px; color: var(--muted); margin: -10px 0 16px; }
        .role-note strong { color: var(--accent2); }

        .health-strip { display: flex; gap: 22px; flex-wrap: wrap; font-size: 11.5px; color: var(--muted); margin-bottom: 18px; }
        .health-item { display: flex; align-items: center; gap: 6px; }
        .health-item strong { color: var(--text); }

        .briefing-box { margin-bottom: 16px; border: 1px solid rgba(124,92,255,0.28); border-radius: 12px; padding: 14px 16px; background: linear-gradient(135deg, rgba(124,92,255,0.07), rgba(79,216,232,0.04)); }
        .briefing-head { display: flex; align-items: center; justify-content: space-between; }

        .sort-btn { display: flex; align-items: center; gap: 5px; background: none; border: 1px solid var(--border); border-radius: 20px; padding: 4px 10px; font-size: 10.5px; color: var(--muted); cursor: pointer; font-family: 'Inter', sans-serif; }
        .sort-btn:hover { border-color: rgba(124,92,255,0.4); color: var(--text); }

        .filter-chips { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
        .chip { background: var(--glass); border: 1px solid var(--border); color: var(--muted); font-size: 11px; padding: 5px 11px; border-radius: 20px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .chip:hover { color: var(--text); }
        .chip.active { background: rgba(124,92,255,0.15); border-color: rgba(124,92,255,0.5); color: var(--text); font-weight: 600; }

        .bulk-bar { display: flex; align-items: center; justify-content: space-between; background: rgba(124,92,255,0.09); border: 1px solid rgba(124,92,255,0.3); border-radius: 10px; padding: 8px 12px; margin-bottom: 12px; font-size: 12px; }
        .bulk-actions { display: flex; gap: 8px; }
        .bulk-btn { display: flex; align-items: center; gap: 5px; background: var(--accent); color: #fff; border: none; border-radius: 7px; padding: 5px 10px; font-size: 11px; font-weight: 600; cursor: pointer; }
        .bulk-btn.ghost { background: none; border: 1px solid var(--border); color: var(--muted); }

        .inc-check { display: flex; cursor: pointer; }
        .sla-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; color: var(--muted); margin-top: 8px; font-family: 'JetBrains Mono', monospace; }
        .sla-badge.urgent { color: var(--red); animation: slapulse 1.4s ease-in-out infinite; }
        @keyframes slapulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

        .why-weight { font-size: 10px; color: var(--accent2); flex-shrink: 0; margin-left: auto; padding-left: 10px; }
        .fp-line { font-size: 11.5px; color: var(--amber); margin-top: 9px; display: flex; align-items: center; }

        .timeline { display: flex; flex-direction: column; }
        .tl-row { display: flex; align-items: center; gap: 9px; padding: 8px 0; border-top: 1px solid var(--border); font-size: 12px; }
        .tl-row:first-child { border-top: none; }
        .tl-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
        .tl-label { flex: 1; color: var(--text); }
        .tl-time { color: var(--muted); font-size: 10.5px; }
        .tl-by { color: var(--muted); }

        .notes-list { display: flex; flex-direction: column; gap: 10px; }
        .note-row { border: 1px solid var(--border); border-radius: 9px; padding: 9px 11px; background: rgba(255,255,255,0.02); }
        .note-head { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: var(--accent2); font-weight: 600; }
        .note-head .tl-time { margin-left: auto; }
        .note-text { font-size: 12px; color: var(--text); margin-top: 5px; line-height: 1.5; }
        .note-compose { display: flex; gap: 8px; margin-top: 10px; }
        .note-compose input { flex: 1; background: var(--glass); border: 1px solid var(--border); border-radius: 8px; padding: 8px 11px; color: var(--text); font-size: 12px; outline: none; font-family: 'Inter', sans-serif; }
        .note-compose button { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 8px 14px; font-size: 11.5px; font-weight: 600; cursor: pointer; }

        .trust-clickable { cursor: pointer; }
        .trust-clickable:hover { color: var(--text); }
        .cid-line { font-size: 10.5px; color: var(--muted); margin-top: 8px; font-family: 'JetBrains Mono', monospace; }

        .ledger-overlay { position: fixed; inset: 0; background: rgba(4,6,10,0.65); backdrop-filter: blur(2px); z-index: 55; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .ledger-modal { width: 460px; max-width: 100%; max-height: 80vh; overflow-y: auto; background: #0D1220; border: 1px solid var(--border); border-radius: 16px; padding: 22px; animation: slidein 0.18s ease-out; }
        .ledger-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .ledger-modal-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; }
        .ledger-modal-note { font-size: 11.5px; color: var(--muted); margin: 6px 0 16px; line-height: 1.5; }
        .block-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid var(--border); font-size: 11.5px; }
        .block-row:first-child { border-top: none; }
        .block-height { font-family: 'JetBrains Mono', monospace; color: var(--accent2); width: 62px; flex-shrink: 0; }
        .block-hash { font-family: 'JetBrains Mono', monospace; color: var(--text); flex: 1; }
        .block-txs { color: var(--muted); width: 54px; flex-shrink: 0; }
        .block-time { color: var(--muted); width: 60px; text-align: right; flex-shrink: 0; }

        .explorer-modal { width: 620px; }
        .explorer-filters { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
        .explorer-filters input { flex: 1; min-width: 160px; background: var(--glass); border: 1px solid var(--border); border-radius: 8px; padding: 8px 11px; color: var(--text); font-size: 12px; outline: none; font-family: 'Inter', sans-serif; }
        .explorer-filters select { background: var(--glass); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; color: var(--text); font-size: 12px; font-family: 'Inter', sans-serif; }
        .explorer-filters select option { background: #0D1220; color: #EDEFF7; }
        .explorer-list { max-height: 360px; overflow-y: auto; display: flex; flex-direction: column; gap: 3px; }
        .explorer-row { padding: 7px 4px; border-bottom: 1px solid var(--border); }
        .explorer-branch { font-size: 10.5px; color: var(--accent); background: rgba(124,92,255,0.1); padding: 2px 7px; border-radius: 20px; flex-shrink: 0; }

        .sx.light {
          --bg: #F3F5FB;
          --glass: rgba(10,14,30,0.035);
          --glass-hover: rgba(10,14,30,0.06);
          --border: rgba(10,14,30,0.10);
          --text: #12141F; --muted: #5B6478;
        }
        .sx.light .drawer, .sx.light .ledger-modal { background: #FFFFFF; }
        .sx.light .toast { background: #FFFFFF; }
        .sx.light .cnode, .sx.light .action-btn, .sx.light .a-icon { background: rgba(10,14,30,0.04); }
        .sx.light .node-name { fill: var(--muted); }

        @media (max-width: 860px) {
          .grid, .bottom-grid { grid-template-columns: 1fr; }
          .kpi-row { grid-template-columns: repeat(2,1fr); }
          .search-box { display: none; }
          .drawer { width: 100vw; }
          .cat-label { width: 140px; }
        }
      `}</style>

      <div className="topbar">
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={17} color="#0A0E16" /></div>
          <div>
            <div className="brand-title display">CypherLog</div>
            <div className="brand-sub">Security monitoring across all branches</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="search-box">
            <Search size={13} color="var(--muted)" />
            <input placeholder="Search a branch or issue…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button className="explorer-btn" onClick={() => setShowExplorer(true)}>
            <ListFilter size={12} /> Log explorer
          </button>
          <div className="role-select">
            <UserCog size={13} color="var(--muted)" />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {Object.entries(ROLES).map(([k, r]) => (
                <option key={k} value={k}>{r.label}</option>
              ))}
            </select>
          </div>
          <button className="theme-btn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} title="Toggle theme">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <div className="clock mono">{clock} IST</div>
        </div>
      </div>
      <div className="role-note">Signed in as <strong>{ROLES[role].name}</strong>{!ROLES[role].canAct && " · read-only, cannot take actions"}</div>

      <div className="legend">
        <span>Status:</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "var(--accent2)" }} />Normal</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "var(--amber)" }} />Needs attention</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "var(--red)" }} />Urgent</span>
      </div>

      <div className="trust-strip">
        <div className="trust-item trust-clickable" onClick={() => setShowLedger(true)}>
          <Blocks size={13} color="var(--accent2)" /> Logs anchored on private blockchain · block {LEDGER.block} verified {LEDGER.verifiedSecAgo}s ago
        </div>
        <div className="trust-sep" />
        <div className="trust-item"><Database size={13} color="var(--accent2)" /> Off-chain evidence stored on IPFS · content-addressed, tamper-evident</div>
        <div className="trust-sep" />
        <div className="trust-item"><Brain size={13} color="var(--accent)" /> Risk scores generated by the ML model, not raw log rules</div>
      </div>

      <div className="briefing-box">
        <div className="briefing-head">
          <span className="ai-box-title"><Sparkles size={13} color="var(--accent)" /> Today's AI briefing</span>
          <button className="ai-run-btn" onClick={generateBriefing} disabled={briefing.loading}>
            {briefing.loading ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />}
            {briefing.loading ? "Generating…" : briefing.data ? "Refresh" : "Generate"}
          </button>
        </div>
        {!briefing.data && !briefing.loading && !briefing.error && (
          <div className="ai-empty">A 60-second read on everything open right now, generated from today's incidents.</div>
        )}
        {briefing.error && <div className="ai-error">{briefing.error}</div>}
        {briefing.data && <div className="ai-summary">{briefing.data}</div>}
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total logs analyzed</div>
          <div className="kpi-value">{TOTAL_LOGS}</div>
          <div className="kpi-delta">across {BRANCHES.length} branches</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Behavior patterns learned</div>
          <div className="kpi-value mono">{BEHAVIOR_PATTERNS}</div>
          <div className="kpi-delta">grouped into {INCIDENTS.length} open issues</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Critical alerts open</div>
          <div className="kpi-value mono" style={{ color: "var(--red)" }}>{CRITICAL_OPEN}</div>
          <div className="kpi-delta" style={{ color: "var(--amber)" }}>{highCount} marked urgent right now</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Resolved today</div>
          <div className="kpi-value mono" style={{ color: "var(--accent2)" }}>{RESOLVED_TODAY}</div>
          <div className="kpi-delta">avg. 4.2 min to detect</div>
        </div>
      </div>

      <div className="health-strip">
        <div className="health-item"><Activity size={12} color="var(--accent2)" /> Log ingestion: <strong className="mono">12.4k/min</strong></div>
        <div className="health-item"><ShieldCheck size={12} color="var(--accent2)" /> System uptime: <strong className="mono">99.98%</strong></div>
        <div className="health-item"><Radio size={12} color="var(--accent2)" /> Branches synced: <strong className="mono">{BRANCHES.filter((b) => b.lastSyncMin <= 5).length}/{BRANCHES.length}</strong></div>
        <div className="health-item"><Users size={12} color="var(--accent2)" /> Analysts online: <strong className="mono">4</strong></div>
      </div>

      <div className="grid">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Radio size={13} color="var(--accent2)" /> Branch network</div>
          </div>
          <div className="panel-note">Map of India — every pin is a branch. Lines show its logs flowing into the central store, live.</div>
          <div className="radar-wrap">
            <svg className="radar-svg" viewBox="0 0 100 120">
              <defs>
                <linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#4FD8E8" />
                </linearGradient>
                <radialGradient id="terrainGrad" cx="45%" cy="35%" r="75%">
                  <stop offset="0%" stopColor="rgba(124,92,255,0.10)" />
                  <stop offset="55%" stopColor="rgba(79,216,232,0.05)" />
                  <stop offset="100%" stopColor="rgba(10,14,22,0)" />
                </radialGradient>
                <clipPath id="indiaClip"><path d={INDIA_PATH} /></clipPath>
              </defs>

              {/* faux basemap graticule */}
              <g opacity="0.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <line key={"gx" + i} x1={i * 9} y1="0" x2={i * 9} y2="120" stroke="var(--border)" strokeWidth="0.15" />
                ))}
                {Array.from({ length: 13 }, (_, i) => (
                  <line key={"gy" + i} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="var(--border)" strokeWidth="0.15" />
                ))}
              </g>

              <path d={INDIA_PATH} fill="url(#terrainGrad)" stroke="rgba(124,92,255,0.35)" strokeWidth="0.8" />
              <g clipPath="url(#indiaClip)" opacity="0.35">
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={"tx" + i} x1={i * 11} y1="0" x2={i * 11 + 20} y2="120" stroke="rgba(124,92,255,0.12)" strokeWidth="0.4" />
                ))}
              </g>

              {BRANCHES.map((b) => (
                <line key={"l" + b.id} x1={HUB.x} y1={HUB.y} x2={b.x} y2={b.y} stroke={STATUS_COLOR[b.status]} strokeWidth="0.5" opacity="0.75" className="flow-line" />
              ))}
              {BRANCHES.map((b) => (
                <g key={b.id}>
                  {b.status !== "normal" && (
                    <circle cx={b.x} cy={b.y} r="2.6" fill="none" stroke={STATUS_COLOR[b.status]} strokeWidth="0.6" className="pin-pulse" />
                  )}
                  <circle cx={b.x} cy={b.y} r="2.6" fill="#0D1220" stroke={STATUS_COLOR[b.status]} strokeWidth="1.1">
                    <title>{b.name} — {STATUS_LABEL[b.status]} · last synced {b.lastSyncMin === 0 ? "just now" : b.lastSyncMin + " min ago"}</title>
                  </circle>
                  <circle cx={b.x} cy={b.y} r="0.9" fill={STATUS_COLOR[b.status]} />
                  <text x={b.x} y={b.y - 5} textAnchor="middle" className="node-name" style={{ fill: "var(--text)" }}>{b.name}</text>
                  <text x={b.x} y={b.y + 7.5} textAnchor="middle" className="node-name" style={{ fill: b.lastSyncMin > 10 ? "var(--amber)" : "var(--muted)" }}>
                    {b.lastSyncMin === 0 ? "synced now" : `synced ${b.lastSyncMin}m ago`}
                  </text>
                </g>
              ))}
              <circle className="hub-ring" cx={HUB.x} cy={HUB.y} r="4" fill="none" stroke="url(#hubGrad)" strokeWidth="0.6" />
              <circle cx={HUB.x} cy={HUB.y} r="3" fill="url(#hubGrad)" />

              {/* scale bar */}
              <g transform="translate(4,113)">
                <line x1="0" y1="0" x2="14" y2="0" stroke="var(--muted)" strokeWidth="0.5" />
                <line x1="0" y1="-0.8" x2="0" y2="0.8" stroke="var(--muted)" strokeWidth="0.5" />
                <line x1="14" y1="-0.8" x2="14" y2="0.8" stroke="var(--muted)" strokeWidth="0.5" />
                <text x="7" y="-1.5" textAnchor="middle" className="node-name" style={{ fill: "var(--muted)", fontSize: 2.6 }}>~500 km</text>
              </g>
            </svg>
            <div className="map-zoom">
              <button title="Zoom in">+</button>
              <button title="Zoom out">−</button>
            </div>
          </div>
          <div className="feed-label">Live activity</div>
          <div className="feed" ref={feedRef}>
            {feed.map((f) => (
              <div className="feed-line" key={f.id}>
                <span className="feed-time mono">{f.time}</span>
                <span className={"feed-tag mono " + f.severity}>{f.source}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Activity size={13} color="var(--accent2)" /> Issues found</div>
            <button className="sort-btn" onClick={() => setSortBy((s) => (s === "risk" ? "newest" : "risk"))} title="Toggle sort">
              <ArrowUpDown size={11} /> {sortBy === "risk" ? "Highest risk" : "Newest first"}
            </button>
          </div>
          <div className="panel-note">Already grouped for you — tap one for the full story.</div>

          <div className="filter-chips">
            {[
              { key: "all", label: "All" },
              { key: "high", label: "Urgent" },
              { key: "medium", label: "Needs review" },
              { key: "info", label: "Info only" },
              { key: "dismissed", label: "Not an issue" },
            ].map((f) => (
              <button
                key={f.key}
                className={"chip" + (severityFilter === f.key ? " active" : "")}
                onClick={() => setSeverityFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <div className="bulk-bar">
              <span>{selectedIds.length} selected</span>
              <div className="bulk-actions">
                <button className="bulk-btn" onClick={bulkNotify}><BellRing size={11} /> Notify team</button>
                <button className="bulk-btn ghost" onClick={() => setSelectedIds([])}>Clear</button>
              </div>
            </div>
          )}

          <div className="inc-list">
            {filteredIncidents.length === 0 && (
              <div className="cross-empty">No issues match your search or filter.</div>
            )}
            {filteredIncidents.map((inc) => {
              const deadline = slaDeadlines[inc.id];
              const remaining = deadline ? deadline - nowMs : null;
              const slaUrgent = remaining != null && remaining < 5 * 60000;
              return (
                <div className={"inc-item " + inc.severity} key={inc.id} onClick={() => openInc(inc)}>
                  <div className="inc-top">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        className="inc-check"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(inc.id);
                        }}
                      >
                        {selectedIds.includes(inc.id) ? <CheckSquare size={14} color="var(--accent2)" /> : <Square size={14} color="var(--muted)" />}
                      </span>
                      <span className="inc-branch">{inc.branch}</span>
                    </div>
                    <span className="inc-age">{inc.age} ago</span>
                  </div>
                  <div className="inc-title">{inc.title}</div>
                  <div className="inc-plain">{inc.plain}</div>
                  <div className="inc-bottom">
                    <span className="inc-raw">From {inc.rawCount} log lines</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="ai-risk"><Brain size={10} /> {inc.confidence}% risk</span>
                      <span className="sev-badge" style={{ color: SEVERITY_COLOR[inc.severity], background: "rgba(255,255,255,0.05)" }}>{SEVERITY_LABEL[inc.severity]}</span>
                    </span>
                  </div>
                  {remaining != null && (
                    <div className={"sla-badge" + (slaUrgent ? " urgent" : "")}>
                      <Radio size={10} /> SLA: {formatCountdown(remaining)} left
                    </div>
                  )}
                  {inc.crossMatch && (
                    <div className="cross-tag"><Link2 size={11} /> Same pattern also seen at {inc.crossMatch}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Issues over the last 7 days</div></div>
          <div className="panel-note">Red = urgent, amber = needs review, cyan = info only.</div>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer>
              <LineChart data={TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#8A93AC", fontSize: 10.5 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fill: "#8A93AC", fontSize: 10.5 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#141A2C", border: "1px solid rgba(255,255,255,0.09)", fontSize: 11, borderRadius: 8 }} labelStyle={{ color: "#EDEFF7" }} />
                <Line type="monotone" dataKey="high" stroke="var(--red)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medium" stroke="var(--amber)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="info" stroke="var(--accent2)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="panel-head" style={{ marginTop: 16 }}><div className="panel-title">What kind of issues, most common first</div></div>
          {CATEGORIES.map((c) => (
            <div className="cat-row" key={c.label}>
              <div className="cat-label">{c.label}</div>
              <div className="cat-bar-track"><div className="cat-bar-fill" style={{ width: c.pct + "%" }} /></div>
              <div className="cat-pct">{c.pct}%</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title"><Building2 size={13} color="var(--accent2)" /> All branches, at a glance</div></div>
          <div className="panel-note">Trend is risk score over the last 6 hours. "vs usual" compares live traffic to that branch's normal baseline.</div>
          <table className="branches">
            <thead><tr><th>Branch</th><th>Status</th><th>Issues</th><th>Risk trend</th><th>vs usual</th><th>Synced</th></tr></thead>
            <tbody>
              {BRANCHES.map((b) => {
                const openCount = INCIDENTS.filter((i) => i.branch === b.name).length;
                const maxTrend = Math.max(...b.trend, 1);
                const pts = b.trend.map((v, i) => `${(i / (b.trend.length - 1)) * 56},${18 - (v / maxTrend) * 16}`).join(" ");
                const overBaseline = Math.round(((b.logsMin - b.baseline) / b.baseline) * 100);
                return (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td><div className="u-status"><span className="u-dot" style={{ background: STATUS_COLOR[b.status] }} />{STATUS_LABEL[b.status]}</div></td>
                    <td className="mono">{openCount}</td>
                    <td>
                      <svg width="58" height="20" viewBox="0 0 58 20" preserveAspectRatio="none">
                        <polyline points={pts} fill="none" stroke={STATUS_COLOR[b.status]} strokeWidth="1.6" />
                      </svg>
                    </td>
                    <td className="mono" style={{ color: overBaseline > 50 ? "var(--red)" : overBaseline > 15 ? "var(--amber)" : "var(--muted)" }}>
                      {b.logsMin}/hr {overBaseline > 0 ? `(+${overBaseline}%)` : `(${overBaseline}%)`}
                    </td>
                    <td className="mono" style={{ color: b.lastSyncMin > 10 ? "var(--amber)" : "var(--muted)", fontSize: 11 }}>
                      {b.lastSyncMin === 0 ? "now" : `${b.lastSyncMin}m ago`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bottom-grid" style={{ marginTop: 14 }}>
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><ListFilter size={13} color="var(--accent2)" /> Incident heatmap — last 30 days</div></div>
          <div className="panel-note">Darker means more issues flagged that day. Click a day to jump into the log explorer for it.</div>
          <div className="heatmap-grid">
            {HEATMAP.map((d, i) => (
              <div
                key={i}
                className="heat-cell"
                title={`${d.count} issues`}
                style={{ background: d.count === 0 ? "rgba(255,255,255,0.04)" : `rgba(124,92,255,${0.15 + Math.min(d.count, 6) * 0.13})` }}
                onClick={() => setShowExplorer(true)}
              />
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Fewer</span>
            <span className="heat-cell" style={{ background: "rgba(124,92,255,0.15)" }} />
            <span className="heat-cell" style={{ background: "rgba(124,92,255,0.5)" }} />
            <span className="heat-cell" style={{ background: "rgba(124,92,255,0.85)" }} />
            <span>More</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title"><Users size={13} color="var(--accent2)" /> Compare two branches</div></div>
          <div className="panel-note">Useful when a pattern shows up at more than one location.</div>
          <div className="compare-selects">
            <select value={compareA} onChange={(e) => setCompareA(e.target.value)}>
              {BRANCHES.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
            <span>vs</span>
            <select value={compareB} onChange={(e) => setCompareB(e.target.value)}>
              {BRANCHES.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
          {(() => {
            const bA = BRANCHES.find((b) => b.name === compareA);
            const bB = BRANCHES.find((b) => b.name === compareB);
            const rows = [
              ["Status", STATUS_LABEL[bA.status], STATUS_LABEL[bB.status]],
              ["Logs/hr", bA.logsMin, bB.logsMin],
              ["Normal baseline", bA.baseline, bB.baseline],
              ["Open issues", INCIDENTS.filter((i) => i.branch === bA.name).length, INCIDENTS.filter((i) => i.branch === bB.name).length],
              ["Last synced", bA.lastSyncMin === 0 ? "now" : bA.lastSyncMin + "m ago", bB.lastSyncMin === 0 ? "now" : bB.lastSyncMin + "m ago"],
            ];
            return (
              <table className="branches">
                <thead><tr><th></th><th>{compareA}</th><th>{compareB}</th></tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ color: "var(--muted)" }}>{r[0]}</td>
                      <td className="mono">{r[1]}</td>
                      <td className="mono">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>

      <div className="footer-note mono">
        Prototype interface — mock data shown for demonstration.
      </div>

      {toast && (
        <div className="toast" key={toast.id}>
          {toast.phase === "verifying" ? (
            <Loader2 size={16} className="spin" color="var(--accent2)" style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={16} color="#3ED598" style={{ flexShrink: 0 }} />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {showLedger && (
        <div className="ledger-overlay" onClick={() => setShowLedger(false)}>
          <div className="ledger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ledger-modal-head">
              <div className="ledger-modal-title"><Blocks size={16} color="var(--accent2)" /> Blockchain ledger</div>
              <X size={18} className="drawer-close" onClick={() => setShowLedger(false)} />
            </div>
            <div className="ledger-modal-note">
              Every log write and every action taken in this dashboard is anchored here. Updates require consensus from all participating nodes before they're accepted.
            </div>
            <div className="block-row" style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <span className="block-height">Block</span>
              <span className="block-hash">Hash</span>
              <span className="block-txs">Writes</span>
              <span className="block-time">Verified</span>
            </div>
            {ledgerBlocks.map((b) => (
              <div className="block-row" key={b.height}>
                <span className="block-height">#{b.height}</span>
                <span className="block-hash">{b.hash}</span>
                <span className="block-txs">{b.txs} txs</span>
                <span className="block-time">{b.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showExplorer && (
        <div className="ledger-overlay" onClick={() => setShowExplorer(false)}>
          <div className="ledger-modal explorer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ledger-modal-head">
              <div className="ledger-modal-title"><ListFilter size={16} color="var(--accent2)" /> Log explorer</div>
              <X size={18} className="drawer-close" onClick={() => setShowExplorer(false)} />
            </div>
            <div className="ledger-modal-note">
              Search and filter the raw log stream directly, instead of only the pre-grouped issues. Showing the last {allLogs.length} lines.
            </div>

            <div className="explorer-filters">
              <input
                placeholder="Search log text…"
                value={explorerQuery}
                onChange={(e) => setExplorerQuery(e.target.value)}
              />
              <select value={explorerBranch} onChange={(e) => setExplorerBranch(e.target.value)}>
                <option value="all">All branches</option>
                {BRANCHES.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
              <select value={explorerSeverity} onChange={(e) => setExplorerSeverity(e.target.value)}>
                <option value="all">All severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div className="explorer-list">
              {(() => {
                const rows = allLogs
                  .filter((l) => explorerBranch === "all" || l.branch === explorerBranch)
                  .filter((l) => explorerSeverity === "all" || l.severity === explorerSeverity)
                  .filter((l) => !explorerQuery.trim() || l.text.toLowerCase().includes(explorerQuery.toLowerCase()))
                  .slice()
                  .reverse();
                if (rows.length === 0) {
                  return <div className="ai-empty">No log lines match these filters.</div>;
                }
                return rows.map((f) => (
                  <div className="feed-line explorer-row" key={f.id}>
                    <span className="feed-time mono">{f.time}</span>
                    <span className={"feed-tag mono " + f.severity}>{f.source}</span>
                    <span className="explorer-branch">{f.branch}</span>
                    <span>{f.text}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {openIncident && (
        <div className="overlay" onClick={closeInc}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <span className="inc-branch">{openIncident.branch}</span>
                <div className="drawer-ticket">Ticket #{openIncident.ticket}</div>
              </div>
              <X size={18} className="drawer-close" onClick={closeInc} />
            </div>
            <div className="drawer-title">{openIncident.title}{dismissed[openIncident.id] && <span className="dismissed-tag">Not an issue</span>}</div>
            {THREAT_TAXONOMY[openIncident.id] && (
              <div className="tax-row">
                <span className="tax-chip"><ListFilter size={10} /> {THREAT_TAXONOMY[openIncident.id].category}</span>
                <span className="tax-chip ghost">{THREAT_TAXONOMY[openIncident.id].mitre}</span>
              </div>
            )}
            <div className="drawer-plain">{openIncident.plain}</div>

            <div className="assign-row">
              <span>Assigned to</span>
              <select
                value={assignments[openIncident.id] || openIncident.assignedTo}
                onChange={(e) => setAssignments((prev) => ({ ...prev, [openIncident.id]: e.target.value }))}
                disabled={!ROLES[role].canAct}
              >
                {EXPERTS.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>

            {THREAT_TAXONOMY[openIncident.id] && (
              <div className="playbook-row"><BookOpen size={11} /> {THREAT_TAXONOMY[openIncident.id].playbook}</div>
            )}

            {slaDeadlines[openIncident.id] != null && (
              <div className={"sla-badge" + (slaDeadlines[openIncident.id] - nowMs < 5 * 60000 ? " urgent" : "")} style={{ marginTop: 6 }}>
                <Radio size={10} /> SLA: {formatCountdown(slaDeadlines[openIncident.id] - nowMs)} left to first action {slaDeadlines[openIncident.id] - nowMs <= 0 && "· ESCALATED"}
              </div>
            )}

            <div className="drawer-toolbar">
              <button className="tool-btn" onClick={() => verifyOnChain(openIncident)}><Blocks size={11} /> Verify on blockchain</button>
              <button className="tool-btn" onClick={() => exportComplianceReport(openIncident)}><FileDown size={11} /> Compliance report</button>
              <button className={"tool-btn" + (dismissed[openIncident.id] ? " active" : "")} onClick={() => toggleDismiss(openIncident)}>
                <ThumbsDown size={11} /> {dismissed[openIncident.id] ? "Undo" : "Not an issue"}
              </button>
            </div>
            {verifyResult[openIncident.id] && (
              <div className="verify-result">
                <CheckCircle2 size={12} color="#3ED598" /> Verified · block #{verifyResult[openIncident.id].block} · hash {verifyResult[openIncident.id].hash} · {verifyResult[openIncident.id].at}
              </div>
            )}

            <div className="ai-box">
              <div className="ai-box-head">
                <span className="ai-box-title"><Sparkles size={13} color="var(--accent)" /> AI analysis</span>
                <button
                  className="ai-run-btn"
                  onClick={() => analyzeWithAI(openIncident)}
                  disabled={aiState[openIncident.id]?.loading}
                >
                  {aiState[openIncident.id]?.loading ? (
                    <Loader2 size={12} className="spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {aiState[openIncident.id]?.loading ? "Analyzing…" : aiState[openIncident.id]?.data ? "Re-run" : "Analyze"}
                </button>
              </div>

              {!aiState[openIncident.id] && (
                <div className="ai-empty">Get a plain-English read on this issue and a suggested first move, generated from the evidence below.</div>
              )}
              {aiState[openIncident.id]?.error && <div className="ai-error">{aiState[openIncident.id].error}</div>}
              {aiState[openIncident.id]?.data && (
                <>
                  <div className="ai-summary">{aiState[openIncident.id].data.summary}</div>
                  <div className="ai-risk-line"><ShieldCheck size={11} style={{ verticalAlign: -1, marginRight: 5 }} />{aiState[openIncident.id].data.risk_assessment}</div>
                  {aiState[openIncident.id].data.false_positive_likelihood && (
                    <div className="fp-line"><X size={11} style={{ verticalAlign: -1, marginRight: 5 }} />False positive likelihood: {aiState[openIncident.id].data.false_positive_likelihood}</div>
                  )}
                  <div className="ai-suggest">
                    <span>Suggested first move</span>
                    <strong>{ACTIONS.find((a) => a.key === aiState[openIncident.id].data.recommended_action)?.label || aiState[openIncident.id].data.recommended_action}</strong>
                  </div>
                  <div className="ai-reasoning">{aiState[openIncident.id].data.reasoning}</div>
                </>
              )}
            </div>

            <div className="conf-row">
              <span><Brain size={11} style={{ verticalAlign: -2, marginRight: 5 }} />AI risk score</span>
              <span className="mono" style={{ color: SEVERITY_COLOR[openIncident.severity] }}>{openIncident.confidence}%</span>
            </div>
            <div className="conf-track">
              <div className="conf-fill" style={{ width: openIncident.confidence + "%", background: SEVERITY_COLOR[openIncident.severity] }} />
            </div>

            <div className="tab-bar">
              <button className={"tab-btn" + (activeTab === "chain" ? " active" : "")} onClick={() => setActiveTab("chain")}>Behavior Chain</button>
              <button className={"tab-btn" + (activeTab === "why" ? " active" : "")} onClick={() => setActiveTab("why")}>Why Flagged</button>
              <button className={"tab-btn" + (activeTab === "cross" ? " active" : "")} onClick={() => setActiveTab("cross")}>Cross-Location</button>
              <button className={"tab-btn" + (activeTab === "actions" ? " active" : "")} onClick={() => setActiveTab("actions")}>Actions</button>
            </div>

            {activeTab === "chain" && (
              <>
                <div className="section-label">What happened, in order</div>
                <div className="chainviz">
                  {openIncident.chain.map((c, i) => (
                    <React.Fragment key={i}>
                      <div className="cnode">{c}</div>
                      {i < openIncident.chain.length - 1 && <div className="cline" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="section-label">What to check first</div>
                <div className="steps-block">
                  {openIncident.steps.map((s, i) => (
                    <div className="step" key={i}>
                      <div className="step-num mono">{String(i + 1).padStart(2, "0")}</div>
                      <div>
                        <div className="step-title">{s.step}</div>
                        <div className="step-why">Why? {s.why}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "why" && (
              <>
                <div className="section-label">Reasons this was flagged</div>
                <div className="panel-note" style={{ marginTop: -4 }}>Each weight is how much that signal contributed to the {openIncident.confidence}% risk score.</div>
                <div className="why-list">
                  {openIncident.reasons.map((r, i) => (
                    <div key={i}>
                      <div className="why-item" onClick={() => setEvidenceOpen(evidenceOpen === i ? null : i)}>
                        <CheckCircle2 size={13} color="var(--accent2)" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span>{r.text}</span>
                        {r.weight != null && <span className="why-weight mono">+{r.weight}%</span>}
                      </div>
                      {evidenceOpen === i && <div className="why-ev">Evidence: {r.evidence}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "cross" && (
              <>
                <div className="section-label">Similar patterns at other branches</div>
                {openIncident.crossMatch ? (
                  <div className="cross-card">
                    <div className="cross-card-note">
                      Similar sequence of suspicious behaviour identified across branches. You decide whether they're actually connected.
                    </div>
                    <div className="cross-compare">
                      <div className="cross-node">
                        <div className="name">{openIncident.branch}</div>
                        <div className="label" style={{ color: SEVERITY_COLOR[openIncident.severity] }}>{openIncident.title}</div>
                      </div>
                      <div className="cross-sim">
                        <div className="pct">{openIncident.crossMatchSimilarity}%</div>
                        <div className="lbl">Similarity</div>
                      </div>
                      <div className="cross-node">
                        <div className="name">{openIncident.crossMatch}</div>
                        <div className="label" style={{ color: "var(--amber)" }}>Related pattern</div>
                      </div>
                    </div>
                    <div className="cross-hint">
                      <Link2 size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
                      This doesn't prove the two are connected — it just means they're worth comparing side by side.
                    </div>
                  </div>
                ) : (
                  <div className="cross-empty">No similar pattern found at another branch for this issue.</div>
                )}
              </>
            )}

            {activeTab === "actions" && (
              <>
                <div className="section-label">Take action</div>
                {aiState[openIncident.id]?.data && (
                  <div className="ai-tag-note"><Sparkles size={11} style={{ verticalAlign: -1, marginRight: 5 }} />Highlighted below based on the AI analysis above.</div>
                )}
                <div className="actions-grid">
                  {ACTIONS.map((a) => {
                    const key = openIncident.id + ":" + a.key;
                    const done = !!actionsTaken[key]?.done;
                    const aiRec = aiState[openIncident.id]?.data?.recommended_action;
                    const isRecommended = (aiRec || openIncident.recommended) === a.key;
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.key}
                        className={"action-btn" + (done ? " done" : "") + (isRecommended && !done ? " recommended" : "")}
                        onClick={() => toggleAction(openIncident, a)}
                      >
                        {isRecommended && !done && (
                          <span className="a-rec"><Star size={9} /> Recommended</span>
                        )}
                        <span className="a-icon">
                          {done ? <Check size={16} /> : <Icon size={16} />}
                        </span>
                        {done ? a.doneLabel : a.label}
                      </button>
                    );
                  })}
                </div>
                <div className="section-label" style={{ marginTop: 16 }}>Investigate further</div>
                <button className="get-info-btn" onClick={() => fetchInfo(openIncident)} disabled={infoState[openIncident.id]?.loading}>
                  <span className="a-icon">
                    {infoState[openIncident.id]?.loading ? <Loader2 size={16} className="spin" /> : <Fingerprint size={16} />}
                  </span>
                  <div>
                    <div className="get-info-title">{infoState[openIncident.id]?.loading ? "Fetching account & device records…" : infoState[openIncident.id]?.data ? "Refresh information" : "Get information"}</div>
                    <div className="get-info-sub">Account, source IP, device and recent logins tied to this session</div>
                  </div>
                </button>

                {infoState[openIncident.id]?.data && (
                  <div className="info-panel">
                    <div className="info-source-note">Pulled from this organization's own directory & device records — not an external lookup.</div>
                    <div className="info-row"><User size={12} /> <span>Account</span><strong>{infoState[openIncident.id].data.account}</strong></div>
                    <div className="info-row"><Wifi size={12} /> <span>Source IP</span><strong className="mono">{infoState[openIncident.id].data.sourceIp}</strong></div>
                    <div className="info-row"><Monitor size={12} /> <span>Device</span><strong>{infoState[openIncident.id].data.device}</strong></div>
                    <div className="info-row"><Fingerprint size={12} /> <span>MAC address</span><strong className="mono">{infoState[openIncident.id].data.mac}</strong></div>
                    <div className="info-row"><Globe size={12} /> <span>Network</span><strong>{infoState[openIncident.id].data.network}</strong></div>
                    <div className="info-logins-label">Recent logins for this account</div>
                    {infoState[openIncident.id].data.priorLogins.map((p, i) => (
                      <div className="info-login-row" key={i}>
                        <span className="tl-dot" />
                        <span>{p.where}</span>
                        <span className="tl-time mono">{p.when}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="ledger-note" style={{ marginTop: 16 }}>
                  <Blocks size={11} style={{ verticalAlign: -1, marginRight: 5 }} />
                  Every action here is written to the tamper-proof blockchain ledger, alongside the log evidence it was based on.
                  <div className="cid-line"><Database size={10} style={{ verticalAlign: -1, marginRight: 5 }} />Evidence bundle pinned to IPFS · CID {cid}</div>
                </div>

                {(() => {
                  const entries = ACTIONS.filter((a) => actionsTaken[openIncident.id + ":" + a.key]?.done).map((a) => ({
                    label: a.doneLabel,
                    at: actionsTaken[openIncident.id + ":" + a.key].at,
                    by: actionsTaken[openIncident.id + ":" + a.key].by,
                  }));
                  if (entries.length === 0) return null;
                  return (
                    <>
                      <div className="section-label" style={{ marginTop: 18 }}>Activity on this issue</div>
                      <div className="timeline">
                        {entries.map((t, i) => (
                          <div className="tl-row" key={i}>
                            <span className="tl-dot" />
                            <span className="tl-label">{t.label}{t.by && <span className="tl-by"> · by {t.by}</span>}</span>
                            <span className="tl-time mono">{t.at}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}

                <div className="section-label" style={{ marginTop: 18 }}>Notes & handoff</div>
                <div className="notes-list">
                  {(notes[openIncident.id] || []).length === 0 && (
                    <div className="ai-empty">No notes yet — leave context here for whoever picks this up next.</div>
                  )}
                  {(notes[openIncident.id] || []).map((n, i) => (
                    <div className="note-row" key={i}>
                      <div className="note-head"><MessageSquare size={11} /> {n.by} <span className="tl-time mono">{n.at}</span></div>
                      <div className="note-text">{n.text}</div>
                    </div>
                  ))}
                </div>
                <div className="note-compose">
                  <input
                    placeholder="Add a note for the next shift…"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote(openIncident)}
                  />
                  <button onClick={() => addNote(openIncident)}>Post</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
