import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Key dari file .env.local yang tadi kita buat
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Inisialisasi koneksi ke Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);