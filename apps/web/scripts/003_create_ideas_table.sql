-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL,
  category TEXT,
  tone TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS ideas_user_id_idx ON ideas(user_id);
CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON ideas(created_at DESC);

-- Enable RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "users_can_view_own_ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);
