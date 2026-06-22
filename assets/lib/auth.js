let isLoggedIn = false;
let supabaseMod = null;
let authCallbacks = null;
let sessionStarted = false;

async function getSupabase() {
  if (!supabaseMod) supabaseMod = await import("../supabase.js");
  return supabaseMod;
}

function isConfigured() {
  const cfg = window.__SUPABASE_CONFIG__ || {};
  return !!(cfg.url && cfg.key);
}

function getSupabaseStorageKey() {
  const url = window.__SUPABASE_CONFIG__?.url;
  if (!url) return null;
  try {
    const host = new URL(url).hostname.split(".")[0];
    return host ? `sb-${host}-auth-token` : null;
  } catch {
    return null;
  }
}

function readCachedSession() {
  const key = getSupabaseStorageKey();
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session) return null;

    let user = session.user;
    if (!user && (session.access_token || session.refresh_token)) {
      const userRaw = localStorage.getItem(`${key}-user`);
      if (userRaw) {
        try {
          user = JSON.parse(userRaw);
        } catch {
          /* ignore malformed user blob */
        }
      }
    }
    if (!user) return null;

    const hasAccess =
      session.access_token &&
      (!session.expires_at || session.expires_at * 1000 > Date.now());
    if (!hasAccess && !session.refresh_token) return null;
    return { ...session, user };
  } catch {
    return null;
  }
}

function sessionDisplayName(session) {
  const id = session?.user?.user_metadata;
  return id?.full_name || id?.name || id?.user_name || session?.user?.email || "User";
}

function applyOptimisticAuthUI(els) {
  if (!isConfigured()) return false;
  const cached = readCachedSession();
  if (!cached) return false;
  isLoggedIn = true;
  els.btnSignin.classList.add("is-hidden");
  els.authDropdown.classList.add("is-hidden");
  els.authUser.classList.remove("is-hidden");
  els.authUsername.textContent = sessionDisplayName(cached);
  return true;
}

function isOAuthReturnInUrl() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return false;
  return (
    hash.includes("access_token=") ||
    hash.includes("refresh_token=") ||
    hash.includes("error=") ||
    hash.includes("error_description=")
  );
}

function clearAuthHashFromUrl() {
  if (!window.location.hash) return;
  const path = window.location.pathname + window.location.search;
  history.replaceState(null, "", path);
}

export function isLoggedInUser() {
  return isLoggedIn;
}

export function initAuth(els, onSignIn, onSignOut) {
  authCallbacks = { onSignIn, onSignOut };
  applyOptimisticAuthUI(els);

  els.btnSignin.addEventListener("click", () => {
    els.authDropdown.classList.toggle("is-hidden");
  });
  els.btnSigninX.addEventListener("click", () => {
    els.authDropdown.classList.add("is-hidden");
    ensureAuthSession(els).then((m) => m.signInWithX());
  });
  els.btnSigninDiscord.addEventListener("click", () => {
    els.authDropdown.classList.add("is-hidden");
    ensureAuthSession(els).then((m) => m.signInWithDiscord());
  });

  els.btnUserMenu.addEventListener("click", () => {
    els.userDropdown.classList.toggle("is-hidden");
  });
  els.btnSignout.addEventListener("click", async () => {
    els.userDropdown.classList.add("is-hidden");
    const m = await ensureAuthSession(els);
    await m.signOut();
    updateAuthUI(els, null);
    onSignOut();
  });

  document.addEventListener("click", (e) => {
    if (!els.authButtons.contains(e.target) && !els.authUser.contains(e.target)) {
      els.authDropdown.classList.add("is-hidden");
      els.userDropdown.classList.add("is-hidden");
    }
  });

  if (isOAuthReturnInUrl()) {
    handleOAuthRedirect(els);
  }
}

function handleOAuthRedirect(els) {
  ensureAuthSession(els)
    .then((m) => m.getSession())
    .then((session) => {
      updateAuthUI(els, session);
      if (session && authCallbacks) authCallbacks.onSignIn();
      clearAuthHashFromUrl();
    })
    .catch(() => {
      clearAuthHashFromUrl();
    });
}

function startAuthSession(els) {
  if (!isConfigured() || sessionStarted || !authCallbacks) return;
  sessionStarted = true;
  const { onSignIn, onSignOut } = authCallbacks;
  getSupabase().then((m) => {
    m.onAuthChange(async (session, event) => {
      updateAuthUI(els, session);
      if (session) onSignIn();
      else if (event === "SIGNED_OUT") onSignOut();
    });
    m.getSession().then((s) => updateAuthUI(els, s));
  });
}

/** Load Supabase client + auth listeners on first user-driven auth/history need. */
export function ensureAuthSession(els) {
  startAuthSession(els);
  return getSupabase();
}

function updateAuthUI(els, session) {
  isLoggedIn = !!session;
  if (session) {
    els.btnSignin.classList.add("is-hidden");
    els.authDropdown.classList.add("is-hidden");
    els.authUser.classList.remove("is-hidden");
    els.authUsername.textContent = sessionDisplayName(session);
  } else {
    els.btnSignin.classList.remove("is-hidden");
    els.authUser.classList.add("is-hidden");
    els.userDropdown.classList.add("is-hidden");
  }
}

export function hideSigninIfUnconfigured(els) {
  if (!isConfigured()) {
    els.btnSignin.classList.add("is-hidden");
  }
}

export function clearAuthUI(els) {
  updateAuthUI(els, null);
}