# Supabase Backend Setup

Manual steps to connect the bias sorter to Supabase.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier)
2. Click **New Project**
3. Choose an organization, name your project (e.g. `sssorter`), set a database password
4. Pick a region close to your audience
5. Wait ~2 minutes for the project to provision

## 2. Get API Credentials

1. In your Supabase dashboard, go to **Settings → API Keys** (or use the **Connect** dialog)
2. Copy these two values:
   - **Project URL** — looks like `https://xxxxx.supabase.co`
   - **Publishable key** — starts with `sb_publishable_` (new format) or `eyJ...` (legacy anon key)
     > Supabase now uses `sb_publishable_...` keys instead of the old JWT-based anon keys. Both work, but the new format is recommended. See [Supabase API Keys docs](https://supabase.com/docs/guides/getting-started/api-keys).
3. Create a `.env` file in the project root (or set these in your deployment):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

> If you're using a legacy anon key, you can use `VITE_SUPABASE_ANON_KEY` instead. The app checks for `VITE_SUPABASE_PUBLISHABLE_KEY` first, then falls back to `VITE_SUPABASE_ANON_KEY`.

## 3. Run Database Migration

The project uses Supabase CLI migrations. All SQL is in `supabase/migrations/`.

**Prerequisite**: Install the Supabase CLI if you haven't already:
```bash
npm install
```

**Link to your Supabase project** (get the project ref from your Supabase dashboard URL: `https://supabase.com/dashboard/project/<ref>`):
```bash
npx supabase link --project-ref <your-project-ref>
```

**Push the migration**:
```bash
npx supabase db push
```

This applies the `rankings` table and RLS policies to your hosted database.

To view the migration SQL before applying, see `supabase/migrations/`.

## 4. Configure OAuth Providers

### X (Twitter)

**Important**: Enable the **X / Twitter (OAuth 2.0)** provider, not the legacy Twitter (OAuth 1.0a) one.

1. Go to [developer.x.com](https://developer.x.com) → **Projects & Apps** → create an app
2. Set up **User Authentication Settings** with OAuth 2.0
3. Set **Callback URI / Redirect URL** to:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Turn ON **Request email from users**
5. Copy **Client ID** and **Client Secret** from the **Keys and tokens** section
6. In Supabase dashboard, go to **Authentication → Providers → X / Twitter (OAuth 2.0)**
7. Toggle **Enabled**, paste **Client ID** and **Client Secret**

### Discord

1. Go to [discord.com/developers](https://discord.com/developers) → **New Application**
2. Go to **OAuth2** settings
3. Add redirect URL:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. In Supabase dashboard, go to **Authentication → Providers → Discord**
5. Toggle **Enabled**, paste **Client ID** and **Client Secret**

### Site URL Configuration (critical for production)

In Supabase dashboard, go to **Authentication → URL Configuration**:

1. **Site URL** — Set to your production URL (e.g., `https://sssorter.pages.dev`).  
   If this is wrong (e.g., `http://localhost`), OAuth redirects go to the wrong origin.

2. **Redirect URLs** — Add `https://sssorter.pages.dev/**` (allow all paths under your domain).  
   Also add `http://localhost:5173/**` for local dev.

## 5. Deploy

The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY` for legacy keys) at build time via Vite's `import.meta.env`. Set these in your deployment platform:

- **Cloudflare Pages**: Dashboard → Settings → Environment Variables → Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These MUST be set before build — Vite inlines them at build time.
- **Vercel**: Dashboard → Settings → Environment Variables
- **Netlify**: Dashboard → Site Settings → Environment Variables

## 6. Test

1. Open the deployed app
2. Click "Sign in with X" or "Sign in with Discord"
3. Complete a bias sort — ranking should auto-save
4. Refresh the page — your ranking should persist
5. Come back next month and sort again — both months appear in the history browser
