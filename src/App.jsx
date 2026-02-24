import { useState, useReducer, useRef } from “react”;

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

const Label = ({ children }) => (
<span className="block text-xs font-medium uppercase tracking-widest text-gray-400 mb-1.5">{children}</span>
);

const Input = ({ type = “text”, placeholder, value, onChange, readOnly, className = “” }) => (
<input type={type} placeholder={placeholder} value={value ?? “”} onChange={onChange} readOnly={readOnly}
className={`w-full h-11 px-3.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-300 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 read-only:bg-gray-50 read-only:text-emerald-700 read-only:font-mono read-only:text-xs ${className}`} />
);

const InlineInput = ({ type = “number”, placeholder = “0”, value, onChange, className = “” }) => (
<input type={type} placeholder={placeholder} value={value ?? “”} onChange={onChange}
className={`w-full h-9 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all ${className}`} />
);

const Sel = ({ value, onChange, children, className = “” }) => (
<select value={value ?? “”} onChange={onChange}
className={`w-full h-11 px-3.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-all outline-none appearance-none cursor-pointer focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${className}`}>
{children}
</select>
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (

  <textarea value={value ?? ""} onChange={onChange} placeholder={placeholder} rows={rows}
    className="w-full px-3.5 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-300 resize-none outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
);

const Field = ({ label, children, span = 1 }) => (
  <div className={span === 2 ? "col-span-2" : ""}><Label>{label}</Label>{children}</div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ title, sub, right }) => (
  <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
    <div><h3 className="text-base font-semibold text-gray-900">{title}</h3>{sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}</div>
    {right && <div>{right}</div>}
  </div>
);

const SectionDiv = ({ title }) => (
  <div className="col-span-2 flex items-center gap-3 pt-2">
    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const KpiCard = ({ label, value, sub, accent }) => (
  <div className={`rounded-xl px-5 py-4 border ${accent ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100"}`}>
    <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className={`text-2xl font-bold font-mono ${accent ? "text-emerald-700" : "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const SliderField = ({ label, value, displayValue, min, max, step = 1, onChange }) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-sm font-semibold font-mono text-emerald-600">{displayValue}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={onChange}
      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500" />
    <div className="flex justify-between text-xs text-gray-300 mt-1"><span>{min}</span><span>{max}</span></div>
  </div>
);

const PageHeader = ({ title, sub, right }) => (
  <div className="mb-8 pb-6 border-b border-gray-100 flex items-end justify-between">
    <div><h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>{sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}</div>
    {right && <div>{right}</div>}
  </div>
);

const InnerTabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 border-b border-gray-100 mb-7">
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)}
        className={`relative px-4 py-2.5 text-sm transition-all rounded-t-lg ${active === t.id ? "font-semibold text-emerald-600" : "font-medium text-gray-400 hover:text-gray-700"}`}>
        {t.label}
        {active === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
      </button>
    ))}
  </div>
);

const AddRowBtn = ({ onClick, label = "+ Přidat řádek" }) => (
  <button onClick={onClick} className="w-full mt-3 py-2 text-xs font-semibold text-gray-400 hover:text-emerald-600 border border-dashed border-gray-200 hover:border-emerald-300 rounded-xl transition-all">{label}</button>
);

const DelBtn = ({ onClick }) => (
  <button onClick={onClick} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all text-base">×</button>
);

const MetricRow = ({ label, value, pos, neg, gold }) => {
  const color = pos ? "text-emerald-600" : neg ? "text-red-500" : gold ? "text-amber-600" : "text-gray-700";
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`font-mono text-sm ${color}`}>{value}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const CY = new Date().getFullYear();
const num = v => parseFloat(v) || 0;
const fmt = n => (isNaN(n) || !isFinite(n) || n === 0) ? "—" : Math.round(n).toLocaleString("cs-CZ") + " Kč";
const fmtM = n => { if (!n || isNaN(n)) return "—"; const a = Math.abs(n); if (a >= 1e6) return (n / 1e6).toFixed(1) + " mil. Kč"; return fmt(n); };
const fmtP = n => (isNaN(n) || !isFinite(n)) ? "—" : (n * 100).toFixed(1) + " %";
function FV(r, n, pmt = 0, pv = 0) { if (r === 0) return -(pv + pmt * n); return -(pv * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r)); }
function PMT(r, n, pv) { if (r === 0) return -pv / n; return -(r * pv * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); }

// ─────────────────────────────────────────────────────────────────────────────
// SVG CHARTS (no dependencies)
// ─────────────────────────────────────────────────────────────────────────────

const MiniDonut = ({ data, size = 80 }) => {
  const total = data.reduce((s, d) => s + d.v, 0);
  if (!total) return <div className="rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-300" style={{ width: size, height: size }}>—</div>;
  const r = 28, cx = 40, cy = 40, C = 2 * Math.PI * r;
  let off = 0;
  const segs = data.filter(d => d.v > 0).map(d => { const pct = d.v / total; const dash = pct * C; const s = { ...d, dash, gap: C - dash, off }; off += dash; return s; });
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={12} />
      {segs.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth={12}
          strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={C / 4 - s.off}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      ))}
    </svg>
  );
};

const LineChart = ({ data, color = "#10b981", height = 160, fill = false, secondLine }) => {
  if (!data.length) return <div className="flex items-center justify-center text-xs text-gray-300" style={{ height }}>Zadejte data</div>;
  const all = [...data, ...(secondLine || [])];
  const max = Math.max(...all); const min = Math.min(...all); const range = max - min || 1;
  const W = 600, H = height;
  const pts = (arr) => arr.map((v, i) => `${(i / (arr.length - 1)) * (W - 40) + 20},${H - 20 - ((v - min) / range) * (H - 40)}`).join(" ");
  const fillPts = `20,${H - 20} ${pts(data)} ${W - 20},${H - 20}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {fill && <polygon points={fillPts} fill={color} opacity="0.08" />}
      {secondLine && <polyline points={pts(secondLine)} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" strokeLinejoin="round" strokeLinecap="round" />}
      <polyline points={pts(data)} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const BarChart = ({ labels, datasets, height = 160 }) => {
  if (!labels.length) return null;
  const all = datasets.flatMap(d => d.data);
  const max = Math.max(...all, 1);
  const W = 600, H = height, pad = 20;
  const groupW = (W - pad * 2) / labels.length;
  const barW = Math.max(4, Math.floor(groupW / (datasets.length + 1)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {labels.map((l, i) => {
        const gx = pad + i * groupW + groupW / 2 - (datasets.length * (barW + 2)) / 2;
        return (
          <g key={i}>
            {datasets.map((ds, di) => {
              const bh = Math.max(2, (ds.data[i] / max) * (H - 35));
              return <rect key={di} x={gx + di * (barW + 2)} y={H - 20 - bh} width={barW} height={bh} fill={ds.color} rx="3" opacity="0.85" />;
            })}
            <text x={pad + i * groupW + groupW / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{l}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT MANAGER MODAL
// ─────────────────────────────────────────────────────────────────────────────

const CLIENTS_KEY = "fp_clients_v1";

function loadClients() {
  try { const s = localStorage.getItem(CLIENTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
function saveClients(clients) {
  try { localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients)); } catch {}
}

const ClientManager = ({ currentState, onLoad, onClose }) => {
  const [clients, setClients] = useState(loadClients);
  const [search, setSearch] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const saveCurrentAsNew = () => {
    const name = [currentState.p1.jmeno, currentState.p1.prijmeni].filter(Boolean).join(" ") || "Nový klient";
    const id = Date.now().toString();
    const updated = [{ id, name, updated: new Date().toISOString(), data: currentState }, ...clients];
    setClients(updated); saveClients(updated);
    showToast(`Uloženo: ${name}`);
  };

  const saveOverExisting = (id) => {
    const updated = clients.map(c => c.id === id ? { ...c, data: currentState, updated: new Date().toISOString() } : c);
    setClients(updated); saveClients(updated);
    showToast("Přepsáno ✓");
  };

  const deleteClient = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated); saveClients(updated);
    setConfirmDel(null);
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Správa klientů</h2>
            <p className="text-xs text-gray-400 mt-0.5">{clients.length} klientů uloženo lokálně</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-lg">×</button>
        </div>
        {/* Search + save new */}
        <div className="px-6 py-4 border-b border-gray-50 flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hledat klienta…"
            className="flex-1 h-9 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-300" />
          <button onClick={saveCurrentAsNew} className="px-4 h-9 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap">
            + Uložit aktuálního
          </button>
        </div>
        {/* Client list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-300">
              {clients.length === 0 ? "Zatím žádní uložení klienti" : "Žádný klient neodpovídá hledání"}
            </div>
          )}
          {filtered.map(c => (
            <div key={c.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{new Date(c.updated).toLocaleDateString("cs-CZ", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => { onLoad(c.data); onClose(); }} className="px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Načíst</button>
                <button onClick={() => saveOverExisting(c.id)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Přepsat</button>
                {confirmDel === c.id
                  ? <button onClick={() => deleteClient(c.id)} className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors">Smazat?</button>
                  : <button onClick={() => setConfirmDel(c.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-200 hover:text-red-400 hover:bg-red-50 transition-all text-base">×</button>}
              </div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-300">Data jsou uložena pouze v tomto prohlížeči</p>
            <label className="text-xs font-semibold text-gray-400 hover:text-emerald-600 cursor-pointer transition-colors">
              ↑ Importovat JSON
              <input type="file" accept=".json" className="hidden" onChange={e => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  try {
                    const data = JSON.parse(ev.target.result);
                    const name = [data.p1?.jmeno, data.p1?.prijmeni].filter(Boolean).join(" ") || file.name.replace(".json", "");
                    const id = Date.now().toString();
                    const updated = [{ id, name, updated: new Date().toISOString(), data }, ...clients];
                    setClients(updated); saveClients(updated);
                    showToast(`Importováno: ${name}`);
                  } catch { showToast("Chyba: neplatný JSON soubor"); }
                };
                reader.readAsText(file);
                e.target.value = "";
              }} />
            </label>
          </div>
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Zavřít</button>
        </div>
        {/* Toast */}
        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl shadow-lg whitespace-nowrap animate-bounce">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARE VIA URL
// ─────────────────────────────────────────────────────────────────────────────

// Komprese: simple UTF-8 → base64, bez závislostí
// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE DRIVE INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────

// NASTAVENÍ — vyplňte po registraci na console.cloud.google.com:
const GDRIVE_CLIENT_ID = "963472334671-9cf0qjv094op3dou6lrsgf6j5oc8a1lf.apps.googleusercontent.com";
const GDRIVE_API_KEY   = "AIzaSyApqkPFkpd-aapQkxasbdRUScoKt8mwmHU";
const GDRIVE_SCOPE     = "https://www.googleapis.com/auth/drive.file";
const GDRIVE_FOLDER    = "Kadlec_FinancniPlany";

function loadScript(src, check) {
  return new Promise(resolve => {
    if (check()) return resolve();
    const s = document.createElement("script"); s.src = src; s.onload = resolve;
    document.head.appendChild(s);
  });
}
async function initGapi() {
  await loadScript("https://apis.google.com/js/api.js", () => !!window.gapi);
  await new Promise(r => window.gapi.load("client", r));
  await window.gapi.client.init({ apiKey: GDRIVE_API_KEY, discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"] });
}
async function getToken() {
  await loadScript("https://accounts.google.com/gsi/client", () => !!window.google?.accounts);
  return new Promise((resolve, reject) => {
    const c = window.google.accounts.oauth2.initTokenClient({
      client_id: GDRIVE_CLIENT_ID, scope: GDRIVE_SCOPE,
      callback: r => r.error ? reject(new Error(r.error)) : resolve(r.access_token),
    });
    c.requestAccessToken({ prompt: "" });
  });
}
async function driveReq(path, opts = {}, token) {
  const r = await fetch("https://www.googleapis.com/drive/v3" + path, {
    ...opts, headers: { Authorization: "Bearer " + token, ...(opts.headers || {}) },
  });
  if (!r.ok) throw new Error("Drive API " + r.status);
  if (opts.noJson) return null;
  return r.json();
}
async function getFolderId(token) {
  const d = await driveReq(`/files?q=name='${GDRIVE_FOLDER}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`, {}, token);
  if (d.files?.length) return d.files[0].id;
  const c = await driveReq("/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: GDRIVE_FOLDER, mimeType: "application/vnd.google-apps.folder" }) }, token);
  return c.id;
}
async function driveList(token) {
  const fid = await getFolderId(token);
  const d = await driveReq(`/files?q='${fid}' in parents and trashed=false and mimeType='application/json'&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`, {}, token);
  return d.files || [];
}
async function driveSave(token, name, json) {
  const fid = await getFolderId(token);
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ name, mimeType: "application/json", parents: [fid] })], { type: "application/json" }));
  form.append("file", new Blob([json], { type: "application/json" }));
  return fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method: "POST", headers: { Authorization: "Bearer " + token }, body: form }).then(r => r.json());
}
async function driveLoad(token, fileId) {
  const r = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: { Authorization: "Bearer " + token } });
  return r.json();
}
async function driveDelete(token, fileId) {
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
}

function downloadJson(state) {
  const name = [state.p1?.jmeno, state.p1?.prijmeni].filter(Boolean).join("_") || "klient";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
  a.download = `fp_${name}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

const DriveModal = ({ state, onLoad, onClose }) => {
  const [phase, setPhase] = useState("idle"); // idle | loading | list | error
  const [token, setToken] = useState(null);
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const configured = GDRIVE_CLIENT_ID !== "VASE_CLIENT_ID.apps.googleusercontent.com";

  const connect = async () => {
    setPhase("loading"); setMsg("Přihlašování…");
    try {
      await initGapi();
      const t = await getToken();
      setToken(t); setMsg("Načítám zálohy…");
      setFiles(await driveList(t)); setPhase("list");
    } catch (e) { setPhase("error"); setMsg(e.message); }
  };

  const save = async () => {
    setMsg("Ukládám…");
    const name = [state.p1?.jmeno, state.p1?.prijmeni].filter(Boolean).join("_") || "klient";
    try {
      await driveSave(token, `fp_${name}_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2));
      setFiles(await driveList(token)); setMsg("✓ Uloženo na Drive");
    } catch (e) { setMsg("Chyba: " + e.message); }
  };

  const load = async (id) => {
    setMsg("Načítám…");
    try { const d = await driveLoad(token, id); onLoad(d); onClose(); }
    catch (e) { setMsg("Chyba: " + e.message); }
  };

  const del = async (id) => {
    setMsg("Mažu…");
    try { await driveDelete(token, id); setFiles(await driveList(token)); setConfirmDel(null); setMsg("Smazáno ✓"); }
    catch (e) { setMsg("Chyba: " + e.message); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">📁</div>
            <div><h2 className="text-base font-semibold text-gray-900">Google Drive záloha</h2><p className="text-xs text-gray-400 mt-0.5">Složka: {GDRIVE_FOLDER}</p></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-lg">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">

          {!configured && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
              <p className="text-sm font-semibold text-blue-800">⚙️ Jednorázové nastavení Google API</p>
              <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Otevřete <span className="font-mono bg-white px-1 rounded border border-blue-100">console.cloud.google.com</span> → Nový projekt</li>
                <li><strong>APIs & Services → Enable APIs</strong> → vyhledejte <em>Google Drive API</em> → Enable</li>
                <li><strong>Credentials → Create Credentials → OAuth 2.0 Client ID</strong> → Web application</li>
                <li>Přidejte do <em>Authorized JavaScript origins</em> vaši doménu (nebo localhost)</li>
                <li>Zkopírujte <em>Client ID</em> a <em>API Key</em> do souboru KlientProfil.jsx (řádky GDRIVE_CLIENT_ID / GDRIVE_API_KEY)</li>
              </ol>
              <p className="text-xs text-blue-400">Nastavení trvá ~10 minut. Soubory budou uloženy v Google Drive ve složce <em>{GDRIVE_FOLDER}</em>, přístupné z PC i iOS.</p>
            </div>
          )}

          {configured && phase === "idle" && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">Připojte Google účet pro přístup k zálohám</p>
              <button onClick={connect} className="px-6 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm font-semibold text-gray-700 rounded-xl shadow-sm flex items-center gap-2 mx-auto transition-all">
                🔑 Přihlásit přes Google
              </button>
            </div>
          )}

          {configured && phase === "loading" && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">{msg}</p>
            </div>
          )}

          {configured && phase === "error" && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 mb-2">{msg}</p>
              <button onClick={connect} className="text-xs font-semibold text-red-400 hover:text-red-600">↺ Zkusit znovu</button>
            </div>
          )}

          {configured && phase === "list" && (
            <>
              <button onClick={save} className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                ☁️ Uložit aktuálního klienta na Drive
              </button>
              {msg && <p className="text-xs text-center font-medium text-emerald-600">{msg}</p>}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Zálohy na Drive ({files.length})</p>
                {files.length === 0 && <p className="text-sm text-gray-300 text-center py-4">Zatím žádné zálohy</p>}
                <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 rounded-xl border border-gray-100">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                      <span className="text-sm shrink-0">📄</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{f.name}</p>
                        <p className="text-xs text-gray-400">{new Date(f.modifiedTime).toLocaleDateString("cs-CZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => load(f.id)} className="px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Načíst</button>
                        {confirmDel === f.id
                          ? <button onClick={() => del(f.id)} className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors">Smazat?</button>
                          : <button onClick={() => setConfirmDel(f.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-200 hover:text-red-400 hover:bg-red-50 transition-all">×</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Záloha bez internetu (vždy funguje)</p>
            <div className="flex gap-2">
              <button onClick={() => downloadJson(state)} className="flex-1 h-9 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">↓ Stáhnout .json</button>
              <label className="flex-1 h-9 flex items-center justify-center text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
                ↑ Načíst .json
                <input type="file" accept=".json" className="hidden" onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const r = new FileReader(); r.onload = ev => { try { onLoad(JSON.parse(ev.target.result)); onClose(); } catch { alert("Neplatný soubor"); } };
                  r.readAsText(file); e.target.value = "";
                }} />
              </label>
            </div>
            <p className="text-xs text-gray-300 mt-1.5 text-center">Uložte do iCloud Drive nebo Google Drive ručně — dostupné na všech zařízeních</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRINT STYLES (injected into head once)
// ─────────────────────────────────────────────────────────────────────────────

const PRINT_CSS = `
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
  header, nav, [data-no-print] { display: none !important; }
  .max-w-screen-xl { max-width: 100% !important; padding: 0 !important; }
  main { padding: 0 !important; }
  .shadow-sm, .shadow-md { box-shadow: none !important; }
  .rounded-2xl, .rounded-xl { border-radius: 8px !important; }
  * { page-break-inside: avoid; }
  h1, h2, h3 { page-break-after: avoid; }
}
`;

function injectPrintStyles() {
  if (document.getElementById("fp-print-css")) return;
  const s = document.createElement("style");
  s.id = "fp-print-css";
  s.innerHTML = PRINT_CSS;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────

const Topbar = ({ activeTab, onTabChange, onSave, isDirty, clientName, currentState, onLoad }) => {
  const tabs = [
    { id: "vstup", label: "Klient & Data" }, { id: "smlouvy", label: "Smlouvy" },
    { id: "dashboard", label: "Dashboard" }, { id: "grafy", label: "Analýzy" },
    { id: "plan", label: "Finanční plán" }, { id: "kalkulacky", label: "Kalkulačky" },
  ];
  const [showClients, setShowClients] = useState(false);
  const [showDrive, setShowDrive] = useState(false);

  const handlePdf = () => {
    injectPrintStyles();
    // Switch to plan tab for best print output
    onTabChange("plan");
    setTimeout(() => window.print(), 300);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-6">
          <div className="shrink-0 flex items-baseline gap-1 select-none">
            <span className="text-base font-bold text-gray-900 tracking-tight">Kadlec</span>
            <span className="text-base font-light text-gray-400 tracking-tight">& partneři</span>
          </div>
          <div className="h-5 w-px bg-gray-200 shrink-0" />
          <nav className="flex items-center gap-0.5 flex-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => onTabChange(t.id)}
                className={`relative px-3.5 py-2 rounded-lg text-sm transition-all ${activeTab === t.id ? "font-semibold text-emerald-600 bg-emerald-50" : "font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                {t.label}
                {activeTab === t.id && <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-emerald-500 rounded-full" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {/* Client switcher */}
            <button onClick={() => setShowClients(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-gray-100 hover:border-gray-200 transition-all">
              <span>👥</span><span className="max-w-[110px] truncate">{clientName || "Klient"}</span>
              <span className="text-gray-300">▾</span>
            </button>
            {/* Drive záloha */}
            <button onClick={() => setShowDrive(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-gray-100 hover:border-gray-200 transition-all" title="Google Drive záloha">
              <span>☁️</span><span className="hidden sm:inline">Drive</span>
            </button>
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${isDirty ? "bg-amber-400 shadow-[0_0_6px] shadow-amber-400/60" : "bg-gray-200"}`} />
            <button onClick={onSave} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">Uložit</button>
            <button onClick={handlePdf} className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors">
              <span>↓</span> PDF
            </button>
          </div>
        </div>
      </header>
      {showClients && <ClientManager currentState={currentState} onLoad={onLoad} onClose={() => setShowClients(false)} />}
      {showDrive && <DriveModal state={currentState} onLoad={onLoad} onClose={() => setShowDrive(false)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: VSTUP
// ─────────────────────────────────────────────────────────────────────────────

const PersonCard = ({ label, accent, data, onChange }) => {
  const initials = `${(data.jmeno?.[0] || "").toUpperCase()}${(data.prijmeni?.[0] || "").toUpperCase()}`;
  const fullName = [data.titul, data.jmeno, data.prijmeni].filter(Boolean).join(" ") || label;
  const f = field => e => onChange(field, e.target.value);
  return (
    <Card>
      <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${accent ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}>{initials || "–"}</div>
        <div><h3 className="text-base font-semibold text-gray-900">{fullName}</h3><p className="text-xs text-gray-400 mt-0.5">{label}</p></div>
      </div>
      <div className="px-7 py-6 grid grid-cols-2 gap-x-5 gap-y-4">
        <Field label="Příjmení"><Input placeholder="Novák" value={data.prijmeni} onChange={f("prijmeni")} /></Field>
        <Field label="Jméno"><Input placeholder="Jan" value={data.jmeno} onChange={f("jmeno")} /></Field>
        <Field label="Titul"><Input placeholder="Ing." value={data.titul} onChange={f("titul")} /></Field>
        <Field label="Rok narození"><Input type="number" placeholder="1985" value={data.rok} onChange={f("rok")} /></Field>
        <SectionDiv title="Identifikace" />
        <Field label="Rodné číslo"><Input placeholder="850101/1234" value={data.rc} onChange={f("rc")} /></Field>
        <Field label="OP č. / platnost"><Input placeholder="123456 / 12.2030" value={data.op} onChange={f("op")} /></Field>
        <Field label="Státní příslušnost"><Input value={data.stat} onChange={f("stat")} /></Field>
        <Field label="Rodinný stav">
          <Sel value={data.stav} onChange={f("stav")}><option>ženatý / vdaná</option><option>svobodný / á</option><option>rozvedený / á</option><option>vdovec / vdova</option></Sel>
        </Field>
        <SectionDiv title="Kontakt" />
        <Field label="E-mail" span={2}><Input type="email" placeholder="jan@email.cz" value={data.email} onChange={f("email")} /></Field>
        <Field label="Telefon"><Input placeholder="+420 777 000 000" value={data.tel} onChange={f("tel")} /></Field>
        <Field label="Číslo účtu"><Input placeholder="123456/0800" value={data.ucet} onChange={f("ucet")} /></Field>
        <Field label="Adresa" span={2}><Input placeholder="Ulice 12, 110 00 Praha 1" value={data.adresa} onChange={f("adresa")} /></Field>
        <SectionDiv title="Profil" />
        <Field label="Povolání"><Input placeholder="Ekonom" value={data.povolani} onChange={f("povolani")} /></Field>
        <Field label="Malé úrazy"><Sel value={data.urazy} onChange={f("urazy")}><option value="ne">Ne</option><option value="ano">Ano</option></Sel></Field>
        <Field label="Sport / koníčky" span={2}><Input placeholder="Tenis, cyklistika…" value={data.sport} onChange={f("sport")} /></Field>
      </div>
    </Card>
  );
};

const IncomeTable = ({ p1, p2, onChange }) => {
  const cols = [{ k: "hlavni", l: "Hlavní příjem" }, { k: "vedlejsi", l: "Vedlejší příjem" }, { k: "pasivni", l: "Pasivní příjem" }];
  const p1t = cols.reduce((s, c) => s + num(p1[c.k]), 0), p2t = cols.reduce((s, c) => s + num(p2[c.k]), 0);
  const total = p1t + p2t;
  const persons = [{ key: "p1", label: [p1.jmeno, p1.prijmeni].filter(Boolean).join(" ") || "Osoba 1", data: p1, total: p1t }, { key: "p2", label: [p2.jmeno, p2.prijmeni].filter(Boolean).join(" ") || "Osoba 2", data: p2, total: p2t }];
  return (
    <Card>
      <CardHeader title="Měsíční čistý příjem" sub="Čisté příjmy v Kč / měsíc" right={<span className="font-mono text-sm font-bold text-emerald-600">{fmt(total)}</span>} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left pl-7 pr-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400 w-36">Osoba</th>
            {cols.map(c => <th key={c.k} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">{c.l}</th>)}
            <th className="text-right px-7 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Celkem</th>
          </tr></thead>
          <tbody>
            {persons.map(p => (
              <tr key={p.key} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="pl-7 pr-4 py-2.5 font-medium text-gray-700 text-xs">{p.label}</td>
                {cols.map(c => <td key={c.k} className="px-4 py-2"><InlineInput value={p.data[c.k]} onChange={e => onChange(p.key, c.k, e.target.value)} /></td>)}
                <td className="px-7 py-2.5 text-right font-mono text-sm font-semibold text-emerald-600">{fmt(p.total)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50/80">
              <td className="pl-7 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Celkem</td>
              {cols.map(c => <td key={c.k} className="px-4 py-3 font-mono text-xs text-gray-400 text-center">{fmt(num(p1[c.k]) + num(p2[c.k]))}</td>)}
              <td className="px-7 py-3 text-right font-mono text-base font-bold text-gray-900">{fmt(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const ExpensesTable = ({ data, onChange }) => {
  const rows = [{ k: "bydleni", l: "Bydlení", hint: "Energie, nájem, pojištění" }, { k: "auto", l: "Auto", hint: "PHM, servis, pojistné" }, { k: "sporeni", l: "Spoření / pojistné", hint: "Stávající smlouvy" }, { k: "deti", l: "Děti", hint: "Školka, škola, kroužky" }, { k: "zavazky", l: "Závazky", hint: "Splátky úvěrů" }, { k: "ostatni", l: "Ostatní", hint: "Potraviny, dovolená" }];
  const total = rows.reduce((s, r) => s + num(data[r.k]), 0);
  return (
    <Card>
      <CardHeader title="Měsíční výdaje" sub="Pravidelné výdaje domácnosti" right={<div className="text-right"><p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Celkem</p><p className="text-base font-bold font-mono text-gray-900">{fmt(total)}</p></div>} />
      <div className="divide-y divide-gray-50">
        {rows.map(r => (
          <div key={r.k} className="px-7 py-3.5 flex items-center gap-6 hover:bg-gray-50/40 transition-colors">
            <div className="w-44 shrink-0"><p className="text-sm font-medium text-gray-700">{r.l}</p><p className="text-xs text-gray-400 mt-0.5">{r.hint}</p></div>
            <div className="flex-1"><InlineInput value={data[r.k]} onChange={e => onChange(r.k, e.target.value)} /></div>
            <div className="w-28 text-right font-mono text-sm text-gray-500">{fmt(num(data[r.k]))}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const ChildrenTable = ({ data, onChange }) => (
  <Card>
    <CardHeader title="Děti" sub="Osoby v domácnosti" />
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100">
          {["#", "Příjmení", "Jméno", "Rok nar.", "Malé úrazy", "Sport / koníčky"].map(h => (
            <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-gray-400 first:pl-7 last:pr-7">{h}</th>
          ))}
        </tr></thead>
        <tbody>{[1, 2, 3].map(i => (
          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
            <td className="pl-7 pr-2 py-2.5 text-xs text-gray-400 font-medium">Dítě {i}</td>
            <td className="px-2 py-2"><InlineInput type="text" placeholder="Příjmení" value={data[i]?.prijmeni} onChange={e => onChange(i, "prijmeni", e.target.value)} /></td>
            <td className="px-2 py-2"><InlineInput type="text" placeholder="Jméno" value={data[i]?.jmeno} onChange={e => onChange(i, "jmeno", e.target.value)} /></td>
            <td className="px-2 py-2"><InlineInput placeholder="2018" value={data[i]?.rok} onChange={e => onChange(i, "rok", e.target.value)} className="w-24" /></td>
            <td className="px-2 py-2"><select value={data[i]?.urazy || "ne"} onChange={e => onChange(i, "urazy", e.target.value)} className="h-9 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"><option value="ne">Ne</option><option value="ano">Ano</option></select></td>
            <td className="px-2 py-2 pr-7"><InlineInput type="text" placeholder="Sport…" value={data[i]?.sport} onChange={e => onChange(i, "sport", e.target.value)} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </Card>
);

const LiabilitiesTable = ({ data, onChange }) => {
  const rows = [{ k: "hypo", l: "Hypotéka" }, { k: "spotreb", l: "Spotřebitelský úvěr" }, { k: "kreditka", l: "Kreditní karta" }, { k: "konto", l: "Kontokorent" }, { k: "vyzivne", l: "Výživné" }, { k: "leasing", l: "Leasing" }];
  const tSpl = rows.reduce((s, r) => s + num(data[r.k]?.spl), 0), tZbv = rows.reduce((s, r) => s + num(data[r.k]?.zbv), 0);
  return (
    <Card>
      <CardHeader title="Závazky a úvěry" right={<span className="text-xs font-mono text-red-400">Splátky: {fmt(tSpl)}</span>} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">
            {["Typ", "Popis", "Splátka/měs.", "Zbývá (Kč)", "Úrok %"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400 first:pl-7 last:pr-7">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.k} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                <td className="pl-7 pr-2 py-2.5 text-xs font-medium text-gray-500 w-32">{r.l}</td>
                <td className="px-2 py-2"><InlineInput type="text" placeholder="Popis…" value={data[r.k]?.popis} onChange={e => onChange(r.k, "popis", e.target.value)} /></td>
                <td className="px-2 py-2"><InlineInput value={data[r.k]?.spl} onChange={e => onChange(r.k, "spl", e.target.value)} /></td>
                <td className="px-2 py-2"><InlineInput value={data[r.k]?.zbv} onChange={e => onChange(r.k, "zbv", e.target.value)} /></td>
                <td className="px-2 py-2 pr-7"><InlineInput value={data[r.k]?.urok} onChange={e => onChange(r.k, "urok", e.target.value)} placeholder="%" className="w-16" /></td>
              </tr>
            ))}
            <tr className="bg-gray-50"><td className="pl-7 py-3 text-xs font-bold uppercase tracking-widest text-gray-500" colSpan={2}>Celkem</td><td className="px-2 py-3 font-mono text-sm font-bold text-red-400">{fmt(tSpl)}</td><td className="px-2 py-3 font-mono text-sm font-bold text-red-400">{fmtM(tZbv)}</td><td /></tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const AssetsTable = ({ data, onChange }) => {
  const rows = [{ k: "auto1", l: "Auto" }, { k: "auto2", l: "Auto 2" }, { k: "nem1", l: "Nemovitost" }, { k: "nem2", l: "Nem. pronájem" }, { k: "rezerva", l: "Rezerva / úspory" }, { k: "invest", l: "Investice" }];
  const total = rows.reduce((s, r) => s + num(data[r.k]?.hod), 0);
  return (
    <Card>
      <CardHeader title="Majetek" right={<span className="text-xs font-mono font-bold text-emerald-600">Celkem: {fmtM(total)}</span>} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">
            {["Typ", "Popis", "Hodnota (Kč)", "Rok pořízení"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400 first:pl-7 last:pr-7">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.k} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                <td className="pl-7 pr-2 py-2.5 text-xs font-medium text-gray-500 w-32">{r.l}</td>
                <td className="px-2 py-2"><InlineInput type="text" placeholder="Popis…" value={data[r.k]?.popis} onChange={e => onChange(r.k, "popis", e.target.value)} /></td>
                <td className="px-2 py-2"><InlineInput value={data[r.k]?.hod} onChange={e => onChange(r.k, "hod", e.target.value)} /></td>
                <td className="px-2 py-2 pr-7"><InlineInput value={data[r.k]?.rok} onChange={e => onChange(r.k, "rok", e.target.value)} placeholder="2020" className="w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const GoalsTable = ({ goals, onChange }) => (
  <Card>
    <CardHeader title="Finanční cíle" sub="Životní milníky a plán spoření" />
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100">
          {["Název cíle", "Rok", "Částka (Kč)", "Poznámka", "Horizont", "S inflací (2 %)", "Měs. spoření"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400 first:pl-7 last:pr-7">{h}</th>)}
        </tr></thead>
        <tbody>
          {goals.map((g, i) => {
            const h = Math.max(0, num(g.rok) - CY);
            const inf = g.castka && h ? Math.abs(FV(0.02, h, 0, -num(g.castka))) : num(g.castka);
            const mes = h > 0 && inf > 0 ? inf / 12 / h : 0;
            return (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                <td className="pl-7 pr-2 py-2"><InlineInput type="text" placeholder="Penze, auto…" value={g.nazev} onChange={e => onChange(i, "nazev", e.target.value)} /></td>
                <td className="px-2 py-2"><InlineInput placeholder="2035" value={g.rok} onChange={e => onChange(i, "rok", e.target.value)} className="w-20" /></td>
                <td className="px-2 py-2"><InlineInput value={g.castka} onChange={e => onChange(i, "castka", e.target.value)} /></td>
                <td className="px-2 py-2"><InlineInput type="text" placeholder="Poznámka…" value={g.pozn} onChange={e => onChange(i, "pozn", e.target.value)} /></td>
                <td className="px-2 py-2 text-xs font-mono text-gray-400">{h > 0 ? h + " let" : "—"}</td>
                <td className="px-2 py-2 text-xs font-mono text-amber-600">{inf > 0 ? fmtM(inf) : "—"}</td>
                <td className="px-2 py-2 pr-7 text-xs font-mono text-emerald-600 font-semibold">{mes > 0 ? fmt(mes) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// CZ MZDOVÝ KALKULÁTOR
// ─────────────────────────────────────────────────────────────────────────────

// Sazby 2024/2025 CZ
const CZ_TAX = {
  sleva_poplatnik: 30840 / 12,   // měsíční sleva na poplatníka
  sleva_dite1: 15204 / 12,       // 1. dítě
  sleva_dite2: 22320 / 12,       // 2. dítě
  sleva_dite3: 27840 / 12,       // 3.+ dítě
  soc_zam: 0.065,                // sociální pojištění zaměstnanec
  zdrav_zam: 0.045,              // zdravotní pojištění zaměstnanec
  soc_zam_zamestnavatel: 0.248,  // soc. zam. zaměstnavatel
  zdrav_zam_zamestnavatel: 0.09, // zdrav. zam. zaměstnavatel
  dan_sazba: 0.15,               // 15 % do limitu
  dan_sazba_vyssi: 0.23,         // 23 % nad limit (4× průměrná mzda / měsíc)
  limit_23: 131901,              // hranice 23% pásma (2025)
  min_vymezovaci_zaklad: 17300,  // min. vym. základ pro zdrav. 2025
  // Nemocenská (DPN)
  nemocenska_1_3: 0.60,          // 1.–3. den (karenční — zaměstnavatel neplatí, od 2022 platí)
  nemocenska_4_14: 0.60,         // 4.–14. den — zaměstnavatel, 60 % denního VZ
  nemocenska_od15: 0.60,         // od 15. dne — ČSSZ, 60 %
  // Důchod — orientační
  duchod_base_2025: 4040,        // základní výměra 2025 Kč/měs
  duchod_procent_za_rok: 0.015,  // 1,5 % výpočtového základu za odpracovaný rok
};

// Pomocná pro redukci DVZ
function dvzBound(val, low, high) { return Math.max(0, Math.min(val, high) - low); }
function calcMzdaFixed({ hrubaRocni, deti = 0, invalidita = false, student = false }) {
  const hruba = num(hrubaRocni) / 12;
  if (!hruba) return null;
  const zakladDane = hruba;
  const danCast1 = Math.min(zakladDane, CZ_TAX.limit_23) * CZ_TAX.dan_sazba;
  const danCast2 = zakladDane > CZ_TAX.limit_23 ? (zakladDane - CZ_TAX.limit_23) * CZ_TAX.dan_sazba_vyssi : 0;
  let dan = danCast1 + danCast2;
  dan -= CZ_TAX.sleva_poplatnik;
  if (student) dan -= 335;
  if (invalidita) dan -= 210;
  let slevaDeti = 0;
  if (deti >= 1) slevaDeti += CZ_TAX.sleva_dite1;
  if (deti >= 2) slevaDeti += CZ_TAX.sleva_dite2;
  if (deti >= 3) slevaDeti += (deti - 2) * CZ_TAX.sleva_dite3;
  dan -= slevaDeti;
  const danFinal = Math.max(dan, -slevaDeti);
  const danZaplacena = Math.max(0, danFinal);
  const danBonusVyplacen = danFinal < 0 ? Math.abs(danFinal) : 0;
  const sozZam = Math.round(hruba * CZ_TAX.soc_zam);
  const zdravZam = Math.max(Math.round(hruba * CZ_TAX.zdrav_zam), Math.round(CZ_TAX.min_vymezovaci_zaklad * CZ_TAX.zdrav_zam));
  const cista = hruba - danZaplacena + danBonusVyplacen - sozZam - zdravZam;
  const sozZamestnavatel = Math.round(hruba * CZ_TAX.soc_zam_zamestnavatel);
  const zdravZamestnavatel = Math.round(hruba * CZ_TAX.zdrav_zam_zamestnavatel);
  const nakladyZam = hruba + sozZamestnavatel + zdravZamestnavatel;
  // DVZ redukovaný pro nemocenskou
  const dvz = hruba / 30;
  const dvzReduk = Math.round(
    dvzBound(dvz, 0, 1466) * 0.90 +
    dvzBound(dvz, 1466, 2199) * 0.60 +
    dvzBound(dvz, 2199, 4399) * 0.30
  );
  const nemocenska14dni = dvzReduk * 0.60 * 14;
  const nemocenskaDenicniOd15 = Math.round(dvzReduk * 0.60);
  const duchod_orientacni = (roky) =>
    Math.round(CZ_TAX.duchod_base_2025 + (hruba * 0.80) * CZ_TAX.duchod_procent_za_rok * roky);
  return {
    hruba: Math.round(hruba),
    cista: Math.round(cista),
    dan: Math.round(danZaplacena),
    danBonus: Math.round(danBonusVyplacen),
    sozZam,
    zdravZam,
    sozZamestnavatel,
    zdravZamestnavatel,
    nakladyZam: Math.round(nakladyZam),
    nemocenska14dni: Math.round(nemocenska14dni),
    nemocenskaDenicniOd15,
    dvzReduk,
    duchod_orientacni,
    efektivniSazba: hruba > 0 ? danZaplacena / hruba : 0,
  };
}

const Toggle = ({ checked, onChange, label }) => (
  <button onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-emerald-500" : "bg-gray-200"}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    {label && <span className="ml-14 text-sm font-medium text-gray-600 whitespace-nowrap">{label}</span>}
  </button>
);

const MzdaKalkulator = ({ mzdaData, onChange }) => {
  const [open, setOpen] = useState(false);
  const { p1hruba, p1deti, p1invalidita, p1student, p1enabled,
          p2hruba, p2deti, p2invalidita, p2student, p2enabled } = mzdaData;

  const r1 = p1enabled ? calcMzdaFixed({ hrubaRocni: num(p1hruba) * 12, deti: num(p1deti), invalidita: p1invalidita, student: p1student }) : null;
  const r2 = p2enabled ? calcMzdaFixed({ hrubaRocni: num(p2hruba) * 12, deti: num(p2deti), invalidita: p2invalidita, student: p2student }) : null;

  const PersonMzda = ({ label, prefix, result, enabled, hruba, deti, invalidita, student, accent }) => {
    const vek = prefix === "p1" ? null : null; // can extend later
    const odRokPraceOdh = 35; // orientační délka kariéry
    return (
      <div className={`rounded-xl border p-5 transition-all ${enabled ? "border-gray-100 bg-white" : "border-dashed border-gray-200 bg-gray-50/50 opacity-60"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${accent ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>{label[0]}</div>
            <span className="text-sm font-semibold text-gray-800">{label}</span>
          </div>
          <Toggle checked={enabled} onChange={v => onChange(prefix + "enabled", v)} />
        </div>
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label>Hrubá mzda / měsíc (Kč)</Label>
            <Input type="number" placeholder="50 000" value={hruba} onChange={e => onChange(prefix + "hruba", e.target.value)} className={!enabled ? "opacity-50 pointer-events-none" : ""} />
          </div>
          <div>
            <Label>Počet dětí (daňový bonus)</Label>
            <Sel value={deti} onChange={e => onChange(prefix + "deti", e.target.value)} className={!enabled ? "opacity-50 pointer-events-none" : ""}>
              <option value="0">0 dětí</option><option value="1">1 dítě</option><option value="2">2 děti</option><option value="3">3 děti</option><option value="4">4+ děti</option>
            </Sel>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" checked={student} onChange={e => onChange(prefix + "student", e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" disabled={!enabled} />
            <span className="text-xs text-gray-500">Sleva na studenta</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" checked={invalidita} onChange={e => onChange(prefix + "invalidita", e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" disabled={!enabled} />
            <span className="text-xs text-gray-500">Invalidita I./II. st.</span>
          </div>
        </div>
        {/* Results */}
        {result && enabled && (
          <div className="space-y-0 border-t border-gray-100 pt-4">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Hrubá mzda</span>
              <span className="font-mono text-xs text-gray-600">{fmt(result.hruba)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Sociální poj. (6,5 %)</span>
              <span className="font-mono text-xs text-red-400">− {fmt(result.sozZam)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Zdravotní poj. (4,5 %)</span>
              <span className="font-mono text-xs text-red-400">− {fmt(result.zdravZam)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Záloha na daň</span>
              <span className="font-mono text-xs text-red-400">− {fmt(result.dan)}</span>
            </div>
            {result.danBonus > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-gray-400">Daňový bonus (děti)</span>
                <span className="font-mono text-xs text-emerald-500">+ {fmt(result.danBonus)}</span>
              </div>
            )}
            <div className="flex justify-between py-2.5 border-b border-emerald-100 bg-emerald-50 -mx-5 px-5 mt-1">
              <span className="text-sm font-bold text-emerald-800">Čistá mzda</span>
              <span className="font-mono text-sm font-bold text-emerald-700">{fmt(result.cista)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50 mt-1">
              <span className="text-xs text-gray-400">Efektivní daňová sazba</span>
              <span className="font-mono text-xs text-gray-500">{fmtP(result.efektivniSazba)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Náklady zaměstnavatele</span>
              <span className="font-mono text-xs text-gray-500">{fmt(result.nakladyZam)}</span>
            </div>
            {/* Nemocenská */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Nemocenská (zpětný výpočet)</p>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-gray-400">DVZ redukovaný</span>
                <span className="font-mono text-xs text-gray-500">{fmt(result.dvzReduk)}/den</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-gray-400">Náhrada 1.–14. den (zam.)</span>
                <span className="font-mono text-xs text-amber-600">{fmt(result.nemocenska14dni)} / 14 dní</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-gray-400">Nemocenská od 15. dne (ČSSZ)</span>
                <span className="font-mono text-xs text-amber-600">{fmt(result.nemocenskaDenicniOd15)}/den</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-gray-400">Odhadovaný měsíční výpadek</span>
                <span className="font-mono text-xs text-red-400">− {fmt(result.cista - result.nemocenskaDenicniOd15 * 22)}</span>
              </div>
            </div>
            {/* Důchod */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Orientační starobní důchod</p>
              {[30, 35, 40].map(roky => (
                <div key={roky} className="flex justify-between py-1.5">
                  <span className="text-xs text-gray-400">Po {roky} letech práce</span>
                  <span className="font-mono text-xs text-blue-500 font-semibold">{fmt(result.duchod_orientacni(roky))}/měs.</span>
                </div>
              ))}
              <p className="text-xs text-gray-300 mt-2">* Orientační odhad dle aktuálních sazeb. Skutečný důchod závisí na celkové odpracované době a výdělcích.</p>
            </div>
          </div>
        )}
        {!enabled && (
          <div className="flex items-center justify-center h-16 text-xs text-gray-300">Kalkulátor je vypnutý</div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader
        title="Mzdový kalkulátor CZ 2025"
        sub="Hrubá → čistá mzda, nemocenská, orientační důchod"
        right={
          <button onClick={() => setOpen(o => !o)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${open ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-emerald-500" : "bg-gray-400"}`} />
            {open ? "Kalkulátor zapnut" : "Kalkulátor vypnut"}
          </button>
        }
      />
      {!open && (
        <div className="px-7 py-6 flex items-center gap-3 text-sm text-gray-400">
          <span className="text-lg">🧮</span>
          <span>Zapněte kalkulátor pro automatický výpočet čisté mzdy, nemocenské a orientačního důchodu — výsledky se propíší do příjmů a doporučení.</span>
        </div>
      )}
      {open && (
        <div className="px-7 py-6">
          {/* Propojení info */}
          {(r1?.cista || r2?.cista) && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium">
              <span>✓</span>
              Čistá mzda se automaticky propíše do pole Hlavní příjem a použije se v kalkulačkách, doporučeních a plánu.
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <PersonMzda label="Osoba 1" prefix="p1" result={r1} enabled={p1enabled} hruba={p1hruba} deti={p1deti} invalidita={p1invalidita} student={p1student} accent />
            <PersonMzda label="Osoba 2" prefix="p2" result={r2} enabled={p2enabled} hruba={p2hruba} deti={p2deti} invalidita={p2invalidita} student={p2student} />
          </div>
          {/* Souhrn */}
          {(r1 || r2) && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Souhrn domácnosti</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="font-mono text-base font-bold text-gray-900">{fmt((r1?.hruba || 0) + (r2?.hruba || 0))}</p>
                  <p className="text-xs text-gray-400 mt-1">Celkem hrubé</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="font-mono text-base font-bold text-emerald-700">{fmt((r1?.cista || 0) + (r2?.cista || 0))}</p>
                  <p className="text-xs text-gray-400 mt-1">Celkem čisté</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="font-mono text-base font-bold text-amber-700">{fmt(Math.min(r1?.nemocenska14dni || 0, r2?.nemocenska14dni || 0))}</p>
                  <p className="text-xs text-gray-400 mt-1">Nem. nižší (14 dní)</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="font-mono text-base font-bold text-blue-700">{fmt((r1?.duchod_orientacni(35) || 0) + (r2?.duchod_orientacni(35) || 0))}</p>
                  <p className="text-xs text-gray-400 mt-1">Důchod odhad (35 let)</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 mt-3 text-center">Sazby dle právní úpravy 2025. Kalkulátor slouží jako orientační pomůcka — není daňovým poradenstvím.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const NotesSection = ({ notes, onChange, onAdd }) => (
  <Card>
    <CardHeader title="Záznamy poradce" sub="Průběh schůzek a interní poznámky"
      right={<button onClick={onAdd} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">+ Přidat záznam</button>} />
    <div className="divide-y divide-gray-50">
      {notes.map((note, idx) => (
        <div key={idx} className="px-7 py-5 grid grid-cols-2 gap-5">
          <div><Label>Datum schůzky</Label><Input type="date" value={note.datum} onChange={e => onChange(idx, "datum", e.target.value)} /></div>
          <div><Label>Typ schůzky</Label><Sel value={note.typ} onChange={e => onChange(idx, "typ", e.target.value)}><option>Vstupní analýza</option><option>Průběžná revize</option><option>Produktové jednání</option><option>Jiné</option></Sel></div>
          <div className="col-span-2"><Label>Obsah / poznámky</Label><Textarea value={note.text} onChange={e => onChange(idx, "text", e.target.value)} placeholder="Popis průběhu schůzky…" /></div>
        </div>
      ))}
    </div>
  </Card>
);

const TabVstup = ({ state, dispatch }) => {
  const { p1, p2, children, expenses, goals, liabilities, assets, notes, mzdaData } = state;
  const md = mzdaData || initMzdaData;

  // Přepočet čisté mzdy z kalkulátoru
  const r1 = md.p1enabled && md.p1hruba
    ? calcMzdaFixed({ hrubaRocni: num(md.p1hruba) * 12, deti: num(md.p1deti), invalidita: md.p1invalidita, student: md.p1student })
    : null;
  const r2 = md.p2enabled && md.p2hruba
    ? calcMzdaFixed({ hrubaRocni: num(md.p2hruba) * 12, deti: num(md.p2deti), invalidita: md.p2invalidita, student: md.p2student })
    : null;

  // Pokud je kal. zapnutý, přepíše hlavní příjem
  const p1View = r1 ? { ...p1, hlavni: String(r1.cista) } : p1;
  const p2View = r2 ? { ...p2, hlavni: String(r2.cista) } : p2;

  return (
    <div className="space-y-6">
      <PageHeader title="Klientský profil" sub="Osobní a finanční údaje" />
      <div className="grid grid-cols-2 gap-6">
        <PersonCard label="Hlavní pojistník" accent data={p1} onChange={(f, v) => dispatch({ type: "P1", field: f, value: v })} />
        <PersonCard label="Spolupojistník / Partner" data={p2} onChange={(f, v) => dispatch({ type: "P2", field: f, value: v })} />
      </div>
      <ChildrenTable data={children} onChange={(i, f, v) => dispatch({ type: "CHILD", i, field: f, value: v })} />
      <MzdaKalkulator mzdaData={md} onChange={(field, value) => dispatch({ type: "MZDA", field, value })} />
      <IncomeTable
        p1={p1View} p2={p2View}
        onChange={(p, f, v) => {
          if (f === "hlavni" && ((p === "p1" && r1) || (p === "p2" && r2))) return; // zamčeno kalkulátorem
          dispatch({ type: p === "p1" ? "P1" : "P2", field: f, value: v });
        }}
      />
      <ExpensesTable data={expenses} onChange={(k, v) => dispatch({ type: "EXP", key: k, value: v })} />
      <div className="grid grid-cols-2 gap-6">
        <LiabilitiesTable data={liabilities} onChange={(k, f, v) => dispatch({ type: "LIAB", key: k, field: f, value: v })} />
        <AssetsTable data={assets} onChange={(k, f, v) => dispatch({ type: "ASSET", key: k, field: f, value: v })} />
      </div>
      <GoalsTable goals={goals} onChange={(i, f, v) => dispatch({ type: "GOAL", i, field: f, value: v })} />
      <NotesSection notes={notes} onChange={(i, f, v) => dispatch({ type: "NOTE", i, field: f, value: v })} onAdd={() => dispatch({ type: "NOTE_ADD" })} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: SMLOUVY
// ─────────────────────────────────────────────────────────────────────────────

const ContractSection = ({ title, sub, rows, onChange, onAdd, cols, sumLabel, sumValue }) => (
  <Card>
    <CardHeader title={title} sub={sub} right={sumValue ? <span className="text-xs font-mono font-semibold text-emerald-600">{sumLabel}: {sumValue}</span> : undefined} />
    <div className="px-7 py-3 border-b border-gray-100 grid gap-2 items-center" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr) 32px` }}>
      {cols.map(c => <span key={c.k} className="text-xs font-medium uppercase tracking-widest text-gray-400 truncate">{c.l}</span>)}
      <span />
    </div>
    {rows.map((row, i) => (
      <div key={i} className="px-7 py-2.5 border-b border-gray-50 last:border-0 grid gap-2 items-center hover:bg-gray-50/40 transition-colors" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr) 32px` }}>
        {cols.map(c => (
          <input key={c.k} type={c.t || "text"} placeholder={c.p || ""} value={row[c.k] ?? ""}
            onChange={e => onChange(i, c.k, e.target.value)}
            className="h-9 w-full px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-300" />
        ))}
        <DelBtn onClick={() => onChange(i, "__delete")} />
      </div>
    ))}
    <div className="px-7 py-4"><AddRowBtn onClick={onAdd} label={`+ Přidat ${title.toLowerCase()}`} /></div>
  </Card>
);

const TabSmlouvy = ({ state, dispatch }) => {
  const { spo, poj, zavSmlouvy } = state;
  const spoCols = [{ k: "produkt", l: "Produkt", p: "DIP, ETF…" }, { k: "banka", l: "Instituce" }, { k: "ulozka", l: "Měs. úložka", p: "0", t: "number" }, { k: "jedRaz", l: "Jednor. vklad", p: "0", t: "number" }, { k: "stav", l: "Aktuální stav", p: "0", t: "number" }, { k: "od", l: "Od", t: "date" }, { k: "do", l: "Do", t: "date" }, { k: "cislo", l: "Č. smlouvy" }];
  const pojCols = [{ k: "produkt", l: "Pojistný produkt", p: "ŽP, RŽP…" }, { k: "pojistovna", l: "Pojišťovna" }, { k: "pojistne", l: "Měs. pojistné", p: "0", t: "number" }, { k: "castka", l: "Poj. částka", p: "0", t: "number" }, { k: "typ", l: "Typ", p: "Hlavní/připoj." }, { k: "od", l: "Od", t: "date" }, { k: "do", l: "Do", t: "date" }, { k: "cislo", l: "Č. smlouvy" }];
  const zavCols = [{ k: "typ", l: "Typ závazku", p: "Hypotéka…" }, { k: "banka", l: "Banka" }, { k: "splatka", l: "Splátka/měs.", p: "0", t: "number" }, { k: "zbyvajici", l: "Zbývá", p: "0", t: "number" }, { k: "urok", l: "Úrok %", t: "number" }, { k: "od", l: "Od", t: "date" }, { k: "do", l: "Do", t: "date" }, { k: "cislo", l: "Č. smlouvy" }];
  const spoSum = spo.reduce((s, r) => s + num(r.stav), 0);
  const pojSum = poj.reduce((s, r) => s + num(r.pojistne), 0);
  const zavSum = zavSmlouvy.reduce((s, r) => s + num(r.splatka), 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Současné smlouvy" sub="Portfolio klienta — spoření, pojištění, závazky" />
      <ContractSection title="Spoření a investice" sub="Pravidelné i jednorázové vklady" rows={spo} cols={spoCols} onChange={(i, f, v) => dispatch({ type: "SPO", i, field: f, value: v })} onAdd={() => dispatch({ type: "SPO_ADD" })} sumLabel="Celk. stav" sumValue={fmtM(spoSum)} />
      <ContractSection title="Pojistné smlouvy" sub="Životní, úrazové, majetkové pojištění" rows={poj} cols={pojCols} onChange={(i, f, v) => dispatch({ type: "POJ", i, field: f, value: v })} onAdd={() => dispatch({ type: "POJ_ADD" })} sumLabel="Měs. pojistné" sumValue={fmt(pojSum)} />
      <ContractSection title="Závazky / Úvěry" rows={zavSmlouvy} cols={zavCols} onChange={(i, f, v) => dispatch({ type: "ZAV_SM", i, field: f, value: v })} onAdd={() => dispatch({ type: "ZAV_SM_ADD" })} sumLabel="Měs. splátky" sumValue={<span className="text-red-400">{fmt(zavSum)}</span>} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

const TabDashboard = ({ state }) => {
  const { p1, p2, expenses, liabilities, assets, goals, mzdaData } = state;
  const md = mzdaData || initMzdaData;
  // Přepočet z mzdového kalkulátoru (pokud je zapnutý)
  const mR1 = md.p1enabled && md.p1hruba ? calcMzdaFixed({ hrubaRocni: num(md.p1hruba) * 12, deti: num(md.p1deti), invalidita: md.p1invalidita, student: md.p1student }) : null;
  const mR2 = md.p2enabled && md.p2hruba ? calcMzdaFixed({ hrubaRocni: num(md.p2hruba) * 12, deti: num(md.p2deti), invalidita: md.p2invalidita, student: md.p2student }) : null;
  const p1hlavni = mR1 ? mR1.cista : num(p1.hlavni);
  const p2hlavni = mR2 ? mR2.cista : num(p2.hlavni);
  const p1t = p1hlavni + num(p1.vedlejsi) + num(p1.pasivni), p2t = p2hlavni + num(p2.vedlejsi) + num(p2.pasivni);
  const income = p1t + p2t;
  const vydaje = ["bydleni", "auto", "sporeni", "deti", "zavazky", "ostatni"].reduce((s, k) => s + num(expenses[k]), 0);
  const cf = income - vydaje, uspory = income > 0 ? cf / income : 0;
  const totalLiab = ["hypo", "spotreb", "kreditka", "konto", "vyzivne", "leasing"].reduce((s, k) => s + num(liabilities[k]?.zbv), 0);
  const totalAssets = ["auto1", "auto2", "nem1", "nem2", "rezerva", "invest"].reduce((s, k) => s + num(assets[k]?.hod), 0);
  const nw = totalAssets - totalLiab, dti = income > 0 ? totalLiab / (income * 12) : 0;
  // Nemocenská — výpadek příjmu domácnosti
  const nemVypadek1 = mR1 ? mR1.cista - mR1.nemocenskaDenicniOd15 * 22 : 0;
  const nemVypadek2 = mR2 ? mR2.cista - mR2.nemocenskaDenicniOd15 * 22 : 0;
  const nemVypadekMax = Math.max(nemVypadek1, nemVypadek2);
  const prData = [{ l: "Hlavní P1", v: p1hlavni, c: "#10b981" }, { l: "Vedlejší P1", v: num(p1.vedlejsi), c: "#34d399" }, { l: "Pasivní", v: num(p1.pasivni) + num(p2.pasivni), c: "#6ee7b7" }, { l: "Příjmy P2", v: p2t, c: "#0ea5e9" }];
  const vyData = [{ l: "Bydlení", v: num(expenses.bydleni), c: "#10b981" }, { l: "Auto", v: num(expenses.auto), c: "#f59e0b" }, { l: "Spoření", v: num(expenses.sporeni), c: "#3b82f6" }, { l: "Děti", v: num(expenses.deti), c: "#a78bfa" }, { l: "Závazky", v: num(expenses.zavazky), c: "#ef4444" }, { l: "Ostatní", v: num(expenses.ostatni), c: "#94a3b8" }];
  const goalsTotal = goals.reduce((s, g) => { const h = Math.max(0, num(g.rok) - CY); const inf = g.castka && h ? Math.abs(FV(0.02, h, 0, -num(g.castka))) : num(g.castka); return s + (h > 0 ? inf / 12 / h : 0); }, 0);
  const Alert = ({ show, msg, amber }) => !show ? null : (
    <div className={`flex items-center gap-2.5 px-4 py-3 border rounded-xl text-xs font-medium ${amber ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-red-50 border-red-100 text-red-600"}`}><span>{amber ? "💡" : "⚠"}</span>{msg}</div>
  );
  const Legend = ({ data, total }) => (
    <div className="flex-1 space-y-2">
      {data.filter(d => d.v > 0).map(d => (
        <div key={d.l} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.c }} /><span className="text-gray-500">{d.l}</span></div>
          <span className="font-mono text-gray-400">{total > 0 ? ((d.v / total) * 100).toFixed(0) + "%" : "—"}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="space-y-6">
      <PageHeader title="Finanční dashboard" sub={new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })} />
      <div className="space-y-2">
        <Alert show={cf < 0 && income > 0} msg="Záporný cashflow — výdaje převyšují příjmy" />
        <Alert show={uspory < 0.1 && income > 0 && cf >= 0} msg="Nízká míra úspor — pod 10 % příjmu" />
        <Alert show={dti > 5} msg={`Vysoké zadlužení — DTI ${dti.toFixed(2)}× překračuje limit 5×`} />
        <Alert show={(mR1 || mR2) && nemVypadekMax > vydaje * 0.3} amber msg={`Při dlouhodobé nemoci může výpadek příjmu dosáhnout ${fmt(nemVypadekMax)}/měs. — doporučujeme pojistit příjem.`} />
      </div>
      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="Příjem / měsíc" value={fmtM(income)} sub="čistý příjem domácnosti" accent />
        <KpiCard label="Výdaje / měsíc" value={fmtM(vydaje)} sub={income > 0 ? fmtP(vydaje / income) + " příjmu" : "—"} />
        <KpiCard label="Volný cashflow" value={fmtM(cf)} sub={income > 0 ? fmtP(uspory) + " z příjmu" : "—"} />
        <KpiCard label="Celkové závazky" value={fmtM(totalLiab)} sub={`DTI: ${isFinite(dti) ? dti.toFixed(2) + "×" : "—"}`} />
        <KpiCard label="Čisté jmění" value={fmtM(nw)} accent={nw > 0} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Cashflow přehled" />
          <div className="px-7 py-5 space-y-4">
            {[{ l: "Příjmy", v: income, c: "bg-emerald-500", t: "text-emerald-600" }, { l: "Výdaje", v: vydaje, c: "bg-amber-400", t: "text-amber-600" }, { l: "Volný cashflow", v: Math.abs(cf), c: cf >= 0 ? "bg-emerald-500" : "bg-red-400", t: cf >= 0 ? "text-emerald-600" : "text-red-500" }].map(item => (
              <div key={item.l}>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">{item.l}</span><span className={`font-mono font-semibold ${item.t}`}>{fmt(item.v)}</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${item.c} rounded-full transition-all duration-700`} style={{ width: `${income > 0 ? (item.v / income) * 100 : 0}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Struktura příjmů" />
          <div className="px-7 py-5 flex items-center gap-5"><MiniDonut data={prData} size={80} /><Legend data={prData} total={income} /></div>
        </Card>
        <Card>
          <CardHeader title="Struktura výdajů" />
          <div className="px-7 py-5 flex items-center gap-5"><MiniDonut data={vyData} size={80} /><Legend data={vyData} total={vydaje} /></div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Finanční ukazatele" />
          <div className="px-7 py-2">
            <MetricRow label="Míra úspor" value={fmtP(uspory)} pos={uspory >= 0.2} neg={uspory < 0} />
            <MetricRow label="DTI (zadluženost)" value={isFinite(dti) ? dti.toFixed(2) + "×" : "—"} neg={dti > 5} />
            <MetricRow label="Celkový majetek" value={fmtM(totalAssets)} pos />
            <MetricRow label="Celkové závazky" value={fmtM(totalLiab)} neg />
            <MetricRow label="Čisté jmění (NW)" value={fmtM(nw)} pos={nw >= 0} neg={nw < 0} />
            <MetricRow label="Měs. spoření na cíle" value={fmt(goalsTotal)} gold />
          </div>
        </Card>
        <Card>
          <CardHeader title="Cíle — přehled" />
          <div className="px-7 py-2">
            {goals.filter(g => g.nazev || g.castka).length === 0 && <p className="py-6 text-sm text-gray-300 text-center">Zadejte cíle v záložce Klient & Data</p>}
            {goals.filter(g => g.nazev || g.castka).map((g, i) => {
              const h = Math.max(0, num(g.rok) - CY), inf = g.castka && h ? Math.abs(FV(0.02, h, 0, -num(g.castka))) : num(g.castka), mes = h > 0 && inf > 0 ? inf / 12 / h : 0;
              return (
                <div key={i} className="py-3 border-b border-gray-50 last:border-0 flex items-center justify-between">
                  <div><p className="text-sm font-medium text-gray-800">{g.nazev || "Cíl " + (i + 1)}</p><p className="text-xs text-gray-400 mt-0.5">{g.rok || "—"} · {h} let</p></div>
                  <div className="text-right"><p className="font-mono text-xs text-emerald-600 font-semibold">{fmt(mes)}/měs.</p><p className="font-mono text-xs text-gray-400">{fmtM(inf)}</p></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: GRAFY
// ─────────────────────────────────────────────────────────────────────────────

const RetirementPanel = ({ state }) => {
  const md = state.mzdaData || initMzdaData;
  const mR1 = md.p1enabled && md.p1hruba ? calcMzdaFixed({ hrubaRocni: num(md.p1hruba) * 12, deti: num(md.p1deti), invalidita: md.p1invalidita, student: md.p1student }) : null;
  const odhadDuchod = mR1 ? mR1.duchod_orientacni(35) : null;
  const vek1 = state.p1.rok ? CY - num(state.p1.rok) : 40;
  const initStatD = odhadDuchod ? odhadDuchod : 15000;
  const [cfg, setCfg] = useState({ vekD: 67, vydD: 35000, statD: initStatD, vyn: 6, delka: 25 });
  const doD = Math.max(1, cfg.vekD - vek1);
  const r = cfg.vyn / 100, deficit = Math.max(0, cfg.vydD - cfg.statD);
  const kapital = r > 0 ? deficit * 12 * (1 - Math.pow(1 + r / 12, -cfg.delka * 12)) / (r / 12) : deficit * 12 * cfg.delka;
  const sporeni = kapital > 0 ? Math.abs(PMT(r / 12, doD * 12, 0)) * (kapital / Math.abs(FV(r / 12, doD * 12, -1, 0))) : 0;
  const lineData = Array.from({ length: doD + 1 }, (_, i) => { let k = 0; for (let m = 0; m < i * 12; m++) k = k * (1 + r / 12) + sporeni; return k; });
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        {odhadDuchod && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
            <span>🧮</span> Orientační důchod z mzdového kalkulátoru ({fmt(odhadDuchod)}/měs. za 35 let) byl přednastaven jako státní důchod.
          </div>
        )}
        <Card><CardHeader title="Projekce důchodového kapitálu" sub={`Fáze spoření: ${doD} let`} /><div className="px-6 pb-5 pt-2"><LineChart data={lineData} color="#10b981" fill height={220} /></div></Card>
        <div className="grid grid-cols-3 gap-4"><KpiCard label="Potřebný kapitál" value={fmtM(kapital)} /><KpiCard label="Doporuč. spoření/měs." value={fmt(sporeni)} accent /><KpiCard label="Deficit / měs." value={fmt(deficit)} /></div>
      </div>
      <div className="space-y-4">
        <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
          <SliderField label="Věk odchodu" value={cfg.vekD} displayValue={cfg.vekD + " let"} min={55} max={75} onChange={e => setCfg(c => ({ ...c, vekD: +e.target.value }))} />
          <SliderField label="Výdaje v důchodu (Kč)" value={cfg.vydD} displayValue={fmtM(cfg.vydD)} min={10000} max={100000} step={1000} onChange={e => setCfg(c => ({ ...c, vydD: +e.target.value }))} />
          <SliderField label="Státní důchod (Kč)" value={cfg.statD} displayValue={fmtM(cfg.statD)} min={5000} max={35000} step={500} onChange={e => setCfg(c => ({ ...c, statD: +e.target.value }))} />
          <SliderField label="Výnos % p.a." value={cfg.vyn} displayValue={cfg.vyn.toFixed(1) + " %"} min={1} max={12} step={0.5} onChange={e => setCfg(c => ({ ...c, vyn: +e.target.value }))} />
          <SliderField label="Délka čerpání (let)" value={cfg.delka} displayValue={cfg.delka + " let"} min={10} max={35} onChange={e => setCfg(c => ({ ...c, delka: +e.target.value }))} />
        </div></Card>
        <Card><div className="px-6 py-4">
          <MetricRow label="Roky do důchodu" value={doD + " let"} />
          <MetricRow label="Pokrytí st. důchodem" value={fmtP(cfg.statD / cfg.vydD)} />
          <MetricRow label="Roční deficit" value={fmt(deficit * 12)} neg />
          {odhadDuchod && <MetricRow label="Odhad st. důchodu (kalkulátor)" value={fmt(odhadDuchod)} />}
        </div></Card>
      </div>
    </div>
  );
};

const MortgagePanel = () => {
  const [cfg, setCfg] = useState({ jistina: 4000000, sazba: 4.5, spl: 25, fix: 5 });
  const r = cfg.sazba / 100 / 12, n = cfg.spl * 12, splatka = Math.abs(PMT(r, n, cfg.jistina)), celkem = splatka * n;
  let zb = cfg.jistina; for (let i = 0; i < cfg.fix * 12; i++) { const u = zb * r; zb -= (splatka - u); }
  const lineData = Array.from({ length: cfg.spl + 1 }, (_, i) => { let z = cfg.jistina; for (let m = 0; m < i * 12; m++) { const u = z * r; z -= (splatka - u); } return Math.max(0, z); });
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <Card><CardHeader title="Amortizace hypotéky" /><div className="px-6 pb-5 pt-2"><LineChart data={lineData} color="#ef4444" height={220} /></div></Card>
        <div className="grid grid-cols-3 gap-4"><KpiCard label="Měs. splátka" value={fmt(splatka)} accent /><KpiCard label="Celkem zaplaceno" value={fmtM(celkem)} /><KpiCard label="Přeplatek" value={fmtM(celkem - cfg.jistina)} /></div>
      </div>
      <div className="space-y-4">
        <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
          <div className="mb-5"><Label>Výše hypotéky (Kč)</Label><Input type="number" value={cfg.jistina} onChange={e => setCfg(c => ({ ...c, jistina: +e.target.value }))} /></div>
          <SliderField label="Úroková sazba %" value={cfg.sazba} displayValue={cfg.sazba.toFixed(1) + " %"} min={0.5} max={10} step={0.1} onChange={e => setCfg(c => ({ ...c, sazba: +e.target.value }))} />
          <SliderField label="Splatnost (let)" value={cfg.spl} displayValue={cfg.spl + " let"} min={5} max={30} onChange={e => setCfg(c => ({ ...c, spl: +e.target.value }))} />
          <SliderField label="Fixace (let)" value={cfg.fix} displayValue={cfg.fix + " let"} min={1} max={10} onChange={e => setCfg(c => ({ ...c, fix: +e.target.value }))} />
        </div></Card>
        <Card><div className="px-6 py-4"><MetricRow label="Zůstatek po fixaci" value={fmtM(Math.max(0, zb))} /><MetricRow label="Přeplatek celkem" value={fmtM(celkem - cfg.jistina)} neg /></div></Card>
      </div>
    </div>
  );
};

const InvestPanel = () => {
  const [cfg, setCfg] = useState({ poc: 100000, mes: 3000, hor: 20, vyn: 7 });
  const r = cfg.vyn / 100, hod = Math.abs(FV(r / 12, cfg.hor * 12, -cfg.mes, -cfg.poc)), vl = cfg.poc + cfg.mes * cfg.hor * 12;
  const lineData = Array.from({ length: cfg.hor + 1 }, (_, i) => { let k = cfg.poc; for (let m = 0; m < i * 12; m++) k = k * (1 + r / 12) + cfg.mes; return k; });
  const vlData = Array.from({ length: cfg.hor + 1 }, (_, i) => cfg.poc + cfg.mes * i * 12);
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <Card><CardHeader title="Růst investičního portfolia" /><div className="px-6 pb-5 pt-2"><LineChart data={lineData} color="#10b981" fill secondLine={vlData} height={220} /></div></Card>
        <div className="grid grid-cols-3 gap-4"><KpiCard label="Hodnota po horizontu" value={fmtM(hod)} accent /><KpiCard label="Celkem vloženo" value={fmtM(vl)} /><KpiCard label="Zisk z výnosů" value={fmtM(hod - vl)} /></div>
      </div>
      <div className="space-y-4">
        <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
          <div className="mb-5"><Label>Počáteční vklad (Kč)</Label><Input type="number" value={cfg.poc} onChange={e => setCfg(c => ({ ...c, poc: +e.target.value }))} /></div>
          <SliderField label="Měsíční příspěvek (Kč)" value={cfg.mes} displayValue={fmt(cfg.mes)} min={500} max={30000} step={500} onChange={e => setCfg(c => ({ ...c, mes: +e.target.value }))} />
          <SliderField label="Horizont (let)" value={cfg.hor} displayValue={cfg.hor + " let"} min={5} max={40} onChange={e => setCfg(c => ({ ...c, hor: +e.target.value }))} />
          <SliderField label="Roční výnos %" value={cfg.vyn} displayValue={cfg.vyn.toFixed(1) + " %"} min={1} max={15} step={0.5} onChange={e => setCfg(c => ({ ...c, vyn: +e.target.value }))} />
        </div></Card>
        <Card><div className="px-6 py-4"><MetricRow label="Zhodnocení celkem" value={fmtP(hod / vl - 1)} pos /><MetricRow label="Zisk z výnosů" value={fmtM(hod - vl)} gold /></div></Card>
      </div>
    </div>
  );
};

const InsurancePanel = ({ state }) => {
  const md = state.mzdaData || initMzdaData;
  const mR1 = md.p1enabled && md.p1hruba ? calcMzdaFixed({ hrubaRocni: num(md.p1hruba) * 12, deti: num(md.p1deti), invalidita: md.p1invalidita, student: md.p1student }) : null;
  const p1h = mR1 ? mR1.hruba : num(state.p1.hlavni);
  const nemVypadek = mR1 ? mR1.cista - mR1.nemocenskaDenicniOd15 * 22 : 0;
  const risks = [{ l: "Smrt", dopr: p1h * 6, note: "6× příjem" }, { l: "Vážné onemocnění", dopr: p1h * 12, note: "12× příjem" }, { l: "TN úrazu (100 %)", dopr: p1h * 18, note: "18× příjem" }, { l: "PN — denní dávka", dopr: Math.round(p1h / 30), note: "příjem / 30 dní" }, { l: "Invalidita III.", dopr: p1h * 12 * 20, note: "roční × 20 let" }, { l: "Zodpovědnost", dopr: p1h * 4.5, note: "4,5× příjem" }];
  const max = Math.max(...risks.map(r => r.dopr), 1);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Doporučené pojistné krytí" sub={`Příjem Osoby 1: ${fmt(p1h)}/měs.`} />
        <div className="px-7 py-5 space-y-4">
          {risks.map(r => (
            <div key={r.l} className="flex items-center gap-5">
              <div className="w-44 shrink-0"><p className="text-sm font-medium text-gray-700">{r.l}</p><p className="text-xs text-gray-400">{r.note}</p></div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${(r.dopr / max) * 100}%` }} /></div>
              <div className="w-28 text-right font-mono text-sm text-emerald-600 font-semibold">{fmtM(r.dopr)}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Srovnání variant pojišťoven" sub="Zadejte nabídky — automaticky se sečtou" />
        {mR1 && (
          <div className="px-7 py-4 border-b border-gray-50">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <p className="font-mono text-sm font-bold text-amber-700">{fmt(mR1.nemocenska14dni)}</p>
                <p className="text-xs text-gray-400 mt-1">Náhrada 1.–14. den (14 dní)</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <p className="font-mono text-sm font-bold text-amber-700">{fmt(mR1.nemocenskaDenicniOd15)}/den</p>
                <p className="text-xs text-gray-400 mt-1">Nemocenská od 15. dne</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
                <p className="font-mono text-sm font-bold text-red-600">{fmt(Math.max(0, nemVypadek))}</p>
                <p className="text-xs text-gray-400 mt-1">Měsíční výpadek příjmu</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2.5">Doporučená denní dávka PN: min. <strong className="text-gray-600">{fmt(Math.ceil(nemVypadek / 30))}/den</strong> — pokryje výpadek při dlouhodobé nemoci.</p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100"><th className="text-left pl-7 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Riziko</th>{["Varianta A", "Varianta B", "Varianta C"].map(v => <th key={v} className="text-center px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">{v}</th>)}</tr></thead>
            <tbody>
              {risks.map(r => (
                <tr key={r.l} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                  <td className="pl-7 py-2.5 text-sm text-gray-600">{r.l}</td>
                  {[0, 1, 2].map(ci => <td key={ci} className="px-4 py-2 text-center"><input type="number" placeholder="0" className="w-20 h-8 px-2 text-center bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono text-gray-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const TabGrafy = ({ state }) => {
  const [inner, setInner] = useState("duchod");
  const tabs = [{ id: "duchod", label: "Důchodová projekce" }, { id: "hypo", label: "Hypotéka" }, { id: "invest", label: "Investice" }, { id: "pojisteni", label: "Pojistné zajištění" }];
  return (
    <div>
      <PageHeader title="Analýzy & Grafy" sub="Interaktivní finanční projekce" />
      <InnerTabs tabs={tabs} active={inner} onChange={setInner} />
      {inner === "duchod" && <RetirementPanel state={state} />}
      {inner === "hypo" && <MortgagePanel />}
      {inner === "invest" && <InvestPanel />}
      {inner === "pojisteni" && <InsurancePanel state={state} />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: PLÁN
// ─────────────────────────────────────────────────────────────────────────────

const PlanSection = ({ num: n, title, children }) => (
  <Card className="mb-6">
    <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-4">
      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{n}</div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="px-7 py-6">{children}</div>
  </Card>
);

const TabPlan = ({ state, dispatch }) => {
  const { p1, p2, expenses, liabilities, assets, goals, planNotes } = state;
  const p1t = num(p1.hlavni) + num(p1.vedlejsi) + num(p1.pasivni), p2t = num(p2.hlavni) + num(p2.vedlejsi) + num(p2.pasivni);
  const income = p1t + p2t, vydaje = ["bydleni", "auto", "sporeni", "deti", "zavazky", "ostatni"].reduce((s, k) => s + num(expenses[k]), 0);
  const cf = income - vydaje, uspory = income > 0 ? cf / income : 0;
  const totalLiab = ["hypo", "spotreb", "kreditka", "konto", "vyzivne", "leasing"].reduce((s, k) => s + num(liabilities[k]?.zbv), 0);
  const totalAssets = ["auto1", "auto2", "nem1", "nem2", "rezerva", "invest"].reduce((s, k) => s + num(assets[k]?.hod), 0);
  const nw = totalAssets - totalLiab, dti = income > 0 ? totalLiab / (income * 12) : 0;
  const vek1 = p1.rok ? CY - num(p1.rok) : null, vek2 = p2.rok ? CY - num(p2.rok) : null;
  const goalsTotal = goals.reduce((s, g) => { const h = Math.max(0, num(g.rok) - CY); const inf = g.castka && h ? Math.abs(FV(0.02, h, 0, -num(g.castka))) : num(g.castka); return s + (h > 0 ? inf / 12 / h : 0); }, 0);
  const note = (key, ph) => (
    <div className="mt-5"><Label>Poznámka poradce</Label><Textarea value={planNotes[key] || ""} onChange={e => dispatch({ type: "PLAN_NOTE", key, value: e.target.value })} placeholder={ph || "Doporučení poradce…"} rows={3} /></div>
  );
  const recs = [];
  if (cf < 0 && income > 0) recs.push({ ico: "⚠️", t: "Záporný cashflow", txt: "Výdaje domácnosti převyšují příjmy. Priorita č. 1 je obnovit kladný cashflow." });
  if (uspory < 0.1 && income > 0 && cf >= 0) recs.push({ ico: "💡", t: "Nízká míra úspor", txt: "Doporučujeme cílit na alespoň 20 % příjmu. Potřeba spoření: " + fmt(goalsTotal) + "/měs." });
  if (dti > 5) recs.push({ ico: "📋", t: "Vysoké zadlužení", txt: `DTI ${dti.toFixed(2)}× překračuje doporučenou hranici 5×. Zvažte refinancování.` });
  recs.push({ ico: "🛡️", t: "Pojistné zajištění", txt: "Nastavte krytí odpovídající příjmu a závazkům rodiny." });
  recs.push({ ico: "📈", t: "Investiční strategie", txt: "Doporučený příspěvek: " + fmt(Math.max(0, cf * 0.4)) + "/měs. při horizontu alespoň 10 let." });
  const expLabels = { bydleni: "Bydlení", auto: "Auto", sporeni: "Spoření", deti: "Děti", zavazky: "Závazky", ostatni: "Ostatní" };
  return (
    <div>
      <PageHeader title="Finanční plán" sub={`${[p1.jmeno, p1.prijmeni].filter(Boolean).join(" ") || "Klient"} — ${new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })}`} right={<button onClick={() => { injectPrintStyles(); window.print(); }} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors">🖨️ Tisk / PDF</button>} />
      <PlanSection num={1} title="Shrnutí finanční situace">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-emerald-500 px-5 py-4 text-white"><p className="text-xs font-medium uppercase tracking-widest opacity-70 mb-1">Čistý příjem</p><p className="text-2xl font-bold font-mono">{fmtM(income)}</p><p className="text-xs opacity-60 mt-1">celá domácnost / měs.</p></div>
          <div className="rounded-xl bg-gray-800 px-5 py-4 text-white"><p className="text-xs font-medium uppercase tracking-widest opacity-70 mb-1">Výdaje</p><p className="text-2xl font-bold font-mono">{fmtM(vydaje)}</p><p className="text-xs opacity-60 mt-1">celkem / měs.</p></div>
          <div className={`rounded-xl px-5 py-4 text-white ${cf >= 0 ? "bg-emerald-700" : "bg-red-500"}`}><p className="text-xs font-medium uppercase tracking-widest opacity-70 mb-1">Volný cashflow</p><p className="text-2xl font-bold font-mono">{fmtM(cf)}</p><p className="text-xs opacity-60 mt-1">k dispozici</p></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div><MetricRow label="Míra úspor" value={fmtP(uspory)} pos={uspory >= 0.2} /><MetricRow label="DTI" value={isFinite(dti) ? dti.toFixed(2) + "×" : "—"} neg={dti > 5} /><MetricRow label="Čisté jmění (NW)" value={fmtM(nw)} pos={nw >= 0} neg={nw < 0} /></div>
          <div><MetricRow label="Věk — Osoba 1" value={vek1 ? vek1 + " let" : "—"} /><MetricRow label="Věk — Osoba 2" value={vek2 ? vek2 + " let" : "—"} /><MetricRow label="Měs. spoření na cíle" value={fmt(goalsTotal)} gold /></div>
        </div>
        {note("situace", "Shrnutí finanční situace klienta…")}
      </PlanSection>
      <PlanSection num={2} title="Příjmy & Výdaje">
        <div className="grid grid-cols-2 gap-6">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Příjmy</p><MetricRow label={[p1.jmeno, p1.prijmeni].filter(Boolean).join(" ") || "Osoba 1"} value={fmt(p1t)} pos /><MetricRow label={[p2.jmeno, p2.prijmeni].filter(Boolean).join(" ") || "Osoba 2"} value={fmt(p2t)} pos /><MetricRow label="Celkem" value={fmt(income)} pos /></div>
          <div><p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Výdaje</p>{Object.entries(expLabels).map(([k, l]) => num(expenses[k]) > 0 ? <MetricRow key={k} label={l} value={fmt(num(expenses[k]))} /> : null)}<MetricRow label="Celkem výdaje" value={fmt(vydaje)} neg /></div>
        </div>
        {income > 0 && <div className="mt-5 p-4 bg-gray-50 border-l-2 border-emerald-400 rounded-r-xl text-sm text-gray-600 leading-relaxed">Výdaje tvoří {fmtP(vydaje / income)} příjmu domácnosti. Volný cashflow {fmt(cf)} {cf >= 0 ? "umožňuje plnění cílů." : "je záporný — situace vyžaduje okamžitou pozornost."}</div>}
        {note("pv")}
      </PlanSection>
      <PlanSection num={3} title="Pojistné zajištění">
        <div className="space-y-3">
          {[{ l: "Smrt", v: p1t * 6 }, { l: "Vážné onemocnění", v: p1t * 12 }, { l: "TN úrazu (100 %)", v: p1t * 18 }, { l: "Invalidita III.", v: p1t * 12 * 20 }].map(r => <div key={r.l} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"><span className="text-sm text-gray-600">{r.l}</span><span className="font-mono text-sm text-emerald-600 font-semibold">{fmtM(r.v)}</span></div>)}
        </div>
        {p1t > 0 && <div className="mt-4 p-4 bg-gray-50 border-l-2 border-emerald-400 rounded-r-xl text-sm text-gray-600">Doporučené krytí vychází z příjmu Osoby 1 ({fmt(p1t)}/měs.).</div>}
        {note("poj")}
      </PlanSection>
      <PlanSection num={4} title="Finanční cíle & Plán spoření">
        <div className="space-y-3">
          {goals.filter(g => g.nazev || g.castka).map((g, i) => {
            const h = Math.max(0, num(g.rok) - CY), inf = g.castka && h ? Math.abs(FV(0.02, h, 0, -num(g.castka))) : num(g.castka), mes = h > 0 && inf > 0 ? inf / 12 / h : 0;
            return (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-1 h-10 bg-emerald-400 rounded-full shrink-0" />
                <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{g.nazev || "Cíl " + (i + 1)}</p><p className="text-xs text-gray-400">{g.rok} · {h} let</p></div>
                <div className="text-right"><p className="font-mono text-sm font-bold text-gray-900">{fmtM(inf)}</p><p className="font-mono text-xs text-emerald-600">{fmt(mes)}/měs.</p></div>
              </div>
            );
          })}
          {goals.filter(g => g.nazev || g.castka).length === 0 && <p className="text-sm text-gray-300 text-center py-4">Zadejte cíle v záložce Klient & Data</p>}
        </div>
        {note("cile")}
      </PlanSection>
      <PlanSection num={5} title="Závěrečná doporučení">
        <div className="space-y-3 mb-6">
          {recs.map((r, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-lg shrink-0 mt-0.5">{r.ico}</span>
              <div><p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{r.t}</p><p className="text-sm text-gray-600 leading-relaxed">{r.txt}</p></div>
            </div>
          ))}
        </div>
        <Label>Volný text závěru</Label>
        <Textarea value={planNotes.zaver || ""} onChange={e => dispatch({ type: "PLAN_NOTE", key: "zaver", value: e.target.value })} placeholder="Celkové závěrečné doporučení poradce…" rows={5} />
      </PlanSection>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: KALKULAČKY
// ─────────────────────────────────────────────────────────────────────────────

const InvestmentCalc = () => {
  const [cfg, setCfg] = useState({ poc: 100000, mes: 5000, dob: 20, vyn: 7 });
  const r = cfg.vyn / 100, hod = Math.abs(FV(r / 12, cfg.dob * 12, -cfg.mes, -cfg.poc)), vl = cfg.poc + cfg.mes * 12 * cfg.dob, zisk = hod - vl;
  const lineData = Array.from({ length: cfg.dob + 1 }, (_, i) => { let k = cfg.poc; for (let m = 0; m < i * 12; m++) k = k * (1 + r / 12) + cfg.mes; return k; });
  const vlLine = Array.from({ length: cfg.dob + 1 }, (_, i) => cfg.poc + cfg.mes * i * 12);
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl"><p className="text-sm text-emerald-800 leading-relaxed">Za <strong>{cfg.dob} let</strong> vložíte celkem <strong>{fmtM(vl)}</strong>. Trh vydělá dalších <strong className="text-emerald-600 text-base">{fmtM(zisk)}</strong>. Celkový majetek: <strong className="text-emerald-700 text-lg">{fmtM(hod)}</strong>.</p></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-xl border border-gray-100 text-center shadow-sm"><p className="font-mono text-lg font-bold text-gray-800">{fmtM(vl)}</p><p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">Vlastní vklady</p></div>
          <div className="p-4 bg-white rounded-xl border border-emerald-100 text-center shadow-sm"><p className="font-mono text-lg font-bold text-emerald-600">{fmtM(zisk)}</p><p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">Trh vydělá</p></div>
          <div className="p-4 bg-emerald-500 rounded-xl text-center shadow-sm"><p className="font-mono text-lg font-bold text-white">{fmtM(hod)}</p><p className="text-xs text-emerald-100 mt-1 uppercase tracking-widest font-medium">Celkem</p></div>
        </div>
        <Card><CardHeader title="Síla složeného úročení" /><div className="px-6 pb-5 pt-2"><LineChart data={lineData} color="#10b981" fill secondLine={vlLine} height={200} /></div></Card>
      </div>
      <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
        <div className="mb-5"><Label>Počáteční vklad (Kč)</Label><Input type="number" value={cfg.poc} onChange={e => setCfg(c => ({ ...c, poc: +e.target.value }))} /></div>
        <SliderField label="Měsíční investice (Kč)" value={cfg.mes} displayValue={fmt(cfg.mes)} min={500} max={50000} step={500} onChange={e => setCfg(c => ({ ...c, mes: +e.target.value }))} />
        <SliderField label="Doba (let)" value={cfg.dob} displayValue={cfg.dob + " let"} min={5} max={40} onChange={e => setCfg(c => ({ ...c, dob: +e.target.value }))} />
        <SliderField label="Výnos % p.a." value={cfg.vyn} displayValue={cfg.vyn.toFixed(1) + " %"} min={1} max={15} step={0.5} onChange={e => setCfg(c => ({ ...c, vyn: +e.target.value }))} />
      </div></Card>
    </div>
  );
};

const LoanCalc = () => {
  const [cfg, setCfg] = useState({ jistina: 3000000, sazba: 5.5, leta: 25 });
  const r = cfg.sazba / 100 / 12, n = cfg.leta * 12, spl = Math.abs(PMT(r, n, cfg.jistina)), cel = spl * n;
  const amort = (() => { let z = cfg.jistina; return Array.from({ length: cfg.leta }, () => { let j = 0, u = 0; for (let m = 0; m < 12; m++) { const ui = z * r; j += spl - ui; u += ui; z -= (spl - ui); } return { j, u }; }); })();
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div className="grid grid-cols-3 gap-4"><KpiCard label="Měs. splátka" value={fmt(spl)} accent /><KpiCard label="Celkem zaplaceno" value={fmtM(cel)} /><KpiCard label="Přeplatek" value={fmtM(cel - cfg.jistina)} /></div>
        <Card><CardHeader title="Amortizace" sub="Jistina vs. úrok po letech" /><div className="px-6 pb-5 pt-2">
          <BarChart labels={amort.filter((_, i) => i % Math.ceil(cfg.leta / 8) === 0 || i === cfg.leta - 1).map((_, i, a) => (i === a.length - 1 ? cfg.leta : i * Math.ceil(cfg.leta / 8) + 1) + ".r")} datasets={[{ label: "Jistina", color: "#10b981", data: amort.filter((_, i) => i % Math.ceil(cfg.leta / 8) === 0 || i === cfg.leta - 1).map(a => a.j) }, { label: "Úrok", color: "#fca5a5", data: amort.filter((_, i) => i % Math.ceil(cfg.leta / 8) === 0 || i === cfg.leta - 1).map(a => a.u) }]} height={160} />
        </div></Card>
      </div>
      <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
        <div className="mb-5"><Label>Výše úvěru (Kč)</Label><Input type="number" value={cfg.jistina} onChange={e => setCfg(c => ({ ...c, jistina: +e.target.value }))} /></div>
        <SliderField label="Úroková sazba %" value={cfg.sazba} displayValue={cfg.sazba.toFixed(1) + " %"} min={0.5} max={12} step={0.1} onChange={e => setCfg(c => ({ ...c, sazba: +e.target.value }))} />
        <SliderField label="Splatnost (let)" value={cfg.leta} displayValue={cfg.leta + " let"} min={5} max={30} onChange={e => setCfg(c => ({ ...c, leta: +e.target.value }))} />
      </div></Card>
    </div>
  );
};

const InflationCalc = () => {
  const [cfg, setCfg] = useState({ castka: 1000000, inf: 3, leta: 20 });
  const real = cfg.castka / Math.pow(1 + cfg.inf / 100, cfg.leta);
  const lineData = Array.from({ length: cfg.leta + 1 }, (_, i) => cfg.castka / Math.pow(1 + cfg.inf / 100, i));
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl"><p className="text-sm text-red-800 leading-relaxed"><strong>{fmtM(cfg.castka)}</strong> dnes bude mít za <strong>{cfg.leta} let</strong> při inflaci {cfg.inf} % reálnou hodnotu jen <strong className="text-red-600 text-base">{fmtM(real)}</strong>. Ztráta: <strong className="text-red-700">{fmtP(1 - real / cfg.castka)}</strong>.</p></div>
        <div className="grid grid-cols-2 gap-4"><KpiCard label="Reálná hodnota za N let" value={fmtM(real)} /><KpiCard label="Ztráta kupní síly" value={fmtP(1 - real / cfg.castka)} /></div>
        <Card><CardHeader title="Pokles kupní síly" /><div className="px-6 pb-5 pt-2"><LineChart data={lineData} color="#ef4444" height={180} /></div></Card>
      </div>
      <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
        <div className="mb-5"><Label>Částka dnes (Kč)</Label><Input type="number" value={cfg.castka} onChange={e => setCfg(c => ({ ...c, castka: +e.target.value }))} /></div>
        <SliderField label="Inflace % p.a." value={cfg.inf} displayValue={cfg.inf.toFixed(1) + " %"} min={0.5} max={10} step={0.5} onChange={e => setCfg(c => ({ ...c, inf: +e.target.value }))} />
        <SliderField label="Počet let" value={cfg.leta} displayValue={cfg.leta + " let"} min={5} max={40} onChange={e => setCfg(c => ({ ...c, leta: +e.target.value }))} />
      </div></Card>
    </div>
  );
};

const AllocationCalc = () => {
  const [cfg, setCfg] = useState({ vek: 40, riziko: 3 });
  const profiles = ["Konzervativní", "Opatrný", "Vyvážený", "Progresivní", "Dynamický"];
  const bond = Math.max(15, (100 - cfg.vek) * 0.5), eq = 100 - bond, adj = (cfg.riziko - 3) * 10;
  const akcie = Math.min(90, Math.max(5, Math.round(eq + adj))), dluh = Math.min(80, Math.max(5, Math.round(100 - akcie - 10))), nem = Math.max(0, Math.round((akcie - dluh) * 0.12)), hot = Math.max(0, 100 - akcie - dluh - nem);
  const data = [{ l: "Akcie / ETF", v: akcie, c: "#10b981" }, { l: "Dluhopisy", v: dluh, c: "#3b82f6" }, { l: "Nemovitosti", v: nem, c: "#f59e0b" }, { l: "Hotovost", v: hot, c: "#94a3b8" }];
  const descs = ["Priorita zachování kapitálu. Minimální riziko, stabilní výnosy.", "Nízké riziko, preference stability nad výnosem.", "Klasická strategie 60/40. Kombinuje růst a stabilitu.", "Orientace na akcie. Vyšší volatilita, vyšší potenciál.", "Maximální orientace na akcie pro investory s vysokou tolerancí rizika."];
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <Card>
          <CardHeader title="Doporučená alokace" sub={`Věk ${cfg.vek} let · profil: ${profiles[cfg.riziko - 1]}`} />
          <div className="px-7 py-6">
            <div className="flex items-center gap-8 mb-6">
              <MiniDonut data={data} size={120} />
              <div className="flex-1 space-y-3">
                {data.map(d => (
                  <div key={d.l} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.c }} />
                    <span className="text-sm text-gray-600 flex-1">{d.l}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mx-2"><div className="h-full rounded-full transition-all duration-500" style={{ width: d.v + "%", background: d.c }} /></div>
                    <span className="font-mono text-sm font-bold text-gray-800 w-10 text-right">{d.v}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">{descs[cfg.riziko - 1]}</div>
          </div>
        </Card>
      </div>
      <Card><CardHeader title="Parametry" /><div className="px-6 py-5">
        <SliderField label="Věk investora" value={cfg.vek} displayValue={cfg.vek + " let"} min={20} max={70} onChange={e => setCfg(c => ({ ...c, vek: +e.target.value }))} />
        <SliderField label="Tolerance rizika (1–5)" value={cfg.riziko} displayValue={profiles[cfg.riziko - 1]} min={1} max={5} onChange={e => setCfg(c => ({ ...c, riziko: +e.target.value }))} />
        <div className="mt-4 space-y-1">
          {profiles.map((p, i) => (
            <div key={p} onClick={() => setCfg(c => ({ ...c, riziko: i + 1 }))} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all ${cfg.riziko === i + 1 ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.riziko === i + 1 ? "bg-emerald-500" : "bg-gray-200"}`} />
              {p}
            </div>
          ))}
        </div>
      </div></Card>
    </div>
  );
};

const TabKalkulacky = () => {
  const [inner, setInner] = useState("invest");
  const tabs = [{ id: "invest", label: "📈 Investice" }, { id: "uver", label: "🏦 Úvěr / Hypotéka" }, { id: "inflace", label: "📉 Inflace" }, { id: "alokace", label: "🥧 Alokace portfolia" }];
  return (
    <div>
      <PageHeader title="Finanční kalkulačky" sub="Interaktivní nástroje pro klientská setkání" />
      <InnerTabs tabs={tabs} active={inner} onChange={setInner} />
      {inner === "invest" && <InvestmentCalc />}
      {inner === "uver" && <LoanCalc />}
      {inner === "inflace" && <InflationCalc />}
      {inner === "alokace" && <AllocationCalc />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────

const initPerson = { prijmeni: "", jmeno: "", titul: "", rok: "", rc: "", op: "", stat: "ČR", stav: "ženatý / vdaná", email: "", tel: "", ucet: "", adresa: "", povolani: "", urazy: "ne", sport: "", hlavni: "", vedlejsi: "", pasivni: "" };
const initMzdaData = { p1hruba: "", p1deti: "0", p1invalidita: false, p1student: false, p1enabled: true, p2hruba: "", p2deti: "0", p2invalidita: false, p2student: false, p2enabled: false };
const initState = { p1: { ...initPerson }, p2: { ...initPerson }, children: { 1: {}, 2: {}, 3: {} }, expenses: { bydleni: "", auto: "", sporeni: "", deti: "", zavazky: "", ostatni: "" }, liabilities: { hypo: {}, spotreb: {}, kreditka: {}, konto: {}, vyzivne: {}, leasing: {} }, assets: { auto1: {}, auto2: {}, nem1: {}, nem2: {}, rezerva: {}, invest: {} }, goals: Array.from({ length: 5 }, () => ({ nazev: "", rok: "", castka: "", pozn: "" })), notes: [{ datum: "", typ: "Vstupní analýza", text: "" }], spo: [{}], poj: [{}], zavSmlouvy: [{}], planNotes: {}, mzdaData: { ...initMzdaData } };

function reducer(state, action) {
  const arr = (key, i, f, v) => {
    if (f === "__delete") return state[key].filter((_, idx) => idx !== i);
    return state[key].map((item, idx) => idx === i ? { ...item, [f]: v } : item);
  };
  switch (action.type) {
    case "P1": return { ...state, p1: { ...state.p1, [action.field]: action.value } };
    case "P2": return { ...state, p2: { ...state.p2, [action.field]: action.value } };
    case "CHILD": return { ...state, children: { ...state.children, [action.i]: { ...state.children[action.i], [action.field]: action.value } } };
    case "EXP": return { ...state, expenses: { ...state.expenses, [action.key]: action.value } };
    case "LIAB": return { ...state, liabilities: { ...state.liabilities, [action.key]: { ...state.liabilities[action.key], [action.field]: action.value } } };
    case "ASSET": return { ...state, assets: { ...state.assets, [action.key]: { ...state.assets[action.key], [action.field]: action.value } } };
    case "GOAL": return { ...state, goals: state.goals.map((g, i) => i === action.i ? { ...g, [action.field]: action.value } : g) };
    case "NOTE": return { ...state, notes: arr("notes", action.i, action.field, action.value) };
    case "NOTE_ADD": return { ...state, notes: [...state.notes, { datum: "", typ: "Vstupní analýza", text: "" }] };
    case "SPO": return { ...state, spo: arr("spo", action.i, action.field, action.value) };
    case "SPO_ADD": return { ...state, spo: [...state.spo, {}] };
    case "POJ": return { ...state, poj: arr("poj", action.i, action.field, action.value) };
    case "POJ_ADD": return { ...state, poj: [...state.poj, {}] };
    case "ZAV_SM": return { ...state, zavSmlouvy: arr("zavSmlouvy", action.i, action.field, action.value) };
    case "ZAV_SM_ADD": return { ...state, zavSmlouvy: [...state.zavSmlouvy, {}] };
    case "PLAN_NOTE": return { ...state, planNotes: { ...state.planNotes, [action.key]: action.value } };
    case "MZDA": return { ...state, mzdaData: { ...(state.mzdaData || initMzdaData), [action.field]: action.value } };
    case "__LOAD": return { ...initState, ...action.payload };
    default: return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("vstup");
  const [isDirty, setIsDirty] = useState(false);

  const [state, baseDispatch] = useReducer(reducer, initState, init => {
    try { const s = localStorage.getItem("fp_v3"); return s ? { ...init, ...JSON.parse(s) } : init; } catch { return init; }
  });

  const dispatch = action => { baseDispatch(action); setIsDirty(true); };

  const onSave = () => {
    try { localStorage.setItem("fp_v3", JSON.stringify(state)); setIsDirty(false); } catch {}
  };

  // Load a client from ClientManager (replaces entire state)
  const onLoad = (clientState) => {
    baseDispatch({ type: "__LOAD", payload: clientState });
    setIsDirty(false);
  };

  const clientName = [state.p1.jmeno, state.p1.prijmeni].filter(Boolean).join(" ") || "Nový klient";

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Topbar
        activeTab={activeTab} onTabChange={setActiveTab}
        onSave={onSave} isDirty={isDirty} clientName={clientName}
        currentState={state} onLoad={onLoad}
      />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        {activeTab === "vstup" && <TabVstup state={state} dispatch={dispatch} />}
        {activeTab === "smlouvy" && <TabSmlouvy state={state} dispatch={dispatch} />}
        {activeTab === "dashboard" && <TabDashboard state={state} />}
        {activeTab === "grafy" && <TabGrafy state={state} />}
        {activeTab === "plan" && <TabPlan state={state} dispatch={dispatch} />}
        {activeTab === "kalkulacky" && <TabKalkulacky />}
      </main>
    </div>
  );
}
