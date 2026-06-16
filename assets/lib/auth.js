let isLoggedIn = false;
let supabaseMod = null;

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

export function isLoggedInUser() {
  return isLoggedIn;
}

export function initAuth(els, onSignIn, onSignOut) {
  if (applyOptimisticAuthUI(els)) onSignIn();

  els.btnSignin.addEventListener("click", () => {
    els.authDropdown.classList.toggle("is-hidden");
  });
  els.btnSigninX.addEventListener("click", () => {
    els.authDropdown.classList.add("is-hidden");
    getSupabase().then((m) => m.signInWithX());
  });
  els.btnSigninDiscord.addEventListener("click", () => {
    els.authDropdown.classList.add("is-hidden");
    getSupabase().then((m) => m.signInWithDiscord());
  });

  els.btnUserMenu.addEventListener("click", () => {
    els.userDropdown.classList.toggle("is-hidden");
  });
  els.btnSignout.addEventListener("click", async () => {
    els.userDropdown.classList.add("is-hidden");
    const m = await getSupabase();
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

  const initSession = () => {
    getSupabase().then((m) => {
      m.onAuthChange(async (session, event) => {
        updateAuthUI(els, session);
        if (session) onSignIn();
        else if (event === "SIGNED_OUT") onSignOut();
      });

      m.getSession().then((s) => updateAuthUI(els, s));
    });
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(initSession, { timeout: 3000 });
  } else {
    setTimeout(initSession, 200);
  }
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