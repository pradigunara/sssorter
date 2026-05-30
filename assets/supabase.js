const cfg = window.__SUPABASE_CONFIG__ || {};
const supabaseUrl = cfg.url || "";
const supabaseKey = cfg.key || "";

const hasConfig = !!(supabaseUrl && supabaseKey);

export function isConfigured() {
  return hasConfig;
}

let client = null;
let loading = null;

async function getClient() {
  if (!hasConfig) return null;
  if (client) return client;
  if (!loading) {
    loading = import("@supabase/supabase-js").then(
      ({ createClient }) => (client = createClient(supabaseUrl, supabaseKey)),
    );
  }
  return loading;
}

// --- Auth ---

export async function signInWithX() {
  const sb = await getClient();
  if (!sb) return;
  const { error } = await sb.auth.signInWithOAuth({
    provider: "x",
    options: { redirectTo: window.location.origin },
  });
  if (error) console.error("X sign in failed:", error.message);
}

export async function signInWithDiscord() {
  const sb = await getClient();
  if (!sb) return;
  const { error } = await sb.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: window.location.origin },
  });
  if (error) console.error("Discord sign in failed:", error.message);
}

export async function signOut() {
  const sb = await getClient();
  if (!sb) return;

  // Clear cached rankings for current user
  const session = await getSession();
  if (session) {
    cacheDel(`${session.user.id}:rankings`);
    cacheDel(`${session.user.id}:${currentMonth()}`);
  }

  await sb.auth.signOut();
}

export async function onAuthChange(callback) {
  const sb = await getClient();
  if (!sb) return { unsubscribe: () => {} };
  const { data } = sb.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
}

export async function getSession() {
  const sb = await getClient();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

// --- Rankings ---

const CACHE_PREFIX = "ss_";

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cacheSet(key, value) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently skip */
  }
}

function cacheDel(key) {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    /* noop */
  }
}

export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function saveRanking(memberNames, memberData) {
  const sb = await getClient();
  if (!sb) return { error: "Supabase not configured" };

  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const userId = session.user.id;
  const ranking = memberNames.map((name) => memberData[name]?.sNumber ?? name);

  const { data, error } = await sb
    .from("rankings")
    .upsert(
      {
        user_id: userId,
        month: currentMonth(),
        ranking,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,month" },
    );

  // Invalidate caches so next load fetches fresh data
  cacheDel(`${userId}:rankings`);
  cacheDel(`${userId}:${currentMonth()}`);

  // Keep only the most recent 12 months
  const { data: all } = await sb
    .from("rankings")
    .select("month")
    .eq("user_id", userId)
    .order("month", { ascending: false });

  if (all && all.length > 12) {
    const keep = all.slice(0, 12).map((r) => `"${r.month}"`).join(",");
    await sb
      .from("rankings")
      .delete()
      .eq("user_id", userId)
      .not("month", "in", `(${keep})`);
  }

  return { data, error };
}

const sNumberToNameCache = {};

function buildSNumberLookup(memberData) {
  if (Object.keys(sNumberToNameCache).length > 0) return;
  for (const [name, data] of Object.entries(memberData)) {
    sNumberToNameCache[data.sNumber] = name;
  }
}

export async function loadCurrentMonthRanking(memberData) {
  const session = await getSession();
  if (!session) return null;

  const userId = session.user.id;
  const month = currentMonth();
  const cacheKey = `${userId}:${month}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const sb = await getClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("rankings")
    .select("ranking")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();

  if (error || !data) return null;

  buildSNumberLookup(memberData);
  const result = data.ranking.map((sNum) => sNumberToNameCache[sNum] ?? sNum);
  cacheSet(cacheKey, result);
  return result;
}

export async function loadAllRankings() {
  const session = await getSession();
  if (!session) return [];

  const userId = session.user.id;
  const cacheKey = `${userId}:rankings`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const sb = await getClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from("rankings")
    .select("month,ranking")
    .eq("user_id", userId)
    .order("month", { ascending: false });

  if (error || !data) return [];

  cacheSet(cacheKey, data);
  return data;
}

export function convertRankingToNames(ranking, memberData) {
  buildSNumberLookup(memberData);
  return ranking.map((sNum) => sNumberToNameCache[sNum] ?? sNum);
}
