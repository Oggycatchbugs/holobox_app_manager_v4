const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

function cleanEnvValue(value) {
  return String(value || "")
    .replace(/[\r\n\t]/g, "")
    .replace(/^["']+|["']+$/g, "")
    .trim();
}


let createClient = null;
try {
  ({ createClient } = require("@supabase/supabase-js"));
} catch {
  createClient = null;
}

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const SUPABASE_URL = cleanEnvValue(process.env.SUPABASE_URL);
const SUPABASE_SERVICE_ROLE_KEY = cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || "");
const STATE_TABLE = cleanEnvValue(process.env.SUPABASE_STATE_TABLE) || "holobox_state";
const STATE_ID_ENV = cleanEnvValue(process.env.SUPABASE_STATE_ID);
const BUCKET = cleanEnvValue(process.env.SUPABASE_BUCKET) || "holobox-media";
const UPLOAD_MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 250 * 1024 * 1024);
const SESSION_SECRET = cleanEnvValue(process.env.SESSION_SECRET) || "dev-change-this-holobox-session-secret";
const DEFAULT_ADMIN_USERNAME = cleanEnvValue(process.env.DEFAULT_ADMIN_USERNAME) || "admin";
const DEFAULT_ADMIN_PASSWORD = cleanEnvValue(process.env.DEFAULT_ADMIN_PASSWORD) || "admin123";
const COOKIE_NAME = "hb_session";

let resolvedStateId = STATE_ID_ENV || null;
let supabaseClient = null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".sql": "text/plain; charset=utf-8"
};

function defaultState() {
  return {
    users: [],
    customers: [],
    locations: [],
    devices: [],
    videos: [],
    audio: [],
    videoPlaylists: [],
    audioPlaylists: [],
    autoPlaylists: [],
    assistantScripts: [],
    logs: [],
    settings: {
      systemName: "TLC HoloBox Manager",
      timezone: "Asia/Ho_Chi_Minh",
      defaultLanguage: "vi",
      language: "vi",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24 Hour",
      apiEndpoint: "",
      heartbeatInterval: "5",
      offlineTimeout: "30",
      realtimeMode: "Polling",
      pingTarget: "/health",
      pingInterval: "10",
      pingTimeout: "3000",
      allowRemoteRestart: true,
      storageProvider: "Supabase Storage",
      mediaBucket: BUCKET,
      maxUploadMb: "500",
      keepLogsDays: "30",
      autoCleanup: true,
      maintenancePhone: "090x xxx xxx",
      maintenanceEmail: "support@tlc.vn",
      maintenanceZalo: "",
      adminEmail: "",
      operatorEmail: "",
      defaultRole: "Customer",
      sessionTimeout: "60",
      twoFactor: false,
      notifyOffline: true,
      notifyUpload: true,
      notifyErrors: true,
      quietHours: "22:00 - 07:00",
      notificationEmail: ""
    }
  };
}

function mergeState(remote) {
  const fallback = defaultState();
  const incoming = remote && typeof remote === "object" ? remote : {};
  return {
    ...fallback,
    ...incoming,
    users: Array.isArray(incoming.users) ? incoming.users : fallback.users,
    customers: Array.isArray(incoming.customers) ? incoming.customers : fallback.customers,
    locations: Array.isArray(incoming.locations) ? incoming.locations : fallback.locations,
    devices: Array.isArray(incoming.devices) ? incoming.devices : fallback.devices,
    videos: Array.isArray(incoming.videos) ? incoming.videos : fallback.videos,
    audio: Array.isArray(incoming.audio) ? incoming.audio : fallback.audio,
    videoPlaylists: Array.isArray(incoming.videoPlaylists) ? incoming.videoPlaylists : fallback.videoPlaylists,
    audioPlaylists: Array.isArray(incoming.audioPlaylists) ? incoming.audioPlaylists : fallback.audioPlaylists,
    autoPlaylists: Array.isArray(incoming.autoPlaylists) ? incoming.autoPlaylists : fallback.autoPlaylists,
    assistantScripts: Array.isArray(incoming.assistantScripts) ? incoming.assistantScripts : fallback.assistantScripts,
    logs: Array.isArray(incoming.logs) ? incoming.logs : fallback.logs,
    settings: { ...fallback.settings, ...(incoming.settings || {}) },
  };
}

function getSupabase() {
  if (!createClient) {
    throw new Error("Missing @supabase/supabase-js. Run `npm install` before starting the server.");
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return supabaseClient;
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function cleanName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

function formatBytes(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function dateNowLabel() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function addLog(data, category, event, status, detail) {
  const logs = Array.isArray(data.logs) ? data.logs : [];
  logs.unshift({ id: uid(), time: dateNowLabel(), device: "Server", category, event, status, detail });
  data.logs = logs.slice(0, 300);
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}
function hmac(input) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(input).digest("base64url");
}
function parseCookies(req) {
  const raw = req.headers.cookie || "";
  const out = {};
  raw.split(";").forEach(part => {
    const idx = part.indexOf("=");
    if (idx > -1) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}
function setSessionCookie(res, token) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 14}`);
}
function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}
function createSessionToken(user) {
  const payload = base64url(JSON.stringify({
    userId: user.id,
    role: user.role,
    customerId: user.customerId || null,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14
  }));
  return `${payload}.${hmac(payload)}`;
}
function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (hmac(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}
function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...clean } = user;
  return clean;
}
function publicSettings(settings) {
  return {
    systemName: settings?.systemName || "TLC HoloBox Manager",
    defaultLanguage: settings?.defaultLanguage || "vi",
    language: settings?.language || "vi",
    maintenancePhone: settings?.maintenancePhone || "090x xxx xxx",
    maintenanceEmail: settings?.maintenanceEmail || "support@tlc.vn",
    maintenanceZalo: settings?.maintenanceZalo || "",
    offlineTimeout: settings?.offlineTimeout || "30",
    idleAdsAfterSec: settings?.idleAdsAfterSec || "30",
    maxUploadMb: settings?.maxUploadMb || "500"
  };
}
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}
function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return false;
  const [method, salt, hash] = stored.split("$");
  if (method !== "scrypt" || !salt || !hash) return false;
  const derived = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(hash, "hex"));
}
function ensureBootstrap(data) {
  const current = mergeState(data);
  let changed = false;
  if (!Array.isArray(current.users)) current.users = [];
  if (!Array.isArray(current.customers)) current.customers = [];
  if (!Array.isArray(current.devices)) current.devices = [];

  // v13.1.0 / Phase 2:
  // Initial system has only one admin account.
  // Customer accounts are created manually from Admin > Customers.
  const adminUsername = DEFAULT_ADMIN_USERNAME || "admin";
  const adminPassword = DEFAULT_ADMIN_PASSWORD || "admin123";

  // Remove previous demo/emergency bootstrap accounts from older test builds.
  const bootstrapUsernamesToRemove = ["tlc_admin", "support_admin", "customer_01", "customer_02", "customer_03"];
  const beforeUsers = current.users.length;
  current.users = current.users.filter(u => !bootstrapUsernamesToRemove.includes(normalizeName(u.username)));
  if (current.users.length !== beforeUsers) changed = true;

  const beforeCustomers = current.customers.length;
  current.customers = current.customers.filter(c => {
    const key = normalizeName(c.demoKey || c.id || c.name);
    return !key.includes("cus_demo_") && !["customer demo 01", "customer demo 02", "customer demo 03"].includes(key);
  });
  if (current.customers.length !== beforeCustomers) changed = true;

  const beforeDevices = current.devices.length;
  current.devices = current.devices.filter(d => {
    const code = normalizeName(d.deviceCode || d.id || d.name);
    return !["holobox_cus_01", "holobox_cus_02", "holobox_cus_03"].includes(code) && !normalizeName(d.id).includes("cus_demo_");
  });
  if (current.devices.length !== beforeDevices) changed = true;

  let admin = current.users.find(u => normalizeName(u.username) === normalizeName(adminUsername));
  if (!admin) {
    admin = {
      id: `user_admin_${uid()}`,
      username: adminUsername,
      name: "TLC Admin",
      role: "admin",
      customerId: null,
      passwordHash: hashPassword(adminPassword),
      active: true,
      language: "vi",
      firstLoginDone: true,
      createdAt: Date.now(),
      bootstrapAccount: true
    };
    current.users.unshift(admin);
    changed = true;
  } else {
    const hasValidHash = typeof admin.passwordHash === "string" && admin.passwordHash.startsWith("scrypt$");
    if (
      normalizeName(admin.role) !== "admin" ||
      !hasValidHash ||
      admin.active === false ||
      admin.bootstrapAccount === true
    ) {
      admin.role = "admin";
      admin.customerId = null;
      admin.passwordHash = hashPassword(adminPassword);
      admin.active = true;
      admin.language = admin.language || "vi";
      admin.firstLoginDone = true;
      admin.bootstrapAccount = true;
      changed = true;
    }
  }

  // Disable old bootstrap admin accounts other than the configured admin.
  for (const user of current.users) {
    if (
      normalizeName(user.role) === "admin" &&
      normalizeName(user.username) !== normalizeName(adminUsername) &&
      user.bootstrapAccount === true
    ) {
      user.active = false;
      changed = true;
    }
  }


  // Repair customer accounts that were broken by older builds saving sanitized users
  // back to Supabase without passwordHash. Their temporary password becomes 123456.
  for (const user of current.users) {
    if (normalizeName(user.role) === "customer") {
      const hasValidHash = typeof user.passwordHash === "string" && user.passwordHash.startsWith("scrypt$");
      if (!hasValidHash || user.active === false) {
        user.passwordHash = hashPassword("123456");
        user.active = true;
        user.firstLoginDone = user.firstLoginDone ?? false;
        user.repairedAt = new Date().toISOString();
        changed = true;
      }
    }
  }

  return { data: current, changed };
}
async function getAuthUser(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  const session = verifySessionToken(token);
  if (!session) return null;
  const row = await getStateRow();
  const current = mergeState(row.data);
  const user = current.users.find(u => u.id === session.userId && u.active !== false);
  return user ? sanitizeUser(user) : null;
}
async function requireUser(req, res) {
  const user = await getAuthUser(req);
  if (!user) {
    sendError(res, 401, "Not authenticated.");
    return null;
  }
  return { user };
}
async function requireAdmin(req, res) {
  const auth = await requireUser(req, res);
  if (!auth) return null;
  if (auth.user.role !== "admin") {
    sendError(res, 403, "Admin permission required.");
    return null;
  }
  return auth;
}
function scopeStateForUser(data, user) {
  const current = mergeState(data);
  if (!user) return { ...defaultState(), settings: publicSettings(current.settings) };
  if (user.role === "admin") {
    return { ...current, users: current.users.map(sanitizeUser) };
  }
  const cid = user.customerId;
  const byCustomer = item => String(item.customerId || "") === String(cid || "");
  return {
    ...defaultState(),
    customers: current.customers.filter(c => String(c.id) === String(cid)),
    devices: current.devices.filter(byCustomer),
    videos: current.videos.filter(byCustomer),
    audio: current.audio.filter(byCustomer),
    videoPlaylists: current.videoPlaylists.filter(byCustomer),
    audioPlaylists: current.audioPlaylists.filter(byCustomer),
    autoPlaylists: current.autoPlaylists.filter(byCustomer),
    assistantScripts: current.assistantScripts.filter(byCustomer),
    logs: current.logs.filter(l => !l.customerId || String(l.customerId) === String(cid)).slice(0, 80),
    settings: publicSettings(current.settings),
    users: [user]
  };
}
function mergeCustomerScopedState(full, partial, user) {
  const current = mergeState(full);
  const incoming = mergeState(partial);
  const cid = user.customerId;
  const scopedCollections = ["devices", "videos", "audio", "videoPlaylists", "audioPlaylists", "autoPlaylists", "assistantScripts"];
  for (const key of scopedCollections) {
    const safeIncoming = (incoming[key] || []).filter(item => String(item.customerId || "") === String(cid || ""));
    current[key] = [
      ...(current[key] || []).filter(item => String(item.customerId || "") !== String(cid || "")),
      ...safeIncoming
    ];
  }
  current.logs = [
    ...(current.logs || []),
    ...(incoming.logs || []).filter(l => String(l.customerId || "") === String(cid || ""))
  ].slice(-300);
  return current;
}
function itemBelongsToUser(item, user) {
  if (!item || !user) return false;
  return user.role === "admin" || String(item.customerId || "") === String(user.customerId || "");
}
async function handlePublicConfig(_req, res) {
  const row = await getStateRow();
  const current = mergeState(row.data);
  sendJson(res, 200, { ok: true, settings: publicSettings(current.settings) });
}
async function handleLogin(req, res) {
  const body = await readJson(req, 1024 * 1024);
  const username = normalizeName(body.username || "");
  const password = String(body.password || "");
  const row = await getStateRow();
  let current = mergeState(row.data);
  const boot = ensureBootstrap(current);
  current = boot.data;
  if (boot.changed) await saveState(current);

  const user = current.users.find(u => normalizeName(u.username) === username && u.active !== false);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    addLog(current, "Auth", "Login failed", "WARNING", username || "unknown");
    await saveState(current);
    sendError(res, 401, "Sai tài khoản hoặc mật khẩu.");
    return;
  }
  const token = createSessionToken(user);
  setSessionCookie(res, token);
  user.lastLoginAt = new Date().toISOString();
  addLog(current, "Auth", "Login success", "SUCCESS", user.username);
  await saveState(current);
  sendJson(res, 200, { ok: true, user: sanitizeUser(user) });
}
async function handleMe(req, res) {
  const user = await getAuthUser(req);
  sendJson(res, 200, { ok: true, user: user || null });
}
async function handleLogout(_req, res) {
  clearSessionCookie(res);
  sendJson(res, 200, { ok: true });
}
async function handleAdminCreateCustomer(req, res) {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const body = await readJson(req);
  const row = await getStateRow();
  const current = mergeState(row.data);
  const username = cleanName(body.username || "");
  if (!username || !body.password || !body.name) {
    sendError(res, 400, "Missing customer name, username or password.");
    return;
  }
  if (current.users.some(u => normalizeName(u.username) === normalizeName(username))) {
    sendError(res, 409, "Username already exists.");
    return;
  }
  const customer = {
    id: `cus_${uid()}`,
    name: cleanName(body.name),
    contactName: cleanName(body.contactName || ""),
    phone: cleanName(body.phone || ""),
    email: cleanName(body.email || ""),
    status: "active",
    createdAt: Date.now()
  };
  const user = {
    id: `user_${uid()}`,
    username,
    name: cleanName(body.name),
    role: "customer",
    customerId: customer.id,
    passwordHash: hashPassword(body.password),
    active: true,
    language: body.language || "vi",
    firstLoginDone: false,
    createdAt: Date.now()
  };
  current.customers.unshift(customer);
  current.users.unshift(user);
  addLog(current, "Customers", "Customer created", "SUCCESS", customer.name);
  const saved = await saveState(current);
  sendJson(res, 200, { ok: true, data: scopeStateForUser(saved.data, auth.user), customer, user: sanitizeUser(user) });
}

async function handleAdminUpdateCustomerLogin(req, res, customerId) {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const body = await readJson(req);
  const row = await getStateRow();
  const current = mergeState(row.data);
  const customer = current.customers.find(c => String(c.id) === String(customerId));
  if (!customer) {
    sendError(res, 404, "Customer not found.");
    return;
  }

  let user = current.users.find(u => String(u.customerId || "") === String(customerId) && normalizeName(u.role) === "customer");
  const username = cleanName(body.username || user?.username || "");
  if (!username) {
    sendError(res, 400, "Username is required.");
    return;
  }
  const duplicated = current.users.find(u => normalizeName(u.username) === normalizeName(username) && String(u.id || "") !== String(user?.id || ""));
  if (duplicated) {
    sendError(res, 409, "Username already exists.");
    return;
  }

  if (!user) {
    const password = String(body.password || "123456");
    user = {
      id: `user_${uid()}`,
      username,
      name: customer.name,
      role: "customer",
      customerId: customer.id,
      passwordHash: hashPassword(password),
      active: true,
      language: body.language || "vi",
      firstLoginDone: false,
      createdAt: Date.now()
    };
    current.users.unshift(user);
  } else {
    user.username = username;
    user.name = cleanName(body.name || user.name || customer.name);
    user.role = "customer";
    user.customerId = customer.id;
    user.active = body.active === "false" ? false : true;
    user.language = body.language || user.language || "vi";
    if (String(body.password || "").trim()) {
      user.passwordHash = hashPassword(String(body.password));
      user.passwordUpdatedAt = new Date().toISOString();
    }
  }

  addLog(current, "Customers", "Customer login updated", "SUCCESS", customer.name);
  const saved = await saveState(current);
  sendJson(res, 200, { ok: true, data: scopeStateForUser(saved.data, auth.user), customer, user: sanitizeUser(user) });
}

async function handleAdminDeleteCustomer(req, res, customerId) {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const row = await getStateRow();
  const current = mergeState(row.data);
  const customer = current.customers.find(c => String(c.id) === String(customerId));
  if (!customer) {
    sendError(res, 404, "Customer not found.");
    return;
  }

  current.customers = current.customers.filter(c => String(c.id) !== String(customerId));
  current.users = current.users.filter(u => String(u.customerId || "") !== String(customerId));
  current.devices = current.devices.filter(d => String(d.customerId || "") !== String(customerId));
  current.videos = current.videos.filter(v => String(v.customerId || "") !== String(customerId));
  current.audio = current.audio.filter(a => String(a.customerId || "") !== String(customerId));
  current.videoPlaylists = current.videoPlaylists.filter(p => String(p.customerId || "") !== String(customerId));
  current.audioPlaylists = current.audioPlaylists.filter(p => String(p.customerId || "") !== String(customerId));
  current.autoPlaylists = current.autoPlaylists.filter(p => String(p.customerId || "") !== String(customerId));
  current.assistantScripts = current.assistantScripts.filter(s => String(s.customerId || "") !== String(customerId));

  addLog(current, "Customers", "Customer deleted", "WARNING", customer.name);
  const saved = await saveState(current);
  sendJson(res, 200, { ok: true, data: scopeStateForUser(saved.data, auth.user) });
}
async function handleAdminCreateDevice(req, res) {
  const auth = await requireAdmin(req, res);
  if (!auth) return;
  const body = await readJson(req);
  const row = await getStateRow();
  const current = mergeState(row.data);
  if (!body.name || !body.deviceCode || !body.customerId) {
    sendError(res, 400, "Missing device name, code or customer.");
    return;
  }
  if (current.devices.some(d => normalizeName(d.deviceCode) === normalizeName(body.deviceCode))) {
    sendError(res, 409, "Device code already exists.");
    return;
  }
  const device = {
    id: `dev_${uid()}`,
    customerId: body.customerId,
    name: cleanName(body.name),
    deviceCode: cleanName(body.deviceCode),
    location: cleanName(body.location || ""),
    status: "OFFLINE",
    runtimeMode: body.runtimeMode || "ASSISTANT",
    powerCommand: "STOP",
    streamUrl: cleanName(body.streamUrl || ""),
    currentScreen: "",
    currentVideoId: "",
    currentAudioId: "",
    idleAdsAfterSec: Number(body.idleAdsAfterSec || 30),
    lastSeenAt: null,
    createdAt: Date.now()
  };
  current.devices.unshift(device);
  addLog(current, "Devices", "Device created", "SUCCESS", device.deviceCode);
  const saved = await saveState(current);
  sendJson(res, 200, { ok: true, data: scopeStateForUser(saved.data, auth.user), device });
}
async function handleDeviceManifest(_req, res, deviceCode) {
  const row = await getStateRow();
  const current = mergeState(row.data);
  const device = current.devices.find(d => normalizeName(d.deviceCode) === normalizeName(deviceCode));
  if (!device) {
    sendError(res, 404, "Device not found.");
    return;
  }
  const cid = device.customerId;
  const videos = current.videos.filter(v => String(v.customerId || "") === String(cid) && v.status !== "Inactive");
  const audio = current.audio.filter(a => String(a.customerId || "") === String(cid) && a.status !== "Inactive");
  const videoPlaylists = current.videoPlaylists.filter(p => String(p.customerId || "") === String(cid));
  const audioPlaylists = current.audioPlaylists.filter(p => String(p.customerId || "") === String(cid));
  sendJson(res, 200, {
    ok: true,
    device: {
      deviceCode: device.deviceCode,
      name: device.name,
      runtimeMode: device.runtimeMode,
      powerCommand: device.powerCommand,
      idleAdsAfterSec: device.idleAdsAfterSec || Number(current.settings.idleAdsAfterSec || 30)
    },
    contentVersion: current.updated_at || Date.now(),
    settings: publicSettings(current.settings),
    videos,
    audio,
    videoPlaylists,
    audioPlaylists
  });
}
async function handleDeviceHeartbeat(req, res, deviceCode) {
  const body = await readJson(req, 2 * 1024 * 1024);
  const row = await getStateRow();
  const current = mergeState(row.data);
  const device = current.devices.find(d => normalizeName(d.deviceCode) === normalizeName(deviceCode));
  if (!device) {
    sendError(res, 404, "Device not found.");
    return;
  }
  Object.assign(device, {
    status: "ONLINE",
    lastSeenAt: new Date().toISOString(),
    mode: body.mode || body.runtimeMode || device.mode,
    runtimeMode: body.runtimeMode || device.runtimeMode,
    currentScreen: body.currentScreen || body.currentAd || body.currentVideo || device.currentScreen,
    currentVideoId: body.currentVideoId || device.currentVideoId,
    currentAudioId: body.currentAudioId || device.currentAudioId,
    cameraStatus: body.cameraStatus || device.cameraStatus || "UNKNOWN",
    motorStatus: body.motorStatus || device.motorStatus || "UNKNOWN",
    streamUrl: body.streamUrl || device.streamUrl,
    appVersion: body.appVersion || device.appVersion,
    storageFreeMb: body.storageFreeMb ?? device.storageFreeMb,
    personDetected: Boolean(body.personDetected),
    detectedZone: body.detectedZone || "",
    lastHeartbeatPayload: body
  });
  addLog(current, "Heartbeat", "Device heartbeat", "SUCCESS", device.deviceCode);
  await saveState(current);
  sendJson(res, 200, { ok: true, received: true });
}
async function handleDeviceLogs(req, res, deviceCode) {
  const body = await readJson(req, 2 * 1024 * 1024);
  const row = await getStateRow();
  const current = mergeState(row.data);
  const device = current.devices.find(d => normalizeName(d.deviceCode) === normalizeName(deviceCode));
  const entries = Array.isArray(body.logs) ? body.logs : [body];
  for (const entry of entries) {
    current.logs.unshift({
      id: uid(),
      time: dateNowLabel(),
      device: deviceCode,
      customerId: device?.customerId || "",
      category: entry.category || "Device",
      event: entry.event || entry.message || "Device log",
      status: entry.status || entry.level || "INFO",
      detail: entry.detail || entry.message || ""
    });
  }
  current.logs = current.logs.slice(0, 300);
  await saveState(current);
  sendJson(res, 200, { ok: true, count: entries.length });
}


async function getStateRow() {
  const supabase = getSupabase();

  if (resolvedStateId) {
    const { data, error } = await supabase
      .from(STATE_TABLE)
      .select("id,data,updated_at")
      .eq("id", resolvedStateId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;
  }

  const { data: rows, error: firstError } = await supabase
    .from(STATE_TABLE)
    .select("id,data,updated_at")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (firstError) throw firstError;
  if (rows && rows.length) {
    resolvedStateId = rows[0].id;
    return rows[0];
  }

  resolvedStateId = resolvedStateId || STATE_ID_ENV || "main";
  const initial = defaultState();
  const { data: inserted, error: insertError } = await supabase
    .from(STATE_TABLE)
    .insert({ id: resolvedStateId, data: initial, updated_at: new Date().toISOString() })
    .select("id,data,updated_at")
    .single();

  if (insertError) throw insertError;
  return inserted;
}

async function saveState(data) {
  const supabase = getSupabase();
  const stateId = resolvedStateId || STATE_ID_ENV || "main";
  resolvedStateId = stateId;

  const clean = mergeState(data);
  const { data: saved, error } = await supabase
    .from(STATE_TABLE)
    .upsert({ id: stateId, data: clean, updated_at: new Date().toISOString() }, { onConflict: "id" })
    .select("id,data,updated_at")
    .single();

  if (error) throw error;
  return saved;
}

function sendJson(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function sendError(res, code, message, details) {
  sendJson(res, code, { ok: false, error: message, details: details ? String(details) : undefined });
}

function readJson(req, limit = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", chunk => {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        reject(new Error("JSON body too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function readBuffer(req, limit = UPLOAD_MAX_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", chunk => {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        reject(new Error(`File too large. Limit is ${formatBytes(limit)}.`));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function safeStorageName(name) {
  const original = cleanName(name || "upload.bin");
  const ext = path.extname(original).toLowerCase();
  const base = path.basename(original, ext)
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 90) || "upload";
  return `${base}${ext || ""}`;
}


function mergeAdminStatePreservingSecrets(currentFullState, incomingAdminState) {
  const current = mergeState(currentFullState);
  const incomingRaw = incomingAdminState && typeof incomingAdminState === "object" ? incomingAdminState : {};
  const next = mergeState(incomingRaw);

  // Frontend only receives sanitized users, so it cannot send passwordHash back.
  // Preserve passwordHash and other secret fields from the database during admin PUT /api/state.
  const oldUsers = Array.isArray(current.users) ? current.users : [];
  const incomingUsers = Array.isArray(incomingRaw.users) ? incomingRaw.users : oldUsers.map(sanitizeUser);
  next.users = incomingUsers.map(user => {
    const old = oldUsers.find(existing =>
      (user.id && existing.id === user.id) ||
      (user.username && normalizeName(existing.username) === normalizeName(user.username))
    );
    return {
      ...(old || {}),
      ...user,
      passwordHash: (typeof user.passwordHash === "string" && user.passwordHash.startsWith("scrypt$"))
        ? user.passwordHash
        : old?.passwordHash
    };
  });

  // Keep database users that are not represented in the incoming sanitized frontend state.
  for (const old of oldUsers) {
    if (!next.users.some(user =>
      (user.id && user.id === old.id) ||
      (user.username && normalizeName(user.username) === normalizeName(old.username))
    )) {
      next.users.push(old);
    }
  }

  return next;
}

async function handleGetState(req, res) {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const row = await getStateRow();
  let current = mergeState(row.data);
  const boot = ensureBootstrap(current);
  current = boot.data;
  if (boot.changed) await saveState(current);
  sendJson(res, 200, {
    ok: true,
    id: row.id,
    updated_at: row.updated_at,
    data: scopeStateForUser(current, auth.user)
  });
}

async function handlePutState(req, res) {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const body = await readJson(req);
  const row = await getStateRow();
  const current = mergeState(row.data);
  const next = auth.user.role === "admin"
    ? mergeAdminStatePreservingSecrets(current, body.data || {})
    : mergeCustomerScopedState(current, body.data || {}, auth.user);
  const boot = ensureBootstrap(next);
  const saved = await saveState(boot.data);
  sendJson(res, 200, {
    ok: true,
    id: saved.id,
    updated_at: saved.updated_at,
    data: scopeStateForUser(saved.data, auth.user)
  });
}

async function handleUploadMedia(req, res, url) {
  const auth = await requireUser(req, res);
  if (!auth) return;

  const kind = url.searchParams.get("kind");
  const originalName = cleanName(url.searchParams.get("name") || "upload.bin");
  const mime = url.searchParams.get("mime") || req.headers["content-type"] || "application/octet-stream";
  const size = Number(url.searchParams.get("size") || 0);
  const duration = cleanName(url.searchParams.get("duration") || "");
  const durationSeconds = Number(url.searchParams.get("durationSeconds") || 0);

  if (!["video", "audio"].includes(kind)) {
    sendError(res, 400, "Invalid media kind. Use kind=video or kind=audio.");
    return;
  }

  const collection = kind === "video" ? "videos" : "audio";
  const row = await getStateRow();
  const current = mergeState(row.data);
  const customerId = auth.user.role === "admin"
    ? cleanName(url.searchParams.get("customerId") || "")
    : auth.user.customerId;

  if (!customerId) {
    sendError(res, 400, "Missing customerId for media upload.");
    return;
  }

  const duplicate = current[collection].some(item =>
    String(item.customerId || "") === String(customerId) &&
    normalizeName(item.name) === normalizeName(originalName)
  );
  if (duplicate) {
    sendError(res, 409, `A ${kind} named "${originalName}" already exists for this customer.`);
    return;
  }

  const buffer = await readBuffer(req);
  const fileName = safeStorageName(originalName);
  const storagePath = `${kind}s/${customerId}/${Date.now()}-${fileName}`;
  const supabase = getSupabase();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: mime,
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const item = kind === "video"
    ? {
        id: uid(),
        customerId,
        name: originalName,
        slug: fileName,
        type: "Video",
        duration: duration || "00:00",
        size: formatBytes(size || buffer.length),
        sizeBytes: size || buffer.length,
        durationSeconds,
        status: "Active",
        updated: dateNowLabel(),
        storagePath,
        publicUrl: publicData.publicUrl,
        mimeType: mime
      }
    : {
        id: uid(),
        customerId,
        name: originalName,
        description: "Receptionist audio",
        role: url.searchParams.get("role") || "greeting",
        label: url.searchParams.get("label") || "",
        duration: duration || "00:00",
        format: (path.extname(fileName).replace(".", "") || "AUDIO").toUpperCase(),
        durationSeconds,
        size: formatBytes(size || buffer.length),
        sizeBytes: size || buffer.length,
        status: "Active",
        updated: dateNowLabel(),
        storagePath,
        publicUrl: publicData.publicUrl,
        mimeType: mime
      };

  current[collection].unshift(item);
  addLog(current, kind === "video" ? "Video" : "Audio", `${kind} uploaded`, "SUCCESS", originalName);
  current.logs[0].customerId = customerId;
  const saved = await saveState(current);

  sendJson(res, 200, {
    ok: true,
    id: saved.id,
    updated_at: saved.updated_at,
    item,
    data: scopeStateForUser(saved.data, auth.user)
  });
}

async function handleDeleteMedia(req, res, pathname) {
  const auth = await requireUser(req, res);
  if (!auth) return;

  const parts = pathname.split("/").filter(Boolean);
  const kind = parts[2];
  const id = decodeURIComponent(parts[3] || "");

  if (!["video", "audio"].includes(kind) || !id) {
    sendError(res, 400, "Invalid delete media request.");
    return;
  }

  const collection = kind === "video" ? "videos" : "audio";
  const row = await getStateRow();
  const current = mergeState(row.data);
  const item = current[collection].find(x => x.id === id);

  if (!item) {
    sendError(res, 404, "Media item not found.");
    return;
  }
  if (!itemBelongsToUser(item, auth.user)) {
    sendError(res, 403, "You do not have access to this media item.");
    return;
  }
  if (!itemBelongsToUser(item, auth.user)) {
    sendError(res, 403, "You do not have access to this media item.");
    return;
  }

  if (item.storagePath) {
    const supabase = getSupabase();
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([item.storagePath]);
    if (removeError) throw removeError;
  }

  current[collection] = current[collection].filter(x => x.id !== id);
  current.videoPlaylists.forEach(p => { p.items = (p.items || []).filter(x => x.mediaId !== id); });
  current.audioPlaylists.forEach(p => { p.items = (p.items || []).filter(x => x.mediaId !== id); });
  addLog(current, "Media", `${kind} deleted`, "WARNING", item.name);
  current.logs[0].customerId = item.customerId || "";
  const saved = await saveState(current);

  sendJson(res, 200, {
    ok: true,
    id: saved.id,
    updated_at: saved.updated_at,
    data: scopeStateForUser(saved.data, auth.user)
  });
}

async function handlePing(req, res, url) {
  const target = url.searchParams.get("target") || "/health";
  const timeoutMs = Math.max(500, Math.min(15000, Number(url.searchParams.get("timeout") || 3000)));
  const fullTarget = target.startsWith("http://") || target.startsWith("https://")
    ? target
    : `http://${req.headers.host || "localhost"}${target.startsWith("/") ? target : `/${target}`}`;

  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(fullTarget, { method: "GET", signal: controller.signal });
    clearTimeout(timer);
    sendJson(res, 200, { ok: true, target, status: response.status, latencyMs: Date.now() - started });
  } catch (err) {
    clearTimeout(timer);
    sendError(res, 502, "Ping failed", err.message || err);
  }
}

async function handleGetMediaFile(req, res, pathname) {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const parts = pathname.split("/").filter(Boolean);
  const kind = parts[3];
  const id = decodeURIComponent(parts[4] || "");

  if (!["video", "audio"].includes(kind) || !id) {
    sendError(res, 400, "Invalid media file request.");
    return;
  }

  const collection = kind === "video" ? "videos" : "audio";
  const row = await getStateRow();
  const current = mergeState(row.data);
  const item = current[collection].find(x => x.id === id);

  if (!item) {
    sendError(res, 404, "Media item not found.");
    return;
  }
  if (!itemBelongsToUser(item, auth.user)) {
    sendError(res, 403, "You do not have access to this media item.");
    return;
  }

  if (item.storagePath) {
    const supabase = getSupabase();
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(item.storagePath, 60 * 60);
    if (error) throw error;
    res.writeHead(302, {
      Location: data.signedUrl,
      "Cache-Control": "no-store"
    });
    res.end();
    return;
  }

  const fallbackUrl = item.publicUrl || item.fileUrl || item.url;
  if (fallbackUrl) {
    res.writeHead(302, {
      Location: fallbackUrl,
      "Cache-Control": "no-store"
    });
    res.end();
    return;
  }

  sendError(res, 404, "This media item has no storage path or URL.");
}

function isAllowedProbeUrl(rawUrl) {
  let parsed;
  try { parsed = new URL(rawUrl); } catch { return false; }
  if (!["http:", "https:"].includes(parsed.protocol)) return false;
  const host = parsed.hostname.toLowerCase();
  if (!host || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return true;
  // Allow private/LAN/Tailscale style addresses and public camera endpoints.
  return true;
}

function handleStreamProbe(_req, res, url) {
  const target = url.searchParams.get("url") || "";
  const prevHash = url.searchParams.get("prevHash") || "";
  const maxBytes = 96 * 1024;
  const timeoutMs = 3500;

  if (!target || !isAllowedProbeUrl(target)) {
    sendError(res, 400, "Invalid stream URL.");
    return;
  }

  const parsed = new URL(target);
  const client = parsed.protocol === "https:" ? require("https") : require("http");
  let settled = false;
  let bytesRead = 0;
  const chunks = [];
  const hash = crypto.createHash("sha1");

  const finish = (statusCode, headers, errorMessage = "") => {
    if (settled) return;
    settled = true;
    const digest = bytesRead ? hash.digest("hex") : "";
    const changed = !!digest && !!prevHash && digest !== prevHash;
    sendJson(res, errorMessage ? 502 : 200, {
      ok: !errorMessage,
      reachable: !errorMessage && statusCode >= 200 && statusCode < 400 && bytesRead > 0,
      statusCode,
      contentType: headers?.["content-type"] || "",
      bytesRead,
      hash: digest,
      changed,
      reason: errorMessage || (changed ? "visual-change" : bytesRead ? "reachable" : "no-frame")
    });
  };

  const request = client.get(parsed, {
    timeout: timeoutMs,
    headers: {
      "User-Agent": "HoloBox-Manager-StreamProbe/12.6",
      "Accept": "multipart/x-mixed-replace,image/jpeg,image/*,*/*"
    }
  }, upstream => {
    upstream.on("data", chunk => {
      if (settled) return;
      chunks.push(chunk);
      hash.update(chunk);
      bytesRead += chunk.length;
      if (bytesRead >= maxBytes) {
        request.destroy();
        finish(upstream.statusCode || 200, upstream.headers);
      }
    });
    upstream.on("end", () => finish(upstream.statusCode || 200, upstream.headers));
    upstream.on("error", err => finish(upstream.statusCode || 0, upstream.headers, err.message));
  });

  request.on("timeout", () => {
    request.destroy();
    finish(0, {}, "Stream probe timeout.");
  });
  request.on("error", err => finish(0, {}, err.message || "Stream probe failed."));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Content-Length": data.length,
      "Cache-Control": [".html", ".js", ".css"].includes(ext) ? "no-cache, no-store, must-revalidate" : "public, max-age=3600"
    });
    res.end(data);
  });
}

function safeResolve(requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const relative = normalized === "/" ? "index.html" : normalized.replace(/^[/\\]/, "");
  const fullPath = path.join(ROOT, relative);

  if (!fullPath.startsWith(ROOT)) {
    return path.join(ROOT, "index.html");
  }
  return fullPath;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    if (pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        service: "holobox-manager-tlc",
        version: "13.1.4-phase2-customer-actions-layout-add-device",
        supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY),
        stateTable: STATE_TABLE,
        stateId: resolvedStateId || STATE_ID_ENV || null,
        bucket: BUCKET,
        uptime: process.uptime()
      });
      return;
    }

    if (pathname === "/api/public/config" && req.method === "GET") {
      await handlePublicConfig(req, res);
      return;
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      await handleLogin(req, res);
      return;
    }

    if (pathname === "/api/auth/me" && req.method === "GET") {
      await handleMe(req, res);
      return;
    }

    if (pathname === "/api/auth/logout" && req.method === "POST") {
      await handleLogout(req, res);
      return;
    }

    if (pathname === "/api/admin/customers" && req.method === "POST") {
      await handleAdminCreateCustomer(req, res);
      return;
    }

    if (pathname === "/api/admin/devices" && req.method === "POST") {
      await handleAdminCreateDevice(req, res);
      return;
    }

    const customerLoginMatch = pathname.match(/^\/api\/admin\/customers\/([^/]+)\/login$/);
    if (customerLoginMatch && req.method === "PUT") {
      await handleAdminUpdateCustomerLogin(req, res, decodeURIComponent(customerLoginMatch[1]));
      return;
    }

    const customerDeleteMatch = pathname.match(/^\/api\/admin\/customers\/([^/]+)$/);
    if (customerDeleteMatch && req.method === "DELETE") {
      await handleAdminDeleteCustomer(req, res, decodeURIComponent(customerDeleteMatch[1]));
      return;
    }

    const deviceManifestMatch = pathname.match(/^\/api\/device\/([^/]+)\/manifest$/);
    if (deviceManifestMatch && req.method === "GET") {
      await handleDeviceManifest(req, res, decodeURIComponent(deviceManifestMatch[1]));
      return;
    }

    const deviceHeartbeatMatch = pathname.match(/^\/api\/device\/([^/]+)\/heartbeat$/);
    if (deviceHeartbeatMatch && req.method === "POST") {
      await handleDeviceHeartbeat(req, res, decodeURIComponent(deviceHeartbeatMatch[1]));
      return;
    }

    const deviceLogsMatch = pathname.match(/^\/api\/device\/([^/]+)\/logs$/);
    if (deviceLogsMatch && req.method === "POST") {
      await handleDeviceLogs(req, res, decodeURIComponent(deviceLogsMatch[1]));
      return;
    }

    if (pathname === "/api/state" && req.method === "GET") {
      await handleGetState(req, res);
      return;
    }

    if (pathname === "/api/state" && req.method === "PUT") {
      await handlePutState(req, res);
      return;
    }

    if (pathname === "/api/media/upload" && req.method === "POST") {
      await handleUploadMedia(req, res, url);
      return;
    }

    if (pathname.startsWith("/api/media/file/") && req.method === "GET") {
      await handleGetMediaFile(req, res, pathname);
      return;
    }

    if (pathname.startsWith("/api/media/") && req.method === "DELETE") {
      await handleDeleteMedia(req, res, pathname);
      return;
    }

    if (pathname === "/api/ping" && req.method === "GET") {
      await handlePing(req, res, url);
      return;
    }

    if (pathname === "/api/stream/probe" && req.method === "GET") {
      handleStreamProbe(req, res, url);
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendError(res, 404, "API route not found.");
      return;
    }

    const requestedFile = safeResolve(req.url || "/");
    fs.stat(requestedFile, (err, stat) => {
      if (!err && stat.isFile()) {
        sendFile(res, requestedFile);
        return;
      }
      sendFile(res, path.join(ROOT, "index.html"));
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, err.message || "Internal server error");
  }
});

server.listen(PORT, () => {
  console.log(`HoloBox Manager Phase 1 role portal running on port ${PORT}`);
});
