// Backend contract (used when VITE_MOCK=false). Responses use the shapes below.
// group: { id, name, isPersonal, meId, members:[{id,name,linked,inviteToken}],
//   expenses:[{id,description,amountPaise,paidBy,voice,shares:{memberId:paise}}],
//   payments:[{id,from,to,amountPaise}], balances:{ transfers:[{from,to,amountPaise}],
//   direct:[{memberId,name,amountPaise}] } }   (direct > 0 means they owe you)
// interpret -> proposal: { intent: add_expense|query_balance|settle_up|delete_last|message, transcript,
//   description, amountPaise, paidBy, splitType, participants:[ids], unresolved:[names], message, fromId, toId }
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const MOCK = import.meta.env.VITE_MOCK !== "false";

export const token = () => localStorage.getItem("token");
export const fmt = (p) => "₹" + (Math.abs(p) / 100).toLocaleString("en-IN");
export function splitEq(total, n) {
  if (!n) return [];
  const base = Math.floor(total / n), rem = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
}

async function call(path, opts = {}) {
  const form = opts.body instanceof FormData;
  const res = await fetch(API + path, {
    ...opts,
    headers: { ...(form ? {} : { "Content-Type": "application/json" }), Authorization: "Bearer " + token() },
    body: opts.body && !form ? JSON.stringify(opts.body) : opts.body,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
  return res;
}
const json = async (p, o) => (await call(p, o)).json();

const real = {
  auth: async (mode, b) => { const d = await json("/auth/" + mode, { method: "POST", body: b }); localStorage.setItem("token", d.token); localStorage.setItem("name", d.user.name); },
  groups: () => json("/groups"),
  group: (id) => json("/groups/" + id),
  createGroup: (name, members) => json("/groups", { method: "POST", body: { name, members } }),
  deleteGroup: (id) => json("/groups/" + id, { method: "DELETE" }),
  addMember: (id, name) => json(`/groups/${id}/members`, { method: "POST", body: { name } }),
  interpret: (blob, gid, text, mode) => { const f = new FormData(); f.append("groupId", gid); if (mode) f.append("mode", mode); text ? f.append("text", text) : f.append("audio", blob, "voice.webm"); return json("/voice/interpret", { method: "POST", body: f }); },
  addExpense: (id, e) => json(`/groups/${id}/expenses`, { method: "POST", body: e }),
  deleteExpense: (id, expenseId) => json(`/groups/${id}/expenses/${expenseId}`, { method: "DELETE" }),
  addPayment: (id, p) => json(`/groups/${id}/payments`, { method: "POST", body: p }),
  deleteLast: (id) => json(`/groups/${id}/expenses/last`, { method: "DELETE" }),
  invite: (t) => json("/invites/" + t),
  claim: (t) => json(`/invites/${t}/claim`, { method: "POST" }),
  speak: async (text) => { const r = await call("/voice/speak", { method: "POST", body: { text } }); new Audio(URL.createObjectURL(await r.blob())).play(); },
};

// ---- Mock mode: sample data in memory, so the UI runs without a backend ----
let n = 100; const uid = () => "x" + n++; const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const db = { groups: [
  { id: "g0", name: "Personal 📌", isPersonal: true, meId: "p1", members: [{ id: "p1", name: "Rahul", linked: true }],
    expenses: [{ id: "e0", description: "Expense Cashback", amountPaise: 60000, paidBy: "p1", voice: true, shares: {} }], payments: [] },
  { id: "g1", name: "Goa Trip 🌴", meId: "m1", members: [{ id: "m1", name: "Rahul", linked: true }, { id: "m2", name: "Priya", linked: true }, { id: "m3", name: "Paloma", linked: true }, { id: "m4", name: "Tanvi", linked: true }, { id: "m5", name: "Rohit", linked: true }],
    expenses: [
      { id: "e1", description: "Fisherman's Wharf Dinner", amountPaise: 80000, paidBy: "m1", voice: true, shares: { m1: 20000, m2: 20000, m3: 20000, m4: 20000 } },
      { id: "e2", description: "Scooter Fuel & Parking", amountPaise: 40000, paidBy: "m2", voice: false, shares: { m1: 10000, m2: 10000, m3: 10000, m4: 10000 } },
      { id: "e3", description: "Groceries & Snacks", amountPaise: 120000, paidBy: "m4", voice: true, shares: { m1: 30000, m2: 30000, m3: 30000, m4: 30000 } }
    ],
    payments: [
      { id: "p1", from: "m2", to: "m1", amountPaise: 30000, date: "Yesterday" }
    ]
  },
  { id: "g2", name: "Flat 402 HSR", meId: "f1", members: [{ id: "f1", name: "Rahul", linked: true }, { id: "f2", name: "Tanvi", linked: true }, { id: "f3", name: "Druid", linked: true }],
    expenses: [{ id: "e2", description: "Groceries & Wifi", amountPaise: 540000, paidBy: "f1", voice: true, shares: { f1: 180000, f2: 180000, f3: 180000 } }], payments: [] },
  { id: "g3", name: "Weekend Dinners", meId: "w1", members: [{ id: "w1", name: "Rahul", linked: true }, { id: "w2", name: "Priya", linked: true }, { id: "w3", name: "Paloma", linked: true }],
    expenses: [{ id: "e3", description: "Toit Indiranagar", amountPaise: 300000, paidBy: "w1", voice: true, shares: { w1: 100000, w2: 100000, w3: 100000 } }],
    payments: [{ id: "p1", from: "w2", to: "w1", amountPaise: 100000 }, { id: "p2", from: "w3", to: "w1", amountPaise: 100000 }] },
] };
const G = (id) => db.groups.find((x) => x.id === id);

function balances(g) {
  const net = {}; g.members.forEach((m) => (net[m.id] = 0));
  g.expenses.forEach((e) => { net[e.paidBy] += e.amountPaise; for (const [k, v] of Object.entries(e.shares)) net[k] -= v; });
  g.payments.forEach((p) => { net[p.from] += p.amountPaise; net[p.to] -= p.amountPaise; });
  const c = [], d = [];
  for (const [id, v] of Object.entries(net)) { if (v > 0) c.push({ id, v }); else if (v < 0) d.push({ id, v: -v }); }
  const transfers = [];
  while (c.length && d.length) {
    c.sort((a, b) => b.v - a.v); d.sort((a, b) => b.v - a.v);
    const x = Math.min(c[0].v, d[0].v);
    transfers.push({ from: d[0].id, to: c[0].id, amountPaise: x });
    c[0].v -= x; d[0].v -= x;
    if (!c[0].v) c.shift(); if (!d[0].v) d.shift();
  }
  const direct = g.members.filter((m) => m.id !== g.meId).map((o) => {
    let v = 0;
    g.expenses.forEach((e) => { if (e.paidBy === g.meId) v += e.shares[o.id] || 0; if (e.paidBy === o.id) v -= e.shares[g.meId] || 0; });
    g.payments.forEach((p) => { if (p.from === o.id && p.to === g.meId) v -= p.amountPaise; if (p.from === g.meId && p.to === o.id) v += p.amountPaise; });
    return { memberId: o.id, name: o.name, amountPaise: v };
  });
  const allSettled = transfers.length === 0 && direct.every((d) => d.amountPaise === 0);
  return { net, transfers, direct, allSettled };
}

const mock = {
  auth: async (mode, b) => { localStorage.setItem("token", "mock"); localStorage.setItem("name", b.name || "Rahul"); },
  groups: async () => db.groups.map((g) => ({ id: g.id, name: g.name, isPersonal: !!g.isPersonal, members: g.members.map((m) => m.name), net: balances(g).net[g.meId] })),
  group: async (id) => { const g = G(id); return { ...g, balances: balances(g) }; },
  createGroup: async (name, names) => { const id = uid(); db.groups.push({ id, name, meId: id + "me", members: [{ id: id + "me", name: "Rahul", linked: true }, ...names.map((x) => ({ id: uid(), name: x }))], expenses: [], payments: [] }); },
  deleteGroup: async (id) => {
    await wait(250);
    const idx = db.groups.findIndex((g) => g.id === id);
    if (idx !== -1) db.groups.splice(idx, 1);
  },
  addMember: async (id, name) => { G(id).members.push({ id: uid(), name }); },
  interpret: async (_b, gid, text, mode) => {
    await wait(900);
    const g = G(gid);
    const isQueryMode = mode === "query";
    const defaultText = isQueryMode
      ? "Rahul ko kitne paise dene hain?"
      : "Rahul ne 800 diye, Priya, Tanvi, aur Rohit me baant do";
    const transcriptText = text || defaultText;
    const t = transcriptText.toLowerCase();
    const named = g?.members?.find((m) => t.includes((m.name || "").toLowerCase()));
    const other = named && named.id !== g.meId ? named : g?.members?.find((m) => m.id !== g.meId);
    const dir = other && balances(g).direct.find((d) => d.memberId === other.id)?.amountPaise;

    // Handle Voice Query mode or balance inquiry phrase
    if (isQueryMode || (mode !== "add" && /kitna|owe|dena/.test(t))) {
      const pName = other ? other.name : "Rahul Sharma";
      return {
        intent: "query_balance",
        transcript: transcriptText,
        spokenText: "“Rahul ko tumhe ₹450 dene hain”",
        message: "Rahul ko tumhe ₹450 dene hain",
        amountPaise: 45000,
        personName: pName,
        youOwe: true,
        otherId: other?.id || "m1",
        groupName: g?.name || "Goa Trip 🌴",
        contextDesc: "Dinner at Fisherman's Wharf (₹300) + Taxi to Anjuna (₹150)",
        items: [
          {
            id: "item-1",
            icon: "🍽",
            title: "Fisherman's Wharf Dinner",
            subtitle: "Paid by Rahul • Group total ₹1,200",
            amount: 300,
            shareTag: "your share"
          },
          {
            id: "item-2",
            icon: "🚗",
            title: "Vagator Cab",
            subtitle: "Paid by Rahul • Airport Transfer",
            amount: 150,
            shareTag: "your share"
          }
        ]
      };
    }

    if (/delete|hata/.test(t)) {
      const e = g?.expenses?.at(-1);
      return e ? { intent: "delete_last", transcript: t, message: `"${e.description}" (${fmt(e.amountPaise)}) delete karein?` } : { intent: "message", transcript: t, message: "Koi expense nahi hai." };
    }

    if (/settle/.test(t) && other) {
      return dir ? { intent: "settle_up", transcript: t, fromId: dir > 0 ? other.id : g.meId, toId: dir > 0 ? g.meId : other.id, amountPaise: Math.abs(dir), message: dir > 0 ? `${other.name} tumhe ${fmt(dir)} dega. Payment record karein?` : `Tum ${other.name} ko ${fmt(dir)} doge. Payment record karein?` } : { intent: "message", transcript: t, message: "Sab settle hai." };
    }

    // Default expense intent for Voice Add and Voice input in sidebar
    return {
      intent: "add_expense",
      transcript: text || "Rahul ne 800 diye, Priya, Tanvi, aur Rohit me baant do",
      description: "Dinner",
      amountPaise: (+(t.match(/\d+/) || [800])[0]) * 100,
      paidBy: named?.id || g?.meId || "m1",
      splitType: "equal",
      participants: g?.members ? g.members.map((m) => m.id) : ["m1", "m2", "m3", "m4"],
      unresolved: ["Rohit"]
    };
  },
  addExpense: async (id, e) => { G(id).expenses.push({ id: uid(), description: e.description, amountPaise: e.amountPaise, paidBy: e.paidById, voice: true, shares: Object.fromEntries(e.shares.map((s) => [s.memberId, s.sharePaise])) }); },
  deleteExpense: async (groupId, expenseId) => {
    await wait(200);
    const g = G(groupId);
    if (g && g.expenses) {
      g.expenses = g.expenses.filter((e) => e.id !== expenseId);
    }
  },
  addPayment: async (id, p) => { G(id).payments.push({ id: uid(), from: p.fromId, to: p.toId, amountPaise: p.amountPaise }); },
  deleteLast: async (id) => { G(id).expenses.pop(); },
  invite: async () => ({ group: "Goa Trip 🌴", name: "Paloma", amountPaise: 20000 }),
  claim: async () => {},
  speak: async (text) => { speechSynthesis.cancel(); speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(text), { lang: "hi-IN" })); },
};

export const api = MOCK ? mock : real;
