CREATE TABLE rankings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month      TEXT NOT NULL CHECK (month ~ '^\d{4}-\d{2}$'),
  ranking    JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, month)
);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own"
  ON rankings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own"
  ON rankings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own"
  ON rankings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own"
  ON rankings FOR DELETE
  USING (auth.uid() = user_id);