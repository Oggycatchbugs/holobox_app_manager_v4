const APP_VERSION = "13.1.5-phase2-ads-power-info-fix";
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
    save: "✓", refresh: "↻", search: "⌕", eye: "👁", eyeOff: "◉", info: "i", edit: "✎"
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
        <div class="brand-orb">HB</div>
        <h1>TLC HoloBox Manager</h1>
        <p>Role-based portal for Admin and Customer operation.</p>
        <div class="login-hints">
          <span>${icon("lock")} Admin / Customer</span>
          <span>${icon("monitor")} Device ready</span>
          <span>${icon("media")} Ads + Audio</span>
        </div>
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
      <div class="account-pill">${escapeHtml(state.user?.name || state.user?.username || "User")} · ${escapeHtml(state.user?.role || "")}</div>
    </div>
  </header>`;
}
function renderSidebar(items, brandSub) {
  return `<aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">HB</div>
      <div><div class="brand-title">HoloBox</div><div class="brand-sub">${escapeHtml(brandSub)}</div></div>
    </div>
    <nav class="nav">${items.map(([key, label, ico]) => `<button class="nav-btn ${state.view === key ? "active" : ""}" data-action="nav" data-view="${key}">${icon(ico)}<span>${t(label)}</span></button>`).join("")}</nav>
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
              <button class="btn btn-small" data-action="open-customer" data-id="${c.id}">${icon("plus")} Thêm HoloBox</button>
              ${user ? `<button class="btn btn-small" data-action="customer-login-info" data-id="${c.id}">${icon("info")} Thông tin</button>` : ""}
              <button class="btn btn-small" data-action="view-as-customer" data-id="${c.id}">${t("View as Customer")}</button>
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
        ${user ? `<button class="btn" data-action="customer-login-info" data-id="${c.id}">${icon("info")} Thông tin đăng nhập</button>` : ""}
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
  return `<div class="table">
    <div class="table-head device-admin-grid"><div>Device</div>${admin ? "<div>Customer</div>" : ""}<div>Status</div><div>Mode</div><div>Last seen</div><div>Screen</div></div>
    ${devices.map(d => `<div class="table-row device-admin-grid">
      <div><b>${escapeHtml(d.name || "HoloBox")}</b><div class="sub">${escapeHtml(d.deviceCode || "—")}</div></div>
      ${admin ? `<div>${escapeHtml(customerName(d.customerId))}</div>` : ""}
      <div>${statusBadge(computedDeviceStatus(d))}</div>
      <div>${escapeHtml(d.runtimeMode || "ASSISTANT")}</div>
      <div>${lastSeenLabel(d.lastSeenAt || d.lastSeen)}</div>
      <div class="sub">${escapeHtml(d.currentScreen || d.currentAd || "—")}</div>
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
  return `<video class="holobox-ads-player" data-ads-player data-ids="${escapeHtml(ids)}" data-index="0" src="/api/media/file/video/${encodeURIComponent(first.id)}" autoplay playsinline controls></video>`;
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
function renderHoloboxScreenPreview(device) {
  const isAds = device?.runtimeMode === "JUST_ADS";
  const isOff = !device || device.powerCommand === "STOP";
  const modeLabel = isAds ? t("Just Ads Mode") : t("Assistant Mode");
  const powerLabel = isOff ? "Bật HoloBox" : "Tắt HoloBox";
  return `<div class="holobox-preview-card ${isAds && !isOff ? "ads-output-card" : ""}">
    <div class="preview-screen ${isOff ? "off-mode" : isAds ? "ads-mode" : "assistant-mode"}">
      ${isOff
        ? `<div class="preview-main turned-off-text">HoloBox turned off</div>`
        : isAds
          ? renderAdsPlayer()
          : `<div class="preview-topline">${escapeHtml(modeLabel)}</div><div class="preview-main">${escapeHtml(device?.currentScreen || t("HoloBox Screen"))}</div>
      <div class="preview-sub">${t("Now playing")}: ${escapeHtml(device?.currentAd || mediaName(device?.currentVideoId, "video") || "—")}</div>`}
    </div>
    <div class="preview-meta">
      <div>${t("Status")}: ${isOff ? statusBadge("Offline") : statusBadge(computedDeviceStatus(device))}</div>
      <div>${t("Mode")}: ${escapeHtml(modeLabel)}</div>
      <div>${t("Last seen")}: ${lastSeenLabel(device?.lastSeenAt || device?.lastSeen)}</div>
    </div>
    <div class="preview-actions single-power-action">
      <button class="big-power-btn ${isOff ? "" : "danger-power"}" data-action="toggle-customer-device-power" data-id="${device?.id || ""}">${powerLabel}</button>
    </div>
    <div class="mode-toggle-panel">
      <h3>Chuyển chế độ HoloBox</h3>
      ${renderCustomerDeviceModeControls(device)}
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
