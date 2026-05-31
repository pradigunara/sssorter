import {
  signInWithX,
  signInWithDiscord,
  signOut,
  onAuthChange,
  getSession,
  isConfigured,
} from "../supabase.js";

let isLoggedIn = false;

export function isLoggedInUser() {
  return isLoggedIn;
}

export function initAuth(els, onSignIn, onSignOut) {
  els.btnSignin.addEventListener("click", () => {
    els.authDropdown.classList.toggle("is-hidden");
  });
  els.btnSigninX.addEventListener("click", () => {
    els.authDropdown.classList.add("is-hidden");
    signInWithX();
  });
  els.btnSigninDiscord.addEventListener("click", () => {
    els.authDropdown.classList.add("is-hidden");
    signInWithDiscord();
  });

  els.btnUserMenu.addEventListener("click", () => {
    els.userDropdown.classList.toggle("is-hidden");
  });
  els.btnSignout.addEventListener("click", async () => {
    els.userDropdown.classList.add("is-hidden");
    await signOut();
    updateAuthUI(els, null);
    onSignOut();
  });

  document.addEventListener("click", (e) => {
    if (!els.authButtons.contains(e.target) && !els.authUser.contains(e.target)) {
      els.authDropdown.classList.add("is-hidden");
      els.userDropdown.classList.add("is-hidden");
    }
  });

  onAuthChange(async (session) => {
    updateAuthUI(els, session);
    if (session) onSignIn();
    else onSignOut();
  });

  const session = getSession();
  return session.then((s) => {
    updateAuthUI(els, s);
    return s;
  });
}

function updateAuthUI(els, session) {
  isLoggedIn = !!session;
  if (session) {
    els.btnSignin.classList.add("is-hidden");
    els.authDropdown.classList.add("is-hidden");
    els.authUser.classList.remove("is-hidden");
    const id = session.user?.user_metadata;
    els.authUsername.textContent =
      id?.full_name || id?.name || id?.user_name || session.user?.email || "User";
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
