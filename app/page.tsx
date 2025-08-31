// SweepMint – Zero‑Dependency Next.js Page (no shadcn/ui, no icon libs, no framer‑motion) // Paste this file into: app/page.tsx   (or pages/index.tsx if your repo uses the Pages Router)

"use client"; import React, { useEffect, useState } from "react";

// --- Config (edit these to customize) --- const CONFIG = { brand: { name: "SweepMint", tagline: "Play for fun. Win with sweeps." }, signupBonus: { gc: 250_000, sc: 5 }, restrictedStates: ["WA", "ID"], // example only minAge: 18, spin: { cooldownHours: 24, prizes: [ { label: "+500 GC", gc: 500 }, { label: "+0.2 SC", sc: 0.2 }, { label: "+2,000 GC", gc: 2000 }, { label: "+1 SC", sc: 1 }, { label: "+10,000 GC", gc: 10000 }, { label: "+0.5 SC", sc: 0.5 }, ], }, redemption: { minSC: 10, eta: "3–10 business days (manual review)" }, };

const fmt = (n: number | string) => typeof n === "number" ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n;

const getLS = (k: string, d: any) => { if (typeof window === "undefined") return d; try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }; const setLS = (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export default function Page() { const [ageOk, setAgeOk] = useState(getLS("sm_age", false)); const [stateUS, setStateUS] = useState(getLS("sm_state", "OR")); const [user, setUser] = useState<any>(getLS("sm_user", null)); const [gc, setGC] = useState<number>(getLS("sm_gc", CONFIG.signupBonus.gc)); const [sc, setSC] = useState<number>(getLS("sm_sc", CONFIG.signupBonus.sc)); const [toast, setToast] = useState<string | null>(null);

useEffect(() => setLS("sm_age", ageOk), [ageOk]); useEffect(() => setLS("sm_state", stateUS), [stateUS]); useEffect(() => setLS("sm_user", user), [user]); useEffect(() => setLS("sm_gc", gc), [gc]); useEffect(() => setLS("sm_sc", sc), [sc]);

const restricted = CONFIG.restrictedStates.includes(stateUS); const canPlay = ageOk && !!user && !restricted;

return ( <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100"> <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-zinc-800/60"> <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between"> <div> <div className="font-semibold">{CONFIG.brand.name}</div> <div className="text-xs text-zinc-400">{CONFIG.brand.tagline}</div> </div> <div className="hidden sm:flex gap-3 text-sm"> <span className="bg-zinc-800 px-3 py-1 rounded-lg">GC: {fmt(gc)}</span> <span className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg text-emerald-300">SC: {fmt(sc)}</span> </div> </div> </header>

<main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
    <section className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
      <h1 className="text-2xl font-bold">Claim your free welcome bonus</h1>
      <p className="text-zinc-400 mt-2">No purchase necessary. Gold Coins for fun; Sweeps Coins for prize entries.</p>
      {restricted && (
        <p className="mt-2 text-amber-400 text-sm">Your state is currently restricted for SC play. You can still enjoy GC games.</p>
      )}
      {!user && (
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Name" onChange={(e) => setUser({ ...(user || {}), name: e.target.value })} />
          <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Email" onChange={(e) => setUser({ ...(user || {}), email: e.target.value })} />
          <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="State (e.g. OR)" value={stateUS} onChange={(e) => setStateUS(e.target.value.toUpperCase().slice(0,2))} />
          <label className="sm:col-span-3 text-sm mt-1 flex items-center gap-2">
            <input type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} /> I confirm I am at least {CONFIG.minAge} years old and agree to the Official Rules.
          </label>
        </div>
      )}
    </section>

    <section className="grid md:grid-cols-2 gap-4">
      <DailySpin onGC={(n) => setGC((v) => v + n)} onSC={(n) => setSC((v) => +(v + n).toFixed(2))} setToast={setToast} />
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
        <div className="text-lg font-semibold mb-3">Your Balance</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-zinc-400">Gold Coins</div>
            <div className="text-2xl font-semibold">{fmt(gc)}</div>
            <div className="text-xs text-zinc-500">Entertainment only</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-zinc-400">Sweeps Coins</div>
            <div className="text-2xl font-semibold">{fmt(sc)}</div>
            <div className="text-xs text-zinc-500">Redeemable for prizes</div>
          </div>
        </div>
      </div>
    </section>

    <Tabs>
      <Tab title="Play (GC)">
        <SlotDemo canPlay={canPlay} gc={gc} setGC={setGC} setToast={setToast} />
      </Tab>
      <Tab title="No‑Purchase Entry (AMOE)">
        <AMOE onAward={(n) => setSC((v) => +(v + n).toFixed(2))} />
      </Tab>
      <Tab title="Redeem (SC)">
        <Redeem sc={sc} setSC={setSC} restricted={restricted} setToast={setToast} />
      </Tab>
    </Tabs>

    <Compliance />
  </main>

  <footer className="mt-10 border-t border-zinc-800/60">
    <div className="max-w-5xl mx-auto px-4 py-8 text-xs text-zinc-500 space-y-2">
      <div>No Purchase Necessary • 18+ • Void where prohibited</div>
      <div>Gold Coins are for entertainment only. Sweeps Coins may be redeemed for prizes subject to verification. Participation constitutes acceptance of Official Rules and Privacy Policy.</div>
      <div>© {new Date().getFullYear()} SweepMint.</div>
    </div>
  </footer>

  {toast && (
    <div className="fixed bottom-4 right-4 bg-zinc-900/90 border border-zinc-700 rounded-xl px-4 py-3 text-sm">
      {toast} <button className="ml-3 underline" onClick={() => setToast(null)}>Dismiss</button>
    </div>
  )}
</div>

); }

function DailySpin({ onGC, onSC, setToast }: { onGC: (n:number)=>void; onSC: (n:number)=>void; setToast:(m:string)=>void }) { const [last, setLast] = useState<number>(getLS("sm_spin", 0)); const [spinning, setSpinning] = useState(false); const can = Date.now() - last >= CONFIG.spin.cooldownHours * 3600_000; const spin = () => { if (!can || spinning) return; setSpinning(true); setTimeout(() => { const prize = CONFIG.spin.prizes[Math.floor(Math.random() * CONFIG.spin.prizes.length)]; if ((prize as any).gc) onGC((prize as any).gc); if ((prize as any).sc) onSC((prize as any).sc); const now = Date.now(); setLast(now); setLS("sm_spin", now); setSpinning(false); setToast(Daily Spin: You won ${prize.label}); }, 700); }; const remaining = Math.max(0, CONFIG.spin.cooldownHours * 3600_000 - (Date.now() - last)); const hh = Math.floor(remaining / 3600_000); const mm = Math.floor((remaining % 3600_000) / 60000);

return ( <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"> <div className="text-lg font-semibold mb-2">Daily Spin</div> <div className="flex items-center gap-4"> <div className={h-20 w-20 grid place-items-center rounded-full border-4 ${spinning ? "animate-spin" : ""} border-emerald-400/40}>SPIN</div> <div className="text-sm text-zinc-400"> Spin once every 24 hours for GC/SC. No purchase necessary. <div className="mt-1 text-zinc-300">{can ? "Ready now" : Next in ${hh}h ${mm}m}</div> </div> </div> <button onClick={spin} disabled={!can || spinning} className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 disabled:bg-zinc-700">{spinning ? "Spinning…" : "Spin now"}</button> </div> ); }

function SlotDemo({ canPlay, gc, setGC, setToast }: { canPlay:boolean; gc:number; setGC:(n:number)=>void; setToast:(m:string)=>void }) { const [bet, setBet] = useState(1000); const [reels, setReels] = useState<string[]>(["🍒","🍋","⭐"]); const [spinning, setSpinning] = useState(false); const symbols = ["🍒","🍋","🔔","⭐","💎","7️⃣"];

const spin = () => { if (!canPlay) { setToast("Please sign up & confirm age first."); return; } if (bet > gc) { setToast("Not enough Gold Coins."); return; } setGC(gc - bet); setSpinning(true); setTimeout(() => { const r = Array.from({length:3}, () => symbols[Math.floor(Math.random()*symbols.length)]); setReels(r); let payout = 0; if (r[0] === r[1] && r[1] === r[2]) { const mult: any = { "🍒":5, "🍋":8, "🔔":15, "⭐":25, "💎":50, "7️⃣":100 }; payout = bet * (mult[r[0]] || 0); } else if (new Set(r).size === 2) { payout = Math.floor(bet * 1.5); } if (payout) setGC(gc - bet + payout); else setGC(gc - bet); setSpinning(false); }, 700); };

return ( <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3"> <div className="text-lg font-semibold">Demo Slot (GC only)</div> <div className="grid grid-cols-3 gap-2 text-4xl text-center select-none"> {reels.map((s, i) => (<div key={i} className="py-4 bg-zinc-900 border border-zinc-800 rounded-xl">{s}</div>))} </div> <div className="flex items-center gap-3"> <label className="text-sm">Bet (GC)</label> <input type="number" min={100} step={100} value={bet} onChange={(e)=>setBet(parseInt(e.target.value||"0",10))} className="bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 w-40" /> <button onClick={spin} disabled={spinning} className="px-4 py-2 rounded-lg bg-emerald-600 disabled:bg-zinc-700">{spinning?"Spinning…":"Spin"}</button> </div> <p className="text-xs text-zinc-400">GC are for entertainment only. Production games must use server‑side RNG; this demo is client‑side.</p> </div> ); }

function AMOE({ onAward }: { onAward:(n:number)=>void }) { const [form, setForm] = useState({ name:"", email:"", address:"", city:"", state:"OR", zip:"", captcha:"" }); const submit = () => { if (!form.name || !form.email || !form.address || !form.city || !form.state || !form.zip) return alert("Please complete all fields."); const last = getLS("sm_amoe", 0); const ok = Date.now() - last > 24*3600_000; if (!ok) return alert("AMOE already submitted in the last 24h."); onAward(1); setLS("sm_amoe", Date.now()); alert("AMOE received — +1 SC added."); }; const set = (k:string, v:string) => setForm((f)=>({ ...f, [k]: v })); return ( <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3"> <div className="text-lg font-semibold">Alternate Method of Entry (AMOE)</div> <p className="text-sm text-zinc-400">No purchase necessary. Submit once per 24 hours to receive +1 SC (subject to verification).</p> <div className="grid md:grid-cols-2 gap-3"> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>set("name", e.target.value)} /> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>set("email", e.target.value)} /> <input className="md:col-span-2 bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Address" value={form.address} onChange={(e)=>set("address", e.target.value)} /> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="City" value={form.city} onChange={(e)=>set("city", e.target.value)} /> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="State" value={form.state} onChange={(e)=>set("state", e.target.value.toUpperCase().slice(0,2))} /> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="ZIP" value={form.zip} onChange={(e)=>set("zip", e.target.value)} /> <input className="md:col-span-2 bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Captcha (type NO‑ROBOT)" value={form.captcha} onChange={(e)=>set("captcha", e.target.value)} /> </div> <button onClick={submit} className="px-4 py-2 rounded-lg bg-emerald-600">Submit AMOE</button> <p className="text-xs text-zinc-500">Limit one AMOE per 24h per person/household/device. Void where prohibited.</p> </div> ); }

function Redeem({ sc, setSC, restricted, setToast }: { sc:number; setSC:(n:number)=>void; restricted:boolean; setToast:(m:string)=>void }) { const [amount, setAmount] = useState(10); const [method, setMethod] = useState("Gift Card"); const [dest, setDest] = useState(""); const submit = () => { if (restricted) return alert("Redemption not available in your state."); if (amount < CONFIG.redemption.minSC) return alert(Minimum redemption is ${CONFIG.redemption.minSC} SC.); if (amount > sc) return alert("Not enough SC."); if (!dest) return alert("Enter an email/wallet for delivery."); setSC(+(sc - amount).toFixed(2)); setToast(Redemption requested: ${amount} SC via ${method}. ETA ${CONFIG.redemption.eta}.); }; return ( <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3"> <div className="text-lg font-semibold">Redeem Sweeps Coins</div> <div className="grid md:grid-cols-3 gap-3"> <input type="number" min={CONFIG.redemption.minSC} className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" value={amount} onChange={(e)=>setAmount(parseFloat(e.target.value||"0"))} /> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" value={method} onChange={(e)=>setMethod(e.target.value)} /> <input className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2" placeholder="Email / wallet" value={dest} onChange={(e)=>setDest(e.target.value)} /> </div> <p className="text-xs text-zinc-500">Redemptions require identity verification and manual review.</p> <button onClick={submit} className="px-4 py-2 rounded-lg bg-emerald-600">Submit Request</button> </div> ); }

// Minimal Tabs without external UI libs function Tabs({ children }: { children: any }) { const [i, setI] = useState(0); return ( <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl"> <div className="grid grid-cols-3 text-sm"> {React.Children.map(children, (c: any, idx: number) => ( <button onClick={() => setI(idx)} className={px-3 py-2 ${i===idx?"bg-zinc-800 border-b-2 border-emerald-500":"bg-transparent"}}>{c.props.title}</button> ))} </div> <div className="p-5">{React.Children.toArray(children)[i]}</div> </div> ); } function Tab({ title, children }: { title:string; children:any }) { return <div title={title}>{children}</div>; }

function Compliance() { return ( <div className="grid md:grid-cols-3 gap-4"> <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300"> <div className="font-semibold">No Purchase Necessary</div> <p className="text-zinc-400 mt-1">GC are for entertainment only and have no cash value. SC are entries that may be redeemed for prizes. A free AMOE is available daily.</p> </div> <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300"> <div className="font-semibold">Eligibility</div> <p className="text-zinc-400 mt-1">Must be {CONFIG.minAge}+ and located in an eligible U.S. state. Identity verification required before redemption. Void where prohibited.</p> </div> <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300"> <div className="font-semibold">Official Rules</div> <p className="text-zinc-400 mt-1">Participation constitutes acceptance of the Official Rules and Privacy Policy. Consult counsel to tailor state disclosures and restrictions.</p> </div> </div> ); }

