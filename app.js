const APP_VERSION = "13.1.11-phase2-real-tlc-logo";
const APP_FEATURES = [
  "phase2-customer-upload-polish",
  "one-admin-only-bootstrap",
  "manual-customer-accounts",
  "customer-dashboard-in-admin",
  "manual-assistant-template",
  "admin-customers-only-device-management",
  "svg-flag-language-switcher",
  "v3-style-buttons-and-copy"
];

const STORAGE_KEY = "holobox_manager_phase1_cache";
const TLC_LOGO_SRC = "data:image/png;base64,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";

let state = {
  ready: false,
  user: null,
  portal: "login",
  view: "login",
  language: localStorage.getItem("holobox_lang") || "vi",
  search: "",
  mediaTab: "video",
  viewingCustomerId: "",
  selectedCustomerId: "",
  data: defaultData(),
};

const appRoot = document.getElementById("app");
const modalRoot = document.getElementById("modalRoot");
const toastRoot = document.getElementById("toastRoot");

const dict = {
  vi: {
    "Login": "Đăng nhập",
    "Logout": "Đăng xuất",
    "Username": "Tên đăng nhập",
    "Password": "Mật khẩu",
    "Home": "Trang chủ",
    "Video": "Video",
    "Audio": "Âm thanh",
    "Contact": "Liên hệ",
    "Dashboard": "Tổng quan",
    "Customers": "Khách hàng",
    "Devices": "Thiết bị",
    "Media": "Nội dung",
    "Assistant": "Lễ tân ảo",
    "Logs": "Nhật ký",
    "Maintenance": "Bảo trì",
    "Settings": "Cài đặt",
    "Start HoloBox": "Bật HoloBox",
    "Stop": "Tắt",
    "Online": "Online",
    "Offline": "Offline",
    "Connecting": "Đang kết nối",
    "Assistant Mode": "Chế độ lễ tân",
    "Just Ads Mode": "Chỉ quảng cáo",
    "Now playing": "Đang chiếu",
    "HoloBox Screen": "Màn hình HoloBox",
    "Video list": "Danh sách video",
    "Receptionist audio": "Audio lễ tân",
    "Add video": "Thêm video",
    "Add audio": "Thêm audio",
    "Upload": "Tải lên",
    "Auto playlist": "Tự sắp playlist",
    "Maintenance Contact": "Thông tin bảo trì",
    "Phone": "Số điện thoại",
    "Email": "Email",
    "Close": "Đóng",
    "Create customer": "Tạo khách hàng",
    "Create device": "Tạo HoloBox",
    "View as Customer": "Xem như khách hàng",
    "Back to Admin": "Về Admin",
    "No data": "Chưa có dữ liệu",
    "Save": "Lưu",
    "Delete": "Xóa",
    "Preview": "Xem thử",
    "Role": "Quyền",
    "Open": "Mở",
    "Back": "Quay lại",
    "Copy": "Sao chép",
    "Create assistant template": "Tạo mẫu lễ tân",
    "Title": "Tiêu đề",
    "Content": "Nội dung",
    "Customer": "Khách hàng",
    "Device code": "Mã thiết bị",
    "Mode": "Chế độ",
    "Status": "Trạng thái",
    "Last seen": "Lần cuối",
    "Add HoloBox": "Thêm HoloBox",
    "Info": "Thông tin",
    "Login info": "Thông tin đăng nhập",
    "Edit": "Sửa",
    "Edit HoloBox": "Sửa HoloBox",
    "Update device": "Cập nhật thiết bị",
    "Device name": "Tên thiết bị",
    "Stream URL": "Stream URL",
    "Delete device": "Xóa thiết bị",
    "Open customer": "Mở khách hàng",
    "Current screen": "Đang chiếu",
  },
  en: {}
};
dict.en = Object.fromEntries(Object.keys(dict.vi).map(k => [k, k]));

function t(key) {
  return (dict[state.language] && dict[state.language][key]) || key;
}

function defaultData() {
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
      defaultLanguage: "vi",
      maintenancePhone: "090x xxx xxx",
      maintenanceEmail: "support@tlc.vn",
      maintenanceZalo: "",
      offlineTimeout: "30",
      idleAdsAfterSec: "30",
      maxUploadMb: "500"
    }
  };
}
function mergeData(remote) {
  const fallback = defaultData();
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
}
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function normalizeName(v) {
  return String(v || "").trim().toLowerCase();
}
function formatTime(seconds) {
  const s = Math.max(0, Math.round(Number(seconds || 0)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function icon(name) {
  const map = {
    home: "⌂", video: "▶", audio: "♪", logout: "↩", users: "👥", monitor: "▣", media: "▤",
    assistant: "◉", logs: "≡", wrench: "⚙", settings: "⚙", plus: "+", upload: "⇧",
    trash: "×", play: "▶", phone: "☎", mail: "✉", lock: "●", dashboard: "◆", back: "←",
    save: "✓", refresh: "↻", search: "⌕", eye: "👁", eyeOff: "◉", info: "i", edit: "✎", power: "⏻"
  };
  return `<span class="ico">${map[name] || "•"}</span>`;
}
function statusBadge(status) {
  const raw = String(status || "Offline");
  const s = raw.toLowerCase();
  let cls = "gray";
  if (["online", "active", "success", "published"].includes(s)) cls = "green";
  if (["connecting", "warning", "pending"].includes(s)) cls = "orange";
  if (["offline", "error", "inactive"].includes(s)) cls = "red";
  return `<span class="badge ${cls}">${cls === "green" ? `<span class="status-dot"></span>` : ""}${escapeHtml(t(raw) || raw)}</span>`;
}
function lastSeenLabel(value) {
  if (!value) return "Never";
  const ts = typeof value === "number" ? value : new Date(value).getTime();
  if (!ts) return "Never";
  const age = Math.max(0, Date.now() - ts);
  if (age < 10000) return "Just now";
  if (age < 60000) return `${Math.round(age / 1000)}s ago`;
  if (age < 3600000) return `${Math.round(age / 60000)}m ago`;
  return new Date(ts).toLocaleString();
}
function computedDeviceStatus(device) {
  if (!device) return "Offline";
  const manual = String(device.status || "").toUpperCase();
  if (manual === "ERROR") return "Error";
  const last = device.lastSeenAt || device.lastSeen;
  if (!last) return "Offline";
  const age = Date.now() - new Date(last).getTime();
  const offlineMs = Math.max(30, Number(state.data.settings.offlineTimeout || 30)) * 1000;
  if (age > offlineMs) return "Offline";
  if (age > offlineMs / 2) return "Connecting";
  return "Online";
}

async function apiJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    }
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload.ok === false) throw new Error(payload.error || `Request failed (${res.status})`);
  return payload;
}
async function apiMe() {
  return apiJson("/api/auth/me");
}
async function loadData() {
  const payload = await apiJson("/api/state");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.data || {}));
  return mergeData(payload.data);
}
async function saveData() {
  const payload = await apiJson("/api/state", {
    method: "PUT",
    body: JSON.stringify({ data: state.data })
  });
  state.data = mergeData(payload.data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  return state.data;
}
async function refreshData() {
  state.data = await loadData();
  render();
}

function showLoading(title = "Processing...", subtitle = "Please wait") {
  const el = document.getElementById("loadingOverlay");
  if (!el) return;
  document.getElementById("loadingTitle").textContent = title;
  document.getElementById("loadingSubtitle").textContent = subtitle;
  el.classList.remove("hidden");
}
function hideLoading() {
  document.getElementById("loadingOverlay")?.classList.add("hidden");
}
function toast(type, title, message = "") {
  if (!toastRoot) return;
  const el = document.createElement("div");
  el.className = `toast ${type || "info"}`;
  el.innerHTML = `<strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ""}`;
  toastRoot.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}
function modal(title, body, actions = "") {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-backdrop-close="true">
    <div class="modal-card">
      <div class="modal-head"><h2>${escapeHtml(title)}</h2><button class="icon-close" data-action="close-modal" type="button">×</button></div>
      <div class="modal-body">${body}</div>
      ${actions ? `<div class="modal-actions">${actions}</div>` : ""}
    </div>
  </div>`;
}
function closeModal() {
  modalRoot.innerHTML = "";
}
async function confirmModal(title, body) {
  return new Promise(resolve => {
    modal(title, `<p>${escapeHtml(body)}</p>`, `<button class="action-btn" data-confirm="no">${t("Close")}</button><button class="action-btn danger" data-confirm="yes">${t("Delete")}</button>`);
    const handler = e => {
      const btn = e.target.closest("[data-confirm]");
      if (!btn) return;
      modalRoot.removeEventListener("click", handler);
      closeModal();
      resolve(btn.dataset.confirm === "yes");
    };
    modalRoot.addEventListener("click", handler);
  });
}

const adminNav = [
  ["dashboard", "Dashboard", "dashboard"],
  ["customers", "Customers", "users"],
  ["assistant", "Assistant", "assistant"],
  ["logs", "Logs", "logs"],
  ["maintenance", "Maintenance", "wrench"],
  ["settings", "Settings", "settings"],
];
const customerNav = [
  ["customerHome", "Home", "home"],
  ["customerVideo", "Video", "video"],
  ["customerAudio", "Audio", "audio"],
];

function currentCustomerId() {
  if (state.user?.role === "admin" && state.viewingCustomerId) return state.viewingCustomerId;
  return state.user?.customerId || "";
}
function customerName(id = currentCustomerId()) {
  return state.data.customers.find(c => c.id === id)?.name || "Customer";
}
function customerDevices(id = currentCustomerId()) {
  return state.data.devices.filter(d => String(d.customerId || "") === String(id || ""));
}
function primaryDevice() {
  return customerDevices()[0] || null;
}
function customerVideos(id = currentCustomerId()) {
  return state.data.videos.filter(v => String(v.customerId || "") === String(id || ""));
}
function customerAudios(id = currentCustomerId()) {
  return state.data.audio.filter(a => String(a.customerId || "") === String(id || ""));
}
function customerPlaylists(id = currentCustomerId()) {
  return state.data.videoPlaylists.filter(p => String(p.customerId || "") === String(id || ""));
}
function mediaName(id, kind = "video") {
  const list = kind === "audio" ? state.data.audio : state.data.videos;
  return list.find(x => x.id === id)?.name || "";
}

function render() {
  if (!state.ready) {
    appRoot.innerHTML = `<div class="splash"><div class="spinner-glow"></div><h2>HoloBox</h2><p>Loading...</p></div>`;
    return;
  }
  if (!state.user) {
    appRoot.innerHTML = renderLogin();
    return;
  }
  appRoot.innerHTML = state.portal === "customer" ? renderCustomerShell() : renderAdminShell();
}

function renderLogin() {
  return `<div class="login-shell">
    <div class="login-tools">${renderLanguageTools()}<button class="header-btn" data-action="contact">${t("Contact")}</button></div>
    <section class="login-hero">
      <div class="login-brand-card">
        <img class="tlc-logo-img tlc-login-logo" src="${TLC_LOGO_SRC}" alt="TLC logo">
        <h1>TLC HoloBox Manager</h1>
      </div>
      <form class="login-card" data-form="login">
        <h2>${t("Login")}</h2>
        <p class="subtitle">Default admin: <b>admin</b> / <b>admin123</b>. Change this after first deploy.</p>
        <label>${t("Username")}<input class="input" name="username" autocomplete="username" required></label>
        <label>${t("Password")}
          <div class="password-field">
            <input class="input" name="password" type="password" autocomplete="current-password" required data-login-password>
            <button class="password-eye" type="button" data-action="toggle-login-password" aria-label="Show password" title="Hiện mật khẩu">${icon("eye")}</button>
          </div>
        </label>
        <button class="action-btn primary wide" type="submit">${t("Login")}</button>
      </form>
    </section>
  </div>`;
}
function flagSvg(lang) {
  if (lang === "vi") {
    return `<svg viewBox="0 0 30 20" class="flag-svg" aria-hidden="true"><rect width="30" height="20" rx="2" fill="#da251d"/><polygon fill="#ff0" points="15,3.2 16.8,8.1 22,8.1 17.7,11.1 19.4,16 15,13 10.6,16 12.3,11.1 8,8.1 13.2,8.1"/></svg>`;
  }
  return `<svg viewBox="0 0 30 20" class="flag-svg" aria-hidden="true"><rect width="30" height="20" rx="2" fill="#fff"/><g fill="#b22234"><rect y="0" width="30" height="1.54"/><rect y="3.08" width="30" height="1.54"/><rect y="6.16" width="30" height="1.54"/><rect y="9.24" width="30" height="1.54"/><rect y="12.32" width="30" height="1.54"/><rect y="15.4" width="30" height="1.54"/><rect y="18.48" width="30" height="1.52"/></g><rect width="12.6" height="10.8" rx="1" fill="#3c3b6e"/><g fill="#fff"><circle cx="2" cy="2" r=".55"/><circle cx="5" cy="2" r=".55"/><circle cx="8" cy="2" r=".55"/><circle cx="11" cy="2" r=".55"/><circle cx="3.5" cy="4" r=".55"/><circle cx="6.5" cy="4" r=".55"/><circle cx="9.5" cy="4" r=".55"/><circle cx="2" cy="6" r=".55"/><circle cx="5" cy="6" r=".55"/><circle cx="8" cy="6" r=".55"/><circle cx="11" cy="6" r=".55"/><circle cx="3.5" cy="8" r=".55"/><circle cx="6.5" cy="8" r=".55"/><circle cx="9.5" cy="8" r=".55"/></g></svg>`;
}
function renderLanguageTools() {
  return `<div class="lang-switch">
    <button class="flag-btn ${state.language === "vi" ? "active" : ""}" data-action="change-language" data-lang="vi" title="Tiếng Việt">${flagSvg("vi")}</button>
    <button class="flag-btn ${state.language === "en" ? "active" : ""}" data-action="change-language" data-lang="en" title="English">${flagSvg("en")}</button>
  </div>`;
}

function accountLabel() {
  const user = state.user || {};
  const label = user.name || user.username || "User";
  if (normalizeName(user.role) === "customer") return label;
  return `${label} · ${user.role || ""}`.trim();
}

function renderTopbar(title, subtitle = "", subtitleIsHtml = false) {
  return `<header class="topbar">
    <div>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p>${subtitleIsHtml ? subtitle : escapeHtml(subtitle)}</p>` : ""}
    </div>
    <div class="topbar-actions">
      ${state.user?.role === "admin" && state.portal === "customer" ? `<button class="header-btn" data-action="back-admin">${icon("back")} ${t("Back to Admin")}</button>` : ""}
      ${renderLanguageTools()}
      <button class="header-btn" data-action="contact">${t("Contact")}</button>
      <div class="account-pill">${escapeHtml(accountLabel())}</div>
    </div>
  </header>`;
}
function renderCustomerSidebarPower() {
  if (state.portal !== "customer") return "";
  const device = primaryDevice();
  const isOff = !device || device.powerCommand === "STOP";
  const title = isOff ? "Bật HoloBox" : "Tắt HoloBox";
  return `<div class="sidebar-power-dock">
    <button class="sidebar-power-button ${isOff ? "is-off" : "is-on"}" data-action="toggle-customer-device-power" data-id="${device?.id || ""}" title="${title}" aria-label="${title}">
      ${icon("power")}
    </button>
  </div>`;
}

function renderSidebar(items, brandSub) {
  return `<aside class="sidebar">
    <div class="brand brand-logo-only">
      <img class="tlc-logo-img tlc-sidebar-logo" src="${TLC_LOGO_SRC}" alt="TLC logo">
    </div>
    <nav class="nav">${items.map(([key, label, ico]) => `<button class="nav-btn ${state.view === key ? "active" : ""}" data-action="nav" data-view="${key}">${icon(ico)}<span>${t(label)}</span></button>`).join("")}</nav>
    ${renderCustomerSidebarPower()}
    <div class="sidebar-spacer"></div>
    <button class="nav-btn logout" data-action="logout">${icon("logout")}<span>${t("Logout")}</span></button>
  </aside>`;
}

function renderAdminShell() {
  return `<div class="app-shell phase-shell admin-shell">
    ${renderSidebar(adminNav, "Admin Portal")}
    <main class="main">
      ${renderTopbar(t(state.view === "dashboard" ? "Dashboard" : adminNav.find(x => x[0] === state.view)?.[1] || "Dashboard"), "Quản lý khách hàng, lễ tân ảo, nhật ký và bảo trì.")}
      <section class="content">${renderAdminView()}</section>
    </main>
  </div>`;
}
function renderAdminView() {
  switch (state.view) {
    case "customers": return renderAdminCustomers();
    case "assistant": return renderAdminAssistant();
    case "logs": return renderAdminLogs();
    case "maintenance": return renderAdminMaintenance();
    case "settings": return renderAdminSettings();
    default: return renderAdminDashboard();
  }
}

function renderAdminDashboard() {
  const online = state.data.devices.filter(d => computedDeviceStatus(d) === "Online").length;
  const offline = state.data.devices.length - online;
  const errors = state.data.logs.filter(l => String(l.status).toUpperCase() === "ERROR").length;
  return `<div class="stats-grid">
    ${statCard("Customers", state.data.customers.length, "Registered customer accounts", "users")}
    ${statCard("Devices", state.data.devices.length, `${online} online · ${offline} offline`, "monitor")}
    ${statCard("Media", state.data.videos.length + state.data.audio.length, `${state.data.videos.length} video · ${state.data.audio.length} audio`, "media")}
    ${statCard("Logs", errors, "Errors need checking", "logs")}
  </div>
  <div class="two-col equal">
    <section class="panel"><div class="panel-toolbar"><h2>${t("Devices")}</h2><button class="mini-btn" data-action="refresh">${icon("refresh")} Refresh</button></div>${renderDeviceTable(state.data.devices.slice(0, 6), true)}</section>
    <section class="panel"><h2>${t("Logs")}</h2>${renderLogList(state.data.logs.slice(0, 8))}</section>
  </div>`;
}
function statCard(title, value, caption, ico) {
  return `<div class="card stat-card"><div class="icon-bubble">${icon(ico)}</div><div><div class="stat-title">${t(title)}</div><div class="stat-number">${escapeHtml(value)}</div><div class="stat-caption">${escapeHtml(caption)}</div></div></div>`;
}
function renderAdminCustomers() {
  const selectedId = state.selectedCustomerId;
  if (selectedId) return renderAdminCustomerDashboard(selectedId);

  return `<div class="two-col">
    <form class="card form-card" data-form="admin-create-customer">
      <h2>${icon("plus")} ${t("Create customer")}</h2>
      <label>Customer name<input class="input" name="name" required placeholder="ABC Coffee"></label>
      <label>Contact name<input class="input" name="contactName" placeholder="Anh A"></label>
      <label>Phone<input class="input" name="phone" placeholder="090..."></label>
      <label>Email<input class="input" name="email" type="email" placeholder="customer@example.com"></label>
      <div class="divider"></div>
      <label>Login username<input class="input" name="username" required placeholder="abc_customer"></label>
      <label>Temporary password<input class="input" name="password" required value="123456"></label>
      <button class="btn btn-primary wide" type="submit">${t("Create customer")}</button>
      <p class="subtitle">Ban đầu hệ thống chỉ có admin. Customer chỉ đăng nhập được sau khi tạo ở đây.</p>
    </form>

    <section class="panel">
      <div class="panel-toolbar">
        <h2>${t("Customers")}</h2>
        <div class="search-wrap">${icon("search")}<input class="search" data-action="search" placeholder="Search..." value="${escapeHtml(state.search)}"></div>
      </div>
      <div class="table">
        <div class="table-head customer-grid"><div>Customer</div><div>Login</div><div>Devices</div><div>Status</div><div>Actions</div></div>
        ${state.data.customers.filter(c => matchesSearch(c.name + c.email + c.phone)).map(c => {
          const user = state.data.users.find(u => u.customerId === c.id && normalizeName(u.role) === "customer");
          const deviceCount = state.data.devices.filter(d => d.customerId === c.id).length;
          return `<div class="table-row customer-grid customer-row">
            <div class="customer-main-cell">
              <button class="customer-name-link" data-action="open-customer" data-id="${c.id}">${escapeHtml(c.name)}</button>
              <div class="sub">${escapeHtml(c.email || "—")} · ${escapeHtml(c.phone || "")}</div>
            </div>
            <div><b>${escapeHtml(user?.username || "—")}</b><div class="sub">${user?.active === false ? "Inactive" : "Active"}</div></div>
            <div class="device-count-cell">${deviceCount}</div>
            <div>${statusBadge(c.status || "active")}</div>
            <div class="actions customer-actions">
              <button class="btn btn-small btn-primary" data-action="open-customer" data-id="${c.id}">${t("Open")}</button>
              <button class="btn btn-small btn-soft" data-action="open-customer" data-id="${c.id}">${icon("plus")} ${t("Add HoloBox")}</button>
              ${user ? `<button class="btn btn-small btn-soft" data-action="customer-login-info" data-id="${c.id}">${icon("info")} ${t("Info")}</button>` : ""}
              <button class="btn btn-small btn-soft" data-action="view-as-customer" data-id="${c.id}">${t("View as Customer")}</button>
              <button class="btn btn-small btn-danger" data-action="delete-customer" data-id="${c.id}">${t("Delete")}</button>
            </div>
          </div>`;
        }).join("") || `<div class="empty">${t("No data")}</div>`}
      </div>
    </section>
  </div>`;
}

function renderAdminCustomerDashboard(customerId) {
  const c = state.data.customers.find(x => x.id === customerId);
  if (!c) {
    state.selectedCustomerId = "";
    return renderAdminCustomers();
  }
  const devices = state.data.devices.filter(d => d.customerId === customerId);
  const online = devices.filter(d => computedDeviceStatus(d) === "Online").length;
  const offline = devices.length - online;
  const videos = state.data.videos.filter(v => v.customerId === customerId);
  const audios = state.data.audio.filter(a => a.customerId === customerId);
  const user = state.data.users.find(u => u.customerId === customerId && normalizeName(u.role) === "customer");

  return `<div class="customer-dashboard">
    <div class="panel-toolbar">
      <div>
        <button class="btn btn-small" data-action="customer-back-list">${icon("back")} ${t("Back")}</button>
        <h2 style="margin-top:12px">${escapeHtml(c.name)}</h2>
        <p class="subtitle">${escapeHtml(c.email || "—")} · ${escapeHtml(c.phone || "—")}</p>
      </div>
      <div class="actions">
        ${user ? `<button class="btn" data-action="customer-login-info" data-id="${c.id}">${icon("info")} ${t("Login info")}</button>` : ""}
        <button class="btn btn-primary" data-action="view-as-customer" data-id="${c.id}">${t("View as Customer")}</button><button class="btn btn-danger" data-action="delete-customer" data-id="${c.id}">${t("Delete")}</button>
      </div>
    </div>

    <div class="stats-grid">
      ${statCard("Devices", devices.length, `${online} online · ${offline} offline`, "monitor")}
      ${statCard("Video", videos.length, "Video quảng cáo", "video")}
      ${statCard("Audio", audios.length, "Audio lễ tân", "audio")}
      ${statCard("Status", c.status || "active", user ? `Login: ${user.username}` : "No login user", "users")}
    </div>

    <div class="two-col">
      <form class="card form-card add-holobox-card" data-form="admin-create-device">
        <h2>${icon("plus")} Thêm HoloBox cho khách</h2><p class="subtitle">Điền mã thiết bị để gán HoloBox mới cho customer này.</p>
        <input type="hidden" name="customerId" value="${escapeHtml(c.id)}">
        <label>Device name<input class="input" name="name" required placeholder="HoloBox Sảnh Chính"></label>
        <label>${t("Device code")}<input class="input" name="deviceCode" required placeholder="HOLOBOX_01"></label>
        <label>Stream URL<input class="input" name="streamUrl" placeholder="http://.../video_feed"></label>
        <input type="hidden" name="runtimeMode" value="ASSISTANT"><p class="subtitle">Customer sẽ tự chuyển giữa Just Ads Mode và Assistant Mode ở màn hình của khách.</p>
        <button class="btn btn-primary wide" type="submit">${t("Create device")}</button>
      </form>

      <section class="panel">
        <div class="panel-toolbar"><h2>Device dashboard</h2><button class="btn btn-small" data-action="refresh">${icon("refresh")} Refresh</button></div>
        ${renderDeviceTable(devices, false)}
      </section>
    </div>

    <div class="two-col equal">
      <section class="panel"><h2>Video của khách</h2><div class="media-grid">${videos.map(v => renderMediaCard(v, "video", true)).join("") || `<div class="empty">${t("No data")}</div>`}</div></section>
      <section class="panel"><h2>Audio của khách</h2><div class="media-grid">${audios.map(a => renderMediaCard(a, "audio", true)).join("") || `<div class="empty">${t("No data")}</div>`}</div></section>
    </div>
  </div>`;
}

function renderAdminDevices() {
  return `<div class="two-col">
    <form class="card form-card" data-form="admin-create-device">
      <h2>${icon("plus")} ${t("Create device")}</h2>
      <label>Device name<input class="input" name="name" required placeholder="HoloBox Sảnh Chính"></label>
      <label>${t("Device code")}<input class="input" name="deviceCode" required placeholder="HOLOBOX_01"></label>
      <label>${t("Customer")}<select name="customerId" required>${state.data.customers.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("")}</select></label>
      <label>Stream URL<input class="input" name="streamUrl" placeholder="http://.../video_feed"></label>
      <input type="hidden" name="runtimeMode" value="ASSISTANT"><p class="subtitle">Customer sẽ tự chuyển giữa Just Ads Mode và Assistant Mode ở màn hình của khách.</p>
      <button class="action-btn primary" type="submit">${t("Create device")}</button>
    </form>
    <section class="panel"><div class="panel-toolbar"><h2>${t("Devices")}</h2><button class="mini-btn" data-action="refresh">${icon("refresh")} Refresh</button></div>${renderDeviceTable(state.data.devices, true)}</section>
  </div>`;
}
function renderDeviceTable(devices, admin = false) {
  return `<div class="device-card-list">
    ${devices.map(d => `<div class="device-card-item">
      <div class="device-card-head">
        <div>
          <b>${escapeHtml(d.name || "HoloBox")}</b>
          <div class="sub">${escapeHtml(d.deviceCode || "—")}${admin ? ` · ${escapeHtml(customerName(d.customerId))}` : ""}</div>
        </div>
        <div class="device-card-actions">
          <button class="btn btn-small btn-soft" data-action="edit-device" data-id="${d.id}">${t("Edit")}</button>
          <button class="btn btn-small btn-danger device-delete-btn" data-action="delete-device" data-id="${d.id}">${t("Delete")}</button>
        </div>
      </div>
      <div class="device-card-meta">
        <div><span>Status</span>${statusBadge(computedDeviceStatus(d))}</div>
        <div><span>Mode</span><b>${escapeHtml(d.runtimeMode || "ASSISTANT")}</b></div>
        <div><span>Last seen</span><b>${lastSeenLabel(d.lastSeenAt || d.lastSeen)}</b></div>
        <div><span>Screen / Stream</span><b>${escapeHtml(d.currentScreen || d.currentAd || d.streamUrl || "—")}</b></div>
      </div>
    </div>`).join("") || `<div class="empty">${t("No data")}</div>`}
  </div>`;
}

function renderAdminMedia() {
  const tab = state.mediaTab || "video";
  return `<section class="panel">
    <div class="tab-row">
      <button class="tab-btn ${tab === "video" ? "active" : ""}" data-action="media-tab" data-tab="video">Video</button>
      <button class="tab-btn ${tab === "audio" ? "active" : ""}" data-action="media-tab" data-tab="audio">Audio</button>
      <button class="tab-btn ${tab === "playlists" ? "active" : ""}" data-action="media-tab" data-tab="playlists">Playlists</button>
    </div>
    ${tab === "audio" ? renderAdminAudioTable() : tab === "playlists" ? renderPlaylistOverview() : renderAdminVideoTable()}
  </section>`;
}
function renderAdminVideoTable() {
  return `<div class="media-grid">${state.data.videos.map(v => renderMediaCard(v, "video", true)).join("") || `<div class="empty">${t("No data")}</div>`}</div>`;
}
function renderAdminAudioTable() {
  return `<div class="media-grid">${state.data.audio.map(a => renderMediaCard(a, "audio", true)).join("") || `<div class="empty">${t("No data")}</div>`}</div>`;
}
function renderPlaylistOverview() {
  return `<div class="two-col">
    <div class="card"><h2>Video playlists</h2>${state.data.videoPlaylists.map(p => `<div class="simple-row"><b>${escapeHtml(p.name)}</b><span>${(p.items || []).length} items</span></div>`).join("") || `<div class="empty">${t("No data")}</div>`}</div>
    <div class="card"><h2>Audio playlists</h2>${state.data.audioPlaylists.map(p => `<div class="simple-row"><b>${escapeHtml(p.name)}</b><span>${(p.items || []).length} items</span></div>`).join("") || `<div class="empty">${t("No data")}</div>`}</div>
  </div>`;
}
function renderAdminAssistant() {
  return `<div class="two-col">
    <form class="card form-card" data-form="admin-create-assistant-template">
      <h2>${icon("plus")} ${t("Create assistant template")}</h2>
      <label>${t("Customer")}<select name="customerId" required>${state.data.customers.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("")}</select></label>
      <label>${t("Title")}<input class="input" name="title" required placeholder="Chào khách"></label>
      <label>Intent<select name="intent">
        <option value="greeting">Chào khách</option>
        <option value="company_info">Giới thiệu công ty</option>
        <option value="product_info">Giới thiệu sản phẩm</option>
        <option value="price">Báo giá</option>
        <option value="direction">Chỉ đường</option>
        <option value="fallback">Không hiểu câu hỏi</option>
        <option value="goodbye">Tạm biệt</option>
      </select></label>
      <label>${t("Content")}<textarea name="text" required rows="7" placeholder="Nhập nội dung lễ tân sẽ trả lời..."></textarea></label>
      <label>Audio<select name="audioId"><option value="">Chưa gắn audio</option>${state.data.audio.map(a => `<option value="${a.id}">${escapeHtml(customerName(a.customerId))} · ${escapeHtml(a.name)}</option>`).join("")}</select></label>
      <button class="btn btn-primary wide" type="submit">${t("Save")}</button>
    </form>

    <section class="panel">
      <div class="panel-toolbar"><h2>${t("Assistant")}</h2><span class="sub">${state.data.assistantScripts.length} templates</span></div>
      <div class="intent-grid">${getAssistantScriptsForAdmin().map(renderIntentCard).join("") || `<div class="empty">Chưa có template. Hãy tạo thủ công tiêu đề và nội dung.</div>`}</div>
    </section>
  </div>`;
}

function getAssistantScriptsForAdmin() {
  return state.data.assistantScripts || [];
}
function renderIntentCard(s) {
  return `<div class="card intent-card">
    <div class="intent-title">${escapeHtml(s.title || s.intent || "Intent")}</div>
    <p>${escapeHtml(s.text || "—")}</p>
    <div class="sub">Customer: ${escapeHtml(customerName(s.customerId))}</div>
    <div class="sub">Audio: ${escapeHtml(mediaName(s.audioId, "audio") || "—")}</div>
    <div class="actions"><button class="btn btn-small btn-danger" data-action="delete-assistant-template" data-id="${s.id}">${t("Delete")}</button></div>
  </div>`;
}
function renderAdminLogs() {
  return `<section class="panel"><div class="panel-toolbar"><h2>${t("Logs")}</h2><button class="mini-btn" data-action="refresh">${icon("refresh")} Refresh</button></div>${renderLogList(state.data.logs)}</section>`;
}
function renderLogList(logs) {
  return `<div class="log-list">${(logs || []).map(l => `<div class="log-row"><div><b>${escapeHtml(l.event || "Log")}</b><div class="sub">${escapeHtml(l.time || "")} · ${escapeHtml(l.device || "")}</div></div>${statusBadge(l.status || "INFO")}<div class="sub">${escapeHtml(l.detail || "")}</div></div>`).join("") || `<div class="empty">${t("No data")}</div>`}</div>`;
}
function renderAdminMaintenance() {
  return `<div class="grid cards">${state.data.devices.map(d => `<div class="card">
    <h2>${escapeHtml(d.name)}</h2>
    <div class="sub">${escapeHtml(d.deviceCode)}</div>
    <div class="detail-badges">${statusBadge(computedDeviceStatus(d))}${statusBadge(d.cameraStatus || "UNKNOWN")}${statusBadge(d.motorStatus || "UNKNOWN")}</div>
    <p>Stream: ${escapeHtml(d.streamUrl || "No URL")}</p>
    <div class="actions"><button class="mini-btn" data-action="probe-stream" data-url="${escapeHtml(d.streamUrl || "")}">Check stream</button><button class="mini-btn" data-action="refresh">${icon("refresh")} Refresh</button></div>
  </div>`).join("") || `<div class="empty">${t("No data")}</div>`}</div>`;
}
function renderAdminSettings() {
  const s = state.data.settings || {};
  return `<form class="panel form-grid" data-form="admin-settings">
    <h2>${t("Settings")}</h2>
    <label>Maintenance phone<input class="input" name="maintenancePhone" value="${escapeHtml(s.maintenancePhone || "")}"></label>
    <label>Maintenance email<input class="input" name="maintenanceEmail" value="${escapeHtml(s.maintenanceEmail || "")}"></label>
    <label>Default language<select name="defaultLanguage"><option value="vi" ${s.defaultLanguage === "vi" ? "selected" : ""}>Tiếng Việt</option><option value="en" ${s.defaultLanguage === "en" ? "selected" : ""}>English</option></select></label>
    <label>Offline timeout seconds<input class="input" name="offlineTimeout" value="${escapeHtml(s.offlineTimeout || "30")}"></label>
    <button class="action-btn primary" type="submit">${t("Save")}</button>
  </form>`;
}

function renderCustomerShell() {
  const device = primaryDevice();
  const statusText = `${computedDeviceStatus(device)} · ${device?.runtimeMode === "JUST_ADS" ? t("Just Ads Mode") : t("Assistant Mode")}`;
  return `<div class="app-shell phase-shell customer-shell">
    ${renderSidebar(customerNav, "Customer App")}
    <main class="main">
      ${renderTopbar(device?.name || customerName(), statusText)}
      <section class="content">${renderCustomerView()}</section>
    </main>
  </div>`;
}
function renderCustomerView() {
  if (state.view === "customerVideo") return renderCustomerVideo();
  if (state.view === "customerAudio") return renderCustomerAudio();
  return renderCustomerHome();
}
function renderCustomerHome() {
  const device = primaryDevice();
  const videos = customerVideos();
  const audios = customerAudios();
  return `<div class="customer-home-grid">
    <section class="holobox-screen-panel">
      ${renderHoloboxScreenPreview(device)}
    </section>
    <aside class="customer-list-panel">
      <div class="mini-list-block"><div class="panel-toolbar"><h2>${t("Video list")}</h2><button class="mini-btn" data-action="nav" data-view="customerVideo">${t("Video")}</button></div>${renderMiniMediaList(videos, "video")}</div>
      <div class="mini-list-block"><div class="panel-toolbar"><h2>${t("Receptionist audio")}</h2><button class="mini-btn" data-action="nav" data-view="customerAudio">${t("Audio")}</button></div>${renderMiniMediaList(audios, "audio")}</div>
    </aside>
  </div>`;
}
function adsPlaylistItems() {
  const cid = currentCustomerId();
  const playlists = customerPlaylists(cid);
  const selected = playlists.find(p => p.autoGenerated) || playlists[0];
  const items = (selected?.items || [])
    .map(i => customerVideos(cid).find(v => v.id === i.mediaId))
    .filter(Boolean);
  return items.length ? items : customerVideos(cid);
}
function renderAdsPlayer() {
  const items = adsPlaylistItems();
  if (!items.length) {
    return `<div class="ads-empty">${t("No data")} · Hãy upload video và tạo playlist trước.</div>`;
  }
  const first = items[0];
  const ids = items.map(v => v.id).join(",");
  return `<video class="holobox-ads-player" data-ads-player data-ids="${escapeHtml(ids)}" data-index="0" src="/api/media/file/video/${encodeURIComponent(first.id)}" autoplay playsinline></video>`;
}
function renderCustomerDeviceModeControls(activeDevice) {
  const devices = customerDevices();
  if (!devices.length) return `<div class="empty">Customer chưa được gán HoloBox.</div>`;
  return `<div class="device-mode-list">
    ${devices.map(d => {
      const ads = d.runtimeMode === "JUST_ADS";
      return `<div class="device-mode-row ${activeDevice?.id === d.id ? "active" : ""}">
        <div><b>${escapeHtml(d.name || d.deviceCode)}</b><div class="sub">${escapeHtml(d.deviceCode || "")} · ${ads ? t("Just Ads Mode") : t("Assistant Mode")}</div></div>
        <button class="btn ${ads ? "" : "btn-primary"}" data-action="toggle-customer-device-mode" data-id="${d.id}">
          ${ads ? "Chuyển sang Assistant Mode" : "Chuyển sang Just Ads Mode"}
        </button>
      </div>`;
    }).join("")}
  </div>`;
}
function renderLiveStreamOutput(device) {
  const url = device?.streamUrl || device?.liveUrl || "";
  if (!url) {
    return `<div class="preview-main assistant-output">${escapeHtml(device?.currentScreen || "Assistant / Stream")}</div>`;
  }
  return `<div class="stream-output-wrap">
    <img class="holobox-stream-output" src="${escapeHtml(url)}" alt="HoloBox stream" loading="eager">
  </div>`;
}

function renderHoloboxScreenPreview(device) {
  const isAds = device?.runtimeMode === "JUST_ADS";
  const isOff = !device || device.powerCommand === "STOP";
  const modeLabel = isAds ? t("Just Ads Mode") : t("Assistant Mode");
  const powerTitle = isOff ? "Bật HoloBox" : "Tắt HoloBox";
  return `<div class="holobox-preview-card ${isAds && !isOff ? "ads-output-card" : ""}">
    <div class="screen-output-area">
      <div class="preview-screen ${isOff ? "off-mode" : isAds ? "ads-mode" : "assistant-mode"}">
        ${isOff
          ? `<div class="preview-main turned-off-text">HoloBox turned off</div>`
          : isAds
            ? renderAdsPlayer()
            : renderLiveStreamOutput(device)}
      </div>
    </div>

    <div class="screen-control-area">
      <div class="preview-meta compact-meta">
        <div>${t("Status")}: ${isOff ? statusBadge("Offline") : statusBadge(computedDeviceStatus(device))}</div>
        <div>${t("Mode")}: ${escapeHtml(modeLabel)}</div>
        <div>${t("Last seen")}: ${lastSeenLabel(device?.lastSeenAt || device?.lastSeen)}</div>
      </div>
      <div class="mode-toggle-panel">
        <h3>Chuyển chế độ HoloBox</h3>
        ${renderCustomerDeviceModeControls(device)}
      </div>
    </div>
  </div>`;
}

function renderMiniMediaList(list, kind) {
  return `<div class="mini-media-list">${list.slice(0, 8).map(item => `<div class="mini-media-row"><div><b>${escapeHtml(item.name)}</b><div class="sub">${escapeHtml(item.duration || "00:00")} · ${escapeHtml(kind === "audio" ? item.role || "audio" : item.status || "Active")}</div></div>${kind === "audio" ? icon("audio") : icon("video")}</div>`).join("") || `<div class="empty">${t("No data")}</div>`}</div>`;
}
function renderCustomerVideo() {
  const videos = customerVideos();
  return `<div class="customer-two-col">
    <section class="card upload-card v3-upload">
      <h2>${icon("upload")} ${t("Add video")}</h2>
      <p class="subtitle">Thêm video quảng cáo. File sẽ lưu vào bucket của customer hiện tại.</p>
      <label class="drop-zone v3-drop">
        <input class="hidden-file" type="file" accept="video/*" data-upload-kind="video" multiple>
        <div class="drop-icon">${icon("upload")}</div>
        <strong>Chọn hoặc kéo video vào đây</strong>
        <span>MP4, WebM, MOV · tối đa theo cấu hình bucket</span>
        <span class="btn btn-primary">Chọn file video</span>
      </label>
      <label class="check-row"><input type="checkbox" data-auto-playlist checked> Tự thêm vào playlist quảng cáo</label>
      <button class="btn wide" data-action="auto-playlist">${t("Auto playlist")}</button>
    </section>
    <section class="panel">
      <div class="panel-toolbar"><h2>${t("Video")}</h2><span class="sub">${videos.length} files</span></div>
      <div class="media-grid">${videos.map(v => renderMediaCard(v, "video")).join("") || `<div class="empty">${t("No data")}</div>`}</div>
    </section>
  </div>`;
}

function renderCustomerAudio() {
  const audios = customerAudios();
  return `<div class="customer-two-col">
    <section class="card upload-card v3-upload">
      <h2>${icon("upload")} ${t("Add audio")}</h2>
      <p class="subtitle">Audio dùng cho lễ tân ảo tương tác với khách.</p>
      <label>Vai trò audio<select data-audio-role><option value="greeting">Chào khách</option><option value="company_info">Giới thiệu công ty</option><option value="product_info">Giới thiệu sản phẩm</option><option value="price">Báo giá</option><option value="direction">Chỉ đường</option><option value="fallback">Không hiểu câu hỏi</option><option value="goodbye">Tạm biệt</option></select></label>
      <label class="drop-zone v3-drop">
        <input class="hidden-file" type="file" accept="audio/*" data-upload-kind="audio" multiple>
        <div class="drop-icon">${icon("audio")}</div>
        <strong>Chọn hoặc kéo audio vào đây</strong>
        <span>MP3, WAV, OGG</span>
        <span class="btn btn-primary">Chọn file audio</span>
      </label>
    </section>
    <section class="panel">
      <div class="panel-toolbar"><h2>${t("Receptionist audio")}</h2><span class="sub">${audios.length} files</span></div>
      <div class="media-grid">${audios.map(a => renderMediaCard(a, "audio")).join("") || `<div class="empty">${t("No data")}</div>`}</div>
    </section>
  </div>`;
}

function renderMediaCard(item, kind, admin = false) {
  const customer = admin ? `<div class="sub">${escapeHtml(customerName(item.customerId))}</div>` : "";
  return `<div class="media-card">
    <div class="media-thumb">${kind === "audio" ? icon("audio") : icon("video")}</div>
    <div class="media-info">
      <b>${escapeHtml(item.name)}</b>
      ${customer}
      <div class="sub">${escapeHtml(item.duration || "00:00")} · ${escapeHtml(item.size || "")}</div>
      ${kind === "audio" ? `<div class="sub">Role: ${escapeHtml(item.role || "audio")}</div>` : ""}
    </div>
    <div class="actions">
      <button class="mini-btn" data-action="preview-media" data-kind="${kind}" data-id="${item.id}">${t("Preview")}</button>
      <button class="mini-btn danger" data-action="delete-media" data-kind="${kind}" data-id="${item.id}">${t("Delete")}</button>
    </div>
  </div>`;
}

function matchesSearch(text) {
  return normalizeName(text).includes(normalizeName(state.search));
}

async function measureDuration(file) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const el = document.createElement(file.type.startsWith("audio/") ? "audio" : "video");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({ durationSeconds: Number(el.duration || 0), duration: formatTime(el.duration || 0) });
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ durationSeconds: 0, duration: "00:00" });
    };
    el.src = url;
  });
}
async function uploadFile(file, kind) {
  const meta = await measureDuration(file);
  const cid = currentCustomerId();
  const role = document.querySelector("[data-audio-role]")?.value || "greeting";
  const params = new URLSearchParams({
    kind,
    name: file.name,
    mime: file.type || "application/octet-stream",
    size: String(file.size || 0),
    duration: meta.duration,
    durationSeconds: String(Math.round(meta.durationSeconds || 0)),
    customerId: cid
  });
  if (kind === "audio") params.set("role", role);
  const res = await fetch(`/api/media/upload?${params.toString()}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload.ok === false) throw new Error(payload.error || "Upload failed");
  state.data = mergeData(payload.data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}
async function uploadFiles(files, kind) {
  if (!files || !files.length) return;
  showLoading("Uploading media...", `${files.length} file(s)`);
  try {
    for (const file of files) await uploadFile(file, kind);
    toast("success", "Upload complete", `${files.length} file(s) uploaded.`);
    render();
  } catch (err) {
    toast("error", "Upload failed", err.message);
  } finally {
    hideLoading();
  }
}

const actionHandlers = {
  "nav": async target => {
    state.view = target.dataset.view || (state.portal === "admin" ? "dashboard" : "customerHome");
    state.search = "";
    state.selectedCustomerId = "";
    render();
  },
  "change-language": async target => {
    state.language = target.dataset.lang || "vi";
    localStorage.setItem("holobox_lang", state.language);
    render();
  },
  "contact": async () => {
    const s = state.data.settings || {};
    modal(t("Maintenance Contact"), `<div class="contact-card">
      <div class="contact-row">${icon("phone")} <b>${t("Phone")}:</b> ${escapeHtml(s.maintenancePhone || "090x xxx xxx")}</div>
      <div class="contact-row">${icon("mail")} <b>${t("Email")}:</b> ${escapeHtml(s.maintenanceEmail || "support@tlc.vn")}</div>
      <div class="contact-row">${icon("monitor")} <b>Device:</b> ${escapeHtml(primaryDevice()?.deviceCode || "—")}</div>
    </div>`, `<button class="action-btn primary" data-action="close-modal">${t("Close")}</button>`);
  },
  "close-modal": async () => closeModal(),
  "toggle-login-password": async target => {
    const wrap = target.closest(".password-field");
    const input = wrap?.querySelector("[data-login-password]");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    target.classList.toggle("is-visible", show);
    target.setAttribute("aria-label", show ? "Hide password" : "Show password");
    target.setAttribute("title", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    target.innerHTML = show ? `${icon("eyeOff")}` : `${icon("eye")}`;
    input.focus();
  },
  "logout": async () => {
    await apiJson("/api/auth/logout", { method: "POST", body: "{}" });
    state.user = null;
    state.portal = "login";
    state.view = "login";
    render();
  },
  "back-admin": async () => {
    state.portal = "admin";
    state.view = "dashboard";
    state.viewingCustomerId = "";
    await refreshData();
  },
  "open-customer": async target => {
    state.selectedCustomerId = target.dataset.id || "";
    render();
  },
  "customer-back-list": async () => {
    state.selectedCustomerId = "";
    render();
  },
  "copy": async target => {
    const value = target.dataset.copy || "";
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast("success", "Copied", value);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = value;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      toast("success", "Copied", value);
    }
  },
  "customer-login-info": async target => {
    const customerId = target.dataset.id || "";
    const customer = state.data.customers.find(c => c.id === customerId);
    const user = state.data.users.find(u => String(u.customerId || "") === String(customerId) && normalizeName(u.role) === "customer");
    if (!customer) return;
    modal("Customer login info", `<div class="contact-card locked-login-info">
      <label>Customer<input class="input" value="${escapeHtml(customer.name)}" disabled></label>
      <label>Username<input class="input" value="${escapeHtml(user?.username || "—")}" disabled></label>
      <label>Password<input class="input" value="••••••••" disabled></label>
      <p class="subtitle">Thông tin đang khóa để tránh lộ mật khẩu. Bấm Edit để đổi username hoặc reset mật khẩu tạm.</p>
    </div>`, `<button class="btn" data-action="customer-login-edit" data-id="${customerId}">${icon("edit")} Edit</button><button class="btn btn-primary" data-action="close-modal">${t("Close")}</button>`);
  },
  "customer-login-edit": async target => {
    const customerId = target.dataset.id || "";
    const customer = state.data.customers.find(c => c.id === customerId);
    const user = state.data.users.find(u => String(u.customerId || "") === String(customerId) && normalizeName(u.role) === "customer");
    if (!customer) return;
    modal("Edit customer login", `<form class="form-card modal-form" data-form="admin-edit-customer-login">
      <input type="hidden" name="customerId" value="${escapeHtml(customerId)}">
      <label>Customer<input class="input" value="${escapeHtml(customer.name)}" disabled></label>
      <label>Username<input class="input" name="username" required value="${escapeHtml(user?.username || "")}"></label>
      <label>New temporary password<input class="input" name="password" type="text" placeholder="Để trống nếu không đổi"></label>
      <p class="subtitle">Sau khi lưu, gửi username và mật khẩu tạm mới cho khách nếu bạn có đổi mật khẩu.</p>
      <button class="btn btn-primary wide" type="submit">${t("Save")}</button>
    </form>`, `<button class="btn" data-action="close-modal">${t("Close")}</button>`);
  },
  "delete-customer": async target => {
    const id = target.dataset.id || "";
    const customer = state.data.customers.find(c => c.id === id);
    const ok = await confirmModal("Delete customer", `Xóa khách hàng "${customer?.name || id}"? Việc này sẽ xóa account customer, device, media records, playlist và assistant template của khách này.`);
    if (!ok) return;
    const payload = await apiJson(`/api/admin/customers/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.data = mergeData(payload.data);
    state.selectedCustomerId = "";
    toast("success", "Customer deleted");
    render();
  },
  "toggle-customer-device-mode": async target => {
    const id = target.dataset.id || "";
    const device = state.data.devices.find(d => d.id === id);
    if (!device) return toast("error", "Device not found");
    const next = device.runtimeMode === "JUST_ADS" ? "ASSISTANT" : "JUST_ADS";
    device.runtimeMode = next;
    device.powerCommand = "START";
    device.currentScreen = next === "JUST_ADS" ? "Ads Playlist" : "Assistant";
    device.requestedAt = new Date().toISOString();
    await saveData();
    toast("success", "Mode changed", next === "JUST_ADS" ? "Just Ads Mode" : "Assistant Mode");
    render();
    if (next === "JUST_ADS") setTimeout(playAdsWithSound, 60);
  },
  "delete-assistant-template": async target => {
    const id = target.dataset.id || "";
    const ok = await confirmModal("Delete assistant template", "Bạn có chắc muốn xóa template lễ tân này không?");
    if (!ok) return;
    state.data.assistantScripts = state.data.assistantScripts.filter(s => s.id !== id);
    await saveData();
    toast("success", "Assistant template deleted");
    render();
  },
  "view-as-customer": async target => {
    state.viewingCustomerId = target.dataset.id;
    state.portal = "customer";
    state.view = "customerHome";
    render();
  },
  "refresh": async () => {
    showLoading("Refreshing...", "Loading latest state");
    try { await refreshData(); toast("success", "Refreshed"); } catch (err) { toast("error", "Refresh failed", err.message); } finally { hideLoading(); }
  },
  "media-tab": async target => {
    state.mediaTab = target.dataset.tab || "video";
    render();
  },
  "auto-playlist": async () => {
    const cid = currentCustomerId();
    const videos = customerVideos(cid);
    let playlist = state.data.videoPlaylists.find(p => p.customerId === cid && p.autoGenerated);
    if (!playlist) {
      playlist = { id: `vp_${uid()}`, customerId: cid, name: "Auto Ads Playlist", autoGenerated: true, loop: true, items: [] };
      state.data.videoPlaylists.unshift(playlist);
    }
    playlist.items = videos.map((v, index) => ({ mediaId: v.id, order: index + 1 }));
    await saveData();
    toast("success", "Auto playlist", `${videos.length} video(s) added.`);
    render();
  },
  "toggle-customer-device-power": async target => {
    const d = state.data.devices.find(x => x.id === target.dataset.id) || primaryDevice();
    if (!d) return toast("error", "No HoloBox", "Device has not been assigned yet.");
    const isOff = d.powerCommand === "STOP";
    d.powerCommand = isOff ? "START" : "STOP";
    d.currentScreen = isOff
      ? (d.runtimeMode === "JUST_ADS" ? "Ads Playlist" : "Assistant")
      : "HoloBox turned off";
    d.requestedAt = new Date().toISOString();
    await saveData();
    toast("success", "HoloBox", isOff ? "Turned on" : "Turned off");
    render();
    if (isOff && d.runtimeMode === "JUST_ADS") setTimeout(playAdsWithSound, 60);
  },
  "customer-start-device": async target => actionHandlers["toggle-customer-device-power"](target),
  "customer-stop-device": async target => actionHandlers["toggle-customer-device-power"](target),
  "edit-device": async target => {
    const id = target.dataset.id || "";
    const d = state.data.devices.find(x => x.id === id);
    if (!d) return toast("error", "Device not found");
    modal(t("Edit HoloBox"), `<form class="form-card modal-form" data-form="admin-edit-device">
      <input type="hidden" name="id" value="${escapeHtml(d.id)}">
      <label>${t("Device name")}<input class="input" name="name" required value="${escapeHtml(d.name || "")}"></label>
      <label>${t("Device code")}<input class="input" name="deviceCode" required value="${escapeHtml(d.deviceCode || "")}"></label>
      <label>${t("Customer")}<select name="customerId" required>${state.data.customers.map(c => `<option value="${c.id}" ${c.id === d.customerId ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}</select></label>
      <label>${t("Stream URL")}<input class="input" name="streamUrl" value="${escapeHtml(d.streamUrl || "")}" placeholder="http://.../video_feed"></label>
      <label>${t("Mode")}<select name="runtimeMode"><option value="ASSISTANT" ${d.runtimeMode !== "JUST_ADS" ? "selected" : ""}>Assistant Mode</option><option value="JUST_ADS" ${d.runtimeMode === "JUST_ADS" ? "selected" : ""}>Just Ads Mode</option></select></label>
      <button class="btn btn-primary wide" type="submit">${t("Update device")}</button>
    </form>`, `<button class="btn" data-action="close-modal">${t("Close")}</button>`);
  },
  "delete-device": async target => {
    const id = target.dataset.id || "";
    const device = state.data.devices.find(d => d.id === id);
    const ok = await confirmModal("Delete HoloBox", `Xóa device "${device?.name || device?.deviceCode || id}" khỏi khách hàng này?`);
    if (!ok) return;
    const payload = await apiJson(`/api/admin/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.data = mergeData(payload.data);
    toast("success", "Device deleted");
    render();
  },
  "preview-media": async target => {
    const kind = target.dataset.kind;
    const id = target.dataset.id;
    const item = (kind === "audio" ? state.data.audio : state.data.videos).find(x => x.id === id);
    if (!item) return;
    const url = `/api/media/file/${kind}/${encodeURIComponent(id)}`;
    const player = kind === "audio"
      ? `<audio controls src="${url}" style="width:100%"></audio>`
      : `<video controls src="${url}" style="width:100%;border-radius:18px;max-height:60vh"></video>`;
    modal(item.name, player, `<button class="action-btn" data-action="close-modal">${t("Close")}</button>`);
  },
  "delete-media": async target => {
    const kind = target.dataset.kind;
    const id = target.dataset.id;
    const ok = await confirmModal("Delete media", "Bạn có chắc muốn xóa file này không?");
    if (!ok) return;
    const payload = await apiJson(`/api/media/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.data = mergeData(payload.data);
    toast("success", "Deleted");
    render();
  },
  "probe-stream": async target => {
    const url = target.dataset.url;
    if (!url) return toast("error", "No stream URL");
    const payload = await apiJson(`/api/stream/probe?url=${encodeURIComponent(url)}`);
    toast(payload.reachable ? "success" : "error", payload.reachable ? "Stream reachable" : "Stream failed", payload.reason || "");
  },
  "seed-assistant": async () => {},
};

async function handleAction(action, target) {
  const handler = actionHandlers[action];
  if (!handler) return;
  try {
    await handler(target);
  } catch (err) {
    toast("error", "Action failed", err.message || String(err));
  }
}

document.addEventListener("click", e => {
  if (e.target?.dataset?.backdropClose === "true") {
    closeModal();
    return;
  }
  const target = e.target.closest("[data-action]");
  if (!target) return;
  e.preventDefault();
  handleAction(target.dataset.action, target);
});
function playAdsWithSound() {
  document.querySelectorAll("[data-ads-player]").forEach(player => {
    try {
      player.muted = false;
      player.volume = 1;
      const p = player.play();
      if (p?.catch) p.catch(() => {});
    } catch {}
  });
}

document.addEventListener("ended", e => {
  const player = e.target.closest?.("[data-ads-player]");
  if (!player) return;
  const ids = String(player.dataset.ids || "").split(",").filter(Boolean);
  if (ids.length <= 1) {
    player.currentTime = 0;
    player.muted = false;
    player.volume = 1;
    player.play().catch(() => {});
    return;
  }
  const nextIndex = (Number(player.dataset.index || 0) + 1) % ids.length;
  player.dataset.index = String(nextIndex);
  player.src = `/api/media/file/video/${encodeURIComponent(ids[nextIndex])}`;
  player.muted = false;
  player.volume = 1;
  player.play().catch(() => {});
}, true);


document.addEventListener("input", e => {
  const target = e.target.closest("[data-action='search']");
  if (!target) return;
  state.search = target.value || "";
  render();
});

document.addEventListener("change", e => {
  const input = e.target.closest("[data-upload-kind]");
  if (!input) return;
  uploadFiles(Array.from(input.files || []), input.dataset.uploadKind);
});

document.addEventListener("submit", async e => {
  const form = e.target.closest("[data-form]");
  if (!form) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    if (form.dataset.form === "login") {
      showLoading("Logging in...", "Checking account");
      const payload = await apiJson("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
      state.user = payload.user;
      state.portal = payload.user.role === "admin" ? "admin" : "customer";
      state.view = payload.user.role === "admin" ? "dashboard" : "customerHome";
      state.language = payload.user.language || state.language;
      state.data = await loadData();
      toast("success", "Login success", payload.user.name || payload.user.username);
      render();
    }
    if (form.dataset.form === "admin-create-customer") {
      const payload = await apiJson("/api/admin/customers", { method: "POST", body: JSON.stringify(data) });
      state.data = mergeData(payload.data);
      toast("success", "Customer created", data.name);
      modal("Customer login created", `<div class="contact-card">
        <div class="contact-row"><b>Username:</b> ${escapeHtml(data.username)} <button class="btn btn-small" data-action="copy" data-copy="${escapeHtml(data.username)}">Copy</button></div>
        <div class="contact-row"><b>Password:</b> ${escapeHtml(data.password)} <button class="btn btn-small" data-action="copy" data-copy="${escapeHtml(data.password)}">Copy</button></div>
        <p class="subtitle">Gửi thông tin này cho khách. Sau khi customer được tạo, tài khoản mới đăng nhập được.</p>
      </div>`, `<button class="btn btn-primary" data-action="close-modal">${t("Close")}</button>`);
      render();
    }
    if (form.dataset.form === "admin-edit-customer-login") {
      const customerId = data.customerId;
      const payload = await apiJson(`/api/admin/customers/${encodeURIComponent(customerId)}/login`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      state.data = mergeData(payload.data);
      toast("success", "Customer login updated", data.username);
      closeModal();
      render();
    }
    if (form.dataset.form === "admin-create-device") {
      const payload = await apiJson("/api/admin/devices", { method: "POST", body: JSON.stringify(data) });
      state.data = mergeData(payload.data);
      toast("success", "Device created", data.deviceCode);
      render();
    }
    if (form.dataset.form === "admin-edit-device") {
      const id = data.id;
      const payload = await apiJson(`/api/admin/devices/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      state.data = mergeData(payload.data);
      toast("success", "Device updated", data.deviceCode);
      closeModal();
      render();
    }
    if (form.dataset.form === "admin-create-assistant-template") {
      state.data.assistantScripts.unshift({
        id: `as_${uid()}`,
        customerId: data.customerId,
        intent: data.intent || "manual",
        title: data.title,
        text: data.text,
        audioId: data.audioId || "",
        enabled: true,
        language: state.language || "vi",
        createdAt: Date.now()
      });
      await saveData();
      toast("success", "Assistant template saved", data.title);
      form.reset();
      render();
    }
    if (form.dataset.form === "admin-settings") {
      state.data.settings = { ...state.data.settings, ...data };
      await saveData();
      toast("success", "Settings saved");
      render();
    }
  } catch (err) {
    toast("error", "Submit failed", err.message);
  } finally {
    hideLoading();
  }
});

async function initApp() {
  console.info("HoloBox Manager", APP_VERSION, APP_FEATURES);
  render();
  try {
    const me = await apiMe();
    state.user = me.user;
    if (!state.user) {
      try {
        const publicConfig = await apiJson("/api/public/config");
        state.data.settings = { ...state.data.settings, ...(publicConfig.settings || {}) };
      } catch {}
      state.ready = true;
      state.portal = "login";
      state.view = "login";
      render();
      return;
    }
    state.portal = state.user.role === "admin" ? "admin" : "customer";
    state.view = state.user.role === "admin" ? "dashboard" : "customerHome";
    state.language = state.user.language || state.language;
    state.data = await loadData();
  } catch (err) {
    console.error(err);
    try {
      state.data = mergeData(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch {}
  } finally {
    state.ready = true;
    render();
  }
}

initApp();
