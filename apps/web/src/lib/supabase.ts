import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PracticeSession {
  id?: string;
  user_id?: string;
  profile: string;
  score: number;
  score_label: string;
  strongest_moment: string;
  gaps: { moment: string; issue: string; betterResponse: string }[];
  focus_area: string;
  message_count: number;
  created_at?: string;
}
